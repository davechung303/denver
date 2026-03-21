import Anthropic from "@anthropic-ai/sdk";
import { supabase } from "./supabase";
import { VOICE_GUIDE } from "./voiceGuide";
import { expediaHotelUrl } from "./travelpayouts";
import { injectInternalLinks } from "./internalLinks";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

const FETCH_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml",
};

function stripHtml(html: string, maxChars = 4000): string {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, "")
    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, "")
    .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxChars);
}

function extractOgImage(html: string): string | null {
  const match =
    html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ??
    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
  return match?.[1] ?? null;
}

async function fetchHtml(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      headers: FETCH_HEADERS,
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) return "";
    return await res.text();
  } catch {
    return "";
  }
}

// Extract article links from a category page, filtered to the given domain
function extractArticleLinks(html: string, domain: string, maxAge = 14): string[] {
  const links: Set<string> = new Set();

  // Match all hrefs
  const hrefRegex = /href=["']([^"']+)["']/gi;
  let match;
  while ((match = hrefRegex.exec(html)) !== null) {
    const url = match[1];
    if (!url.includes(domain)) continue;
    // Must look like an article (has path depth > 1, not a category/tag page)
    try {
      const parsed = new URL(url.startsWith("http") ? url : `https://${domain}${url}`);
      const parts = parsed.pathname.split("/").filter(Boolean);
      if (parts.length < 2) continue;
      // Skip obvious non-articles
      if (["tag", "category", "author", "page", "search"].some(s => parts[0] === s)) continue;
      links.add(parsed.href);
    } catch {
      continue;
    }
  }

  // For Denver Post, prefer links with recent dates in the path (YYYY/MM/DD)
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - maxAge);
  const dated = [...links].filter(url => {
    const m = url.match(/\/(\d{4})\/(\d{2})\/(\d{2})\//);
    if (!m) return false;
    const d = new Date(`${m[1]}-${m[2]}-${m[3]}`);
    return d >= cutoff;
  });

  // Return dated links if available, otherwise first N undated links
  return (dated.length > 0 ? dated : [...links]).slice(0, 6);
}

// Fetch full text from a list of article URLs, in parallel
async function fetchArticleTexts(urls: string[]): Promise<string> {
  const results = await Promise.all(
    urls.map(async (url) => {
      const html = await fetchHtml(url);
      if (!html) return "";
      const text = stripHtml(html, 2000);
      return text ? `SOURCE: ${url}\n${text}` : "";
    })
  );
  return results.filter(Boolean).join("\n\n---\n\n");
}

// Brave Search fallback for paywalled or thin content
async function braveSearch(query: string, count = 6): Promise<string> {
  try {
    const encoded = encodeURIComponent(query);
    const res = await fetch(
      `https://api.search.brave.com/res/v1/web/search?q=${encoded}&count=${count}&freshness=pm`,
      {
        headers: {
          Accept: "application/json",
          "Accept-Encoding": "gzip",
          "X-Subscription-Token": process.env.BRAVE_SEARCH_API_KEY ?? "",
        },
        signal: AbortSignal.timeout(8000),
      }
    );
    if (!res.ok) return "";
    const data = await res.json();
    return (data.web?.results ?? [])
      .map((r: any) => `${r.title}: ${r.description} — ${r.url}`)
      .join("\n");
  } catch {
    return "";
  }
}

// Returns this Wednesday's date (or today if today is Wednesday)
export function getThisWednesday(): Date {
  const now = new Date();
  const day = now.getDay();
  const diff = day <= 3 ? 3 - day : 10 - day;
  const wednesday = new Date(now);
  wednesday.setDate(now.getDate() + diff);
  return wednesday;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export async function generateRestaurantPreview(): Promise<{ success: boolean; slug?: string; error?: string }> {
  const wednesday = getThisWednesday();
  const dateStr = wednesday.toISOString().split("T")[0];
  const slug = `denver-restaurant-openings-${dateStr}`;
  const title = `Denver Restaurants Opening Soon — ${formatDate(wednesday)}`;

  const { data: existing } = await supabase
    .from("articles")
    .select("slug")
    .eq("slug", slug)
    .single();

  if (existing) return { success: true, slug };

  // Step 1: fetch category pages to get article links
  const [westwordHtml, denverPostHtml] = await Promise.all([
    fetchHtml("https://www.westword.com/category/food-drink/restaurants/"),
    fetchHtml("https://www.denverpost.com/things-to-do/restaurants-food-drink/"),
  ]);

  const westwordLinks = extractArticleLinks(westwordHtml, "westword.com");
  const denverPostLinks = extractArticleLinks(denverPostHtml, "denverpost.com");

  // Step 2: fetch individual articles in parallel
  const [westwordContent, denverPostContent, braveResults] = await Promise.all([
    westwordLinks.length > 0
      ? fetchArticleTexts(westwordLinks)
      : Promise.resolve(""),
    denverPostLinks.length > 0
      ? fetchArticleTexts(denverPostLinks)
      : Promise.resolve(""),
    braveSearch(
      "Denver new restaurant opening soon 2026 site:westword.com OR site:denverpost.com OR site:denverite.com OR site:5280.com"
    ),
  ]);

  // Use a consistent Denver food/restaurant Unsplash hero — news og:images are logos
  const imageUrl = "https://images.unsplash.com/photo-r6BdUpN_iSk?auto=format&fit=crop&w=1600&q=80";
  const imageCredit = "Pieter van de Sande / Unsplash";
  const imageCreditUrl = "https://unsplash.com/photos/denver-street-artowrk-r6BdUpN_iSk";

  const prompt = `You are writing a weekly Denver restaurant preview column for DaveLovesDenver.com, published every Wednesday. Write it in the first person as Dave Chung — a Denver local.

${VOICE_GUIDE}

ADDITIONAL TONE FOR THIS COLUMN:
- This is a PREVIEW column — only write about restaurants that have NOT opened yet
- Focus on places that are "opening soon", "coming soon", "announced", "expected to open", "under construction"
- Do NOT write about restaurants that are already open, even if they opened recently
- Be specific: neighborhood, concept, who's behind it, expected opening timeframe
- If a timeline is vague, say so honestly — "sometime this spring" is fine if that's what the source says
- Link to the source articles using [text](url) markdown where you have real URLs

CURRENT DATE: ${formatDate(wednesday)}

=== SOURCE ARTICLES (read carefully — only use upcoming/announced restaurants) ===

WESTWORD RESTAURANT ARTICLES (past 2 weeks):
${westwordContent || "Content not available"}

DENVER POST RESTAURANT ARTICLES (past 2 weeks):
${denverPostContent || "Content not available"}

ADDITIONAL SEARCH RESULTS:
${braveResults || "Not available"}

=== WRITING INSTRUCTIONS ===

Write a 500–800 word column. Structure:

Opening paragraph (no header): 2-3 sentences — what's on Dave's radar this week, what the pipeline looks like. Conversational, like the start of a newsletter.

## [Restaurant Name]
(2-4 sentences per restaurant: concept, neighborhood, what makes it interesting, when to expect it. Link to the source article with [read more](url) at the end of the entry.)

Closing: 1-2 sentences — Dave's honest take on what he's most curious to try, or a note on the direction Denver's restaurant scene is heading.

RULES:
- Only include restaurants that are not yet open
- If you cannot find at least 2 clearly upcoming restaurants in the source material, respond with exactly: NO_CONTENT
- Never invent restaurant names, neighborhoods, or opening dates
- First person as Dave throughout
- Return ONLY the article text (or NO_CONTENT)`;

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
    });

    const content = message.content[0];
    if (content.type !== "text") return { success: false, error: "Unexpected response type" };

    const raw = content.text.trim();
    if (raw === "NO_CONTENT" || raw.startsWith("NO_CONTENT")) {
      return { success: true, slug: undefined, skipped: true } as any;
    }

    const articleText = await injectInternalLinks(raw);

    const placesData = imageUrl
      ? [{ photo_url: imageUrl, photo_credit: imageCredit, photo_credit_url: imageCreditUrl }]
      : [];

    const { error } = await supabase.from("articles").upsert(
      {
        video_id: null,
        slug,
        title,
        content: articleText,
        content_type: "weekly-guide",
        neighborhood_slug: null,
        category_slug: "restaurants",
        expedia_url: expediaHotelUrl("Denver Colorado"),
        places_mentioned: placesData,
        generated_at: wednesday.toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "slug" }
    );

    if (error) return { success: false, error: error.message };
    return { success: true, slug };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

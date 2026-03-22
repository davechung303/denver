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

// Use Brave Search to find recent restaurant opening articles from a specific domain
async function braveSearchDomain(domain: string, count = 6): Promise<{ title: string; description: string; url: string }[]> {
  try {
    const query = encodeURIComponent(`new restaurant opening Denver site:${domain}`);
    const res = await fetch(
      `https://api.search.brave.com/res/v1/web/search?q=${query}&count=${count}&freshness=pm`,
      {
        headers: {
          Accept: "application/json",
          "Accept-Encoding": "gzip",
          "X-Subscription-Token": process.env.BRAVE_SEARCH_API_KEY ?? "",
        },
        signal: AbortSignal.timeout(8000),
      }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.web?.results ?? []).map((r: any) => ({
      title: r.title ?? "",
      description: r.description ?? "",
      url: r.url ?? "",
    }));
  } catch {
    return [];
  }
}

// Fetch full text from a list of article URLs in parallel
async function fetchArticleTexts(urls: string[]): Promise<string> {
  const results = await Promise.all(
    urls.map(async (url) => {
      const html = await fetchHtml(url);
      if (!html) return "";
      const text = stripHtml(html, 2500);
      return text ? `SOURCE: ${url}\n${text}` : "";
    })
  );
  return results.filter(Boolean).join("\n\n---\n\n");
}

// Format Brave Search results as readable text with source URLs
function formatBraveResults(results: { title: string; description: string; url: string }[]): string {
  return results.map(r => `SOURCE: ${r.url}\n${r.title}\n${r.description}`).join("\n\n---\n\n");
}

// Fetch Dave's videos that are relevant to food or neighborhoods — for natural in-article linking
async function fetchRelevantVideos(): Promise<string> {
  const { data } = await supabase
    .from("youtube_videos")
    .select("video_id, title, description")
    .or("title.ilike.%restaurant%,title.ilike.%food%,title.ilike.%rino%,title.ilike.%lodo%,title.ilike.%capitol hill%,title.ilike.%highlands%,title.ilike.%cherry creek%,title.ilike.%colfax%,title.ilike.%denver%")
    .order("view_count", { ascending: false })
    .limit(30);

  if (!data || data.length === 0) return "";

  return data
    .map((v) => `- [${v.title}](https://davelovesdenver.com/videos/${v.video_id}) — ${(v.description ?? "").slice(0, 100)}`)
    .join("\n");
}

// Returns today's date — cron runs on Saturdays so it's always Saturday in production;
// when triggered manually we just use the current date
export function getThisSaturday(): Date {
  return new Date();
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export async function generateRestaurantPreview(): Promise<{ success: boolean; slug?: string; error?: string }> {
  const saturday = getThisSaturday();
  const dateStr = saturday.toISOString().split("T")[0];
  const formattedSlugDate = saturday.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }).toLowerCase().replace(/,/g, "").replace(/\s+/g, "-");
  const slug = `new-denver-restaurant-openings-${formattedSlugDate}-${dateStr}`;
  const title = `New Restaurants Opening in Denver This Week — ${formatDate(saturday)}`;

  const { data: existing } = await supabase
    .from("articles")
    .select("slug")
    .eq("slug", slug)
    .single();

  if (existing) return { success: true, slug };

  // Use Brave Search to discover recent articles (bypasses JS rendering on tag pages)
  // then attempt to fetch full article text from the URLs returned
  const [denverPostResults, westwordResults, videosText] = await Promise.all([
    braveSearchDomain("denverpost.com", 6),
    braveSearchDomain("westword.com", 6),
    fetchRelevantVideos(),
  ]);

  // Try to fetch full article text; fall back to Brave snippet if fetch fails
  const [denverPostFull, westwordFull] = await Promise.all([
    fetchArticleTexts(denverPostResults.map(r => r.url)),
    fetchArticleTexts(westwordResults.map(r => r.url)),
  ]);

  // Use full text if we got real content, otherwise use Brave snippets
  const denverPostContent = denverPostFull.length > 500 ? denverPostFull : formatBraveResults(denverPostResults);
  const westwordContent = westwordFull.length > 500 ? westwordFull : formatBraveResults(westwordResults);

  const imageUrl = "https://images.unsplash.com/photo-1573297627466-6bed413a43f1?auto=format&fit=crop&w=1600&q=80";

  const prompt = `You are writing a weekly Denver restaurant openings column for DaveLovesDenver.com, published every Saturday. Write it in the first person as Dave Chung — a Denver local and YouTube creator with over 2 million views.

${VOICE_GUIDE}

CURRENT DATE: ${formatDate(saturday)}

=== SOURCE ARTICLES (read every word — these are the only source of truth) ===

DENVER POST:
${denverPostContent || "Content not available"}

WESTWORD:
${westwordContent || "Content not available"}

=== STEP 1: EXTRACT ALL OPENINGS (do this before writing) ===

Read both sources in full. Build a complete list of every restaurant or bar that has opened or is opening imminently this week — combining both sources, deduplicating if the same place appears in both. For each entry note: exact name, street address (if mentioned), neighborhood, concept/cuisine, and source URL.

Openings only. Skip any closings entirely.

=== STEP 2: WRITE THE ARTICLE ===

Opening paragraph (no header): 1-2 sentences on the week's opening activity.

For each restaurant, use this exact format:

## [Exact Restaurant Name] — [Neighborhood]

**Address:** [Street address, City] *(omit this line entirely if address not in source)*

[2-3 sentences: concept, what makes it interesting, opening date or status. End with the source link: [Denver Post](url) or [Westword](url).]

If Dave has a video that naturally fits — same neighborhood or same cuisine — weave a link into the paragraph prose. 2-3 video links max across the whole article, only where genuinely natural.

## Worth Keeping an Eye On

*Only include this section if there are announced openings that are NOT yet open this week — skip the section entirely if everything is already open.*

Brief mention of 1-2 upcoming spots worth watching, with source link.

Closing paragraph (no header): 1-2 sentences — which opening Dave is most curious about.

=== DAVE'S YOUTUBE VIDEOS ===

${videosText || "No videos available"}

RULES:
- Every opening from both sources must appear — comprehensiveness is the goal
- Use restaurant names and addresses exactly as written in the sources — never guess or invent
- If address is not in the source, omit the Address line entirely
- Do not invent any details not in the source material
- If fewer than 2 confirmed openings exist across both sources, respond with exactly: NO_CONTENT
- First person as Dave throughout
- Return ONLY the article text (or NO_CONTENT)`;

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2500,
      messages: [{ role: "user", content: prompt }],
    });

    const content = message.content[0];
    if (content.type !== "text") return { success: false, error: "Unexpected response type" };

    const raw = content.text.trim();
    if (raw === "NO_CONTENT" || raw.startsWith("NO_CONTENT")) {
      return { success: true, slug: undefined, skipped: true } as any;
    }

    const articleText = await injectInternalLinks(raw);

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
        places_mentioned: [{ photo_url: imageUrl }],
        generated_at: saturday.toISOString(),
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

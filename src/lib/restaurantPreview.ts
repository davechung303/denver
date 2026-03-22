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

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ")
    .replace(/&#8217;/g, "'").replace(/&#8216;/g, "'").replace(/&#8220;/g, '"').replace(/&#8221;/g, '"');
}

// Extract the structured Openings list from a Westword weekly roundup article
// Westword uses <h2 id="h-openings">Openings</h2> followed by a <p> with <br /> separated entries
function extractWestwordOpenings(html: string, sourceUrl: string): string {
  const openingsMatch = html.match(/<h2[^>]*id=["']h-openings["'][^>]*>[\s\S]*?<\/h2>\s*<p>([\s\S]*?)<\/p>/i);
  if (!openingsMatch) return "";

  const raw = openingsMatch[1]
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .trim();

  const entries = decodeHtmlEntities(raw)
    .split("\n")
    .map(l => l.trim())
    .filter(Boolean);

  if (entries.length === 0) return "";

  return `WESTWORD OPENINGS LIST (SOURCE: ${sourceUrl})\n${entries.join("\n")}`;
}

// Strip HTML for general article text
function stripHtml(html: string, maxChars = 3000): string {
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

// Brave Search — single combined query
async function braveSearch(query: string, count = 8): Promise<Array<{ title: string; description: string; url: string }>> {
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
      const text = stripHtml(html, 3000);
      return text ? `SOURCE: ${url}\n${text}` : "";
    })
  );
  return results.filter(Boolean).join("\n\n---\n\n");
}

// Fetch Dave's videos relevant to food and neighborhoods for natural linking
async function fetchRelevantVideos(): Promise<string> {
  const { data } = await supabase
    .from("youtube_videos")
    .select("video_id, title, description")
    .or("title.ilike.%restaurant%,title.ilike.%food%,title.ilike.%rino%,title.ilike.%lodo%,title.ilike.%capitol hill%,title.ilike.%highlands%,title.ilike.%cherry creek%,title.ilike.%colfax%,title.ilike.%denver%")
    .order("view_count", { ascending: false })
    .limit(30);

  if (!data || data.length === 0) return "";
  return data
    .map((v) => `- [${v.title}](https://www.youtube.com/watch?v=${v.video_id}) — ${(v.description ?? "").slice(0, 100)}`)
    .join("\n");
}

// Returns today's date — cron runs on Saturdays so it's always Saturday in production
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

  // Step 1: Find this week's Westword weekly roundup + Denver Post individual articles via Brave Search
  const [westwordResults, denverPostResults, videosText] = await Promise.all([
    braveSearch("site:westword.com Denver restaurants opened this week openings", 5),
    braveSearch("site:denverpost.com new restaurant opening Denver 2026", 6),
    fetchRelevantVideos(),
  ]);

  // Step 2: Pick the most recent Westword weekly roundup — sort by numeric article ID (higher = newer)
  const westwordRoundupUrl = westwordResults
    .filter(r => r.url.includes("westword.com") &&
      (r.title.toLowerCase().includes("opening") || r.title.toLowerCase().includes("debuted") || r.title.toLowerCase().includes("this week") || r.title.toLowerCase().includes("debut")))
    .sort((a, b) => {
      const idA = parseInt(a.url.match(/(\d{8,})/)?.[1] ?? "0");
      const idB = parseInt(b.url.match(/(\d{8,})/)?.[1] ?? "0");
      return idB - idA; // highest ID = most recent
    })[0]?.url ?? westwordResults.sort((a, b) => {
      const idA = parseInt(a.url.match(/(\d{8,})/)?.[1] ?? "0");
      const idB = parseInt(b.url.match(/(\d{8,})/)?.[1] ?? "0");
      return idB - idA;
    })[0]?.url ?? "";

  const denverPostUrls = denverPostResults.map(r => r.url).slice(0, 5);

  const [westwordHtml, denverPostContent] = await Promise.all([
    westwordRoundupUrl ? fetchHtml(westwordRoundupUrl) : Promise.resolve(""),
    fetchArticleTexts(denverPostUrls),
  ]);

  // Extract Westword's structured openings list (name + address per line)
  const westwordOpeningsList = westwordHtml
    ? extractWestwordOpenings(westwordHtml, westwordRoundupUrl)
    : "";

  // Fall back to Brave snippets if structured extraction failed
  const westwordFallback = !westwordOpeningsList
    ? westwordResults.map(r => `${r.title}: ${r.description} — ${r.url}`).join("\n")
    : "";

  const denverPostFallback = denverPostContent.length < 200
    ? denverPostResults.map(r => `${r.title}: ${r.description} — ${r.url}`).join("\n")
    : "";

  console.log(`[restaurantPreview] Westword openings list: ${westwordOpeningsList.length} chars, DP content: ${denverPostContent.length} chars`);

  const imageUrl = "https://images.unsplash.com/photo-1573297627466-6bed413a43f1?auto=format&fit=crop&w=1600&q=80";

  const prompt = `You are writing a weekly Denver restaurant openings column for DaveLovesDenver.com, published every Saturday. Write it in the first person as Dave Chung — a Denver local and YouTube creator with over 2 million YouTube views.

${VOICE_GUIDE}

CURRENT DATE: ${formatDate(saturday)}

=== WESTWORD STRUCTURED OPENINGS LIST (most reliable — use this as the definitive opening list) ===

${westwordOpeningsList || westwordFallback || "Not available"}

=== DENVER POST ARTICLES (use for additional detail, context, and quotes about each opening) ===

${denverPostContent || denverPostFallback || "Not available"}

=== WRITING INSTRUCTIONS ===

The Westword openings list above is your definitive source for WHICH restaurants opened and their addresses. The Denver Post articles provide additional detail (concept, owners, what to order, atmosphere). Combine both to write the most comprehensive and informative entry for each restaurant.

Opening paragraph (no header): 1-2 sentences on the week's opening activity — how many spots, anything notable about the mix.

For each restaurant, use this exact format:

## [Exact Restaurant Name] — [Neighborhood]

**Address:** [Street address, City] *(omit this line if address not available)*

[2-3 sentences: concept, what makes it worth visiting, opening date. Link to source: [Westword](url) or [Denver Post](url). If Dave has a video that naturally fits the neighborhood or cuisine, weave a link into the prose — e.g. "I've filmed a lot in [Cherry Creek](url) and this fits right in with what's happening there."]

## Worth Keeping an Eye On

*Only include if there are announced-but-not-yet-open spots from the sources — skip section entirely if everything is already open.*

Closing paragraph (no header): 1 sentence — which opening Dave is most curious about.

=== DAVE'S YOUTUBE VIDEOS (for natural linking — 2-3 max, only where genuinely relevant) ===

${videosText || "No videos available"}

RULES:
- The Westword openings list is the ground truth — include every restaurant on it
- Use names and addresses exactly as they appear — never alter or guess
- Openings only — skip any closings entirely
- Do not invent any detail not in the source material
- If no openings can be identified at all, respond with exactly: NO_CONTENT
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
      return { success: true, slug: undefined, skipped: true, debug: { westwordListLen: westwordOpeningsList.length, dpContentLen: denverPostContent.length, westwordUrl: westwordRoundupUrl } } as any;
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

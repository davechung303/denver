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

// Extract article links from a tag page
function extractArticleLinks(html: string, domain: string, maxLinks = 8): string[] {
  const links: Set<string> = new Set();
  const hrefRegex = /href=["']([^"']+)["']/gi;
  let match;
  while ((match = hrefRegex.exec(html)) !== null) {
    const url = match[1];
    if (!url.includes(domain)) continue;
    try {
      const parsed = new URL(url.startsWith("http") ? url : `https://${domain}${url}`);
      const parts = parsed.pathname.split("/").filter(Boolean);
      if (parts.length < 2) continue;
      if (["tag", "category", "author", "page", "search"].some(s => parts[0] === s)) continue;
      links.add(parsed.href);
    } catch {
      continue;
    }
  }
  return [...links].slice(0, maxLinks);
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

// Returns this Saturday's date (or today if today is Saturday)
export function getThisSaturday(): Date {
  const now = new Date();
  const day = now.getDay(); // 0=Sun, 6=Sat
  const diff = 6 - day;
  const saturday = new Date(now);
  saturday.setDate(now.getDate() + (diff < 0 ? 7 + diff : diff));
  return saturday;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export async function generateRestaurantPreview(): Promise<{ success: boolean; slug?: string; error?: string }> {
  const saturday = getThisSaturday();
  const dateStr = saturday.toISOString().split("T")[0];
  const slug = `denver-restaurant-openings-${dateStr}`;
  const title = `Denver Restaurant Openings This Week — ${formatDate(saturday)}`;

  const { data: existing } = await supabase
    .from("articles")
    .select("slug")
    .eq("slug", slug)
    .single();

  if (existing) return { success: true, slug };

  // Fetch tag pages to get article links, and Dave's videos, in parallel
  const [denverPostHtml, westwordHtml, videosText] = await Promise.all([
    fetchHtml("https://www.denverpost.com/tag/restaurant-opening-and-closing/"),
    fetchHtml("https://www.westword.com/tag/openings-closings/"),
    fetchRelevantVideos(),
  ]);

  const denverPostLinks = extractArticleLinks(denverPostHtml, "denverpost.com", 6);
  const westwordLinks = extractArticleLinks(westwordHtml, "westword.com", 6);

  // Fetch full article content from both sources in parallel
  const [denverPostContent, westwordContent] = await Promise.all([
    denverPostLinks.length > 0 ? fetchArticleTexts(denverPostLinks) : Promise.resolve(""),
    westwordLinks.length > 0 ? fetchArticleTexts(westwordLinks) : Promise.resolve(""),
  ]);

  const imageUrl = "https://images.unsplash.com/photo-1573297627466-6bed413a43f1?auto=format&fit=crop&w=1600&q=80";

  const prompt = `You are writing a weekly Denver restaurant openings column for DaveLovesDenver.com, published every Saturday. Write it in the first person as Dave Chung — a Denver local and YouTube creator with over 2 million views.

${VOICE_GUIDE}

CURRENT DATE: ${formatDate(saturday)}

COLUMN FOCUS: New restaurant and bar openings in the Denver metro area this week. Openings only — do not include closings even if they appear in the source material.

=== SOURCE ARTICLES (read the full text carefully — these are the primary source of truth) ===

DENVER POST (restaurant openings):
${denverPostContent || "Content not available"}

WESTWORD (openings & closings):
${westwordContent || "Content not available"}

=== DAVE'S YOUTUBE VIDEOS (link 2-3 that naturally fit) ===

When a new restaurant is in a neighborhood Dave has covered, or is a cuisine/food type Dave has a video about, link to that video naturally in the prose — not as a list, just woven in. Use the markdown link format provided.

${videosText || "No videos available"}

=== WRITING INSTRUCTIONS ===

Write a 400–700 word column covering what opened (or is opening imminently) in Denver this week.

Opening paragraph (no header): 1-2 sentences on what kind of week it was for new spots.

## [Restaurant Name]
2-3 sentences per opening: concept, neighborhood, what makes it worth knowing about. Link to the Denver Post or Westword source with [read more](url) at the end of each entry. Where relevant, naturally weave in a link to one of Dave's videos — e.g. "If you haven't been to RiNo before, [here's my neighborhood guide](url)."

Closing: 1 sentence — which opening Dave is most curious to check out.

RULES:
- Openings only — skip any closings in the source material
- Use restaurant names and neighborhoods exactly as they appear in the sources
- Only link to Dave's videos where the connection is genuinely natural — 2-3 max, never forced
- Do not invent details not in the source material
- If you cannot find at least 2 confirmed openings this week, respond with exactly: NO_CONTENT
- First person as Dave throughout
- Return ONLY the article text (or NO_CONTENT)`;

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1500,
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

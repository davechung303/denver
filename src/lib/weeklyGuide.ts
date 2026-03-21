import Anthropic from "@anthropic-ai/sdk";
import { supabase } from "./supabase";
import { VOICE_GUIDE } from "./voiceGuide";
import { expediaHotelUrl } from "./travelpayouts";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

// Strip HTML tags and decode common entities
function stripHtml(html: string, maxChars = 4000): string {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, "")
    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, "")
    .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxChars);
}

// Extract og:image from HTML
function extractOgImage(html: string): string | null {
  const match = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
    ?? html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
  return match?.[1] ?? null;
}

// Fetch a page and return its text content and og:image
async function fetchSource(url: string, maxChars = 4000): Promise<{ text: string; imageUrl: string | null; imageSourceUrl: string }> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return { text: "", imageUrl: null, imageSourceUrl: url };
    const html = await res.text();
    return {
      text: stripHtml(html, maxChars),
      imageUrl: extractOgImage(html),
      imageSourceUrl: url,
    };
  } catch {
    return { text: "", imageUrl: null, imageSourceUrl: url };
  }
}

// Fetch Reddit user posts as plain text
async function fetchReddit(): Promise<string> {
  try {
    const res = await fetch(
      "https://www.reddit.com/user/0_----__----_0/.json?limit=10&sort=new",
      {
        headers: { "User-Agent": "DaveLovesDenver/1.0" },
        signal: AbortSignal.timeout(8000),
      }
    );
    if (!res.ok) return "";
    const data = await res.json();
    const posts = data.data?.children ?? [];
    return posts
      .map((p: any) => {
        const d = p.data;
        const body = (d.selftext ?? "").slice(0, 1000);
        return `POST: ${d.title}\nURL: https://reddit.com${d.permalink}\n${body}`;
      })
      .join("\n\n---\n\n")
      .slice(0, 4000);
  } catch {
    return "";
  }
}

// Use Brave Search for JS-rendered or paywalled sources
async function braveSearch(query: string, count = 5): Promise<string> {
  try {
    const encoded = encodeURIComponent(query);
    const res = await fetch(
      `https://api.search.brave.com/res/v1/web/search?q=${encoded}&count=${count}&freshness=pw`,
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

// Returns this Friday's date (or today if today is Friday)
export function getThisFriday(): Date {
  const now = new Date();
  const day = now.getDay(); // 0=Sun, 5=Fri
  const diff = day <= 5 ? 5 - day : 6; // days until Friday
  const friday = new Date(now);
  friday.setDate(now.getDate() + diff);
  return friday;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function formatShortDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric" });
}

export async function generateWeeklyGuide(): Promise<{ success: boolean; slug?: string; error?: string }> {
  const friday = getThisFriday();
  const sunday = new Date(friday);
  sunday.setDate(friday.getDate() + 2);

  const fridayStr = friday.toISOString().split("T")[0]; // e.g. 2026-03-20
  const slug = `denver-weekend-guide-${fridayStr}`;
  const title = `Denver Weekend Guide: ${formatShortDate(friday)}–${formatShortDate(sunday)}`;

  // Check if already generated this week
  const { data: existing } = await supabase
    .from("articles")
    .select("slug")
    .eq("slug", slug)
    .single();

  if (existing) return { success: true, slug };

  // Fetch all sources in parallel
  const [westword, denverite, kidsOut, reddit, seatgeekResults] = await Promise.all([
    fetchSource("https://www.westword.com/things-to-do/", 4000),
    fetchSource("https://denverite.com/category/entertainment/things-to-do-in-denver/", 3000),
    fetchSource("https://denver.kidsoutandabout.com/content/things-do-weekend-and-around-denver", 3000),
    fetchReddit(),
    braveSearch(`Denver events this weekend ${formatShortDate(friday)} site:seatgeek.com OR site:axs.com OR site:ticketmaster.com`, 8),
  ]);

  // Pick best image source (prefer Westword, then Denverite)
  let imageUrl: string | null = null;
  let imageCredit = "";
  let imageCreditUrl = "";

  if (westword.imageUrl) {
    imageUrl = westword.imageUrl;
    imageCredit = "Westword";
    imageCreditUrl = "https://www.westword.com/things-to-do/";
  } else if (denverite.imageUrl) {
    imageUrl = denverite.imageUrl;
    imageCredit = "Denverite";
    imageCreditUrl = "https://denverite.com/category/entertainment/things-to-do-in-denver/";
  }

  const weekendStr = `${formatShortDate(friday)}–${formatDate(sunday)}`;

  const prompt = `You are writing a weekly Denver weekend guide for DaveLovesDenver.com, published every Friday. Write it in the first person as Dave Chung — a Denver local.

${VOICE_GUIDE}

ADDITIONAL TONE FOR WEEKLY GUIDES:
- Open with a short, personal take on the weekend — what Dave is actually excited about or paying attention to
- The guide should feel like a text from a well-connected local friend who actually checks what's going on
- Be selective: don't list everything. Highlight what's genuinely worth your time
- Include specific dates, prices where known, and links using [event name](url) format
- For bigger concerts/sports, mention ticket prices or that tickets are available
- Mix big events (major concerts, sports, festivals) with local stuff (gallery openings, neighborhood events, farmers markets)
- A "Dave's Pick" moment once in the guide — one thing Dave would personally go to

WEEKEND: ${weekendStr}

=== SOURCE MATERIAL ===

WESTWORD (things to do):
${westword.text || "Not available"}

DENVERITE (things to do):
${denverite.text || "Not available"}

KIDS OUT & ABOUT (family events):
${kidsOut.text || "Not available"}

REDDIT (Denver events community posts):
${reddit || "Not available"}

CONCERTS & TICKETED EVENTS (from SeatGeek/Ticketmaster/AXS):
${seatgeekResults || "Not available"}

=== ARTICLE STRUCTURE ===

Write a 900–1,200 word weekend guide. Use these section headers (## ):

## The Weekend Ahead
(2-3 sentence personal opener — what stands out about this specific weekend)

## Big Shows & Sports
(major concerts, games, ticketed events — 3-5 picks with dates, venues, ticket links where available)

## Arts & Culture
(gallery openings, theater, film, cultural events — 2-4 picks)

## Get Outside
(outdoor events, markets, walks, seasonal stuff — 2-3 picks)

## For Families
(kid-friendly events from the kids source — 2-3 picks)

## Dave's Pick
(1 specific thing Dave would personally go to this weekend, and why — be specific and honest)

RULES:
- Use [event name](url) for links whenever you have a real URL from the sources
- Include dates (Friday, Saturday, Sunday) for each event
- Mention specific venues and neighborhoods
- If something costs money, mention it briefly
- Do not invent events or URLs — only use information from the source material
- First person as Dave throughout
- Return ONLY the article text, no preamble`;

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2500,
      messages: [{ role: "user", content: prompt }],
    });

    const content = message.content[0];
    if (content.type !== "text") return { success: false, error: "Unexpected response type" };

    const articleText = content.text.trim();

    const placesData = imageUrl
      ? [{ photo_url: imageUrl, photo_credit: imageCredit, photo_credit_url: imageCreditUrl }]
      : [];

    const { error } = await supabase.from("articles").upsert({
      video_id: null,
      slug,
      title,
      content: articleText,
      content_type: "weekly-guide",
      neighborhood_slug: null,
      category_slug: "things-to-do",
      expedia_url: expediaHotelUrl("Denver Colorado"),
      places_mentioned: placesData,
      generated_at: friday.toISOString(),
      updated_at: new Date().toISOString(),
    }, { onConflict: "slug" });

    if (error) return { success: false, error: error.message };
    return { success: true, slug };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

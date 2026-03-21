import Anthropic from "@anthropic-ai/sdk";
import { supabase } from "./supabase";
import { VOICE_GUIDE } from "./voiceGuide";
import { expediaHotelUrl } from "./travelpayouts";
import { injectInternalLinks } from "./internalLinks";

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

// Fetch this weekend's ticketed events from Supabase (already synced from Ticketmaster)
async function fetchWeekendEvents(friday: Date, sunday: Date): Promise<string> {
  const start = new Date(friday);
  start.setHours(0, 0, 0, 0);
  const end = new Date(sunday);
  end.setHours(23, 59, 59, 999);

  const { data } = await supabase
    .from("events")
    .select("name, start_time, venue_name, venue_address, url, is_free, description")
    .gte("start_time", start.toISOString())
    .lte("start_time", end.toISOString())
    .order("start_time", { ascending: true })
    .limit(40);

  if (!data || data.length === 0) return "";

  return data
    .map((e: any) => {
      const date = new Date(e.start_time).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
      const time = new Date(e.start_time).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
      const free = e.is_free ? " (Free)" : "";
      const venue = e.venue_name ? ` @ ${e.venue_name}` : "";
      return `${e.name}${venue} — ${date} ${time}${free} — ${e.url}`;
    })
    .join("\n");
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
  const [westword, denverite, kidsOut, reddit, ticketmasterEvents] = await Promise.all([
    fetchSource("https://www.westword.com/things-to-do/", 4000),
    fetchSource("https://denverite.com/category/entertainment/things-to-do-in-denver/", 3000),
    fetchSource("https://denver.kidsoutandabout.com/content/things-do-weekend-and-around-denver", 3000),
    fetchReddit(),
    fetchWeekendEvents(friday, sunday),
  ]);

  // Use a consistent Denver hero image — news site og:images are logos, not photos
  const imageUrl = "https://images.unsplash.com/photo-OVE2SA0TVJE?auto=format&fit=crop&w=1600&q=80";
  const imageCredit = "Nils Huenerfuerst / Unsplash";
  const imageCreditUrl = "https://unsplash.com/photos/the-sun-is-setting-over-a-large-city-OVE2SA0TVJE";

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

CONCERTS & TICKETED EVENTS (from Ticketmaster — includes venue, date/time, ticket URL):
${ticketmasterEvents || "Not available"}

=== ARTICLE STRUCTURE ===

Write a 900–1,200 word weekend guide. Use these section headers (## and ###):

## The Weekend Ahead — ${formatShortDate(friday)}–${formatShortDate(sunday)}
(2-3 sentence personal opener — what stands out about this specific weekend)

## Big Shows & Sports
Group events under day subheaders (### Friday, March X / ### Saturday, March X / ### Sunday, March X).
Under each day, list events as bullets:
- **[Event Name](url)** | Time | Venue | Price or "tickets available"

## Arts & Culture
Same day-grouped format with bullets:
- **[Event Name](url)** | Time | Venue | brief note if relevant

## Get Outside
Same format — outdoor events, markets, walks, seasonal stuff (2-3 picks total, day-grouped)

## For Families
Same format — kid-friendly picks (2-3 total, day-grouped)

## Dave's Pick
(1 specific thing Dave would personally go to this weekend, and why — write this as prose, be specific and honest)

RULES:
- Use [Event Name](url) markdown links whenever you have a real URL from the sources
- Always include day + date + time for each event
- Always include venue name
- If something costs money, include the price or "tickets available" briefly
- Group events under the day they occur — do not mix days in one bullet list
- Do not invent events or URLs — only use information from the source material
- First person as Dave throughout (except in the bullet lists, which are factual)
- Return ONLY the article text, no preamble`;

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2500,
      messages: [{ role: "user", content: prompt }],
    });

    const content = message.content[0];
    if (content.type !== "text") return { success: false, error: "Unexpected response type" };

    const articleText = await injectInternalLinks(content.text.trim());

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

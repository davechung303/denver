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

// Brave Search for date-specific Denver events
async function searchDenverEvents(friday: Date, saturday: Date, sunday: Date): Promise<string> {
  const key = process.env.BRAVE_SEARCH_API_KEY ?? "";
  if (!key) return "";

  const dates = [
    friday.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
    saturday.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
    sunday.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
  ];
  const query = `Denver events things to do ${dates[0]} OR ${dates[1]} OR ${dates[2]}`;

  try {
    const res = await fetch(
      `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=8`,
      {
        headers: {
          Accept: "application/json",
          "Accept-Encoding": "gzip",
          "X-Subscription-Token": key,
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

export async function generateWeeklyGuide(overrideFriday?: Date): Promise<{ success: boolean; slug?: string; error?: string }> {
  const friday = overrideFriday ?? getThisFriday();
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

  const saturday = new Date(friday);
  saturday.setDate(friday.getDate() + 1);

  // Fetch all sources in parallel
  // westwordFree: permanent URL Westword updates every week with that week's free events
  // visitDenver: Visit Denver's weekly events roundup
  const [westword, westwordFree, visitDenver, denverite, kidsOut, reddit, ticketmasterEvents, braveResults] = await Promise.all([
    fetchSource("https://www.westword.com/things-to-do/", 4000),
    fetchSource("https://www.westword.com/arts-culture/free-things-to-do-in-denver-20764019/", 5000),
    fetchSource("https://visitdenver.com/blog/post/denver-events-this-weekend/", 5000),
    fetchSource("https://denverite.com/category/entertainment/things-to-do-in-denver/", 3000),
    fetchSource("https://denver.kidsoutandabout.com/content/things-do-weekend-and-around-denver", 3000),
    fetchReddit(),
    fetchWeekendEvents(friday, sunday),
    searchDenverEvents(friday, saturday, sunday),
  ]);

  // Use a consistent Denver hero image — news site og:images are logos, not photos
  const imageUrl = "https://images.unsplash.com/photo-1709689702529-6fa1f343e108?auto=format&fit=crop&w=1600&q=80";
  const imageCredit = "Nils Huenerfuerst / Unsplash";
  const imageCreditUrl = "https://unsplash.com/photos/the-sun-is-setting-over-a-large-city-OVE2SA0TVJE";

  const weekendStr = `${formatShortDate(friday)}–${formatDate(sunday)}`;
  const fridayLabel = `Friday, ${formatShortDate(friday)}`;
  const saturdayLabel = `Saturday, ${formatShortDate(saturday)}`;
  const sundayLabel = `Sunday, ${formatShortDate(sunday)}`;

  const prompt = `You are writing a weekly Denver weekend guide for DaveLovesDenver.com, published every Friday. Write it in the first person as Dave Chung — a Denver local.

THIS WEEKEND'S EXACT DATES (these are the ONLY valid dates):
- ${fridayLabel}
- ${saturdayLabel}
- ${sundayLabel}

=== STEP 1: EXTRACT CONFIRMED EVENTS (do this silently before writing) ===

Read all source material below. For each event, ask:
1. Is there a specific date mentioned? Does it match one of the three dates above?
2. Is there a specific time mentioned? What is it exactly?
3. Is there a specific venue/location mentioned? What is it?

ONLY keep events that pass all three tests: confirmed date matching this weekend, a time, and a named venue.
The Ticketmaster section has fully structured date/time/venue data — trust it completely.
For Westword/Denverite/other text sources: only include an event if its date is explicitly stated and matches. If the date is vague ("this weekend", "ongoing") or missing, skip it unless it's a recurring known event (like a farmers market) with a confirmed weekend schedule.

=== SOURCE MATERIAL ===

CONCERTS & TICKETED EVENTS — fully structured, trust these dates/times completely:
${ticketmasterEvents || "None available"}

WESTWORD — Things To Do (general):
${westword.text || "Not available"}

WESTWORD — Free Things To Do This Week (updated weekly — high value, include everything that matches this weekend):
${westwordFree.text || "Not available"}

VISIT DENVER — Events This Weekend (updated weekly):
${visitDenver.text || "Not available"}

DENVERITE (things to do):
${denverite.text || "Not available"}

KIDS OUT & ABOUT (family/kid events):
${kidsOut.text || "Not available"}

BRAVE SEARCH (date-specific event results):
${braveResults || "Not available"}

REDDIT (Denver community posts):
${reddit || "Not available"}

=== STEP 2: WRITE THE ARTICLE ===

Now write the weekend guide using ONLY the confirmed events from Step 1.

${VOICE_GUIDE}

TONE FOR WEEKLY GUIDES:
- Open with a short, personal take on what stands out about this specific weekend
- Feel like a text from a well-connected local friend who actually checks what's going on
- Be selective — highlight what's genuinely worth your time
- Mix big events (concerts, sports) with local stuff (gallery openings, markets, neighborhood events)
- One "Dave's Pick" — a single thing Dave would personally go to, written as prose

STRUCTURE (use these exact headers and day labels):

## The Weekend Ahead — ${formatShortDate(friday)}–${formatShortDate(sunday)}
(2-3 sentence personal opener)

## Big Shows & Sports
### ${fridayLabel}
### ${saturdayLabel}
### ${sundayLabel}
(bullets under each day: - **[Event Name](url)** | Time | Venue | Price or "tickets available")
(omit a day subheader entirely if no confirmed events fall on that day)

## Arts & Culture
(same day-grouped bullet format)

## Get Outside
(same format — 2-3 picks)

## For Families
(same format — 2-3 picks)

## Dave's Pick
(prose — one specific thing Dave would go to and why)

RULES:
- Only include events confirmed from source material with a specific date, time, and venue
- If time is unknown, write "time TBD" — never invent a time
- If venue is unknown, omit the event rather than guess
- Use [Event Name](url) links when a real URL exists in the sources
- Do not invent events, times, venues, or URLs
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

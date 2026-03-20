import Anthropic from "@anthropic-ai/sdk";
import { supabase } from "./supabase";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const WESTWORD_URL = "https://www.westword.com/tag/openings-closings/";
const DENVER_POST_URL = "https://www.denverpost.com/tag/restaurant-opening-and-closing/";
const PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY!;

interface ArticleSnippet {
  title: string;
  url: string;
  description: string;
  source: string;
  date: string;
}

export interface WeeklyPhoto {
  url: string;
  credit: string;
  creditUrl: string;
}

function generateSlug(title: string): string {
  const date = new Date().toISOString().split("T")[0];
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
  return `${base}-${date}`;
}

function extractArticles(html: string, source: string): ArticleSnippet[] {
  const articles: ArticleSnippet[] = [];
  const linkRegex = /<h2[^>]*>[\s\S]*?<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>[\s\S]*?<\/h2>/gi;
  const dateRegex = /(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}/i;
  const descRegex = /<p[^>]*>([\s\S]*?)<\/p>/i;

  let match;
  while ((match = linkRegex.exec(html)) !== null && articles.length < 8) {
    const url = match[1];
    const title = match[2].replace(/<[^>]+>/g, "").trim();
    if (!title || title.length < 10) continue;
    if (!url.includes(source === "Westword" ? "westword.com" : "denverpost.com")) continue;

    const surrounding = html.slice(match.index, match.index + 500);
    const dateMatch = surrounding.match(dateRegex);
    const descMatch = surrounding.match(descRegex);

    articles.push({
      title,
      url,
      description: descMatch ? descMatch[1].replace(/<[^>]+>/g, "").trim() : "",
      source,
      date: dateMatch ? dateMatch[0] : "",
    });
  }
  return articles;
}

async function fetchPageHtml(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; DaveLovesDenver/1.0)",
        "Accept": "text/html",
      },
    });
    if (!res.ok) return "";
    return await res.text();
  } catch {
    return "";
  }
}

function cleanHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/\s{2,}/g, " ")
    .trim();
}

function extractArticleBody(html: string): string {
  // Extract Westword article body
  const westwordMatch =
    html.match(/class="article-content"[^>]*>([\s\S]*?)<div class="article-related/i) ||
    html.match(/class="article-content "[^>]*>([\s\S]*?)<div class="article-author/i);

  // Extract Denver Post article body
  const denverPostMatch =
    html.match(/class="[^"]*article-body[^"]*"[^>]*>([\s\S]*?)<section/i) ||
    html.match(/class="[^"]*body-copy[^"]*"[^>]*>([\s\S]*?)<div class="[^"]*tags/i);

  const bodyHtml = westwordMatch?.[1] || denverPostMatch?.[1] || "";
  const body = bodyHtml ? cleanHtml(bodyHtml).slice(0, 5000) : "";

  // Also grab the end of the full page text where Westword puts the structured address list
  const fullText = cleanHtml(html);
  const openingsIdx = fullText.lastIndexOf("Openings");
  const addressList = openingsIdx > -1 ? fullText.slice(openingsIdx, openingsIdx + 1500) : "";

  return body + (addressList ? "\n\nADDRESS LIST:\n" + addressList : "");
}

function extractOgImage(html: string): string | null {
  const match =
    html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
  return match ? match[1] : null;
}

function findWeeklyRoundupUrl(articles: ArticleSnippet[]): string | null {
  const roundup = articles.find(
    (a) =>
      a.title.toLowerCase().includes("every opening") ||
      a.title.toLowerCase().includes("opening and closing this week") ||
      a.title.toLowerCase().includes("restaurant roll call")
  );
  return roundup?.url ?? null;
}

async function getGooglePlacesPhoto(restaurantName: string, city = "Denver"): Promise<string | null> {
  try {
    const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": PLACES_API_KEY,
        "X-Goog-FieldMask": "places.photos,places.userRatingCount",
      },
      body: JSON.stringify({
        textQuery: `${restaurantName} ${city}`,
        maxResultCount: 3,
        languageCode: "en",
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    // Pick the place with the most photos (better established)
    const places = data.places ?? [];
    let bestPhoto: string | null = null;
    let mostPhotos = 0;
    for (const place of places) {
      const photoCount = place.photos?.length ?? 0;
      if (photoCount > mostPhotos) {
        mostPhotos = photoCount;
        bestPhoto = place.photos[0]?.name ?? null;
      }
    }
    return bestPhoto;
  } catch {
    return null;
  }
}

export async function getWeeklyPhoto(
  restaurantNames: string[],
  sourceArticles: ArticleSnippet[]
): Promise<WeeklyPhoto | null> {
  for (const name of restaurantNames.slice(0, 6)) {
    if (!name || name.length < 3) continue;
    const photoName = await getGooglePlacesPhoto(name);
    if (photoName) {
      return { url: photoName, credit: "Google Places", creditUrl: "" };
    }
  }
  for (const article of sourceArticles.slice(0, 4)) {
    if (!article.description) continue;
    const ogImage = extractOgImage(article.description);
    if (ogImage && ogImage.startsWith("http")) {
      return { url: ogImage, credit: article.source, creditUrl: article.url };
    }
  }
  return null;
}

async function fetchArticleDetails(articles: ArticleSnippet[]): Promise<ArticleSnippet[]> {
  const enriched: ArticleSnippet[] = [];
  const toFetch = articles.slice(0, 6);

  await Promise.all(
    toFetch.map(async (article) => {
      try {
        const html = await fetchPageHtml(article.url);
        if (html) {
          const body = extractArticleBody(html);
          enriched.push({ ...article, description: body || article.description });
        } else {
          enriched.push(article);
        }
      } catch {
        enriched.push(article);
      }
    })
  );

  return enriched;
}

export interface PlaceCard {
  name: string;
  address: string | null;
  rating: number | null;
  website: string | null;
  maps_url: string | null;
  photo_name: string | null;
  place_id: string | null;
}

async function lookupRestaurantPlaces(names: string[]): Promise<PlaceCard[]> {
  const cards: PlaceCard[] = [];
  for (const name of names.slice(0, 8)) {
    if (!name || name.length < 3) continue;
    try {
      const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": PLACES_API_KEY,
          "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.rating,places.websiteUri,places.photos",
        },
        body: JSON.stringify({
          textQuery: `${name} Denver Colorado`,
          maxResultCount: 1,
          languageCode: "en",
        }),
      });
      if (!res.ok) continue;
      const data = await res.json();
      const place = data.places?.[0];
      if (!place) continue;
      cards.push({
        name: place.displayName?.text ?? name,
        address: place.formattedAddress ?? null,
        rating: place.rating ?? null,
        website: place.websiteUri ?? null,
        maps_url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + " Denver")}&query_place_id=${place.id}`,
        photo_name: place.photos?.[0]?.name ?? null,
        place_id: place.id ?? null,
      });
    } catch {
      continue;
    }
    // Small delay to avoid rate limiting
    await new Promise((r) => setTimeout(r, 200));
  }
  return cards;
}

export async function generateWeeklyOpenings(): Promise<{ success: boolean; slug?: string; error?: string }> {
  const weekDate = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const slug = generateSlug(`new-denver-restaurant-openings-${weekDate}`);

  const existing = await supabase.from("articles").select("slug").eq("slug", slug).single();
  if (existing.data) return { success: true, slug };

  const [westwordHtml, denverPostHtml] = await Promise.all([
    fetchPageHtml(WESTWORD_URL),
    fetchPageHtml(DENVER_POST_URL),
  ]);

  const westwordArticles = westwordHtml ? extractArticles(westwordHtml, "Westword") : [];
  const denverPostArticles = denverPostHtml ? extractArticles(denverPostHtml, "Denver Post") : [];
  const allArticles = [...westwordArticles, ...denverPostArticles].slice(0, 12);

  if (allArticles.length === 0) {
    return { success: false, error: "Could not fetch articles from sources" };
  }

  const enrichedArticles = await fetchArticleDetails(allArticles);

  const sourceText = enrichedArticles
    .map(
      (a) =>
        `SOURCE: ${a.source}\nSOURCE URL: ${a.url}\nTITLE: ${a.title}\nDATE: ${a.date}\nARTICLE BODY:\n${a.description}`
    )
    .join("\n\n---\n\n");

  const prompt = `You are writing a weekly Denver restaurant openings roundup for DaveLovesDenver.com, written by Dave Chung — a Denver local, YouTube creator with over 2 million views, and genuine expert on the city's food scene.

DAVE'S VOICE AND STYLE:
- Casual, entertaining, and warm — like a knowledgeable local friend
- First person, conversational, never stuffy
- Grounds everything in real social context — who should go, who it's best for
- Matter-of-fact and honest — describe things as they are, not as hype
- Avoid superlatives and sensationalist language — never say "absolutely crushed it", "best ever", "can't miss", "game changer", "blew my mind"
- If something is good, say why it's good specifically — not just that it's amazing
- Enthusiasm comes from specific details, not from exclamation points or hyperbole
- Never uses travel brochure language

THIS WEEK'S DATE: ${weekDate}

SOURCE ARTICLES FROM WESTWORD AND DENVER POST:
${sourceText}

Write a 800-1,000 word weekly roundup article covering only the OPENINGS (not closings) mentioned in the sources above. Follow this structure:

## What's Opening in Denver This Week

2-3 sentence intro in Dave's voice about the week's openings.

## [Exact Restaurant Name] — [Neighborhood or City]

For each opening write exactly in this format:

First write 2-3 sentences about what it is, the food, and who it is best for. Do NOT include the address in this paragraph.

Then on a new line write ONLY the address if found:
**Address:** 1234 Main St, Denver

Then on a new line write the website if found:
**Website:** [restaurantname.com](URL)

The address and website must always be on their own separate lines after the description paragraph, never inside it.

## Worth Keeping an Eye On

1 paragraph on upcoming openings not yet open.

## Dave's Pick of the Week

1-2 sentences on the single most interesting opening and why Dave would check it out first.

IMPORTANT RULES:
- Only cover openings not closings
- Use EXACT restaurant names from the source — never say "a Mexican restaurant"
- Reference Westword or Denver Post naturally — e.g. [as Westword reported](URL)
- Write in first person as Dave
- End with "I'll be checking some of these out soon — I'll catch you over there when I do"
- Return ONLY the article text`;

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
    });

    const content = message.content[0];
    if (content.type !== "text") return { success: false, error: "Unexpected response" };

    const articleText = content.text.trim();
    const title = `New Denver Restaurant Openings — Week of ${weekDate}`;

    const restaurantNames = [...articleText.matchAll(/^## ([^\u2014\n]+)/gm)]
      .map((m) => m[1].trim())
      .filter(
        (n) =>
          !n.toLowerCase().includes("worth keeping") &&
          !n.toLowerCase().includes("pick of") &&
          !n.toLowerCase().includes("opening in denver")
      );

    const photo = await getWeeklyPhoto(restaurantNames, enrichedArticles);

    const { error } = await supabase.from("articles").upsert(
      {
        video_id: null,
        slug,
        title,
        content: articleText,
        content_type: "roundup",
        neighborhood_slug: null,
        category_slug: "restaurants",
        expedia_url: null,
        places_mentioned: [
          ...(photo ? [{ photo_url: photo.url, photo_credit: photo.credit, photo_credit_url: photo.creditUrl }] : []),
          ...(await lookupRestaurantPlaces(restaurantNames)),
        ],
        generated_at: new Date().toISOString(),
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

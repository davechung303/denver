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

function extractArticleText(html: string): string {
  // Remove scripts, styles, nav, ads
  let text = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<nav[\s\S]*?<\/nav>/gi, "")
    .replace(/<header[\s\S]*?<\/header>/gi, "")
    .replace(/<footer[\s\S]*?<\/footer>/gi, "")
    .replace(/<aside[\s\S]*?<\/aside>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s{2,}/g, " ")
    .trim();
  // Return first 3000 chars of article body
  return text.slice(0, 3000);
}

export interface WeeklyPhoto {
  url: string;
  credit: string;
  creditUrl: string;
}

async function getGooglePlacesPhoto(restaurantName: string, city = "Denver"): Promise<string | null> {
  try {
    const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": PLACES_API_KEY,
        "X-Goog-FieldMask": "places.photos",
      },
      body: JSON.stringify({
        textQuery: `${restaurantName} ${city}`,
        maxResultCount: 1,
        languageCode: "en",
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    // Store just the photo name (resource path), not the full URL with key
    const photoName = data.places?.[0]?.photos?.[0]?.name;
    if (!photoName) return null;
    return photoName;
  } catch {
    return null;
  }
}

function extractOgImage(html: string): string | null {
  const match = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
    || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
  return match ? match[1] : null;
}

export async function getWeeklyPhoto(
  restaurantNames: string[],
  sourceArticles: ArticleSnippet[]
): Promise<WeeklyPhoto | null> {
  // Try Google Places for each restaurant name
  for (const name of restaurantNames.slice(0, 3)) {
    if (!name || name.length < 3) continue;
    const photoName = await getGooglePlacesPhoto(name);
    if (photoName) {
      return { url: photoName, credit: "Google Places", creditUrl: "" };
    }
  }

  // Fall back to og:image from source articles
  for (const article of sourceArticles.slice(0, 4)) {
    if (!article.description) continue;
    const ogImage = extractOgImage(article.description);
    if (ogImage && ogImage.startsWith("http")) {
      return {
        url: ogImage,
        credit: article.source,
        creditUrl: article.url,
      };
    }
  }

  return null;
}

async function fetchArticleDetails(articles: ArticleSnippet[]): Promise<ArticleSnippet[]> {
  const enriched: ArticleSnippet[] = [];
  // Only fetch top 6 articles to stay within reasonable time
  const toFetch = articles.slice(0, 6);
  
  await Promise.all(toFetch.map(async (article) => {
    try {
      const html = await fetchPageHtml(article.url);
      if (html) {
        const fullText = extractArticleText(html);
        enriched.push({ ...article, description: fullText });
      } else {
        enriched.push(article);
      }
    } catch {
      enriched.push(article);
    }
  }));
  
  return enriched;
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

  const sourceText = allArticles
    .map((a) => `SOURCE: ${a.source}\nTITLE: ${a.title}\nDATE: ${a.date}\nDESCRIPTION: ${a.description}\nURL: ${a.url}`)
    .join("\n\n---\n\n");

  const prompt = `You are writing a weekly Denver restaurant openings roundup for DaveLovesDenver.com, written by Dave Chung — a Denver local, YouTube creator with over 2 million views, and genuine expert on the city's food scene.

DAVE'S VOICE AND STYLE:
- Casual, entertaining, and warm — like a knowledgeable local friend
- First person, conversational, never stuffy
- Grounds everything in real social context — who should go, who it's best for
- Enthusiastic but honest
- Never uses travel brochure language

THIS WEEK'S DATE: ${weekDate}

SOURCE ARTICLES FROM WESTWORD AND DENVER POST:
${sourceText}

Write a 800-1,000 word weekly roundup article covering only the OPENINGS (not closings) mentioned in the sources above. Follow this structure:

## What's Opening in Denver This Week

2-3 sentence intro in Dave's voice about the week's openings and what stands out.

## [Restaurant Name] — [Neighborhood]

For each opening: 2-3 sentences covering what it is, what kind of food/drink, where it is, and who it's best for. Be specific about the social context — is this a date night spot? Great for groups? Family friendly? Quick lunch?

## Worth Keeping an Eye On

1 paragraph covering any upcoming openings mentioned that aren't open yet but are worth knowing about.

## Dave's Pick of the Week

1-2 sentences naming the single most interesting opening this week and why Dave would personally want to check it out first.

IMPORTANT RULES:
- Only cover openings, not closings
- Only mention places explicitly named in the source articles above — use the EXACT restaurant name, never say "a Mexican restaurant" or "a Japanese spot"
- Include the full street address for every restaurant — look carefully through the full text for street addresses, they are often mentioned in the body of the article
- Format the address on its own line after the restaurant description like: **Address:** 1234 Main St, Denver, CO
- If a restaurant website is mentioned in the source text, include it as a markdown link like: [Visit their website](https://example.com)
- If no address is found in the source text, do not include one — never make up an address
- Include one natural link back to the original Westword article AND one link back to the original Denver Post article somewhere in the piece — format as: [read more at Westword](URL) or [as Denver Post reported](URL)
- Do not invent or add businesses not mentioned in sources
- Use ## headers for each restaurant section formatted as: ## Restaurant Name — Neighborhood
- Write in first person as Dave
- End with something like "I'll be checking some of these out soon — I'll catch you over there when I do"
- Return ONLY the article text with markdown links — no explanation`;

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

    // Extract restaurant names from ## headers in the article
    const restaurantNames = [...articleText.matchAll(/^## ([^\u2014\n]+)/gm)]
      .map((m) => m[1].trim())
      .filter((n) => !n.toLowerCase().includes("worth keeping") && !n.toLowerCase().includes("pick of"));

    // Get a photo — try Google Places first, fall back to source og:image
    const photo = await getWeeklyPhoto(restaurantNames, allArticles);

    const { error } = await supabase.from("articles").upsert({
      video_id: null,
      slug,
      title,
      content: articleText,
      content_type: "roundup",
      neighborhood_slug: null,
      category_slug: "restaurants",
      expedia_url: null,
      places_mentioned: photo ? [{ photo_url: photo.url, photo_credit: photo.credit, photo_credit_url: photo.creditUrl }] : [],
      generated_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, { onConflict: "slug" });

    if (error) return { success: false, error: error.message };
    return { success: true, slug };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

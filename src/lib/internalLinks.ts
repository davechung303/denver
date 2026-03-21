import Anthropic from "@anthropic-ai/sdk";
import { supabase } from "./supabase";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

interface InternalLink {
  title: string;
  url: string;
  type: "article" | "video";
}

// Extract searchable keywords from the article using Haiku
async function extractKeywords(text: string): Promise<string[]> {
  try {
    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 200,
      messages: [
        {
          role: "user",
          content: `Extract 8-10 specific searchable terms from this Denver article: restaurant names, food types (e.g. "ramen", "sushi", "BBQ"), neighborhoods, venues, or activities. Short and specific — things someone might search for.

TEXT: ${text.slice(0, 1500)}

Return ONLY a JSON array: ["term1", "term2", ...]`,
        },
      ],
    });
    const content = message.content[0];
    if (content.type !== "text") return [];
    return JSON.parse(content.text.trim());
  } catch {
    return [];
  }
}

// Search existing articles and videos for matches
async function findMatches(keywords: string[]): Promise<InternalLink[]> {
  const found = new Map<string, InternalLink>();

  await Promise.all(
    keywords.slice(0, 8).map(async (kw) => {
      const [articles, videos] = await Promise.all([
        supabase
          .from("articles")
          .select("slug, title")
          .ilike("title", `%${kw}%`)
          .not("video_id", "is", null) // prefer video-backed articles (real experience)
          .limit(2),
        supabase
          .from("youtube_videos")
          .select("video_id, title")
          .ilike("title", `%${kw}%`)
          .limit(2),
      ]);

      for (const a of articles.data ?? []) {
        const url = `https://davelovesdenver.com/articles/${a.slug}`;
        if (!found.has(url)) found.set(url, { title: a.title, url, type: "article" });
      }

      for (const v of videos.data ?? []) {
        const url = `https://www.youtube.com/watch?v=${v.video_id}`;
        if (!found.has(url)) found.set(url, { title: v.title, url, type: "video" });
      }
    })
  );

  return [...found.values()].slice(0, 10);
}

// Inject 2-4 contextual internal links into the article using Haiku
export async function injectInternalLinks(articleText: string): Promise<string> {
  const keywords = await extractKeywords(articleText);
  if (keywords.length === 0) return articleText;

  const links = await findMatches(keywords);
  if (links.length === 0) return articleText;

  const linkList = links
    .map(
      (l) =>
        `- ${l.type === "article" ? "Article" : "Video"}: [${l.title}](${l.url})`
    )
    .join("\n");

  try {
    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 3000,
      messages: [
        {
          role: "user",
          content: `You are adding contextual internal links to a Denver article. Rules:
- Add 2-4 links from the list below, only where they genuinely add context
- Weave them into existing sentences — do not add new sentences just to place a link
- Prefer linking article titles naturally (e.g. "...which reminds me of [Dave's ramen guide](url)...")
- If a restaurant or food type in the article matches a video Dave made, that's the strongest link to add
- Do not link the same URL twice
- Return ONLY the updated article text — no explanation

ARTICLE:
${articleText}

AVAILABLE LINKS (pick the 2-4 most contextually relevant):
${linkList}`,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== "text") return articleText;
    return content.text.trim();
  } catch {
    return articleText;
  }
}

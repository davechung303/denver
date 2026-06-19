/**
 * Regenerate all existing articles with improved generation (no realPlaces hallucination).
 * Keeps all slugs/URLs intact. Run in small batches to avoid timeouts.
 *
 * Usage:
 *   node scripts/regenerate-articles.mjs           # process 10 articles
 *   node scripts/regenerate-articles.mjs --batch 5  # process 5 articles
 *   node scripts/regenerate-articles.mjs --all      # process all (slow)
 */

import { readFileSync } from "fs";

// Load env
const env = readFileSync(".env.local", "utf8");
for (const line of env.split("\n")) {
  const [k, ...v] = line.split("=");
  if (k?.trim() && v.length) process.env[k.trim()] = v.join("=").trim();
}

import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const args = process.argv.slice(2);
const batchSize = args.includes("--all") ? 999 : (parseInt(args[args.indexOf("--batch") + 1]) || 10);
const forceAll = args.includes("--force"); // re-generate even if already regenerated

// Fetch YouTube transcript (same logic as articles.ts)
async function fetchTranscript(videoId) {
  // Check cache first
  const { data: cached } = await db.from("transcripts").select("transcript").eq("video_id", videoId).single();
  if (cached?.transcript) return cached.transcript;

  try {
    const watchRes = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });
    if (!watchRes.ok) return null;
    const html = await watchRes.text();

    const match = html.match(/"captionTracks":\s*(\[.*?\])/);
    if (!match) return null;
    const tracks = JSON.parse(match[1]);
    const track = tracks.find((t) => t.languageCode === "en" && t.kind !== "asr") ||
      tracks.find((t) => t.languageCode === "en") ||
      tracks.find((t) => t.languageCode?.startsWith("en")) ||
      tracks[0];
    if (!track?.baseUrl) return null;

    const captionUrl = track.baseUrl.replace(/\\u0026/g, "&");
    const captionRes = await fetch(captionUrl);
    if (!captionRes.ok) return null;
    const xml = await captionRes.text();
    if (!xml || xml.trim().length === 0) return null;

    const transcript = xml
      .replace(/<text[^>]*>/g, " ").replace(/<\/text>/g, " ").replace(/<[^>]+>/g, "")
      .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
      .replace(/\s+/g, " ").trim();

    if (!transcript || transcript.length < 100) return null;

    await db.from("transcripts").upsert({ video_id: videoId, transcript, fetched_at: new Date().toISOString() }, { onConflict: "video_id" });
    return transcript;
  } catch {
    return null;
  }
}

function detectContentType(title, description) {
  const text = (title + " " + description).toLowerCase();
  const guideSignals = ["best", "top", "guide", "where to", "things to do", "restaurants in", "hotels in", "bars in", "exploring", "neighborhood"];
  return guideSignals.filter((s) => text.includes(s)).length >= 2 ? "guide" : "review";
}

async function regenerateArticle(article) {
  const { data: video } = await db.from("youtube_videos").select("*").eq("video_id", article.video_id).single();
  if (!video) return { success: false, error: "Video not found" };

  const transcript = await fetchTranscript(article.video_id);
  const contentType = detectContentType(video.title, video.description ?? "");

  const prompt = `You are writing a local Denver article for DaveLovesDenver.com, written in the first person as Dave Chung — a Denver local and YouTube creator with over 2 million views.

=== DAVE'S VOICE ===

TONE: Conversational and direct. Like texting a knowledgeable friend. Measured enthusiasm — "pretty cool", "worth the drive", "legitimately good". Never "absolutely incredible" or "must-visit". If something has a downside, Dave mentions it naturally in the flow. Specific — real streets, real dishes, real context.

BANNED PHRASES:
- "Look, I..." as opener, "I'll be honest", "though" as qualifier
- "calibrated", "elevated", "curated", "intentional", "offerings", "fare"
- "This is the kind of place where...", "you're gonna want to"
- "nestled", "boasts", "vibrant", "culinary journey", "gastronomic", "bustling", "gem"
- "truly", "absolutely" as generic intensifiers

=== CONTENT TO WORK FROM ===

VIDEO TITLE: ${video.title}
VIDEO DESCRIPTION: ${(video.description ?? "Not available").slice(0, 1000)}
${transcript ? `TRANSCRIPT: ${transcript.slice(0, 5000)}` : "No transcript available — write from the title and description only."}
CONTENT TYPE: ${contentType}
${article.neighborhood_slug ? `NEIGHBORHOOD: ${article.neighborhood_slug}` : ""}
${article.category_slug ? `CATEGORY: ${article.category_slug}` : ""}

=== WRITING INSTRUCTIONS ===

Write a ${contentType === "guide" ? "1,000-1,300" : "600-800"} word article. The transcript and description are your ONLY sources for business names and specific details.

${contentType === "guide"
  ? "For each place covered in the video: give it a ## header with the exact business name from the transcript/description. Write 2-4 sentences. Vary structure between entries."
  : "Write 4-6 paragraphs covering: what drew him there, the experience, specific things tried, what worked/didn't, closing take."}

CRITICAL RULES:
- First person as Dave throughout
- ONLY mention businesses explicitly named in the transcript or video description
- Do not invent, assume, or add any business not word-for-word in the transcript/description
- Do not invent prices, hours, or addresses
- Use ## headers for section breaks
- No bullet points

Output format:
TITLE: {SEO title, 55-70 chars, plain language}

{article body}`;

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2500,
    messages: [{ role: "user", content: prompt }],
  });

  const raw = message.content[0].text.trim();
  const titleMatch = raw.match(/^TITLE:\s*(.+)/m);
  const seoTitle = titleMatch ? titleMatch[1].trim() : video.title;
  const articleText = raw.replace(/^TITLE:.*\n\n?/m, "").trim();

  const { error } = await db.from("articles").update({
    title: seoTitle,
    content: articleText,
    content_type: contentType,
    updated_at: new Date().toISOString(),
  }).eq("slug", article.slug);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

// Fetch articles to regenerate — skip anything updated in the last 48h
// to prevent accidental double-runs across sessions.
// Use --force to override this guard.
const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
let query = db.from("articles").select("slug, video_id, title, neighborhood_slug, category_slug")
  .order("updated_at", { ascending: true })
  .lt("updated_at", forceAll ? "9999-01-01" : cutoff)
  .limit(batchSize);

const { data: articles, error } = await query;
if (error || !articles?.length) {
  console.log("No articles to process:", error?.message ?? "none found");
  process.exit(0);
}

console.log(`Processing ${articles.length} articles...`);
let ok = 0, failed = 0;

for (const article of articles) {
  process.stdout.write(`  ${article.title.slice(0, 60)}... `);
  try {
    const result = await regenerateArticle(article);
    if (result.success) { ok++; console.log("✓"); }
    else { failed++; console.log(`✗ ${result.error}`); }
  } catch (e) {
    failed++;
    console.log(`✗ ${e.message}`);
  }
  await new Promise((r) => setTimeout(r, 1500));
}

console.log(`\nDone: ${ok} regenerated, ${failed} failed`);

import Anthropic from "@anthropic-ai/sdk";
import { supabase } from "./supabase";
import { expediaHotelUrl } from "./travelpayouts";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

// Generate a URL-friendly slug from a video title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

// Detect content type from title and description
function detectContentType(title: string, description: string): "review" | "guide" {
  const text = (title + " " + description).toLowerCase();
  const guideSignals = ["best", "top", "guide", "where to", "things to do", "restaurants in", "hotels in", "bars in", "exploring", "neighborhood"];
  const matches = guideSignals.filter((s) => text.includes(s));
  return matches.length >= 2 ? "guide" : "review";
}

// Fetch YouTube transcript using the timedtext API
export async function fetchTranscript(videoId: string): Promise<string | null> {
  // Check Supabase cache first
  const { data: cached } = await supabase
    .from("transcripts")
    .select("transcript")
    .eq("video_id", videoId)
    .single();

  if (cached) return cached.transcript;

  try {
    // Fetch the transcript list
    const listRes = await fetch(
      `https://www.youtube.com/api/timedtext?v=${videoId}&type=list`
    );
    if (!listRes.ok) return null;
    const listText = await listRes.text();

    // Parse available languages — prefer English
    const langMatch = listText.match(/lang_code="([^"]+)"/);
    const lang = langMatch ? langMatch[1] : "en";

    // Fetch the actual transcript
    const transcriptRes = await fetch(
      `https://www.youtube.com/api/timedtext?v=${videoId}&lang=${lang}&fmt=json3`
    );
    if (!transcriptRes.ok) return null;
    const transcriptData = await transcriptRes.json();

    // Extract text from transcript events
    const transcript = transcriptData.events
      ?.filter((e: any) => e.segs)
      .map((e: any) => e.segs.map((s: any) => s.utf8).join(""))
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

    if (!transcript) return null;

    // Cache in Supabase
    await supabase.from("transcripts").upsert({
      video_id: videoId,
      transcript,
      fetched_at: new Date().toISOString(),
    }, { onConflict: "video_id" });

    return transcript;
  } catch {
    return null;
  }
}

// Generate a full SEO article from a video using Claude
export async function generateArticle(videoId: string): Promise<{ success: boolean; slug?: string; error?: string }> {
  // Check if article already exists
  const { data: existing } = await supabase
    .from("articles")
    .select("slug")
    .eq("video_id", videoId)
    .single();

  if (existing) return { success: true, slug: existing.slug };

  // Fetch video data
  const { data: video } = await supabase
    .from("youtube_videos")
    .select("*")
    .eq("video_id", videoId)
    .single();

  if (!video) return { success: false, error: "Video not found" };

  // Fetch transcript
  const transcript = await fetchTranscript(videoId);

  // Fetch neighborhood/category associations
  const { data: associations } = await supabase
    .from("video_page_associations")
    .select("neighborhood_slug, category_slug, relevance_score")
    .eq("video_id", videoId)
    .order("relevance_score", { ascending: false })
    .limit(1);

  const neighborhood = associations?.[0]?.neighborhood_slug ?? null;
  const category = associations?.[0]?.category_slug ?? null;
  const contentType = detectContentType(video.title, video.description ?? "");

  // Fetch real places from database to ground the article
  let realPlaces = "";
  if (neighborhood || category) {
    const { createClient } = await import("@supabase/supabase-js");
    const db = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    let query = db
      .from("places")
      .select("name, address, rating, review_count, price_level")
      .order("rating", { ascending: false })
      .limit(15);
    if (neighborhood) query = query.eq("neighborhood_slug", neighborhood);
    if (category) query = query.eq("category_slug", category);
    const { data: places } = await query;
    if (places && places.length > 0) {
      realPlaces = places
        .map((p: any) => `- ${p.name} | ${p.address} | Rating: ${p.rating} | Price: ${"$".repeat(p.price_level ?? 1)}`)
        .join("\n");
    }
  }

  // Search for local press coverage to add credibility
  const pressQuery = encodeURIComponent(`${video.title} site:westword.com OR site:denverpost.com`);
  let pressMentions = "";
  try {
    const searchRes = await fetch(
      `https://api.search.brave.com/res/v1/web/search?q=${pressQuery}&count=3`,
      { headers: { "Accept": "application/json", "Accept-Encoding": "gzip", "X-Subscription-Token": process.env.BRAVE_SEARCH_API_KEY ?? "" } }
    );
    if (searchRes.ok) {
      const searchData = await searchRes.json();
      const results = searchData.web?.results ?? [];
      pressMentions = results
        .map((r: any) => `- ${r.title}: ${r.description}`)
        .join("\n");
    }
  } catch {
    // Press search is optional — continue without it
  }

  // Build the prompt
  const prompt = `You are writing a local Denver article for DaveLovesDenver.com, written in the first person as Dave Chung — a Denver local and YouTube creator with over 2 million views.

=== DAVE'S VOICE (read this carefully before writing anything) ===

TONE: Conversational and direct. Like texting a knowledgeable friend. Measured enthusiasm — "pretty cool", "worth the drive", "legitimately good". Never "absolutely incredible" or "must-visit". If something has a downside, Dave mentions it naturally in the flow — not as a disclaimer, just as part of the description. Specific — real streets, real dishes, real context.

WHAT DAVE SOUNDS LIKE:
- "I wasn't expecting much, and it surprised me."
- "This one's worth the drive if you're already heading south."
- "My wife and I went on a weeknight and had no trouble getting a table."
- "Most people skip this neighborhood, and that's a mistake."
- "The parking situation is a little annoying but it's not a dealbreaker."
- He occasionally uses dry humor: "which was completely wrong, but we do have good pizza here"
- He states opinions plainly without flagging them as opinions: "The burger is better than it has any right to be at that price."

BANNED PHRASES — DO NOT USE ANY OF THESE:
- "Look, I..." as a paragraph opener
- "I'll be honest" / "my honest take" / "honest note" — sounds performed, not natural
- "though" as a qualifier ("good, though", "worth it, though") — too formal
- "calibrated", "elevated", "thoughtful", "curated", "intentional" — not Dave's words
- "offerings", "fare" — too food-critic
- "This is the kind of place where..."
- "you're gonna want to"
- "Whether you're X or Y or Z" audience framing
- "This is perfect for families, couples, groups, and solo visitors"
- "Let me tell you", "Believe it or not"
- "nestled", "boasts", "vibrant", "culinary journey", "gastronomic", "bustling", "gem"
- "all" or "every" as superlatives: "all the flavors", "every detail"
- "truly", "absolutely" as generic intensifiers
- "I'll catch you over there"
- Starting consecutive paragraphs with the same word

BEFORE FINALIZING — scan the draft for these words and rewrite any sentence containing them:
"though", "honest", "calibrated", "elevated", "curated", "intentional", "offerings", "fare"

SOCIAL FRAMING: Dave mentions who a place is good for, but ONCE per article at most, only when specific and genuinely useful. "Great for a group — the menu is designed for sharing." NOT a list of every demographic in every paragraph.

STRUCTURE:
1. Open with Dave's honest, specific reaction — his direct take on what makes this worth writing about. No generic setup.
2. Describe what he actually experienced — atmosphere, specific dishes or moments, what stood out. Concrete details only.
3. The honest part — what works, what doesn't, what surprised him.
4. Practical context woven naturally into the writing — parking, best time to go, what to order, whether to book. No "PRACTICAL DETAILS" header.
5. Close with 1-2 sentences of direct recommendation. No flowery wrap-up. No "DAVE'S VERDICT" header.

=== CONTENT TO WORK FROM ===

VIDEO TITLE: ${video.title}
VIDEO DESCRIPTION: ${video.description ?? "Not available"}
${transcript ? `TRANSCRIPT: ${transcript.slice(0, 4000)}` : "No transcript available — write from the title and description only."}
CONTENT TYPE: ${contentType} (${contentType === "guide" ? "roundup covering multiple places" : "single place review"})
${neighborhood ? `NEIGHBORHOOD: ${neighborhood}` : ""}
${category ? `CATEGORY: ${category}` : ""}
${realPlaces ? `REAL BUSINESSES (ONLY mention businesses from this list — never invent names):\n${realPlaces}` : ""}
${pressMentions ? `LOCAL PRESS (weave in naturally if relevant, do not quote directly):\n${pressMentions}` : ""}

=== WRITING INSTRUCTIONS ===

Write a ${contentType === "guide" ? "1,000-1,300" : "600-800"} word article.

${contentType === "guide"
  ? "For each place: give it a ## header with the business name. Write 2-4 sentences that describe what makes it worth going, what to get, and one specific detail that sets it apart. Vary the sentence structure between entries — they should not all sound the same."
  : "Write 4-6 paragraphs covering: what drew him there, what the experience was actually like, specific things he tried, what works and what doesn't, and a closing take."}

CRITICAL RULES:
- First person as Dave throughout
- Only mention businesses from the REAL BUSINESSES list above — never hallucinate names
- Do not invent prices, hours, or addresses
- Use ## headers for section breaks
- No bullet points
- No mention of affiliate links or hotel booking in the article body
- Return ONLY the article text — no preamble, no explanation

Return ONLY the article text.`;

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      return { success: false, error: "Unexpected response type" };
    }

    const articleText = content.text.trim();
    const slug = generateSlug(video.title);
    const expediaUrl = neighborhood
      ? expediaHotelUrl(`${neighborhood} Denver`)
      : expediaHotelUrl("Denver Colorado");

    // Save to Supabase
    const { error } = await supabase.from("articles").upsert({
      video_id: videoId,
      slug,
      title: video.title,
      content: articleText,
      content_type: contentType,
      neighborhood_slug: neighborhood,
      category_slug: category,
      expedia_url: expediaUrl,
      places_mentioned: [],
      generated_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, { onConflict: "slug" });

    if (error) return { success: false, error: error.message };
    return { success: true, slug };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// Batch generate articles for all videos that don't have one yet
export async function generateMissingArticles(limit = 10): Promise<{ generated: number; errors: number }> {
  // Find videos that have Denver associations
  const { data: associated } = await supabase
    .from("video_page_associations")
    .select("video_id")
    .not("neighborhood_slug", "is", null);

  const associatedIds = [...new Set(associated?.map((a) => a.video_id) ?? [])];
  if (associatedIds.length === 0) return { generated: 0, errors: 0 };

  // Filter out ones that already have articles before applying limit
  const { data: existing } = await supabase
    .from("articles")
    .select("video_id");

  const existingIds = new Set(existing?.map((a) => a.video_id) ?? []);
  const missingIds = associatedIds.filter((id) => !existingIds.has(id));

  if (missingIds.length === 0) return { generated: 0, errors: 0 };

  const { data: videos } = await supabase
    .from("youtube_videos")
    .select("video_id, title")
    .in("video_id", missingIds)
    .or("duration_seconds.is.null,duration_seconds.gt.180")
    .order("published_at", { ascending: false })
    .limit(limit);

  if (!videos || videos.length === 0) return { generated: 0, errors: 0 };

  const missing = videos;

  let generated = 0;
  let errors = 0;

  for (const video of missing) {
    const result = await generateArticle(video.video_id);
    if (result.success) {
      generated++;
    } else {
      errors++;
      console.error(`Failed to generate article for ${video.title}:`, result.error);
    }
    // Small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  return { generated, errors };
}
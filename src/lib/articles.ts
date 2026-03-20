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
  const prompt = `You are writing a local Denver travel article for DaveLovesDenver.com, a hyperlocal Denver guide run by Dave Chung — a Denver local, YouTube creator with over 2 million views, and genuine expert on the city's neighborhoods, restaurants, hotels, and things to do.

DAVE'S VOICE AND STYLE:
- Casual, entertaining, and warm — like a knowledgeable local friend giving honest advice
- First person, conversational, never stuffy or formal
- Grounds everything in real social context — who should go, who it's best for, what kind of occasion it fits
- Uses phrases like: "This is a place you're gonna want to go with your friends", "This place is better for small groups", "They're great with families", "This is a really casual spot", "This is the kind of place where..."
- When referencing other videos says "I'll catch you over there" not "check out my other video"
- Enthusiastic but honest — if something has a downside, mentions it naturally without being negative
- Never uses travel brochure language like "nestled", "boasts", "culinary journey", "gastronomic experience"
- Specific and practical — gives people the details they actually need to decide whether to go

VIDEO TITLE: ${video.title}
VIDEO DESCRIPTION: ${video.description ?? "Not available"}
${transcript ? `TRANSCRIPT: ${transcript.slice(0, 4000)}` : "No transcript available — use the title and description to write the article."}
CONTENT TYPE: ${contentType} (${contentType === "guide" ? "covers multiple places" : "focuses on one business"})
${neighborhood ? `NEIGHBORHOOD: ${neighborhood}` : ""}
${category ? `CATEGORY: ${category}` : ""}
${realPlaces ? `REAL BUSINESSES FROM OUR DATABASE (ONLY mention businesses from this list — do not invent or hallucinate business names):\n${realPlaces}` : ""}
${pressMentions ? `LOCAL PRESS COVERAGE (weave in naturally where relevant, do not quote directly):\n${pressMentions}` : ""}

Write a ${contentType === "guide" ? "1,200-1,500" : "700-900"} word article following this exact structure:

1. INTRO (2-3 paragraphs): Hook the reader with Dave's personal take. Why does this place or experience matter? What makes it worth visiting? Be specific about who it's best for right from the start.

2. ${contentType === "guide" ? "THE PLACES (one section per place mentioned, 2-3 sentences each): For each place describe what makes it worth visiting, what to order or do, and crucially — who it is best for. A family? A date night? A group of friends? Solo? Be specific." : "THE EXPERIENCE (3-4 paragraphs): What to expect, atmosphere, what Dave tried, honest pros and cons. Include who the place is best suited for — families, couples, groups, solo visitors. Be specific about what makes it worth going."}

3. PRACTICAL DETAILS (1 paragraph): Things that help people actually plan the visit. Parking situation, best time to go, how busy it gets, whether to book ahead, what to wear, anything a local would tell a friend.

4. DAVE'S VERDICT (2-3 sentences): Clear, direct recommendation. Who should go, when, and why. End with "Check out the video above for the full experience" or "I'll catch you over there" if referencing another video.

IMPORTANT RULES:
- Write in first person as Dave throughout
- Ground every recommendation in who it is best for socially — this is Dave's signature angle
- Be specific and local — mention real Denver context, streets, landmarks where natural
- If local press coverage is provided above, weave in a natural reference without quoting directly — e.g. "Westword has called this one of Denver's best kept secrets" or "The Denver Post picked this up when it first opened"
- CRITICAL: Only mention businesses that appear in the REAL BUSINESSES list above — never invent or hallucinate business names
- Do not invent specific prices, hours, or addresses — those come from our database
- Use ## for section headers to break up the content — each restaurant or major section should have a ## header
- Use clean paragraphs under each header
- Do not use bullet points
- Do not mention affiliate links or hotel booking in the article body
- Never use words like: nestled, boasts, culinary journey, gastronomic, vibrant, bustling, gem
- Return ONLY the article text — no introduction, no explanation, just the article

Return ONLY the article text. No introduction, no explanation, just the article.`;

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
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
// Find videos that have Denver associations but no article yet
  const { data: associated } = await supabase
    .from("video_page_associations")
    .select("video_id")
    .not("neighborhood_slug", "is", null);

  const associatedIds = [...new Set(associated?.map((a) => a.video_id) ?? [])];
  if (associatedIds.length === 0) return { generated: 0, errors: 0 };

  const { data: videos } = await supabase
    .from("youtube_videos")
    .select("video_id, title")
    .in("video_id", associatedIds)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (!videos || videos.length === 0) return { generated: 0, errors: 0 };

  // Filter out ones that already have articles
  const { data: existing } = await supabase
    .from("articles")
    .select("video_id");

  const existingIds = new Set(existing?.map((a) => a.video_id) ?? []);
  const missing = videos.filter((v) => !existingIds.has(v.video_id));

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
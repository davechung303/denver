import Anthropic from "@anthropic-ai/sdk";
import { supabase, supabaseAdmin } from "./supabase";
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

// Fetch YouTube transcript by scraping the watch page for the real caption track URL
export async function fetchTranscript(videoId: string): Promise<string | null> {
  // Check Supabase cache first
  const { data: cached } = await supabase
    .from("transcripts")
    .select("transcript")
    .eq("video_id", videoId)
    .single();

  if (cached?.transcript) return cached.transcript;

  try {
    // Fetch the YouTube watch page to extract the caption track URL with session params
    const watchRes = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });
    if (!watchRes.ok) return null;
    const html = await watchRes.text();

    // Extract captionTracks from ytInitialPlayerResponse
    const match = html.match(/"captionTracks":\s*(\[.*?\])/);
    if (!match) return null;

    const tracks: any[] = JSON.parse(match[1]);
    // Prefer manual English, fall back to auto-generated English, then any track
    const track =
      tracks.find((t) => t.languageCode === "en" && t.kind !== "asr") ||
      tracks.find((t) => t.languageCode === "en") ||
      tracks.find((t) => t.languageCode?.startsWith("en")) ||
      tracks[0];

    if (!track?.baseUrl) return null;

    // Unescape the URL (YouTube encodes & as \u0026 in JSON)
    const captionUrl = track.baseUrl.replace(/\\u0026/g, "&");

    // Fetch as XML (default format) — more reliable than json3
    const captionRes = await fetch(captionUrl);
    if (!captionRes.ok) return null;
    const xml = await captionRes.text();

    if (!xml || xml.trim().length === 0) return null;

    // Parse XML: extract text from <text> elements, decode HTML entities
    const transcript = xml
      .replace(/<text[^>]*>/g, " ")
      .replace(/<\/text>/g, " ")
      .replace(/<[^>]+>/g, "")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, " ")
      .trim();

    if (!transcript || transcript.length < 100) return null;

    // Cache in Supabase
    await supabaseAdmin.from("transcripts").upsert({
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
    .select("*, published_at")
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
3. What works, what doesn't, what surprised him.
4. Practical context woven naturally into the writing — parking, best time to go, what to order, whether to book. No "PRACTICAL DETAILS" header.
5. Close with 1-2 sentences of direct recommendation. No flowery wrap-up. No "DAVE'S VERDICT" header.

=== CONTENT TO WORK FROM ===

VIDEO TITLE: ${video.title}
VIDEO DESCRIPTION: ${video.description ?? "Not available"}
${transcript ? `TRANSCRIPT: ${transcript.slice(0, 4000)}` : "No transcript available — write from the title and description only."}
CONTENT TYPE: ${contentType} (${contentType === "guide" ? "roundup covering multiple places" : "single place review"})
${neighborhood ? `NEIGHBORHOOD: ${neighborhood}` : ""}
${category ? `CATEGORY: ${category}` : ""}
${pressMentions ? `LOCAL PRESS (weave in naturally if relevant, do not quote directly):\n${pressMentions}` : ""}

=== WRITING INSTRUCTIONS ===

Write a ${contentType === "guide" ? "1,000-1,300" : "600-800"} word article. Stay tightly focused on what's in the video — the transcript and description are your ONLY sources for business names and specific details.

${contentType === "guide"
  ? "For each place covered in the video: give it a ## header with the business name. Write 2-4 sentences that describe what makes it worth going, what to get, and one specific detail that sets it apart. Vary the sentence structure between entries — they should not all sound the same."
  : "Write 4-6 paragraphs covering: what drew him there, what the experience was actually like, specific things he tried, what worked and what didn't, and a closing take."}

CRITICAL RULES:
- First person as Dave throughout
- ONLY mention businesses and places explicitly named in the transcript or video description — if a place is not in the transcript/description, it does not exist for this article
- Do not invent, assume, or add any business name that is not word-for-word in the transcript or description
- Do not invent prices, hours, or addresses
- Use ## headers for section breaks
- No bullet points
- No mention of affiliate links or hotel booking in the article body

SEO TITLE INSTRUCTIONS:
Before the article, output a single line in this exact format:
TITLE: {your SEO-optimized title}

Title rules:
- For neighborhood-specific content: "Best [Topic] near [Neighborhood], Denver" or "[Neighborhood]'s Best [Topic]"
- For single-place reviews: "[Business Name]: [Short Hook] in [Neighborhood], Denver"
- For general Denver guides: "Best [Topic] in Denver, Colorado"
- Include the neighborhood name when the content is neighborhood-specific
- 55-70 characters ideal, never exceed 70
- Plain language — no clickbait, no ALL CAPS, no exclamation marks

Then a blank line, then the article body.

Return ONLY: the TITLE line, a blank line, and the article text. No other preamble.`;

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

    const raw = content.text.trim();

    // Parse the TITLE: line from the response
    const titleMatch = raw.match(/^TITLE:\s*(.+)/m);
    const seoTitle = titleMatch ? titleMatch[1].trim() : video.title;
    // Strip the TITLE line (and blank line after it) to get the article body
    const articleText = raw.replace(/^TITLE:.*\n\n?/m, "").trim();

    // Slug uses the original video title for URL stability (existing articles unaffected)
    const slug = generateSlug(video.title);
    const expediaUrl = neighborhood
      ? expediaHotelUrl(`${neighborhood} Denver`)
      : expediaHotelUrl("Denver Colorado");

    // Save to Supabase
    const { error } = await supabaseAdmin.from("articles").upsert({
      video_id: videoId,
      slug,
      title: seoTitle,
      content: articleText,
      content_type: contentType,
      neighborhood_slug: neighborhood,
      category_slug: category,
      expedia_url: expediaUrl,
      places_mentioned: [],
      generated_at: video.published_at,
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
  // Find videos that have any Denver association (neighborhood or category)
  const { data: associated } = await supabase
    .from("video_page_associations")
    .select("video_id");

  const associatedIds = new Set(associated?.map((a) => a.video_id) ?? []);

  // Also include recently-published videos that have no associations at all —
  // Shorts and videos with vague titles can slip through keyword matching entirely.
  // Fetch the 50 most recently published videos and check which ones have no associations.
  const { data: recentVideos } = await supabase
    .from("youtube_videos")
    .select("video_id")
    .order("published_at", { ascending: false })
    .limit(50);

  const recentUnassociated = (recentVideos ?? [])
    .map((v) => v.video_id)
    .filter((id) => !associatedIds.has(id));

  const candidateIds = [...new Set([...associatedIds, ...recentUnassociated])];
  if (candidateIds.length === 0) return { generated: 0, errors: 0 };

  // Filter out ones that already have articles before applying limit
  const { data: existing } = await supabase
    .from("articles")
    .select("video_id");

  const existingIds = new Set(existing?.map((a) => a.video_id) ?? []);
  const missingIds = candidateIds.filter((id) => !existingIds.has(id));

  if (missingIds.length === 0) return { generated: 0, errors: 0 };

  const { data: videos } = await supabase
    .from("youtube_videos")
    .select("video_id, title, description")
    .in("video_id", missingIds)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (!videos || videos.length === 0) return { generated: 0, errors: 0 };

  let generated = 0;
  let errors = 0;

  for (const video of videos) {
    // For videos with no associations, use transcript + description to confirm Denver content
    // before spending Claude API credits on article generation
    if (!associatedIds.has(video.video_id)) {
      const transcript = await fetchTranscript(video.video_id);
      const searchText = [video.title, video.description ?? "", transcript ?? ""].join(" ").toLowerCase();
      const DENVER_SIGNALS = [
        "denver", "colorado", "co ", "mile high", "front range", "rino", "lodo",
        "capitol hill", "highlands", "cherry creek", "wash park", "washington park",
        "five points", "baker", "uptown", "sloan lake", "berkeley", "platt park",
        "jefferson park", "aurora", "lakewood", "littleton", "englewood", "arvada",
        "westminster", "thornton", "centennial", "red rocks", "coors field",
        "ball arena", "union station", "colfax",
      ];
      const isDenver = DENVER_SIGNALS.some((kw) => searchText.includes(kw));
      if (!isDenver) continue;
    }

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
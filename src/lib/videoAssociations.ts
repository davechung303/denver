import Anthropic from "@anthropic-ai/sdk";
import { supabase } from "./supabase";
import { NEIGHBORHOODS, CATEGORIES } from "./neighborhoods";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

const NEIGHBORHOOD_LIST = NEIGHBORHOODS.map(
  (n) => `${n.slug}: ${n.name} (e.g. ${n.searchName})`
).join("\n");

const CATEGORY_LIST = CATEGORIES.map((c) => `${c.slug}: ${c.name}`).join("\n");

// Classify a single video using Claude Haiku
async function classifyVideo(video: {
  video_id: string;
  title: string;
  description: string | null;
}): Promise<{ neighborhood_slug: string; category_slug: string; relevance_score: number }[]> {
  const prompt = `You are classifying a Denver YouTube video into neighborhoods and categories for a local guide website.

VALID NEIGHBORHOODS:
${NEIGHBORHOOD_LIST}

VALID CATEGORIES:
${CATEGORY_LIST}

VIDEO TITLE: ${video.title}
VIDEO DESCRIPTION: ${(video.description ?? "").slice(0, 800)}

Task: Identify which Denver neighborhood(s) and category(ies) this video belongs to.

Rules:
- Only include associations you are confident about based on the title/description
- A video can have multiple associations (e.g. a restaurant in RiNo AND Capitol Hill)
- "denver-suburbs" covers Aurora, Lakewood, Littleton, Englewood, Arvada, Westminster, etc.
- "downtown" covers LoDo, Union Station, 16th Street Mall, Larimer Square
- If the video is about a specific place, identify its neighborhood — do not default to downtown
- If the video is not Denver-related at all, return empty associations
- relevance_score: 1.0 = exact match, 0.8 = strong match, 0.6 = likely match
- Only use slugs from the lists above — never invent new ones

Return ONLY valid JSON with no explanation:
{"associations": [{"neighborhood_slug": "rino", "category_slug": "restaurants", "relevance_score": 0.9}]}`;

  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 300,
    messages: [{ role: "user", content: prompt }],
  });

  const content = message.content[0];
  if (content.type !== "text") return [];

  try {
    const parsed = JSON.parse(content.text.trim());
    const validNeighborhoodSlugs = new Set(NEIGHBORHOODS.map((n) => n.slug));
    const validCategorySlugs = new Set(CATEGORIES.map((c) => c.slug));

    return (parsed.associations ?? []).filter(
      (a: any) =>
        typeof a.neighborhood_slug === "string" &&
        typeof a.category_slug === "string" &&
        validNeighborhoodSlugs.has(a.neighborhood_slug) &&
        validCategorySlugs.has(a.category_slug) &&
        typeof a.relevance_score === "number"
    );
  } catch {
    return [];
  }
}

export async function associateVideosWithNeighborhoods(
  limit = 20
): Promise<{ associated: number; skipped: number; errors: number }> {
  // Get videos that have no neighborhood_slug set in any association
  const { data: existingWithNeighborhood } = await supabase
    .from("video_page_associations")
    .select("video_id")
    .not("neighborhood_slug", "is", null);

  const alreadyMappedIds = new Set(
    existingWithNeighborhood?.map((a) => a.video_id) ?? []
  );

  // Fetch unassociated videos (all durations — Shorts are Denver content too), newest first
  const { data: allVideos } = await supabase
    .from("youtube_videos")
    .select("video_id, title, description")
    .order("published_at", { ascending: false })
    .limit(500);

  const unassociated = (allVideos ?? [])
    .filter((v) => !alreadyMappedIds.has(v.video_id))
    .slice(0, limit);

  if (unassociated.length === 0) return { associated: 0, skipped: 0, errors: 0 };

  let associated = 0;
  let skipped = 0;
  let errors = 0;

  for (const video of unassociated) {
    try {
      const associations = await classifyVideo(video);

      if (associations.length === 0) {
        skipped++;
      } else {
        await supabase.from("video_page_associations").upsert(
          associations.map((a) => ({
            video_id: video.video_id,
            neighborhood_slug: a.neighborhood_slug,
            category_slug: a.category_slug,
            relevance_score: a.relevance_score,
          })),
          { onConflict: "video_id,neighborhood_slug,category_slug" }
        );
        associated++;
      }
    } catch (err) {
      errors++;
      console.error(`Failed to classify "${video.title}":`, err);
    }

    // Small delay to stay within Haiku rate limits
    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  return { associated, skipped, errors };
}

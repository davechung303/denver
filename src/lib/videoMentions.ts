import { supabase, supabaseAdmin } from "./supabase";
import { extractMentions, findCandidates, type Mention } from "./placeVideos";

/**
 * Every business Dave names in a video, recorded whether or not the site has
 * a page for it, so the gaps are visible.
 *
 * video_mentions.status:
 *   on_site  — matched to a place that already has a page and this video
 *   unsure   — the site has places with a similar name, but none was matched
 *              (a different location of a chain, or a near-miss on the name)
 *   missing  — nothing on the site by that name: a candidate page to add
 *
 * Runs over videos whose youtube_videos.mentions_extracted_at is null, so it
 * backfills the archive once and then picks up each new upload.
 */

async function processVideo(video: { video_id: string; title: string; description: string | null }): Promise<number> {
  const { data: t } = await supabase.from("transcripts").select("transcript").eq("video_id", video.video_id).maybeSingle();
  const mentions: Mention[] = await extractMentions(video, t?.transcript ?? null);

  const { data: linked } = await supabase
    .from("place_videos")
    .select("place_id")
    .eq("video_id", video.video_id)
    .eq("hidden", false);
  const linkedIds = new Set((linked ?? []).map((r) => r.place_id));

  const rows = [];
  const seen = new Set<string>();
  for (const m of mentions.slice(0, 20)) {
    const name = m.name.trim();
    const key = name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);

    const candidates = await findCandidates(name);
    const onSite = candidates.find((c) => linkedIds.has(c.place_id));
    rows.push({
      video_id: video.video_id,
      name,
      area_hint: m.area_hint,
      is_primary: !!m.is_primary,
      status: onSite ? "on_site" : candidates.length > 0 ? "unsure" : "missing",
      place_id: onSite?.place_id ?? null,
      best_candidate: onSite ? null : candidates[0]?.name ?? null,
    });
  }

  if (rows.length > 0) {
    const { error } = await supabaseAdmin.from("video_mentions").upsert(rows, { onConflict: "video_id,name" });
    if (error) throw new Error(error.message);
  }
  await supabaseAdmin
    .from("youtube_videos")
    .update({ mentions_extracted_at: new Date().toISOString() })
    .eq("video_id", video.video_id);
  return rows.length;
}

export async function extractVideoMentions(limit = 30, concurrency = 5, budgetMs = 200_000) {
  const started = Date.now();
  const result = { videos: 0, mentions: 0, errors: 0, log: [] as string[] };

  const { data: pending } = await supabaseAdmin
    .from("youtube_videos")
    .select("video_id, title, description")
    .is("mentions_extracted_at", null)
    .order("published_at", { ascending: false })
    .limit(limit);

  const queue = [...(pending ?? [])];
  async function worker() {
    while (queue.length > 0 && Date.now() - started < budgetMs - 45_000) {
      const video = queue.shift()!;
      try {
        const n = await processVideo(video);
        result.videos++;
        result.mentions += n;
      } catch (err) {
        result.errors++;
        result.log.push(`ERROR ${video.title}: ${err instanceof Error ? err.message : String(err)}`);
      }
    }
  }
  await Promise.all(Array.from({ length: concurrency }, worker));
  return result;
}

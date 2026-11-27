import Anthropic from "@anthropic-ai/sdk";
import { supabase, supabaseAdmin } from "./supabase";
import { VOICE_GUIDE } from "./voiceGuide";
import { isExcludedPlace } from "./excludedPlaces";
import { isInNeighborhood } from "./neighborhoods";
import { fetchTranscript } from "./articles";

/**
 * Place ↔ video matching.
 *
 * Every one of Dave's videos is read (transcript when we have one, title and
 * description otherwise), the businesses it is about are pulled out, and each
 * is matched to a row in `places`. Matches live in `place_videos`. One video
 * can feature several places (compilations) and one place can appear in
 * several videos.
 *
 * Where a transcript exists, each match also gets a short "take" written only
 * from what Dave says in the video. Every take carries short evidence phrases,
 * and a take is thrown away unless at least one of them is actually in the
 * transcript — the guard against the model inventing an opinion Dave never
 * gave.
 *
 * To suppress a bad match: set place_videos.hidden = true in Supabase. The
 * matcher never un-hides a row.
 */

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
const MODEL = "claude-sonnet-4-6";

/** YouTube Shorts run up to three minutes. */
export const SHORT_MAX_SECONDS = 180;

export interface PlaceVideoTake {
  summary: string;
  ordered: string[];
  verdict: string | null;
  skip_if: string | null;
  evidence: string[];
}

export interface PlaceVideo {
  video_id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  published_at: string | null;
  duration_seconds: number | null;
  view_count: number | null;
  isShort: boolean;
  is_primary: boolean;
  confidence: number;
  take: PlaceVideoTake | null;
}

// ---------------------------------------------------------------------------
// Reads (page rendering)
// ---------------------------------------------------------------------------

const VIDEO_COLS = "video_id, title, description, thumbnail_url, published_at, duration_seconds, view_count";

/** Every visible video for one place, best first: the video mainly about the place, then ones with a take, then newest. */
export async function getVideosForPlace(placeId: string): Promise<PlaceVideo[]> {
  const { data } = await supabase
    .from("place_videos")
    .select(`is_primary, confidence, take, youtube_videos(${VIDEO_COLS})`)
    .eq("place_id", placeId)
    .eq("hidden", false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rows = (data ?? []).filter((r: any) => r.youtube_videos);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const videos: PlaceVideo[] = rows.map((r: any) => ({
    ...r.youtube_videos,
    isShort: r.youtube_videos.duration_seconds != null && r.youtube_videos.duration_seconds <= SHORT_MAX_SECONDS,
    is_primary: r.is_primary,
    confidence: Number(r.confidence),
    take: r.take ?? null,
  }));

  return videos.sort((a, b) =>
    Number(b.is_primary) - Number(a.is_primary) ||
    Number(!!b.take) - Number(!!a.take) ||
    (b.published_at ?? "").localeCompare(a.published_at ?? "")
  );
}

export interface VideoMapPin {
  placeId: string;
  name: string;
  href: string;
  lat: number;
  lng: number;
  rating: number | null;
  neighborhoodSlug: string;
  categorySlug: string;
  videos: { id: string; title: string; isShort: boolean; publishedAt: string | null }[];
}

/** One pin per place that has at least one visible video. Optionally limited to a neighborhood. */
export async function getVideoMapPins(neighborhoodSlug?: string): Promise<VideoMapPin[]> {
  const { data } = await supabase
    .from("place_videos")
    .select("place_id, is_primary, places(place_id, name, slug, neighborhood_slug, category_slug, lat, lng, rating), youtube_videos(video_id, title, duration_seconds, published_at)")
    .eq("hidden", false)
    .limit(5000);

  const byPlace = new Map<string, VideoMapPin>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for (const row of (data ?? []) as any[]) {
    const p = row.places;
    const v = row.youtube_videos;
    if (!p || !v || p.lat == null || p.lng == null) continue;
    if (isExcludedPlace(p.slug)) continue;

    let pin = byPlace.get(p.place_id);
    if (!pin) {
      pin = {
        placeId: p.place_id,
        name: p.name,
        href: `/denver/${p.neighborhood_slug}/${p.category_slug}/${p.slug}`,
        lat: p.lat,
        lng: p.lng,
        rating: p.rating,
        neighborhoodSlug: p.neighborhood_slug,
        categorySlug: p.category_slug,
        videos: [],
      };
      byPlace.set(p.place_id, pin);
    }
    if (!pin.videos.some((x) => x.id === v.video_id)) {
      pin.videos.push({
        id: v.video_id,
        title: v.title,
        isShort: v.duration_seconds != null && v.duration_seconds <= SHORT_MAX_SECONDS,
        publishedAt: v.published_at,
      });
    }
  }

  let pins = [...byPlace.values()];
  for (const pin of pins) pin.videos.sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));

  if (neighborhoodSlug) {
    // neighborhood_slug records how a place was fetched, not where it is — so
    // prefer the coordinate bounds, and fall back to the slug only where a
    // neighborhood has no bounds defined.
    pins = pins.filter((pin) =>
      isInNeighborhood(pin.lat, pin.lng, neighborhoodSlug) || pin.neighborhoodSlug === neighborhoodSlug
    );
  }
  return pins;
}

// ---------------------------------------------------------------------------
// Matching (cron)
// ---------------------------------------------------------------------------

export interface Mention {
  name: string;
  area_hint: string | null;
  is_primary: boolean;
}

export interface Candidate {
  place_id: string;
  name: string;
  address: string | null;
  neighborhood_slug: string;
  category_slug: string;
  score: number;
}

const STOP_WORDS = new Set([
  "the", "and", "of", "at", "in", "on", "a", "an", "denver", "co", "colorado",
  "restaurant", "restaurants", "kitchen", "cafe", "eatery", "company", "llc", "inc",
]);

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function tokens(s: string): string[] {
  return normalize(s).split(" ").filter((t) => t.length >= 2 && !STOP_WORDS.has(t));
}

/** Dice coefficient over distinctive tokens. 1 = same words. */
function nameSimilarity(a: string, b: string): number {
  const ta = new Set(tokens(a));
  const tb = new Set(tokens(b));
  if (ta.size === 0 || tb.size === 0) return normalize(a) === normalize(b) ? 1 : 0;
  let shared = 0;
  for (const t of ta) if (tb.has(t)) shared++;
  return (2 * shared) / (ta.size + tb.size);
}

export async function findCandidates(name: string): Promise<Candidate[]> {
  const toks = tokens(name).filter((t) => t.length >= 3).sort((a, b) => b.length - a.length).slice(0, 3);
  if (toks.length === 0) return [];

  // PostgREST or-filter; strip characters that would break its syntax.
  const filter = toks.map((t) => `name.ilike.%${t.replace(/[,()%*]/g, "")}%`).join(",");
  const { data } = await supabaseAdmin
    .from("places")
    .select("place_id, name, address, neighborhood_slug, category_slug, slug")
    .or(filter)
    .limit(60);

  return (data ?? [])
    .filter((p) => !isExcludedPlace(p.slug))
    .map((p) => ({ ...p, score: nameSimilarity(name, p.name) }))
    .filter((p) => p.score >= 0.5)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);
}

function parseJson<T>(text: string): T | null {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end < start) return null;
  try {
    return JSON.parse(text.slice(start, end + 1)) as T;
  } catch {
    return null;
  }
}

async function ask(prompt: string, maxTokens: number): Promise<string> {
  const msg = await anthropic.messages.create({
    model: MODEL,
    max_tokens: maxTokens,
    messages: [{ role: "user", content: prompt }],
  });
  const block = msg.content[0];
  return block?.type === "text" ? block.text : "";
}

export async function extractMentions(
  video: { title: string; description: string | null },
  transcript: string | null
): Promise<Mention[]> {
  const prompt = `You are reading one of Dave Chung's Denver YouTube videos. List every specific, named business the video features — restaurants, bars, coffee shops, hotels, attractions.

VIDEO TITLE: ${video.title}
VIDEO DESCRIPTION: ${(video.description ?? "").slice(0, 1500)}
${transcript ? `TRANSCRIPT (auto-generated captions, so names are often misspelled):\n${transcript.slice(0, 30000)}` : "NO TRANSCRIPT AVAILABLE — use only the title and description."}

Rules:
- Only businesses Dave visits, shows or reviews. Not ones mentioned in passing ("better than the place down the street"), not chains named only as comparisons, not cities or neighborhoods.
- Captions mangle names ("Kasa Bonita" = "Casa Bonita"). Give the business's real name, using the title and description to correct spelling.
- area_hint: the street, neighborhood or suburb Dave gives for it, or null.
- is_primary: true only if the whole video is mainly about this one business.
- If the video isn't about specific businesses (a general guide, an event, sports), return an empty list.

Return ONLY JSON: {"places": [{"name": "Casa Bonita", "area_hint": "Lakewood, West Colfax", "is_primary": true}]}`;

  const parsed = parseJson<{ places: Mention[] }>(await ask(prompt, 800));
  return (parsed?.places ?? []).filter((m) => typeof m.name === "string" && m.name.trim().length > 1);
}

async function resolveMentions(
  video: { title: string; description: string | null },
  transcript: string | null,
  mentions: { mention: Mention; candidates: Candidate[] }[]
): Promise<{ name: string; place_id: string; confidence: number }[]> {
  const blocks = mentions
    .map(({ mention, candidates }, i) =>
      `MENTION ${i + 1}: "${mention.name}"${mention.area_hint ? ` (area: ${mention.area_hint})` : ""}\nCANDIDATES:\n` +
      candidates.map((c) => `  - place_id=${c.place_id} | ${c.name} | ${c.address ?? "no address"} | filed under ${c.neighborhood_slug}/${c.category_slug}`).join("\n")
    )
    .join("\n\n");

  const prompt = `Match businesses featured in a Denver YouTube video to records in our database.

VIDEO TITLE: ${video.title}
VIDEO DESCRIPTION: ${(video.description ?? "").slice(0, 1200)}
${transcript ? `TRANSCRIPT (auto-captions): ${transcript.slice(0, 30000)}` : ""}

${blocks}

For each mention, pick the candidate that is the same business AND the location Dave actually went to.
- Different businesses that share a word ("Pho 79" vs "Pho 95") are NOT matches.
- If a chain has several locations and nothing in the video says which one, return null. A wrong location is worse than no match.
- confidence: 1.0 certain, 0.8 very likely. Anything less sure than 0.8, return null instead.

Return ONLY JSON: {"matches": [{"mention": 1, "place_id": "ChIJ..." or null, "confidence": 0.9}]}`;

  const parsed = parseJson<{ matches: { mention: number; place_id: string | null; confidence: number }[] }>(await ask(prompt, 800));
  const out: { name: string; place_id: string; confidence: number }[] = [];
  const seen = new Set<string>();
  for (const m of parsed?.matches ?? []) {
    const entry = mentions[m.mention - 1];
    if (!entry || !m.place_id || typeof m.confidence !== "number" || m.confidence < 0.8) continue;
    // Only accept an id we actually offered — never one the model made up.
    if (!entry.candidates.some((c) => c.place_id === m.place_id)) continue;
    // Two mentions resolving to one place (said two ways) would break the upsert.
    if (seen.has(m.place_id)) continue;
    seen.add(m.place_id);
    out.push({ name: entry.mention.name, place_id: m.place_id, confidence: m.confidence });
  }
  return out;
}

const BANNED = /\b(though|honest|honestly|calibrated|elevated|curated|intentional|offerings|fare|nestled|boasts|vibrant|bustling|gem|culinary|gastronomic|truly|absolutely)\b/i;

function looseText(s: string): string {
  return normalize(s).replace(/\s+/g, " ");
}

/** True if every banned word is absent and at least one evidence phrase really is in the transcript. */
function takeIsGrounded(take: PlaceVideoTake, transcript: string): boolean {
  const all = [take.summary, take.verdict ?? "", take.skip_if ?? "", ...take.ordered].join(" ");
  if (BANNED.test(all)) return false;
  const hay = looseText(transcript);
  const hits = (take.evidence ?? []).filter((e) => {
    const needle = looseText(e);
    return needle.length >= 12 && hay.includes(needle);
  });
  return hits.length >= 1;
}

async function writeTake(
  placeName: string,
  video: { title: string },
  transcript: string,
  isPrimary: boolean
): Promise<PlaceVideoTake | null> {
  const prompt = `${VOICE_GUIDE}

You are writing a short take on ${placeName} for Dave's website, in Dave's voice, from his own YouTube video.

VIDEO TITLE: ${video.title}
${isPrimary ? "This video is entirely about this place." : `This video covers several places. Use ONLY what Dave says about ${placeName}; ignore the rest.`}
TRANSCRIPT (auto-generated captions — expect misspellings):
${transcript.slice(0, 30000)}

HARD RULES
- Write only from what Dave says in this transcript. No prices, hours, dishes, wait times, locations or opinions that are not in it. If you are unsure whether he said something, leave it out.
- First person is fine — these are Dave's own words from his own visit.
- Fix obvious caption mis-hearings of the business name. If a dish name is garbled and you can't tell what it is, leave it out.
- Never use: though, honest/honestly, elevated, curated, intentional, offerings, fare, nestled, boasts, vibrant, bustling, gem, culinary, truly, absolutely.

FIELDS
- summary: 40–70 words, self-contained (it must make sense quoted alone), opens with his actual reaction. Short sentences.
- ordered: up to 5 specific dishes or drinks he actually tried or showed, as short names. [] if none.
- verdict: one short sentence with his bottom line, only if he gives one. Otherwise null.
- skip_if: one short phrase on who should skip it, only if something he said supports it (e.g. he mentions a long wait or high prices). Otherwise null.
- evidence: 2–4 phrases copied EXACTLY from the transcript (8+ words each) that back up the summary.

If he says too little about ${placeName} to write a real take, return {"skip": true}.

Return ONLY JSON: {"summary": "...", "ordered": ["..."], "verdict": "..." , "skip_if": null, "evidence": ["...", "..."]}`;

  for (let attempt = 0; attempt < 2; attempt++) {
    const parsed = parseJson<PlaceVideoTake & { skip?: boolean }>(await ask(prompt, 900));
    if (!parsed || parsed.skip) return null;
    if (typeof parsed.summary !== "string" || parsed.summary.length < 40) return null;
    const take: PlaceVideoTake = {
      summary: parsed.summary.trim(),
      ordered: Array.isArray(parsed.ordered) ? parsed.ordered.filter((x) => typeof x === "string").slice(0, 5) : [],
      verdict: typeof parsed.verdict === "string" && parsed.verdict.trim() ? parsed.verdict.trim() : null,
      skip_if: typeof parsed.skip_if === "string" && parsed.skip_if.trim() ? parsed.skip_if.trim() : null,
      evidence: Array.isArray(parsed.evidence) ? parsed.evidence.filter((x) => typeof x === "string") : [],
    };
    if (takeIsGrounded(take, transcript)) return take;
  }
  return null;
}

const TRANSCRIPT_RECHECK_MS = 6 * 3600 * 1000;

/**
 * Cached transcript. With fetchIfMissing, a miss is fetched from YouTube (and
 * cached), but at most once every 6 hours per video: this runs every 10
 * minutes, and each caption check costs 50-250 units of a 10,000/day quota.
 */
async function getTranscript(videoId: string, fetchIfMissing = false): Promise<string | null> {
  const { data } = await supabase.from("transcripts").select("transcript").eq("video_id", videoId).maybeSingle();
  if (data?.transcript) return data.transcript;
  if (!fetchIfMissing) return null;

  const { data: v } = await supabaseAdmin
    .from("youtube_videos")
    .select("transcript_checked_at")
    .eq("video_id", videoId)
    .maybeSingle();
  if (v?.transcript_checked_at && Date.now() - new Date(v.transcript_checked_at).getTime() < TRANSCRIPT_RECHECK_MS) {
    return null;
  }
  await supabaseAdmin
    .from("youtube_videos")
    .update({ transcript_checked_at: new Date().toISOString() })
    .eq("video_id", videoId);
  return fetchTranscript(videoId);
}

export interface MatchResult {
  videos: number;
  matched: number;
  takes: number;
  waiting: number;
  errors: number;
  /** True if work was left undone when the time budget ran out. */
  more: boolean;
  /** Places that gained a match or a take this run, so their pages can be refreshed. */
  changedPlaceIds: string[];
  log: string[];
}

/**
 * Match unprocessed videos to places, then write takes for any match that
 * still lacks one and whose video now has a transcript. Stops at the time
 * budget so it fits a single cron invocation.
 *
 * A video with no transcript that is less than a week old is left for later:
 * transcripts arrive separately (YouTube blocks caption fetches from our
 * servers), and matching from the transcript is far more accurate.
 */
export async function matchPlaceVideos(limit = 10, budgetMs = 240_000): Promise<MatchResult> {
  const started = Date.now();
  const result: MatchResult = { videos: 0, matched: 0, takes: 0, waiting: 0, errors: 0, more: false, changedPlaceIds: [], log: [] };
  const timeLeft = () => budgetMs - (Date.now() - started);

  const { data: pending } = await supabaseAdmin
    .from("youtube_videos")
    .select("video_id, title, description, published_at")
    .is("places_matched_at", null)
    .order("published_at", { ascending: false })
    .limit(limit * 3);

  const weekAgo = Date.now() - 7 * 24 * 3600 * 1000;

  let seen = 0;
  for (const video of pending ?? []) {
    if (result.videos >= limit || timeLeft() < 60_000) {
      result.more = true;
      break;
    }
    seen++;
    try {
      const transcript = await getTranscript(video.video_id, true);
      if (!transcript && video.published_at && new Date(video.published_at).getTime() > weekAgo) {
        result.waiting++;
        continue;
      }
      result.videos++;

      const mentions = await extractMentions(video, transcript);
      const withCandidates = [];
      for (const mention of mentions.slice(0, 15)) {
        const candidates = await findCandidates(mention.name);
        if (candidates.length > 0) withCandidates.push({ mention, candidates });
      }

      const matches = withCandidates.length > 0 ? await resolveMentions(video, transcript, withCandidates) : [];
      const primaryNames = new Set(mentions.filter((m) => m.is_primary).map((m) => m.name));

      if (matches.length > 0) {
        await supabaseAdmin.from("place_videos").upsert(
          matches.map((m) => ({
            place_id: m.place_id,
            video_id: video.video_id,
            confidence: m.confidence,
            mention_name: m.name,
            is_primary: primaryNames.has(m.name) && matches.length === 1,
          })),
          { onConflict: "place_id,video_id" }
        );
        result.matched += matches.length;
        result.changedPlaceIds.push(...matches.map((m) => m.place_id));
      }
      result.log.push(`${video.title} → ${matches.map((m) => m.name).join(", ") || "no match"} (${mentions.length} mentioned)`);

      await supabaseAdmin
        .from("youtube_videos")
        .update({ places_matched_at: new Date().toISOString() })
        .eq("video_id", video.video_id);
    } catch (err) {
      result.errors++;
      result.log.push(`ERROR ${video.title}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  // A full page of pending rows means there may be more beyond it.
  if ((pending ?? []).length === limit * 3 && seen === (pending ?? []).length) result.more = true;

  const takes = await fillMissingTakes(timeLeft, result.log, result.changedPlaceIds);
  result.takes = takes.written;
  if (takes.more) result.more = true;
  return result;
}

async function fillMissingTakes(timeLeft: () => number, log: string[], changed: string[]): Promise<{ written: number; more: boolean }> {
  const { data: rows } = await supabaseAdmin
    .from("place_videos")
    .select("id, place_id, is_primary, video_id, places(name), youtube_videos(title)")
    .is("take_generated_at", null)
    .eq("hidden", false)
    .order("created_at", { ascending: false })
    .limit(200);

  const transcripts = new Map<string, string | null>();
  let written = 0;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for (const row of (rows ?? []) as any[]) {
    if (timeLeft() < 40_000) return { written, more: true };
    if (!row.places || !row.youtube_videos) continue;

    if (!transcripts.has(row.video_id)) transcripts.set(row.video_id, await getTranscript(row.video_id));
    const transcript = transcripts.get(row.video_id);
    if (!transcript) continue; // try again once a transcript exists

    try {
      const take = await writeTake(row.places.name, row.youtube_videos, transcript, row.is_primary);
      await supabaseAdmin
        .from("place_videos")
        .update({ take, take_generated_at: new Date().toISOString() })
        .eq("id", row.id);
      if (take) {
        written++;
        changed.push(row.place_id);
      }
      log.push(`take ${take ? "written" : "skipped"}: ${row.places.name}`);
    } catch (err) {
      log.push(`take ERROR ${row.places.name}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
  return { written, more: false };
}

/** Page paths to refresh for places whose matches or takes changed. */
export async function pathsForPlaces(placeIds: string[]): Promise<string[]> {
  const ids = [...new Set(placeIds)];
  if (ids.length === 0) return [];
  const { data } = await supabaseAdmin
    .from("places")
    .select("slug, neighborhood_slug, category_slug")
    .in("place_id", ids);
  const paths = new Set<string>(["/map"]);
  for (const p of data ?? []) {
    paths.add(`/denver/${p.neighborhood_slug}/${p.category_slug}/${p.slug}`);
    paths.add(`/denver/${p.neighborhood_slug}`);
  }
  return [...paths];
}

// Related-video matching for the "Where to Stay in Denver" pillar.
//
// There are no hotel-guide videos on the channel yet, so these are framed as
// related Denver videos rather than as coverage of the neighborhood. The
// matcher scores the existing library against per-area themes and assigns
// greedily down the page with a shared used-set, so no video appears twice.
//
// Why not the video_page_associations table: as of August 2026 it has a null
// neighborhood on most rows, only ~17 distinct videos, and nothing at all for
// LoDo, downtown, Cherry Creek, Washington Park or the Golden Triangle.
//
// When hotel and neighborhood videos do exist, add their strongest terms to
// AREA_KEYWORDS and they will outrank the general pool automatically.

import type { Video } from "./youtube";
import { isShort } from "./youtube";

type Weighted = Record<string, number>;

/** Terms scored against a video's title (double weight) and tags (single). */
const AREA_KEYWORDS: Record<string, Weighted> = {
  lodo: {
    // "rockies" alone is not safe here — it also matches the Gaylord Rockies,
    // which is an airport resort, not a ballpark.
    "union station": 9, lodo: 9, "coors field": 8, "rockies game": 8, "ball arena": 7,
    larimer: 6, "16th street": 6, "downtown denver": 5, "elitch": 5,
    nuggets: 4, trolley: 3, "dragon boat": 3,
  },
  rino: {
    rino: 9, "river north": 9, brewery: 6, brewer: 5, "food hall": 5,
    "new restaurant": 5, "hidden gem": 4, ramen: 4, noodle: 4, dumpling: 4,
    sushi: 4, korean: 3, bbq: 4, "cheap eats": 4, omakase: 3, "night market": 3,
  },
  highlands: {
    lohi: 9, highlands: 9, tennyson: 8, berkeley: 6, "sloan": 6,
    "jefferson park": 6, skyline: 5, burger: 4, brunch: 4, italian: 3, pizza: 3,
  },
  "cherry-creek": {
    "cherry creek": 10, "holiday market": 6, matsuhisa: 7, michelin: 5,
    "fine dining": 5, shopping: 4, steak: 3, donut: 2,
  },
  downtown: {
    // Two terms are deliberately absent. "first time" matched the airport's own
    // first-time-flying video, and downtown runs five sections earlier so it
    // took it. "things to do" matched the family videos that belong to
    // Washington Park. Both now reach their right sections.
    downtown: 7, "16th street": 7, convention: 6, "travel guide": 6,
    mistakes: 6, "casa bonita": 4, immersive: 4, "monster jam": 4,
    "candlelight": 4,
  },
  "capitol-hill": {
    colfax: 9, "capitol hill": 9, "cap hill": 9, cheesman: 7, botanic: 6,
    "molly brown": 7, "live music": 5, concert: 4, "dim sum": 4, "night market": 4,
  },
  uptown: {
    uptown: 9, "17th avenue": 8, "city park": 8, zoo: 7, dmns: 8,
    "museum of nature": 8, "brick planet": 6, "restaurant row": 7,
    bagel: 3, brunch: 3, thai: 2,
  },
  "washington-park": {
    "wash park": 10, "washington park": 10, "swan boat": 9, "platt park": 8,
    "south pearl": 8, kids: 5, family: 5, playground: 4, "mini golf": 3,
    pumpkin: 3, "railroad museum": 3,
  },
  "golden-triangle": {
    "denver art museum": 10, "art museum": 8, kirkland: 8, "clyfford": 8,
    "history colorado": 7, museum: 5, immersive: 5, titanic: 4,
    "disney animation": 4, "ancient egypt": 4, vr: 3,
  },
  airport: {
    // Navigating the airport is more use to someone booking a room out here
    // than a lounge review, so the tours outrank the lounges.
    airport: 10, "airport tour": 8, blucifer: 8, gaylord: 8, tunnels: 6,
    "get around": 6, dia: 6, "den)": 6, terminal: 5,
    "united club": 4, "capital one lounge": 4, lounge: 3, concourse: 3,
  },
};

/** Not Denver at all. Filtered out of the pool entirely. */
const EXCLUDE_TERMS = [
  "nyc", "brooklyn", "austin", "legoland", "liberty bagels",
  // Highlands Ranch is a different town from Denver's Highlands/LoHi and the
  // bare "highlands" keyword matches it. A penalty is not enough — it has to
  // be impossible for it to land in the Highlands section.
  "highlands ranch",
];

/**
 * Outside the city proper. Still legitimate Denver-area content, so these are
 * penalised rather than excluded — they can fill a gap on the airport section
 * without displacing an in-city video somewhere else.
 */
const OUT_OF_CITY_TERMS = [
  "aurora", "westminster", "littleton", "centennial", "lakewood", "arvada",
  "suburbs", "cheyenne mountain", "georgetown", "colorado springs",
  "cripple creek", "kenosha", "boulder", "englewood", "thornton", "broomfield",
  "parker", "castle rock", "fort collins", "pueblo",
];
const OUT_OF_CITY_PENALTY = 14;

/**
 * Denver-wide planning videos suit any section. Scored at a low baseline so
 * they only fill gaps where nothing area-specific is left unused.
 */
const GENERAL_KEYWORDS: Weighted = {
  "first time": 3, "travel guide": 3, mistakes: 3, "things to do": 2,
  "weekend": 2, "moving to denver": 2, "not to move": 2, "surprising facts": 2,
};

function score(video: Video, terms: Weighted): number {
  const title = video.title.toLowerCase();
  const tags = (video.tags ?? []).join(" ").toLowerCase();
  let total = 0;
  for (const [term, weight] of Object.entries(terms)) {
    if (title.includes(term)) total += weight * 2;
    else if (tags.includes(term)) total += weight;
  }
  if (total > 0 && OUT_OF_CITY_TERMS.some((t) => title.includes(t) || tags.includes(t))) {
    total -= OUT_OF_CITY_PENALTY;
  }
  return Math.max(total, 0);
}

export interface AreaVideos {
  /** Videos chosen for this area, already deduped against every earlier area. */
  videos: Video[];
}

/**
 * Assign related videos to each area in page order, never repeating a video.
 *
 * Deterministic: ties break on score, then view count, then video id, so the
 * same library always produces the same page. Areas with nothing relevant left
 * get an empty list rather than filler.
 */
export function assignStayVideos(
  allVideos: Video[],
  areaSlugs: string[],
  perArea = 2
): Record<string, AreaVideos> {
  // Shorts are vertical and thumbnail badly in a two-up grid on a guide page.
  const byId = new Map<string, Video>();
  for (const v of allVideos) {
    if (isShort(v) || !v.thumbnail_url) continue;
    if (EXCLUDE_TERMS.some((t) => v.title.toLowerCase().includes(t))) continue;
    // Keyed by video_id so a duplicate row can never be picked twice.
    if (!byId.has(v.video_id)) byId.set(v.video_id, v);
  }
  const pool = [...byId.values()];

  const used = new Set<string>();
  const result: Record<string, AreaVideos> = {};

  const rank = (a: { s: number; v: Video }, b: { s: number; v: Video }) =>
    b.s - a.s ||
    (b.v.view_count ?? 0) - (a.v.view_count ?? 0) ||
    (a.v.video_id < b.v.video_id ? -1 : a.v.video_id > b.v.video_id ? 1 : 0);

  for (const slug of areaSlugs) {
    const terms = AREA_KEYWORDS[slug];
    const picks: Video[] = [];

    if (terms) {
      const scored = pool
        .filter((v) => !used.has(v.video_id))
        .map((v) => ({ s: score(v, terms), v }))
        .filter((x) => x.s > 0)
        .sort(rank);
      for (const { v } of scored.slice(0, perArea)) {
        picks.push(v);
        used.add(v.video_id);
      }
    }

    // Top up from the Denver-wide pool only if the area came up short.
    if (picks.length < perArea) {
      const scored = pool
        .filter((v) => !used.has(v.video_id))
        .map((v) => ({ s: score(v, GENERAL_KEYWORDS), v }))
        .filter((x) => x.s > 0)
        .sort(rank);
      for (const { v } of scored.slice(0, perArea - picks.length)) {
        picks.push(v);
        used.add(v.video_id);
      }
    }

    result[slug] = { videos: picks };
  }

  return result;
}

/** Every video used on the page, in order — for a single VideoObject schema block. */
export function flattenStayVideos(assigned: Record<string, AreaVideos>, areaSlugs: string[]): Video[] {
  const seenSlug = new Set<string>();
  return areaSlugs.flatMap((s) => {
    if (seenSlug.has(s)) return [];
    seenSlug.add(s);
    return assigned[s]?.videos ?? [];
  });
}

// Picking the hotels to show for a named part of Denver.
//
// The obvious way to do this is places.neighborhood_slug, and it does not work.
// That column comes from how each place was originally fetched, not from where
// it is: The Crawford — inside Union Station — is filed under "highlands", and
// "cherry-creek" holds a DoubleTree in Central Park and a Hyatt House in
// Aurora. A booking module built on it shows the wrong rooms, which is worse
// than showing none.
//
// So this works off coordinates instead: take the hotel pool, keep what is
// genuinely within a short walk of the area's center, and rank it. It needs no
// hand-maintained slug lists and it stays right as the database grows.
//
// Every hotel returned has its own Expedia deep link. A card whose button drops
// the reader on a generic Denver search spends the highest-intent click on the
// page for nothing, so a property without one is left out rather than shown
// with a fallback.

import { getNeighborhood } from "@/lib/neighborhoods";
import type { Place } from "@/lib/places";

const MILES_PER_KM = 0.621371;

function haversineMiles(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const R = 6371;
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLng = ((bLng - aLng) * Math.PI) / 180;
  const p1 = (aLat * Math.PI) / 180;
  const p2 = (bLat * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h)) * MILES_PER_KM;
}

/**
 * How far from an area's center still counts as being in it, in straight-line
 * miles. Dense grid neighborhoods get a tight radius; the airport district is
 * scattered along Tower Road and Peña and needs a wide one.
 */
const RADIUS_MILES: Record<string, number> = {
  // LoDo's real hotels all sit inside half a mile of Union Station. At 0.7 the
  // bucket starts collecting 16th Street and Convention Center properties,
  // which are downtown by any honest reading.
  lodo: 0.5,
  downtown: 0.7,
  // Tight, because the downtown core is only a few blocks north and outranks
  // everything actually in the museum district on review volume. At 0.7 this
  // module returned six downtown hotels and no Art Hotel, on a page about
  // where to stay for the museums.
  "golden-triangle": 0.45,
  // Tight enough that Union Station's hotels don't get filed under RiNo, which
  // they would at 1.1 — The Crawford sits exactly 1.10 miles from RiNo's center.
  rino: 0.9,
  "five-points": 1.0,
  // Cap Hill and Uptown have almost no hotels of their own; a tight radius
  // returns two weak properties, so these reach into the downtown edge.
  "capitol-hill": 1.0,
  uptown: 1.0,
  "cherry-creek": 1.0,
  highlands: 1.0,
  "jefferson-park": 1.0,
  "washington-park": 1.2,
  // The airport district is not near the airport. The Gateway Park and Tower
  // Road clusters sit five to six miles out from the terminal, so anything
  // under about eight miles returns nothing at all.
  airport: 8.0,
};
const DEFAULT_RADIUS_MILES = 1.0;

/** Below this, a rating is a handful of friends rather than a signal. */
const MIN_REVIEWS = 100;

/**
 * Formats that don't belong in a "here are the rooms" module even when they
 * rate well. A hostel with a 4.5 is a good hostel, not an answer to "LoDo or
 * the Golden Triangle" — and putting one at the top of a module that sits
 * under copy recommending Populus reads as a broken widget.
 */
const EXCLUDE_TYPES = new Set(["hostel", "bed_and_breakfast", "campground", "rv_park"]);

/**
 * Properties whose review profile doesn't reflect room stays.
 *
 * The Acoma House is a genuine 12-suite aparthotel and a fine booking, but it
 * carries a 5.0 across 1,299 reviews — a volume that belongs to its wedding and
 * event business, not to people who slept there. No amount of scoring math
 * fixes bad input: it topped the Golden Triangle column and, worse, the
 * Downtown column on a page arguing the case for downtown against Cherry
 * Creek, above the Four Seasons and the Brown Palace.
 *
 * These are ranked out of the area modules only. They keep their affiliate
 * link, their detail page and their place in neighborhood listings — this is
 * about not letting them lead a "best rooms here" list.
 */
const NOT_ROOM_RANKED = new Set(["the-acoma-house"]);

/**
 * Ranking by raw rating puts a 4.5 with 122 reviews above a 4.5 with 2,114,
 * which is both wrong and worse for booking. This is the standard shrink
 * toward a prior: a property needs volume before its rating moves it much.
 */
const PRIOR_WEIGHT = 400;
const PRIOR_RATING = 4.1;

function score(p: Place): number {
  const v = p.review_count ?? 0;
  const r = p.rating ?? PRIOR_RATING;
  return (v / (v + PRIOR_WEIGHT)) * r + (PRIOR_WEIGHT / (v + PRIOR_WEIGHT)) * PRIOR_RATING;
}

export interface AreaHotelOptions {
  limit?: number;
  /** Override the radius when a page needs a wider or tighter net. */
  radiusMiles?: number;
}

/**
 * The hotels worth showing for an area, best-rated first.
 *
 * Returns an empty array when the area has no center on file or nothing nearby
 * clears the bar, so callers can drop the module rather than render a thin one.
 */
export function hotelsInArea(
  pool: Place[],
  areaSlug: string,
  { limit = 5, radiusMiles }: AreaHotelOptions = {}
): Place[] {
  const area = getNeighborhood(areaSlug);
  if (!area) return [];
  const radius = radiusMiles ?? RADIUS_MILES[areaSlug] ?? DEFAULT_RADIUS_MILES;

  const near = candidates(pool)
    .map((p) => ({ p, d: haversineMiles(p.lat as number, p.lng as number, area.lat, area.lng) }))
    .filter((x) => x.d <= radius);

  return rank(near, limit);
}

function candidates(pool: Place[]): Place[] {
  return pool
    .filter((p) => p.lat != null && p.lng != null)
    .filter((p) => p.expedia_affiliate_url)
    .filter((p) => p.rating != null)
    .filter((p) => !p.types?.some((t) => EXCLUDE_TYPES.has(t)))
    .filter((p) => !NOT_ROOM_RANKED.has(p.slug));
}

function rank(near: { p: Place; d: number }[], limit: number): Place[] {
  // Prefer properties with enough reviews to mean something, but don't return
  // nothing in a thin area just to hold the line on review count.
  const wellReviewed = near.filter((x) => (x.p.review_count ?? 0) >= MIN_REVIEWS);
  const pick = wellReviewed.length >= 3 ? wellReviewed : near;

  return pick
    .sort((a, b) => score(b.p) - score(a.p) || a.d - b.d)
    .slice(0, limit)
    .map((x) => x.p);
}

/**
 * Hotels for two or more areas shown side by side, with no property appearing
 * twice.
 *
 * On a page whose whole argument is Union Station versus RiNo, listing The
 * Rally Hotel under RiNo — it is 0.86 miles from RiNo's center and 0.2 from
 * LoDo's — makes the comparison look like it doesn't know its own city. Each
 * candidate is assigned to whichever of the given areas it is actually closest
 * to, then ranked within it.
 */
export function hotelsInAreas(
  pool: Place[],
  areaSlugs: string[],
  { limit = 5 }: AreaHotelOptions = {}
): Record<string, Place[]> {
  const centers = areaSlugs
    .map((slug) => ({ slug, area: getNeighborhood(slug) }))
    .filter((x): x is { slug: string; area: NonNullable<ReturnType<typeof getNeighborhood>> } => !!x.area);

  const buckets = new Map<string, { p: Place; d: number }[]>(centers.map((c) => [c.slug, []]));

  for (const p of candidates(pool)) {
    let best: { slug: string; d: number } | null = null;
    for (const c of centers) {
      const d = haversineMiles(p.lat as number, p.lng as number, c.area.lat, c.area.lng);
      if (!best || d < best.d) best = { slug: c.slug, d };
    }
    if (!best) continue;
    const radius = RADIUS_MILES[best.slug] ?? DEFAULT_RADIUS_MILES;
    if (best.d <= radius) buckets.get(best.slug)!.push({ p, d: best.d });
  }

  const out: Record<string, Place[]> = {};
  for (const [slug, list] of buckets) out[slug] = rank(list, limit);
  return out;
}

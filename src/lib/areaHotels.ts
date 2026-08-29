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
  lodo: 0.7,
  downtown: 0.7,
  "golden-triangle": 0.7,
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

  const near = pool
    .filter((p) => p.lat != null && p.lng != null)
    .filter((p) => p.expedia_affiliate_url)
    .filter((p) => p.rating != null)
    .map((p) => ({ p, d: haversineMiles(p.lat as number, p.lng as number, area.lat, area.lng) }))
    .filter((x) => x.d <= radius);

  // Prefer properties with enough reviews to mean something, but don't return
  // nothing in a thin area just to hold the line on review count.
  const wellReviewed = near.filter((x) => (x.p.review_count ?? 0) >= MIN_REVIEWS);
  const pick = wellReviewed.length >= 3 ? wellReviewed : near;

  return pick
    .sort(
      (a, b) =>
        (b.p.rating ?? 0) - (a.p.rating ?? 0) ||
        (b.p.review_count ?? 0) - (a.p.review_count ?? 0) ||
        a.d - b.d
    )
    .slice(0, limit)
    .map((x) => x.p);
}

// Picks the venue lodging guide nearest to a given place.
//
// Used to link each hotel detail page across to the venue guide a guest is
// most likely to want, rather than dumping everyone on the /hotels hub.
//
// This is a straight-line calculation used only to CHOOSE a link. It is not a
// distance or walk time and is never displayed as one — a straight line is a
// poor proxy for a real walking route in a city cut by rail lines, Speer and
// Cherry Creek, which is exactly why no measured figure appears here.

export interface Venue {
  href: string;
  /** How the link reads in context: "Where to stay for {label}". */
  label: string;
  lat: number;
  lng: number;
}

export const VENUES: Venue[] = [
  { href: "/hotels/near-coors-field", label: "a Rockies game", lat: 39.7559, lng: -104.9942 },
  { href: "/hotels/near-ball-arena", label: "a Nuggets or Avalanche game", lat: 39.7486, lng: -105.0076 },
  { href: "/hotels/near-empower-field", label: "a Broncos game", lat: 39.7439, lng: -105.0201 },
  { href: "/hotels/near-mission-ballroom", label: "a Mission Ballroom show", lat: 39.7706, lng: -104.9781 },
  { href: "/hotels/near-fiddlers-green", label: "a Fiddler's Green show", lat: 39.5990, lng: -104.8918 },
  { href: "/hotels/near-convention-center", label: "a Convention Center conference", lat: 39.7434, lng: -104.9950 },
  { href: "/hotels/near-national-western", label: "the National Western Stock Show", lat: 39.7796, lng: -104.9711 },
  { href: "/hotels/near-denver-airport", label: "an early flight out of DEN", lat: 39.8561, lng: -104.6737 },
  { href: "/hotels/near-red-rocks", label: "a Red Rocks concert", lat: 39.6654, lng: -105.2057 },
  { href: "/hotels/near-denver-zoo", label: "a Denver Zoo day", lat: 39.7496, lng: -104.9494 },
  { href: "/hotels/near-city-park", label: "City Park and the museum", lat: 39.7476, lng: -104.9505 },
  { href: "/hotels/near-botanic-gardens", label: "the Botanic Gardens", lat: 39.7320, lng: -104.9614 },
  { href: "/hotels/near-elitch-gardens", label: "a day at Elitch Gardens", lat: 39.7500, lng: -105.0090 },
  { href: "/hotels/near-cherry-creek", label: "Cherry Creek", lat: 39.7180, lng: -104.9530 },
  { href: "/hotels/near-anschutz", label: "a stay near Anschutz", lat: 39.7447, lng: -104.8386 },
];

/** Great-circle distance in kilometres. */
function haversineKm(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const R = 6371;
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLng = ((bLng - aLng) * Math.PI) / 180;
  const p1 = (aLat * Math.PI) / 180;
  const p2 = (bLat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/**
 * The venue guides nearest to a point, closest first.
 *
 * Returns an empty array when coordinates are missing, so callers can simply
 * skip the module rather than render a wrong or arbitrary link. Ties break on
 * href so the same hotel always renders the same links across rebuilds.
 */
export function nearestVenues(
  lat: number | null | undefined,
  lng: number | null | undefined,
  limit = 2
): Venue[] {
  if (lat == null || lng == null) return [];
  return [...VENUES]
    .map((v) => ({ v, d: haversineKm(lat, lng, v.lat, v.lng) }))
    .sort((a, b) => a.d - b.d || (a.v.href < b.v.href ? -1 : 1))
    .slice(0, limit)
    .map((x) => x.v);
}

// ---------------------------------------------------------------------------
// Distance tables for the venue lodging guides.
//
// Read the method note before changing anything here. These are STRAIGHT-LINE
// distances from stored coordinates. They are not walking distances and not
// walk times, and the pages that render them say so in the same breath.
//
// The distinction is load-bearing in Denver: the Consolidated Main Line rail
// corridor, Speer Boulevard, Cherry Creek and the Platte all sit between the
// downtown hotel clusters and several of these venues, and pedestrians cross
// them only at specific bridges. Real routes run longer than the straight line
// by varying amounts, and the ORDER can change — a hotel closer as the crow
// flies can be further on foot if it is on the wrong side of a crossing.
// ---------------------------------------------------------------------------

export const MI_PER_KM = 0.621371;

export function straightLineMi(
  lat: number | null | undefined,
  lng: number | null | undefined,
  venue: { lat: number; lng: number }
): number | null {
  if (lat == null || lng == null) return null;
  return haversineKm(lat, lng, venue.lat, venue.lng) * MI_PER_KM;
}

export type Band = "close" | "walkable" | "train";

export function band(mi: number): Band {
  if (mi <= 0.5) return "close";
  if (mi <= 0.9) return "walkable";
  return "train";
}

export const BANDS: Record<Band, { label: string; note: string }> = {
  close: {
    label: "Genuinely close",
    note: "Under half a mile in a straight line. A short walk on any sensible route.",
  },
  walkable: {
    label: "Walkable — but the crossing decides",
    note: "Half a mile to nine-tenths. Fine on foot in daylight, though this is the band where the rail corridor and Speer decide whether it is a 15-minute walk or a 25-minute one.",
  },
  train: {
    label: "Take the train",
    note: "Nine-tenths of a mile and up in a straight line, which usually means comfortably over a mile on foot.",
  },
};

export interface RankedHotel<T> {
  place: T;
  mi: number;
  band: Band;
}

/** Hotels nearest a venue, closest first. Ties break on name so builds are stable. */
export function rankHotelsByVenue<T extends { name: string; lat: number | null; lng: number | null }>(
  places: T[],
  venue: { lat: number; lng: number },
  limit = 20
): RankedHotel<T>[] {
  return places
    .map((place) => {
      const mi = straightLineMi(place.lat, place.lng, venue);
      return mi == null ? null : { place, mi, band: band(mi) };
    })
    .filter((x): x is RankedHotel<T> => x !== null)
    .sort((a, b) => a.mi - b.mi || (a.place.name < b.place.name ? -1 : 1))
    .slice(0, limit);
}

/** Look up a venue's coordinates by its guide href. */
export function venueByHref(href: string): Venue | undefined {
  return VENUES.find((v) => v.href === href);
}

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

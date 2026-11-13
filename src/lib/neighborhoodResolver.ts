// Which site neighborhood a place belongs to, from its coordinates.
//
// Places used to be filed under whichever neighborhood's Google search found
// them, and those searches use radii up to 8 km. That put a Thornton water park
// under Washington Park and Chatfield under Five Points. This uses Denver's 78
// official statistical neighborhoods instead (simplified polygons in
// data/denver-neighborhoods.json, from Denver Open Data via the GeoDa Center),
// each mapped to one of the site's neighborhoods.
//
// Server-only: the polygon data is ~30 KB and has no business in client
// bundles, which is why this isn't in neighborhoods.ts (imported by the nav).

import data from "./data/denver-neighborhoods.json";
import { getNeighborhood, distanceFromDowntownKm, METRO_RADIUS_KM } from "./neighborhoods";

type Ring = [number, number][]; // [lng, lat]
interface OfficialNeighborhood {
  name: string;
  site: string;
  /** Official areas that span several site neighborhoods; split by nearest center. */
  split: boolean;
  polygons: Ring[][]; // polygon -> rings (first ring outer, rest holes)
}

const OFFICIAL = data as unknown as OfficialNeighborhood[];

/**
 * Official Five Points covers the Ballpark, RiNo, Curtis Park and the Welton
 * Street corridor. Its street grid runs at about 45 degrees, so it's split in
 * grid coordinates measured from the Larimer St line at 25th St: `t` runs
 * along Larimer (km, + toward 38th St), `s` across it (km, + toward the
 * railyards). Calibrated on known places: Larimer bars sit at s 0 to 0.05,
 * Curtis/Champa/Stout at -0.2 to -0.5, Welton at -0.6 to -0.75, and the
 * Ballpark blocks (Star Bar, McGregor Square) at t below -0.2.
 */
const LARIMER_25TH = { lat: 39.757, lng: -104.987 };
function splitFivePoints(lat: number, lng: number): string {
  const x = (lng - LARIMER_25TH.lng) * 85; // km east
  const y = (lat - LARIMER_25TH.lat) * 111; // km north
  const len = Math.hypot(0.013 * 85, 0.01 * 111);
  const ux = (0.013 * 85) / len;
  const uy = (0.01 * 111) / len;
  const t = x * ux + y * uy;
  const s = -x * uy + y * ux;
  if (s < -0.55) return "five-points";
  if (t < -0.15) return "lodo";
  if (s < -0.15) return "curtis-park";
  return "rino";
}

/** Denver Tech Center: mostly outside Denver (Greenwood Village, Centennial). */
const DTC_CENTER = { lat: 39.627, lng: -104.897 };
const DTC_RADIUS_KM = 5;

function inRing(lng: number, lat: number, ring: Ring): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > lat !== yj > lat && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

function inPolygon(lng: number, lat: number, rings: Ring[]): boolean {
  if (!rings.length || !inRing(lng, lat, rings[0])) return false;
  return !rings.slice(1).some((hole) => inRing(lng, lat, hole));
}

function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** The official Denver neighborhood a point falls in, or null outside the city. */
export function officialNeighborhood(lat: number, lng: number): OfficialNeighborhood | null {
  return OFFICIAL.find((n) => n.polygons.some((rings) => inPolygon(lng, lat, rings))) ?? null;
}

/** Beyond the metro radius: a day trip, or out of area entirely. */
export function isFarFromDenver(lat: number | null, lng: number | null): boolean {
  if (lat == null || lng == null) return false;
  return distanceFromDowntownKm(lat, lng) > METRO_RADIUS_KM;
}

/**
 * The site neighborhood for a point.
 *  1. Inside Denver: the official neighborhood's site neighborhood. Official
 *     Five Points is split by the street grid (splitFivePoints).
 *  2. Outside Denver, in order: the airport hotel strip (Tower Rd, Peña Station,
 *     Gaylord Rockies), the Tech Center, Edgewater (Sloan's Lake), Glendale
 *     (Cherry Creek), day trips (beyond the metro radius), then the Greater
 *     Denver Area catch-all. Out-of-area places are hidden by isOutOfArea().
 * Returns `fallback` when the place has no coordinates.
 */
export function resolveNeighborhood(lat: number | null, lng: number | null, fallback?: string | null): string | null {
  if (lat == null || lng == null) return fallback ?? null;

  const official = officialNeighborhood(lat, lng);
  if (official) {
    return official.split ? splitFivePoints(lat, lng) : official.site;
  }

  // Tower Rd / I-70 hotels sit as far south as ~39.76.
  if (lat > 39.758 && lng > -104.83 && lng < -104.6 && lat < 39.92) return "airport";
  if (distanceKm(lat, lng, DTC_CENTER.lat, DTC_CENTER.lng) <= DTC_RADIUS_KM) return "tech-center";
  if (lat >= 39.742 && lat <= 39.765 && lng >= -105.078 && lng <= -105.052) return "sloan-lake"; // Edgewater
  const cc = getNeighborhood("cherry-creek");
  if (cc && distanceKm(lat, lng, cc.lat, cc.lng) <= 2.2) return "cherry-creek"; // Glendale
  if (distanceFromDowntownKm(lat, lng) > METRO_RADIUS_KM) return "day-trips";
  return "denver-suburbs";
}

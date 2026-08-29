// Routed walking distances from Denver hotels to venues.
//
// METHOD — stated here and on every page that renders it:
// These are street-network WALKING distances produced by OSRM pedestrian
// routing over OpenStreetMap data (routing.openstreetmap.de, foot profile),
// measured from each hotel's stored coordinates to the venue entrance. They
// follow real pavements and crossings, so they account for the things that
// make straight-line distance useless in Denver: the Consolidated Main Line
// rail corridor, Speer Boulevard, Cherry Creek and the Platte, which
// pedestrians cross only at specific bridges.
//
// They are routed, not walked. Nobody has timed these on foot. Walk times are
// derived from distance at a stated 3 mph, not reported by the router, so the
// assumption is visible rather than buried in a routing engine's defaults.
//
// Why this was worth doing: against straight-line distance the routed figures
// run 23–82% longer, and the ORDER changes. SpringHill Suites is the closest
// hotel either way, but its straight-line 0.20 mi becomes 0.36 mi on foot —
// an 82% penalty — because the rail corridor forces a detour. Any guide
// publishing straight-line numbers as walk times is wrong by a quarter to a
// half, and wrong unevenly.
//
// Data © OpenStreetMap contributors, ODbL. Routing by OSRM.

/** Metres, routed on foot. Keyed by venue guide href, then hotel slug. */
export const VENUE_WALK_METRES: Record<string, Record<string, number>> = {
  "/hotels/near-coors-field": {
    "the-rally-hotel-at-mcgregor-square": 198,
    "the-maven-hotel-at-dairy-block": 412,
    "limelight-denver": 825,
    "hotel-indigo-denver-downtown-union-station-by-ihg": 853,
    "the-westin-denver-downtown": 963,
    "hyatt-centric-downtown-denver": 1101,
    "residence-inn-by-marriott-denver-city-center": 1123,
    "renaissance-denver-downtown-city-center-hotel": 1238,
    "hilton-denver-city-center": 1282,
    "courtyard-by-marriott-denver-downtown": 1286,
    "hotel-teatro": 1408,
    "four-seasons-hotel-denver": 1408,
    "springhill-suites-by-marriott-denver-downtown": 1454,
    "the-curtis-denver---a-doubletree-by-hilton-hotel": 1485,
    "holiday-inn-express-denver-downtown-by-ihg": 1522,
    "home2-by-hilton-denver-downtown-convention-center": 1543,
    "tru-by-hilton-denver-downtown-convention-center": 1544,
    "aloft-by-marriott-denver-downtown": 1582,
    "warwick-denver": 1727,
    "embassy-suites-by-hilton-denver-downtown-convention-center": 1749,
    "homewood-suites-by-hilton-denver-downtown-convention-center": 1794,
    "hampton-inn-suites-denver-downtown-convention-center": 1799,
    "hyatt-regency-denver-at-colorado-convention-center": 1837,
    "sheraton-denver-downtown-hotel": 1891,
    "hilton-garden-inn-denver-downtown": 1908,
    "sonesta-denver-downtown": 1914,
    "hyatt-place-denverdowntown": 1968,
    "hyatt-house-denverdowntown": 1970,
    "the-slate-hotel-denver-downtown-tapestry-by-hilton": 2155,
  },
  "/hotels/near-ball-arena": {
    "springhill-suites-by-marriott-denver-downtown": 586,
    "limelight-denver": 936,
    "hotel-teatro": 1038,
    "four-seasons-hotel-denver": 1078,
    "the-curtis-denver---a-doubletree-by-hilton-hotel": 1218,
    "hotel-indigo-denver-downtown-union-station-by-ihg": 1245,
    "the-westin-denver-downtown": 1320,
    "the-maven-hotel-at-dairy-block": 1359,
    "courtyard-by-marriott-denver-downtown": 1452,
    "embassy-suites-by-hilton-denver-downtown-convention-center": 1493,
    "home2-by-hilton-denver-downtown-convention-center": 1506,
    "aloft-by-marriott-denver-downtown": 1506,
    "the-rally-hotel-at-mcgregor-square": 1527,
    "tru-by-hilton-denver-downtown-convention-center": 1577,
    "renaissance-denver-downtown-city-center-hotel": 1629,
    "hyatt-regency-denver-at-colorado-convention-center": 1663,
    "hilton-garden-inn-denver-downtown": 1696,
    "hampton-inn-suites-denver-downtown-convention-center": 1717,
    "hyatt-place-denverdowntown": 1722,
    "homewood-suites-by-hilton-denver-downtown-convention-center": 1723,
    "hyatt-house-denverdowntown": 1724,
    "residence-inn-by-marriott-denver-city-center": 1746,
    "hyatt-centric-downtown-denver": 1809,
    "sonesta-denver-downtown": 1839,
    "the-slate-hotel-denver-downtown-tapestry-by-hilton": 1852,
    "hilton-denver-city-center": 2003,
    "sheraton-denver-downtown-hotel": 2097,
    "holiday-inn-express-denver-downtown-by-ihg": 2223,
    "warwick-denver": 2696,
  },
};

/** When each venue's routing was last run. Shown on the page. */
export const VENUE_WALK_DATED: Record<string, string> = {
  "/hotels/near-coors-field": "2026-08-29",
  "/hotels/near-ball-arena": "2026-08-29",
};

export const METRES_PER_MILE = 1609.34;
/** Walking pace used to derive times from distance. Stated on the page. */
export const WALK_MPH = 3;

export function walkMetres(venueHref: string, hotelSlug: string): number | null {
  return VENUE_WALK_METRES[venueHref]?.[hotelSlug] ?? null;
}

export function metresToMiles(m: number): number {
  return m / METRES_PER_MILE;
}

export function walkMinutes(metres: number): number {
  return Math.round((metresToMiles(metres) / WALK_MPH) * 60);
}

export type WalkBand = "short" | "real" | "wheels" | "ride";

/** Bands on routed distance — the number people actually walk. */
export function walkBand(metres: number): WalkBand {
  const mi = metresToMiles(metres);
  if (mi <= 0.75) return "short";
  if (mi <= 1.5) return "real";
  if (mi <= 2) return "wheels";
  return "ride";
}

export const WALK_BANDS: Record<WalkBand, { label: string; note: string }> = {
  short: {
    label: "Walk it",
    note: "Under 0.75 miles on foot, about fifteen minutes at a normal pace. Walk it and don't think about parking.",
  },
  real: {
    label: "A real walk, not a stroll",
    note: "0.75 to 1.5 miles — fifteen to thirty minutes each way. Fine before a game on a decent evening. Less fun at eleven at night in February, in the wrong shoes, after a few beers.",
  },
  wheels: {
    label: "Grab a scooter or a bike",
    note: "1.5 to 2 miles. That's a long walk and a very short ride. Lime and Bird scooters are thick on the ground across downtown and LoDo, and the B-cycle docks cover most of this ground too — five minutes and a couple of dollars instead of half an hour on foot.",
  },
  ride: {
    label: "Uber or Lyft",
    note: "Over 2 miles. Just get a car. Light rail only helps if your hotel is near a station too, and Denver's system is good along a few corridors and no use off them — so check your specific hotel rather than assuming downtown means connected.",
  },
};

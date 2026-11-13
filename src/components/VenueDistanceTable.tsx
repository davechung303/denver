import HotelRouteTable from "@/components/HotelRouteTable";
import {
  walkMetres,
  metresToMiles,
  walkMinutes,
  walkBand,
  WALK_BANDS,
  WALK_MPH,
  VENUE_WALK_DATED,
  type WalkBand,
} from "@/lib/venueWalks";
import type { Place } from "@/lib/places";

/**
 * Walking-distance table for a venue lodging guide.
 *
 * Renders routed pedestrian distances where we have them and says exactly how
 * they were produced. Hotels without a routed figure are left out rather than
 * shown with a straight-line estimate dressed up as a walk — a straight line
 * runs 23–82% short in this city, and unevenly, so mixing the two would make
 * the table worse than having none.
 */
export default function VenueDistanceTable({
  venueName,
  venueHref,
  hotels,
  transitNote,
}: {
  venueName: string;
  /** Guide href, used to look up the routed dataset. */
  venueHref: string;
  hotels: Place[];
  transitNote?: string;
}) {
  const rows = hotels
    .map((place) => {
      const m = walkMetres(venueHref, place.slug);
      return m == null ? null : { place, m };
    })
    .filter((r): r is { place: Place; m: number } => r !== null)
    .sort((a, b) => a.m - b.m || (a.place.name < b.place.name ? -1 : 1));

  if (rows.length === 0) return null;

  const dated = VENUE_WALK_DATED[venueHref];
  // Some venues sit a long way from every hotel in the set — National Western
  // has forty-odd properties in the rideshare band alone. Listing all of them
  // buries the useful rows, so each band shows the nearest few and says how
  // many it left out rather than pretending the rest don't exist.
  const PER_BAND = 12;
  const groups = (["short", "real", "wheels", "ride"] as WalkBand[])
    .map((b) => {
      const all = rows.filter((r) => walkBand(r.m) === b);
      return { band: b, rows: all.slice(0, PER_BAND), hidden: all.length - Math.min(all.length, PER_BAND) };
    })
    .filter((g) => g.rows.length > 0);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-b border-rule dark:border-white/10">
      <h2 className="text-2xl font-bold mb-2">
        How far is each hotel from {venueName}, on foot?
      </h2>
      <p className="text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
        {`${rows.length} hotels`}, routed along real sidewalks and crossings rather than measured as the crow flies.
        The difference matters here: straight-line distance runs 23&ndash;82% short in this part of Denver, because
        the rail corridor and Speer force detours you cannot see on a map pin.
      </p>

      <div className="mt-8 space-y-10">
        {groups.map((g, gi) => (
          <div key={g.band}>
            <h3 className="text-lg font-bold">{WALK_BANDS[g.band].label}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-4 max-w-3xl leading-relaxed">
              {WALK_BANDS[g.band].note}
              {g.band === "ride" && transitNote ? ` ${transitNote}` : ""}
              {g.hidden > 0
                ? ` Showing the ${g.rows.length} closest; ${g.hidden} more fall in this band and get further out from here.`
                : ""}
            </p>
            <HotelRouteTable
              rows={g.rows.map((r) => ({ place: r.place, primary: `${walkMinutes(r.m)} min`, secondary: `${metresToMiles(r.m).toFixed(2)} mi` }))}
              primaryLabel="Walk"
              secondaryLabel="Distance"
              thumbs={gi === 0}
            />
          </div>
        ))}
      </div>

      {/* The method statement is what makes this citable — and what keeps it honest. */}
      <div className="mt-10 method-note">
        <h3>How these numbers were produced</h3>
        <p>
          Street-network walking distances from each hotel to the {venueName}{" "}entrance, routed over OpenStreetMap
          pedestrian data with OSRM&apos;s foot profile{dated ? `, run on ${new Date(dated + "T12:00:00Z").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" })}` : ""}.
          Times are derived from distance at a steady {WALK_MPH}{" "}mph, so you can adjust for your own pace rather than
          trusting a routing engine&apos;s hidden default.
        </p>
        <p>
          These are <strong>routed, not walked</strong> &mdash; nobody has stood there with a stopwatch. They follow
          real sidewalks and crossings, which is why they run so much longer than the straight-line figures other
          guides publish, but they cannot know about a closed sidewalk or a queue at a crossing on the night.
        </p>
        <p className="text-xs">
          Distance data ©{" "}
          <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">
            OpenStreetMap contributors
          </a>
          , ODbL. Routing by OSRM.
        </p>
      </div>
    </section>
  );
}

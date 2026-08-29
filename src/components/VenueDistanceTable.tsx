import Link from "next/link";
import { expediaDenverHotelsUrl } from "@/lib/travelpayouts";
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
  const groups = (["short", "real", "train"] as WalkBand[])
    .map((b) => ({ band: b, rows: rows.filter((r) => walkBand(r.m) === b) }))
    .filter((g) => g.rows.length > 0);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-b border-slate-100 dark:border-slate-800">
      <h2 className="text-2xl font-bold mb-2">
        How far is each downtown hotel from {venueName}, on foot?
      </h2>
      <p className="text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
        {rows.length} hotels, routed along real pavements and crossings rather than measured as the crow flies.
        The difference matters here: straight-line distance runs 23&ndash;82% short in this part of Denver, because
        the rail corridor and Speer force detours you cannot see on a map pin.
      </p>

      <div className="mt-8 space-y-10">
        {groups.map((g) => (
          <div key={g.band}>
            <h3 className="text-base font-bold">{WALK_BANDS[g.band].label}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-4 max-w-3xl leading-relaxed">
              {WALK_BANDS[g.band].note}
              {g.band === "train" && transitNote ? ` ${transitNote}` : ""}
            </p>
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-900">
                  <tr>
                    <th className="text-left font-semibold px-4 py-3 text-slate-500 dark:text-slate-400 uppercase tracking-wide text-xs">Hotel</th>
                    <th className="text-left font-semibold px-4 py-3 text-slate-500 dark:text-slate-400 uppercase tracking-wide text-xs whitespace-nowrap">Walk</th>
                    <th className="text-left font-semibold px-4 py-3 text-slate-500 dark:text-slate-400 uppercase tracking-wide text-xs whitespace-nowrap">Distance</th>
                    <th className="text-left font-semibold px-4 py-3 text-slate-500 dark:text-slate-400 uppercase tracking-wide text-xs whitespace-nowrap">Rating</th>
                    <th className="text-left font-semibold px-4 py-3 text-slate-500 dark:text-slate-400 uppercase tracking-wide text-xs">Rates</th>
                  </tr>
                </thead>
                <tbody>
                  {g.rows.map(({ place, m }) => (
                    <tr key={place.place_id} className="border-t border-slate-100 dark:border-slate-800">
                      <td className="px-4 py-3 font-medium">
                        <Link
                          href={`/denver/${place.neighborhood_slug}/hotels/${place.slug}`}
                          className="hover:text-denver-amber transition-colors"
                        >
                          {place.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3 tabular-nums whitespace-nowrap font-semibold">
                        {walkMinutes(m)} min
                      </td>
                      <td className="px-4 py-3 tabular-nums whitespace-nowrap text-slate-600 dark:text-slate-400">
                        {metresToMiles(m).toFixed(2)} mi
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-slate-600 dark:text-slate-400">
                        {place.rating ? `★ ${place.rating.toFixed(1)}` : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <a
                          href={place.expedia_affiliate_url ?? expediaDenverHotelsUrl()}
                          target="_blank"
                          rel="noopener noreferrer sponsored"
                          className="text-denver-amber hover:underline font-medium whitespace-nowrap"
                        >
                          Check rates &rarr;
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {/* The method statement is what makes this citable — and what keeps it honest. */}
      <div className="mt-8 max-w-3xl rounded-xl bg-slate-50 dark:bg-slate-900 p-5">
        <h3 className="text-sm font-bold mb-2">How these numbers were produced</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Street-network walking distances from each hotel to the {venueName} entrance, routed over OpenStreetMap
          pedestrian data with OSRM&apos;s foot profile{dated ? `, run on ${new Date(dated + "T12:00:00Z").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" })}` : ""}.
          Times are derived from distance at a steady {WALK_MPH} mph, so you can adjust for your own pace rather than
          trusting a routing engine&apos;s hidden default.
        </p>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          These are <strong>routed, not walked</strong> &mdash; nobody has stood there with a stopwatch. They follow
          real pavements and crossings, which is why they run so much longer than the straight-line figures other
          guides publish, but they cannot know about a closed sidewalk or a queue at a crossing on the night.
        </p>
        <p className="mt-3 text-xs text-slate-400">
          Distance data ©{" "}
          <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="underline hover:text-denver-amber transition-colors">
            OpenStreetMap contributors
          </a>
          , ODbL. Routing by OSRM.
        </p>
      </div>
    </section>
  );
}

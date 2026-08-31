import Link from "next/link";
import { expediaDenverHotelsUrl } from "@/lib/travelpayouts";
import {
  RED_ROCKS_DRIVE,
  RED_ROCKS_DRIVE_DATED,
  DRIVE_BANDS,
  driveBand,
  driveMinutes,
  driveMiles,
  type DriveBand,
} from "@/lib/venueDrives";
import { photoUrl, type Place } from "@/lib/places";

/**
 * Drive-time table for Red Rocks.
 *
 * The walk table refuses to render here — correctly, since nothing at Red Rocks
 * is within walking distance of a hotel — which left the page with no distance
 * data at all. Driving is the real question here, so this answers it, with the
 * free-flow caveat stated rather than buried.
 */
export default function VenueDriveTable({ hotels }: { hotels: Place[] }) {
  const rows = hotels
    .map((place) => {
      const d = RED_ROCKS_DRIVE[place.slug];
      return d ? { place, m: d[0], s: d[1] } : null;
    })
    .filter((r): r is { place: Place; m: number; s: number } => r !== null)
    .sort((a, b) => a.s - b.s || (a.place.name < b.place.name ? -1 : 1));

  if (rows.length === 0) return null;

  const PER_BAND = 12;
  const groups = (["close", "west", "central", "far"] as DriveBand[])
    .map((b) => {
      const all = rows.filter((r) => driveBand(r.s) === b);
      return { band: b, rows: all.slice(0, PER_BAND), hidden: all.length - Math.min(all.length, PER_BAND) };
    })
    .filter((g) => g.rows.length > 0);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-b border-slate-100 dark:border-slate-800">
      <h2 className="text-2xl font-bold mb-2">How long is the drive to Red Rocks from each hotel?</h2>
      <p className="text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
        {rows.length} hotels, routed over the real road network to the Red Rocks parking area. Nobody walks to
        Red Rocks, so this is the table that matters &mdash; and the headline number is that{" "}
        <strong className="text-slate-900 dark:text-slate-100">downtown Denver is a 28-minute drive</strong>, only
        about thirteen minutes more than the closest hotel in the metro. Proximity buys you far less here than
        people assume.
      </p>

      <div className="mt-8 space-y-10">
        {groups.map((g) => (
          <div key={g.band}>
            <h3 className="text-base font-bold">{DRIVE_BANDS[g.band].label}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-4 max-w-3xl leading-relaxed">
              {DRIVE_BANDS[g.band].note}
              {g.hidden > 0
                ? ` Showing the ${g.rows.length} closest; ${g.hidden} more fall in this band.`
                : ""}
            </p>
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-900">
                  <tr>
                    <th className="text-left font-semibold px-4 py-3 text-slate-500 dark:text-slate-400 uppercase tracking-wide text-xs">Hotel</th>
                    <th className="text-left font-semibold px-4 py-3 text-slate-500 dark:text-slate-400 uppercase tracking-wide text-xs whitespace-nowrap">Drive</th>
                    <th className="text-left font-semibold px-4 py-3 text-slate-500 dark:text-slate-400 uppercase tracking-wide text-xs whitespace-nowrap">Distance</th>
                    <th className="text-left font-semibold px-4 py-3 text-slate-500 dark:text-slate-400 uppercase tracking-wide text-xs whitespace-nowrap">Rating</th>
                    <th className="text-left font-semibold px-4 py-3 text-slate-500 dark:text-slate-400 uppercase tracking-wide text-xs">Rates</th>
                  </tr>
                </thead>
                <tbody>
                  {g.rows.map(({ place, m, s }) => (
                    <tr key={place.place_id} className="group/row border-t border-slate-100 dark:border-slate-800 hover:bg-slate-50/70 dark:hover:bg-slate-900/40 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3 min-w-[17rem]">
                          <Link
                            href={`/denver/${place.neighborhood_slug}/hotels/${place.slug}`}
                            aria-label={place.name}
                            className="relative w-14 h-14 shrink-0 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800"
                          >
                            {place.photos?.[0] ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={photoUrl(place.photos[0])}
                                alt={place.name}
                                loading="lazy"
                                className="w-full h-full object-cover group-hover/row:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full bg-slate-200 dark:bg-slate-700" />
                            )}
                          </Link>
                          <div className="min-w-0">
                            <Link
                              href={`/denver/${place.neighborhood_slug}/hotels/${place.slug}`}
                              className="font-medium leading-snug hover:text-denver-amber transition-colors"
                            >
                              {place.name}
                            </Link>
                            {place.review_summary?.tagline && (
                              <p className="mt-0.5 text-xs leading-snug text-slate-500 dark:text-slate-400 line-clamp-1 first-letter:uppercase">
                                {place.review_summary.tagline}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 align-middle tabular-nums whitespace-nowrap font-semibold">
                        {driveMinutes(s)} min
                      </td>
                      <td className="px-4 py-3 align-middle tabular-nums whitespace-nowrap text-slate-600 dark:text-slate-400">
                        {driveMiles(m).toFixed(1)} mi
                      </td>
                      <td className="px-4 py-3 align-middle whitespace-nowrap text-slate-600 dark:text-slate-400">
                        {place.rating ? `★ ${place.rating.toFixed(1)}` : "—"}
                      </td>
                      <td className="px-4 py-3 align-middle">
                        <a
                          href={place.expedia_affiliate_url ?? expediaDenverHotelsUrl()}
                          target="_blank"
                          rel="noopener noreferrer sponsored"
                          className="inline-flex items-center rounded-full bg-denver-amber/10 px-3 py-1.5 text-xs font-semibold text-denver-amber whitespace-nowrap hover:bg-denver-amber hover:text-white transition-colors"
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

      <div className="mt-8 max-w-3xl rounded-xl bg-slate-50 dark:bg-slate-900 p-5">
        <h3 className="text-sm font-bold mb-2">How these numbers were produced &mdash; and what they leave out</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Road-network driving routes from each hotel to the Red Rocks parking area, computed over OpenStreetMap
          with OSRM&apos;s car profile on{" "}
          {new Date(RED_ROCKS_DRIVE_DATED + "T12:00:00Z").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" })}.
        </p>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          <strong>These are free-flow times.</strong> The routing engine models speed limits and road types. It has
          no idea that Red Rocks holds 9,525 people, that the venue says roughly ten thousand of them arrive at
          once, or that a Denver councilmember put the share who drive at{" "}
          <a href="https://denverite.com/2024/04/03/red-rocks-bus-train-rtd-denver/" target="_blank" rel="noopener noreferrer" className="underline hover:text-denver-amber transition-colors">
            over 90%, often one to a car
          </a>
          . Read these as a Tuesday-at-noon baseline, then add for the show.
        </p>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          We deliberately do not publish a show-night multiplier. We went looking for a sourced figure for how long
          ingress or egress actually takes on a sold-out night and there isn&apos;t one &mdash; every number circulating
          traces back to shuttle and ticket-resale marketing with no methodology behind it. We would rather tell you
          the baseline is a baseline than invent the part we cannot measure.
        </p>
        <p className="mt-3 text-xs text-slate-400">
          Route data ©{" "}
          <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="underline hover:text-denver-amber transition-colors">
            OpenStreetMap contributors
          </a>
          , ODbL. Routing by OSRM.
        </p>
      </div>
    </section>
  );
}

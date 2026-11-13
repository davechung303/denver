import HotelRouteTable from "@/components/HotelRouteTable";
import {
  RED_ROCKS_DRIVE,
  RED_ROCKS_DRIVE_DATED,
  DRIVE_BANDS,
  driveBand,
  driveMinutes,
  driveMiles,
  type DriveBand,
} from "@/lib/venueDrives";
import type { Place } from "@/lib/places";

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
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-b border-rule dark:border-white/10">
      <h2 className="text-2xl font-bold mb-2">How long is the drive to Red Rocks from each hotel?</h2>
      <p className="text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
        {rows.length} hotels, routed over the real road network to the Red Rocks parking area. Nobody walks to
        Red Rocks, so this is the table that matters &mdash; and the headline number is that{" "}
        <strong className="text-slate-900 dark:text-slate-100">downtown Denver is a 28-minute drive</strong>, only
        about thirteen minutes more than the closest hotel in the metro. Proximity buys you far less here than
        people assume.
      </p>

      <div className="mt-8 space-y-10">
        {groups.map((g, gi) => (
          <div key={g.band}>
            <h3 className="text-lg font-bold">{DRIVE_BANDS[g.band].label}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-4 max-w-3xl leading-relaxed">
              {DRIVE_BANDS[g.band].note}
              {g.hidden > 0
                ? ` Showing the ${g.rows.length} closest; ${g.hidden} more fall in this band.`
                : ""}
            </p>
            <HotelRouteTable
              rows={g.rows.map((r) => ({ place: r.place, primary: `${driveMinutes(r.s)} min`, secondary: `${driveMiles(r.m).toFixed(1)} mi` }))}
              primaryLabel="Drive"
              secondaryLabel="Distance"
              thumbs={gi === 0}
            />
          </div>
        ))}
      </div>

      <div className="mt-10 method-note">
        <h3>How these numbers were produced &mdash; and what they leave out</h3>
        <p>
          Road-network driving routes from each hotel to the Red Rocks parking area, computed over OpenStreetMap
          with OSRM&apos;s car profile on{" "}
          {new Date(RED_ROCKS_DRIVE_DATED + "T12:00:00Z").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" })}.
        </p>
        <p>
          <strong>These are free-flow times.</strong> The routing engine models speed limits and road types. It has
          no idea that Red Rocks holds 9,525 people, that the venue says roughly ten thousand of them arrive at
          once, or that a Denver councilmember put the share who drive at{" "}
          <a href="https://denverite.com/2024/04/03/red-rocks-bus-train-rtd-denver/" target="_blank" rel="noopener noreferrer">
            over 90%, often one to a car
          </a>
          . Read these as a Tuesday-at-noon baseline, then add for the show.
        </p>
        <p>
          We deliberately do not publish a show-night multiplier. We went looking for a sourced figure for how long
          ingress or egress actually takes on a sold-out night and there isn&apos;t one &mdash; every number circulating
          traces back to shuttle and ticket-resale marketing with no methodology behind it. We would rather tell you
          the baseline is a baseline than invent the part we cannot measure.
        </p>
        <p className="text-xs">
          Route data ©{" "}
          <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">
            OpenStreetMap contributors
          </a>
          , ODbL. Routing by OSRM.
        </p>
      </div>
    </section>
  );
}

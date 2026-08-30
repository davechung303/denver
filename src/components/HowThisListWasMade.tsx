import Link from "next/link";

/**
 * Methodology note for any page that ranks or recommends places.
 *
 * Two jobs. The honest one: these lists come from review data, ratings and
 * opinion, and hotels change underneath us — pools close for the season, free
 * parking quietly starts costing $50, a dog policy gets a weight limit. Saying
 * so is better than being caught by a reader who drove there.
 *
 * The useful one: it tells a reader which details are worth a phone call. The
 * failure mode isn't a list being wrong in general, it's someone booking
 * specifically FOR the rooftop pool in February.
 *
 * Written to be read, not skipped — a legal-sounding block gets ignored, which
 * defeats the point.
 */
export default function HowThisListWasMade({
  updated,
  what = "list",
}: {
  /** ISO date this page's facts were last checked. */
  updated?: string;
  /** What to call it in the copy: "list", "guide", "comparison". */
  what?: string;
}) {
  const checked = updated
    ? new Date(updated + "T12:00:00Z").toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      })
    : null;

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
        <h2 className="text-base font-bold mb-3">How this {what} got made</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          A mix of things: Google ratings and review counts, weighted so a 4.5 with two
          thousand reviews beats a 5.0 with eleven; walking distances routed over real
          sidewalks rather than measured as the crow flies; and a decent amount of opinion
          from someone who lives here and has been in most of these lobbies.
        </p>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Hotels move, though. Rooftop pools close for the winter. Parking that was free
          in March costs $50 by June. A dog policy grows a weight limit. Everything here
          was checked{checked ? ` in ${checked}` : ""}, and we go back through it every
          quarter &mdash; but the hotel is the only one who knows what&apos;s true today.
          So if one specific detail is the reason you&apos;re booking &mdash; the pool, the
          shuttle at 4am, whether the dog comes &mdash; take ninety seconds and call them.
          Then go enjoy Denver.
        </p>
        <p className="mt-4 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Rate links go to Expedia and earn us a commission at no extra cost to you. It
          never changes the order &mdash; the ranking is the ranking, and plenty of places
          we recommend pay us nothing.{" "}
          <Link href="/about" className="underline hover:text-denver-amber transition-colors">
            More about how this site works
          </Link>
          .
        </p>
      </div>
    </section>
  );
}

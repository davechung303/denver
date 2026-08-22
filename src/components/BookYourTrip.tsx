import { expediaDenverHotelsUrl, expediaFlightsToDenverUrl } from "@/lib/travelpayouts";
import ExpediaSearchWidget from "./ExpediaSearchWidget";

// Booking band for landing pages.
//
// The Expedia search widget cannot be pre-filled with a destination, so on its own
// it asks the visitor to type "Denver" before it does anything. Every band therefore
// pairs it with the existing pre-filled Denver deep links, which stay the fastest
// path for anyone who does not want to fill in a form. The widget's advantage is the
// opposite case: it captures check-in/check-out dates before the handoff, and dated
// searches convert far better than an undated hotel-search landing.
export default function BookYourTrip({
  pubref,
  eyebrow = "Plan Your Trip",
  heading = "Coming to Denver?",
  blurb = "Pick your dates and compare hotel and flight prices without leaving the page.",
  tone = "light",
}: {
  /** Sub-ID reported to Expedia so revenue can be attributed to this placement. */
  pubref: string;
  eyebrow?: string;
  heading?: string;
  blurb?: string;
  tone?: "light" | "navy";
}) {
  const navy = tone === "navy";
  return (
    <section
      className={
        navy
          ? "bg-denver-navy text-white"
          : "bg-slate-50 dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800"
      }
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-denver-amber mb-2">{eyebrow}</p>
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">{heading}</h2>
          <p className={`text-sm leading-relaxed ${navy ? "text-slate-300" : "text-slate-600 dark:text-slate-400"}`}>
            {blurb}
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4">
            <a
              href={expediaDenverHotelsUrl()}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="text-sm font-semibold text-denver-amber hover:underline"
            >
              Browse all Denver hotels &rarr;
            </a>
            <a
              href={expediaFlightsToDenverUrl()}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="text-sm font-semibold text-denver-amber hover:underline"
            >
              Flights to DEN &rarr;
            </a>
          </div>
          <p className={`text-xs mt-4 ${navy ? "text-slate-400" : "text-slate-500"}`}>
            Affiliate search — booking through it supports this site at no extra cost to you.
          </p>
        </div>
        <div className="w-full flex justify-center lg:justify-end">
          <ExpediaSearchWidget pubref={pubref} />
        </div>
      </div>
    </section>
  );
}

import ExpediaSearchWidget from "./ExpediaSearchWidget";

// Sidebar/inline variant for object detail pages. Deliberately secondary: on a hotel
// page the pre-filled "Reserve on Expedia" button is the higher-converting unit, so
// this sits below it as the "still comparing" option rather than competing for the
// same click. No card chrome of its own — the widget already renders as a bordered
// card, and wrapping it in a second one costs ~35px of a column that is already
// narrower than the widget's 375–575px comfort range.
export default function BookYourTripCard({
  pubref,
  heading = "Check dates & prices",
  blurb,
}: {
  pubref: string;
  heading?: string;
  blurb?: string;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-denver-amber mb-1">Plan Your Trip</p>
      <h3 className="text-base font-bold mb-1">{heading}</h3>
      {blurb && <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">{blurb}</p>}
      <ExpediaSearchWidget pubref={pubref} />
      <p className="text-[11px] text-slate-400 mt-2">Affiliate search — supports this site at no extra cost.</p>
    </div>
  );
}

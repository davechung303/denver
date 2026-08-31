import Link from "next/link";
import { searchViatorProducts } from "@/lib/viator";
import ViatorProductCard from "@/components/ViatorProductCard";

// The Viator API gives us real products — photography, rating, price, and an
// affiliate booking link — which is a better placement than the iframe widget
// and the fastest way to put pictures on pages that are otherwise walls of
// text. It also monetizes a second intent: someone choosing a Denver hotel is
// by definition someone planning a Denver trip.
//
// Degrades to nothing. searchViatorProducts returns [] on any API failure, so a
// bad search term or a dead key renders no section rather than an empty box.
export default async function ExperiencesStrip({
  term,
  heading,
  note,
  limit = 4,
}: {
  term: string;
  heading: string;
  note?: string;
  limit?: number;
}) {
  const products = await searchViatorProducts(term, limit + 4);
  const shown = products.filter((p) => p.images?.length).slice(0, limit);
  if (shown.length === 0) return null;

  return (
    <section className="mb-14 border-t border-slate-200 dark:border-slate-800 pt-12">
      <h2 className="text-2xl font-bold mb-2 leading-snug">{heading}</h2>
      {note && <p className="leading-relaxed text-slate-600 dark:text-slate-400 mb-6 max-w-2xl">{note}</p>}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {shown.map((p) => (
          <ViatorProductCard key={p.productCode} product={p} />
        ))}
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
        <Link href="/denver/experiences" className="text-sm font-semibold text-denver-amber hover:underline">
          All Denver tours &amp; experiences &rarr;
        </Link>
        <Link href="/denver/best-things-to-do" className="text-sm font-semibold text-denver-amber hover:underline">
          Best things to do in Denver &rarr;
        </Link>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Booking links go to Viator, which pays us a commission at no extra cost to you.
        </span>
      </div>
    </section>
  );
}

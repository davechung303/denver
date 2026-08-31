import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SchemaMarkup from "@/components/SchemaMarkup";
import BookYourTrip from "@/components/BookYourTrip";
import { relatedGuides } from "@/lib/guides";
import HowThisListWasMade from "@/components/HowThisListWasMade";
import { expediaDenverHotelsUrl } from "@/lib/travelpayouts";
import HotelSpotlight from "@/components/HotelSpotlight";
import ExperiencesStrip from "@/components/ExperiencesStrip";
import { getHotelPool } from "@/lib/places";
import { hotelsInAreas } from "@/lib/areaHotels";
import { COMPARISONS, getComparison } from "@/lib/stayComparisons";

export const revalidate = 86400;

export function generateStaticParams() {
  return COMPARISONS.map((c) => ({ comparison: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ comparison: string }>;
}): Promise<Metadata> {
  const { comparison } = await params;
  const c = getComparison(comparison);
  if (!c) return {};
  const url = `https://davelovesdenver.com/denver/where-to-stay/${c.slug}`;
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    alternates: { canonical: url },
    openGraph: { title: c.ogTitle, description: c.ogDescription, url },
  };
}

function formatUpdated(iso: string) {
  return new Date(iso + "T12:00:00Z").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default async function ComparisonPage({
  params,
}: {
  params: Promise<{ comparison: string }>;
}) {
  const { comparison } = await params;
  const c = getComparison(comparison);
  if (!c) notFound();

  const url = `https://davelovesdenver.com/denver/where-to-stay/${c.slug}`;
  const others = COMPARISONS.filter((o) => o.slug !== c.slug);

  // This page does the whole decision and originally gave the reader nothing to
  // act on but a widget below the FAQs. The hotels are the point: a visitor who
  // has just been told to book Cherry Creek should see Cherry Creek rooms, each
  // with its own affiliate link, not a generic "browse Denver hotels".
  const pool = await getHotelPool();
  const byArea = hotelsInAreas(pool, [c.aArea, c.bArea]);
  const sides = [
    { name: c.aName, area: c.aArea, hotels: byArea[c.aArea] ?? [] },
    { name: c.bName, area: c.bArea, hotels: byArea[c.bArea] ?? [] },
  ].filter((side) => side.hotels.length > 0);

  return (
    <main>
      <SchemaMarkup
        breadcrumbs={[
          { name: "Home", url: "https://davelovesdenver.com" },
          { name: "Denver", url: "https://davelovesdenver.com/denver" },
          { name: "Where to Stay", url: "https://davelovesdenver.com/denver/where-to-stay" },
          { name: c.h1, url },
        ]}
        article={{
          title: c.h1,
          slug: c.slug,
          url,
          publishedAt: c.updated,
          updatedAt: c.updated,
          description: c.metaDescription,
        }}
        faqs={c.faqs.map((f) => ({ question: f.q, answer: f.a }))}
      />

      <header className="bg-denver-navy text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <nav aria-label="Breadcrumb" className="text-sm text-white/50 mb-5">
            <ol className="flex flex-wrap items-center gap-2">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/denver" className="hover:text-white transition-colors">Denver</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/denver/where-to-stay" className="hover:text-white transition-colors">Where to Stay</Link></li>
            </ol>
          </nav>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight">{c.h1}</h1>

          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/60">
            <span>
              By{" "}
              <Link href="/about" className="text-denver-amber hover:underline font-medium">
                Dave Chung
              </Link>
            </span>
            <span aria-hidden="true">·</span>
            <span>
              Updated <time dateTime={c.updated}>{formatUpdated(c.updated)}</time>
            </span>
          </div>
        </div>
      </header>

      {/* The direct answer, first thing on the page. */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 p-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-denver-amber mb-3">
            The short answer
          </h2>
          <p className="text-lg leading-relaxed text-slate-800 dark:text-slate-100" data-speakable>
            {c.verdict}
          </p>
        </div>
      </section>

      {/* Who each one is for. */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
            <h2 className="font-bold mb-3">Book {c.aName} if&hellip;</h2>
            <ul className="space-y-2.5">
              {c.chooseA.map((item) => (
                <li key={item} className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 pl-5 relative">
                  <span aria-hidden="true" className="absolute left-0 text-denver-amber">&bull;</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
            <h2 className="font-bold mb-3">Book {c.bName} if&hellip;</h2>
            <ul className="space-y-2.5">
              {c.chooseB.map((item) => (
                <li key={item} className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 pl-5 relative">
                  <span aria-hidden="true" className="absolute left-0 text-denver-amber">&bull;</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Head to head. */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <h2 className="text-2xl font-bold mb-5">
          {c.aName} vs {c.bName}, line by line
        </h2>
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900">
              <tr>
                <th className="text-left font-semibold px-4 py-3 text-slate-500 dark:text-slate-400 uppercase tracking-wide text-xs w-40"></th>
                <th className="text-left font-semibold px-4 py-3 text-slate-500 dark:text-slate-400 uppercase tracking-wide text-xs">{c.aName}</th>
                <th className="text-left font-semibold px-4 py-3 text-slate-500 dark:text-slate-400 uppercase tracking-wide text-xs">{c.bName}</th>
              </tr>
            </thead>
            <tbody>
              {c.rows.map((r) => (
                <tr key={r.label} className="border-t border-slate-100 dark:border-slate-800 align-top">
                  <th scope="row" className="text-left px-4 py-3 font-semibold whitespace-nowrap">{r.label}</th>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400 leading-relaxed">{r.a}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400 leading-relaxed">{r.b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* The hotels themselves, immediately after the comparison table — this is
          the point on the page where the reader has decided and wants a room. */}
      {sides.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <h2 className="text-2xl font-bold mb-2">The rooms on each side</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl mb-6">
            Best-rated first, by real guest reviews. Hotel names go to our own write-up of each property;
            the rate links go to Expedia, which pays us a commission at no extra cost to you.
          </p>
          <div className="space-y-12">
            {sides.map((side) => (
              <div key={side.area}>
                <h3 className="text-xl font-bold mb-3">{side.name}</h3>
                <HotelSpotlight places={side.hotels} />
                <Link
                  href={`/denver/${side.area}/hotels`}
                  className="mt-3 inline-flex items-center text-sm font-semibold text-denver-amber hover:underline"
                >
                  All {side.name} hotels &rarr;
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      <BookYourTrip
        pubref={`compare-${c.slug}`}
        eyebrow="Compare rates"
        heading={`${c.aName} or ${c.bName}?`}
        blurb="Put your dates in and see what each side actually costs this week — the answer moves a long way with the calendar, and on some weekends it flips the recommendation above."
      />

      {/* The argument. */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {c.sections.map((s) => (
          <div key={s.h} className="mb-10">
            <h2 className="text-2xl font-bold mb-4">{s.h}</h2>
            {s.body.map((p, i) => (
              <p key={i} className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                {p}
              </p>
            ))}
          </div>
        ))}
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <h2 className="text-xl font-bold mb-4">Keep reading</h2>
        <div className="flex flex-wrap gap-3">
          {c.links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="inline-flex items-center px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-sm font-medium hover:border-denver-amber hover:text-denver-amber transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 dark:bg-slate-900/50 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8">Frequently asked questions</h2>
          <div className="space-y-7">
            {c.faqs.map((f) => (
              <div key={f.q}>
                <h3 className="font-semibold mb-1">{f.q}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-xl font-bold mb-4">Other Denver stay comparisons</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {others.map((o) => (
            <Link
              key={o.slug}
              href={`/denver/where-to-stay/${o.slug}`}
              className="block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-denver-amber transition-colors"
            >
              <h3 className="font-bold mb-1 text-sm">
                {o.aName} vs {o.bName}
              </h3>
              <span className="inline-flex items-center text-xs font-semibold text-denver-amber">Read &rarr;</span>
            </Link>
          ))}
        </div>
        <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
          Still deciding?{" "}
          <Link href="/denver/where-to-stay" className="text-denver-amber hover:underline font-medium">
            The full where-to-stay guide
          </Link>{" "}
          covers all ten Denver neighborhoods, including who each one is wrong for.
        </p>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <ExperiencesStrip
          term="Denver city tour"
          heading="Whichever side you pick"
          note="These run from downtown and work from either neighborhood, so they are not part of the decision — they are what you do once it is made."
        />
      </div>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <h2 className="text-xl font-bold mb-5">Before you book either side</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {relatedGuides(c.slug).map((g) => (
            <Link
              key={g.slug}
              href={`/denver/${g.slug}`}
              className="group block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-denver-amber transition-colors"
            >
              <h3 className="font-bold text-sm mb-1 group-hover:text-denver-amber transition-colors">{g.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{g.blurb}</p>
            </Link>
          ))}
        </div>
      </section>

      <HowThisListWasMade updated={c.updated} what="comparison" />

      <section className="bg-denver-navy text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-bold mb-3">Decided?</h2>
          <p className="text-slate-300 leading-relaxed mb-5">
            Rates in both of these move with the calendar rather than with the weekend, so check your own dates
            before you commit to either side.
          </p>
          <div className="flex flex-wrap gap-3">
            {sides.map((side) => (
              <Link
                key={side.area}
                href={`/denver/${side.area}/hotels`}
                className="inline-flex items-center px-5 py-2.5 bg-denver-amber hover:bg-amber-500 text-white text-sm font-semibold rounded-full transition-colors"
              >
                {side.name} hotels &rarr;
              </Link>
            ))}
            <a
              href={expediaDenverHotelsUrl()}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="inline-flex items-center px-5 py-2.5 border border-white/25 hover:border-denver-amber text-sm font-semibold rounded-full transition-colors"
            >
              Search all Denver hotels &rarr;
            </a>
          </div>
          <p className="text-xs text-slate-400 mt-4">
            Affiliate links — booking through them supports this site at no extra cost to you.
          </p>
        </div>
      </section>
    </main>
  );
}

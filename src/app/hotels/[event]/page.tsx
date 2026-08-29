import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getHotelPool } from "@/lib/places";
import { hotelsInArea } from "@/lib/areaHotels";
import VenueHotelCard from "@/components/VenueHotelCard";
import BookYourTrip from "@/components/BookYourTrip";
import { EVENT_GUIDES, getEventGuide } from "@/lib/eventGuides";

export const revalidate = 86400;

export function generateStaticParams() {
  return EVENT_GUIDES.map((e) => ({ event: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ event: string }>;
}): Promise<Metadata> {
  const { event } = await params;
  const g = getEventGuide(event);
  if (!g) return {};
  const url = `https://davelovesdenver.com/hotels/${g.slug}`;
  return {
    title: g.metaTitle,
    description: g.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: g.ogTitle,
      description: g.ogDescription,
      url,
      type: "article",
      publishedTime: g.updated,
      modifiedTime: g.updated,
    },
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

export default async function EventGuidePage({
  params,
}: {
  params: Promise<{ event: string }>;
}) {
  const { event } = await params;
  const g = getEventGuide(event);
  if (!g) notFound();

  const url = `https://davelovesdenver.com/hotels/${g.slug}`;
  const pool = await getHotelPool();
  const modules = g.lodging
    .map((l) => ({ ...l, hotels: hotelsInArea(pool, l.neighborhood, { limit: 4 }) }))
    .filter((m) => m.hotels.length > 0);

  const schema: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://davelovesdenver.com" },
        { "@type": "ListItem", position: 2, name: "Hotels", item: "https://davelovesdenver.com/hotels" },
        { "@type": "ListItem", position: 3, name: g.h1, item: url },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: g.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: g.h1,
      description: g.metaDescription,
      url,
      dateModified: g.updated,
      speakableSpecification: {
        "@type": "SpeakableSpecification",
        cssSelector: ["[data-speakable]"],
      },
    },
  ];

  // Only emitted when the organizer has officially announced the dates.
  if (g.event) {
    schema.push({
      "@context": "https://schema.org",
      "@type": "Event",
      name: g.event.name,
      startDate: g.event.startDate,
      endDate: g.event.endDate,
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      location: {
        "@type": "Place",
        name: g.event.locationName,
        address: g.event.locationAddress,
      },
      url: g.event.officialUrl,
    });
  }

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <header className="bg-denver-navy text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <nav aria-label="Breadcrumb" className="text-sm text-white/50 mb-5">
            <ol className="flex flex-wrap items-center gap-2">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/hotels" className="hover:text-white transition-colors">Hotels</Link></li>
            </ol>
          </nav>

          <p className="text-xs font-semibold uppercase tracking-widest text-denver-amber mb-3">{g.kicker}</p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">{g.h1}</h1>

          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/60">
            <span>
              By{" "}
              <Link href="/about" className="text-denver-amber hover:underline font-medium">
                Dave Chung
              </Link>
            </span>
            <span aria-hidden="true">·</span>
            <span>
              Updated <time dateTime={g.updated}>{formatUpdated(g.updated)}</time>
            </span>
          </div>
        </div>
      </header>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 p-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-denver-amber mb-3">The short version</h2>
          <p className="text-lg leading-relaxed text-slate-800 dark:text-slate-100" data-speakable>
            {g.lede}
          </p>
        </div>
      </section>

      {/* Lodging modules — the commercial spine of the page. */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
        <h2 className="text-2xl font-bold mb-6">Where to book</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {modules.map((m) => (
            <div key={m.neighborhood}>
              <h3 className="font-bold mb-2">{m.heading}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">{m.blurb}</p>
              <div className="space-y-2">
                {m.hotels.map((h) => (
                  <VenueHotelCard key={h.place_id} place={h} />
                ))}
              </div>
              <Link
                href={`/denver/${m.neighborhood}/hotels`}
                className="mt-3 inline-flex items-center text-sm font-semibold text-denver-amber hover:underline"
              >
                All {m.neighborhood.replace(/-/g, " ")} hotels &rarr;
              </Link>
            </div>
          ))}
        </div>
      </section>

      <BookYourTrip
        pubref={g.pubref}
        eyebrow="Check dates"
        heading="See what your dates cost"
        blurb="Rates around this event move a long way from an ordinary week. Put your dates in and compare before you commit."
      />

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {g.sections.map((s) => (
          <div key={s.h2} className="mb-10">
            <h2 className="text-2xl font-bold mb-3">{s.h2}</h2>
            <p className="text-slate-800 dark:text-slate-200 leading-relaxed mb-4 font-medium" data-speakable>
              {s.answer}
            </p>
            {s.body?.map((p, i) => (
              <p key={i} className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                {p}
              </p>
            ))}
            {s.list && (
              <ul className="space-y-2.5 mb-4">
                {s.list.map((li) => (
                  <li key={li} className="text-slate-600 dark:text-slate-400 leading-relaxed pl-5 relative">
                    <span aria-hidden="true" className="absolute left-0 text-denver-amber">&bull;</span>
                    {li}
                  </li>
                ))}
              </ul>
            )}
            {s.table && (
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 mb-4">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-900">
                    <tr>
                      {s.table.head.map((h) => (
                        <th key={h} className="text-left font-semibold px-4 py-3 text-slate-500 dark:text-slate-400 uppercase tracking-wide text-xs">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {s.table.rows.map((r) => (
                      <tr key={r.join("|")} className="border-t border-slate-100 dark:border-slate-800 align-top">
                        {r.map((cell, i) => (
                          <td key={i} className="px-4 py-3 text-slate-600 dark:text-slate-400 leading-relaxed">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <h2 className="text-xl font-bold mb-4">Keep reading</h2>
        <div className="flex flex-wrap gap-3">
          {g.links.map((l) => (
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
            {g.faqs.map((f) => (
              <div key={f.q}>
                <h3 className="font-semibold mb-1">{f.q}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

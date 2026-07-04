import type { Metadata } from "next";
import Link from "next/link";
import { getEventsForVenue } from "@/lib/ticketmaster";
import { ticketmasterAffiliateUrl } from "@/lib/travelpayouts";
import EventCard from "@/components/EventCard";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Dick's Sporting Goods Park Events & Rapids Schedule 2026 | Dave Loves Denver",
  description:
    "Full schedule of Colorado Rapids games and events at Dick's Sporting Goods Park in Commerce City. Buy tickets and plan your visit to Denver's soccer stadium.",
  alternates: { canonical: "https://davelovesdenver.com/events/dicks-sporting-goods-park" },
  openGraph: {
    title: "Dick's Sporting Goods Park Events & Rapids Schedule 2026",
    description: "Colorado Rapids games and events at Dick's Sporting Goods Park — full schedule and tickets.",
    url: "https://davelovesdenver.com/events/dicks-sporting-goods-park",
  },
};

const FAQS = [
  {
    q: "What team plays at Dick's Sporting Goods Park?",
    a: "The Colorado Rapids, Denver's MLS soccer team, play their home games here. The Rapids season runs March through October, with MLS Cup Playoffs possible through November. Dick's Sporting Goods Park is a purpose-built soccer stadium — one of the better MLS venues in the country.",
  },
  {
    q: "Where is Dick's Sporting Goods Park?",
    a: "Commerce City, about 10 miles north of downtown Denver. It's a 15–20 minute drive from downtown, accessible via I-270. There's no light rail connection — driving or rideshare is the practical option for most visitors.",
  },
  {
    q: "Does Dick's Sporting Goods Park host concerts?",
    a: "Yes — the stadium hosts major outdoor concerts and events outside of the Rapids season, particularly large summer shows that need an outdoor stadium setting. Check the full calendar for non-soccer events.",
  },
  {
    q: "What's the atmosphere like at Colorado Rapids games?",
    a: "Dick's Sporting Goods Park is a purpose-built soccer venue, which means the sightlines are excellent and the atmosphere focuses on the pitch. The supporter sections are vocal and the stadium fills well for big games.",
  },
  {
    q: "Is there parking at Dick's Sporting Goods Park?",
    a: "Yes — ample parking surrounds the stadium. On match days and concert nights the lots fill up; arrive early and expect some traffic on exit. Rideshare drop-off works well for the area.",
  },
];

export default async function EventsDicksSportingGoodsParkPage() {
  const events = await getEventsForVenue("Sporting Goods Park", 20);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
        { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://davelovesdenver.com" },
          { "@type": "ListItem", position: 2, name: "Events", item: "https://davelovesdenver.com/events" },
          { "@type": "ListItem", position: 3, name: "Dick's Sporting Goods Park", item: "https://davelovesdenver.com/events/dicks-sporting-goods-park" },
        ]},
        { "@context": "https://schema.org", "@type": "WebPage",
          name: "Dick's Sporting Goods Park Events & Rapids Schedule 2026",
          description: "Full schedule of Colorado Rapids games and events at Dick's Sporting Goods Park in Commerce City.",
          url: "https://davelovesdenver.com/events/dicks-sporting-goods-park",
          speakableSpecification: { "@type": "SpeakableSpecification", cssSelector: ["[data-speakable]"] },
        },
        { "@context": "https://schema.org", "@type": "SportsActivityLocation",
          name: "Dick's Sporting Goods Park",
          address: { "@type": "PostalAddress", streetAddress: "6000 Victory Way", addressLocality: "Commerce City", addressRegion: "CO", postalCode: "80022" },
        },
        { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQS.map((f) => ({
          "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a },
        }))},
        ...events.map((e) => ({
          "@context": "https://schema.org", "@type": "Event",
          name: e.name, startDate: e.start_time,
          location: { "@type": "Place", name: "Dick's Sporting Goods Park", address: "6000 Victory Way, Commerce City, CO 80022" },
          ...(e.image_url ? { image: e.image_url } : {}),
          url: e.url,
          eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
          eventStatus: "https://schema.org/EventScheduled",
        })),
      ])}} />

      <section className="bg-denver-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <nav className="flex items-center gap-2 text-sm text-white/50 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/events" className="hover:text-white transition-colors">Events</Link>
            <span>/</span>
            <span className="text-white/80">Dick&apos;s Sporting Goods Park</span>
          </nav>
          <p className="text-denver-amber text-sm font-semibold uppercase tracking-widest mb-3">Commerce City, Colorado</p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight" data-speakable>Upcoming Events at Dick&apos;s Sporting Goods Park</h1>
          <p className="mt-4 text-lg text-white/70 max-w-2xl" data-speakable>
            Home of the Colorado Rapids — Denver&apos;s MLS club. A purpose-built soccer stadium north of the city with excellent sightlines and a dedicated supporter culture.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h2 className="text-xl font-bold">{events.length > 0 ? `${events.length} Upcoming Events` : "Upcoming Events"}</h2>
          <a href={ticketmasterAffiliateUrl("https://www.ticketmaster.com/search?q=dicks+sporting+goods+park")} target="_blank" rel="noopener noreferrer"
            className="text-sm text-denver-amber font-semibold hover:underline">All events on Ticketmaster &rarr;</a>
        </div>
        {events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event) => <EventCard key={event.event_id} event={event} />)}
          </div>
        ) : (
          <div className="py-12 text-center text-slate-500">
            <p className="text-lg font-medium mb-2">No upcoming events found right now.</p>
            <a href={ticketmasterAffiliateUrl("https://www.ticketmaster.com/search?q=dicks+sporting+goods+park")} target="_blank" rel="noopener noreferrer"
              className="text-denver-amber font-semibold hover:underline text-sm">Check Ticketmaster for the full schedule &rarr;</a>
          </div>
        )}
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-100 dark:border-slate-800">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">About Dick&apos;s Sporting Goods Park</h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Dick&apos;s Sporting Goods Park opened in 2007 as a purpose-built soccer stadium in Commerce City, about 10 miles north of downtown Denver. The 18,061-capacity stadium was designed specifically for soccer — the viewing angles are excellent throughout.</p>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">The Colorado Rapids are one of the original MLS clubs and have a loyal supporter base. The Burgundy Boys and other supporter sections create real atmosphere for big matches. The stadium also hosts occasional concerts and large outdoor events.</p>
            <blockquote className="border-l-4 border-denver-amber pl-4 text-slate-600 dark:text-slate-400 text-sm leading-relaxed italic" data-speakable>
              &ldquo;A Rapids match at Dick&apos;s Sporting Goods Park is an underrated Denver experience. The stadium was built right, the sightlines are excellent, and the supporter sections make noise. Worth the drive north.&rdquo;
              <footer className="mt-1 text-xs not-italic text-slate-400">— Dave</footer>
            </blockquote>
          </div>
          <div className="grid grid-cols-2 gap-4 content-start">
            {[
              { label: "Capacity", value: "18,061" },
              { label: "Location", value: "Commerce City" },
              { label: "Opened", value: "2007" },
              { label: "From Downtown", value: "15 min" },
            ].map((stat) => (
              <div key={stat.label} className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-5">
                <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-xl font-bold leading-tight">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-100 dark:border-slate-800">
        <div className="bg-denver-navy text-white rounded-2xl p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h2 className="text-xl font-bold mb-2">Need a hotel in Denver?</h2>
            <p className="text-white/70 text-sm max-w-md">Stay downtown and drive or rideshare to the match — it&apos;s 15 minutes and you&apos;ll have the rest of the city at your disposal.</p>
          </div>
          <Link href="/denver/where-to-stay"
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-denver-amber hover:bg-amber-500 text-white font-semibold rounded-full transition-colors text-sm">
            Where to stay in Denver &rarr;
          </Link>
        </div>
      </section>

      <section className="bg-slate-50 dark:bg-slate-900/50 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8">Frequently Asked Questions</h2>
          <div className="space-y-7">
            {FAQS.map((faq) => (
              <div key={faq.q}>
                <h3 className="font-semibold mb-1">{faq.q}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-wrap gap-3">
          <Link href="/denver/where-to-stay" className="inline-flex items-center gap-2 px-5 py-2.5 bg-denver-navy hover:bg-denver-navy/90 text-white text-sm font-semibold rounded-full transition-colors">Where to stay in Denver &rarr;</Link>
          <Link href="/events/empower-field" className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber text-sm font-semibold rounded-full transition-colors">Empower Field events &rarr;</Link>
          <Link href="/events/ball-arena" className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber text-sm font-semibold rounded-full transition-colors">Ball Arena events &rarr;</Link>
          <Link href="/events/coors-field" className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber text-sm font-semibold rounded-full transition-colors">Coors Field events &rarr;</Link>
        </div>
      </section>
    </>
  );
}

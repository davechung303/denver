import type { Metadata } from "next";
import Link from "next/link";
import { getEventsForVenue } from "@/lib/ticketmaster";
import { ticketmasterAffiliateUrl } from "@/lib/travelpayouts";
import EventCard from "@/components/EventCard";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Coors Field Events & Rockies Game Schedule 2026 | Dave Loves Denver",
  description:
    "Full schedule of Colorado Rockies games and events at Coors Field in LoDo Denver. Buy tickets, plan your visit, and find nearby hotels.",
  alternates: { canonical: "https://davelovesdenver.com/events/coors-field" },
  openGraph: {
    title: "Coors Field Events & Rockies Schedule 2026",
    description: "Colorado Rockies games and events at Coors Field — full schedule and tickets.",
    url: "https://davelovesdenver.com/events/coors-field",
  },
};

const FAQS = [
  {
    q: "When is the Rockies season at Coors Field?",
    a: "The Colorado Rockies MLB season runs from late March through early October, with home games at Coors Field throughout. The team plays 81 home games per season — check the full schedule on Ticketmaster or MLB.com.",
  },
  {
    q: "What's the best way to get to Coors Field?",
    a: "Walk from anywhere in LoDo — most hotels are 5–15 minutes on foot. The A, B, and N light rail lines stop at Union Station, which is a 7-minute walk to the park. RTD bus routes also serve the stadium area.",
  },
  {
    q: "What are the best seats at Coors Field?",
    a: "The lower infield seats give you the best views of the Rockies in the background — uniquely Denver. The Rockpile (center field bleachers) has historically been cheap seats with a great atmosphere. The Rooftop (above right field) has mountain views and a bar setting.",
  },
  {
    q: "Does Coors Field host concerts?",
    a: "Yes — Coors Field hosts major stadium concerts throughout the year, particularly in summer. The configuration can vary from the outfield stage setup to full infield shows. Check the full event calendar for non-baseball events.",
  },
  {
    q: "What's the pregame scene like near Coors Field?",
    a: "Blake Street bars and LoDo restaurants fill up for every home game — especially weekend afternoon games. Get there 1.5–2 hours early for a proper pregame. The neighborhood energy on Rockies game days is one of Denver's best experiences.",
  },
];

export default async function EventsCoorsFieldPage() {
  const events = await getEventsForVenue("Coors Field", 20);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
        { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://davelovesdenver.com" },
          { "@type": "ListItem", position: 2, name: "Events", item: "https://davelovesdenver.com/events" },
          { "@type": "ListItem", position: 3, name: "Coors Field", item: "https://davelovesdenver.com/events/coors-field" },
        ]},
        { "@context": "https://schema.org", "@type": "WebPage",
          name: "Coors Field Events & Rockies Schedule 2026",
          description: "Full schedule of Colorado Rockies games and events at Coors Field in LoDo Denver.",
          url: "https://davelovesdenver.com/events/coors-field",
          speakableSpecification: { "@type": "SpeakableSpecification", cssSelector: ["[data-speakable]"] },
        },
        { "@context": "https://schema.org", "@type": "SportsActivityLocation",
          name: "Coors Field",
          address: { "@type": "PostalAddress", streetAddress: "2001 Blake St", addressLocality: "Denver", addressRegion: "CO", postalCode: "80205" },
        },
        { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQS.map((f) => ({
          "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a },
        }))},
        ...events.map((e) => ({
          "@context": "https://schema.org", "@type": "Event",
          name: e.name, startDate: e.start_time,
          location: { "@type": "Place", name: "Coors Field", address: "2001 Blake St, Denver, CO 80205" },
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
            <span className="text-white/80">Coors Field</span>
          </nav>
          <p className="text-denver-amber text-sm font-semibold uppercase tracking-widest mb-3">LoDo, Denver</p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight" data-speakable>Upcoming Events at Coors Field</h1>
          <p className="mt-4 text-lg text-white/70 max-w-2xl" data-speakable>
            Home of the Colorado Rockies — one of the best ballparks in the country, with the actual Rocky Mountains visible beyond the outfield. Baseball here is different.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h2 className="text-xl font-bold">{events.length > 0 ? `${events.length} Upcoming Events` : "Upcoming Events"}</h2>
          <a href={ticketmasterAffiliateUrl("https://www.ticketmaster.com/search?q=coors+field+denver")} target="_blank" rel="noopener noreferrer"
            className="text-sm text-denver-amber font-semibold hover:underline">All events on Ticketmaster &rarr;</a>
        </div>
        {events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event) => <EventCard key={event.event_id} event={event} />)}
          </div>
        ) : (
          <div className="py-12 text-center text-slate-500">
            <p className="text-lg font-medium mb-2">No upcoming events found right now.</p>
            <a href={ticketmasterAffiliateUrl("https://www.ticketmaster.com/search?q=coors+field+denver")} target="_blank" rel="noopener noreferrer"
              className="text-denver-amber font-semibold hover:underline text-sm">Check Ticketmaster for the full schedule &rarr;</a>
          </div>
        )}
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-100 dark:border-slate-800">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">About Coors Field</h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Coors Field opened in 1995 and anchors the north end of LoDo. At 5,280 feet above sea level, it's the highest ballpark in Major League Baseball — which affects pitching dramatically and leads to some of the highest-scoring games in baseball.</p>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">The view from the lower infield seats — green grass, brown infield, and the Front Range in the background — is one of the better sights in baseball. Sunday afternoon games here are a Denver tradition.</p>
            <blockquote className="border-l-4 border-denver-amber pl-4 text-slate-600 dark:text-slate-400 text-sm leading-relaxed italic" data-speakable>
              &ldquo;Coors Field on a sunny Sunday afternoon is one of the best things Denver does. Stay in LoDo, walk to Blake Street for pregame, walk into the park, walk back after. The mountains behind the outfield never get old.&rdquo;
              <footer className="mt-1 text-xs not-italic text-slate-400">— Dave</footer>
            </blockquote>
          </div>
          <div className="grid grid-cols-2 gap-4 content-start">
            {[
              { label: "Capacity", value: "46,897" },
              { label: "Elevation", value: "5,280 ft" },
              { label: "Location", value: "LoDo, Denver" },
              { label: "Opened", value: "1995" },
            ].map((stat) => (
              <div key={stat.label} className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-5">
                <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-100 dark:border-slate-800">
        <div className="bg-denver-navy text-white rounded-2xl p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h2 className="text-xl font-bold mb-2">Need a hotel for the game?</h2>
            <p className="text-white/70 text-sm max-w-md">Several LoDo hotels are within easy walking distance of Coors Field. We cover the best options and what to expect.</p>
          </div>
          <Link href="/hotels/near-coors-field"
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-denver-amber hover:bg-amber-500 text-white font-semibold rounded-full transition-colors text-sm">
            Hotels near Coors Field &rarr;
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
          <Link href="/hotels/near-coors-field" className="inline-flex items-center gap-2 px-5 py-2.5 bg-denver-navy hover:bg-denver-navy/90 text-white text-sm font-semibold rounded-full transition-colors">Hotels near Coors Field &rarr;</Link>
          <Link href="/events/ball-arena" className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber text-sm font-semibold rounded-full transition-colors">Ball Arena events &rarr;</Link>
          <Link href="/events/empower-field" className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber text-sm font-semibold rounded-full transition-colors">Empower Field events &rarr;</Link>
          <Link href="/events/red-rocks" className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber text-sm font-semibold rounded-full transition-colors">Red Rocks shows &rarr;</Link>
        </div>
      </section>
    </>
  );
}

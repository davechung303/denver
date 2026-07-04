import type { Metadata } from "next";
import Link from "next/link";
import { getEventsForVenueFromAPI } from "@/lib/ticketmaster";
import { ticketmasterAffiliateUrl } from "@/lib/travelpayouts";
import EventCard from "@/components/EventCard";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Ball Arena Denver Events, Games & Concert Schedule 2026 | Dave Loves Denver",
  description:
    "Full schedule of upcoming Nuggets games, Avalanche games, and concerts at Ball Arena in downtown Denver. Buy tickets and find nearby hotels.",
  alternates: { canonical: "https://davelovesdenver.com/events/ball-arena" },
  openGraph: {
    title: "Ball Arena Denver Events & Schedule 2026",
    description: "Nuggets, Avalanche, and concerts at Ball Arena — browse the full schedule.",
    url: "https://davelovesdenver.com/events/ball-arena",
  },
};

const FAQS = [
  {
    q: "What teams play at Ball Arena?",
    a: "Ball Arena is home to the Denver Nuggets (NBA) and Colorado Avalanche (NHL). The Nuggets play October through April; the Avalanche season runs October through June. Both teams have playoff runs — Nuggets won the NBA Championship in 2023, Avalanche won the Stanley Cup in 2022.",
  },
  {
    q: "How do I get to Ball Arena from downtown Denver?",
    a: "Ball Arena sits on the western edge of downtown — walkable from LoDo and Union Station in 10–15 minutes along Wewatta Street. The C, E, and W light rail lines stop at Union Station, which is the logical transit hub. Driving in is easy but parking is expensive on event nights.",
  },
  {
    q: "What concerts come to Ball Arena?",
    a: "Ball Arena hosts major arena tours year-round — Taylor Swift, Beyoncé, and similar scale acts have played here. The arena also hosts the Big East Tournament, college basketball, and other events outside of the NBA and NHL seasons.",
  },
  {
    q: "Is Ball Arena a good venue?",
    a: "Yes — it's consistently rated one of the better NBA/NHL arenas in the country. Sightlines are good from most seats, the atmosphere for Nuggets playoff games is legitimately intense, and the location in downtown Denver makes the whole night easy.",
  },
  {
    q: "What's parking like at Ball Arena?",
    a: "Attached parking garage and nearby surface lots. Prices spike significantly on game and concert nights. Walking from LoDo or Union Station is the better move — you skip the parking cost and the post-event traffic.",
  },
];

export default async function EventsBallArenaPage() {
  const events = await getEventsForVenueFromAPI("ball-arena", 50);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
        { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://davelovesdenver.com" },
          { "@type": "ListItem", position: 2, name: "Events", item: "https://davelovesdenver.com/events" },
          { "@type": "ListItem", position: 3, name: "Ball Arena", item: "https://davelovesdenver.com/events/ball-arena" },
        ]},
        { "@context": "https://schema.org", "@type": "WebPage",
          name: "Ball Arena Denver Events & Schedule 2026",
          description: "Full schedule of upcoming Nuggets games, Avalanche games, and concerts at Ball Arena in downtown Denver.",
          url: "https://davelovesdenver.com/events/ball-arena",
          speakableSpecification: { "@type": "SpeakableSpecification", cssSelector: ["[data-speakable]"] },
        },
        { "@context": "https://schema.org", "@type": "SportsActivityLocation",
          name: "Ball Arena",
          address: { "@type": "PostalAddress", streetAddress: "1000 Chopper Cir", addressLocality: "Denver", addressRegion: "CO", postalCode: "80204" },
        },
        { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQS.map((f) => ({
          "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a },
        }))},
        ...events.map((e) => ({
          "@context": "https://schema.org", "@type": "Event",
          name: e.name,
          startDate: e.start_time,
          location: { "@type": "Place", name: "Ball Arena", address: "1000 Chopper Cir, Denver, CO 80204" },
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
            <span className="text-white/80">Ball Arena</span>
          </nav>
          <p className="text-denver-amber text-sm font-semibold uppercase tracking-widest mb-3">LoDo, Denver</p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight" data-speakable>Upcoming Events at Ball Arena Denver</h1>
          <p className="mt-4 text-lg text-white/70 max-w-2xl" data-speakable>
            Home of the Denver Nuggets and Colorado Avalanche. One of the better arenas in the country — and walkable from LoDo, which makes the whole night easy.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h2 className="text-xl font-bold">
            {events.length > 0 ? `${events.length} Upcoming Events` : "Upcoming Events"}
          </h2>
          <a href={ticketmasterAffiliateUrl("https://www.ticketmaster.com/search?q=ball+arena+denver")} target="_blank" rel="noopener noreferrer"
            className="text-sm text-denver-amber font-semibold hover:underline">
            All events on Ticketmaster &rarr;
          </a>
        </div>
        {events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event) => <EventCard key={event.event_id} event={event} />)}
          </div>
        ) : (
          <div className="py-12 text-center text-slate-500">
            <p className="text-lg font-medium mb-2">No upcoming events found right now.</p>
            <a href={ticketmasterAffiliateUrl("https://www.ticketmaster.com/search?q=ball+arena+denver")} target="_blank" rel="noopener noreferrer"
              className="text-denver-amber font-semibold hover:underline text-sm">
              Check Ticketmaster for the full schedule &rarr;
            </a>
          </div>
        )}
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-100 dark:border-slate-800">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">About Ball Arena</h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Ball Arena opened in 1999 and anchors the western edge of downtown Denver. Home to the Nuggets and Avalanche, both of whom have won championships in the 2020s. The arena holds 19,520 for basketball and 17,809 for hockey.</p>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">The location is what sets it apart from most arenas — you can walk from Union Station and from dozens of LoDo restaurants and bars. Walk in for the game, walk back to the bar after. No Uber needed.</p>
            <blockquote className="border-l-4 border-denver-amber pl-4 text-slate-600 dark:text-slate-400 text-sm leading-relaxed italic" data-speakable>
              &ldquo;Nuggets playoff games at Ball Arena are legitimately worth flying in for. The altitude energy is real, the crowd is intense, and LoDo before and after is one of the better sports night setups in the NBA. Stay in LoDo and walk.&rdquo;
              <footer className="mt-1 text-xs not-italic text-slate-400">— Dave</footer>
            </blockquote>
          </div>
          <div className="grid grid-cols-2 gap-4 content-start">
            {[
              { label: "NBA Capacity", value: "19,520" },
              { label: "NHL Capacity", value: "17,809" },
              { label: "Location", value: "LoDo, Denver" },
              { label: "Walk from Union Station", value: "12 min" },
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
            <h2 className="text-xl font-bold mb-2">Staying in Denver for the game?</h2>
            <p className="text-white/70 text-sm max-w-md">LoDo and Jefferson Park are the closest neighborhoods with walkable hotel options. We break down the best picks.</p>
          </div>
          <Link href="/hotels/near-ball-arena"
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-denver-amber hover:bg-amber-500 text-white font-semibold rounded-full transition-colors text-sm">
            Hotels near Ball Arena &rarr;
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
          <Link href="/hotels/near-ball-arena" className="inline-flex items-center gap-2 px-5 py-2.5 bg-denver-navy hover:bg-denver-navy/90 text-white text-sm font-semibold rounded-full transition-colors">
            Hotels near Ball Arena &rarr;
          </Link>
          <Link href="/events/coors-field" className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber text-sm font-semibold rounded-full transition-colors">
            Coors Field events &rarr;
          </Link>
          <Link href="/events/empower-field" className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber text-sm font-semibold rounded-full transition-colors">
            Empower Field events &rarr;
          </Link>
          <Link href="/events/red-rocks" className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber text-sm font-semibold rounded-full transition-colors">
            Red Rocks shows &rarr;
          </Link>
        </div>
      </section>
    </>
  );
}

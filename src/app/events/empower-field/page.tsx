import type { Metadata } from "next";
import Link from "next/link";
import { getEventsForVenue } from "@/lib/ticketmaster";
import { ticketmasterAffiliateUrl } from "@/lib/travelpayouts";
import EventCard from "@/components/EventCard";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Empower Field at Mile High Events & Broncos Schedule 2026 | Dave Loves Denver",
  description:
    "Full schedule of Denver Broncos games and events at Empower Field at Mile High. Buy tickets and find nearby hotels in LoDo and Jefferson Park.",
  alternates: { canonical: "https://davelovesdenver.com/events/empower-field" },
  openGraph: {
    title: "Empower Field Events & Broncos Schedule 2026",
    description: "Denver Broncos games and stadium events at Empower Field — full schedule and tickets.",
    url: "https://davelovesdenver.com/events/empower-field",
  },
};

const FAQS = [
  {
    q: "When is the Broncos season at Empower Field?",
    a: "The Denver Broncos NFL preseason runs August, regular season September through January. Empower Field hosts 9–10 home games per season. Playoff home games are possible but depend on the Broncos' record.",
  },
  {
    q: "Can you walk to Empower Field from downtown Denver?",
    a: "Yes — from LoDo and Union Station it's about a mile walk west, crossing the South Platte River. The walk takes 15–20 minutes and on game days the route fills with fans in orange. Jefferson Park is directly adjacent to the stadium.",
  },
  {
    q: "Does Empower Field host concerts?",
    a: "Yes — Empower Field hosts major stadium-level concerts including Taylor Swift, Kenny Chesney, and similar scale acts. These events can rival or exceed NFL game attendance for parking and logistics. Check the calendar for non-football events.",
  },
  {
    q: "What is the atmosphere like at Broncos games?",
    a: "Empower Field at Mile High is one of the louder stadiums in the NFL. At 5,280 feet, the altitude is real — visitors from sea level notice it by the second half. Orange everywhere, loud crowd, strong tailgate culture in the surrounding lots.",
  },
  {
    q: "What's the best pregame option near Empower Field?",
    a: "LoDo has the best pregame bar scene — Larimer Square and the blocks around Union Station fill with orange a few hours before kickoff. Jefferson Park has a couple of solid neighborhood spots closer to the stadium. Either works.",
  },
];

export default async function EventsEmpowerFieldPage() {
  const events = await getEventsForVenue("Empower Field", 20);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
        { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://davelovesdenver.com" },
          { "@type": "ListItem", position: 2, name: "Events", item: "https://davelovesdenver.com/events" },
          { "@type": "ListItem", position: 3, name: "Empower Field", item: "https://davelovesdenver.com/events/empower-field" },
        ]},
        { "@context": "https://schema.org", "@type": "WebPage",
          name: "Empower Field Events & Broncos Schedule 2026",
          description: "Full schedule of Denver Broncos games and events at Empower Field at Mile High.",
          url: "https://davelovesdenver.com/events/empower-field",
          speakableSpecification: { "@type": "SpeakableSpecification", cssSelector: ["[data-speakable]"] },
        },
        { "@context": "https://schema.org", "@type": "SportsActivityLocation",
          name: "Empower Field at Mile High",
          address: { "@type": "PostalAddress", streetAddress: "1701 Bryant St", addressLocality: "Denver", addressRegion: "CO", postalCode: "80204" },
        },
        { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQS.map((f) => ({
          "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a },
        }))},
        ...events.map((e) => ({
          "@context": "https://schema.org", "@type": "Event",
          name: e.name, startDate: e.start_time,
          location: { "@type": "Place", name: "Empower Field at Mile High", address: "1701 Bryant St, Denver, CO 80204" },
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
            <span className="text-white/80">Empower Field</span>
          </nav>
          <p className="text-denver-amber text-sm font-semibold uppercase tracking-widest mb-3">Denver, Colorado · Mile High</p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight" data-speakable>Upcoming Events at Empower Field at Mile High</h1>
          <p className="mt-4 text-lg text-white/70 max-w-2xl" data-speakable>
            Home of the Denver Broncos — one of the better NFL environments in the league. The altitude hits differently by the fourth quarter, and the orange crowd is real.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h2 className="text-xl font-bold">{events.length > 0 ? `${events.length} Upcoming Events` : "Upcoming Events"}</h2>
          <a href={ticketmasterAffiliateUrl("https://www.ticketmaster.com/search?q=empower+field+denver")} target="_blank" rel="noopener noreferrer"
            className="text-sm text-denver-amber font-semibold hover:underline">All events on Ticketmaster &rarr;</a>
        </div>
        {events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event) => <EventCard key={event.event_id} event={event} />)}
          </div>
        ) : (
          <div className="py-12 text-center text-slate-500">
            <p className="text-lg font-medium mb-2">No upcoming events found right now.</p>
            <a href={ticketmasterAffiliateUrl("https://www.ticketmaster.com/search?q=empower+field+denver")} target="_blank" rel="noopener noreferrer"
              className="text-denver-amber font-semibold hover:underline text-sm">Check Ticketmaster for the full schedule &rarr;</a>
          </div>
        )}
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-100 dark:border-slate-800">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">About Empower Field at Mile High</h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Empower Field opened in 2001, replacing the original Mile High Stadium. It holds 76,125 — one of the larger NFL stadiums — and sits directly west of downtown Denver with the Rockies visible on the horizon.</p>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">The Broncos fan base is one of the most loyal in the NFL. The stadium sells out consistently and the atmosphere for big games is legitimately electric. The altitude affects visiting teams more than locals realize.</p>
            <blockquote className="border-l-4 border-denver-amber pl-4 text-slate-600 dark:text-slate-400 text-sm leading-relaxed italic" data-speakable>
              &ldquo;Game days at Mile High are fun even if you&apos;re not a Broncos fan. The walk from LoDo through Jefferson Park, the orange everywhere, the altitude — it&apos;s a proper NFL experience. Stay in LoDo and walk both ways.&rdquo;
              <footer className="mt-1 text-xs not-italic text-slate-400">— Dave</footer>
            </blockquote>
          </div>
          <div className="grid grid-cols-2 gap-4 content-start">
            {[
              { label: "Capacity", value: "76,125" },
              { label: "Elevation", value: "5,280 ft" },
              { label: "Location", value: "West Denver" },
              { label: "Walk from LoDo", value: "15 min" },
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
            <h2 className="text-xl font-bold mb-2">In town for the game?</h2>
            <p className="text-white/70 text-sm max-w-md">LoDo and Jefferson Park put you within walking distance. We break down the closest hotels and what the tradeoffs are.</p>
          </div>
          <Link href="/hotels/near-empower-field"
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-denver-amber hover:bg-amber-500 text-white font-semibold rounded-full transition-colors text-sm">
            Hotels near Empower Field &rarr;
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
          <Link href="/hotels/near-empower-field" className="inline-flex items-center gap-2 px-5 py-2.5 bg-denver-navy hover:bg-denver-navy/90 text-white text-sm font-semibold rounded-full transition-colors">Hotels near Empower Field &rarr;</Link>
          <Link href="/events/ball-arena" className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber text-sm font-semibold rounded-full transition-colors">Ball Arena events &rarr;</Link>
          <Link href="/events/coors-field" className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber text-sm font-semibold rounded-full transition-colors">Coors Field events &rarr;</Link>
          <Link href="/events/red-rocks" className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber text-sm font-semibold rounded-full transition-colors">Red Rocks shows &rarr;</Link>
        </div>
      </section>
    </>
  );
}

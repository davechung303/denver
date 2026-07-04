import type { Metadata } from "next";
import Link from "next/link";
import { getEventsForVenue } from "@/lib/ticketmaster";
import { ticketmasterAffiliateUrl } from "@/lib/travelpayouts";
import EventCard from "@/components/EventCard";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Paramount Theatre Denver Events & Show Schedule 2026 | Dave Loves Denver",
  description:
    "Full schedule of upcoming shows at the Paramount Theatre in downtown Denver. A landmark 2,000-capacity venue — browse shows and buy tickets.",
  alternates: { canonical: "https://davelovesdenver.com/events/paramount-theatre" },
  openGraph: {
    title: "Paramount Theatre Denver Events & Show Schedule 2026",
    description: "Upcoming shows at the Paramount Theatre in downtown Denver — full schedule and tickets.",
    url: "https://davelovesdenver.com/events/paramount-theatre",
  },
};

const FAQS = [
  {
    q: "What kind of shows does the Paramount Theatre book?",
    a: "The Paramount books mid-size touring acts across rock, pop, comedy, and performing arts — typically in the 1,500–2,000 range. It's a step up from the Ogden in capacity and formality. The historic room makes even mid-size shows feel like an event.",
  },
  {
    q: "Where is the Paramount Theatre in Denver?",
    a: "The Paramount sits on 16th Street Mall in the heart of downtown Denver — at the intersection of 16th and Glenarm. It's walkable from virtually every downtown hotel and directly connected to the light rail and bus network.",
  },
  {
    q: "How old is the Paramount Theatre?",
    a: "The Paramount opened in 1930 as a movie palace and is one of Denver's most significant historic buildings. The Art Deco interior has been restored and is legitimately beautiful — the architecture alone is worth seeing.",
  },
  {
    q: "Is the Paramount Theatre general admission or reserved seating?",
    a: "It varies by show. Many shows are general admission floor with reserved balcony; some events are fully reserved. Check the specific event listing for seating configuration.",
  },
  {
    q: "What's nearby the Paramount Theatre before a show?",
    a: "Everything downtown. The 16th Street Mall, LoDo, and the blocks around the theatre have dozens of restaurant options. The location is as central as it gets in Denver — most hotel guests will be within walking distance.",
  },
];

export default async function EventsParamountTheatrePage() {
  const events = await getEventsForVenue("Paramount Theatre", 20);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
        { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://davelovesdenver.com" },
          { "@type": "ListItem", position: 2, name: "Events", item: "https://davelovesdenver.com/events" },
          { "@type": "ListItem", position: 3, name: "Paramount Theatre", item: "https://davelovesdenver.com/events/paramount-theatre" },
        ]},
        { "@context": "https://schema.org", "@type": "WebPage",
          name: "Paramount Theatre Denver Events & Show Schedule 2026",
          description: "Full schedule of upcoming shows at the Paramount Theatre in downtown Denver.",
          url: "https://davelovesdenver.com/events/paramount-theatre",
          speakableSpecification: { "@type": "SpeakableSpecification", cssSelector: ["[data-speakable]"] },
        },
        { "@context": "https://schema.org", "@type": "MusicVenue",
          name: "Paramount Theatre",
          address: { "@type": "PostalAddress", streetAddress: "1621 Glenarm Pl", addressLocality: "Denver", addressRegion: "CO", postalCode: "80202" },
        },
        { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQS.map((f) => ({
          "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a },
        }))},
        ...events.map((e) => ({
          "@context": "https://schema.org", "@type": "Event",
          name: e.name, startDate: e.start_time,
          location: { "@type": "Place", name: "Paramount Theatre", address: "1621 Glenarm Pl, Denver, CO 80202" },
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
            <span className="text-white/80">Paramount Theatre</span>
          </nav>
          <p className="text-denver-amber text-sm font-semibold uppercase tracking-widest mb-3">Downtown Denver</p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight" data-speakable>Upcoming Shows at the Paramount Theatre</h1>
          <p className="mt-4 text-lg text-white/70 max-w-2xl" data-speakable>
            A 1930 Art Deco landmark on 16th Street Mall — 2,000 capacity, beautifully restored, in the center of downtown Denver. The room makes any show feel special.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h2 className="text-xl font-bold">{events.length > 0 ? `${events.length} Upcoming Shows` : "Upcoming Shows"}</h2>
          <a href={ticketmasterAffiliateUrl("https://www.ticketmaster.com/search?q=paramount+theatre+denver")} target="_blank" rel="noopener noreferrer"
            className="text-sm text-denver-amber font-semibold hover:underline">All shows on Ticketmaster &rarr;</a>
        </div>
        {events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event) => <EventCard key={event.event_id} event={event} />)}
          </div>
        ) : (
          <div className="py-12 text-center text-slate-500">
            <p className="text-lg font-medium mb-2">No upcoming events found right now.</p>
            <a href={ticketmasterAffiliateUrl("https://www.ticketmaster.com/search?q=paramount+theatre+denver")} target="_blank" rel="noopener noreferrer"
              className="text-denver-amber font-semibold hover:underline text-sm">Check Ticketmaster for the full schedule &rarr;</a>
          </div>
        )}
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-100 dark:border-slate-800">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">About the Paramount Theatre</h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">The Paramount Theatre opened in 1930 as a movie palace and is a Denver landmark. The Art Deco interior — ornate plasterwork, original architectural details, restored to excellent condition — gives the venue a character that purpose-built modern venues can&apos;t match.</p>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">At 2,000 capacity it&apos;s the right size for artists between the club circuit and arena tours. The location on 16th Street Mall means you&apos;re in the absolute center of downtown Denver — every hotel, restaurant, and bar is accessible without a car.</p>
            <blockquote className="border-l-4 border-denver-amber pl-4 text-slate-600 dark:text-slate-400 text-sm leading-relaxed italic" data-speakable>
              &ldquo;The Paramount is one of those rooms where the building itself adds to the show. The Art Deco details are real, the acoustics are good, and it&apos;s on 16th Street Mall — which means dinner, show, and a drink after are all a short walk from each other.&rdquo;
              <footer className="mt-1 text-xs not-italic text-slate-400">— Dave</footer>
            </blockquote>
          </div>
          <div className="grid grid-cols-2 gap-4 content-start">
            {[
              { label: "Capacity", value: "~2,000" },
              { label: "Neighborhood", value: "Downtown" },
              { label: "Opened", value: "1930" },
              { label: "Style", value: "Art Deco" },
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
            <h2 className="text-xl font-bold mb-2">Staying downtown for the show?</h2>
            <p className="text-white/70 text-sm max-w-md">The Convention Center area and LoDo have excellent hotel options within easy walking distance of the Paramount.</p>
          </div>
          <Link href="/hotels/near-convention-center"
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-denver-amber hover:bg-amber-500 text-white font-semibold rounded-full transition-colors text-sm">
            Hotels near downtown Denver &rarr;
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
          <Link href="/hotels/near-convention-center" className="inline-flex items-center gap-2 px-5 py-2.5 bg-denver-navy hover:bg-denver-navy/90 text-white text-sm font-semibold rounded-full transition-colors">Hotels near downtown Denver &rarr;</Link>
          <Link href="/events/ogden-theatre" className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber text-sm font-semibold rounded-full transition-colors">Ogden Theatre shows &rarr;</Link>
          <Link href="/events/mission-ballroom" className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber text-sm font-semibold rounded-full transition-colors">Mission Ballroom shows &rarr;</Link>
          <Link href="/events/red-rocks" className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber text-sm font-semibold rounded-full transition-colors">Red Rocks shows &rarr;</Link>
        </div>
      </section>
    </>
  );
}

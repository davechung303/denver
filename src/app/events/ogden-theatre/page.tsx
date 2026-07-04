import type { Metadata } from "next";
import Link from "next/link";
import { getEventsForVenueFromAPI } from "@/lib/ticketmaster";
import { ticketmasterAffiliateUrl } from "@/lib/travelpayouts";
import EventCard from "@/components/EventCard";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Ogden Theatre Denver Events & Show Schedule 2026 | Dave Loves Denver",
  description:
    "Full schedule of upcoming shows at the Ogden Theatre in Denver's Capitol Hill neighborhood. One of Denver's historic music venues — browse shows and buy tickets.",
  alternates: { canonical: "https://davelovesdenver.com/events/ogden-theatre" },
  openGraph: {
    title: "Ogden Theatre Denver Events & Show Schedule 2026",
    description: "Upcoming shows at the Ogden Theatre in Capitol Hill — full schedule and tickets.",
    url: "https://davelovesdenver.com/events/ogden-theatre",
  },
};

const FAQS = [
  {
    q: "What kind of shows does the Ogden Theatre host?",
    a: "The Ogden books mid-size national touring acts across rock, indie, electronic, and alternative — artists in the 1,000–1,600 range where the show is still intimate but the act is nationally known. It's the right size for artists who've outgrown smaller clubs but aren't ready for Mission Ballroom.",
  },
  {
    q: "What neighborhood is the Ogden Theatre in?",
    a: "Capitol Hill — one of Denver's most distinctive neighborhoods, with a mix of historic architecture, independent restaurants, bars, and music venues. Colfax Avenue has everything you need before a show.",
  },
  {
    q: "How old is the Ogden Theatre?",
    a: "The Ogden opened in 1917 as a movie palace and converted to a live music venue. It's one of the oldest continuously operating entertainment venues in Denver. The room has genuine character that newer venues can't replicate.",
  },
  {
    q: "Is the Ogden Theatre general admission?",
    a: "Most shows are general admission standing floor. Some shows have limited balcony seating. The floor feels intimate at capacity — you're close to the stage in a way that larger venues can't match.",
  },
  {
    q: "What should I do before a show at the Ogden?",
    a: "Eat or drink on Colfax. Dozens of bars and restaurants are within walking distance. Breakfast at Jelly or dinner at one of the Capitol Hill spots, then walk to the show. It's an easy neighborhood night.",
  },
];

export default async function EventsOgdenTheatrePage() {
  const events = await getEventsForVenueFromAPI("ogden-theatre", 50);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
        { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://davelovesdenver.com" },
          { "@type": "ListItem", position: 2, name: "Events", item: "https://davelovesdenver.com/events" },
          { "@type": "ListItem", position: 3, name: "Ogden Theatre", item: "https://davelovesdenver.com/events/ogden-theatre" },
        ]},
        { "@context": "https://schema.org", "@type": "WebPage",
          name: "Ogden Theatre Denver Events & Show Schedule 2026",
          description: "Full schedule of upcoming shows at the Ogden Theatre in Denver's Capitol Hill neighborhood.",
          url: "https://davelovesdenver.com/events/ogden-theatre",
          speakableSpecification: { "@type": "SpeakableSpecification", cssSelector: ["[data-speakable]"] },
        },
        { "@context": "https://schema.org", "@type": "MusicVenue",
          name: "Ogden Theatre",
          address: { "@type": "PostalAddress", streetAddress: "935 E Colfax Ave", addressLocality: "Denver", addressRegion: "CO", postalCode: "80218" },
        },
        { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQS.map((f) => ({
          "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a },
        }))},
        ...events.map((e) => ({
          "@context": "https://schema.org", "@type": "Event",
          name: e.name, startDate: e.start_time,
          location: { "@type": "Place", name: "Ogden Theatre", address: "935 E Colfax Ave, Denver, CO 80218" },
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
            <span className="text-white/80">Ogden Theatre</span>
          </nav>
          <p className="text-denver-amber text-sm font-semibold uppercase tracking-widest mb-3">Capitol Hill, Denver</p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight" data-speakable>Upcoming Shows at the Ogden Theatre</h1>
          <p className="mt-4 text-lg text-white/70 max-w-2xl" data-speakable>
            Denver&apos;s historic 1,600-capacity room on Colfax — open since 1917, still one of the best rooms in the city for a mid-size show. The character of the space is real.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h2 className="text-xl font-bold">{events.length > 0 ? `${events.length} Upcoming Shows` : "Upcoming Shows"}</h2>
          <a href={ticketmasterAffiliateUrl("https://www.ticketmaster.com/search?q=ogden+theatre+denver")} target="_blank" rel="noopener noreferrer"
            className="text-sm text-denver-amber font-semibold hover:underline">All shows on Ticketmaster &rarr;</a>
        </div>
        {events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event) => <EventCard key={event.event_id} event={event} />)}
          </div>
        ) : (
          <div className="py-12 text-center text-slate-500">
            <p className="text-lg font-medium mb-2">No upcoming events found right now.</p>
            <a href={ticketmasterAffiliateUrl("https://www.ticketmaster.com/search?q=ogden+theatre+denver")} target="_blank" rel="noopener noreferrer"
              className="text-denver-amber font-semibold hover:underline text-sm">Check Ticketmaster for the full schedule &rarr;</a>
          </div>
        )}
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-100 dark:border-slate-800">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">About the Ogden Theatre</h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">The Ogden Theatre opened in 1917 as a movie palace on East Colfax Avenue and has been a live music venue for decades. At 1,600 capacity it sits in a sweet spot — big enough for real production, small enough that you&apos;re always close to the stage.</p>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">The Capitol Hill location puts you in the middle of one of Denver&apos;s most interesting neighborhoods. Colfax has dozens of bars and restaurants within walking distance. This is a proper neighborhood venue in a proper neighborhood.</p>
            <blockquote className="border-l-4 border-denver-amber pl-4 text-slate-600 dark:text-slate-400 text-sm leading-relaxed italic" data-speakable>
              &ldquo;The Ogden is what a music venue should feel like — real room, real history, the right size so you can actually see the artist. Capitol Hill makes the whole night better. This is one of the best reasons to be in Denver.&rdquo;
              <footer className="mt-1 text-xs not-italic text-slate-400">— Dave</footer>
            </blockquote>
          </div>
          <div className="grid grid-cols-2 gap-4 content-start">
            {[
              { label: "Capacity", value: "~1,600" },
              { label: "Neighborhood", value: "Capitol Hill" },
              { label: "Opened", value: "1917" },
              { label: "Street", value: "E Colfax Ave" },
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
            <h2 className="text-xl font-bold mb-2">Need a place to stay?</h2>
            <p className="text-white/70 text-sm max-w-md">Capitol Hill and downtown hotels keep you close to the Ogden and everything else Denver has to offer.</p>
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
          <Link href="/events/mission-ballroom" className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber text-sm font-semibold rounded-full transition-colors">Mission Ballroom shows &rarr;</Link>
          <Link href="/events/paramount-theatre" className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber text-sm font-semibold rounded-full transition-colors">Paramount Theatre shows &rarr;</Link>
          <Link href="/events/red-rocks" className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber text-sm font-semibold rounded-full transition-colors">Red Rocks shows &rarr;</Link>
        </div>
      </section>
    </>
  );
}

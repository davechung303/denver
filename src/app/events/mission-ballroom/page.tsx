import type { Metadata } from "next";
import Link from "next/link";
import { getEventsForVenue } from "@/lib/ticketmaster";
import { ticketmasterAffiliateUrl } from "@/lib/travelpayouts";
import EventCard from "@/components/EventCard";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Mission Ballroom Denver Events & Show Schedule 2026 | Dave Loves Denver",
  description:
    "Full schedule of upcoming shows at Mission Ballroom in Denver's RiNo neighborhood. One of the best mid-size venues in the country — browse shows and buy tickets.",
  alternates: { canonical: "https://davelovesdenver.com/events/mission-ballroom" },
  openGraph: {
    title: "Mission Ballroom Denver Events & Show Schedule 2026",
    description: "Upcoming shows at Mission Ballroom in RiNo — full schedule and tickets.",
    url: "https://davelovesdenver.com/events/mission-ballroom",
  },
};

const FAQS = [
  {
    q: "What kind of shows does Mission Ballroom host?",
    a: "Mission Ballroom books mid-to-large national touring acts across genres — rock, electronic, hip-hop, indie, country. Think artists too big for Ogden or Paramount but not quite stadium scale. The 4,000-person capacity hits a sweet spot for great production and still feeling like a real show.",
  },
  {
    q: "What neighborhood is Mission Ballroom in?",
    a: "RiNo — River North Art District, Denver's best neighborhood for food and drink. The venue is surrounded by some of the city's best restaurants and breweries. A show at Mission Ballroom is a great reason to spend a full evening in RiNo.",
  },
  {
    q: "Is Mission Ballroom general admission?",
    a: "Most shows are general admission standing floor with reserved balcony seating available. The floor is the move for most shows — good sightlines from almost anywhere. The balcony is good if you prefer a seat.",
  },
  {
    q: "How is the sound at Mission Ballroom?",
    a: "Excellent. Mission Ballroom was purpose-built as a music venue and the acoustics reflect that. It's consistently praised by touring artists and fans alike — the sound is clean and loud without being muddy.",
  },
  {
    q: "What should I do before a show at Mission Ballroom?",
    a: "Eat in RiNo. Señor Bear, Zeppelin Station, Dio Mio, and dozens of other restaurants are within walking distance. Book a reservation ahead of time for popular spots — they fill up on show nights. Get to the venue early to catch the opener.",
  },
];

export default async function EventsMissionBallroomPage() {
  const events = await getEventsForVenue("Mission Ballroom", 20);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
        { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://davelovesdenver.com" },
          { "@type": "ListItem", position: 2, name: "Events", item: "https://davelovesdenver.com/events" },
          { "@type": "ListItem", position: 3, name: "Mission Ballroom", item: "https://davelovesdenver.com/events/mission-ballroom" },
        ]},
        { "@context": "https://schema.org", "@type": "WebPage",
          name: "Mission Ballroom Denver Events & Show Schedule 2026",
          description: "Full schedule of upcoming shows at Mission Ballroom in Denver's RiNo neighborhood.",
          url: "https://davelovesdenver.com/events/mission-ballroom",
          speakableSpecification: { "@type": "SpeakableSpecification", cssSelector: ["[data-speakable]"] },
        },
        { "@context": "https://schema.org", "@type": "MusicVenue",
          name: "Mission Ballroom",
          address: { "@type": "PostalAddress", streetAddress: "4242 Wynkoop St", addressLocality: "Denver", addressRegion: "CO", postalCode: "80216" },
        },
        { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQS.map((f) => ({
          "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a },
        }))},
        ...events.map((e) => ({
          "@context": "https://schema.org", "@type": "Event",
          name: e.name, startDate: e.start_time,
          location: { "@type": "Place", name: "Mission Ballroom", address: "4242 Wynkoop St, Denver, CO 80216" },
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
            <span className="text-white/80">Mission Ballroom</span>
          </nav>
          <p className="text-denver-amber text-sm font-semibold uppercase tracking-widest mb-3">RiNo, Denver</p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight" data-speakable>Upcoming Shows at Mission Ballroom Denver</h1>
          <p className="mt-4 text-lg text-white/70 max-w-2xl" data-speakable>
            One of the best mid-size music venues in the country — in RiNo, Denver&apos;s best neighborhood. The show is great, but so is everything around it.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h2 className="text-xl font-bold">{events.length > 0 ? `${events.length} Upcoming Shows` : "Upcoming Shows"}</h2>
          <a href={ticketmasterAffiliateUrl("https://www.ticketmaster.com/search?q=mission+ballroom+denver")} target="_blank" rel="noopener noreferrer"
            className="text-sm text-denver-amber font-semibold hover:underline">All shows on Ticketmaster &rarr;</a>
        </div>
        {events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event) => <EventCard key={event.event_id} event={event} />)}
          </div>
        ) : (
          <div className="py-12 text-center text-slate-500">
            <p className="text-lg font-medium mb-2">No upcoming events found right now.</p>
            <a href={ticketmasterAffiliateUrl("https://www.ticketmaster.com/search?q=mission+ballroom+denver")} target="_blank" rel="noopener noreferrer"
              className="text-denver-amber font-semibold hover:underline text-sm">Check Ticketmaster for the full schedule &rarr;</a>
          </div>
        )}
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-100 dark:border-slate-800">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">About Mission Ballroom</h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Mission Ballroom opened in 2019 in RiNo and immediately became one of the most-talked-about new venues in the country. The 4,000-capacity room was purpose-built for music — the sound system, sightlines, and bar situation are all excellent.</p>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">The venue sits in the middle of Denver&apos;s best restaurant and brewery neighborhood. Before or after a show, you have some of the best options in the city within walking distance. This is the ideal concert setup.</p>
            <blockquote className="border-l-4 border-denver-amber pl-4 text-slate-600 dark:text-slate-400 text-sm leading-relaxed italic" data-speakable>
              &ldquo;Mission Ballroom is the reason to stay in RiNo. Dinner at one of the neighborhood spots, walk to the show, walk to a brewery after. The venue itself is genuinely one of the best I&apos;ve been to anywhere — the sound and sightlines are that good.&rdquo;
              <footer className="mt-1 text-xs not-italic text-slate-400">— Dave</footer>
            </blockquote>
          </div>
          <div className="grid grid-cols-2 gap-4 content-start">
            {[
              { label: "Capacity", value: "~4,000" },
              { label: "Neighborhood", value: "RiNo" },
              { label: "Opened", value: "2019" },
              { label: "Floor", value: "General Admission" },
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
            <h2 className="text-xl font-bold mb-2">Making a night of it?</h2>
            <p className="text-white/70 text-sm max-w-md">RiNo and LoDo hotels put you walking distance from the venue. We cover the best options in both neighborhoods.</p>
          </div>
          <Link href="/hotels/near-mission-ballroom"
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-denver-amber hover:bg-amber-500 text-white font-semibold rounded-full transition-colors text-sm">
            Hotels near Mission Ballroom &rarr;
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
          <Link href="/hotels/near-mission-ballroom" className="inline-flex items-center gap-2 px-5 py-2.5 bg-denver-navy hover:bg-denver-navy/90 text-white text-sm font-semibold rounded-full transition-colors">Hotels near Mission Ballroom &rarr;</Link>
          <Link href="/events/ogden-theatre" className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber text-sm font-semibold rounded-full transition-colors">Ogden Theatre shows &rarr;</Link>
          <Link href="/events/fiddlers-green" className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber text-sm font-semibold rounded-full transition-colors">Fiddler&apos;s Green shows &rarr;</Link>
          <Link href="/events/red-rocks" className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber text-sm font-semibold rounded-full transition-colors">Red Rocks shows &rarr;</Link>
        </div>
      </section>
    </>
  );
}

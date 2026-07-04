import type { Metadata } from "next";
import Link from "next/link";
import { getEventsForVenue } from "@/lib/ticketmaster";
import { ticketmasterAffiliateUrl } from "@/lib/travelpayouts";
import EventCard from "@/components/EventCard";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Red Rocks Amphitheatre Events & Concert Schedule 2026 | Dave Loves Denver",
  description:
    "Full schedule of upcoming concerts and shows at Red Rocks Amphitheatre in Morrison, CO. Browse events, buy tickets, and find hotels nearby.",
  alternates: { canonical: "https://davelovesdenver.com/events/red-rocks" },
  openGraph: {
    title: "Red Rocks Amphitheatre Events & Concert Schedule 2026",
    description: "Upcoming shows at Red Rocks — browse the full schedule and buy tickets.",
    url: "https://davelovesdenver.com/events/red-rocks",
  },
};

const FAQS = [
  {
    q: "How do I get tickets to Red Rocks shows?",
    a: "Most Red Rocks shows are ticketed through Ticketmaster. Popular shows sell out fast — sign up for artist presales and check Ticketmaster the moment on-sale goes live. Day-of tickets sometimes appear but don't count on it for big acts.",
  },
  {
    q: "Is Red Rocks general admission or assigned seating?",
    a: "Most shows are assigned seating on the rock rows. Some shows (especially jam bands and EDM) go general admission on the floor. Check your specific show — the configuration changes. Row 1 and the top rows both have unique appeal.",
  },
  {
    q: "What's the best way to get to Red Rocks?",
    a: "Drive or take a pre-booked shuttle. Rideshares to the venue are straightforward, but post-show surge pricing can be brutal — $80+ from Morrison isn't uncommon. Shuttle services from LoDo and Union Station are the smarter move for big shows.",
  },
  {
    q: "What should I bring to a Red Rocks show?",
    a: "Layers are essential — it's at 6,450 feet and gets cold after sunset regardless of the season. Bring a jacket, comfortable shoes (it's a hike to your seat), water, and sunscreen for afternoon shows. Most bags are allowed; check the venue's prohibited items list.",
  },
  {
    q: "Are there restaurants at Red Rocks?",
    a: "The Ship Rock Grille restaurant is on site with mountain views. Inside the amphitheatre there are concession stands. For a proper pre-show meal, Morrison has a few options or head to nearby Evergreen — don't expect much in the immediate area.",
  },
];

export default async function EventsRedRocksPage() {
  const events = await getEventsForVenue("Red Rocks", 20);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
        { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://davelovesdenver.com" },
          { "@type": "ListItem", position: 2, name: "Events", item: "https://davelovesdenver.com/events" },
          { "@type": "ListItem", position: 3, name: "Red Rocks", item: "https://davelovesdenver.com/events/red-rocks" },
        ]},
        { "@context": "https://schema.org", "@type": "WebPage",
          name: "Red Rocks Amphitheatre Events & Concert Schedule 2026",
          description: "Full schedule of upcoming concerts and shows at Red Rocks Amphitheatre in Morrison, CO.",
          url: "https://davelovesdenver.com/events/red-rocks",
          speakableSpecification: { "@type": "SpeakableSpecification", cssSelector: ["[data-speakable]"] },
        },
        { "@context": "https://schema.org", "@type": "MusicVenue",
          name: "Red Rocks Amphitheatre",
          address: { "@type": "PostalAddress", streetAddress: "18300 W Alameda Pkwy", addressLocality: "Morrison", addressRegion: "CO", postalCode: "80465" },
          url: "https://www.redrocksonline.com",
        },
        { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQS.map((f) => ({
          "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a },
        }))},
        ...events.map((e) => ({
          "@context": "https://schema.org", "@type": "Event",
          name: e.name,
          startDate: e.start_time,
          location: { "@type": "Place", name: "Red Rocks Amphitheatre", address: "18300 W Alameda Pkwy, Morrison, CO 80465" },
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
            <span className="text-white/80">Red Rocks</span>
          </nav>
          <p className="text-denver-amber text-sm font-semibold uppercase tracking-widest mb-3">Morrison, Colorado · 6,450 ft</p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight" data-speakable>Upcoming Events at Red Rocks Amphitheatre</h1>
          <p className="mt-4 text-lg text-white/70 max-w-2xl" data-speakable>
            The greatest outdoor music venue in the world. Every show here is an experience — the rock formations, the altitude, the Colorado sky. Here&apos;s what&apos;s coming up.
          </p>
        </div>
      </section>

      {/* Events grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h2 className="text-xl font-bold">
            {events.length > 0 ? `${events.length} Upcoming Shows` : "Upcoming Shows"}
          </h2>
          <a href={ticketmasterAffiliateUrl("https://www.ticketmaster.com/search?q=red+rocks+amphitheatre")} target="_blank" rel="noopener noreferrer"
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
            <a href={ticketmasterAffiliateUrl("https://www.ticketmaster.com/search?q=red+rocks+amphitheatre")} target="_blank" rel="noopener noreferrer"
              className="text-denver-amber font-semibold hover:underline text-sm">
              Check Ticketmaster for the full schedule &rarr;
            </a>
          </div>
        )}
      </section>

      {/* About */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-100 dark:border-slate-800">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">About Red Rocks</h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Red Rocks Amphitheatre is a naturally occurring geological formation turned concert venue in the foothills outside Morrison, Colorado. The 9,525-seat venue sits between 300-foot sandstone monoliths — Ship Rock and Creation Rock — with the Denver skyline visible on the horizon.</p>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Acts from the Beatles to U2 to Radiohead have played here. The venue is consistently ranked the best concert venue in the country, and anyone who&apos;s been knows why. The altitude (6,450 feet), the acoustics, the setting — nothing else compares.</p>
            <blockquote className="border-l-4 border-denver-amber pl-4 text-slate-600 dark:text-slate-400 text-sm leading-relaxed italic" data-speakable>
              &ldquo;I&apos;ve been to Red Rocks in the rain, in 70-degree perfect weather, and in the cold. Every single time it&apos;s worth it. If you&apos;re flying into Denver for a show here, plan to stay at least one extra night — this city deserves more than a single night.&rdquo;
              <footer className="mt-1 text-xs not-italic text-slate-400">— Dave</footer>
            </blockquote>
          </div>
          <div className="grid grid-cols-2 gap-4 content-start">
            {[
              { label: "Capacity", value: "9,525" },
              { label: "Elevation", value: "6,450 ft" },
              { label: "Location", value: "Morrison, CO" },
              { label: "Opened", value: "1941" },
            ].map((stat) => (
              <div key={stat.label} className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-5">
                <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hotels CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-100 dark:border-slate-800">
        <div className="bg-denver-navy text-white rounded-2xl p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h2 className="text-xl font-bold mb-2">Staying for the show?</h2>
            <p className="text-white/70 text-sm max-w-md">Morrison, Lakewood, and downtown Denver are your options. We break down exactly where to stay, what the tradeoffs are, and which hotels are worth it.</p>
          </div>
          <Link href="/hotels/near-red-rocks"
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-denver-amber hover:bg-amber-500 text-white font-semibold rounded-full transition-colors text-sm">
            Hotels near Red Rocks &rarr;
          </Link>
        </div>
      </section>

      {/* Tips */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-bold mb-6">Show Night Tips</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { title: "Book a Shuttle", body: "Shuttle services run from Union Station and LoDo on show nights. Pre-booked is cheaper and solves the post-show Uber surge problem entirely. They fill up fast for big concerts." },
            { title: "Bring Layers", body: "It gets cold at altitude after sunset — even in July. A jacket isn't optional, it's mandatory. Temperature can drop 20+ degrees between doors opening and the encore." },
            { title: "Arrive Early", body: "Traffic backs up on Red Rocks Road before big shows. Show up 90 minutes early, explore the formations, and get settled. The venue itself is worth the extra time." },
          ].map((tip) => (
            <div key={tip.title} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
              <h3 className="font-bold mb-2">{tip.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{tip.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
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
          <Link href="/hotels/near-red-rocks" className="inline-flex items-center gap-2 px-5 py-2.5 bg-denver-navy hover:bg-denver-navy/90 text-white text-sm font-semibold rounded-full transition-colors">
            Hotels near Red Rocks &rarr;
          </Link>
          <Link href="/events/fiddlers-green" className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber text-sm font-semibold rounded-full transition-colors">
            Fiddler&apos;s Green shows &rarr;
          </Link>
          <Link href="/events/ball-arena" className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber text-sm font-semibold rounded-full transition-colors">
            Ball Arena events &rarr;
          </Link>
          <Link href="/events/mission-ballroom" className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber text-sm font-semibold rounded-full transition-colors">
            Mission Ballroom shows &rarr;
          </Link>
        </div>
      </section>
    </>
  );
}

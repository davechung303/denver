import type { Metadata } from "next";
import Link from "next/link";
import { getPlaces, isRealHotel, photoUrl } from "@/lib/places";
import VenueHotelCard from "@/components/VenueHotelCard";
import { expediaDenverHotelsUrl, ticketmasterAffiliateUrl } from "@/lib/travelpayouts";
import { getEventsForVenue } from "@/lib/ticketmaster";
import EventCard from "@/components/EventCard";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Hotels Near Red Rocks Amphitheatre — Best Places to Stay for Shows | Dave Loves Denver",
  description:
    "The local's guide to hotels near Red Rocks Amphitheatre — the closest hotels, which shuttle from downtown, plus the best budget, luxury, and brand-name picks in Morrison, Lakewood, Golden, and Denver for a show.",
  alternates: { canonical: "https://davelovesdenver.com/hotels/near-red-rocks" },
  openGraph: {
    title: "Hotels Near Red Rocks Amphitheatre",
    description: "Where to stay for a Red Rocks show — Morrison, Lakewood, and downtown Denver options explained.",
    url: "https://davelovesdenver.com/hotels/near-red-rocks",
  },
};

const FAQS = [
  {
    q: "Are there hotels walking distance to Red Rocks?",
    a: "Not really. Red Rocks is a natural amphitheatre carved into sandstone in the mountains outside Morrison — no hotels immediately adjacent. Most concert-goers stay in Lakewood, Golden, or downtown Denver and drive or Uber to the show.",
  },
  {
    q: "How far is Red Rocks from downtown Denver?",
    a: "About 30–35 minutes by car with no traffic. On show nights, expect traffic on Highway 285 heading toward the venue. Rideshares surge significantly after shows — factor in a shuttle or designated driver.",
  },
  {
    q: "What's the closest city to Red Rocks Amphitheatre?",
    a: "Morrison is right at the base of the road leading up to Red Rocks. Lakewood is the closest suburb of Denver with a real hotel selection, about 15–20 minutes from the venue. Golden is slightly further but a great base with its own character.",
  },
  {
    q: "Should I stay near Red Rocks or in Denver?",
    a: "If you're spending multiple nights, stay in Denver — far better food, bars, and access to the city. For a single show night, Lakewood or Golden keeps things simple. Either way, post-show surge pricing on rideshares can be brutal — a shuttle or designated driver is the smarter move.",
  },
  {
    q: "Is there a shuttle from Denver to Red Rocks?",
    a: "Yes — several shuttle services run from Union Station and LoDo on show nights. These book fast for big concerts. A pre-booked shuttle removes the post-show Uber problem entirely and is often cheaper.",
  },
  {
    q: "What should I wear to Red Rocks at night?",
    a: "Red Rocks sits at 6,450 feet and gets significantly colder after sunset — even in summer. A jacket or sweatshirt is always a good idea. The temperature can drop 20+ degrees between doors opening and the end of the show. Layers are the move.",
  },
  {
    q: "What's the closest hotel to Red Rocks Amphitheatre?",
    a: "The Origin Hotel Red Rocks, on the Golden/Morrison side, is the closest branded hotel to the venue — a short drive to the gates. Beyond that, Morrison itself has very limited lodging, so most concert-goers base in Lakewood or Golden and drive or take a shuttle in.",
  },
  {
    q: "Are there cheap hotels near Red Rocks?",
    a: "The best value is the west-metro budget and midscale chains in Lakewood and along the Golden corridor — close enough for a short drive, far cheaper than downtown. Show nights for big-name concerts push prices up everywhere, so book early once your date is set.",
  },
  {
    q: "Are there Marriott or Hilton hotels near Red Rocks?",
    a: "Yes — Lakewood and Golden, between the venue and Denver, have several Marriott-family and Hilton-family hotels, so brand-loyalty travelers have solid options within a 15–20 minute drive. Use the map below to see which flags sit closest to the amphitheatre.",
  },
];


export default async function HotelsNearRedRocksPage() {
  const [placesRaw, events] = await Promise.all([
    getPlaces("denver-suburbs", "hotels"),
    getEventsForVenue("Red Rocks", 6),
  ]);
  const hotels = placesRaw.filter(isRealHotel).filter((p) => p.rating != null).slice(0, 6);
  const heroPhoto = hotels.find((h) => h.photos?.[0])?.photos?.[0];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
        { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://davelovesdenver.com" },
          { "@type": "ListItem", position: 2, name: "Hotels Near Red Rocks", item: "https://davelovesdenver.com/hotels/near-red-rocks" },
        ]},
        { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQS.map((f) => ({
          "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a },
        }))},
        { "@context": "https://schema.org", "@type": "WebPage",
          name: "Hotels Near Red Rocks Amphitheatre",
          description: "The best hotels near Red Rocks Amphitheatre — Morrison, Lakewood, Golden, and downtown Denver options. Where to stay for a show at one of the best concert venues in the world.",
          url: "https://davelovesdenver.com/hotels/near-red-rocks",
          speakableSpecification: { "@type": "SpeakableSpecification", cssSelector: ["[data-speakable]"] },
        },
      ])}} />

      <section className="relative bg-denver-navy text-white overflow-hidden">
        {heroPhoto && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photoUrl(heroPhoto)} alt="Hotels in Denver" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-denver-navy via-denver-navy/85 to-denver-navy/40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <nav className="flex items-center gap-2 text-sm text-white/50 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white/80">Hotels Near Red Rocks</span>
          </nav>
          <p className="text-denver-amber text-sm font-semibold uppercase tracking-widest mb-3">Morrison, Colorado</p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight" data-speakable>Hotels Near Red Rocks Amphitheatre</h1>
          <p className="mt-4 text-lg text-white/70 max-w-2xl" data-speakable>
            Red Rocks is one of the greatest concert venues on earth. Here&apos;s where to stay — close to the venue or based in Denver with a short drive out.
          </p>
        </div>
      </section>

      {/* Editorial + hotel cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-100 dark:border-slate-800">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Your Options</h2>
            <div>
              <h3 className="font-bold mb-1">Morrison & Golden (~10–20 min)</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Morrison is right at the base of Red Rocks Road — the closest you can get, with very limited options. Golden is 20 minutes away with more hotels and its own strong bar scene on Washington Avenue.</p>
            </div>
            <div>
              <h3 className="font-bold mb-1">Lakewood (15–20 min, best value)</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">The sweet spot for Red Rocks shows — close enough to avoid much traffic, with solid hotels at better prices than downtown. 15–20 minutes from the venue and easy driving.</p>
            </div>
            <div>
              <h3 className="font-bold mb-1">Downtown Denver (30–35 min)</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">If you&apos;re spending multiple nights, downtown gives you the best food, bars, and access to the rest of the city with Red Rocks as a day trip. Shuttles run from Union Station on show nights — post-show surge can be brutal otherwise.</p>
            </div>
            <blockquote className="border-l-4 border-denver-amber pl-4 text-slate-600 dark:text-slate-400 text-sm leading-relaxed italic" data-speakable>
              &ldquo;Red Rocks is everything people say it is. I&apos;ve seen shows there in the rain, in perfect 70-degree weather, and in the cold — always worth it. If you&apos;re flying in for a show, stay downtown and take a shuttle. If you have a car, Lakewood is the move. Bring layers no matter what.&rdquo;
              <footer className="mt-1 text-xs not-italic text-slate-400">— Dave</footer>
            </blockquote>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Lakewood & Metro West</p>
            {hotels.map((hotel) => <VenueHotelCard key={hotel.place_id} place={hotel} />)}
            <a href={expediaDenverHotelsUrl("Lakewood Colorado Red Rocks")} target="_blank" rel="noopener noreferrer"
              className="mt-2 inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-denver-amber hover:bg-amber-500 text-white text-sm font-semibold rounded-full transition-colors"
            >
              See all nearby hotels &rarr;
            </a>
          </div>
        </div>
      </section>

      {/* Best for every trip — closest / cheap / luxury */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-2xl font-bold mb-6">Best Hotels Near Red Rocks for Every Trip</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Link href="/denver/denver-suburbs/hotels" className="block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:border-denver-amber transition-colors">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Closest to the venue</p>
            <h3 className="font-bold mb-2">The Origin Hotel Red Rocks</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">On the Golden/Morrison side, this is the closest branded hotel to the amphitheatre — a short drive to the gates and the easiest option if you want to be right by the venue on show night.</p>
            <span className="mt-3 inline-flex items-center text-xs font-semibold text-denver-amber">Browse hotels &rarr;</span>
          </Link>
          <Link href="/denver/denver-suburbs/hotels" className="block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:border-denver-amber transition-colors">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Best on a budget</p>
            <h3 className="font-bold mb-2">Lakewood &amp; the Golden corridor</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">West-metro midscale chains 15–20 minutes out are the value sweet spot — close enough to avoid the worst traffic, far cheaper than downtown. Book early for big-name shows.</p>
            <span className="mt-3 inline-flex items-center text-xs font-semibold text-denver-amber">Browse hotels &rarr;</span>
          </Link>
          <Link href="/denver/red-rocks-shuttle" className="block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:border-denver-amber transition-colors">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Best splurge &amp; shuttle</p>
            <h3 className="font-bold mb-2">Downtown Denver + a show shuttle</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Base at a downtown luxury hotel, make a weekend of the city, and take a pre-booked shuttle from Union Station on show night — no driving, no post-show surge, and the best food and bars the rest of the trip.</p>
            <span className="mt-3 inline-flex items-center text-xs font-semibold text-denver-amber">Read the guide &rarr;</span>
          </Link>
        </div>
      </section>

      {/* Full-width map */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-bold mb-4">Hotel Map — Red Rocks & West Denver</h2>
        <div className="relative w-full h-[480px]">
          <iframe src="https://www.stay22.com/embed/69d054f1bfb4999cdf0007de" frameBorder="0"
            className="absolute inset-0 w-full h-full rounded-2xl" title="Hotels near Red Rocks Amphitheatre" loading="lazy" />
        </div>
      </section>

      {/* Upcoming Events at Red Rocks */}
      {events.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <h2 className="text-xl font-bold">Upcoming Shows at Red Rocks</h2>
            <a href={ticketmasterAffiliateUrl("https://www.ticketmaster.com/search?q=red+rocks+amphitheatre")} target="_blank" rel="noopener noreferrer"
              className="text-sm text-denver-amber font-semibold hover:underline">
              All shows &rarr;
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event) => <EventCard key={event.event_id} event={event} />)}
          </div>
        </section>
      )}

      {/* Show night tips */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-bold mb-6">Show Night Tips</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { title: "Book a Shuttle", body: "Multiple shuttles run from Union Station and LoDo on show nights. Pre-booked is cheaper and removes the post-show surge problem entirely." },
            { title: "Bring Layers", body: "Red Rocks sits at 6,450 feet and gets cold after sunset — even in July. A jacket is essential. Temperature can drop 20+ degrees between doors and encore." },
            { title: "Arrive Early", body: "Traffic on Red Rocks Road backs up significantly before big shows. Arrive 90 minutes early if driving. The formations are worth exploring before the show anyway." },
          ].map((tip) => (
            <div key={tip.title} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
              <h3 className="font-bold mb-2">{tip.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{tip.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-bold mb-4">Plan Your Red Rocks Night</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/denver/red-rocks-shuttle" className="inline-flex items-center px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-sm font-medium hover:border-denver-amber hover:text-denver-amber transition-colors">Red Rocks shuttle guide</Link>
          <Link href="/events/red-rocks" className="inline-flex items-center px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-sm font-medium hover:border-denver-amber hover:text-denver-amber transition-colors">Red Rocks shows</Link>
          <Link href="/denver/where-to-stay" className="inline-flex items-center px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-sm font-medium hover:border-denver-amber hover:text-denver-amber transition-colors">Where to stay in Denver</Link>
          <Link href="/hotels" className="inline-flex items-center px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-sm font-medium hover:border-denver-amber hover:text-denver-amber transition-colors">All hotel guides</Link>
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
          <Link href="/denver/red-rocks-shuttle" className="inline-flex items-center gap-2 px-5 py-2.5 bg-denver-navy hover:bg-denver-navy/90 text-white text-sm font-semibold rounded-full transition-colors">
            Red Rocks shuttle guide &rarr;
          </Link>
          <Link href="/denver/where-to-stay" className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber text-sm font-semibold rounded-full transition-colors">
            Full Denver hotel guide &rarr;
          </Link>
          <Link href="/hotels/near-coors-field" className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber text-sm font-semibold rounded-full transition-colors">
            Hotels near Coors Field &rarr;
          </Link>
          <Link href="/hotels/near-ball-arena" className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber text-sm font-semibold rounded-full transition-colors">
            Hotels near Ball Arena &rarr;
          </Link>
        </div>
      </section>
    </>
  );
}

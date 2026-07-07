import type { Metadata } from "next";
import Link from "next/link";
import { getPlaces, isRealHotel, photoUrl, type Place } from "@/lib/places";
import { expediaDenverHotelsUrl, ticketmasterAffiliateUrl } from "@/lib/travelpayouts";
import { getEventsForVenue } from "@/lib/ticketmaster";
import EventCard from "@/components/EventCard";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Hotels Near Elitch Gardens Denver — Best Places to Stay | Dave Loves Denver",
  description:
    "The local's guide to hotels near Elitch Gardens theme park in Denver — the closest Jefferson Park and Sloan Lake picks, family hotels with a pool, and the best budget options steps from the rides.",
  alternates: { canonical: "https://davelovesdenver.com/hotels/near-elitch-gardens" },
  openGraph: {
    title: "Hotels Near Elitch Gardens Denver",
    description: "Hotels near Elitch Gardens — Jefferson Park and Sloan Lake options from a local.",
    url: "https://davelovesdenver.com/hotels/near-elitch-gardens",
  },
};

const FAQS = [
  {
    q: "What hotels are walking distance to Elitch Gardens?",
    a: "Elitch Gardens sits between Jefferson Park and Sloan Lake, just west of downtown. Several hotels in Jefferson Park are within a 10-minute walk. LoDo hotels are about 20 minutes on foot across the South Platte.",
  },
  {
    q: "What neighborhood is Elitch Gardens in?",
    a: "The park is technically near the Jefferson Park / Sloan Lake area on the west edge of downtown Denver. The location makes it extremely convenient if you're also attending events at Empower Field or Ball Arena nearby.",
  },
  {
    q: "Is Elitch Gardens worth it for adults?",
    a: "Yes, especially if you enjoy roller coasters — Elitch's has some solid ones. It's not a mega-park, but the views of the Denver skyline from inside the park are genuinely impressive. Worth a half-day, especially in the evening when it's cooler.",
  },
  {
    q: "What is the best time to visit Elitch Gardens?",
    a: "Weekday evenings in summer are ideal — shorter lines and cooler temperatures. The park has a water park section that's popular in July and August. Opening days and holiday weekends get very crowded.",
  },
  {
    q: "Is there parking at Elitch Gardens?",
    a: "Yes, on-site paid parking is available. Rideshare from Jefferson Park or LoDo is often easier if you're staying nearby — drop-off is straightforward and avoids the parking cost.",
  },
  {
    q: "Are there hotels with a pool near Elitch Gardens?",
    a: "For a pool to cool off in after a day at the park — a natural pairing with Elitch's water park — the larger full-service hotels in nearby LoDo and downtown are your best bet, since the smaller neighborhood spots often skip one. Use the map and filters to confirm a pool before booking; it's the amenity most worth checking for a family trip.",
  },
  {
    q: "Are there cheap hotels near Elitch Gardens?",
    a: "The best value is usually across the river in LoDo a block or two out, or a non-weekend date — Elitch's busiest days (weekends and holidays) push nearby rates up. Jefferson Park is closest but thin on options, so booking early is key.",
  },
];

// eslint-disable-next-line @next/next/no-img-element
function HotelCard({ place }: { place: Place }) {
  const href = place.expedia_affiliate_url ?? expediaDenverHotelsUrl("Jefferson Park Denver");
  const photo = place.photos?.[0];
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="group flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 hover:border-denver-amber hover:shadow-md transition-all duration-200"
    >
      <div className="relative w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800">
        {photo ? (
          <img src={photoUrl(photo)} alt={place.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
        ) : (
          <div className="w-full h-full bg-slate-200 dark:bg-slate-700" />
        )}
      </div>
      <div className="flex flex-col justify-center gap-0.5 min-w-0 flex-1">
        <h3 className="font-semibold text-sm leading-snug group-hover:text-denver-amber transition-colors line-clamp-2">{place.name}</h3>
        {place.rating && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-500">
            ★ {place.rating.toFixed(1)}
            {place.review_count && <span className="text-slate-400 font-normal">({place.review_count.toLocaleString()})</span>}
          </span>
        )}
        <span className="text-xs text-denver-amber font-medium">Book on Expedia &rarr;</span>
      </div>
    </a>
  );
}

export default async function HotelsNearElitchGardensPage() {
  const [jeffPl, sloanPl, events] = await Promise.all([
    getPlaces("jefferson-park", "hotels"),
    getPlaces("sloan-lake", "hotels"),
    getEventsForVenue("Elitch Gardens", 6),
  ]);
  const seen = new Set<string>();
  const hotels = [...jeffPl, ...sloanPl]
    .filter(isRealHotel).filter((p) => p.rating != null)
    .filter((p) => { if (seen.has(p.place_id)) return false; seen.add(p.place_id); return true; })
    .slice(0, 6);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
        { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://davelovesdenver.com" },
          { "@type": "ListItem", position: 2, name: "Hotels Near Elitch Gardens", item: "https://davelovesdenver.com/hotels/near-elitch-gardens" },
        ]},
        { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQS.map((f) => ({
          "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a },
        }))},
        { "@context": "https://schema.org", "@type": "WebPage",
          name: "Hotels Near Elitch Gardens Denver",
          description: "The best hotels near Elitch Gardens theme park in Denver — Jefferson Park and Sloan Lake options steps from the rides. A local's guide to staying close.",
          url: "https://davelovesdenver.com/hotels/near-elitch-gardens",
          speakableSpecification: { "@type": "SpeakableSpecification", cssSelector: ["[data-speakable]"] },
        },
      ])}} />

      <section className="bg-denver-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <nav className="flex items-center gap-2 text-sm text-white/50 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white/80">Hotels Near Elitch Gardens</span>
          </nav>
          <p className="text-denver-amber text-sm font-semibold uppercase tracking-widest mb-3">Jefferson Park & Sloan Lake, Denver</p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight" data-speakable>Hotels Near Elitch Gardens</h1>
          <p className="mt-4 text-lg text-white/70 max-w-2xl" data-speakable>
            Elitch Gardens sits between Jefferson Park and Sloan Lake — Denver&apos;s best neighborhood for views of the city and the mountains. Stay close and skip the parking problem.
          </p>
        </div>
      </section>

      {/* Editorial + hotel cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-100 dark:border-slate-800">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Where to Stay</h2>
            <div>
              <h3 className="font-bold mb-1">Jefferson Park (closest, ~10 min)</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Directly adjacent to Elitch Gardens on the east side. Jefferson Park is a walkable neighborhood with great bars (Brewed, Stats) and one of the best skyline views in the city. Very limited hotel options but worth checking first.</p>
            </div>
            <div>
              <h3 className="font-bold mb-1">Sloan Lake (10–15 min)</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Just north of Jefferson Park around a beautiful lake. Sloan Lake has a growing restaurant scene and is extremely walkable. If you find a hotel here, you&apos;re perfectly positioned for Elitch Gardens and the wider west Denver area.</p>
            </div>
            <div>
              <h3 className="font-bold mb-1">LoDo (20 min walk or short rideshare)</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">If Jefferson Park and Sloan Lake are sold out, LoDo is your next best option. Wider hotel selection and easy rideshare access to the park.</p>
            </div>
            <blockquote className="border-l-4 border-denver-amber pl-4 text-slate-600 dark:text-slate-400 text-sm leading-relaxed italic" data-speakable>
              &ldquo;Jefferson Park is genuinely one of Denver&apos;s best neighborhoods and it&apos;s right next to Elitch Gardens — but most people don&apos;t realize that. You can walk to the park, walk to Empower Field, and get back to some excellent neighborhood bars afterward. It&apos;s an underrated part of the city.&rdquo;
              <footer className="mt-1 text-xs not-italic text-slate-400">— Dave</footer>
            </blockquote>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Jefferson Park & Sloan Lake</p>
            {hotels.map((hotel) => <HotelCard key={hotel.place_id} place={hotel} />)}
            <a href={expediaDenverHotelsUrl("Jefferson Park Denver Elitch Gardens")} target="_blank" rel="noopener noreferrer"
              className="mt-2 inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-denver-amber hover:bg-amber-500 text-white text-sm font-semibold rounded-full transition-colors"
            >
              See all nearby hotels &rarr;
            </a>
          </div>
        </div>
      </section>

      {/* Best for every trip — family / budget / pool */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-2xl font-bold mb-6">Best Hotels Near Elitch Gardens for Every Trip</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Best for families</p>
            <h3 className="font-bold mb-2">Jefferson Park &amp; LoDo</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Jefferson Park is closest for a quick walk to the gates; LoDo across the river has the most family-friendly hotels and an easy rideshare. Both skip the on-site parking hassle.</p>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Best on a budget</p>
            <h3 className="font-bold mb-2">LoDo, a block or two out</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Step just outside prime LoDo and pick a non-weekend date to dodge the peak-day surge. Closest walkable value to the park without paying front-gate prices.</p>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Best with a pool</p>
            <h3 className="font-bold mb-2">Downtown full-service</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">A perfect pairing with Elitch&apos;s water park — the larger downtown and LoDo hotels are your best bet for a pool. Confirm it on the map before booking, since smaller spots often skip one.</p>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      {events.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <h2 className="text-xl font-bold">Upcoming Events at Elitch Gardens</h2>
            <a href={ticketmasterAffiliateUrl("https://www.ticketmaster.com/search?q=elitch+gardens+denver")} target="_blank" rel="noopener noreferrer"
              className="text-sm text-denver-amber font-semibold hover:underline">
              All events &rarr;
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event) => <EventCard key={event.event_id} event={event} />)}
          </div>
        </section>
      )}

      {/* Visit Tips */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-bold mb-6">Visit Tips</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { title: "Go on a Weekday Evening", body: "Crowds thin out significantly on weekday evenings. Lines are shorter, temperatures drop, and the skyline view from inside the park is especially good at golden hour." },
            { title: "Combine with Empower Field", body: "Elitch Gardens and Empower Field are basically adjacent — if you're in town for a Broncos game, add a park afternoon. Jefferson Park is walkable to both." },
            { title: "Sloan Lake After", body: "Sloan Lake Park is a 10-minute walk from Elitch — walk the perimeter of the lake after the park closes. One of Denver's better evening strolls, especially with the mountain views." },
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
          <Link href="/denver/where-to-stay" className="inline-flex items-center gap-2 px-5 py-2.5 bg-denver-navy hover:bg-denver-navy/90 text-white text-sm font-semibold rounded-full transition-colors">
            Full Denver hotel guide &rarr;
          </Link>
          <Link href="/hotels/near-empower-field" className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber text-sm font-semibold rounded-full transition-colors">
            Hotels near Empower Field &rarr;
          </Link>
          <Link href="/hotels/near-ball-arena" className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber text-sm font-semibold rounded-full transition-colors">
            Hotels near Ball Arena &rarr;
          </Link>
          <Link href="/hotels/near-red-rocks" className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber text-sm font-semibold rounded-full transition-colors">
            Hotels near Red Rocks &rarr;
          </Link>
        </div>
      </section>
    </>
  );
}

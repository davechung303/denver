import type { Metadata } from "next";
import Link from "next/link";
import { getPlaces, isRealHotel } from "@/lib/places";
import VenueHotelCard from "@/components/VenueHotelCard";
import { expediaDenverHotelsUrl, ticketmasterAffiliateUrl } from "@/lib/travelpayouts";
import { getEventsForVenue } from "@/lib/ticketmaster";
import EventCard from "@/components/EventCard";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Hotels Near Ball Arena Denver — Best Places to Stay for Nuggets, Avalanche & Concerts | Dave Loves Denver",
  description:
    "The local's guide to hotels near Ball Arena in Denver — which hotels are truly walking distance, where to park on event nights, plus the best budget, downtown, and brand-name picks for Nuggets, Avalanche, and concerts.",
  alternates: { canonical: "https://davelovesdenver.com/hotels/near-ball-arena" },
  openGraph: {
    title: "Hotels Near Ball Arena Denver",
    description: "Walking distance hotels for Nuggets, Avalanche, and concerts at Ball Arena.",
    url: "https://davelovesdenver.com/hotels/near-ball-arena",
  },
};

const FAQS = [
  {
    q: "What hotels are closest to Ball Arena in Denver?",
    a: "Ball Arena sits between LoDo and Jefferson Park. The closest hotels are on the western edge of LoDo — several are within a 10-minute walk. Jefferson Park also has options slightly closer to the arena than the main LoDo cluster.",
  },
  {
    q: "Is Ball Arena walkable from downtown Denver hotels?",
    a: "Yes, most downtown hotels are within a 15–20 minute walk. LoDo is the closest neighborhood — the arena sits on the western edge of downtown, roughly a 10–15 minute walk from Union Station.",
  },
  {
    q: "What's the difference between LoDo vs Jefferson Park for Ball Arena?",
    a: "LoDo gives you more hotel options, better restaurants, and a livelier pre-game atmosphere. Jefferson Park is slightly closer to the arena and more residential — fewer options but sometimes better prices. Both work.",
  },
  {
    q: "Is there parking at Ball Arena?",
    a: "Yes, Ball Arena has attached parking and nearby lots. But prices spike on event nights and traffic is brutal after the game. If you can stay within walking distance, do it.",
  },
  {
    q: "What's near Ball Arena after a game?",
    a: "LoDo has the best post-game bar and restaurant scene. The Highlands neighborhood across the South Platte has excellent restaurants and is a short Uber or longer walk from the arena.",
  },
  {
    q: "Where do you park at Ball Arena for an event?",
    a: "Ball Arena has large attached lots (the lettered lots around the arena) plus surface lots nearby, but event-night rates surge and the post-game exit onto I-25 and Speer is genuinely slow. If you're driving, reserve a lot ahead on SpotHero. Better yet, stay in walking-distance LoDo and skip the traffic entirely.",
  },
  {
    q: "Are there cheap hotels near Ball Arena?",
    a: "The best value is usually a block or two out from the closest LoDo hotels, or across into the Jefferson Park side. Event nights — especially Nuggets or Avs playoff games — spike prices citywide, so midweek stays and non-event nights are dramatically cheaper. Book early when a big game or concert is on the calendar.",
  },
  {
    q: "Are there Marriott or Hilton hotels near Ball Arena?",
    a: "Yes — downtown Denver and LoDo have several Marriott-family and Hilton-family hotels within a 10–20 minute walk of the arena, so brand-loyalty travelers have plenty of options. Use the map below to see which flags sit closest, then check live rates.",
  },
];


export default async function HotelsNearBallArenaPage() {
  const [lodoPaces, jeffPaces, events] = await Promise.all([
    getPlaces("lodo", "hotels"),
    getPlaces("jefferson-park", "hotels"),
    getEventsForVenue("Ball Arena", 6),
  ]);
  const seen = new Set<string>();
  const hotels = [...lodoPaces, ...jeffPaces]
    .filter(isRealHotel).filter((p) => p.rating != null)
    .filter((p) => { if (seen.has(p.place_id)) return false; seen.add(p.place_id); return true; })
    .slice(0, 6);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
        { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://davelovesdenver.com" },
          { "@type": "ListItem", position: 2, name: "Hotels Near Ball Arena", item: "https://davelovesdenver.com/hotels/near-ball-arena" },
        ]},
        { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQS.map((f) => ({
          "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a },
        }))},
        { "@context": "https://schema.org", "@type": "WebPage",
          name: "Hotels Near Ball Arena Denver",
          description: "The best hotels near Ball Arena in Denver — walking distance options for Nuggets games, Avalanche games, and concerts. LoDo and Jefferson Park picks from a local.",
          url: "https://davelovesdenver.com/hotels/near-ball-arena",
          speakableSpecification: { "@type": "SpeakableSpecification", cssSelector: ["[data-speakable]"] },
        },
      ])}} />

      <section className="bg-denver-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <nav className="flex items-center gap-2 text-sm text-white/50 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white/80">Hotels Near Ball Arena</span>
          </nav>
          <p className="text-denver-amber text-sm font-semibold uppercase tracking-widest mb-3">LoDo & Jefferson Park, Denver</p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight" data-speakable>Hotels Near Ball Arena</h1>
          <p className="mt-4 text-lg text-white/70 max-w-2xl" data-speakable>
            Nuggets game. Avalanche game. Concert night. The best places to stay so you can walk in and walk back — no Uber surge, no parking headache.
          </p>
        </div>
      </section>

      {/* Editorial + hotel cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-100 dark:border-slate-800">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Where to Stay</h2>
            <div>
              <h3 className="font-bold mb-1">LoDo (10–15 min walk)</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">LoDo has the best concentration of hotels near Ball Arena and the best pre- and post-game scene. Union Station is your hub — the arena is a 10–15 minute walk west along Wewatta Street.</p>
            </div>
            <div>
              <h3 className="font-bold mb-1">Jefferson Park (closest, ~8 min walk)</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Jefferson Park sits directly west of Ball Arena — slightly closer than LoDo, with some of the best skyline views in the city from the neighborhood bars. Fewer hotel options but worth checking for better prices.</p>
            </div>
            <blockquote className="border-l-4 border-denver-amber pl-4 text-slate-600 dark:text-slate-400 text-sm leading-relaxed italic" data-speakable>
              &ldquo;Ball Arena is one of the better venues in the NBA. The Nuggets in the playoffs are legitimately worth flying in for. Stay in LoDo — better food and bars — and walk back after the game along Wewatta. Easy night.&rdquo;
              <footer className="mt-1 text-xs not-italic text-slate-400">— Dave</footer>
            </blockquote>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">LoDo & Jefferson Park</p>
            {hotels.map((hotel) => <VenueHotelCard key={hotel.place_id} place={hotel} />)}
            <a href={expediaDenverHotelsUrl("LoDo Denver")} target="_blank" rel="noopener noreferrer"
              className="mt-2 inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-denver-amber hover:bg-amber-500 text-white text-sm font-semibold rounded-full transition-colors"
            >
              See all nearby hotels &rarr;
            </a>
          </div>
        </div>
      </section>

      {/* How walkable is it, really */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-2xl font-bold mb-2">How Walkable Is It, Really?</h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-2xl mb-6" data-speakable>
          Ball Arena sits on the western edge of downtown, so &ldquo;walking distance&rdquo; depends a lot on which side you&apos;re coming from. Here&apos;s the honest breakdown for walking back after a Nuggets or Avs game.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Easy walk (under 12 min)", tone: "text-green-600 dark:text-green-400", body: "Western LoDo along Wewatta and Chestnut, plus the Jefferson Park edge directly across from the arena. This is the sweet spot — flat and quick." },
            { label: "Doable (12–20 min)", tone: "text-denver-amber", body: "The rest of LoDo, Union Station, and central downtown along the 16th Street corridor. An easy walk on a nice night, a bit of a haul in winter." },
            { label: "Just take an Uber", tone: "text-slate-500 dark:text-slate-400", body: "RiNo, the Highlands across the river, Cherry Creek, and Capitol Hill. The map looks close, but the walk crosses I-25, the river, or Speer. Not after a night game." },
          ].map((row) => (
            <div key={row.label} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
              <h3 className={`font-bold mb-2 ${row.tone}`}>{row.label}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{row.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Best for every trip — cheap / best / luxury */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-2xl font-bold mb-6">Best Hotels Near Ball Arena for Every Trip</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Best for a game night</p>
            <h3 className="font-bold mb-2">Western LoDo</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Stay on the arena side of LoDo and you get the shortest walk plus the best pre- and post-game food and bars. Walk in along Wewatta, walk back when you&apos;re ready.</p>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Best on a budget</p>
            <h3 className="font-bold mb-2">Jefferson Park side</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">The residential Jefferson Park side is close to the arena but often cheaper than prime LoDo. Pair it with a midweek or non-event night and you&apos;ll pay a fraction of playoff-weekend rates.</p>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Best splurge</p>
            <h3 className="font-bold mb-2">The Crawford at Union Station</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">If you want the trip to feel like an occasion, the historic Union Station hotel is a 15-minute walk to the arena and the nicest lobby downtown. Make a night of it.</p>
          </div>
        </div>
      </section>

      {/* Parking near Ball Arena */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-100 dark:border-slate-800">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Parking Near Ball Arena</h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed" data-speakable>
              Ball Arena has some of the largest attached parking in the city — the lettered lots wrap around the venue — plus surface lots along Auraria Parkway and the western downtown edge. The problem isn&apos;t finding a space; it&apos;s the price on event nights and the crawl to get out afterward onto I-25 and Speer.
            </p>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              If you&apos;re driving in, reserve a lot ahead on SpotHero to lock a rate. Check whether your hotel&apos;s parking is in-house or a nearby garage — a reserved lot near the arena can beat a downtown hotel&apos;s overnight valet fee.
            </p>
          </div>
          <div className="bg-denver-navy text-white rounded-2xl p-6 lg:p-8">
            <h3 className="font-bold text-lg mb-2">The move: don&apos;t park at all</h3>
            <p className="text-white/70 text-sm leading-relaxed">
              The post-game exit from Ball Arena is the single best reason to stay within walking distance. Skip the lot, walk back to LoDo along Wewatta, and you&apos;re at a bar while everyone else is still idling in the garage ramp.
            </p>
          </div>
        </div>
      </section>

      {/* Upcoming Events at Ball Arena */}
      {events.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <h2 className="text-xl font-bold">Upcoming Events at Ball Arena</h2>
            <a href={ticketmasterAffiliateUrl("https://www.ticketmaster.com/search?q=ball+arena+denver")} target="_blank" rel="noopener noreferrer"
              className="text-sm text-denver-amber font-semibold hover:underline">
              All events &rarr;
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event) => <EventCard key={event.event_id} event={event} />)}
          </div>
        </section>
      )}

      {/* Full-width map */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-bold mb-4">Hotel Map — Ball Arena Area</h2>
        <div className="relative w-full h-[480px]">
          <iframe src="https://www.stay22.com/embed/69d0538131f29079785729f4" frameBorder="0"
            className="absolute inset-0 w-full h-full rounded-2xl" title="Hotels near Ball Arena Denver" loading="lazy" />
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
          <Link href="/hotels/near-coors-field" className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber text-sm font-semibold rounded-full transition-colors">
            Hotels near Coors Field &rarr;
          </Link>
          <Link href="/hotels/near-red-rocks" className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber text-sm font-semibold rounded-full transition-colors">
            Hotels near Red Rocks &rarr;
          </Link>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { getPlaces, isRealHotel } from "@/lib/places";
import VenueHotelCard from "@/components/VenueHotelCard";
import { expediaDenverHotelsUrl, ticketmasterAffiliateUrl } from "@/lib/travelpayouts";
import { getEventsForVenue } from "@/lib/ticketmaster";
import EventCard from "@/components/EventCard";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Hotels Near Empower Field at Mile High — Best Places to Stay for Broncos Games | Dave Loves Denver",
  description:
    "The local's guide to hotels near Empower Field at Mile High — which hotels are truly walkable, how the light rail beats game-day parking, plus the best budget, 4-star, and luxury picks for Broncos games and concerts.",
  alternates: { canonical: "https://davelovesdenver.com/hotels/near-empower-field" },
  openGraph: {
    title: "Hotels Near Empower Field at Mile High",
    description: "Where to stay for a Broncos game or concert at Mile High — walkable LoDo and Jefferson Park options.",
    url: "https://davelovesdenver.com/hotels/near-empower-field",
  },
};

const FAQS = [
  {
    q: "Can you walk from downtown Denver hotels to Empower Field?",
    a: "Yes — from LoDo and Union Station it's about a mile walk west across the South Platte River. It takes 15–20 minutes and is very doable. On game days, the walk is half the experience: thousands of people in orange heading the same direction.",
  },
  {
    q: "What is the closest neighborhood to Empower Field?",
    a: "Jefferson Park is directly east of the stadium — the neighborhood overlooks the field from a hill and has a handful of walkable bars and restaurants. LoDo and LoHi are both within easy walking distance and have far more hotel options.",
  },
  {
    q: "Is there parking near Empower Field?",
    a: "Yes, but it's expensive on game days — $40–$60 is typical for official lots. Rideshare is usually the smarter call. Post-game surges can be brutal; walking east to a quieter Uber pickup point in LoDo saves money and time.",
  },
  {
    q: "What is Empower Field at Mile High used for besides Broncos games?",
    a: "Empower Field hosts major concerts (it has hosted Taylor Swift, Kenny Chesney, and other stadium-level acts), college football, and international soccer matches. Concert setups often require the full stadium, so hotel demand can rival game weekends.",
  },
  {
    q: "Is it worth staying in Jefferson Park vs downtown for a game?",
    a: "Jefferson Park is closer and has some great bars (Brewed, Stats), but the hotel selection is thin. Most people stay in LoDo or downtown and walk — you get better food options before and after the game.",
  },
  {
    q: "Is there a shuttle or train to Empower Field at Mile High?",
    a: "Yes — Empower Field has its own RTD light rail station (Empower Field at Mile High station), so you can ride the train straight to the stadium from Union Station and much of the metro area. On game days it's the smartest move: no parking fees, no post-game traffic. Some hotels also run their own shuttles, so ask at booking.",
  },
  {
    q: "What are the best cheap hotels near Empower Field?",
    a: "The best value is usually a step out from prime LoDo — the Jefferson Park side or across I-25 toward the Highlands — paired with a non-premium date. Broncos home games and stadium concerts spike rates citywide, so booking early and avoiding peak weekends is where the real savings are.",
  },
  {
    q: "Are there 4-star or luxury hotels near Empower Field?",
    a: "Yes — the full-service and upscale hotels are concentrated in downtown Denver and around Union Station, roughly a 15–20 minute walk (or one light rail stop) from the stadium. That's where you'll find the 4-star and luxury flags, plus the best dining for before and after the game.",
  },
];


export default async function HotelsNearEmpowerFieldPage() {
  const [lodoPl, jeffPl, events] = await Promise.all([
    getPlaces("lodo", "hotels"),
    getPlaces("jefferson-park", "hotels"),
    getEventsForVenue("Empower Field", 6),
  ]);
  const hotels = [...lodoPl, ...jeffPl]
    .filter(isRealHotel)
    .filter((p) => p.rating != null)
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, 6);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
        { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://davelovesdenver.com" },
          { "@type": "ListItem", position: 2, name: "Hotels Near Empower Field", item: "https://davelovesdenver.com/hotels/near-empower-field" },
        ]},
        { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQS.map((f) => ({
          "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a },
        }))},
        { "@context": "https://schema.org", "@type": "WebPage",
          name: "Hotels Near Empower Field at Mile High",
          description: "The best hotels near Empower Field at Mile High — walkable options in LoDo, Jefferson Park, and Highlands for Broncos games and concerts.",
          url: "https://davelovesdenver.com/hotels/near-empower-field",
          speakableSpecification: { "@type": "SpeakableSpecification", cssSelector: ["[data-speakable]"] },
        },
      ])}} />

      <section className="bg-denver-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <nav className="flex items-center gap-2 text-sm text-white/50 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white/80">Hotels Near Empower Field</span>
          </nav>
          <p className="text-denver-amber text-sm font-semibold uppercase tracking-widest mb-3">Denver, Colorado</p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight" data-speakable>Hotels Near Empower Field at Mile High</h1>
          <p className="mt-4 text-lg text-white/70 max-w-2xl" data-speakable>
            Mile High is one of the best football environments in the NFL. Whether you&apos;re here for the Broncos, a stadium concert, or just want to say you&apos;ve been — here&apos;s where to stay.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-100 dark:border-slate-800">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Your Options</h2>
            <div>
              <h3 className="font-bold mb-1">LoDo &amp; Union Station (~15 min walk)</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">The best base for a game. You can walk to Empower Field across the South Platte, then walk back to LoDo for dinner and drinks. Union Station, Larimer Square, and dozens of bars are right there. This is where most Broncos visitors end up, and for good reason.</p>
            </div>
            <div>
              <h3 className="font-bold mb-1">Jefferson Park (closest, ~5 min walk)</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Directly east of the stadium and technically the closest neighborhood. Hotel options are limited, but if you find one, you&apos;re walking distance to the game and to some genuinely good neighborhood spots. Jefferson Park has views of the stadium and the city.</p>
            </div>
            <div>
              <h3 className="font-bold mb-1">LoHi / Highlands (~20 min walk)</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">North of the stadium across I-25. Strong restaurant and bar scene — great for pre-game if you don&apos;t mind a bit more of a walk. Highland Bridge connects to the stadium area. A solid option if you&apos;re spending multiple days.</p>
            </div>
            <blockquote className="border-l-4 border-denver-amber pl-4 text-slate-600 dark:text-slate-400 text-sm leading-relaxed italic" data-speakable>
              &ldquo;Game days at Mile High are legitimately fun even if you&apos;re not a Broncos fan. Stay in LoDo, walk over, and walk back to catch dinner on Larimer Square. The stadium atmosphere at altitude is something you notice — 5,280 feet hits different by the fourth quarter.&rdquo;
              <footer className="mt-1 text-xs not-italic text-slate-400">— Dave</footer>
            </blockquote>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">LoDo &amp; Jefferson Park Hotels</p>
            {hotels.map((hotel) => <VenueHotelCard key={hotel.place_id} place={hotel} />)}
            <a href={expediaDenverHotelsUrl("LoDo Denver Empower Field")} target="_blank" rel="noopener noreferrer"
              className="mt-2 inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-denver-amber hover:bg-amber-500 text-white text-sm font-semibold rounded-full transition-colors"
            >
              See all nearby hotels &rarr;
            </a>
          </div>
        </div>
      </section>

      {/* Best for every trip — cheap / 4-star / luxury */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-2xl font-bold mb-6">Best Hotels Near Empower Field for Every Trip</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <a href={expediaDenverHotelsUrl()} target="_blank" rel="noopener noreferrer sponsored" className="block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:border-denver-amber transition-colors">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Best for a game day</p>
            <h3 className="font-bold mb-2">LoDo &amp; Union Station</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Walk across the river to the stadium, walk back to Larimer Square for dinner, or hop one light rail stop. The best mix of proximity, food, and pre-game atmosphere.</p>
          </a>
          <a href={expediaDenverHotelsUrl()} target="_blank" rel="noopener noreferrer sponsored" className="block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:border-denver-amber transition-colors">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Best on a budget</p>
            <h3 className="font-bold mb-2">Jefferson Park &amp; the Highlands edge</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">A step out from prime LoDo, still walkable, usually cheaper. Pair with a midweek concert or a non-premium game date and you&apos;ll pay far less than a peak Sunday-home-game rate.</p>
          </a>
          <a href={expediaDenverHotelsUrl()} target="_blank" rel="noopener noreferrer sponsored" className="block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:border-denver-amber transition-colors">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Best 4-star &amp; splurge</p>
            <h3 className="font-bold mb-2">Downtown full-service</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">The 4-star and luxury flags cluster downtown around Union Station — full-service hotels a short walk or one train stop from the stadium, with the city&apos;s best dining on the doorstep.</p>
          </a>
        </div>
      </section>

      {/* Upcoming Events at Empower Field */}
      {events.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <h2 className="text-xl font-bold">Upcoming Events at Empower Field</h2>
            <a href={ticketmasterAffiliateUrl("https://www.ticketmaster.com/search?q=empower+field+denver")} target="_blank" rel="noopener noreferrer"
              className="text-sm text-denver-amber font-semibold hover:underline">
              All events &rarr;
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event) => <EventCard key={event.event_id} event={event} />)}
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-bold mb-6">Game Day Tips</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { title: "Walk Over, Rideshare Back", body: "Walking to Mile High from LoDo is straightforward. After the game, Uber surges hard — walking east 10 minutes before summoning a car saves money and time." },
            { title: "The Altitude is Real", body: "Empower Field sits at 5,280 feet. If you're flying in from sea level, pace yourself on the alcohol — the altitude amplifies everything, especially in the hot sun of a September game." },
            { title: "Pre-Game on Larimer Square", body: "The blocks around Larimer Square and LoDo fill with orange before every home game. It's genuinely one of the better pre-game atmospheres in the NFL. Get there early enough to enjoy it." },
          ].map((tip) => (
            <div key={tip.title} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
              <h3 className="font-bold mb-2">{tip.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{tip.body}</p>
            </div>
          ))}
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
          <Link href="/denver/where-to-stay" className="inline-flex items-center gap-2 px-5 py-2.5 bg-denver-navy hover:bg-denver-navy/90 text-white text-sm font-semibold rounded-full transition-colors">
            Full Denver hotel guide &rarr;
          </Link>
          <Link href="/hotels/near-coors-field" className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber text-sm font-semibold rounded-full transition-colors">
            Hotels near Coors Field &rarr;
          </Link>
          <Link href="/hotels/near-ball-arena" className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber text-sm font-semibold rounded-full transition-colors">
            Hotels near Ball Arena &rarr;
          </Link>
          <Link href="/hotels/near-mission-ballroom" className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber text-sm font-semibold rounded-full transition-colors">
            Hotels near Mission Ballroom &rarr;
          </Link>
        </div>
      </section>
    </>
  );
}

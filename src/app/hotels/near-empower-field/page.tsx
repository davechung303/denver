import type { Metadata } from "next";
import Link from "next/link";
import { getPlaces, isRealHotel, photoUrl, type Place } from "@/lib/places";
import { expediaDenverHotelsUrl } from "@/lib/travelpayouts";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Hotels Near Empower Field at Mile High — Best Places to Stay for Broncos Games | Dave Loves Denver",
  description:
    "The best hotels near Empower Field at Mile High — walkable options in LoDo, Jefferson Park, and Highlands for Broncos games and concerts.",
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
];

// eslint-disable-next-line @next/next/no-img-element
function HotelCard({ place }: { place: Place }) {
  const href = place.expedia_affiliate_url ?? expediaDenverHotelsUrl("LoDo Denver");
  const photo = place.photos?.[0];
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="group flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 hover:border-denver-amber hover:shadow-md transition-all duration-200"
    >
      <div className="relative w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800">
        {photo ? (
          <img src={photoUrl(photo.name, 128, 128)} alt={place.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
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

export default async function HotelsNearEmpowerFieldPage() {
  const [lodoPl, jeffPl] = await Promise.all([
    getPlaces("lodo", "hotels"),
    getPlaces("jefferson-park", "hotels"),
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
      ])}} />

      <section className="bg-denver-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <nav className="flex items-center gap-2 text-sm text-white/50 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white/80">Hotels Near Empower Field</span>
          </nav>
          <p className="text-denver-amber text-sm font-semibold uppercase tracking-widest mb-3">Denver, Colorado</p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">Hotels Near Empower Field at Mile High</h1>
          <p className="mt-4 text-lg text-white/70 max-w-2xl">
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
            <blockquote className="border-l-4 border-denver-amber pl-4 text-slate-600 dark:text-slate-400 text-sm leading-relaxed italic">
              &ldquo;Game days at Mile High are legitimately fun even if you&apos;re not a Broncos fan. Stay in LoDo, walk over, and walk back to catch dinner on Larimer Square. The stadium atmosphere at altitude is something you notice — 5,280 feet hits different by the fourth quarter.&rdquo;
              <footer className="mt-1 text-xs not-italic text-slate-400">— Dave</footer>
            </blockquote>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">LoDo &amp; Jefferson Park Hotels</p>
            {hotels.map((hotel) => <HotelCard key={hotel.place_id} place={hotel} />)}
            <a href={expediaDenverHotelsUrl("LoDo Denver Empower Field")} target="_blank" rel="noopener noreferrer"
              className="mt-2 inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-denver-amber hover:bg-amber-500 text-white text-sm font-semibold rounded-full transition-colors"
            >
              See all nearby hotels &rarr;
            </a>
          </div>
        </div>
      </section>

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

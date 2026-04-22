import type { Metadata } from "next";
import Link from "next/link";
import { getPlaces, isRealHotel, photoUrl, type Place } from "@/lib/places";
import { expediaDenverHotelsUrl } from "@/lib/travelpayouts";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Hotels Near Ball Arena Denver — Best Places to Stay for Nuggets, Avalanche & Concerts | Dave Loves Denver",
  description:
    "The best hotels near Ball Arena in Denver — walking distance options for Nuggets games, Avalanche games, and concerts. LoDo and Jefferson Park picks from a local.",
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

export default async function HotelsNearBallArenaPage() {
  const [lodoPaces, jeffPaces] = await Promise.all([
    getPlaces("lodo", "hotels"),
    getPlaces("jefferson-park", "hotels"),
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
      ])}} />

      <section className="bg-denver-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <nav className="flex items-center gap-2 text-sm text-white/50 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white/80">Hotels Near Ball Arena</span>
          </nav>
          <p className="text-denver-amber text-sm font-semibold uppercase tracking-widest mb-3">LoDo & Jefferson Park, Denver</p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">Hotels Near Ball Arena</h1>
          <p className="mt-4 text-lg text-white/70 max-w-2xl">
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
            <blockquote className="border-l-4 border-denver-amber pl-4 text-slate-600 dark:text-slate-400 text-sm leading-relaxed italic">
              &ldquo;Ball Arena is one of the better venues in the NBA. The Nuggets in the playoffs are legitimately worth flying in for. Stay in LoDo — better food and bars — and walk back after the game along Wewatta. Easy night.&rdquo;
              <footer className="mt-1 text-xs not-italic text-slate-400">— Dave</footer>
            </blockquote>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">LoDo & Jefferson Park</p>
            {hotels.map((hotel) => <HotelCard key={hotel.place_id} place={hotel} />)}
            <a href={expediaDenverHotelsUrl("LoDo Denver")} target="_blank" rel="noopener noreferrer"
              className="mt-2 inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-denver-amber hover:bg-amber-500 text-white text-sm font-semibold rounded-full transition-colors"
            >
              See all nearby hotels &rarr;
            </a>
          </div>
        </div>
      </section>

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

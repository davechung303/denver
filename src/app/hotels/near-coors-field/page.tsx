import type { Metadata } from "next";
import Link from "next/link";
import { getPlaces, isRealHotel, photoUrl, type Place } from "@/lib/places";
import { expediaDenverHotelsUrl } from "@/lib/travelpayouts";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Hotels Near Coors Field Denver — Best Places to Stay for Rockies Games | Dave Loves Denver",
  description:
    "The best hotels walking distance to Coors Field in Denver — LoDo, Union Station, and downtown options for Rockies games, concerts, and events.",
  alternates: { canonical: "https://davelovesdenver.com/hotels/near-coors-field" },
  openGraph: {
    title: "Hotels Near Coors Field Denver",
    description: "Walking distance to Coors Field — the best LoDo and downtown Denver hotels for Rockies games and events.",
    url: "https://davelovesdenver.com/hotels/near-coors-field",
  },
};

const FAQS = [
  {
    q: "What hotels are walking distance to Coors Field?",
    a: "Several LoDo hotels are within easy walking distance. The Crawford Hotel inside Union Station is about a 7-minute walk. Most of LoDo puts you within 10–15 minutes of the ballpark gates.",
  },
  {
    q: "What neighborhood is Coors Field in?",
    a: "Coors Field sits on the edge of LoDo (Lower Downtown) and RiNo. The address is technically LoDo, but the surrounding blocks blend both neighborhoods. Either area works well as a base.",
  },
  {
    q: "Is there parking near Coors Field?",
    a: "Yes, but game-day parking fills up fast and prices spike. If you're staying in LoDo, you won't need to park at all — walk to the game and back. If you're driving in, arrive early or use SpotHero to lock in a rate in advance.",
  },
  {
    q: "Are there hotels inside Union Station Denver?",
    a: "Yes — The Crawford Hotel is located inside Union Station itself, about a 7-minute walk from Coors Field. It's one of the most unique hotel experiences in Denver, set inside the historic great hall. Rooms go fast on game days.",
  },
  {
    q: "How early should I arrive in LoDo before a Rockies game?",
    a: "For a good pregame experience, arrive 1.5–2 hours early. Blake Street bars fill up fast, especially for weekend afternoon games. Being within walking distance means you can leave when you're ready without fighting for an Uber.",
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

export default async function HotelsNearCoorsFieldPage() {
  const places = await getPlaces("lodo", "hotels");
  const hotels = places.filter(isRealHotel).filter((p) => p.rating != null).slice(0, 6);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
        { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://davelovesdenver.com" },
          { "@type": "ListItem", position: 2, name: "Hotels Near Coors Field", item: "https://davelovesdenver.com/hotels/near-coors-field" },
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
            <span className="text-white/80">Hotels Near Coors Field</span>
          </nav>
          <p className="text-denver-amber text-sm font-semibold uppercase tracking-widest mb-3">LoDo, Denver</p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">Hotels Near Coors Field</h1>
          <p className="mt-4 text-lg text-white/70 max-w-2xl">
            The best places to stay for Rockies games and events — walking distance from the ballpark, in the middle of LoDo.
          </p>
        </div>
      </section>

      {/* Editorial + hotel cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-100 dark:border-slate-800">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Where to Stay</h2>
            <div>
              <h3 className="font-bold mb-1">The Crawford at Union Station (~7 min walk)</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">The best-located hotel in LoDo — inside the historic Union Station building. The great hall lobby is one of the most impressive in Denver. Rooms go fast on game days so plan ahead.</p>
            </div>
            <div>
              <h3 className="font-bold mb-1">LoDo Hotels (5–15 min walk)</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">The blocks around Coors Field have Marriott, Hyatt, and independent options that put you a short walk from the gates and Blake Street bars, which fill up for every home game.</p>
            </div>
            <div>
              <h3 className="font-bold mb-1">RiNo (10–15 min walk)</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">If LoDo is sold out or overpriced, RiNo is the next best option. You&apos;re a 15-minute walk to the ballpark and surrounded by far better restaurants and bars than LoDo proper.</p>
            </div>
            <blockquote className="border-l-4 border-denver-amber pl-4 text-slate-600 dark:text-slate-400 text-sm leading-relaxed italic">
              &ldquo;Coors Field is one of the best ballparks in the country. The Rockies in the background on a clear afternoon are genuinely hard to beat. Stay in LoDo, walk to Blake Street for pregame, walk into the park, walk back. That&apos;s a good day.&rdquo;
              <footer className="mt-1 text-xs not-italic text-slate-400">— Dave</footer>
            </blockquote>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Top-Rated in LoDo</p>
            {hotels.map((hotel) => <HotelCard key={hotel.place_id} place={hotel} />)}
            <a href={expediaDenverHotelsUrl("LoDo Denver")} target="_blank" rel="noopener noreferrer"
              className="mt-2 inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-denver-amber hover:bg-amber-500 text-white text-sm font-semibold rounded-full transition-colors"
            >
              See all LoDo hotels &rarr;
            </a>
          </div>
        </div>
      </section>

      {/* Full-width map */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-bold mb-4">Hotel Map — LoDo & Coors Field Area</h2>
        <div className="relative w-full h-[480px]">
          <iframe src="https://www.stay22.com/embed/69d053e731f2907978572a8b" frameBorder="0"
            className="absolute inset-0 w-full h-full rounded-2xl" title="Hotels near Coors Field Denver" loading="lazy" />
        </div>
      </section>

      {/* Game day tips */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-bold mb-6">Game Day Tips</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { title: "Pregame on Blake Street", body: "Blake Street runs alongside Coors Field and fills up for every home game. Show up 1.5 hours early and you'll have no trouble getting a bar seat." },
            { title: "Skip the Parking", body: "Game-day parking in LoDo is expensive and stressful. Staying within walking distance removes the problem entirely. SpotHero if you must drive in." },
            { title: "Sunday Afternoon Games", body: "Afternoon games with the Rockies in the background are one of Denver's best experiences. Sunday games often offer better value than Friday/Saturday nights." },
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

import type { Metadata } from "next";
import Link from "next/link";
import { getPlaces, isRealHotel, photoUrl, type Place } from "@/lib/places";
import { expediaDenverHotelsUrl } from "@/lib/travelpayouts";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Hotels Near Mission Ballroom Denver — Best Places to Stay for Shows | Dave Loves Denver",
  description:
    "The best hotels near Mission Ballroom in Denver's RiNo neighborhood — walkable options steps from one of the best mid-size venues in the country.",
  alternates: { canonical: "https://davelovesdenver.com/hotels/near-mission-ballroom" },
  openGraph: {
    title: "Hotels Near Mission Ballroom Denver",
    description: "Walkable RiNo and LoDo hotel options for Mission Ballroom shows.",
    url: "https://davelovesdenver.com/hotels/near-mission-ballroom",
  },
};

const FAQS = [
  {
    q: "Can you walk from hotels to Mission Ballroom?",
    a: "Yes — Mission Ballroom is in RiNo, and there are several hotels within walking distance. LoDo hotels are about a 20-minute walk north. The neighborhood has plenty to do before and after shows.",
  },
  {
    q: "What neighborhood is Mission Ballroom in?",
    a: "RiNo — River North Art District. It's Denver's most energetic neighborhood right now, with the best concentration of restaurants, breweries, and bars in the city. A show at Mission Ballroom is a great excuse to spend a night in RiNo.",
  },
  {
    q: "How big is Mission Ballroom?",
    a: "Mission Ballroom holds around 4,000 people — large enough for major national touring acts but small enough to feel like a real show. The sight lines are excellent from almost anywhere in the room, and the sound quality is outstanding.",
  },
  {
    q: "Is parking available at Mission Ballroom?",
    a: "Limited parking is nearby. The venue is in an industrial-transitional part of RiNo, so street parking exists but fills up. Rideshare or staying walkable is the better call.",
  },
  {
    q: "What should I do before a Mission Ballroom show in RiNo?",
    a: "RiNo is the right answer to this. Grab dinner at Señor Bear, Zeppelin Station, or any of a dozen other great spots. Hit a brewery beforehand — TRVE, Ratio, Odell Denver, and Great Divide are all close. The pre-show neighborhood experience is part of why Mission Ballroom is one of the best venues in the country.",
  },
];

// eslint-disable-next-line @next/next/no-img-element
function HotelCard({ place }: { place: Place }) {
  const href = place.expedia_affiliate_url ?? expediaDenverHotelsUrl("RiNo Denver");
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

export default async function HotelsNearMissionBallroomPage() {
  const [rinoPl, lodoPl] = await Promise.all([
    getPlaces("rino", "hotels"),
    getPlaces("lodo", "hotels"),
  ]);
  const hotels = [...rinoPl, ...lodoPl]
    .filter(isRealHotel)
    .filter((p) => p.rating != null)
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, 6);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
        { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://davelovesdenver.com" },
          { "@type": "ListItem", position: 2, name: "Hotels Near Mission Ballroom", item: "https://davelovesdenver.com/hotels/near-mission-ballroom" },
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
            <span className="text-white/80">Hotels Near Mission Ballroom</span>
          </nav>
          <p className="text-denver-amber text-sm font-semibold uppercase tracking-widest mb-3">RiNo, Denver</p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">Hotels Near Mission Ballroom Denver</h1>
          <p className="mt-4 text-lg text-white/70 max-w-2xl">
            Mission Ballroom is one of the best mid-size venues in the country — and it&apos;s in RiNo, Denver&apos;s best neighborhood. Staying nearby means the whole night is the event, not just the show.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-100 dark:border-slate-800">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Your Options</h2>
            <div>
              <h3 className="font-bold mb-1">RiNo (walkable to the venue)</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">The ideal base. Hotels in RiNo put you steps from Mission Ballroom and surrounded by the best restaurant and brewery density in Denver. You&apos;re 10 minutes from downtown but you honestly might not need to leave the neighborhood.</p>
            </div>
            <div>
              <h3 className="font-bold mb-1">LoDo / Union Station (~20 min walk)</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">More hotel options and a slightly higher density of familiar brands. The walk to Mission Ballroom takes you through the edges of RiNo, which is an experience in itself. Easy rideshare if you don&apos;t want to walk after the show.</p>
            </div>
            <div>
              <h3 className="font-bold mb-1">Five Points &amp; Curtis Park (very close)</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Directly east of RiNo — limited hotel options but extremely close to the venue. Worth checking if you find something.</p>
            </div>
            <blockquote className="border-l-4 border-denver-amber pl-4 text-slate-600 dark:text-slate-400 text-sm leading-relaxed italic">
              &ldquo;Mission Ballroom is the reason to stay in RiNo for a night. The venue is genuinely great — sound, sight lines, bar situation. Get dinner at one of the RiNo spots, walk to the show, walk back to a brewery after. It&apos;s the ideal Denver concert night.&rdquo;
              <footer className="mt-1 text-xs not-italic text-slate-400">— Dave</footer>
            </blockquote>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">RiNo &amp; LoDo Hotels</p>
            {hotels.map((hotel) => <HotelCard key={hotel.place_id} place={hotel} />)}
            <a href={expediaDenverHotelsUrl("RiNo Denver Mission Ballroom")} target="_blank" rel="noopener noreferrer"
              className="mt-2 inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-denver-amber hover:bg-amber-500 text-white text-sm font-semibold rounded-full transition-colors"
            >
              See all nearby hotels &rarr;
            </a>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-bold mb-6">Show Night Tips</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { title: "Eat in RiNo First", body: "RiNo has some of Denver's best restaurants within walking distance of Mission Ballroom. Book early — popular spots fill up on show nights. Zeppelin Station, Señor Bear, and Dio Mio are all close." },
            { title: "The Venue Opens Early", body: "Mission Ballroom typically opens doors 90 minutes before showtime. Getting there early means you can actually hear the opener and get a good spot before the room fills." },
            { title: "Brewery Crawl After", body: "After the show, Ratio, TRVE, Odell Denver, and several other breweries are walking distance. It's one of the better post-show neighborhood situations of any music venue in the country." },
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
          <Link href="/hotels/near-ball-arena" className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber text-sm font-semibold rounded-full transition-colors">
            Hotels near Ball Arena &rarr;
          </Link>
          <Link href="/hotels/near-coors-field" className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber text-sm font-semibold rounded-full transition-colors">
            Hotels near Coors Field &rarr;
          </Link>
          <Link href="/hotels/near-empower-field" className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber text-sm font-semibold rounded-full transition-colors">
            Hotels near Empower Field &rarr;
          </Link>
        </div>
      </section>
    </>
  );
}

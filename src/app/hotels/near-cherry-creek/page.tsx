import type { Metadata } from "next";
import Link from "next/link";
import { getPlaces, isRealHotel, photoUrl, type Place } from "@/lib/places";
import { expediaDenverHotelsUrl } from "@/lib/travelpayouts";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Hotels in Cherry Creek Denver — Best Places to Stay Near Cherry Creek North | Dave Loves Denver",
  description:
    "The best hotels in Cherry Creek, Denver — luxury and boutique options near Cherry Creek North shopping, top restaurants, and the Cherry Creek Trail.",
  alternates: { canonical: "https://davelovesdenver.com/hotels/near-cherry-creek" },
  openGraph: {
    title: "Hotels in Cherry Creek Denver",
    description: "Where to stay in Cherry Creek for shopping, fine dining, and the best luxury hotels in Denver.",
    url: "https://davelovesdenver.com/hotels/near-cherry-creek",
  },
};

const FAQS = [
  {
    q: "What are the best hotels in Cherry Creek Denver?",
    a: "Cherry Creek has Denver's nicest hotel concentration. The Halcyon is the standout boutique option — rooftop pool, bikes to borrow, and a great bar. The JW Marriott Cherry Creek and The Maven at Dairy Block are also excellent. Cherry Creek North is a short walk from all of them.",
  },
  {
    q: "Is Cherry Creek walkable?",
    a: "Very walkable within the neighborhood — Cherry Creek North's shopping and restaurant district is compact and easy to navigate on foot. Getting to downtown Denver is a 2-mile walk along the Cherry Creek Trail, or a 10-minute Uber.",
  },
  {
    q: "What is Cherry Creek North known for?",
    a: "Cherry Creek North is Denver's upscale shopping and dining district — about 16 blocks of independent boutiques, galleries, spas, and restaurants. It's less touristy than LoDo and tends to attract a more local crowd, which keeps the quality high.",
  },
  {
    q: "How far is Cherry Creek from Denver Airport?",
    a: "About 30–40 minutes by car or rideshare depending on traffic. The A-Line doesn't reach Cherry Creek; you'd connect via Union Station and Uber from there.",
  },
  {
    q: "Is Cherry Creek a good neighborhood for families?",
    a: "Yes — it's quieter than LoDo or RiNo, with wide sidewalks, good parks, and very walkable access to food and shopping. City Park and the Denver Zoo are a short drive east.",
  },
];

// eslint-disable-next-line @next/next/no-img-element
function HotelCard({ place }: { place: Place }) {
  const href = place.expedia_affiliate_url ?? expediaDenverHotelsUrl("Cherry Creek Denver");
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

export default async function HotelsNearCherryCreekPage() {
  const places = await getPlaces("cherry-creek", "hotels");
  const hotels = places.filter(isRealHotel).filter((p) => p.rating != null).slice(0, 6);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
        { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://davelovesdenver.com" },
          { "@type": "ListItem", position: 2, name: "Hotels in Cherry Creek", item: "https://davelovesdenver.com/hotels/near-cherry-creek" },
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
            <span className="text-white/80">Hotels in Cherry Creek</span>
          </nav>
          <p className="text-denver-amber text-sm font-semibold uppercase tracking-widest mb-3">Cherry Creek North, Denver</p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">Hotels in Cherry Creek Denver</h1>
          <p className="mt-4 text-lg text-white/70 max-w-2xl">
            Cherry Creek has the best luxury hotels in Denver. It&apos;s quieter than downtown, more local than LoDo, and surrounded by the best shopping and fine dining in the city.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-100 dark:border-slate-800">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Why Stay in Cherry Creek</h2>
            <div>
              <h3 className="font-bold mb-1">Cherry Creek North (shopping &amp; dining)</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">16 blocks of independent boutiques, galleries, and some of Denver&apos;s best restaurants. Less touristy than downtown but higher quality on average. Hazel, Elway&apos;s, and Departure are all within a short walk from most Cherry Creek hotels.</p>
            </div>
            <div>
              <h3 className="font-bold mb-1">The Cherry Creek Trail</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">A paved trail runs directly through the neighborhood along Cherry Creek, connecting to downtown (2 miles) and extending into the mountains. If running, cycling, or a morning walk matters to you, Cherry Creek is the right neighborhood.</p>
            </div>
            <div>
              <h3 className="font-bold mb-1">Access to Everything</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Cherry Creek is 10 minutes from downtown by Uber, 15 from City Park and the Denver Zoo, and an easy drive to the mountains. A good central base for a full Denver trip.</p>
            </div>
            <blockquote className="border-l-4 border-denver-amber pl-4 text-slate-600 dark:text-slate-400 text-sm leading-relaxed italic">
              &ldquo;Cherry Creek is where I take people who want a nicer experience without the grind of downtown. The Halcyon is one of my favorite hotels in the city — rooftop, great bar, bikes included. Cherry Creek North for dinner, then walk the trail in the morning. It works.&rdquo;
              <footer className="mt-1 text-xs not-italic text-slate-400">— Dave</footer>
            </blockquote>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Cherry Creek Hotels</p>
            {hotels.map((hotel) => <HotelCard key={hotel.place_id} place={hotel} />)}
            <a href={expediaDenverHotelsUrl("Cherry Creek Denver")} target="_blank" rel="noopener noreferrer"
              className="mt-2 inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-denver-amber hover:bg-amber-500 text-white text-sm font-semibold rounded-full transition-colors"
            >
              See all Cherry Creek hotels &rarr;
            </a>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-bold mb-6">Cherry Creek Tips</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { title: "Cherry Creek Farmers Market", body: "The Cherry Creek Farmers Market runs Saturdays year-round and Wednesdays in summer. One of the better farmers markets in Denver — local produce, food vendors, and good energy." },
            { title: "Dining in Cherry Creek North", body: "The restaurant quality in Cherry Creek North is consistently high. Reservations recommended for dinner on weekends — Hazel, Elway's Steakhouse, and Machete are all worth booking in advance." },
            { title: "Trail to Downtown", body: "If the weather is good, the Cherry Creek Trail walk or bike to downtown is one of the best ways to see Denver. Bike rental is available from several Cherry Creek hotels or Lime e-bikes throughout the neighborhood." },
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
          <Link href="/hotels/near-botanic-gardens" className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber text-sm font-semibold rounded-full transition-colors">
            Hotels near Botanic Gardens &rarr;
          </Link>
          <Link href="/hotels/near-city-park" className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber text-sm font-semibold rounded-full transition-colors">
            Hotels near City Park &rarr;
          </Link>
          <Link href="/denver/cherry-creek/hotels" className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber text-sm font-semibold rounded-full transition-colors">
            All Cherry Creek hotels &rarr;
          </Link>
        </div>
      </section>
    </>
  );
}

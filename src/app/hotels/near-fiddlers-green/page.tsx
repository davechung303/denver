import type { Metadata } from "next";
import Link from "next/link";
import { getPlaces, isRealHotel, photoUrl, type Place } from "@/lib/places";
import { expediaDenverHotelsUrl } from "@/lib/travelpayouts";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Hotels Near Fiddler's Green Amphitheatre — Best Places to Stay for Shows | Dave Loves Denver",
  description:
    "Where to stay for a show at Fiddler's Green Amphitheatre in Greenwood Village — nearby DTC hotels and downtown Denver options explained.",
  alternates: { canonical: "https://davelovesdenver.com/hotels/near-fiddlers-green" },
  openGraph: {
    title: "Hotels Near Fiddler's Green Amphitheatre",
    description: "DTC, Centennial, and downtown Denver hotel options for Fiddler's Green shows.",
    url: "https://davelovesdenver.com/hotels/near-fiddlers-green",
  },
};

const FAQS = [
  {
    q: "How far is Fiddler's Green from downtown Denver?",
    a: "About 15 miles south of downtown — a 20–30 minute drive with no traffic. On show nights, I-25 southbound can back up significantly. Budget extra time or consider ridesharing.",
  },
  {
    q: "Are there hotels walking distance to Fiddler's Green?",
    a: "Yes — the Denver Tech Center (DTC) has several hotels within 1–2 miles along Arapahoe and Yosemite. The Hyatt Regency Denver Tech Center is one of the closest full-service options. Staying nearby means skipping the highway and using a short rideshare.",
  },
  {
    q: "Should I stay near Fiddler's Green or in Denver for the night?",
    a: "If the show is the whole point of the trip, stay near the DTC and enjoy a quieter, cheaper night. If you want to explore Denver properly — food, bars, nightlife — stay downtown and Uber to the show. The drive is straightforward if you have a car.",
  },
  {
    q: "What capacity is Fiddler's Green?",
    a: "Fiddler's Green holds around 18,000 for large concerts with lawn seating. It hosts major tours that are too big for venues like Mission Ballroom but can't justify a stadium — think Dave Matthews Band, Phish, Zac Brown Band, country tours.",
  },
  {
    q: "Is there parking at Fiddler's Green?",
    a: "Yes, ample parking on-site. Rideshare pickups after shows can get crowded, so walking a couple blocks from the venue before summoning helps.",
  },
];

// eslint-disable-next-line @next/next/no-img-element
function HotelCard({ place }: { place: Place }) {
  const href = place.expedia_affiliate_url ?? expediaDenverHotelsUrl("Greenwood Village Denver Tech Center");
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

export default async function HotelsNearFiddlersGreenPage() {
  const places = await getPlaces("denver-suburbs", "hotels");
  const hotels = places.filter(isRealHotel).filter((p) => p.rating != null).slice(0, 6);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
        { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://davelovesdenver.com" },
          { "@type": "ListItem", position: 2, name: "Hotels Near Fiddler's Green", item: "https://davelovesdenver.com/hotels/near-fiddlers-green" },
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
            <span className="text-white/80">Hotels Near Fiddler&apos;s Green</span>
          </nav>
          <p className="text-denver-amber text-sm font-semibold uppercase tracking-widest mb-3">Greenwood Village, Colorado</p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">Hotels Near Fiddler&apos;s Green Amphitheatre</h1>
          <p className="mt-4 text-lg text-white/70 max-w-2xl">
            Fiddler&apos;s Green is the mid-size outdoor venue between downtown Denver and the mountains. Here&apos;s where to stay for shows — whether you want to be close to the venue or based in the city.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-100 dark:border-slate-800">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Your Options</h2>
            <div>
              <h3 className="font-bold mb-1">Denver Tech Center (closest, 1–2 miles)</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">The DTC has a solid hotel cluster with every major chain represented. Not the most exciting neighborhood to eat and drink in, but it puts you close to the venue and away from I-25 traffic. Good value compared to downtown.</p>
            </div>
            <div>
              <h3 className="font-bold mb-1">Englewood / Centennial (5–10 min)</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">South of the DTC, with more hotel options at generally lower prices. Easy access to the venue with short rideshare times after the show.</p>
            </div>
            <div>
              <h3 className="font-bold mb-1">Downtown Denver (30 min, best for multi-night)</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">If Fiddler&apos;s Green is one night of a longer Denver trip, stay downtown. The drive south is straightforward, and you get the full Denver experience the rest of the time. Budget 45 minutes each way on show nights for safety.</p>
            </div>
            <blockquote className="border-l-4 border-denver-amber pl-4 text-slate-600 dark:text-slate-400 text-sm leading-relaxed italic">
              &ldquo;Fiddler&apos;s Green is the kind of venue where the show is the whole point — it&apos;s surrounded by office parks. Stay nearby if it&apos;s a single-night trip, or stay downtown and make a proper weekend of it. The DTC hotels are solid value if you&apos;re just looking for a base.&rdquo;
              <footer className="mt-1 text-xs not-italic text-slate-400">— Dave</footer>
            </blockquote>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">South Denver &amp; DTC Hotels</p>
            {hotels.map((hotel) => <HotelCard key={hotel.place_id} place={hotel} />)}
            <a href={expediaDenverHotelsUrl("Greenwood Village Denver Tech Center")} target="_blank" rel="noopener noreferrer"
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
            { title: "Leave Early, Return Easy", body: "I-25 northbound after a big show can slow down significantly. Rideshare surge is real. If staying nearby, your walk or short Uber avoids the worst of it." },
            { title: "Lawn vs Seats", body: "Fiddler's Green lawn seats are some of the best anywhere — bring a blanket if it's cool. Covered pavilion seats give you shelter if it rains. Colorado afternoon storms roll through fast — check the forecast." },
            { title: "Pre-Show Dinner", body: "The DTC area has chain restaurants along Arapahoe but not much character. If you have time, drive north to Cherry Creek or the city for a proper pre-show dinner." },
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
          <Link href="/hotels/near-red-rocks" className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber text-sm font-semibold rounded-full transition-colors">
            Hotels near Red Rocks &rarr;
          </Link>
          <Link href="/hotels/near-mission-ballroom" className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber text-sm font-semibold rounded-full transition-colors">
            Hotels near Mission Ballroom &rarr;
          </Link>
          <Link href="/hotels/near-convention-center" className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber text-sm font-semibold rounded-full transition-colors">
            Hotels near Convention Center &rarr;
          </Link>
        </div>
      </section>
    </>
  );
}

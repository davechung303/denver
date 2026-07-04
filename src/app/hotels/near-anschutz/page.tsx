import type { Metadata } from "next";
import Link from "next/link";
import { getPlaces, isRealHotel, photoUrl, type Place } from "@/lib/places";
import { expediaDenverHotelsUrl } from "@/lib/travelpayouts";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Hotels Near Anschutz Medical Campus Denver — Best Places to Stay | Dave Loves Denver",
  description:
    "The best hotels near Anschutz Medical Campus and UCHealth in Aurora, Colorado — convenient options for patients, families, and medical visitors.",
  alternates: { canonical: "https://davelovesdenver.com/hotels/near-anschutz" },
  openGraph: {
    title: "Hotels Near Anschutz Medical Campus Denver",
    description: "Hotels near Anschutz Medical Campus and UCHealth — Aurora and Denver options for medical visitors.",
    url: "https://davelovesdenver.com/hotels/near-anschutz",
  },
};

const FAQS = [
  {
    q: "What hotels are closest to Anschutz Medical Campus?",
    a: "The Anschutz Medical Campus is in Aurora, just east of Denver. Several hotels along Colfax Avenue in Aurora are within 10–15 minutes of the campus. Downtown Denver hotels are about 20–30 minutes by car or light rail.",
  },
  {
    q: "How do I get from downtown Denver hotels to Anschutz?",
    a: "The light rail (RTD) connects downtown Denver to the Anschutz / University of Colorado Hospital station on the W Line and the University of Colorado A Line. The ride takes about 20–30 minutes from Union Station, depending on the line.",
  },
  {
    q: "Are there hotels with shuttle service to Anschutz Medical Campus?",
    a: "Some hotels near the campus offer shuttle service or easy access to the RTD light rail. Call ahead to confirm shuttle availability if transportation is a priority — especially for early morning appointments.",
  },
  {
    q: "What is nearby Anschutz Medical Campus for families?",
    a: "The campus is in Aurora, a large Denver suburb. Aurora has plenty of restaurants, a large mall (Southlands), and easy access to the wider Denver metro. Downtown Denver is a 20–30 minute drive for more dining and entertainment options.",
  },
  {
    q: "Is parking available near Anschutz Medical Campus?",
    a: "Parking is available at the medical campus itself — UCHealth and Children's Hospital Colorado have parking garages on site. Rates can be significant for extended stays. Staying nearby and using the light rail is often more cost-effective for multi-day visits.",
  },
];

// eslint-disable-next-line @next/next/no-img-element
function HotelCard({ place }: { place: Place }) {
  const href = place.expedia_affiliate_url ?? expediaDenverHotelsUrl("Aurora Colorado Anschutz");
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

export default async function HotelsNearAnschutzPage() {
  const places = await getPlaces("denver-suburbs", "hotels");
  const hotels = places.filter(isRealHotel).filter((p) => p.rating != null).slice(0, 6);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
        { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://davelovesdenver.com" },
          { "@type": "ListItem", position: 2, name: "Hotels Near Anschutz Medical Campus", item: "https://davelovesdenver.com/hotels/near-anschutz" },
        ]},
        { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQS.map((f) => ({
          "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a },
        }))},
        { "@context": "https://schema.org", "@type": "WebPage",
          name: "Hotels Near Anschutz Medical Campus Denver",
          description: "The best hotels near Anschutz Medical Campus and UCHealth in Aurora, Colorado — convenient options for patients, families, and medical visitors.",
          url: "https://davelovesdenver.com/hotels/near-anschutz",
          speakableSpecification: { "@type": "SpeakableSpecification", cssSelector: ["[data-speakable]"] },
        },
      ])}} />

      <section className="bg-denver-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <nav className="flex items-center gap-2 text-sm text-white/50 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white/80">Hotels Near Anschutz Medical Campus</span>
          </nav>
          <p className="text-denver-amber text-sm font-semibold uppercase tracking-widest mb-3">Aurora, Colorado</p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight" data-speakable>Hotels Near Anschutz Medical Campus</h1>
          <p className="mt-4 text-lg text-white/70 max-w-2xl" data-speakable>
            Visiting a patient or attending an appointment at UCHealth or Children&apos;s Hospital Colorado? Here are the most convenient places to stay near the Anschutz Medical Campus.
          </p>
        </div>
      </section>

      {/* Editorial + hotel cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-100 dark:border-slate-800">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Your Options</h2>
            <div>
              <h3 className="font-bold mb-1">Aurora (closest, 5–15 min)</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Hotels along Colfax Avenue in Aurora put you closest to the Anschutz campus. Several extended-stay options are available for families on longer visits. Not the most exciting neighborhood, but practical and convenient.</p>
            </div>
            <div>
              <h3 className="font-bold mb-1">Downtown Denver (20–30 min by car or light rail)</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">If you want to combine a medical visit with time in the city — better restaurants, more to do — downtown Denver is 20–30 minutes by car or light rail. The RTD A Line and W Line connect Union Station directly to the Anschutz medical area.</p>
            </div>
            <div>
              <h3 className="font-bold mb-1">Extended Stay Options</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">For multi-week stays, extended-stay hotels in Aurora offer kitchen facilities and lower weekly rates. This is often more practical than short-term hotel bookings for families supporting long treatment programs.</p>
            </div>
            <blockquote className="border-l-4 border-denver-amber pl-4 text-slate-600 dark:text-slate-400 text-sm leading-relaxed italic" data-speakable>
              &ldquo;Anschutz is one of the best medical complexes in the country. If you&apos;re here for more than a day or two, staying downtown and taking the light rail is worth it — you&apos;ll want access to the city when you&apos;re not at the hospital.&rdquo;
              <footer className="mt-1 text-xs not-italic text-slate-400">— Dave</footer>
            </blockquote>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Denver Metro Hotels</p>
            {hotels.map((hotel) => <HotelCard key={hotel.place_id} place={hotel} />)}
            <a href={expediaDenverHotelsUrl("Aurora Colorado Anschutz Medical")} target="_blank" rel="noopener noreferrer"
              className="mt-2 inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-denver-amber hover:bg-amber-500 text-white text-sm font-semibold rounded-full transition-colors"
            >
              See all nearby hotels &rarr;
            </a>
          </div>
        </div>
      </section>

      {/* Practical Tips */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-bold mb-6">Practical Tips for Medical Visitors</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { title: "Light Rail from Downtown", body: "RTD light rail connects Union Station to the Anschutz medical area in about 25–30 minutes. If you're staying downtown, this removes the parking problem entirely and is often faster during rush hour." },
            { title: "On-Campus Parking", body: "UCHealth and Children's Hospital have on-site parking garages. Rates can add up for multi-day stays — check if your hotel offers a shuttle or if the light rail makes more sense for your situation." },
            { title: "Extended Stay for Long Visits", body: "Extended-stay hotels near the campus offer kitchens and lower weekly rates. For families managing long treatment schedules, these are often more practical than standard hotel bookings." },
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
          <Link href="/hotels/near-denver-airport" className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber text-sm font-semibold rounded-full transition-colors">
            Hotels near Denver Airport &rarr;
          </Link>
          <Link href="/hotels/near-convention-center" className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber text-sm font-semibold rounded-full transition-colors">
            Hotels near Convention Center &rarr;
          </Link>
        </div>
      </section>
    </>
  );
}

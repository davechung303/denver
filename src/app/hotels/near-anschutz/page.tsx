import type { Metadata } from "next";
import Link from "next/link";
import { getPlaces, isRealHotel } from "@/lib/places";
import VenueHotelCard from "@/components/VenueHotelCard";
import { expediaDenverHotelsUrl } from "@/lib/travelpayouts";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Hotels Near Anschutz Medical Campus Denver — Best Places to Stay | Dave Loves Denver",
  description:
    "The local's guide to hotels near Anschutz Medical Campus and UCHealth in Aurora, Colorado — the closest on-campus hotels, best-value extended stays for families, and budget options for medical visitors.",
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
  {
    q: "What are the closest hotels to Anschutz Medical Campus?",
    a: "The closest options are on or right beside the campus — the SpringHill Suites Denver at Anschutz Medical Campus and the Benson Hotel and Faculty Club sit on campus, and a Comfort Suites is nearby. These are the most convenient for early appointments or visiting a patient, since you can reach the hospitals in minutes without driving.",
  },
  {
    q: "Are there budget or extended-stay hotels near Anschutz for families?",
    a: "Yes. Aurora has budget and extended-stay hotels within 5–15 minutes of the campus, many with kitchens and lower weekly rates — often the most practical and affordable choice for families managing a long treatment schedule. Ask hotels whether they offer a medical or hospital rate; many near the campus do.",
  },
  {
    q: "Are there upscale or luxury hotels near Anschutz Medical Campus?",
    a: "The immediate area is practical rather than luxurious. For a nicer full-service stay, look toward downtown Denver or Cherry Creek — both a 20–30 minute drive or a light rail ride — where you'll find upscale hotels plus better dining for when you're not at the hospital.",
  },
];


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
            {hotels.map((hotel) => <VenueHotelCard key={hotel.place_id} place={hotel} />)}
            <a href={expediaDenverHotelsUrl("Aurora Colorado Anschutz Medical")} target="_blank" rel="noopener noreferrer"
              className="mt-2 inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-denver-amber hover:bg-amber-500 text-white text-sm font-semibold rounded-full transition-colors"
            >
              See all nearby hotels &rarr;
            </a>
          </div>
        </div>
      </section>

      {/* Best for every trip — closest / extended-stay / downtown */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-2xl font-bold mb-6">Best Hotels Near Anschutz for Every Visit</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <a href={expediaDenverHotelsUrl()} target="_blank" rel="noopener noreferrer sponsored" className="block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:border-denver-amber transition-colors">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Closest to the hospitals</p>
            <h3 className="font-bold mb-2">On-campus hotels</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">The SpringHill Suites at Anschutz and the Benson Hotel sit on campus — minutes on foot to UCHealth and Children&apos;s Hospital. The easiest choice for early appointments or visiting a patient.</p>
          </a>
          <a href={expediaDenverHotelsUrl()} target="_blank" rel="noopener noreferrer sponsored" className="block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:border-denver-amber transition-colors">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Best value for long stays</p>
            <h3 className="font-bold mb-2">Aurora extended-stay</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Extended-stay hotels nearby offer kitchens and lower weekly rates — often the most practical and affordable base for families through a longer treatment schedule. Ask about a hospital rate.</p>
          </a>
          <a href={expediaDenverHotelsUrl()} target="_blank" rel="noopener noreferrer sponsored" className="block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:border-denver-amber transition-colors">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Best for time in the city</p>
            <h3 className="font-bold mb-2">Downtown Denver</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">If you want a nicer stay and a break from the hospital, base downtown and take the light rail in — 20–30 minutes, with the city&apos;s best dining for the hours you&apos;re not on campus.</p>
          </a>
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

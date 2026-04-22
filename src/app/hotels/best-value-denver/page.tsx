import type { Metadata } from "next";
import Link from "next/link";
import { getBestValueHotels, isRealHotel, photoUrl, type Place } from "@/lib/places";
import { NEIGHBORHOODS } from "@/lib/neighborhoods";
import { expediaDenverHotelsUrl } from "@/lib/travelpayouts";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Best Value Hotels in Denver — Affordable with Great Reviews (4.3+) | Dave Loves Denver",
  description:
    "The best affordable hotels in Denver with excellent ratings — handpicked options under $$ with 4.3+ stars, organized by neighborhood. No overpriced mediocrity.",
  alternates: { canonical: "https://davelovesdenver.com/hotels/best-value-denver" },
  openGraph: {
    title: "Best Value Hotels in Denver — Affordable & Highly Rated",
    description: "Affordable Denver hotels with 4.3+ ratings. No tourist traps — real value picks by neighborhood.",
    url: "https://davelovesdenver.com/hotels/best-value-denver",
  },
};

const FAQS = [
  {
    q: "What is the cheapest area to stay in Denver with good hotels?",
    a: "Capitol Hill and Uptown consistently offer the best value — affordable rooms close to downtown with genuine character. You're a 20-minute walk from LoDo, surrounded by bars and restaurants, without paying the Union Station premium.",
  },
  {
    q: "What rating should I look for in a budget Denver hotel?",
    a: "Anything 4.3 or above on Google is reliably good. The 4.0–4.2 range can work, but you start to see more 'fine but nothing special' reviews. At 4.3+, you're in genuinely well-run territory regardless of price point.",
  },
  {
    q: "Are there good hotels in Denver under $150 a night?",
    a: "Yes, especially on weeknights and outside of major events. Capitol Hill, Uptown, and areas like Sloan's Lake have options under $150 with solid ratings. Denver's hotel pricing spikes sharply during Broncos games and major concerts — book early for those weekends.",
  },
  {
    q: "What Denver neighborhoods have the best hotel value?",
    a: "Capitol Hill for budget travelers who want character and nightlife nearby. Uptown for mid-range value with great restaurant access on 17th Ave. Sloan's Lake for a quieter, residential feel at lower prices with easy highway access. All three get you close to downtown without downtown prices.",
  },
  {
    q: "Is it cheaper to stay near the Denver airport?",
    a: "Yes — airport hotels are significantly cheaper than downtown, but you're 30–45 minutes from the city. It makes sense for early flights or late arrivals, but not for a Denver trip where you actually want to experience the city.",
  },
];

// eslint-disable-next-line @next/next/no-img-element
function HotelCard({ place }: { place: Place }) {
  const href = place.expedia_affiliate_url ?? expediaDenverHotelsUrl();
  const photo = place.photos?.[0];
  const neighborhood = NEIGHBORHOODS.find((n) => n.slug === place.neighborhood_slug);
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="group flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 hover:border-denver-amber hover:shadow-md transition-all duration-200"
    >
      <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800">
        {photo ? (
          <img src={photoUrl(photo.name, 128, 128)} alt={place.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
        ) : (
          <div className="w-full h-full bg-slate-200 dark:bg-slate-700" />
        )}
      </div>
      <div className="flex flex-col justify-center gap-0.5 min-w-0 flex-1">
        <h3 className="font-semibold text-sm leading-snug group-hover:text-denver-amber transition-colors line-clamp-2">{place.name}</h3>
        <div className="flex items-center gap-2">
          {place.rating && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-500">
              ★ {place.rating.toFixed(1)}
              {place.review_count && <span className="text-slate-400 font-normal">({place.review_count.toLocaleString()})</span>}
            </span>
          )}
          {place.price_level && (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              {"$".repeat(place.price_level)}
            </span>
          )}
        </div>
        {neighborhood && (
          <span className="text-xs text-slate-400">{neighborhood.name}</span>
        )}
        <span className="text-xs text-denver-amber font-medium">Book on Expedia &rarr;</span>
      </div>
    </a>
  );
}

export default async function BestValueDenverHotelsPage() {
  const allHotels = await getBestValueHotels(4.3, 40);
  const hotels = allHotels.filter(isRealHotel);

  // Group by neighborhood for the curated sections
  const byNeighborhood = new Map<string, Place[]>();
  for (const hotel of hotels) {
    const slug = hotel.neighborhood_slug;
    if (!byNeighborhood.has(slug)) byNeighborhood.set(slug, []);
    byNeighborhood.get(slug)!.push(hotel);
  }

  // Neighborhoods to feature (ordered by value story)
  const FEATURED_SLUGS = ["capitol-hill", "uptown", "sloan-lake", "five-points", "baker", "highlands", "lodo"];
  const featuredSections = FEATURED_SLUGS
    .map((slug) => ({ slug, hotels: byNeighborhood.get(slug) ?? [] }))
    .filter((s) => s.hotels.length > 0);

  // Any remaining hotels not in the featured list
  const remainingHotels = hotels.filter(
    (h) => !FEATURED_SLUGS.includes(h.neighborhood_slug)
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
        { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://davelovesdenver.com" },
          { "@type": "ListItem", position: 2, name: "Best Value Denver Hotels", item: "https://davelovesdenver.com/hotels/best-value-denver" },
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
            <Link href="/denver/where-to-stay" className="hover:text-white transition-colors">Where to Stay</Link>
            <span>/</span>
            <span className="text-white/80">Best Value Hotels</span>
          </nav>
          <div className="flex items-center gap-3 mb-3">
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full uppercase tracking-widest">4.3+ Rating</span>
            <span className="px-3 py-1 bg-white/10 text-white/70 text-xs font-bold rounded-full uppercase tracking-widest">$ – $$</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">Best Value Hotels in Denver</h1>
          <p className="mt-4 text-lg text-white/70 max-w-2xl">
            Affordable doesn&apos;t have to mean bad. These are Denver hotels with &quot;$&quot; or &quot;$$&quot; pricing and 4.3 stars or better — genuine value, organized by neighborhood.
          </p>
        </div>
      </section>

      {/* Intro editorial */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-3xl space-y-4">
          <blockquote className="border-l-4 border-denver-amber pl-5 py-1 text-slate-600 dark:text-slate-400 text-lg leading-relaxed italic">
            &ldquo;Denver has a lot of overpriced mid-range hotels that charge downtown rates without delivering downtown quality. What you actually want is a well-run hotel at a fair price — the 4.3+ rating filter is what separates those from the noise. Capitol Hill and Uptown are where I&apos;d look first.&rdquo;
            <footer className="mt-2 text-sm not-italic text-slate-400">— Dave</footer>
          </blockquote>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
            All hotels on this page are rated 4.3 or higher on Google reviews and priced at $ or $$ — the two most affordable price tiers. We update this list regularly as new hotels open and ratings shift.
          </p>
        </div>
      </section>

      {/* Neighborhood sections */}
      {featuredSections.map(({ slug, hotels: sectionHotels }) => {
        const n = NEIGHBORHOODS.find((nb) => nb.slug === slug);
        if (!n) return null;
        return (
          <section key={slug} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold">{n.name}</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{n.tagline}</p>
              </div>
              <Link href={`/denver/${slug}/hotels`}
                className="flex-shrink-0 text-xs font-semibold text-denver-amber hover:underline whitespace-nowrap"
              >
                All {n.name} hotels &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {sectionHotels.slice(0, 6).map((hotel) => <HotelCard key={hotel.place_id} place={hotel} />)}
            </div>
          </section>
        );
      })}

      {/* Remaining hotels */}
      {remainingHotels.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-xl font-bold mb-6">More Value Picks Across Denver</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {remainingHotels.slice(0, 9).map((hotel) => <HotelCard key={hotel.place_id} place={hotel} />)}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-100 dark:border-slate-800">
        <div className="bg-denver-navy rounded-2xl px-8 py-10 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h2 className="text-xl font-bold mb-1">See all available Denver hotels</h2>
            <p className="text-white/70 text-sm">Compare prices and availability on Expedia — filters, maps, and real-time rates.</p>
          </div>
          <a href={expediaDenverHotelsUrl()} target="_blank" rel="noopener noreferrer"
            className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-denver-amber hover:bg-amber-500 text-white text-sm font-semibold rounded-full transition-colors"
          >
            Browse Expedia Denver hotels &rarr;
          </a>
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

      {/* Bottom nav */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-wrap gap-3">
          <Link href="/denver/where-to-stay" className="inline-flex items-center gap-2 px-5 py-2.5 bg-denver-navy hover:bg-denver-navy/90 text-white text-sm font-semibold rounded-full transition-colors">
            Full Denver hotel guide &rarr;
          </Link>
          <Link href="/hotels/near-red-rocks" className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber text-sm font-semibold rounded-full transition-colors">
            Hotels near Red Rocks &rarr;
          </Link>
          <Link href="/hotels/near-convention-center" className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber text-sm font-semibold rounded-full transition-colors">
            Hotels near Convention Center &rarr;
          </Link>
          <Link href="/hotels/near-denver-airport" className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber text-sm font-semibold rounded-full transition-colors">
            Hotels near Denver Airport &rarr;
          </Link>
        </div>
      </section>
    </>
  );
}

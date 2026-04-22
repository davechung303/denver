import type { Metadata } from "next";
import Link from "next/link";
import { getPlaces, isRealHotel, photoUrl, type Place } from "@/lib/places";
import { expediaDenverHotelsUrl } from "@/lib/travelpayouts";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Hotels Near Denver Botanic Gardens — Best Places to Stay | Dave Loves Denver",
  description:
    "The best hotels near Denver Botanic Gardens — walkable options in Capitol Hill and Congress Park, plus downtown Denver for easy access.",
  alternates: { canonical: "https://davelovesdenver.com/hotels/near-botanic-gardens" },
  openGraph: {
    title: "Hotels Near Denver Botanic Gardens",
    description: "Where to stay near the Denver Botanic Gardens in the Capitol Hill and Congress Park area.",
    url: "https://davelovesdenver.com/hotels/near-botanic-gardens",
  },
};

const FAQS = [
  {
    q: "What neighborhood is the Denver Botanic Gardens in?",
    a: "The Denver Botanic Gardens is at York Street and 10th Avenue, in the Congress Park / Cheesman Park area — just east of Capitol Hill. It's a residential neighborhood with limited hotels, but Capitol Hill and Uptown are close alternatives.",
  },
  {
    q: "Is it worth visiting Denver Botanic Gardens?",
    a: "Absolutely. It's one of the best botanic gardens in the country — consistently ranked in the top five nationally. The Japanese and Water-Smart gardens are highlights. Summer concerts (Blossoms of Light, outdoor music series) are worth planning around.",
  },
  {
    q: "What is Blossoms of Light at Denver Botanic Gardens?",
    a: "Blossoms of Light is an annual holiday lights event at the gardens — typically November through January. It's one of the most popular holiday events in Denver. Tickets sell out quickly; book early if you're planning a winter visit.",
  },
  {
    q: "How do I get to the Denver Botanic Gardens from downtown?",
    a: "About a 10-minute Uber from downtown, or a 30-minute walk through Capitol Hill and Congress Park. The walk is actually quite nice through the residential neighborhoods.",
  },
  {
    q: "Are there concerts at the Denver Botanic Gardens?",
    a: "Yes — the Botanic Gardens Summer Concert Series runs from June through August on the outdoor stage. Past performers include major national acts. Tickets go fast for big names. The garden setting makes it one of the most unique concert venues in Denver.",
  },
];

// eslint-disable-next-line @next/next/no-img-element
function HotelCard({ place }: { place: Place }) {
  const href = place.expedia_affiliate_url ?? expediaDenverHotelsUrl("Capitol Hill Denver Botanic Gardens");
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

export default async function HotelsNearBotanicGardensPage() {
  const [capHillPl, uptownPl] = await Promise.all([
    getPlaces("capitol-hill", "hotels"),
    getPlaces("uptown", "hotels"),
  ]);
  const hotels = [...capHillPl, ...uptownPl]
    .filter(isRealHotel)
    .filter((p) => p.rating != null)
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, 6);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
        { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://davelovesdenver.com" },
          { "@type": "ListItem", position: 2, name: "Hotels Near Botanic Gardens", item: "https://davelovesdenver.com/hotels/near-botanic-gardens" },
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
            <span className="text-white/80">Hotels Near Botanic Gardens</span>
          </nav>
          <p className="text-denver-amber text-sm font-semibold uppercase tracking-widest mb-3">Denver, Colorado</p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">Hotels Near Denver Botanic Gardens</h1>
          <p className="mt-4 text-lg text-white/70 max-w-2xl">
            One of the top botanic gardens in the country, year-round. Whether you&apos;re visiting for summer concerts, Blossoms of Light, or just the gardens themselves, here&apos;s where to stay.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-100 dark:border-slate-800">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Your Options</h2>
            <div>
              <h3 className="font-bold mb-1">Capitol Hill (closest, ~10 min walk)</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Capitol Hill is the closest neighborhood with hotel options. It&apos;s got character — bars, live music, independent restaurants, and some of Denver&apos;s most affordable accommodations near the center of the city. Colfax Avenue runs through it, and it has more energy than the quiet residential streets near the gardens.</p>
            </div>
            <div>
              <h3 className="font-bold mb-1">Uptown (15 min walk)</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Slightly further but a nicer base with 17th Avenue restaurants and better hotel options. An Uber or 15-minute walk puts you at the gardens. Good if you want a mix of comfort and walkable dining.</p>
            </div>
            <div>
              <h3 className="font-bold mb-1">Cherry Creek (10 min Uber)</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">If you want the nicer hotels in the area, Cherry Creek is a short rideshare east of the Botanic Gardens and gives you access to the best shopping and dining in Denver on top of the gardens.</p>
            </div>
            <blockquote className="border-l-4 border-denver-amber pl-4 text-slate-600 dark:text-slate-400 text-sm leading-relaxed italic">
              &ldquo;The Botanic Gardens summer concert series is legitimately special — you&apos;re seeing a national act surrounded by flowers and garden paths. Blossoms of Light in December is the best holiday experience in Denver. Either way, book early and stay in Cap Hill or Uptown to keep the Uber short.&rdquo;
              <footer className="mt-1 text-xs not-italic text-slate-400">— Dave</footer>
            </blockquote>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Capitol Hill &amp; Uptown Hotels</p>
            {hotels.map((hotel) => <HotelCard key={hotel.place_id} place={hotel} />)}
            <a href={expediaDenverHotelsUrl("Capitol Hill Denver Botanic Gardens")} target="_blank" rel="noopener noreferrer"
              className="mt-2 inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-denver-amber hover:bg-amber-500 text-white text-sm font-semibold rounded-full transition-colors"
            >
              See all nearby hotels &rarr;
            </a>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-bold mb-6">Botanic Gardens Tips</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { title: "Book Concerts Early", body: "The summer concert series at the gardens sells out fast, especially for well-known acts. Check the Botanic Gardens website as soon as the season lineup drops — popular shows are gone within hours." },
            { title: "Blossoms of Light: Timed Entry", body: "The holiday lights event uses timed entry tickets. Book as far in advance as possible — it runs 6 weeks and popular times sell out well before the season opens. Tuesday–Thursday is the least crowded." },
            { title: "Member Entry Has Perks", body: "A Denver Botanic Gardens membership pays for itself in 2 visits and includes free timed entry to both Blossoms of Light and the summer concerts. Worth it if you're in Denver often or live here." },
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
          <Link href="/hotels/near-cherry-creek" className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber text-sm font-semibold rounded-full transition-colors">
            Hotels near Cherry Creek &rarr;
          </Link>
          <Link href="/hotels/near-city-park" className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber text-sm font-semibold rounded-full transition-colors">
            Hotels near City Park &rarr;
          </Link>
          <Link href="/hotels/near-red-rocks" className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber text-sm font-semibold rounded-full transition-colors">
            Hotels near Red Rocks &rarr;
          </Link>
        </div>
      </section>
    </>
  );
}

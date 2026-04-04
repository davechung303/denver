import type { Metadata } from "next";
import Link from "next/link";
import { NEIGHBORHOODS } from "@/lib/neighborhoods";
import { expediaDenverHotelsUrl } from "@/lib/travelpayouts";
import { getPlaces, isRealHotel, photoUrl, type Place } from "@/lib/places";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Where to Stay in Denver, CO — Best Neighborhoods for Hotels | Dave Loves Denver",
  description:
    "The honest guide to where to stay in Denver — LoDo, RiNo, Highlands, Cherry Creek, and every neighborhood, broken down by who they actually suit.",
  openGraph: {
    title: "Where to Stay in Denver — Best Neighborhoods for Hotels",
    description:
      "LoDo, RiNo, Highlands, Cherry Creek and more — an honest breakdown of Denver's hotel neighborhoods and who each one suits.",
    url: "https://davelovesdenver.com/denver/where-to-stay",
    images: [
      {
        url: "https://images.unsplash.com/photo-1566036604088-319bcef67086?auto=format&fit=crop&w=1600&q=80",
        width: 1600,
        alt: "Where to stay in Denver Colorado",
      },
    ],
  },
  alternates: {
    canonical: "https://davelovesdenver.com/denver/where-to-stay",
  },
};

const HOTEL_NEIGHBORHOODS = [
  {
    slug: "lodo",
    bestFor: "First-timers & sports fans",
    dave: "LoDo is the easiest place to stay in Denver if it's your first time. Union Station is one of the best train stations in the country — it's also a hotel, a food hall, and a hangout spot. You're walking distance from Coors Field, Ball Arena, and basically everything downtown. It costs more than staying elsewhere, but you won't need Uber as much.",
  },
  {
    slug: "rino",
    bestFor: "Food & art lovers",
    dave: "RiNo is where I'd stay if I were visiting Denver right now. The restaurant density is the best in the city, the breweries are world-class, and there's always something happening. It's a 10-minute walk from downtown and well-positioned for getting around. The only downside is it can get loud on weekends — pick a hotel on the quieter end of the neighborhood if that matters to you.",
  },
  {
    slug: "highlands",
    bestFor: "Couples & weekend trips",
    dave: "The best views of the Denver skyline are from Highlands. The restaurant scene on 32nd Ave and LoHi is excellent. It's slightly removed from downtown — you'll probably Uber to Coors Field — but if you're here for a good time rather than a specific event, Highlands is hard to beat for a weekend stay.",
  },
  {
    slug: "cherry-creek",
    bestFor: "Luxury travelers & shoppers",
    dave: "Cherry Creek has the nicest hotels in Denver. If you want a spa, a rooftop pool, or a room that doesn't face a parking garage, this is your neighborhood. The Cherry Creek Shopping Center is here, but so is some of Denver's best fine dining. It's a short Uber to downtown.",
  },
  {
    slug: "downtown",
    bestFor: "Convenience & walkability",
    dave: "Downtown gets a bad reputation from locals, but for visitors it makes a lot of sense. You're central to everything, and the 16th Street Mall connects you to LoDo quickly. Larimer Square alone is worth the visit. If you want to minimize logistics, stay downtown.",
  },
  {
    slug: "capitol-hill",
    bestFor: "Budget travelers & nightlife",
    dave: "Cap Hill has some of the most affordable hotels close to downtown Denver. You're a 20-minute walk from LoDo and surrounded by bars, live music venues, and late-night food. It's got an edge to it — but if you want to stay somewhere with actual character, Cap Hill delivers.",
  },
  {
    slug: "uptown",
    bestFor: "Foodies",
    dave: "Uptown doesn't get enough credit as a place to stay. 17th Avenue is one of the best restaurant strips in Denver, and you're close to both downtown and City Park. Hotels here tend to be mid-range and good value. If eating well is your main priority, this is a smart base.",
  },
  {
    slug: "washington-park",
    bestFor: "Families & outdoor enthusiasts",
    dave: "Wash Park is a great choice if you're traveling with kids or you want to actually slow down. The park is beautiful, the neighborhood is safe and walkable, and the coffee shops are legitimately good. You'll Uber downtown but that's fine — this is the kind of neighborhood that makes Denver feel like a real city.",
  },
  {
    slug: "golden-triangle",
    bestFor: "Culture & museum lovers",
    dave: "The Golden Triangle is walking distance to the Denver Art Museum, the Clyfford Still Museum, and the History Colorado Center. If museums and culture are high on your list, staying here means you're walking to all of it. Quiet neighborhood, well-located.",
  },
  {
    slug: "airport",
    bestFor: "Early flights & late arrivals",
    dave: "If you have a 6am flight or a midnight arrival, staying near DEN makes more sense than spending $80 on an Uber to downtown. There are solid options at every price point out here, and the Gaylord Rockies is worth knowing about if you want something more than just a sleep-and-fly.",
  },
];

// eslint-disable-next-line @next/next/no-img-element
function HotelCard({ place }: { place: Place }) {
  const href = place.expedia_affiliate_url ?? expediaDenverHotelsUrl();
  const photo = place.photos?.[0];
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:border-denver-amber hover:shadow-xl transition-all duration-200"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-slate-100 dark:bg-slate-800">
        {photo ? (
          <img src={photoUrl(photo.name, 600, 400)} alt={place.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
        ) : (
          <div className="w-full h-full bg-slate-100 dark:bg-slate-800" />
        )}
      </div>
      <div className="p-4 flex flex-col gap-1.5 flex-1">
        <h3 className="font-bold text-sm leading-snug group-hover:text-denver-amber transition-colors line-clamp-2">{place.name}</h3>
        {place.rating && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-500">
            ★ {place.rating.toFixed(1)}
            {place.review_count && <span className="text-slate-400 font-normal">({place.review_count.toLocaleString()})</span>}
          </span>
        )}
        {place.price_level != null && place.price_level > 0 && (
          <span className="text-xs text-slate-400">{"$".repeat(place.price_level)}</span>
        )}
        <span className="mt-auto pt-2 text-xs font-semibold text-denver-amber group-hover:underline">Book on Expedia &rarr;</span>
      </div>
    </a>
  );
}

const FAQS = [
  {
    q: "What is the best neighborhood to stay in Denver?",
    a: "It depends on what you're after. LoDo is the easiest choice for first-timers — central, walkable, close to everything. RiNo is the best choice if food and nightlife are priorities. Cherry Creek is where to go if you want luxury. Highlands is great for couples on a weekend trip.",
  },
  {
    q: "Is downtown Denver safe for tourists?",
    a: "Yes, with the usual awareness you'd apply anywhere. The 16th Street Mall has had some issues in recent years, but the core of downtown — LoDo, Larimer Square, Union Station — is active, well-trafficked, and fine. Stick to the main streets at night and you'll be comfortable.",
  },
  {
    q: "How far is Cherry Creek from downtown Denver?",
    a: "About 2 miles — a 10-minute Uber or a 30-minute walk along the Cherry Creek Trail. It feels further than it is. Most Cherry Creek visitors Uber downtown rather than walk, but the trail is a genuinely nice option if the weather is good.",
  },
  {
    q: "Where should I stay in Denver for the best food?",
    a: "RiNo or Uptown. RiNo has the highest concentration of great restaurants in the city. Uptown's 17th Avenue corridor is underrated and has been quietly excellent for years. Both neighborhoods give you walkable access to multiple great meals without needing a car.",
  },
  {
    q: "Is it worth staying near Denver International Airport?",
    a: "Only if you have an early flight or a very late arrival. DEN is about 30-45 minutes from downtown, so staying near the airport adds significant travel time to everything else you want to do. The exception: the Gaylord Rockies Resort, which is a destination on its own.",
  },
];

export default async function WhereToStayPage() {
  // Fetch hotels for all neighborhoods in parallel
  const hotelsByNeighborhood = await Promise.all(
    HOTEL_NEIGHBORHOODS.map(async (hn) => {
      const places = await getPlaces(hn.slug, "hotels");
      const hotels = places
        .filter(isRealHotel)
        .filter((p) => p.photos && p.photos.length > 0)
        .slice(0, 4);
      return { slug: hn.slug, hotels };
    })
  );
  const hotelMap = new Map(hotelsByNeighborhood.map((h) => [h.slug, h.hotels]));

  return (
    <>
      {/* BreadcrumbList schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://davelovesdenver.com" },
              { "@type": "ListItem", position: 2, name: "Denver", item: "https://davelovesdenver.com/denver" },
              { "@type": "ListItem", position: 3, name: "Where to Stay", item: "https://davelovesdenver.com/denver/where-to-stay" },
            ],
          }),
        }}
      />

      {/* FAQPage schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQS.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />

      {/* Hero */}
      <section className="bg-denver-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <nav className="flex items-center gap-2 text-sm text-white/50 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/denver" className="hover:text-white transition-colors">Denver</Link>
            <span>/</span>
            <span className="text-white/80">Where to Stay</span>
          </nav>
          <p className="text-denver-amber text-sm font-semibold uppercase tracking-widest mb-3">Denver, Colorado</p>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">Where to Stay in Denver</h1>
          <p className="mt-5 text-xl text-white/70 max-w-2xl leading-relaxed">
            Denver&apos;s neighborhoods are genuinely different from each other. The right one depends on why you&apos;re here — so here&apos;s an honest breakdown of where to stay and who each neighborhood actually suits.
          </p>
        </div>
      </section>

      {/* Quick nav strip */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto py-3 scrollbar-none">
            {HOTEL_NEIGHBORHOODS.map((hn) => (
              <a
                key={hn.slug}
                href={`#${hn.slug}`}
                className="flex-shrink-0 px-3 py-1.5 text-xs font-medium rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-denver-amber hover:text-white transition-colors whitespace-nowrap"
              >
                {hn.bestFor}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Neighborhood sections */}
      {HOTEL_NEIGHBORHOODS.map((hn) => {
        const n = NEIGHBORHOODS.find((nb) => nb.slug === hn.slug);
        if (!n) return null;

        return (
          <section
            key={hn.slug}
            id={hn.slug}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-b border-slate-100 dark:border-slate-800"
          >
            {/* Content */}
            <div className="max-w-3xl">
              {/* Neighborhood image badge */}
              <div className="relative inline-flex items-center gap-2 mb-5">
                <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={n.image}
                    alt={n.name}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${n.gradient} opacity-40`} />
                </div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{n.tagline}</span>
              </div>

              <p className="text-denver-amber text-sm font-semibold uppercase tracking-widest mb-2">
                Best for: {hn.bestFor}
              </p>

              <h2 className="text-3xl font-bold mb-2">{n.name}</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-6">{n.description}</p>

              <blockquote className="border-l-4 border-denver-amber pl-5 py-1 mb-8 text-slate-600 dark:text-slate-400 text-lg leading-relaxed italic">
                &ldquo;{hn.dave}&rdquo;
                <footer className="mt-2 text-sm not-italic text-slate-400 dark:text-slate-500">— Dave</footer>
              </blockquote>

              <a
                href={expediaDenverHotelsUrl(n.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-denver-amber hover:bg-amber-500 text-white text-sm font-semibold rounded-full transition-colors"
              >
                Browse hotels in {n.name} &rarr;
              </a>
            </div>

            {/* Hotel cards */}
            {(() => {
              const hotels = hotelMap.get(hn.slug) ?? [];
              if (hotels.length === 0) return null;
              return (
                <div className="mt-8">
                  <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4">Top-Rated Hotels in {n.name}</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {hotels.map((hotel) => <HotelCard key={hotel.place_id} place={hotel} />)}
                  </div>
                </div>
              );
            })()}

            {/* Stay22 embed */}
            {n.stay22EmbedId && (
              <div className="mt-10">
                <iframe
                  src={`https://www.stay22.com/embed/${n.stay22EmbedId}`}
                  width="100%"
                  height="380"
                  frameBorder="0"
                  className="rounded-2xl w-full"
                  title={`Hotels in ${n.name}, Denver`}
                  loading="lazy"
                />
              </div>
            )}
          </section>
        );
      })}

      {/* FAQ */}
      <section className="bg-slate-50 dark:bg-slate-900/50 py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-10">Frequently Asked Questions</h2>
          <div className="space-y-8">
            {FAQS.map((faq) => (
              <div key={faq.q}>
                <h3 className="text-lg font-semibold mb-2">{faq.q}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-wrap gap-4">
          <Link
            href="/denver"
            className="inline-flex items-center gap-2 px-6 py-3 bg-denver-navy hover:bg-denver-navy/90 text-white text-sm font-semibold rounded-full transition-colors"
          >
            Browse all of Denver &rarr;
          </Link>
          <Link
            href="/denver/experiences"
            className="inline-flex items-center gap-2 px-6 py-3 border border-slate-300 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber text-sm font-semibold rounded-full transition-colors"
          >
            See tours &amp; experiences &rarr;
          </Link>
        </div>
      </section>
    </>
  );
}

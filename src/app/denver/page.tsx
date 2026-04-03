import type { Metadata } from "next";
import Link from "next/link";
import { NEIGHBORHOODS, CATEGORIES } from "@/lib/neighborhoods";
import { getBestOfDenver, getTrendingPlaces, isHiddenGem, isRealHotel, photoUrl, popularityScore, type Place, type TrendingPlace } from "@/lib/places";
import { expediaDenverHotelsUrl } from "@/lib/travelpayouts";
import SchemaMarkup from "@/components/SchemaMarkup";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Best of Denver — Top Restaurants, Hotels, Bars & Things To Do",
  description:
    "The top-rated restaurants, hotels, bars, coffee shops, and things to do across all of Denver — ranked by quality and real review counts, not just stars.",
  openGraph: {
    title: "Best of Denver",
    description: "Top-rated places across all Denver neighborhoods, ranked by real popularity and quality.",
    url: "https://davelovesdenver.com/denver",
  },
  alternates: {
    canonical: "https://davelovesdenver.com/denver",
  },
};

function PlacePhoto({ place, className }: { place: Place; className?: string }) {
  const photo = place.photos?.[0];
  if (!photo) return <div className={`bg-slate-100 dark:bg-slate-800 ${className}`} />;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={photoUrl(photo.name, 600, 400)}
      alt={place.name}
      className={`object-cover ${className}`}
      loading="lazy"
    />
  );
}

function RatingBadge({ place }: { place: Place }) {
  if (!place.rating) return null;
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-500">
      ★ {place.rating.toFixed(1)}
      {place.review_count && (
        <span className="text-slate-400 font-normal">({place.review_count.toLocaleString()})</span>
      )}
    </span>
  );
}

function NeighborhoodChip({ slug }: { slug: string }) {
  const n = NEIGHBORHOODS.find((n) => n.slug === slug);
  if (!n) return null;
  return (
    <span className="text-xs font-medium text-denver-amber">
      {n.name}
    </span>
  );
}

// Featured card: large, image-forward
function FeaturedCard({ place, rank }: { place: Place; rank?: number }) {
  const href = `/denver/${place.neighborhood_slug}/${place.category_slug}/${place.slug}`;
  return (
    <a
      href={href}
      className="group relative flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:border-denver-amber hover:shadow-xl transition-all duration-200"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-slate-100 dark:bg-slate-800">
        <PlacePhoto place={place} className="w-full h-full group-hover:scale-105 transition-transform duration-300" />
        {rank && (
          <span className="absolute top-3 left-3 bg-denver-amber text-slate-900 text-xs font-bold px-2.5 py-1 rounded-full">
            #{rank} in Denver
          </span>
        )}
      </div>
      <div className="p-5 flex flex-col gap-2 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <NeighborhoodChip slug={place.neighborhood_slug} />
          {place.price_level != null && place.price_level > 0 && (
            <span className="text-xs text-slate-400">{"$".repeat(place.price_level)}</span>
          )}
        </div>
        <h3 className="font-bold text-lg leading-snug group-hover:text-denver-amber transition-colors">
          {place.name}
        </h3>
        <RatingBadge place={place} />
        {place.review_summary?.tagline && (
          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
            {place.review_summary.tagline.charAt(0).toUpperCase() + place.review_summary.tagline.slice(1)}
          </p>
        )}
      </div>
    </a>
  );
}

// Compact card: smaller, for grids
function CompactCard({ place, rank }: { place: Place; rank?: number }) {
  const href = `/denver/${place.neighborhood_slug}/${place.category_slug}/${place.slug}`;
  return (
    <a
      href={href}
      className="group flex gap-3 items-start bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 hover:border-denver-amber hover:shadow-md transition-all duration-200"
    >
      <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800">
        <PlacePhoto place={place} className="w-full h-full" />
        {rank && (
          <span className="absolute top-1 left-1 bg-denver-amber text-slate-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
            #{rank}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <NeighborhoodChip slug={place.neighborhood_slug} />
        <h3 className="font-semibold text-sm leading-snug group-hover:text-denver-amber transition-colors line-clamp-2">
          {place.name}
        </h3>
        <RatingBadge place={place} />
        {place.review_summary?.tagline && (
          <p className="text-xs text-slate-400 line-clamp-2">
            {place.review_summary.tagline.charAt(0).toUpperCase() + place.review_summary.tagline.slice(1)}
          </p>
        )}
      </div>
    </a>
  );
}

// Hotel card with Reserve button
function HotelCard({ place, rank }: { place: Place; rank: number }) {
  const href = `/denver/${place.neighborhood_slug}/hotels/${place.slug}`;
  const bookUrl = place.expedia_affiliate_url ?? expediaDenverHotelsUrl();
  return (
    <div className="group flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:border-denver-amber hover:shadow-lg transition-all duration-200">
      <a href={href} className="flex flex-col flex-1">
        <div className="relative aspect-video overflow-hidden bg-slate-100 dark:bg-slate-800">
          <PlacePhoto place={place} className="w-full h-full group-hover:scale-105 transition-transform duration-300" />
          <span className="absolute top-2 left-2 bg-denver-amber text-slate-900 text-xs font-bold px-2 py-0.5 rounded-full">
            #{rank} Hotel
          </span>
        </div>
        <div className="p-4 flex flex-col gap-1.5 flex-1">
          <NeighborhoodChip slug={place.neighborhood_slug} />
          <h3 className="font-bold text-base leading-tight group-hover:text-denver-amber transition-colors">
            {place.name}
          </h3>
          <RatingBadge place={place} />
          {place.review_summary?.tagline && (
            <p className="text-xs text-slate-400 line-clamp-2">
              {place.review_summary.tagline.charAt(0).toUpperCase() + place.review_summary.tagline.slice(1)}
            </p>
          )}
        </div>
      </a>
      <div className="px-4 pb-4">
        <a
          href={bookUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="flex items-center justify-center w-full py-2 bg-denver-amber text-slate-900 text-sm font-bold rounded-xl hover:bg-amber-400 transition-colors"
        >
          Reserve on Expedia
        </a>
      </div>
    </div>
  );
}

function SectionHeader({ title, subtitle, href, linkText }: { title: string; subtitle: string; href: string; linkText?: string }) {
  return (
    <div className="flex items-end justify-between mb-8">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
        <p className="mt-1 text-slate-500 dark:text-slate-400 text-sm">{subtitle}</p>
      </div>
      <Link href={href} className="hidden sm:inline-flex text-sm font-semibold text-denver-amber hover:underline shrink-0 ml-4">
        {linkText ?? "See all"} &rarr;
      </Link>
    </div>
  );
}

export default async function BestOfDenverPage() {
  const [restaurants, hotels, bars, thingsToDo, coffee, trending] = await Promise.all([
    getBestOfDenver("restaurants", 10),
    getBestOfDenver("hotels", 9).then((h) => h.filter(isRealHotel)),
    getBestOfDenver("bars", 8),
    getBestOfDenver("things-to-do", 8),
    getBestOfDenver("coffee", 8),
    getTrendingPlaces(30, 8),
  ]);

  // Hidden gems: ≥4.5 rating, 10–300 reviews, any category, sorted by score
  const allForGems = [...restaurants, ...bars, ...thingsToDo, ...coffee];
  const gems = allForGems
    .filter(isHiddenGem)
    .sort((a, b) => popularityScore(b) - popularityScore(a))
    .slice(0, 6);

  const topRestaurant = restaurants[0];
  const restRestaurants = restaurants.slice(1, 9);

  return (
    <>
      <SchemaMarkup
        breadcrumbs={[
          { name: "Home", url: "https://davelovesdenver.com" },
          { name: "Best of Denver", url: "https://davelovesdenver.com/denver" },
        ]}
      />

      {/* Hero */}
      <section className="bg-denver-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <p className="text-denver-amber text-sm font-semibold uppercase tracking-widest mb-3">
            All of Denver
          </p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight max-w-2xl">
            The Best of Denver
          </h1>
          <p className="mt-4 text-white/70 text-lg max-w-xl leading-relaxed">
            Top-rated restaurants, hotels, bars, and things to do across every neighborhood —
            ranked by real review counts, not just stars.
          </p>
          {/* Category nav */}
          <div className="mt-8 flex flex-wrap gap-3">
            {[
              { slug: "restaurants", name: "Restaurants" },
              { slug: "hotels", name: "Hotels" },
              { slug: "bars", name: "Bars & Drinks" },
              { slug: "things-to-do", name: "Things To Do" },
              { slug: "coffee", name: "Coffee" },
            ].map((cat) => (
              <a
                key={cat.slug}
                href={`#${cat.slug}`}
                className="px-4 py-1.5 bg-white/10 border border-white/20 rounded-full text-sm font-medium hover:bg-denver-amber hover:text-slate-900 hover:border-denver-amber transition-colors"
              >
                {cat.name}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Neighborhood browse strip */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex gap-3 overflow-x-auto no-scrollbar">
          {NEIGHBORHOODS.map((n) => (
            <Link
              key={n.slug}
              href={`/denver/${n.slug}`}
              className="shrink-0 px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-denver-amber transition-colors whitespace-nowrap"
            >
              {n.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">

        {/* Trending — only shown once we have snapshot data */}
        {trending.length > 0 && (
          <section id="trending">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-denver-amber">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                  </svg>
                  Trending now
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold">Gaining Momentum</h2>
              <p className="mt-1 text-slate-500 dark:text-slate-400 text-sm">
                Places picking up the most new Google reviews in the last 30 days — ranked by velocity × quality.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {(trending as TrendingPlace[]).map((place) => {
                const href = `/denver/${place.neighborhood_slug}/${place.category_slug}/${place.slug}`;
                const photo = place.photos?.[0];
                const cat = CATEGORIES.find((c) => c.slug === place.category_slug);
                return (
                  <a
                    key={place.place_id}
                    href={href}
                    className="group flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:border-denver-amber hover:shadow-lg transition-all duration-200"
                  >
                    <div className="relative aspect-video overflow-hidden bg-slate-100 dark:bg-slate-800">
                      {photo && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={photoUrl(photo.name, 400, 280)}
                          alt={place.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      )}
                      <span className="absolute top-2 right-2 bg-denver-amber text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        +{place.velocity} reviews
                      </span>
                    </div>
                    <div className="p-4 flex flex-col gap-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <NeighborhoodChip slug={place.neighborhood_slug} />
                        {cat && (
                          <span className="text-xs text-slate-400">{cat.name}</span>
                        )}
                      </div>
                      <h3 className="font-bold text-sm leading-snug group-hover:text-denver-amber transition-colors line-clamp-2">
                        {place.name}
                      </h3>
                      <RatingBadge place={place} />
                      <p className="text-xs text-slate-400 mt-auto pt-1">
                        {place.velocityPerWeek > 0
                          ? `~${place.velocityPerWeek} new reviews/week`
                          : `${place.velocity} new reviews in ${place.windowDays}d`}
                      </p>
                    </div>
                  </a>
                );
              })}
            </div>
          </section>
        )}

        {/* Restaurants */}
        {restaurants.length > 0 && (
          <section id="restaurants">
            <SectionHeader
              title="Best Restaurants in Denver"
              subtitle="Ranked by rating × review count — the places Denverites actually go back to."
              href="/denver/rino/restaurants"
              linkText="Browse by neighborhood"
            />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Top pick — large */}
              {topRestaurant && (
                <div className="lg:col-span-1">
                  <FeaturedCard place={topRestaurant} rank={1} />
                </div>
              )}
              {/* #2–5 compact */}
              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 content-start">
                {restRestaurants.slice(0, 4).map((p, i) => (
                  <CompactCard key={p.place_id} place={p} rank={i + 2} />
                ))}
              </div>
            </div>
            {/* #6–9 as a bottom row */}
            {restRestaurants.length > 4 && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {restRestaurants.slice(4).map((p, i) => (
                  <CompactCard key={p.place_id} place={p} rank={i + 6} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* Hotels */}
        {hotels.length > 0 && (
          <section id="hotels">
            <SectionHeader
              title="Best Hotels in Denver"
              subtitle="Top-rated hotels across every neighborhood, with direct booking links."
              href="/denver/lodo/hotels"
              linkText="Browse by neighborhood"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotels.slice(0, 6).map((p, i) => (
                <HotelCard key={p.place_id} place={p} rank={i + 1} />
              ))}
            </div>
          </section>
        )}

        {/* Bars */}
        {bars.length > 0 && (
          <section id="bars">
            <SectionHeader
              title="Best Bars in Denver"
              subtitle="Craft cocktails, rooftop patios, and dive bars worth the detour."
              href="/denver/rino/bars"
              linkText="Browse by neighborhood"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {bars.slice(0, 4).map((p, i) => (
                <FeaturedCard key={p.place_id} place={p} rank={i + 1} />
              ))}
            </div>
            {bars.length > 4 && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {bars.slice(4, 8).map((p, i) => (
                  <CompactCard key={p.place_id} place={p} rank={i + 5} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* Things To Do */}
        {thingsToDo.length > 0 && (
          <section id="things-to-do">
            <SectionHeader
              title="Best Things To Do in Denver"
              subtitle="From world-class museums to neighborhood institutions — what's actually worth your time."
              href="/denver/rino/things-to-do"
              linkText="Browse by neighborhood"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {thingsToDo[0] && <FeaturedCard place={thingsToDo[0]} rank={1} />}
              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 content-start">
                {thingsToDo.slice(1, 7).map((p, i) => (
                  <CompactCard key={p.place_id} place={p} rank={i + 2} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Coffee */}
        {coffee.length > 0 && (
          <section id="coffee">
            <SectionHeader
              title="Best Coffee in Denver"
              subtitle="Single-origin pour-overs, great espresso, and the spots people work in all day."
              href="/denver/rino/coffee"
              linkText="Browse by neighborhood"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {coffee.slice(0, 8).map((p, i) => (
                <FeaturedCard key={p.place_id} place={p} rank={i + 1} />
              ))}
            </div>
          </section>
        )}

        {/* Hidden Gems */}
        {gems.length > 0 && (
          <section>
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold">Hidden Gems</h2>
              <p className="mt-1 text-slate-500 dark:text-slate-400 text-sm">
                Rated 4.5+ with under 300 reviews — the places locals know that haven&apos;t blown up yet.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {gems.map((p) => (
                <a
                  key={p.place_id}
                  href={`/denver/${p.neighborhood_slug}/${p.category_slug}/${p.slug}`}
                  className="group flex gap-4 items-start bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 hover:border-denver-amber hover:shadow-md transition-all duration-200"
                >
                  <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <PlacePhoto place={p} className="w-full h-full" />
                  </div>
                  <div className="flex flex-col gap-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <NeighborhoodChip slug={p.neighborhood_slug} />
                      <span className="text-xs bg-denver-amber/10 text-denver-amber font-semibold px-1.5 py-0.5 rounded-full">
                        {CATEGORIES.find((c) => c.slug === p.category_slug)?.name ?? p.category_slug}
                      </span>
                    </div>
                    <h3 className="font-semibold text-sm leading-snug group-hover:text-denver-amber transition-colors line-clamp-1">
                      {p.name}
                    </h3>
                    <RatingBadge place={p} />
                    {p.review_summary?.tagline && (
                      <p className="text-xs text-slate-400 line-clamp-2">
                        {p.review_summary.tagline.charAt(0).toUpperCase() + p.review_summary.tagline.slice(1)}
                      </p>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Explore by Neighborhood CTA */}
        <section className="bg-denver-navy rounded-3xl p-8 md:p-12 text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Explore by Neighborhood</h2>
          <p className="text-white/70 mb-8 max-w-xl">
            Every neighborhood in Denver has its own personality. Dig deeper into the ones that interest you.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {NEIGHBORHOODS.map((n) => (
              <Link
                key={n.slug}
                href={`/denver/${n.slug}`}
                className="group relative overflow-hidden rounded-xl aspect-video flex items-end p-3 hover:scale-[1.02] transition-transform"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={n.image} alt={n.name} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
                <span className="relative z-10 text-white text-xs font-bold leading-tight">{n.name}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

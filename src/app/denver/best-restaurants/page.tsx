import type { Metadata } from "next";
import Link from "next/link";
import { NEIGHBORHOODS } from "@/lib/neighborhoods";
import { getBestOfDenver, isRealRestaurant, photoUrl, type Place } from "@/lib/places";
import SchemaMarkup from "@/components/SchemaMarkup";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Best Restaurants in Denver, CO — Top-Rated Picks for 2025",
  description:
    "The best restaurants in Denver ranked by real reviews — from casual neighborhood spots to special occasion dining, organized by neighborhood.",
  openGraph: {
    title: "Best Restaurants in Denver — Top-Rated Picks",
    description: "Ranked by real reviews, not ads. Denver's best restaurants from RiNo to Cherry Creek.",
    url: "https://davelovesdenver.com/denver/best-restaurants",
    images: [{ url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80", width: 1200, height: 630 }],
  },
  alternates: { canonical: "https://davelovesdenver.com/denver/best-restaurants" },
};

// eslint-disable-next-line @next/next/no-img-element
function PlacePhoto({ place, className }: { place: Place; className?: string }) {
  const photo = place.photos?.[0];
  if (!photo) return <div className={`bg-slate-100 dark:bg-slate-800 ${className}`} />;
  return <img src={photoUrl(photo.name, 600, 400)} alt={place.name} className={`object-cover ${className}`} loading="lazy" />;
}

function RatingBadge({ place }: { place: Place }) {
  if (!place.rating) return null;
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-500">
      ★ {place.rating.toFixed(1)}
      {place.review_count && <span className="text-slate-400 font-normal">({place.review_count.toLocaleString()})</span>}
    </span>
  );
}

function NeighborhoodChip({ slug }: { slug: string }) {
  const n = NEIGHBORHOODS.find((n) => n.slug === slug);
  if (!n) return null;
  return <span className="text-xs font-medium text-denver-amber">{n.name}</span>;
}

function FeaturedCard({ place, rank }: { place: Place; rank?: number }) {
  const href = `/denver/${place.neighborhood_slug}/${place.category_slug}/${place.slug}`;
  return (
    <a href={href} className="group flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:border-denver-amber hover:shadow-xl transition-all duration-200">
      <div className="relative aspect-[16/9] overflow-hidden bg-slate-100 dark:bg-slate-800">
        <PlacePhoto place={place} className="w-full h-full group-hover:scale-105 transition-transform duration-300" />
        {rank && (
          <span className="absolute top-2 left-2 bg-denver-amber text-slate-900 text-xs font-bold px-2 py-0.5 rounded-full">
            #{rank}
          </span>
        )}
      </div>
      <div className="p-5 flex flex-col gap-2 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <NeighborhoodChip slug={place.neighborhood_slug} />
          {place.price_level != null && place.price_level > 0 && <span className="text-xs text-slate-400">{"$".repeat(place.price_level)}</span>}
        </div>
        <h3 className="font-bold text-lg leading-snug group-hover:text-denver-amber transition-colors">{place.name}</h3>
        <RatingBadge place={place} />
        {place.review_summary?.tagline && <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{place.review_summary.tagline.charAt(0).toUpperCase() + place.review_summary.tagline.slice(1)}</p>}
      </div>
    </a>
  );
}

function CompactCard({ place }: { place: Place }) {
  const href = `/denver/${place.neighborhood_slug}/${place.category_slug}/${place.slug}`;
  return (
    <a href={href} className="group flex gap-3 items-start bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 hover:border-denver-amber hover:shadow-md transition-all duration-200">
      <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800">
        <PlacePhoto place={place} className="w-full h-full" />
      </div>
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <NeighborhoodChip slug={place.neighborhood_slug} />
        <h3 className="font-semibold text-sm leading-snug group-hover:text-denver-amber transition-colors line-clamp-2">{place.name}</h3>
        <RatingBadge place={place} />
        {place.review_summary?.tagline && <p className="text-xs text-slate-400 line-clamp-2">{place.review_summary.tagline.charAt(0).toUpperCase() + place.review_summary.tagline.slice(1)}</p>}
      </div>
    </a>
  );
}

export default async function BestRestaurantsPage() {
  const raw = await getBestOfDenver("restaurants", 200, { minReviews: 100, minRating: 4.2 });
  const places = raw.filter(isRealRestaurant);
  const top = places.slice(0, 12);
  const rest = places.slice(12);

  return (
    <>
      <SchemaMarkup
        breadcrumbs={[
          { name: "Home", url: "https://davelovesdenver.com" },
          { name: "Best of Denver", url: "https://davelovesdenver.com/denver" },
          { name: "Best Restaurants", url: "https://davelovesdenver.com/denver/best-restaurants" },
        ]}
        itemLists={[{
          name: "Best Restaurants in Denver",
          description: "Top-rated restaurants across Denver neighborhoods, ranked by real reviews.",
          items: places.slice(0, 50).map((p) => ({ name: p.name, url: `/denver/${p.neighborhood_slug}/${p.category_slug}/${p.slug}` })),
        }]}
      />

      {/* Breadcrumb */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <ol className="flex items-center gap-2 text-sm text-slate-500">
          <li><Link href="/" className="hover:text-foreground transition-colors">Home</Link></li>
          <li>/</li>
          <li><Link href="/denver" className="hover:text-foreground transition-colors">Best of Denver</Link></li>
          <li>/</li>
          <li className="text-foreground font-medium">Best Restaurants</li>
        </ol>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <p className="text-denver-amber text-sm font-semibold uppercase tracking-widest mb-3">Ranked by real reviews</p>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight max-w-2xl">Best Restaurants in Denver</h1>
        <p className="mt-4 text-slate-500 dark:text-slate-400 text-lg max-w-2xl leading-relaxed">
          Top-rated restaurants across every Denver neighborhood — ranked by a quality score that weighs both rating and review count, so hidden gems and proven institutions both get their due.
        </p>
        <div className="mt-4 text-sm text-slate-500">
          <strong className="text-foreground font-bold">{places.length}</strong> restaurants tracked citywide
        </div>
      </section>

      {/* Top 12 */}
      {top.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <h2 className="text-2xl font-bold mb-6">Top Picks</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {top.map((place, i) => <FeaturedCard key={place.place_id} place={place} rank={i + 1} />)}
          </div>
        </section>
      )}

      {/* Rest */}
      {rest.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <h2 className="text-2xl font-bold mb-6">More Great Restaurants</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rest.map((place) => <CompactCard key={place.place_id} place={place} />)}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-denver-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold">Browse by neighborhood</h2>
            <p className="text-white/70 mt-2 max-w-md">Every neighborhood has its own food personality. Dig into the one that matches where you&apos;re headed.</p>
          </div>
          <Link href="/denver" className="shrink-0 px-6 py-3 bg-denver-amber text-slate-900 font-bold rounded-xl hover:bg-amber-400 transition-colors">
            Best of Denver &rarr;
          </Link>
        </div>
      </section>
    </>
  );
}

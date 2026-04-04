import type { Metadata } from "next";
import Link from "next/link";
import { NEIGHBORHOODS } from "@/lib/neighborhoods";
import { getBestOfDenver, isRealRestaurant, isRealBar, photoUrl, type Place } from "@/lib/places";
import SchemaMarkup from "@/components/SchemaMarkup";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Best Burgers in Denver, CO — Top-Rated Burger Joints",
  description:
    "Denver's best burgers ranked by real reviews — smash burgers, classic diner burgers, and the local spots worth the drive.",
  openGraph: {
    title: "Best Burgers in Denver — Top-Rated Spots",
    description: "Ranked by real reviews. Denver's best burgers from smash to classic.",
    url: "https://davelovesdenver.com/denver/best-burgers",
    images: [{ url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80", width: 1200, height: 630 }],
  },
  alternates: { canonical: "https://davelovesdenver.com/denver/best-burgers" },
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

function DishChips({ dishes }: { dishes: string[] }) {
  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {dishes.slice(0, 3).map((d) => (
        <span key={d} className="text-xs bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 rounded-full px-2 py-0.5">
          {d}
        </span>
      ))}
    </div>
  );
}

function BurgerCard({ place }: { place: Place }) {
  const href = `/denver/${place.neighborhood_slug}/${place.category_slug}/${place.slug}`;
  return (
    <a href={href} className="group flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:border-denver-amber hover:shadow-xl transition-all duration-200">
      <div className="relative aspect-[16/9] overflow-hidden bg-slate-100 dark:bg-slate-800">
        <PlacePhoto place={place} className="w-full h-full group-hover:scale-105 transition-transform duration-300" />
      </div>
      <div className="p-5 flex flex-col gap-2 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <NeighborhoodChip slug={place.neighborhood_slug} />
          {place.price_level != null && place.price_level > 0 && <span className="text-xs text-slate-400">{"$".repeat(place.price_level)}</span>}
        </div>
        <h3 className="font-bold text-base leading-snug group-hover:text-denver-amber transition-colors">{place.name}</h3>
        <RatingBadge place={place} />
        {place.review_summary?.tagline && (
          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
            {place.review_summary.tagline.charAt(0).toUpperCase() + place.review_summary.tagline.slice(1)}
          </p>
        )}
        {place.review_summary?.popular_dishes && place.review_summary.popular_dishes.length > 0 && (
          <DishChips dishes={place.review_summary.popular_dishes} />
        )}
      </div>
    </a>
  );
}

const BURGER_TYPES = new Set(["hamburger_restaurant", "american_restaurant", "bar", "pub", "fast_food_restaurant"]);

export default async function BestBurgersPage() {
  // Pull from both restaurants AND bars — many of Denver's best burger spots (Cherry Cricket,
  // My Brother's Bar, etc.) are Google-tagged as bars or american restaurants, not hamburger_restaurant.
  const [rawRestaurants, rawBars] = await Promise.all([
    getBestOfDenver("restaurants", 200, { minReviews: 30, minRating: 4.0 }),
    getBestOfDenver("bars", 200, { minReviews: 30, minRating: 4.0 }),
  ]);

  const seen = new Set<string>();
  const merged: Place[] = [];
  for (const p of [...rawRestaurants, ...rawBars]) {
    if (!seen.has(p.place_id)) {
      seen.add(p.place_id);
      merged.push(p);
    }
  }

  const places = merged
    .filter((p) => !p.types || p.types.length === 0 || p.types.some((t) => BURGER_TYPES.has(t)));
  const top = places.slice(0, 12);
  const rest = places.slice(12);

  return (
    <>
      <SchemaMarkup
        breadcrumbs={[
          { name: "Home", url: "https://davelovesdenver.com" },
          { name: "Best of Denver", url: "https://davelovesdenver.com/denver" },
          { name: "Best Burgers", url: "https://davelovesdenver.com/denver/best-burgers" },
        ]}
        itemLists={[{
          name: "Best Burgers in Denver",
          description: "Top-rated burger spots across Denver, ranked by real reviews.",
          items: places.map((p) => ({ name: p.name, url: `/denver/${p.neighborhood_slug}/${p.category_slug}/${p.slug}` })),
        }]}
      />

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <ol className="flex items-center gap-2 text-sm text-slate-500">
          <li><Link href="/" className="hover:text-foreground transition-colors">Home</Link></li>
          <li>/</li>
          <li><Link href="/denver" className="hover:text-foreground transition-colors">Best of Denver</Link></li>
          <li>/</li>
          <li className="text-foreground font-medium">Best Burgers</li>
        </ol>
      </nav>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <p className="text-denver-amber text-sm font-semibold uppercase tracking-widest mb-3">Ranked by real reviews</p>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight max-w-2xl">Best Burgers in Denver</h1>
        <p className="mt-4 text-slate-500 dark:text-slate-400 text-lg max-w-2xl leading-relaxed">
          From smash burgers to proper diner classics — Denver&apos;s burger scene punches well above its weight. These are the spots that keep people coming back, ranked by real reviews.
        </p>
        <div className="mt-4 text-sm text-slate-500">
          <strong className="text-foreground font-bold">{places.length}</strong> burger spots tracked citywide
        </div>
      </section>

      {top.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <h2 className="text-2xl font-bold mb-6">Top Picks</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {top.map((place) => <BurgerCard key={place.place_id} place={place} />)}
          </div>
        </section>
      )}

      {rest.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <h2 className="text-2xl font-bold mb-6">More Great Burgers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rest.map((place) => <BurgerCard key={place.place_id} place={place} />)}
          </div>
        </section>
      )}

      <section className="bg-denver-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold">Full food guide</h2>
            <p className="text-white/70 mt-2 max-w-md">The complete Denver food guide — neighborhoods, coffee, hidden gems, and more.</p>
          </div>
          <Link href="/denver/for-foodies" className="shrink-0 px-6 py-3 bg-denver-amber text-slate-900 font-bold rounded-xl hover:bg-amber-400 transition-colors">
            For Foodies &rarr;
          </Link>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { NEIGHBORHOODS } from "@/lib/neighborhoods";
import { getBestOfDenver, photoUrl, type Place } from "@/lib/places";
import SchemaMarkup from "@/components/SchemaMarkup";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Best Coffee Shops in Denver, CO — Local Favorites & Hidden Gems",
  description:
    "Denver's best coffee shops ranked by real reviews — from specialty roasters in RiNo to neighborhood cafes in Wash Park and Tennyson Street.",
  openGraph: {
    title: "Best Coffee in Denver — Local Roasters & Neighborhood Cafes",
    description: "Ranked by real reviews. Denver's best coffee from RiNo to Platt Park.",
    url: "https://davelovesdenver.com/denver/best-coffee",
    images: [{ url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80", width: 1200, height: 630 }],
  },
  alternates: { canonical: "https://davelovesdenver.com/denver/best-coffee" },
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

function CoffeeCard({ place, rank }: { place: Place; rank?: number }) {
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
        <NeighborhoodChip slug={place.neighborhood_slug} />
        <h3 className="font-bold text-base leading-snug group-hover:text-denver-amber transition-colors">{place.name}</h3>
        <RatingBadge place={place} />
        {place.review_summary?.tagline && <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{place.review_summary.tagline.charAt(0).toUpperCase() + place.review_summary.tagline.slice(1)}</p>}
      </div>
    </a>
  );
}

export default async function BestCoffeePage() {
  const places = await getBestOfDenver("coffee", 24, { requireTypes: ["coffee_shop", "cafe", "coffee_roastery"] });

  return (
    <>
      <SchemaMarkup
        breadcrumbs={[
          { name: "Home", url: "https://davelovesdenver.com" },
          { name: "Best of Denver", url: "https://davelovesdenver.com/denver" },
          { name: "Best Coffee", url: "https://davelovesdenver.com/denver/best-coffee" },
        ]}
        itemLists={[{
          name: "Best Coffee Shops in Denver",
          description: "Top-rated coffee shops and cafes across Denver neighborhoods.",
          items: places.map((p) => ({ name: p.name, url: `/denver/${p.neighborhood_slug}/${p.category_slug}/${p.slug}` })),
        }]}
      />

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <ol className="flex items-center gap-2 text-sm text-slate-500">
          <li><Link href="/" className="hover:text-foreground transition-colors">Home</Link></li>
          <li>/</li>
          <li><Link href="/denver" className="hover:text-foreground transition-colors">Best of Denver</Link></li>
          <li>/</li>
          <li className="text-foreground font-medium">Best Coffee</li>
        </ol>
      </nav>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <p className="text-denver-amber text-sm font-semibold uppercase tracking-widest mb-3">Single-origin & local roasters</p>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight max-w-2xl">Best Coffee in Denver</h1>
        <p className="mt-4 text-slate-500 dark:text-slate-400 text-lg max-w-2xl leading-relaxed">
          Denver takes its coffee seriously. From RiNo&apos;s specialty roasters to the neighborhood cafes in Wash Park and Tennyson Street that regulars have been going to for years — ranked by real reviews.
        </p>
        <div className="mt-4 text-sm text-slate-500">
          <strong className="text-foreground font-bold">{places.length}</strong> top coffee spots tracked citywide
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {places.map((place, i) => <CoffeeCard key={place.place_id} place={place} rank={i + 1} />)}
        </div>
      </section>

      <section className="bg-denver-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold">Browse by neighborhood</h2>
            <p className="text-white/70 mt-2 max-w-md">Every Denver neighborhood has its own coffee culture. Find the spots closest to where you&apos;re headed.</p>
          </div>
          <Link href="/denver" className="shrink-0 px-6 py-3 bg-denver-amber text-slate-900 font-bold rounded-xl hover:bg-amber-400 transition-colors">
            Best of Denver &rarr;
          </Link>
        </div>
      </section>
    </>
  );
}

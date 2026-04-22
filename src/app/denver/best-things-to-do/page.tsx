import type { Metadata } from "next";
import Link from "next/link";
import { NEIGHBORHOODS } from "@/lib/neighborhoods";
import { getBestOfDenver, photoUrl, type Place } from "@/lib/places";
import { searchViatorProducts } from "@/lib/viator";
import ViatorProductCard from "@/components/ViatorProductCard";
import SchemaMarkup from "@/components/SchemaMarkup";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Best Things To Do in Denver, CO — Activities, Attractions & Experiences",
  description:
    "The best things to do in Denver ranked by real reviews — museums, outdoor activities, live music venues, and experiences worth your time.",
  openGraph: {
    title: "Best Things To Do in Denver — Activities & Attractions",
    description: "Ranked by real reviews. What's actually worth your time in Denver.",
    url: "https://davelovesdenver.com/denver/best-things-to-do",
    images: [{ url: "https://images.unsplash.com/photo-1546156929-a4c0ac411f47?auto=format&fit=crop&w=1200&q=80", width: 1200, height: 630 }],
  },
  alternates: { canonical: "https://davelovesdenver.com/denver/best-things-to-do" },
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

function ActivityCard({ place, rank }: { place: Place; rank?: number }) {
  const href = `/denver/${place.neighborhood_slug}/${place.category_slug}/${place.slug}`;
  return (
    <a href={href} className="group flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:border-denver-amber hover:shadow-xl transition-all duration-200">
      <div className="relative aspect-[16/9] overflow-hidden bg-slate-100 dark:bg-slate-800">
        <PlacePhoto place={place} className="w-full h-full group-hover:scale-105 transition-transform duration-300" />
        {rank && <span className="absolute top-2 left-2 bg-denver-amber text-slate-900 text-xs font-bold px-2 py-0.5 rounded-full">#{rank}</span>}
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

export default async function BestThingsToDoPage() {
  const [places, viatorA, viatorB] = await Promise.all([
    getBestOfDenver("things-to-do", 24),
    searchViatorProducts("Denver activities experiences", 12),
    searchViatorProducts("Denver tours attractions", 12),
  ]);

  // Merge and deduplicate by productCode, take first 12
  const seen = new Set<string>();
  const viatorProducts = [...viatorA, ...viatorB].filter((p) => {
    if (seen.has(p.productCode)) return false;
    seen.add(p.productCode);
    return true;
  }).slice(0, 12);

  return (
    <>
      <SchemaMarkup
        breadcrumbs={[
          { name: "Home", url: "https://davelovesdenver.com" },
          { name: "Best of Denver", url: "https://davelovesdenver.com/denver" },
          { name: "Best Things To Do", url: "https://davelovesdenver.com/denver/best-things-to-do" },
        ]}
        itemLists={[{
          name: "Best Things To Do in Denver",
          description: "Top-rated activities, attractions, and experiences across Denver.",
          items: places.map((p) => ({ name: p.name, url: `/denver/${p.neighborhood_slug}/${p.category_slug}/${p.slug}` })),
        }]}
      />

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <ol className="flex items-center gap-2 text-sm text-slate-500">
          <li><Link href="/" className="hover:text-foreground transition-colors">Home</Link></li>
          <li>/</li>
          <li><Link href="/denver" className="hover:text-foreground transition-colors">Best of Denver</Link></li>
          <li>/</li>
          <li className="text-foreground font-medium">Best Things To Do</li>
        </ol>
      </nav>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <p className="text-denver-amber text-sm font-semibold uppercase tracking-widest mb-3">What&apos;s actually worth your time</p>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight max-w-2xl">Best Things To Do in Denver</h1>
        <p className="mt-4 text-slate-500 dark:text-slate-400 text-lg max-w-2xl leading-relaxed">
          Denver has a lot going on — Red Rocks, world-class museums, live music, outdoor everything. Here&apos;s what&apos;s genuinely worth it, ranked by real reviews across every neighborhood.
        </p>
        <div className="mt-4 text-sm text-slate-500">
          <strong className="text-foreground font-bold">{places.length}</strong> activities & attractions tracked citywide
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {places.map((place, i) => <ActivityCard key={place.place_id} place={place} rank={i + 1} />)}
        </div>
      </section>

      {viatorProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <h2 className="text-2xl font-bold mb-2">Book a Denver Experience</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8">Top-rated tours and activities you can book directly.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {viatorProducts.map((product) => (
              <ViatorProductCard key={product.productCode} product={product} />
            ))}
          </div>
        </section>
      )}

      <section className="bg-denver-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold">Explore by neighborhood</h2>
            <p className="text-white/70 mt-2 max-w-md">Each Denver neighborhood has its own things going on. Find what&apos;s close to where you&apos;re staying.</p>
          </div>
          <Link href="/denver" className="shrink-0 px-6 py-3 bg-denver-amber text-slate-900 font-bold rounded-xl hover:bg-amber-400 transition-colors">
            Best of Denver &rarr;
          </Link>
        </div>
      </section>
    </>
  );
}

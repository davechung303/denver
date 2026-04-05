import type { Metadata } from "next";
import Link from "next/link";
import { NEIGHBORHOODS } from "@/lib/neighborhoods";
import { getBestOfDenver, isRealRestaurant, photoUrl, type Place } from "@/lib/places";
import { supabase } from "@/lib/supabase";
import SchemaMarkup from "@/components/SchemaMarkup";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Best Sushi in Denver, CO — Top-Rated Sushi Restaurants",
  description:
    "Denver's best sushi restaurants ranked by real reviews — from Sushi Den to neighborhood spots worth knowing, with what people actually order.",
  openGraph: {
    title: "Best Sushi in Denver — Top-Rated Restaurants",
    description: "Ranked by real reviews. Denver's best sushi from Platt Park to Cherry Creek.",
    url: "https://davelovesdenver.com/denver/best-sushi",
    images: [{ url: "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=1200&q=80", width: 1200, height: 630 }],
  },
  alternates: { canonical: "https://davelovesdenver.com/denver/best-sushi" },
};

// Dave's personally curated sushi picks — ordered intentionally
const DAVES_PICKS_KEYS = [
  { slug: "kizaki",       neighborhood_slug: "platt-park",    note: "Michelin-star omakase by a Denver sushi legend." },
  { slug: "temaki-den",   neighborhood_slug: "rino",          note: "Best hand rolls in the city." },
  { slug: "ototo",        neighborhood_slug: "platt-park",    note: "Excellent Japanese food and sushi in one spot." },
  { slug: "sushi-katsu",  neighborhood_slug: "denver-suburbs",note: "Made-to-order AYCE sushi in Greenwood Village." },
  { slug: "uchi-denver",  neighborhood_slug: "rino",          note: "Transplant that lives up to the hype." },
];

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

function SushiCard({ place, note }: { place: Place; note?: string }) {
  const href = `/denver/${place.neighborhood_slug}/${place.category_slug}/${place.slug}`;
  const davePick = !!note;
  return (
    <a href={href} className="group flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:border-denver-amber hover:shadow-xl transition-all duration-200">
      <div className="relative aspect-[16/9] overflow-hidden bg-slate-100 dark:bg-slate-800">
        <PlacePhoto place={place} className="w-full h-full group-hover:scale-105 transition-transform duration-300" />
        {davePick && (
          <span className="absolute top-3 left-3 bg-denver-amber text-slate-900 text-xs font-bold px-2.5 py-1 rounded-full shadow">
            Dave&apos;s Pick
          </span>
        )}
      </div>
      <div className="p-5 flex flex-col gap-2 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <NeighborhoodChip slug={place.neighborhood_slug} />
          {place.price_level != null && place.price_level > 0 && <span className="text-xs text-slate-400">{"$".repeat(place.price_level)}</span>}
        </div>
        <h3 className="font-bold text-base leading-snug group-hover:text-denver-amber transition-colors">{place.name}</h3>
        <RatingBadge place={place} />
        {note && <p className="text-sm text-slate-600 dark:text-slate-300 italic">&ldquo;{note}&rdquo;</p>}
        {!note && place.review_summary?.tagline && (
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

const SUSHI_TYPES = new Set(["sushi_restaurant", "japanese_restaurant", "ramen_restaurant"]);

export default async function BestSushiPage() {
  const [{ data: davesPicksRaw }, raw] = await Promise.all([
    supabase
      .from("places")
      .select("*")
      .in("slug", DAVES_PICKS_KEYS.map((p) => p.slug)),
    getBestOfDenver("restaurants", 500, { minReviews: 20, minRating: 3.8 }),
  ]);

  const davesPicks = DAVES_PICKS_KEYS
    .map((key) => {
      const place = (davesPicksRaw ?? []).find((p) => p.slug === key.slug && p.neighborhood_slug === key.neighborhood_slug);
      return place ? { place: place as Place, note: key.note } : null;
    })
    .filter(Boolean) as { place: Place; note: string }[];

  const davesPickIds = new Set(davesPicks.map((d) => d.place.place_id));

  const places = raw
    .filter(isRealRestaurant)
    .filter((p) => !davesPickIds.has(p.place_id))
    .filter((p) => !p.types || p.types.length === 0 || p.types.some((t) => SUSHI_TYPES.has(t)));
  const top = places.slice(0, 12);
  const rest = places.slice(12);

  return (
    <>
      <SchemaMarkup
        breadcrumbs={[
          { name: "Home", url: "https://davelovesdenver.com" },
          { name: "Best of Denver", url: "https://davelovesdenver.com/denver" },
          { name: "Best Sushi", url: "https://davelovesdenver.com/denver/best-sushi" },
        ]}
        itemLists={[{
          name: "Best Sushi in Denver",
          description: "Top-rated sushi restaurants across Denver, ranked by real reviews.",
          items: [...davesPicks.map((d) => d.place), ...places].map((p) => ({ name: p.name, url: `/denver/${p.neighborhood_slug}/${p.category_slug}/${p.slug}` })),
        }]}
      />

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <ol className="flex items-center gap-2 text-sm text-slate-500">
          <li><Link href="/" className="hover:text-foreground transition-colors">Home</Link></li>
          <li>/</li>
          <li><Link href="/denver" className="hover:text-foreground transition-colors">Best of Denver</Link></li>
          <li>/</li>
          <li className="text-foreground font-medium">Best Sushi</li>
        </ol>
      </nav>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <p className="text-denver-amber text-sm font-semibold uppercase tracking-widest mb-3">Ranked by real reviews</p>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight max-w-2xl">Best Sushi in Denver</h1>
        <p className="mt-4 text-slate-500 dark:text-slate-400 text-lg max-w-2xl leading-relaxed">
          Denver has world-class sushi — Sushi Den has been one of the most acclaimed restaurants in the city for decades, and the scene around it keeps getting stronger. These are the spots that consistently earn it.
        </p>
      </section>

      {davesPicks.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Dave&apos;s Picks</h2>
            <p className="mt-1 text-slate-500 dark:text-slate-400 text-sm">The spots I keep coming back to.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {davesPicks.map(({ place, note }) => <SushiCard key={place.place_id} place={place} note={note} />)}
          </div>
        </section>
      )}

      {top.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <h2 className="text-2xl font-bold mb-6">Popular Sushi Spots</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {top.map((place) => <SushiCard key={place.place_id} place={place} />)}
          </div>
        </section>
      )}

      {rest.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <h2 className="text-2xl font-bold mb-6">More Sushi & Japanese</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rest.map((place) => <SushiCard key={place.place_id} place={place} />)}
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

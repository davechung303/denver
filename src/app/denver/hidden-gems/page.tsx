import type { Metadata } from "next";
import Link from "next/link";
import { NEIGHBORHOODS, CATEGORIES, isInNeighborhood } from "@/lib/neighborhoods";
import { getAllHiddenGems, isRealCoffeeShop, isRealRestaurant, photoUrl, type Place } from "@/lib/places";
import SchemaMarkup from "@/components/SchemaMarkup";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Denver's Hidden Gems — Under-the-Radar Restaurants, Bars & Local Favorites",
  description:
    "The best-kept secrets in Denver: restaurants, coffee shops, and things to do rated 4.5+ with under 500 reviews. Places locals know that haven't blown up yet.",
  openGraph: {
    title: "Denver's Hidden Gems",
    description: "Rated 4.5+ with under 500 reviews — the places Denver locals know that haven't blown up yet.",
    url: "https://davelovesdenver.com/denver/hidden-gems",
  },
  alternates: {
    canonical: "https://davelovesdenver.com/denver/hidden-gems",
  },
};

function GemCard({ place }: { place: Place }) {
  const href = `/denver/${place.neighborhood_slug}/${place.category_slug}/${place.slug}`;
  const photo = place.photos?.[0];
  const cat = CATEGORIES.find((c) => place.category_slug.startsWith(c.slug));
  return (
    <a
      href={href}
      className="group flex gap-3 items-start bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 hover:border-denver-amber hover:shadow-md transition-all duration-200"
    >
      <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800">
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photoUrl(photo.name, 160, 160)}
            alt={place.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-slate-100 dark:bg-slate-800" />
        )}
      </div>
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        {cat && (
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">{cat.name}</span>
        )}
        <h3 className="font-semibold text-sm leading-snug group-hover:text-denver-amber transition-colors line-clamp-2">
          {place.name}
        </h3>
        <div className="flex items-center gap-2">
          {place.rating && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-500">
              ★ {place.rating.toFixed(1)}
            </span>
          )}
          {place.review_count && (
            <span className="text-xs text-slate-400">{place.review_count.toLocaleString()} reviews</span>
          )}
        </div>
        {place.review_summary?.tagline && (
          <p className="text-xs text-slate-400 line-clamp-2">
            {place.review_summary.tagline.charAt(0).toUpperCase() + place.review_summary.tagline.slice(1)}
          </p>
        )}
      </div>
    </a>
  );
}

export default async function HiddenGemsPage() {
  const raw = await getAllHiddenGems();
  const allGems = raw.filter((p) => {
    if (p.category_slug.startsWith("restaurants")) return isRealRestaurant(p);
    if (p.category_slug.startsWith("coffee")) return isRealCoffeeShop(p);
    if (p.category_slug.startsWith("things-to-do")) return true;
    return false; // exclude hotels, bars
  });

  // Group by neighborhood, top 6 per neighborhood.
  // Also require the place to be within the neighborhood's bounding box —
  // some places are tagged with a neighborhood_slug that doesn't match their actual location.
  const byNeighborhood = NEIGHBORHOODS.map((n) => {
    const picks = allGems
      .filter((p) => p.neighborhood_slug === n.slug && isInNeighborhood(p.lat, p.lng, n.slug))
      .slice(0, 6); // already sorted by qualityScore
    return { neighborhood: n, picks };
  }).filter((g) => g.picks.length > 0);

  const totalGems = byNeighborhood.reduce((sum, g) => sum + g.picks.length, 0);

  return (
    <>
      <SchemaMarkup
        breadcrumbs={[
          { name: "Home", url: "https://davelovesdenver.com" },
          { name: "Best of Denver", url: "https://davelovesdenver.com/denver" },
          { name: "Hidden Gems", url: "https://davelovesdenver.com/denver/hidden-gems" },
        ]}
      />

      {/* Breadcrumb */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <ol className="flex items-center gap-2 text-sm text-slate-500">
          <li><Link href="/" className="hover:text-foreground transition-colors">Home</Link></li>
          <li>/</li>
          <li><Link href="/denver" className="hover:text-foreground transition-colors">Best of Denver</Link></li>
          <li>/</li>
          <li className="text-foreground font-medium">Hidden Gems</li>
        </ol>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <p className="text-denver-amber text-sm font-semibold uppercase tracking-widest mb-3">
          Under the radar
        </p>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight max-w-2xl">
          Denver&apos;s Hidden Gems
        </h1>
        <p className="mt-4 text-slate-500 dark:text-slate-400 text-lg max-w-2xl leading-relaxed">
          Rated 4.5 stars or higher, with fewer than 500 reviews — these are the places Denver locals
          quietly love that haven&apos;t blown up on social media yet. We surface the top 3 from each
          neighborhood so the picks are actually relevant to where you&apos;re going.
        </p>
        <div className="mt-6 flex gap-6 text-sm text-slate-500 dark:text-slate-400">
          <span>
            <strong className="text-foreground font-bold">{totalGems}</strong> gems across{" "}
            <strong className="text-foreground font-bold">{byNeighborhood.length}</strong> neighborhoods
          </span>
          <span>·</span>
          <span>Ranked by rating &amp; proof — not just stars</span>
        </div>

        {/* Neighborhood jump links */}
        <div className="mt-8 flex flex-wrap gap-2">
          {byNeighborhood.map(({ neighborhood }) => (
            <a
              key={neighborhood.slug}
              href={`#${neighborhood.slug}`}
              className="px-3 py-1 text-sm font-medium border border-slate-200 dark:border-slate-700 rounded-full hover:border-denver-amber hover:text-denver-amber transition-colors"
            >
              {neighborhood.name}
            </a>
          ))}
        </div>
      </section>

      {/* Gems by neighborhood */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-14">
        {byNeighborhood.map(({ neighborhood, picks }) => (
          <section key={neighborhood.slug} id={neighborhood.slug}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <Link
                  href={`/denver/${neighborhood.slug}`}
                  className="text-xl font-bold hover:text-denver-amber transition-colors"
                >
                  {neighborhood.name}
                </Link>
                <p className="text-sm text-slate-400 mt-0.5">{neighborhood.tagline}</p>
              </div>
              <Link
                href={`/denver/${neighborhood.slug}`}
                className="hidden sm:inline-flex text-sm font-semibold text-denver-amber hover:underline shrink-0 ml-4"
              >
                Explore {neighborhood.name} &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {picks.map((place) => (
                <GemCard key={place.place_id} place={place} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* CTA */}
      <section className="bg-denver-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold">Want more Denver picks?</h2>
            <p className="text-white/70 mt-2 max-w-md">
              Browse the full Best of Denver guide — top restaurants, hotels, bars, and things to do across every neighborhood.
            </p>
          </div>
          <Link
            href="/denver"
            className="shrink-0 px-6 py-3 bg-denver-amber text-slate-900 font-bold rounded-xl hover:bg-amber-400 transition-colors"
          >
            Best of Denver &rarr;
          </Link>
        </div>
      </section>
    </>
  );
}

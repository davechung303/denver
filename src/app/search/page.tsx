import type { Metadata } from "next";
import Link from "next/link";
import { searchPlaces } from "@/lib/search";
import { photoUrl } from "@/lib/places";
import { CATEGORIES, NEIGHBORHOODS, getPlaceTag } from "@/lib/neighborhoods";
import { expediaDenverHotelsUrl } from "@/lib/travelpayouts";
import type { Place } from "@/lib/places";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}): Promise<Metadata> {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  return {
    title: query ? `"${query}" — Denver Search` : "Search Denver",
    robots: { index: false },
  };
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={`w-3.5 h-3.5 flex-shrink-0 ${
            i <= Math.floor(rating)
              ? "text-amber-400"
              : i === Math.floor(rating) + 1 && rating - Math.floor(rating) >= 0.5
              ? "text-amber-400"
              : "text-slate-300"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
}

function SearchResultCard({ place }: { place: Place }) {
  const href = `/denver/${place.neighborhood_slug}/${place.category_slug}/${place.slug}`;
  const photo = place.photos?.[0];
  const tag = getPlaceTag(place.types);
  const isHotel = place.category_slug === "hotels";
  const neighborhood = NEIGHBORHOODS.find((n) => n.slug === place.neighborhood_slug);
  const category = CATEGORIES.find((c) => c.slug === place.category_slug);
  const isOpen = place.hours?.openNow;

  return (
    <div className="group flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:border-denver-amber hover:shadow-lg transition-all duration-200">
      {/* Photo */}
      <Link href={href} className="block w-32 sm:w-40 flex-shrink-0 relative overflow-hidden bg-slate-100 dark:bg-slate-800">
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photoUrl(photo.name)}
            alt={place.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center min-h-[100px]">
            <span className="text-slate-300 text-xs">No photo</span>
          </div>
        )}
        {place.hours && (
          <span
            className={`absolute top-2 left-2 text-xs font-semibold px-1.5 py-0.5 rounded-full ${
              isOpen ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
            }`}
          >
            {isOpen ? "Open" : "Closed"}
          </span>
        )}
      </Link>

      {/* Info */}
      <div className="flex flex-col flex-1 p-4 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <Link href={href} className="flex-1 min-w-0">
            <h3 className="font-semibold text-base leading-tight group-hover:text-denver-amber transition-colors line-clamp-1">
              {place.name}
            </h3>
          </Link>
          {tag && (
            <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full flex-shrink-0">
              {tag}
            </span>
          )}
        </div>

        {place.rating && (
          <div className="flex items-center gap-2 mt-1.5">
            <StarRating rating={place.rating} />
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              {place.rating.toFixed(1)}
            </span>
            {place.review_count && (
              <span className="text-xs text-slate-400">
                ({place.review_count.toLocaleString()} reviews)
              </span>
            )}
            {place.price_level != null && place.price_level > 0 && (
              <span className="text-xs text-slate-500 ml-1">
                {"$".repeat(place.price_level)}
                <span className="text-slate-300">{"$".repeat(4 - place.price_level)}</span>
              </span>
            )}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1">
          {neighborhood && (
            <Link
              href={`/denver/${neighborhood.slug}`}
              className="text-xs text-denver-amber hover:underline"
            >
              {neighborhood.name}
            </Link>
          )}
          {category && (
            <span className="text-xs text-slate-400">{category.name}</span>
          )}
          {place.address && (
            <span className="text-xs text-slate-500 line-clamp-1">{place.address}</span>
          )}
        </div>

        {place.review_summary?.tagline && (
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 line-clamp-2">
            {place.review_summary.tagline.charAt(0).toUpperCase() +
              place.review_summary.tagline.slice(1)}
          </p>
        )}

        {place.review_summary?.consensus && !place.review_summary?.tagline && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2">
            {place.review_summary.consensus}
          </p>
        )}

        {isHotel && (
          <div className="mt-2">
            <a
              href={place.expedia_affiliate_url ?? expediaDenverHotelsUrl()}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-denver-amber text-slate-900 text-xs font-semibold rounded-lg hover:bg-amber-400 transition-colors"
            >
              Reserve on Expedia
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  const { topResults, relatedResults, intent } = query
    ? await searchPlaces(query)
    : { topResults: [], relatedResults: [], intent: { category_slug: null, neighborhood_slug: null, keywords: "" } };

  const hasResults = topResults.length > 0 || relatedResults.length > 0;

  const intentNeighborhood = intent.neighborhood_slug
    ? NEIGHBORHOODS.find((n) => n.slug === intent.neighborhood_slug)
    : null;
  const intentCategory = intent.category_slug
    ? CATEGORIES.find((c) => c.slug === intent.category_slug)
    : null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Search header */}
      <div className="bg-denver-navy border-b border-white/10 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <form method="GET" action="/search">
            <div className="relative">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="Search restaurants, hotels, bars, neighborhoods..."
                autoFocus={!query}
                className="w-full pl-12 pr-4 py-4 bg-white/10 text-white placeholder-white/40 rounded-xl border border-white/20 focus:outline-none focus:border-denver-amber focus:bg-white/15 text-base"
              />
            </div>
          </form>

          {/* Intent pills */}
          {query && (intentNeighborhood || intentCategory) && (
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <span className="text-xs text-white/40">Searching</span>
              {intentCategory && (
                <span className="text-xs bg-denver-amber/20 text-denver-amber px-2 py-0.5 rounded-full">
                  {intentCategory.name}
                </span>
              )}
              {intentNeighborhood && (
                <span className="text-xs bg-white/10 text-white/70 px-2 py-0.5 rounded-full">
                  {intentNeighborhood.name}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        {!query ? (
          /* Empty state — show category quick links */
          <div>
            <p className="text-slate-500 text-sm mb-6">Start typing to search Denver restaurants, hotels, bars, and more.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: "Best Restaurants", href: "/denver" },
                { label: "Hotels", href: "/denver/where-to-stay" },
                { label: "Bars & Drinks", href: "/denver/best-bars" },
                { label: "Coffee", href: "/denver/best-coffee" },
                { label: "Things To Do", href: "/denver/best-things-to-do" },
                { label: "Hidden Gems", href: "/denver/hidden-gems" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center justify-center px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:border-denver-amber hover:text-denver-amber transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ) : !hasResults ? (
          /* No results */
          <div className="text-center py-16">
            <p className="text-slate-500 mb-2">No results found for <span className="font-medium text-slate-700 dark:text-slate-300">&ldquo;{query}&rdquo;</span></p>
            <p className="text-sm text-slate-400 mb-8">Try a different search — neighborhood name, restaurant type, or business name.</p>
            <Link
              href="/denver"
              className="inline-flex items-center px-5 py-2.5 bg-denver-amber text-slate-900 text-sm font-semibold rounded-xl hover:bg-amber-400 transition-colors"
            >
              Browse all Denver guides
            </Link>
          </div>
        ) : (
          <>
            <p className="text-xs text-slate-400 mb-6">
              {topResults.length + relatedResults.length} results for{" "}
              <span className="font-medium text-slate-600 dark:text-slate-300">&ldquo;{query}&rdquo;</span>
            </p>

            {/* Top Results */}
            {topResults.length > 0 && (
              <section className="mb-10">
                <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-4">
                  Top results
                </h2>
                <div className="flex flex-col gap-3">
                  {topResults.map((place) => (
                    <SearchResultCard key={place.id} place={place} />
                  ))}
                </div>
              </section>
            )}

            {/* Related Results */}
            {relatedResults.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-4">
                  Related results
                </h2>
                <div className="flex flex-col gap-3">
                  {relatedResults.map((place) => (
                    <SearchResultCard key={place.id} place={place} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}

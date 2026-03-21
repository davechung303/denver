import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NEIGHBORHOODS, CATEGORIES, getNeighborhood, getCategory, CATEGORY_DESCRIPTIONS, getPlaceTag } from "@/lib/neighborhoods";
import { getSubcategories } from "@/lib/subcategories";
import { getPlaces } from "@/lib/places";
import { photoUrl } from "@/lib/places";
import { getVideosForPage } from "@/lib/youtube";
import PlaceCard from "@/components/PlaceCard";
import VideoCard from "@/components/VideoCard";
import SchemaMarkup from "@/components/SchemaMarkup";

export const revalidate = 86400; // ISR: revalidate every 24 hours
export const dynamicParams = true; // render unknown params on-demand, don't pre-build all combinations

interface Props {
  params: Promise<{ neighborhood: string; category: string }>;
}


export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { neighborhood: nSlug, category: cSlug } = await params;
  const n = getNeighborhood(nSlug);
  const c = getCategory(cSlug);
  if (!n || !c) return {};

  const title = `Best ${c.name} in ${n.name}, Denver`;
  const description = `Find the best ${c.name.toLowerCase()} in ${n.name} (${n.tagline}), Denver. Local picks, Google ratings, and real recommendations from someone who actually lives here.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://davelovesdenver.com/denver/${nSlug}/${cSlug}`,
    },
    alternates: {
      canonical: `https://davelovesdenver.com/denver/${nSlug}/${cSlug}`,
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { neighborhood: nSlug, category: cSlug } = await params;
  const n = getNeighborhood(nSlug);
  const c = getCategory(cSlug);
  if (!n || !c) notFound();

  const otherCategories = CATEGORIES.filter((cat) => cat.slug !== cSlug);
  const subcategories = getSubcategories(cSlug!);
  const [places, videos] = await Promise.all([
    getPlaces(nSlug, cSlug),
    getVideosForPage(nSlug, cSlug, 3),
  ]);

  const description = CATEGORY_DESCRIPTIONS[nSlug]?.[cSlug] ??
    `Local picks for the best ${c!.name.toLowerCase()} in ${n!.name}, Denver.`;

  // Score by rating × log(reviews) to reward well-reviewed places over obscure high-raters
  const scored = [...places].sort(
    (a, b) =>
      (b.rating ?? 0) * Math.log10((b.review_count ?? 0) + 10) -
      (a.rating ?? 0) * Math.log10((a.review_count ?? 0) + 10)
  );
  const topPicks = scored.slice(0, 5);
  const rest = scored.slice(5);

  return (
    <>
      <SchemaMarkup
        breadcrumbs={[
          { name: "Home", url: "https://davelovesdenver.com" },
          { name: n.name, url: `https://davelovesdenver.com/denver/${nSlug}` },
          { name: c.name, url: `https://davelovesdenver.com/denver/${nSlug}/${cSlug}` },
        ]}
        videos={videos.map((v) => ({
          name: v.title,
          description: v.description,
          thumbnailUrl: v.thumbnail_url,
          uploadDate: v.published_at,
          videoId: v.video_id,
        }))}
      />

      {/* Breadcrumb */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <ol className="flex items-center gap-2 text-sm text-slate-500">
          <li><Link href="/" className="hover:text-foreground transition-colors">Home</Link></li>
          <li>/</li>
          <li><Link href={`/denver/${nSlug}`} className="hover:text-foreground transition-colors">{n.name}</Link></li>
          <li>/</li>
          <li className="text-foreground font-medium">{c.name}</li>
        </ol>
      </nav>

      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-denver-amber text-sm font-semibold uppercase tracking-widest mb-2">
          {n.name} &middot; {n.tagline}
        </p>
        <h1 className="text-4xl md:text-5xl font-bold">
          Best {c.name} in {n.name}
        </h1>
        <p className="mt-4 text-lg text-slate-500 dark:text-slate-400 max-w-2xl">
          {description}
        </p>
      </section>

      {/* Subcategory filters (restaurants & bars) */}
      {subcategories.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-2">
          <div className="flex flex-wrap gap-2">
            {subcategories.map((s) => (
              <Link
                key={s.slug}
                href={`/denver/${nSlug}/${cSlug}/${s.slug}`}
                className="px-4 py-1.5 bg-denver-amber/10 text-denver-amber border border-denver-amber/30 rounded-full text-sm font-medium hover:bg-denver-amber hover:text-slate-900 transition-colors"
              >
                {s.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Other categories in this neighborhood */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 pt-3">
        <div className="flex flex-wrap gap-2">
          {otherCategories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/denver/${nSlug}/${cat.slug}`}
              className="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full text-sm font-medium hover:bg-denver-amber hover:text-slate-900 transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Listings */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
        {places.length === 0 ? (
          <p className="text-center text-slate-400 py-16">No listings found. Check back soon.</p>
        ) : (
          <>
            {/* Top Local Picks */}
            {topPicks.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Top Local Picks</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {topPicks.map((place, i) => {
                    const tag = getPlaceTag(place.types);
                    const photo = place.photos?.[0];
                    return (
                      <a
                        key={place.place_id}
                        href={`/denver/${nSlug}/${cSlug}/${place.slug}`}
                        className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:border-denver-amber hover:shadow-lg transition-all duration-200 flex flex-col"
                      >
                        {/* Photo */}
                        <div className="relative aspect-video overflow-hidden bg-slate-100 dark:bg-slate-800">
                          {photo ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={photoUrl(photo.name, 600, 400)}
                              alt={place.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full" />
                          )}
                          <span className="absolute top-2 left-2 bg-denver-amber text-slate-900 text-xs font-bold px-2 py-0.5 rounded-full">
                            #{i + 1}
                          </span>
                        </div>
                        {/* Info */}
                        <div className="flex flex-col p-4 gap-1.5 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            {tag && (
                              <span className="text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full">
                                {tag}
                              </span>
                            )}
                            {place.hours?.openNow !== undefined && (
                              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${place.hours.openNow ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                                {place.hours.openNow ? "Open" : "Closed"}
                              </span>
                            )}
                          </div>
                          <h3 className="font-bold text-base leading-tight group-hover:text-denver-amber transition-colors">
                            {place.name}
                          </h3>
                          {place.rating && (
                            <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
                              <span className="font-semibold text-amber-500">{place.rating.toFixed(1)}</span>
                              <span className="text-amber-400">★</span>
                              {place.review_count && (
                                <span className="text-slate-400">({place.review_count.toLocaleString()})</span>
                              )}
                              {place.price_level != null && place.price_level > 0 && (
                                <span className="text-slate-400">· {"$".repeat(place.price_level)}</span>
                              )}
                            </div>
                          )}
                          {place.address && (
                            <p className="text-xs text-slate-400 line-clamp-1">{place.address}</p>
                          )}
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            {/* All listings grid */}
            {rest.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">
                  {cSlug === "things-to-do"
                    ? `More things to do in ${n!.name}`
                    : `More ${n!.name} ${c!.name.toLowerCase()}`}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rest.map((place) => (
                    <PlaceCard
                      key={place.place_id}
                      place={place}
                      neighborhoodSlug={nSlug}
                      categorySlug={cSlug}
                      tag={getPlaceTag(place.types)}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </section>

      {/* YouTube Section */}
      <section className="bg-slate-50 dark:bg-slate-900/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <h2 className="text-2xl font-bold">{c.name} Videos from {n.name}</h2>
            <a
              href="https://youtube.com/davechung"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-denver-amber hover:underline"
            >
              See all &rarr;
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {videos.map((video) => (
              <VideoCard key={video.video_id} video={video} neighborhood={n.name} category={c.name} />
            ))}
          </div>
        </div>
      </section>

      {/* Back to neighborhood */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href={`/denver/${nSlug}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-denver-amber hover:underline"
        >
          &larr; Back to {n.name} neighborhood guide
        </Link>
      </div>
    </>
  );
}

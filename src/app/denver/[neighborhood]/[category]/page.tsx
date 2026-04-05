import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NEIGHBORHOODS, CATEGORIES, getNeighborhood, getCategory, CATEGORY_DESCRIPTIONS, getPlaceTag } from "@/lib/neighborhoods";
import { getSubcategories } from "@/lib/subcategories";
import { getPlaces, isRealHotel, isUsefulPlace } from "@/lib/places";
import { photoUrl } from "@/lib/places";
import { getVideosForPage } from "@/lib/youtube";
import PlaceCard from "@/components/PlaceCard";
import VideoCard from "@/components/VideoCard";
import SchemaMarkup from "@/components/SchemaMarkup";

export const revalidate = 604800; // ISR: revalidate weekly — place data refreshed monthly by cron
export const dynamicParams = true; // still render unknown combinations on-demand

export function generateStaticParams() {
  return NEIGHBORHOODS.flatMap((n) =>
    CATEGORIES.map((c) => ({ neighborhood: n.slug, category: c.slug }))
  );
}

interface Props {
  params: Promise<{ neighborhood: string; category: string }>;
}


export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { neighborhood: nSlug, category: cSlug } = await params;
  const n = getNeighborhood(nSlug);
  const c = getCategory(cSlug);
  if (!n || !c) return {};

  const title = `Best ${c.name} near ${n.name}, Denver`;
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

  // Filter out shell records (no rating, no photos) and vacation rentals from hotels
  const filtered = places
    .filter(isUsefulPlace)
    .filter((p) => cSlug !== "hotels" || isRealHotel(p));

  // Proximity boost: places physically inside the neighborhood score higher.
  // Uses a decay from 1.0 (at center) to 0.75 (at 2km+), blended with quality score.
  function proximityMultiplier(lat: number | null, lng: number | null): number {
    if (!lat || !lng || !n!.lat || !n!.lng) return 0.85;
    const dLat = (lat - n!.lat) * (Math.PI / 180);
    const dLng = (lng - n!.lng) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat * Math.PI / 180) * Math.cos(n!.lat * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
    const distKm = 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.max(0.75, 1.0 - distKm * 0.125); // drops 0.125 per km, floors at 0.75
  }

  // Score = quality × proximity — well-reviewed local spots beat distant high-raters
  // Hotels with a direct Expedia affiliate link get a 15% boost to surface them first
  const scored = [...filtered].sort((a, b) => {
    const affiliateBoost = (p: typeof a) => (cSlug === "hotels" && p.expedia_affiliate_url ? 1.15 : 1);
    const scoreA = (a.rating ?? 0) * Math.log10((a.review_count ?? 0) + 10) * proximityMultiplier(a.lat, a.lng) * affiliateBoost(a);
    const scoreB = (b.rating ?? 0) * Math.log10((b.review_count ?? 0) + 10) * proximityMultiplier(b.lat, b.lng) * affiliateBoost(b);
    return scoreB - scoreA;
  });
  const topPicks = scored.slice(0, 5);
  const rest = scored.slice(5);

  const pageUrl = `https://davelovesdenver.com/denver/${nSlug}/${cSlug}`;
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": pageUrl,
    name: `Best ${c.name} near ${n.name}, Denver`,
    description,
    url: pageUrl,
    author: {
      "@type": "Person",
      name: "Dave Chung",
      url: "https://davelovesdenver.com/about",
      sameAs: "https://www.youtube.com/@davechung",
    },
    hasPart: topPicks.map((place) => ({
      "@type": "ListItem",
      name: place.name,
      url: `https://davelovesdenver.com/denver/${nSlug}/${cSlug}/${place.slug}`,
      ...(place.rating && {
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: place.rating,
          reviewCount: place.review_count ?? 1,
          bestRating: 5,
          worstRating: 1,
        },
      }),
    })),
  };

  const categoryFaqs = [
    {
      question: `What are the best ${c.name.toLowerCase()} in ${n.name}, Denver?`,
      answer: topPicks.length > 0
        ? `The top-rated ${c.name.toLowerCase()} in ${n.name} include ${topPicks.slice(0, 3).map((p) => `${p.name}${p.rating ? ` (${p.rating}★)` : ""}`).join(", ")}.${topPicks[0]?.review_summary?.tagline ? ` ${topPicks[0].review_summary.tagline}` : ""}`
        : `${n.name} has a solid ${c.name.toLowerCase()} scene. See the full guide on Dave Loves Denver.`,
    },
    {
      question: `How many ${c.name.toLowerCase()} are there in ${n.name}?`,
      answer: `Dave Loves Denver has tracked ${scored.length} ${c.name.toLowerCase()} in and around ${n.name}, ranked by real Google review counts and quality.`,
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
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
        faqs={categoryFaqs}
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
          Best {c.name} near {n.name}
        </h1>
        <p className="mt-4 text-lg text-slate-500 dark:text-slate-400 max-w-2xl">
          {description}
        </p>
        {/* Answer-formatted sentence — directly answers the AI query in visible prose */}
        {topPicks.length > 0 && (
          <p className="mt-3 text-base text-slate-600 dark:text-slate-300 max-w-2xl">
            Top picks: {topPicks.slice(0, 3).map((p, i) => (
              <span key={p.slug}>
                <Link href={`/denver/${nSlug}/${cSlug}/${p.slug}`} className="font-semibold hover:text-denver-amber transition-colors">
                  {p.name}
                </Link>
                {p.rating && <span className="text-slate-400"> ({p.rating}★)</span>}
                {i < Math.min(topPicks.length, 3) - 1 ? ", " : "."}
              </span>
            ))}{" "}
            {scored.length} {c.name.toLowerCase()} tracked in and around {n.name}.
          </p>
        )}
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
                          {place.review_summary?.tagline && (
                            <p className="text-xs text-denver-amber font-medium line-clamp-2">
                              Known for: {place.review_summary.tagline.charAt(0).toUpperCase() + place.review_summary.tagline.slice(1)}
                            </p>
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
                    ? `More things to do near ${n!.name}`
                    : `More ${c!.name.toLowerCase()} near ${n!.name}`}
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
            <h2 className="text-2xl font-bold">Related Videos</h2>
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

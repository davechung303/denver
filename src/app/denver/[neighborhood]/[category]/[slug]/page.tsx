import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPlace, getPlaces, getPlacesForSubcategory, isUsefulPlace, photoUrl, photoAbsoluteUrl } from "@/lib/places";
import { getVideosForPage } from "@/lib/youtube";
import { expediaHotelUrl, zenhotelsUrl } from "@/lib/travelpayouts";
import { getNeighborhood, getCategory, getPlaceTag, isInNeighborhood } from "@/lib/neighborhoods";
import { getSubcategory, getSubcategories } from "@/lib/subcategories";
import PlaceCard from "@/components/PlaceCard";
import VideoCard from "@/components/VideoCard";
import SchemaMarkup from "@/components/SchemaMarkup";

export const revalidate = 86400;
export const dynamicParams = true; // generate on-demand for any slug not pre-built

interface Props {
  params: Promise<{ neighborhood: string; category: string; slug: string }>;
}

// Schema.org type map by category
const SCHEMA_TYPES: Record<string, string> = {
  restaurants: "Restaurant",
  hotels: "Hotel",
  bars: "BarOrPub",
  "things-to-do": "TouristAttraction",
  coffee: "CafeOrCoffeeShop",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { neighborhood: nSlug, category: cSlug, slug } = await params;
  const n = getNeighborhood(nSlug);
  const c = getCategory(cSlug);
  if (!n || !c) return {};

  // Subcategory page
  const subcategory = getSubcategory(cSlug, slug);
  if (subcategory) {
    const title = `Best ${subcategory.name} in ${n.name}, Denver`;
    const description = subcategory.description(n.name);
    return {
      title,
      description,
      openGraph: { title, description, url: `https://davelovesdenver.com/denver/${nSlug}/${cSlug}/${slug}` },
      alternates: { canonical: `https://davelovesdenver.com/denver/${nSlug}/${cSlug}/${slug}` },
    };
  }

  // Business page
  const place = await getPlace(nSlug, cSlug, slug);
  if (!place) return {};

  const title = `${place.name} — ${c.name} in ${n.name}, Denver`;
  const description = `${place.name} in ${n.name}, Denver. ${place.rating ? `Rated ${place.rating}/5` : ""} ${place.address ? `· ${place.address}` : ""}. Find hours, photos, and more on Dave Loves Denver.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://davelovesdenver.com/denver/${nSlug}/${cSlug}/${slug}`,
      images: place.photos?.[0]
        ? [{ url: photoAbsoluteUrl(place.photos[0].name) }]
        : [],
    },
    alternates: {
      canonical: `https://davelovesdenver.com/denver/${nSlug}/${cSlug}/${slug}`,
    },
  };
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={`w-5 h-5 ${i <= Math.round(rating) ? "text-amber-400" : "text-slate-200 dark:text-slate-700"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="ml-1 text-lg font-semibold">{rating.toFixed(1)}</span>
    </div>
  );
}

export default async function BusinessPage({ params }: Props) {
  const { neighborhood: nSlug, category: cSlug, slug } = await params;
  const n = getNeighborhood(nSlug);
  const c = getCategory(cSlug);
  if (!n || !c) notFound();

  // ── Subcategory listing page ────────────────────────────────────────────
  const subcategory = getSubcategory(cSlug, slug);
  if (subcategory) {
    const [places, videos] = await Promise.all([
      getPlacesForSubcategory(nSlug, cSlug, subcategory.types, subcategory.searchQuery, n.searchName),
      getVideosForPage(nSlug, cSlug, 3),
    ]);
    const otherSubs = getSubcategories(cSlug).filter((s) => s.slug !== slug);
    const localPlaces = places.filter((p) => isInNeighborhood(p.lat, p.lng, nSlug));
    const nearbyPlaces = places.filter((p) => !isInNeighborhood(p.lat, p.lng, nSlug));

    return (
      <>
        <SchemaMarkup
          breadcrumbs={[
            { name: "Home", url: "https://davelovesdenver.com" },
            { name: n.name, url: `https://davelovesdenver.com/denver/${nSlug}` },
            { name: c.name, url: `https://davelovesdenver.com/denver/${nSlug}/${cSlug}` },
            { name: subcategory.name, url: `https://davelovesdenver.com/denver/${nSlug}/${cSlug}/${slug}` },
          ]}
          videos={videos.map((v) => ({ name: v.title, description: v.description, thumbnailUrl: v.thumbnail_url, uploadDate: v.published_at, videoId: v.video_id }))}
        />
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <ol className="flex items-center gap-2 text-sm text-slate-500 flex-wrap">
            <li><Link href="/" className="hover:text-foreground transition-colors">Home</Link></li>
            <li>/</li>
            <li><Link href={`/denver/${nSlug}`} className="hover:text-foreground transition-colors">{n.name}</Link></li>
            <li>/</li>
            <li><Link href={`/denver/${nSlug}/${cSlug}`} className="hover:text-foreground transition-colors">{c.name}</Link></li>
            <li>/</li>
            <li className="text-foreground font-medium">{subcategory.name}</li>
          </ol>
        </nav>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-denver-amber text-sm font-semibold uppercase tracking-widest mb-2">{n.name} &middot; {c.name}</p>
          <h1 className="text-4xl md:text-5xl font-bold">Best {subcategory.name} in {n.name}</h1>
          <p className="mt-4 text-lg text-slate-500 dark:text-slate-400 max-w-2xl">{subcategory.description(n.name)}</p>
        </section>

        {/* Other subcategory pills */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 flex flex-wrap gap-2">
          <Link href={`/denver/${nSlug}/${cSlug}`} className="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full text-sm font-medium hover:bg-denver-amber hover:text-slate-900 transition-colors">
            All {c.name}
          </Link>
          {otherSubs.map((s) => (
            <Link key={s.slug} href={`/denver/${nSlug}/${cSlug}/${s.slug}`} className="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full text-sm font-medium hover:bg-denver-amber hover:text-slate-900 transition-colors">
              {s.name}
            </Link>
          ))}
        </div>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {localPlaces.length === 0 && nearbyPlaces.length === 0 ? (
            <p className="text-center text-slate-400 py-16">No listings found yet — check back soon.</p>
          ) : (
            <>
              {localPlaces.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {localPlaces.map((place) => (
                    <PlaceCard key={place.place_id} place={place} neighborhoodSlug={nSlug} categorySlug={cSlug} tag={getPlaceTag(place.types)} />
                  ))}
                </div>
              )}
              {nearbyPlaces.length > 0 && (
                <div className="mt-14">
                  <h2 className="text-xl font-bold mb-6 text-slate-500 dark:text-slate-400">
                    More {subcategory.name} Spots in Denver
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {nearbyPlaces.map((place) => (
                      <PlaceCard key={place.place_id} place={place} neighborhoodSlug={nSlug} categorySlug={cSlug} tag={getPlaceTag(place.types)} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </section>

        {videos.length > 0 && (
          <section className="bg-slate-50 dark:bg-slate-900/50 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold mb-8">{subcategory.name} Videos from {n.name}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {videos.map((v) => <VideoCard key={v.video_id} video={v} neighborhood={n.name} category={c.name} />)}
              </div>
            </div>
          </section>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link href={`/denver/${nSlug}/${cSlug}`} className="inline-flex items-center gap-2 text-sm font-semibold text-denver-amber hover:underline">
            &larr; All {c.name} in {n.name}
          </Link>
        </div>
      </>
    );
  }

  // ── Business detail page ────────────────────────────────────────────────
  const place = await getPlace(nSlug, cSlug, slug);
  if (!place || !isUsefulPlace(place)) notFound();

  const [relatedPlaces, videos] = await Promise.all([
    getPlaces(nSlug, cSlug),
    getVideosForPage(nSlug, cSlug, 3),
  ]);

  const nearby = relatedPlaces.filter((p) => p.slug !== slug).slice(0, 3);
  const isHotel = cSlug === "hotels";
  const expediaUrl = isHotel ? expediaHotelUrl(place.name) : null;
  const zenUrl = isHotel ? zenhotelsUrl(place.name + " Denver") : null;

  // LocalBusiness schema
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": SCHEMA_TYPES[cSlug] ?? "LocalBusiness",
    name: place.name,
    ...(place.address && { address: { "@type": "PostalAddress", streetAddress: place.address } }),
    ...(place.phone && { telephone: place.phone }),
    ...(place.website && { url: place.website }),
    ...(place.lat && place.lng && { geo: { "@type": "GeoCoordinates", latitude: place.lat, longitude: place.lng } }),
    ...(place.rating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: place.rating,
        reviewCount: place.review_count ?? 1,
        bestRating: 5,
        worstRating: 1,
      },
    }),
    ...(place.photos?.[0] && { image: photoAbsoluteUrl(place.photos[0].name) }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <SchemaMarkup
        breadcrumbs={[
          { name: "Home", url: "https://davelovesdenver.com" },
          { name: n.name, url: `https://davelovesdenver.com/denver/${nSlug}` },
          { name: c.name, url: `https://davelovesdenver.com/denver/${nSlug}/${cSlug}` },
          { name: place.name, url: `https://davelovesdenver.com/denver/${nSlug}/${cSlug}/${slug}` },
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
        <ol className="flex items-center gap-2 text-sm text-slate-500 flex-wrap">
          <li><Link href="/" className="hover:text-foreground transition-colors">Home</Link></li>
          <li>/</li>
          <li><Link href={`/denver/${nSlug}`} className="hover:text-foreground transition-colors">{n.name}</Link></li>
          <li>/</li>
          <li><Link href={`/denver/${nSlug}/${cSlug}`} className="hover:text-foreground transition-colors">{c.name}</Link></li>
          <li>/</li>
          <li className="text-foreground font-medium truncate max-w-[200px]">{place.name}</li>
        </ol>
      </nav>

      {/* Hero photo */}
      {place.photos && place.photos.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 rounded-2xl overflow-hidden max-h-80">
            {place.photos.slice(0, 3).map((photo, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={photoUrl(photo.name, 800, 500)}
                alt={`${place.name} photo ${i + 1}`}
                className={`w-full h-80 object-cover ${i === 0 && place.photos!.length === 1 ? "sm:col-span-3" : ""} ${i === 0 && place.photos!.length > 1 ? "sm:col-span-2" : ""}`}
                loading={i === 0 ? "eager" : "lazy"}
              />
            ))}
          </div>
        </div>
      )}

      {/* Main content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Left: main info */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <p className="text-denver-amber text-sm font-semibold uppercase tracking-widest mb-2">
                {c.name} in {n.name}
              </p>
              <h1 className="text-4xl font-bold">{place.name}</h1>

              {place.rating && (
                <div className="mt-3 flex items-center gap-3 flex-wrap">
                  <StarRating rating={place.rating} />
                  {place.review_count && (
                    <span className="text-slate-500 text-sm">
                      {place.review_count.toLocaleString()} Google reviews
                    </span>
                  )}
                  {place.price_level != null && place.price_level > 0 && (
                    <span className="text-slate-500 text-sm">
                      {"$".repeat(place.price_level)} · {["", "Inexpensive", "Moderate", "Expensive", "Very Expensive"][place.price_level]}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Dave's Take — AI review summary */}
            {place.review_summary && (
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6 space-y-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-denver-amber">Things to Know</p>
                <p className="text-lg font-medium leading-snug text-slate-800 dark:text-slate-100">
                  {place.review_summary.consensus}
                </p>
                {place.review_summary.highlights.length > 0 && (
                  <ul className="space-y-1">
                    {place.review_summary.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                        <span className="text-green-500 mt-0.5 shrink-0">✓</span>
                        {h}
                      </li>
                    ))}
                  </ul>
                )}
                {place.review_summary.lowlights.length > 0 && (
                  <ul className="space-y-1">
                    {place.review_summary.lowlights.map((l, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                        <span className="text-amber-500 mt-0.5 shrink-0">⚠</span>
                        {l}
                      </li>
                    ))}
                  </ul>
                )}
                {place.review_summary.popular_dishes && place.review_summary.popular_dishes.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">People Order</p>
                    <div className="flex flex-wrap gap-2">
                      {place.review_summary.popular_dishes.map((dish, i) => (
                        <span key={i} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm px-3 py-1 rounded-full text-slate-700 dark:text-slate-300">
                          {dish}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <p className="text-xs text-slate-400">Based on Google reviews · AI summarized</p>
              </div>
            )}

            {/* Hours */}
            {place.hours?.weekdayDescriptions && (
              <div>
                <h2 className="text-lg font-semibold mb-3">Hours</h2>
                <div className="space-y-1">
                  {place.hours.weekdayDescriptions.map((day) => (
                    <p key={day} className="text-sm text-slate-600 dark:text-slate-400">{day}</p>
                  ))}
                </div>
                {place.hours.openNow !== undefined && (
                  <span className={`mt-3 inline-block text-sm font-semibold px-3 py-1 rounded-full ${place.hours.openNow ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                    {place.hours.openNow ? "Open now" : "Closed now"}
                  </span>
                )}
              </div>
            )}

            {/* Google Reviews */}
            {place.reviews && place.reviews.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-4">What Visitors Say</h2>
                <div className="space-y-4">
                  {place.reviews.filter((r) => r.text?.text).slice(0, 4).map((review, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-4 space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-denver-amber/20 flex items-center justify-center text-sm font-bold text-denver-amber shrink-0">
                          {review.authorAttribution?.displayName?.[0] ?? "G"}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{review.authorAttribution?.displayName ?? "Google Reviewer"}</p>
                          <p className="text-xs text-slate-400">{review.relativePublishTimeDescription}</p>
                        </div>
                        <div className="ml-auto flex items-center gap-0.5">
                          {[1,2,3,4,5].map((s) => (
                            <svg key={s} className={`w-3 h-3 ${s <= review.rating ? "text-amber-400" : "text-slate-200 dark:text-slate-700"}`} fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-4">
                        {review.text!.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Foursquare local tips */}
            {place.fsq_tips && place.fsq_tips.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Local Tips</h2>
                <div className="space-y-3">
                  {place.fsq_tips.filter((t) => t.text).slice(0, 4).map((tip, i) => (
                    <div key={i} className="flex gap-3 bg-slate-50 dark:bg-slate-900 rounded-xl p-4">
                      <span className="text-denver-amber text-lg shrink-0">💬</span>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        {tip.text}
                      </p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-400 mt-2">Tips from Foursquare</p>
              </div>
            )}

          </div>

          {/* Right: contact card + videos */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 sticky top-20">
              {/* Hotel booking CTAs */}
              {isHotel && expediaUrl && (
                <a
                  href={expediaUrl}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="flex items-center justify-center w-full bg-denver-amber text-slate-900 font-bold py-3 px-4 rounded-xl hover:bg-amber-400 transition-colors"
                >
                  Check Availability on Expedia &rarr;
                </a>
              )}
              {isHotel && zenUrl && (
                <a
                  href={zenUrl}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="flex items-center justify-center w-full border border-slate-200 dark:border-slate-700 text-sm font-semibold py-2.5 px-4 rounded-xl hover:border-denver-amber hover:text-denver-amber transition-colors"
                >
                  Compare prices on ZenHotels
                </a>
              )}

              {place.phone && (
                <a href={`tel:${place.phone}`} className="flex items-center gap-3 text-sm hover:text-denver-amber transition-colors">
                  <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {place.phone}
                </a>
              )}

              {place.address && (
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(place.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-sm hover:text-denver-amber transition-colors"
                >
                  <svg className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {place.address}
                </a>
              )}

              {place.website && (
                <a
                  href={place.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm hover:text-denver-amber transition-colors truncate"
                >
                  <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  <span className="truncate">{place.website.replace(/^https?:\/\/(www\.)?/, "")}</span>
                </a>
              )}

              <Link
                href={`/denver/${nSlug}/${cSlug}`}
                className="block text-center text-sm text-slate-500 hover:text-denver-amber transition-colors pt-2 border-t border-slate-100 dark:border-slate-800"
              >
                &larr; More {c.name} near {n.name}
              </Link>
            </div>

            {/* Related videos in sidebar */}
            {videos.length > 0 && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
                <h2 className="text-base font-semibold">Related Videos</h2>
                <div className="space-y-3">
                  {videos.map((video) => (
                    <VideoCard key={video.video_id} video={video} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related places */}
      {nearby.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <h2 className="text-2xl font-bold mb-6">More {c.name} near {n.name}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {nearby.map((p) => (
              <PlaceCard key={p.place_id} place={p} neighborhoodSlug={nSlug} categorySlug={cSlug} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

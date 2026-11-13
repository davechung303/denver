import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { CATEGORIES, getNeighborhood, getCategory, CATEGORY_DESCRIPTIONS, getPlaceTag } from "@/lib/neighborhoods";
import { getSubcategories } from "@/lib/subcategories";
import { getPlaces, getHotelPool, isRealHotel, isUsefulPlace } from "@/lib/places";
import { hotelsForAreaListing, hotelsInArea } from "@/lib/areaHotels";
import VenueHotelCard from "@/components/VenueHotelCard";
import { getVideosForPage } from "@/lib/youtube";
import { nearestVenues } from "@/lib/venueProximity";
import PlaceCard from "@/components/PlaceCard";
import VideoCard from "@/components/VideoCard";
import SchemaMarkup from "@/components/SchemaMarkup";
import BookYourTrip from "@/components/BookYourTrip";
import { seoMeta } from "@/lib/seo";

/** Places per page. Page 1 is the top six picks plus the next 18 (full rows of three). */
export const PER_PAGE = 24;

export function categoryPageUrl(nSlug: string, cSlug: string, page: number): string {
  return page <= 1 ? `/denver/${nSlug}/${cSlug}` : `/denver/${nSlug}/${cSlug}/page/${page}`;
}


/**
 * Places cached under a compound slug ("restaurants-mexican_restaurant") have
 * detail URLs like /denver/baker/restaurants-mexican_restaurant/la-taqueria,
 * and their breadcrumbs used to link one level up to
 * /denver/baker/restaurants-mexican_restaurant, which isn't a page. Ahrefs found
 * about 170 of those 404s. Send them to the matching cuisine page
 * (/denver/baker/restaurants/mexican) or, failing that, the category.
 */
function redirectCompoundCategory(nSlug: string, cSlug: string): void {
  const base = CATEGORIES.find((cat) => cSlug.startsWith(`${cat.slug}-`));
  if (!base) return;
  const type = cSlug.slice(base.slug.length + 1);
  const sub = getSubcategories(base.slug).find((s) => s.types.includes(type));
  permanentRedirect(sub ? `/denver/${nSlug}/${base.slug}/${sub.slug}` : `/denver/${nSlug}/${base.slug}`);
}

export async function categoryMetadata(nSlug: string, cSlug: string, page: number): Promise<Metadata> {
  const n = getNeighborhood(nSlug);
  const c = getCategory(cSlug);
  if (n && !c) redirectCompoundCategory(nSlug, cSlug);
  if (!n || !c) notFound();

  const meta = seoMeta(
    page > 1 ? `Best ${c.name} in ${n.name}, Denver (Page ${page})` : `Best ${c.name} in ${n.name}, Denver`,
    `The best ${c.name.toLowerCase()} in ${n.name}, Denver, ranked by rating and review volume. Local picks with hours, maps and what's worth the trip.`,
  );

  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: meta.ogTitle,
      description: meta.description,
      url: `https://davelovesdenver.com${categoryPageUrl(nSlug, cSlug, page)}`,
    },
    alternates: {
      canonical: `https://davelovesdenver.com${categoryPageUrl(nSlug, cSlug, page)}`,
    },
  };
}

export async function CategoryView({ nSlug, cSlug, page }: { nSlug: string; cSlug: string; page: number }) {
  const n = getNeighborhood(nSlug);
  const c = getCategory(cSlug);
  if (n && !c) redirectCompoundCategory(nSlug, cSlug);
  if (!n || !c) notFound();

  const otherCategories = CATEGORIES.filter((cat) => cat.slug !== cSlug);
  const subcategories = getSubcategories(cSlug!);
  // Hotels are sourced geographically rather than by places.neighborhood_slug.
  // That column records how a row was fetched, not where it is: no hotel is
  // filed under 'rino' at all, so this page rendered empty for RiNo, and
  // several other neighborhoods listed hotels with no affiliate links while
  // their real, linked properties sat under some other slug. Every other
  // category still uses the column, which works fine for them.
  const [places, videos, hotelPool] = await Promise.all([
    cSlug === "hotels"
      ? getHotelPool().then((pool) => hotelsForAreaListing(pool, nSlug))
      : getPlaces(nSlug, cSlug),
    getVideosForPage(nSlug, cSlug, 3),
    // Non-hotel categories get a booking path. These are the site's
    // highest-traffic pages — the RiNo restaurants page is the largest on the
    // whole site — and until now the only way to book from one was an undated
    // search widget below the fold. Someone reading about where to eat in RiNo
    // is often deciding where to stay in RiNo.
    cSlug === "hotels" ? Promise.resolve([]) : getHotelPool(),
  ]);
  const nearbyHotels = cSlug === "hotels" ? [] : hotelsInArea(hotelPool, nSlug, { limit: 4 });

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
  // Paginated at 24. These pages used to render every place (113 cards for
  // LoDo restaurants, ~1 MB of HTML). Every place is still linked from some
  // page of the list, so nothing is orphaned.
  const totalPages = Math.max(1, Math.ceil(scored.length / PER_PAGE));
  if (page > totalPages) notFound();
  const start = (page - 1) * PER_PAGE;
  const topPicks = page === 1 ? scored.slice(0, 6) : [];
  const rest = page === 1 ? scored.slice(6, PER_PAGE) : scored.slice(start, start + PER_PAGE);
  const pageItems = scored.slice(start, start + PER_PAGE);

  const pageUrl = `https://davelovesdenver.com${categoryPageUrl(nSlug, cSlug, page)}`;
  // CollectionPage without per-item ratings: the old hasPart carried Google's
  // ratings as aggregateRating on ListItem, which isn't a supported type for it
  // and isn't a rating this site collected. The ItemList below lists the places.
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": pageUrl,
    name: page > 1 ? `Best ${c.name} in ${n.name}, Denver (page ${page})` : `Best ${c.name} in ${n.name}, Denver`,
    description,
    url: pageUrl,
    author: {
      "@type": "Person",
      name: "Dave Chung",
      url: "https://davelovesdenver.com/about",
      sameAs: "https://www.youtube.com/@davechung",
    },
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
          ...(page > 1 ? [{ name: `Page ${page}`, url: pageUrl }] : []),
        ]}
        videos={(page === 1 ? videos : []).map((v) => ({
          name: v.title,
          description: v.description,
          thumbnailUrl: v.thumbnail_url,
          uploadDate: v.published_at,
          videoId: v.video_id,
        }))}
        faqs={page === 1 ? categoryFaqs : undefined}
        itemLists={
          pageItems.length > 0
            ? [{
                name: `Best ${c.name} in ${n.name}, Denver`,
                items: pageItems.map((p) => ({
                  name: p.name,
                  url: `/denver/${p.neighborhood_slug ?? nSlug}/${p.category_slug ?? cSlug}/${p.slug}`,
                })),
              }]
            : undefined
        }
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
          {n.name}{" "}&middot; {n.tagline}
        </p>
        <h1 className="text-4xl md:text-5xl font-bold">
          Best {c.name} in {n.name}
          {page > 1 && <span className="block mt-2 text-lg font-normal text-ink-muted dark:text-white/60">Page {page} of {totalPages}</span>}
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
                className="px-4 py-1.5 bg-denver-amber/10 text-denver-amber border border-denver-amber/30 rounded-sm text-sm font-medium hover:bg-denver-amber hover:text-white transition-colors"
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
              className="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-sm text-sm font-medium hover:bg-denver-amber hover:text-white transition-colors"
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {topPicks.map((place, i) => (
                    <PlaceCard
                      key={place.place_id}
                      place={place}
                      neighborhoodSlug={nSlug}
                      categorySlug={cSlug}
                      tag={getPlaceTag(place.types)}
                      rank={i + 1}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* All listings grid */}
            {rest.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">
                  {page > 1
                    ? `${c!.name} in ${n!.name}, ranked ${start + 1}–${start + rest.length} of ${scored.length}`
                    : cSlug === "things-to-do"
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
        {totalPages > 1 && (
          <Pagination nSlug={nSlug} cSlug={cSlug} page={page} totalPages={totalPages} total={scored.length} label={c.name.toLowerCase()} />
        )}
      </section>

      {nearbyHotels.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-100 dark:border-slate-800">
          <h2 className="text-2xl font-bold mb-2">Staying in {n.name}?</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl mb-6">
            The best-rated hotels within walking distance of everything on this page, by real guest
            reviews. Rate links go to Expedia and earn us a commission at no cost to you.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {nearbyHotels.map((h) => (
              <VenueHotelCard key={h.place_id} place={h} />
            ))}
          </div>
          <Link
            href={`/denver/${nSlug}/hotels`}
            className="mt-4 inline-flex items-center text-sm font-semibold text-denver-amber hover:underline"
          >
            All {n.name}{" "}hotels &rarr;
          </Link>
        </section>
      )}

      {/* Expedia stays + flights search — dated searches convert better than a bare hotel-search handoff */}
      <BookYourTrip
        pubref={`cat-${nSlug}-${cSlug}`}
        heading="Coming to Denver?"
        blurb={`Visiting rather than local? Price your dates and compare hotels near ${n.name} along with the flight.`}
      />

      {/* Nearest hotel-venue guide — people browsing a neighborhood's
          restaurants/bars are often deciding where to stay right now too. */}
      {(() => {
        const venue = nearestVenues(n.lat, n.lng, 1)[0];
        if (!venue) return null;
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
            <Link href={venue.href}
              className="flex items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 hover:border-denver-amber transition-colors">
              <p className="text-sm text-slate-600 dark:text-slate-400">Staying for {venue.label}?</p>
              <span className="text-sm font-semibold text-denver-amber shrink-0">See the hotel guide &rarr;</span>
            </Link>
          </div>
        );
      })()}

      {/* YouTube Section */}
      {page === 1 && videos.length > 0 && (
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
      )}

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

function Pagination({
  nSlug,
  cSlug,
  page,
  totalPages,
  total,
  label,
}: {
  nSlug: string;
  cSlug: string;
  page: number;
  totalPages: number;
  total: number;
  label: string;
}) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const cell = "min-w-10 px-3 py-2 text-sm text-center rounded-sm border transition-colors";
  return (
    <nav aria-label={`More ${label}`} className="pt-4 border-t border-rule dark:border-white/10">
      <p className="kicker mb-3">
        {total} {label} · page {page} of {totalPages}
      </p>
      <ul className="flex flex-wrap items-center gap-2">
        {page > 1 && (
          <li>
            <Link href={categoryPageUrl(nSlug, cSlug, page - 1)} rel="prev" className={`${cell} border-rule dark:border-white/15 hover:border-ink dark:hover:border-white`}>
              &larr; Previous
            </Link>
          </li>
        )}
        {pages.map((p) => (
          <li key={p}>
            {p === page ? (
              <span aria-current="page" className={`${cell} inline-block border-ink bg-ink text-white dark:bg-white dark:text-ink dark:border-white`}>
                {p}
              </span>
            ) : (
              <Link href={categoryPageUrl(nSlug, cSlug, p)} className={`${cell} inline-block border-rule dark:border-white/15 hover:border-ink dark:hover:border-white`}>
                {p}
              </Link>
            )}
          </li>
        ))}
        {page < totalPages && (
          <li>
            <Link href={categoryPageUrl(nSlug, cSlug, page + 1)} rel="next" className={`${cell} border-rule dark:border-white/15 hover:border-ink dark:hover:border-white`}>
              Next &rarr;
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

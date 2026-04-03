import type { Metadata } from "next";
import Link from "next/link";
import ViatorWidget from "@/components/ViatorWidget";
import { notFound } from "next/navigation";
import { NEIGHBORHOODS, CATEGORIES, getNeighborhood } from "@/lib/neighborhoods";
import { getVideosForPage } from "@/lib/youtube";
import { getEventsForNeighborhood } from "@/lib/ticketmaster";
import { getPlaces, isRealBar, isRealCoffeeShop, isRealHotel, isRealRestaurant, isUsefulPlace, type Place } from "@/lib/places";
import VideoCard from "@/components/VideoCard";
import EventCard from "@/components/EventCard";
import SchemaMarkup from "@/components/SchemaMarkup";
import MapWrapper from "@/components/MapWrapper";
import PlaceCard from "@/components/PlaceCard";
import { getPlaceTag } from "@/lib/neighborhoods";

export const revalidate = 86400; // ISR: revalidate every 24 hours
// No generateStaticParams — pages render on first visit and are ISR-cached.
// Pre-rendering all neighborhoods at build time caused 60s timeouts when cache is cold.

interface Props {
  params: Promise<{ neighborhood: string }>;
}


export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { neighborhood: slug } = await params;
  const n = getNeighborhood(slug);
  if (!n) return {};

  const title = `${n.name} Neighborhood Guide — Restaurants, Hotels & Things To Do`;
  const description = `The best restaurants, hotels, bars, and things to do in ${n.name} (${n.tagline}), Denver. ${n.description}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://davelovesdenver.com/denver/${slug}`,
    },
    alternates: {
      canonical: `https://davelovesdenver.com/denver/${slug}`,
    },
  };
}


function CategorySection({ title, slug, categorySlug, places, limit, cols = 2 }: {
  title: string;
  slug: string;
  categorySlug: string;
  places: any[];
  limit: number;
  cols?: number;
}) {
  if (places.length === 0) return null;
  const shown = places.slice(0, limit);
  const gridClass = cols === 3
    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
    : "grid-cols-1 sm:grid-cols-2";

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <Link
          href={`/denver/${slug}/${categorySlug}`}
          className="text-xl font-bold hover:text-denver-amber transition-colors"
        >
          {title}
        </Link>
        <Link
          href={`/denver/${slug}/${categorySlug}`}
          className="text-sm font-semibold text-denver-amber hover:underline shrink-0"
        >
          Explore more &rarr;
        </Link>
      </div>
      <div className={`grid ${gridClass} gap-4`}>
        {shown.map((place) => (
          <PlaceCard
            key={place.slug}
            place={place}
            neighborhoodSlug={slug}
            categorySlug={categorySlug}
            tag={getPlaceTag(place.types)}
          />
        ))}
      </div>
    </div>
  );
}

export default async function NeighborhoodPage({ params }: Props) {
  const { neighborhood: slug } = await params;
  const n = getNeighborhood(slug);
  if (!n) notFound();

  const otherNeighborhoods = NEIGHBORHOODS.filter((nb) => nb.slug !== slug);

  const [videos, events, rawRestaurants, rawHotels, rawBars, rawThingsToDo, rawCoffee] = await Promise.all([
    getVideosForPage(slug, null, 3),
    getEventsForNeighborhood(slug, 4),
    getPlaces(slug, "restaurants"),
    getPlaces(slug, "hotels"),
    getPlaces(slug, "bars"),
    getPlaces(slug, "things-to-do"),
    getPlaces(slug, "coffee"),
  ]);
  // Sort by quality × proximity so the featured cards are actually in the neighborhood
  function sortByProximity(places: Place[]): Place[] {
    return [...places].sort((a, b) => {
      const dA = (a.lat && a.lng) ? Math.hypot(a.lat - n!.lat, a.lng - n!.lng) : 999;
      const dB = (b.lat && b.lng) ? Math.hypot(b.lat - n!.lat, b.lng - n!.lng) : 999;
      const proxA = 1 / (1 + dA * 80); // ~1.5km ≈ 0.5 weight decay
      const proxB = 1 / (1 + dB * 80);
      const scoreA = (a.rating ?? 0) * Math.log10((a.review_count ?? 0) + 10) * proxA;
      const scoreB = (b.rating ?? 0) * Math.log10((b.review_count ?? 0) + 10) * proxB;
      return scoreB - scoreA;
    });
  }

  const restaurants = sortByProximity(rawRestaurants.filter(isUsefulPlace).filter(isRealRestaurant));
  const hotels = sortByProximity(rawHotels.filter(isRealHotel).filter(isUsefulPlace));
  const bars = sortByProximity(rawBars.filter(isUsefulPlace).filter(isRealBar));
  const thingsToDo = sortByProximity(rawThingsToDo.filter(isUsefulPlace));
  const coffee = sortByProximity(rawCoffee.filter(isUsefulPlace).filter(isRealCoffeeShop));

  const mapPins = restaurants
    .filter((p) => p.lat && p.lng)
    .slice(0, 20)
    .map((p) => ({ name: p.name, lat: p.lat!, lng: p.lng!, slug: p.slug, rating: p.rating }));

  // FAQs — generated from live data for AI Overviews / Perplexity citation
  const top3Restaurants = restaurants.slice(0, 3);
  const topHotel = hotels[0];
  const faqs = [
    {
      question: `What are the best restaurants in ${n.name}, Denver?`,
      answer: top3Restaurants.length > 0
        ? `The top-rated restaurants in ${n.name} include ${top3Restaurants.map((r) => `${r.name}${r.rating ? ` (${r.rating}★)` : ""}`).join(", ")}. ${top3Restaurants[0]?.review_summary?.tagline ?? ""}`
        : `${n.name} has a growing restaurant scene. Explore the full list on Dave Loves Denver.`,
    },
    {
      question: `What is ${n.name} in Denver known for?`,
      answer: `${n.name} is known as ${n.tagline.toLowerCase()}. ${n.description}`,
    },
    ...(topHotel ? [{
      question: `Where should I stay in ${n.name}, Denver?`,
      answer: `${topHotel.name} is one of the top-rated hotels in ${n.name}${topHotel.rating ? ` with a ${topHotel.rating}★ rating` : ""}. ${topHotel.review_summary?.tagline ?? ""}`,
    }] : []),
    {
      question: `What things to do are there in ${n.name}, Denver?`,
      answer: thingsToDo.length > 0
        ? `Popular things to do in ${n.name} include ${thingsToDo.slice(0, 3).map((t) => t.name).join(", ")}.`
        : `${n.name} has plenty to explore — check the full neighborhood guide on Dave Loves Denver.`,
    },
  ];

  // Review schema — Dave's editorial take on the neighborhood, citable by AI systems
  const neighborhoodReviewSchema = {
    "@context": "https://schema.org",
    "@type": "Review",
    "@id": `https://davelovesdenver.com/denver/${slug}#review`,
    itemReviewed: {
      "@type": "Place",
      name: `${n.name}, Denver, CO`,
      geo: { "@type": "GeoCoordinates", latitude: n.lat, longitude: n.lng },
    },
    author: {
      "@type": "Person",
      name: "Dave Chung",
      url: "https://davelovesdenver.com/about",
      sameAs: "https://www.youtube.com/@davechung",
    },
    publisher: {
      "@type": "Organization",
      name: "Dave Loves Denver",
      url: "https://davelovesdenver.com",
    },
    reviewBody: `${n.name} is ${n.tagline.toLowerCase()}. ${n.description}${top3Restaurants.length > 0 ? ` Top restaurants include ${top3Restaurants.map((r) => r.name).join(", ")}.` : ""}`,
    url: `https://davelovesdenver.com/denver/${slug}`,
  };

  // Place schema — marks the neighborhood as a geographic entity for Knowledge Graph matching
  const neighborhoodPlaceSchema = {
    "@context": "https://schema.org",
    "@type": "Place",
    "@id": `https://davelovesdenver.com/denver/${slug}#place`,
    name: `${n.name}, Denver, CO`,
    description: n.description,
    geo: {
      "@type": "GeoCoordinates",
      latitude: n.lat,
      longitude: n.lng,
    },
    containedInPlace: {
      "@type": "City",
      name: "Denver",
      addressRegion: "CO",
      addressCountry: "US",
    },
    url: `https://davelovesdenver.com/denver/${slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(neighborhoodReviewSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(neighborhoodPlaceSchema) }}
      />
      <SchemaMarkup
        breadcrumbs={[
          { name: "Home", url: "https://davelovesdenver.com" },
          { name: n.name, url: `https://davelovesdenver.com/denver/${slug}` },
        ]}
        videos={videos.map((v) => ({
          name: v.title,
          description: v.description,
          thumbnailUrl: v.thumbnail_url,
          uploadDate: v.published_at,
          videoId: v.video_id,
        }))}
        faqs={faqs}
      />

      {/* Breadcrumb */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <ol className="flex items-center gap-2 text-sm text-slate-500">
          <li><Link href="/" className="hover:text-foreground transition-colors">Home</Link></li>
          <li>/</li>
          <li className="text-foreground font-medium">{n.name}</li>
        </ol>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={n.image} alt={n.name} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-white">
          <p className="text-white/70 text-sm font-medium uppercase tracking-widest mb-3">Denver Neighborhood</p>
          <h1 className="text-5xl md:text-6xl font-bold">{n.name}</h1>
          <p className="text-xl text-white/80 mt-2">{n.tagline}</p>
          <p className="mt-5 text-lg text-white/70 max-w-2xl leading-relaxed">{n.description}</p>
        </div>
      </section>

      {/* At-a-glance place sections */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="space-y-12">
          {/* Restaurants — 3-col grid, shows 6 */}
          <CategorySection
            title={`Restaurants near ${n.name}`}
            slug={slug}
            categorySlug="restaurants"
            places={restaurants}
            limit={6}
            cols={3}
          />
          {/* Other categories — 2×2 grids side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <CategorySection title={`Hotels near ${n.name}`} slug={slug} categorySlug="hotels" places={hotels} limit={4} />
            <CategorySection title={`Bars & Drinks near ${n.name}`} slug={slug} categorySlug="bars" places={bars} limit={4} />
            <CategorySection title={`Things To Do near ${n.name}`} slug={slug} categorySlug="things-to-do" places={thingsToDo} limit={4} />
            <CategorySection title={`Coffee near ${n.name}`} slug={slug} categorySlug="coffee" places={coffee} limit={4} />
          </div>
        </div>
      </section>

      {/* Hidden Gems link */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
        <Link
          href={`/denver/hidden-gems#${slug}`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-denver-amber text-denver-amber font-semibold text-sm hover:bg-denver-amber hover:text-slate-900 transition-colors"
        >
          See hidden gem restaurants in {n.name} &rarr;
        </Link>
      </div>

      {/* Interactive Map */}
      {mapPins.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <h2 className="text-2xl font-bold mb-4">Restaurants Map</h2>
          <div className="h-96 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
            <MapWrapper
              centerLat={n!.lat}
              centerLng={n!.lng}
              neighborhoodSlug={slug}
              categorySlug="restaurants"
              places={mapPins}
            />
          </div>
        </section>
      )}

      {/* Upcoming Events */}
      {events.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <h2 className="text-2xl font-bold mb-6">Upcoming Events near {n!.name}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {events.map((event) => (
              <EventCard key={event.event_id} event={event} />
            ))}
          </div>
        </section>
      )}

      {/* Viator Tours & Experiences */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-2xl font-bold mb-6">Tours & Experiences near {n.name}</h2>
        <ViatorWidget searchTerm={`${n.name} Denver`} />
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
              Explore more &rarr;
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {videos.map((video) => (
              <VideoCard key={video.video_id} video={video} neighborhood={n.name} />
            ))}
          </div>
        </div>
      </section>

      {/* Other Neighborhoods */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-2xl font-bold mb-8">More Denver Neighborhoods</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {otherNeighborhoods.map((nb) => (
            <Link
              key={nb.slug}
              href={`/denver/${nb.slug}`}
              className="group relative overflow-hidden rounded-2xl aspect-video flex flex-col justify-end p-4 hover:scale-[1.02] transition-transform duration-200"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={nb.image} alt={nb.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 group-hover:from-black/70 transition-all" />
              <div className="relative z-10 text-white">
                <p className="text-xs text-white/70">{nb.tagline}</p>
                <h3 className="font-bold">{nb.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

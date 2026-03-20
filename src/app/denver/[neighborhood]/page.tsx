import type { Metadata } from "next";
import Link from "next/link";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { NEIGHBORHOODS, CATEGORIES, getNeighborhood } from "@/lib/neighborhoods";
import { getVideosForPage } from "@/lib/youtube";
import { getEventsForNeighborhood } from "@/lib/eventbrite";
import { getDenverWeather } from "@/lib/weather";
import { getPlaces } from "@/lib/places";
import VideoCard from "@/components/VideoCard";
import EventCard from "@/components/EventCard";
import WeatherWidget from "@/components/WeatherWidget";
import SchemaMarkup from "@/components/SchemaMarkup";

const NeighborhoodMap = dynamic(() => import("@/components/NeighborhoodMap"), { ssr: false });

export const revalidate = 86400; // ISR: revalidate every 24 hours

interface Props {
  params: Promise<{ neighborhood: string }>;
}

export async function generateStaticParams() {
  return NEIGHBORHOODS.map((n) => ({ neighborhood: n.slug }));
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

export default async function NeighborhoodPage({ params }: Props) {
  const { neighborhood: slug } = await params;
  const n = getNeighborhood(slug);
  if (!n) notFound();

  const otherNeighborhoods = NEIGHBORHOODS.filter((nb) => nb.slug !== slug);
  const [videos, events, weather, restaurantPlaces] = await Promise.all([
    getVideosForPage(slug, null, 3),
    getEventsForNeighborhood(slug, 4),
    getDenverWeather(),
    getPlaces(slug, "restaurants"),
  ]);

  const mapPins = restaurantPlaces
    .filter((p) => p.lat && p.lng)
    .slice(0, 20)
    .map((p) => ({ name: p.name, lat: p.lat!, lng: p.lng!, slug: p.slug, rating: p.rating }));

  return (
    <>
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
        <div className={`absolute inset-0 bg-gradient-to-br ${n.gradient} opacity-95`} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-white">
          <p className="text-white/70 text-sm font-medium uppercase tracking-widest mb-3">Denver Neighborhood</p>
          <h1 className="text-5xl md:text-6xl font-bold">{n.name}</h1>
          <p className="text-xl text-white/80 mt-2">{n.tagline}</p>
          <p className="mt-5 text-lg text-white/70 max-w-2xl leading-relaxed">{n.description}</p>
        </div>
      </section>

      {/* Weather */}
      {weather && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <WeatherWidget weather={weather} />
        </div>
      )}

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold mb-8">Explore {n.name}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/denver/${n.slug}/${c.slug}`}
              className="group flex flex-col items-center justify-center gap-3 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-denver-amber hover:shadow-md transition-all"
            >
              <span className="text-sm font-semibold group-hover:text-denver-amber transition-colors">
                {c.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Interactive Map */}
      {mapPins.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <h2 className="text-2xl font-bold mb-4">Restaurants Map</h2>
          <div className="h-96 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
            <NeighborhoodMap
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
          <h2 className="text-2xl font-bold mb-6">Upcoming Events in {n!.name}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {events.map((event) => (
              <EventCard key={event.event_id} event={event} />
            ))}
          </div>
        </section>
      )}

      {/* YouTube Section */}
      <section className="bg-slate-50 dark:bg-slate-900/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <h2 className="text-2xl font-bold">My {n.name} Videos</h2>
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
              <div className={`absolute inset-0 bg-gradient-to-br ${nb.gradient} opacity-90 group-hover:opacity-100 transition-opacity`} />
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

import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { supabase } from "@/lib/supabase";
import { getFeverEvents } from "@/lib/fever";
import { searchViatorProducts } from "@/lib/viator";
import { getBestOfDenver, photoUrl, type Place } from "@/lib/places";
import { ticketmasterAffiliateUrl } from "@/lib/travelpayouts";
import type { DenverEvent } from "@/lib/ticketmaster";
import type { FeverEvent } from "@/lib/fever";
import ViatorProductCard from "@/components/ViatorProductCard";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Things To Do in Denver — Events, Tours & Experiences | Dave Loves Denver",
  description:
    "Everything worth doing in Denver: upcoming concerts and shows, bookable experiences, top-rated tours, and the best attractions — all in one place.",
  alternates: { canonical: "https://davelovesdenver.com/denver/things-to-do" },
};

async function getUpcomingEvents(): Promise<DenverEvent[]> {
  try {
    const now = new Date().toISOString();
    const { data } = await supabase
      .from("events")
      .select("*")
      .gte("start_time", now)
      .order("start_time", { ascending: true })
      .limit(6);
    return (data ?? []) as DenverEvent[];
  } catch {
    return [];
  }
}

function formatEventDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) +
    " · " +
    d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

// eslint-disable-next-line @next/next/no-img-element
function EventCard({ event }: { event: DenverEvent }) {
  return (
    <a
      href={ticketmasterAffiliateUrl(event.url)}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 hover:border-denver-amber hover:shadow-md transition-all duration-200"
    >
      {event.image_url ? (
        <img src={event.image_url} alt={event.name} className="w-16 h-16 object-cover rounded-lg shrink-0" loading="lazy" />
      ) : (
        <div className="w-16 h-16 rounded-lg shrink-0 bg-denver-amber/10 flex items-center justify-center">
          <svg className="w-7 h-7 text-denver-amber/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
        </div>
      )}
      <div className="flex flex-col gap-1 min-w-0">
        <span className="text-xs font-semibold text-denver-amber">{formatEventDate(event.start_time)}</span>
        <h3 className="font-semibold text-sm leading-tight group-hover:text-denver-amber transition-colors line-clamp-2">{event.name}</h3>
        {event.venue_name && <p className="text-xs text-slate-400 truncate">{event.venue_name}</p>}
      </div>
    </a>
  );
}

// eslint-disable-next-line @next/next/no-img-element
function FeverCard({ event }: { event: FeverEvent }) {
  return (
    <a
      href={event.url}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="group flex gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 hover:border-denver-amber hover:shadow-md transition-all duration-200"
    >
      {event.image_url ? (
        <img src={event.image_url} alt={event.name} className="w-16 h-16 object-cover rounded-lg shrink-0" loading="lazy" />
      ) : (
        <div className="w-16 h-16 rounded-lg shrink-0 bg-denver-amber/10 flex items-center justify-center">
          <svg className="w-7 h-7 text-denver-amber/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
          </svg>
        </div>
      )}
      <div className="flex flex-col gap-1 min-w-0">
        <h3 className="font-semibold text-sm leading-tight group-hover:text-denver-amber transition-colors line-clamp-2">{event.name}</h3>
        {event.venue_name && <p className="text-xs text-slate-400 truncate">{event.venue_name}</p>}
        {event.price != null && event.price > 0 && (
          <p className="text-xs font-semibold text-denver-amber mt-auto">From ${event.price.toFixed(0)}</p>
        )}
      </div>
    </a>
  );
}

// eslint-disable-next-line @next/next/no-img-element
function AttractionCard({ place }: { place: Place }) {
  const photo = place.photos?.[0];
  const href = `/denver/${place.neighborhood_slug}/${place.category_slug}/${place.slug}`;
  return (
    <a href={href} className="group flex gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden hover:border-denver-amber hover:shadow-md transition-all duration-200">
      {photo ? (
        <img src={photoUrl(photo.name, 200, 200)} alt={place.name} className="w-20 h-20 object-cover shrink-0" loading="lazy" />
      ) : (
        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 shrink-0" />
      )}
      <div className="flex flex-col gap-1 min-w-0 py-3 pr-4">
        <h3 className="font-semibold text-sm leading-tight group-hover:text-denver-amber transition-colors line-clamp-2">{place.name}</h3>
        {place.rating && (
          <span className="text-xs text-amber-500 font-semibold">★ {place.rating.toFixed(1)}</span>
        )}
        {place.review_summary?.tagline && (
          <p className="text-xs text-slate-500 line-clamp-1">{place.review_summary.tagline}</p>
        )}
      </div>
    </a>
  );
}

export default async function ThingsToDoPage() {
  const [events, feverEvents, viatorProducts, attractions] = await Promise.all([
    getUpcomingEvents(),
    getFeverEvents(6),
    searchViatorProducts("Denver experiences tours", 8),
    getBestOfDenver("things-to-do", 6),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="bg-denver-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <p className="text-denver-amber text-sm font-semibold uppercase tracking-widest mb-3">Denver, Colorado</p>
          <h1 className="text-4xl md:text-5xl font-bold">Things To Do in Denver</h1>
          <p className="mt-4 text-white/70 text-lg max-w-2xl">
            Live events, bookable experiences, guided tours, and top-rated attractions — everything worth your time in Denver.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">

        {/* Upcoming Events */}
        {events.length > 0 && (
          <section>
            <div className="flex items-end justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Upcoming Events</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Live concerts, sports, and shows</p>
              </div>
              <Link href="/events" className="text-sm font-semibold text-denver-amber hover:underline shrink-0">
                See all events &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {events.map((event) => <EventCard key={event.event_id} event={event} />)}
            </div>
          </section>
        )}

        {/* Bookable Experiences */}
        {feverEvents.length > 0 && (
          <section>
            <div className="flex items-end justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Bookable Experiences</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Puzzle rooms, museum passes, city adventures</p>
              </div>
              <Link href="/events" className="text-sm font-semibold text-denver-amber hover:underline shrink-0">
                See all &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {feverEvents.map((event) => <FeverCard key={event.event_id} event={event} />)}
            </div>
          </section>
        )}

        {/* Tours via Viator */}
        {viatorProducts.length > 0 && (
          <section>
            <div className="flex items-end justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Guided Tours & Adventures</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Food tours, brewery tours, outdoor adventures</p>
              </div>
              <Link href="/denver/experiences" className="text-sm font-semibold text-denver-amber hover:underline shrink-0">
                See all tours &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {viatorProducts.map((product) => <ViatorProductCard key={product.productCode} product={product} />)}
            </div>
          </section>
        )}

        {/* GetYourGuide widget */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold">More to Explore</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Activities and experiences from around Denver</p>
          </div>
          <div data-gyg-widget="auto" data-gyg-partner-id="9SRZ2CR" />
          <Script src="https://widget.getyourguide.com/dist/pa.umd.production.min.js" strategy="afterInteractive" />
        </section>

        {/* Top Attractions */}
        {attractions.length > 0 && (
          <section>
            <div className="flex items-end justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Top Attractions</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Museums, parks, and Denver landmarks</p>
              </div>
              <Link href="/denver/best-things-to-do" className="text-sm font-semibold text-denver-amber hover:underline shrink-0">
                See all attractions &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {attractions.map((place) => <AttractionCard key={place.place_id} place={place} />)}
            </div>
          </section>
        )}

      </div>
    </>
  );
}

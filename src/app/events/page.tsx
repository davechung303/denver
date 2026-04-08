import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import type { DenverEvent } from "@/lib/ticketmaster";
import { getFeverEvents, type FeverEvent } from "@/lib/fever";
import EventsClient from "./EventsClient";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Denver Events & Experiences | Dave Loves Denver",
  description: "Upcoming concerts, shows, sports, and experiences in Denver — live events from Ticketmaster plus curated experiences from Fever.",
  alternates: { canonical: "https://davelovesdenver.com/events" },
};

async function getEvents(): Promise<DenverEvent[]> {
  try {
    const now = new Date().toISOString();
    const { data } = await Promise.race([
      supabase
        .from("events")
        .select("*")
        .gte("start_time", now)
        .order("start_time", { ascending: true })
        .limit(500),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error("db timeout")), 15000)),
    ]);
    return (data ?? []) as DenverEvent[];
  } catch {
    return [];
  }
}

// eslint-disable-next-line @next/next/no-img-element
function FeverCard({ event }: { event: FeverEvent }) {
  const subcategories = event.subcategory?.split(",").map((s) => s.trim()).filter(Boolean) ?? [];
  return (
    <a
      href={event.url}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="group flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden hover:border-denver-amber hover:shadow-md transition-all duration-200"
    >
      {event.image_url && (
        <div className="aspect-[16/9] overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img
            src={event.image_url}
            alt={event.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
      )}
      <div className="p-4 flex flex-col gap-2 flex-1">
        {subcategories.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {subcategories.slice(0, 2).map((s) => (
              <span key={s} className="text-xs bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 rounded-full px-2 py-0.5">
                {s}
              </span>
            ))}
          </div>
        )}
        <h3 className="font-semibold text-sm leading-snug group-hover:text-denver-amber transition-colors line-clamp-2">
          {event.name}
        </h3>
        {event.venue_name && (
          <p className="text-xs text-slate-400 truncate">{event.venue_name}</p>
        )}
        {event.price != null && event.price > 0 && (
          <p className="text-xs font-semibold text-denver-amber mt-auto">From ${event.price.toFixed(0)}</p>
        )}
      </div>
    </a>
  );
}

export default async function EventsPage() {
  const [events, feverEvents] = await Promise.all([
    getEvents(),
    getFeverEvents(24),
  ]);

  return (
    <>
      <section className="bg-denver-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <p className="text-denver-amber text-sm font-semibold uppercase tracking-widest mb-3">
            Denver, Colorado
          </p>
          <h1 className="text-4xl md:text-5xl font-bold">Denver Events & Experiences</h1>
          <p className="mt-4 text-white/70 text-lg max-w-2xl">
            Live concerts, sports, and shows — plus curated experiences you can book any time.
          </p>
          {events.length > 0 && (
            <p className="mt-3 text-white/40 text-sm">{events.length} upcoming events</p>
          )}
        </div>
      </section>

      <EventsClient events={events} />

      {feverEvents.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold">Experiences & Shows</h2>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">
            Bookable Denver experiences — comedy, immersive art, food events, and more.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {feverEvents.map((event) => (
              <FeverCard key={event.event_id} event={event} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

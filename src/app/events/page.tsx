import type { Metadata } from "next";
import Link from "next/link";
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
          <p className="mt-3 text-white/40 text-sm">
            {events.length} upcoming events · {feverEvents.length} experiences
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">Browse by Venue</h2>
        <div className="flex flex-wrap gap-2">
          {[
            { href: "/events/red-rocks", label: "Red Rocks" },
            { href: "/events/ball-arena", label: "Ball Arena" },
            { href: "/events/coors-field", label: "Coors Field" },
            { href: "/events/empower-field", label: "Empower Field" },
            { href: "/events/mission-ballroom", label: "Mission Ballroom" },
            { href: "/events/fiddlers-green", label: "Fiddler's Green" },
            { href: "/events/ogden-theatre", label: "Ogden Theatre" },
            { href: "/events/paramount-theatre", label: "Paramount Theatre" },
            { href: "/events/dicks-sporting-goods-park", label: "Dick's Sporting Goods Park" },
          ].map((v) => (
            <Link key={v.href} href={v.href}
              className="inline-flex items-center px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 text-sm font-medium hover:border-denver-amber hover:text-denver-amber transition-colors">
              {v.label}
            </Link>
          ))}
        </div>
      </section>

      <EventsClient events={events} feverEvents={feverEvents} />
    </>
  );
}

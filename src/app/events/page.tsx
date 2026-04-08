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

      <EventsClient events={events} feverEvents={feverEvents} />
    </>
  );
}

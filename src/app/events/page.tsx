import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import type { DenverEvent } from "@/lib/ticketmaster";
import EventsClient from "./EventsClient";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Denver Events | Dave Loves Denver",
  description: "Upcoming concerts, sports games, shows, and things to do in Denver — pulled live from Ticketmaster within 20 miles of the city.",
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
  const events = await getEvents();

  return (
    <>
      <section className="bg-denver-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <p className="text-denver-amber text-sm font-semibold uppercase tracking-widest mb-3">
            Denver, Colorado
          </p>
          <h1 className="text-4xl md:text-5xl font-bold">Upcoming Denver Events</h1>
          <p className="mt-4 text-white/70 text-lg max-w-2xl">
            Concerts, sports, shows, and things to do — within 20 miles of Denver.
          </p>
          {events.length > 0 && (
            <p className="mt-3 text-white/40 text-sm">{events.length} upcoming events</p>
          )}
        </div>
      </section>

      <EventsClient events={events} />
    </>
  );
}

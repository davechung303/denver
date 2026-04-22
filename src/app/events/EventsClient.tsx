"use client";

import React, { useState, useMemo } from "react";
import type { DenverEvent } from "@/lib/ticketmaster";
import type { FeverEvent } from "@/lib/fever";
import { ticketmasterAffiliateUrl } from "@/lib/travelpayouts";

const CATEGORIES = ["All", "Music", "Arts & Theatre", "Sports", "Film"];

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatDateHeader(dateKey: string): { label: string; sub: string } {
  const date = new Date(dateKey + "T12:00:00");
  const todayKey = new Date().toLocaleDateString("en-CA");
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrowKey = tomorrowDate.toLocaleDateString("en-CA");

  const full = date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  if (dateKey === todayKey) return { label: "Today", sub: full };
  if (dateKey === tomorrowKey) return { label: "Tomorrow", sub: full };
  return { label: full, sub: "" };
}

// eslint-disable-next-line @next/next/no-img-element
function FeverCard({ event }: { event: FeverEvent }) {
  return (
    <a
      href={event.url}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="group flex gap-4 bg-white/10 border border-white/20 rounded-xl p-4 hover:border-denver-amber hover:bg-white/15 transition-all duration-200"
    >
      {event.image_url ? (
        <img
          src={event.image_url}
          alt={event.name}
          className="w-16 h-16 object-cover rounded-lg shrink-0"
          loading="lazy"
        />
      ) : (
        <div className="w-16 h-16 rounded-lg shrink-0 bg-white/10 flex items-center justify-center">
          <svg className="w-7 h-7 text-denver-amber/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
          </svg>
        </div>
      )}
      <div className="flex flex-col gap-1 min-w-0">
        <h3 className="font-semibold text-sm leading-tight text-white group-hover:text-denver-amber transition-colors line-clamp-2">
          {event.name}
        </h3>
        {event.venue_name && (
          <p className="text-xs text-white/50 truncate">{event.venue_name}</p>
        )}
        {event.price != null && event.price > 0 && (
          <p className="text-xs font-semibold text-denver-amber mt-auto">From ${event.price.toFixed(0)}</p>
        )}
      </div>
    </a>
  );
}

interface Props {
  events: DenverEvent[];
  feverEvents: FeverEvent[];
}

export default function EventsClient({ events, feverEvents }: Props) {
  const [activeCategories, setActiveCategories] = useState<Record<string, string>>({});

  function getActive(dateKey: string) {
    return activeCategories[dateKey] ?? "All";
  }

  function setActive(dateKey: string, cat: string) {
    setActiveCategories((prev) => ({ ...prev, [dateKey]: cat }));
  }

  // Group Ticketmaster events by local date
  const tmGroups = useMemo(() => {
    const map = new Map<string, DenverEvent[]>();
    for (const event of events) {
      const d = new Date(event.start_time);
      const dateKey = d.toLocaleDateString("en-CA");
      if (!map.has(dateKey)) map.set(dateKey, []);
      map.get(dateKey)!.push(event);
    }
    return map;
  }, [events]);

  // Fever dates from Impact API are unreliable — keep them out of date groups
  const allDateKeys = useMemo(() => Array.from(tmGroups.keys()).sort(), [tmGroups]);

  // Chunk feverEvents into groups of 6 for insertion between date groups
  const feverChunks = useMemo(() => {
    const chunks: FeverEvent[][] = [];
    for (let i = 0; i < feverEvents.length; i += 6) {
      chunks.push(feverEvents.slice(i, i + 6));
    }
    return chunks;
  }, [feverEvents]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">
      {/* Date-grouped Ticketmaster events, with Fever chunks inserted after every 3rd day */}
      {allDateKeys.map((dateKey, dayIndex) => {
        const dateEvents = tmGroups.get(dateKey) ?? [];
        const { label, sub } = formatDateHeader(dateKey);
        const active = getActive(dateKey);

        const availableCats = CATEGORIES.filter((cat) =>
          cat === "All" ? true : dateEvents.some((e) => e.description === cat)
        );

        const filtered = active === "All"
          ? dateEvents
          : dateEvents.filter((e) => e.description === active);

        // Insert a Fever chunk after every 3rd day (dayIndex 2, 5, 8…)
        const feverChunk = (dayIndex + 1) % 3 === 0 ? (feverChunks[Math.floor(dayIndex / 3)] ?? null) : null;

        return (
          <React.Fragment key={dateKey}>
            <div>
              <div className="flex items-baseline gap-3 mb-4">
                <h2 className="text-2xl font-bold">{label}</h2>
                {sub && <span className="text-sm text-slate-500">{sub}</span>}
              </div>

              {availableCats.length > 1 && (
                <div className="flex flex-wrap gap-2 mb-5">
                  {availableCats.map((cat) => {
                    const count = cat === "All"
                      ? dateEvents.length
                      : dateEvents.filter((e) => e.description === cat).length;
                    return (
                      <button
                        key={cat}
                        onClick={() => setActive(dateKey, cat)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                          active === cat
                            ? "bg-denver-amber text-slate-900"
                            : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber"
                        }`}
                      >
                        {cat} <span className="opacity-60 text-xs ml-0.5">{count}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((event) => (
                  <a
                    key={event.event_id}
                    href={ticketmasterAffiliateUrl(event.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 hover:border-denver-amber hover:shadow-md transition-all duration-200"
                  >
                    {event.image_url && (
                      <img
                        src={event.image_url}
                        alt={event.name}
                        className="w-16 h-16 object-cover rounded-lg shrink-0"
                        loading="lazy"
                      />
                    )}
                    <div className="flex flex-col gap-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold text-denver-amber">
                          {formatTime(event.start_time)}
                        </span>
                        {event.is_free && (
                          <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                            Free
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-sm leading-tight group-hover:text-denver-amber transition-colors line-clamp-2">
                        {event.name}
                      </h3>
                      {event.venue_name && (
                        <p className="text-xs text-slate-400 truncate">{event.venue_name}</p>
                      )}
                      {event.description && event.description !== "Undefined" && (
                        <span className="text-xs text-slate-500 mt-auto capitalize">{event.description}</span>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Fever experiences block — inserted after every 3rd day */}
            {feverChunk && (
              <div className="bg-denver-navy rounded-2xl p-6 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
                <div className="mb-2">
                  <h2 className="text-2xl font-bold text-white">Denver Experiences</h2>
                  <p className="text-sm text-white/60 mt-1">Bookable activities and adventures — check each listing for dates.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
                  {feverChunk.map((event) => (
                    <FeverCard key={event.event_id} event={event} />
                  ))}
                </div>
              </div>
            )}
          </React.Fragment>
        );
      })}

      {allDateKeys.length === 0 && feverEvents.length === 0 && (
        <p className="text-slate-400 text-center py-16">No upcoming events found.</p>
      )}
    </section>
  );
}

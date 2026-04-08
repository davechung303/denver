"use client";

import { useState, useMemo } from "react";
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
  const subcategories = event.subcategory?.split(",").map((s) => s.trim()).filter(Boolean) ?? [];
  return (
    <a
      href={event.url}
      target="_blank"
      rel="noopener noreferrer sponsored"
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
        {subcategories.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {subcategories.slice(0, 2).map((s) => (
              <span key={s} className="text-xs bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 rounded-full px-2 py-0.5">
                {s}
              </span>
            ))}
          </div>
        )}
        <h3 className="font-semibold text-sm leading-tight group-hover:text-denver-amber transition-colors line-clamp-2">
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
  const groups = useMemo(() => {
    const map = new Map<string, DenverEvent[]>();
    for (const event of events) {
      const d = new Date(event.start_time);
      const dateKey = d.toLocaleDateString("en-CA");
      if (!map.has(dateKey)) map.set(dateKey, []);
      map.get(dateKey)!.push(event);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [events]);

  // Group Fever events by next_date (YYYY-MM-DD)
  const feverByDate = useMemo(() => {
    const map = new Map<string, FeverEvent[]>();
    const unmatched: FeverEvent[] = [];
    for (const event of feverEvents) {
      if (!event.next_date) { unmatched.push(event); continue; }
      const dateKey = event.next_date.slice(0, 10);
      if (!map.has(dateKey)) map.set(dateKey, []);
      map.get(dateKey)!.push(event);
    }
    return { byDate: map, unmatched };
  }, [feverEvents]);

  // All date keys (union of TM dates + Fever dates), sorted
  const allDateKeys = useMemo(() => {
    const keys = new Set([
      ...groups.map(([k]) => k),
      ...feverByDate.byDate.keys(),
    ]);
    return Array.from(keys).sort();
  }, [groups, feverByDate]);

  const tmByDate = useMemo(() => new Map(groups), [groups]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">
      {allDateKeys.map((dateKey) => {
        const dateEvents = tmByDate.get(dateKey) ?? [];
        const dateFeverEvents = feverByDate.byDate.get(dateKey) ?? [];
        const { label, sub } = formatDateHeader(dateKey);
        const active = getActive(dateKey);

        const availableCats = CATEGORIES.filter((cat) =>
          cat === "All" ? true : dateEvents.some((e) => e.description === cat)
        );

        const filtered = active === "All"
          ? dateEvents
          : dateEvents.filter((e) => e.description === active);

        return (
          <div key={dateKey}>
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

            {filtered.length > 0 && (
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
            )}

            {dateFeverEvents.length > 0 && (
              <div className={filtered.length > 0 ? "mt-4" : ""}>
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">
                  Experiences & Shows
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dateFeverEvents.map((event) => (
                    <FeverCard key={event.event_id} event={event} />
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Fever events not matched to any specific date */}
      {feverByDate.unmatched.length > 0 && (
        <div>
          <div className="flex items-baseline gap-3 mb-4">
            <h2 className="text-2xl font-bold">More Experiences</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {feverByDate.unmatched.map((event) => (
              <FeverCard key={event.event_id} event={event} />
            ))}
          </div>
        </div>
      )}

      {allDateKeys.length === 0 && feverByDate.unmatched.length === 0 && (
        <p className="text-slate-400 text-center py-16">No upcoming events found.</p>
      )}
    </section>
  );
}

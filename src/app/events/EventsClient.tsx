"use client";

import { useState, useMemo } from "react";
import type { DenverEvent } from "@/lib/ticketmaster";
import { ticketmasterAffiliateUrl } from "@/lib/travelpayouts";

const CATEGORIES = ["All", "Music", "Arts & Theatre", "Sports", "Film"];

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatDateHeader(dateKey: string): { label: string; sub: string } {
  // Use noon local time to avoid UTC-offset date shifts
  const date = new Date(dateKey + "T12:00:00");
  const todayKey = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD in local time
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

interface Props {
  events: DenverEvent[];
}

export default function EventsClient({ events }: Props) {
  // Track active category independently per date group
  const [activeCategories, setActiveCategories] = useState<Record<string, string>>({});

  function getActive(dateKey: string) {
    return activeCategories[dateKey] ?? "All";
  }

  function setActive(dateKey: string, cat: string) {
    setActiveCategories((prev) => ({ ...prev, [dateKey]: cat }));
  }

  // Group events by local date (YYYY-MM-DD)
  const groups = useMemo(() => {
    const map = new Map<string, DenverEvent[]>();
    for (const event of events) {
      // Parse the date portion in local time to avoid UTC offset date shifts
      const d = new Date(event.start_time);
      const dateKey = d.toLocaleDateString("en-CA"); // YYYY-MM-DD
      if (!map.has(dateKey)) map.set(dateKey, []);
      map.get(dateKey)!.push(event);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [events]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">
      {groups.map(([dateKey, dateEvents]) => {
        const { label, sub } = formatDateHeader(dateKey);
        const active = getActive(dateKey);

        // Only show category tabs that have events on this date
        const availableCats = CATEGORIES.filter((cat) =>
          cat === "All" ? true : dateEvents.some((e) => e.description === cat)
        );

        const filtered = active === "All"
          ? dateEvents
          : dateEvents.filter((e) => e.description === active);

        return (
          <div key={dateKey}>
            {/* Date header */}
            <div className="flex items-baseline gap-3 mb-4">
              <h2 className="text-2xl font-bold">{label}</h2>
              {sub && <span className="text-sm text-slate-500">{sub}</span>}
            </div>

            {/* Per-date category filters */}
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

            {/* Events grid */}
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
        );
      })}

      {groups.length === 0 && (
        <p className="text-slate-400 text-center py-16">No upcoming events found.</p>
      )}
    </section>
  );
}

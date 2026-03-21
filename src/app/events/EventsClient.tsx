"use client";

import { useState } from "react";
import type { DenverEvent } from "@/lib/ticketmaster";

const PAGE_SIZE = 24;

const CATEGORIES = ["All", "Music", "Arts & Theatre", "Sports", "Film"];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

interface Props {
  events: DenverEvent[];
}

export default function EventsClient({ events }: Props) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [shown, setShown] = useState(PAGE_SIZE);

  const filtered = activeCategory === "All"
    ? events
    : events.filter((e) => e.description === activeCategory);

  const visible = filtered.slice(0, shown);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map((cat) => {
          const count = cat === "All" ? events.length : events.filter(e => e.description === cat).length;
          return (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setShown(PAGE_SIZE); }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-denver-amber text-slate-900"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber"
              }`}
            >
              {cat} <span className="opacity-60 text-xs ml-1">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Event grid */}
      {visible.length === 0 ? (
        <p className="text-slate-400 text-center py-16">No upcoming events in this category.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {visible.map((event) => (
              <a
                key={event.event_id}
                href={event.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 hover:border-denver-amber hover:shadow-md transition-all duration-200"
              >
                {event.image_url && (
                  <img
                    src={event.image_url}
                    alt={event.name}
                    className="w-20 h-20 object-cover rounded-lg shrink-0"
                    loading="lazy"
                  />
                )}
                <div className="flex flex-col gap-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold text-denver-amber uppercase tracking-wide">
                      {formatDate(event.start_time)}
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

          {shown < filtered.length && (
            <div className="mt-10 text-center">
              <button
                onClick={() => setShown((n) => n + PAGE_SIZE)}
                className="px-6 py-3 border border-slate-300 dark:border-slate-700 rounded-full text-sm font-semibold hover:border-denver-amber hover:text-denver-amber transition-colors"
              >
                Load more events ({filtered.length - shown} remaining)
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}

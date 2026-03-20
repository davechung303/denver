import type { DenverEvent } from "@/lib/eventbrite";

interface Props {
  event: DenverEvent;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function EventCard({ event }: Props) {
  return (
    <a
      href={event.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 hover:border-denver-amber hover:shadow-md transition-all duration-200"
    >
      {event.image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={event.image_url}
          alt={event.name}
          className="w-20 h-20 object-cover rounded-lg shrink-0"
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
      </div>
    </a>
  );
}

import type { DenverEvent } from "@/lib/ticketmaster";
import { ticketmasterAffiliateUrl } from "@/lib/travelpayouts";

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

// Parse "(16 and Over)" / "(18+)" / "(21 and Over)" out of event names
function parseAgeRestriction(name: string): { cleanName: string; age: string | null } {
  const match = name.match(/\s*\((\d+(?:\+|\s+and\s+(?:over|older|up)))\)/i);
  if (!match) return { cleanName: name, age: null };
  return { cleanName: name.replace(match[0], "").trim(), age: match[1] };
}

const GENRE_COLORS: Record<string, string> = {
  "Rock":             "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
  "Pop":              "bg-pink-50 text-pink-700 dark:bg-pink-950 dark:text-pink-300",
  "Hip-Hop/Rap":      "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
  "Dance/Electronic": "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
  "R&B":              "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
  "Country":          "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  "Jazz":             "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  "Classical":        "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  "Sports":           "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
};

function genreClass(genre: string | null): string {
  if (!genre) return "";
  return GENRE_COLORS[genre] ?? "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300";
}

export default function EventCard({ event }: Props) {
  const { cleanName, age } = parseAgeRestriction(event.name);
  const showGenre = event.genre && event.genre !== "Undefined" && event.genre !== "Other";
  const isRescheduled = event.status_code === "rescheduled";
  const isCancelled = event.status_code === "cancelled";

  return (
    <div className="relative group flex gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 hover:border-denver-amber hover:shadow-md transition-all duration-200">
      {/* Full-card Ticketmaster link (overlay) */}
      <a
        href={ticketmasterAffiliateUrl(event.url)}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute inset-0 rounded-xl"
        aria-label={cleanName}
      />

      {event.image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={event.image_url}
          alt={cleanName}
          className="w-20 h-20 object-cover rounded-lg shrink-0 relative z-10"
          loading="lazy"
        />
      )}
      <div className="flex flex-col gap-1 min-w-0 flex-1 relative z-10">
        {/* Date + badges row */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-denver-amber uppercase tracking-wide">
            {formatDate(event.start_time)}
          </span>
          {event.is_free && (
            <span className="text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300 px-1.5 py-0.5 rounded-full">
              Free
            </span>
          )}
          {isRescheduled && (
            <span className="text-xs font-semibold bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300 px-1.5 py-0.5 rounded-full">
              Rescheduled
            </span>
          )}
          {isCancelled && (
            <span className="text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 px-1.5 py-0.5 rounded-full">
              Cancelled
            </span>
          )}
          {age && (
            <span className="text-xs font-medium text-slate-400 px-1.5 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
              {age}
            </span>
          )}
        </div>

        {/* Event name */}
        <h3 className="font-semibold text-sm leading-tight group-hover:text-denver-amber transition-colors line-clamp-2">
          {cleanName}
        </h3>

        {/* Genre + venue + Spotify row */}
        <div className="flex items-center gap-2 flex-wrap mt-0.5">
          {showGenre && (
            <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${genreClass(event.genre)}`}>
              {event.genre}
            </span>
          )}
          {event.venue_name && !showGenre && (
            <p className="text-xs text-slate-400 truncate">{event.venue_name}</p>
          )}
          {event.min_price != null && (
            <span className="text-xs text-slate-400">From ${Math.round(event.min_price)}</span>
          )}
          {event.spotify_url && (
            <a
              href={event.spotify_url}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-20 ml-auto shrink-0 flex items-center gap-1 text-xs text-[#1DB954] hover:opacity-80 transition-opacity"
              title={`Listen to ${event.artist_name ?? cleanName} on Spotify`}
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
              Spotify
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

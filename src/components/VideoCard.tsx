import { watchUrl } from "@/lib/youtube";
import type { Video } from "@/lib/youtube";

interface Props {
  video: Video;
  neighborhood?: string;
  category?: string;
}

function formatViews(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M views`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K views`;
  return `${count} views`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short" });
}

export default function VideoCard({ video, neighborhood, category }: Props) {
  return (
    <a
      href={watchUrl(video.video_id)}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-denver-amber transition-colors bg-white dark:bg-slate-900"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-slate-100 dark:bg-slate-800 overflow-hidden">
        {video.thumbnail_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={video.thumbnail_url}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-12 h-12 text-slate-300" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        )}
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
          <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center">
            <svg className="w-6 h-6 text-slate-900 ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-1.5">
        {(neighborhood || category) && (
          <p className="text-xs font-medium text-denver-amber uppercase tracking-wide">
            {[neighborhood, category].filter(Boolean).join(" · ")}
          </p>
        )}
        <h3 className="text-sm font-semibold leading-snug line-clamp-2 group-hover:text-denver-amber transition-colors">
          {video.title}
        </h3>
        <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
          {video.view_count && <span>{formatViews(video.view_count)}</span>}
          {video.view_count && video.published_at && <span>·</span>}
          {video.published_at && <span>{formatDate(video.published_at)}</span>}
        </div>
      </div>
    </a>
  );
}

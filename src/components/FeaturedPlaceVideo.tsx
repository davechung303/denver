import YouTubeLite from "@/components/YouTubeLite";
import type { PlaceVideo } from "@/lib/placeVideos";

function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "America/Denver" });
}

/**
 * The video Dave made about this place, shown near the top of the place page
 * with a take written from what he says in it. Shorts get a vertical player
 * beside the take; long videos get a 16:9 player above it.
 */
export default function FeaturedPlaceVideo({
  placeName,
  video,
  others,
}: {
  placeName: string;
  video: PlaceVideo;
  others: PlaceVideo[];
}) {
  const take = video.take;
  const filmed = formatDate(video.published_at);

  const player = (
    <div
      className={
        video.isShort
          ? "aspect-[9/16] w-full max-w-[260px] mx-auto sm:mx-0 rounded-xl overflow-hidden bg-black shadow-sm"
          : "aspect-video w-full rounded-xl overflow-hidden bg-black shadow-sm"
      }
    >
      <YouTubeLite videoId={video.video_id} title={video.title} priority />
    </div>
  );

  const text = (
    <div className="space-y-4 min-w-0">
      <div>
        <p className="kicker mb-1">From my video{filmed ? ` · ${filmed}` : ""}</p>
        <h2 className="text-2xl font-bold leading-tight">My take on {placeName}</h2>
      </div>

      {take ? (
        <>
          <p className="text-lg leading-relaxed text-slate-800 dark:text-slate-100" data-speakable>
            {take.summary}
          </p>

          {take.ordered.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-2">What I tried</h3>
              <ul className="flex flex-wrap gap-2">
                {take.ordered.map((item) => (
                  <li key={item} className="text-sm px-3 py-1 rounded-full border border-slate-300 dark:border-slate-700">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {take.verdict && (
            <p className="font-medium text-slate-900 dark:text-white">
              <span className="text-denver-amber">Bottom line:</span> {take.verdict}
            </p>
          )}

          {take.skip_if && (
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <strong className="font-semibold">Skip it if</strong> {take.skip_if.replace(/^skip it if\s*/i, "")}
            </p>
          )}
        </>
      ) : (
        <p className="text-lg leading-relaxed text-slate-800 dark:text-slate-100">{video.title}</p>
      )}

      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
        {take
          ? "Written from what I said in this video, so it reflects the day I filmed. Menus and prices change — check before you go. "
          : null}
        <a
          href={`https://www.youtube.com/watch?v=${video.video_id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-denver-amber transition-colors"
        >
          Watch on YouTube
        </a>
      </p>

      {others.length > 0 && (
        <div className="pt-3 border-t border-rule dark:border-white/10">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">{`${placeName} also shows up in:`}</p>
          <ul className="space-y-1">
            {others.map((o) => (
              <li key={o.video_id}>
                <a
                  href={`https://www.youtube.com/watch?v=${o.video_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium underline hover:text-denver-amber transition-colors"
                >
                  {o.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  return (
    <section aria-label={`Dave's video about ${placeName}`} className="rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6">
      {video.isShort ? (
        <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,240px)_1fr] gap-6 items-start">
          {player}
          {text}
        </div>
      ) : (
        <div className="space-y-5">
          {player}
          {text}
        </div>
      )}
    </section>
  );
}

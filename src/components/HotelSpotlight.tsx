import Link from "next/link";
import { photoUrl, type Place } from "@/lib/places";
import { expediaDenverHotelsUrl } from "@/lib/travelpayouts";

// Big, image-forward hotel cards dropped inline between sections. The guides
// were walls of text with the only photography 2,000 words down in the booking
// module; this puts the rooms next to the paragraph that argues for them.
export default function HotelSpotlight({
  places,
  heading,
  note,
}: {
  places: Place[];
  heading?: string;
  note?: string;
}) {
  if (places.length === 0) return null;
  return (
    <div className="mt-8">
      {heading && <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">{heading}</h3>}
      {note && <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">{note}</p>}
      <div className={`grid gap-4 ${places.length === 1 ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"}`}>
        {places.map((p) => {
          const detailHref = `/denver/${p.neighborhood_slug}/hotels/${p.slug}`;
          const bookHref = p.expedia_affiliate_url ?? expediaDenverHotelsUrl();
          const photo = p.photos?.[0];
          return (
            <div
              key={p.place_id}
              className="group overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-denver-amber hover:shadow-lg transition-all duration-200"
            >
              <Link href={detailHref} className="block relative aspect-[16/10] bg-slate-100 dark:bg-slate-800 overflow-hidden">
                {photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={photoUrl(photo)}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-200 dark:bg-slate-700" />
                )}
                {p.rating && (
                  <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-black/70 backdrop-blur px-2.5 py-1 text-xs font-semibold text-white">
                    ★ {p.rating.toFixed(1)}
                    {p.review_count ? <span className="font-normal text-white/70">({p.review_count.toLocaleString()})</span> : null}
                  </span>
                )}
              </Link>
              <div className="p-4">
                <Link href={detailHref} className="font-bold leading-snug hover:text-denver-amber transition-colors line-clamp-2">
                  {p.name}
                </Link>
                {p.review_summary?.tagline && (
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2 first-letter:uppercase">
                    {p.review_summary.tagline}
                  </p>
                )}
                <div className="mt-3 flex items-center gap-2">
                  <a
                    href={bookHref}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="inline-flex items-center justify-center rounded-full bg-denver-amber px-4 py-2 text-sm font-semibold text-white hover:bg-amber-500 transition-colors"
                  >
                    Check rates &rarr;
                  </a>
                  <Link
                    href={detailHref}
                    className="inline-flex items-center text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-denver-amber transition-colors px-2"
                  >
                    Details
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

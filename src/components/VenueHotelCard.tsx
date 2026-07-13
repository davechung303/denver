import Link from "next/link";
import { photoUrl, type Place } from "@/lib/places";
import { expediaDenverHotelsUrl } from "@/lib/travelpayouts";

// Card used on the /hotels/near-* venue pages. The hotel name + image link to the
// internal detail page (/denver/<neighborhood>/hotels/<slug>) — passing relevance and
// link equity to the detail pages, which rank far better than the venue hubs — while the
// "Book on Expedia" button keeps the affiliate conversion path intact.
export default function VenueHotelCard({ place }: { place: Place }) {
  const detailHref = `/denver/${place.neighborhood_slug}/hotels/${place.slug}`;
  const bookHref = place.expedia_affiliate_url ?? expediaDenverHotelsUrl();
  const photo = place.photos?.[0];
  return (
    <div className="group flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 hover:border-denver-amber hover:shadow-md transition-all duration-200">
      <Link href={detailHref} className="relative w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800" aria-label={place.name}>
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photoUrl(photo)} alt={place.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
        ) : (
          <div className="w-full h-full bg-slate-200 dark:bg-slate-700" />
        )}
      </Link>
      <div className="flex flex-col justify-center gap-0.5 min-w-0 flex-1">
        <Link href={detailHref} className="font-semibold text-sm leading-snug hover:text-denver-amber transition-colors line-clamp-2">
          {place.name}
        </Link>
        {place.rating && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-500">
            ★ {place.rating.toFixed(1)}
            {place.review_count && <span className="text-slate-400 font-normal">({place.review_count.toLocaleString()})</span>}
          </span>
        )}
        <a href={bookHref} target="_blank" rel="noopener noreferrer sponsored" className="text-xs text-denver-amber font-medium hover:underline w-fit">
          Book on Expedia &rarr;
        </a>
      </div>
    </div>
  );
}

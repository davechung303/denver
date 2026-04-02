import Link from "next/link";
import type { Place } from "@/lib/places";
import { photoUrl } from "@/lib/places";
import { expediaDenverHotelsUrl } from "@/lib/travelpayouts";

interface Props {
  place: Place;
  neighborhoodSlug: string;
  categorySlug: string;
  tag?: string | null;
}

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={`w-3.5 h-3.5 ${i <= full ? "text-amber-400" : i === full + 1 && half ? "text-amber-400" : "text-slate-300"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
}

function PriceLevel({ level }: { level: number }) {
  return (
    <span className="text-xs text-slate-500">
      {"$".repeat(level)}
      <span className="text-slate-300">{"$".repeat(4 - level)}</span>
    </span>
  );
}

export default function PlaceCard({ place, neighborhoodSlug, categorySlug, tag }: Props) {
  const photo = place.photos?.[0];
  const isOpen = place.hours?.openNow;

  return (
    <Link
      href={`/denver/${neighborhoodSlug}/${categorySlug}/${place.slug}`}
      className="group flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:border-denver-amber hover:shadow-lg transition-all duration-200"
    >
      {/* Photo */}
      <div className="aspect-video bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photoUrl(photo.name)}
            alt={place.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-slate-300 dark:text-slate-600 text-sm">No photo</span>
          </div>
        )}
        {/* Cuisine/type tag */}
        {tag && (
          <span className="absolute bottom-3 left-3 bg-black/60 text-white text-xs font-semibold px-2 py-0.5 rounded-full backdrop-blur-sm">
            {tag}
          </span>
        )}
        {/* Open/closed badge */}
        {place.hours && (
          <span
            className={`absolute top-3 right-3 text-xs font-semibold px-2 py-0.5 rounded-full ${
              isOpen
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-600"
            }`}
          >
            {isOpen ? "Open" : "Closed"}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="font-semibold text-base leading-tight group-hover:text-denver-amber transition-colors line-clamp-1">
          {place.name}
        </h3>

        {/* Rating row */}
        {place.rating && (
          <div className="flex items-center gap-2">
            <StarRating rating={place.rating} />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {place.rating.toFixed(1)}
            </span>
            {place.review_count && (
              <span className="text-xs text-slate-400">
                ({place.review_count.toLocaleString()})
              </span>
            )}
            {place.price_level != null && place.price_level > 0 && (
              <>
                <span className="text-slate-300">·</span>
                <PriceLevel level={place.price_level} />
              </>
            )}
          </div>
        )}

        {/* Address */}
        {place.address && (
          <p className="text-xs text-slate-500 line-clamp-1">{place.address}</p>
        )}

        {/* Hotel booking CTA — opens Expedia, stops card navigation */}
        {categorySlug === "hotels" && (
          <div className="mt-auto pt-3">
            <a
              href={expediaDenverHotelsUrl()}
              target="_blank"
              rel="noopener noreferrer sponsored"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center justify-center w-full px-4 py-2 bg-denver-amber text-slate-900 text-sm font-semibold rounded-xl hover:bg-amber-400 transition-colors"
            >
              Check Availability on Expedia
            </a>
          </div>
        )}
      </div>
    </Link>
  );
}

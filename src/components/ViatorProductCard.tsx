import { getViatorThumbnail, formatViatorDuration, viatorBookingUrl, type ViatorProduct } from "@/lib/viator";

export default function ViatorProductCard({ product }: { product: ViatorProduct }) {
  const thumbnail = getViatorThumbnail(product);
  const duration = formatViatorDuration(product.duration);
  const price = product.pricing?.summary.fromPrice;
  const rating = product.reviews?.combinedAverageRating;
  const reviewCount = product.reviews?.totalReviews;
  const bookingUrl = viatorBookingUrl(product.productCode);

  return (
    <a
      href={bookingUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:border-denver-amber hover:shadow-lg transition-all duration-200"
    >
      {/* Thumbnail */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800">
        {thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnail}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-slate-200 dark:bg-slate-700" />
        )}
        {duration && (
          <span className="absolute bottom-2 left-2 bg-black/60 text-white text-xs font-medium px-2 py-1 rounded-md">
            {duration}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="font-semibold text-sm leading-snug line-clamp-2 text-slate-900 dark:text-slate-100 group-hover:text-denver-amber transition-colors">
          {product.title}
        </h3>

        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-auto pt-2">
          {rating && (
            <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
              <span className="text-denver-amber">★</span>
              {rating.toFixed(1)}
              {reviewCount && <span className="font-normal text-slate-400">({reviewCount.toLocaleString()})</span>}
            </span>
          )}
          {price && (
            <span className="ml-auto font-semibold text-slate-800 dark:text-slate-200">
              From ${price}
            </span>
          )}
        </div>
      </div>
    </a>
  );
}

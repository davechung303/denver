import Link from "next/link";
import { photoUrl, type Place } from "@/lib/places";
import { bookingCta } from "@/lib/travelpayouts";

// Card used on the /hotels/near-* venue pages. The hotel name + image link to the
// internal detail page (/denver/<neighborhood>/hotels/<slug>) — passing relevance and
// link equity to the detail pages, which rank far better than the venue hubs — while the
// "Book on Expedia" button keeps the affiliate conversion path intact.
export default function VenueHotelCard({ place }: { place: Place }) {
  const detailHref = `/denver/${place.neighborhood_slug}/hotels/${place.slug}`;
  const cta = bookingCta(place);
  const photo = place.photos?.[0];
  return (
    <div className="hotel-mini">
      <Link href={detailHref} className="thumb" aria-hidden="true" tabIndex={-1}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {photo && <img src={photoUrl(photo)} alt="" loading="lazy" decoding="async" width={56} height={56} />}
      </Link>
      <div className="body">
        <Link href={detailHref} className="name hover:text-denver-amber">
          {place.name}
        </Link>
        {place.rating != null && (
          <span className="rating">
            <span className="star">★</span> {place.rating.toFixed(1)}
            {place.review_count ? <span className="muted"> ({place.review_count.toLocaleString()})</span> : null}
          </span>
        )}
        <a href={cta.href} target="_blank" rel={cta.rel} className="cta">
          {cta.kind === "direct" ? "Visit hotel site" : cta.kind === "search" ? "Compare Denver hotels" : "Book on Expedia"} &rarr;
        </a>
      </div>
    </div>
  );
}

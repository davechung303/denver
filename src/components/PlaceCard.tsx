import Link from "next/link";
import type { Place } from "@/lib/places";
import { photoUrl } from "@/lib/places";
import { bookingCta } from "@/lib/travelpayouts";

interface Props {
  place: Place;
  neighborhoodSlug: string;
  categorySlug: string;
  tag?: string | null;
  /** Shows a #1–#5 badge on the photo (Top Local Picks). */
  rank?: number;
}

export default function PlaceCard({ place, neighborhoodSlug, categorySlug, tag, rank }: Props) {
  // Link to the place's own canonical URL (the one in the sitemap). The page's
  // URL can differ: subcategory pages pass the base category, and compound
  // slugs like "restaurants-mexican_restaurant" would otherwise cost a 301 hop.
  const href = `/denver/${place.neighborhood_slug || neighborhoodSlug}/${place.category_slug || categorySlug}/${place.slug}`;
  const photo = place.photos?.[0];
  const isHotel = categorySlug === "hotels";
  const cta = bookingCta(place);

  // Markup kept deliberately small: a category page renders 100+ of these and
  // every element is shipped twice (HTML + RSC payload). Styling lives in
  // globals.css (.place-card). The old five-SVG star row was ~2 KB per card.
  //
  // No "Open/Closed" badge: hours.openNow is whatever Google said when the row
  // was cached, and these pages are cached for a day, so the badge was wrong
  // for much of the time it was shown.
  return (
    <div className="place-card group">
      <Link href={href} className="place-card-link">
        <div className="place-card-photo">
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photoUrl(photo)} alt={place.name} loading="lazy" decoding="async" />
          ) : null}
          {rank != null && <span className="place-card-rank">#{rank}</span>}
          {tag && <span className="place-card-tag">{tag}</span>}
        </div>
        <div className="place-card-body">
          <h3 className="place-card-name">{place.name}</h3>
          {place.rating != null && (
            <p className="place-card-meta">
              <span className="star">★</span> {place.rating.toFixed(1)}
              {place.review_count ? <span className="muted"> ({place.review_count.toLocaleString()})</span> : null}
              {place.price_level ? <span className="muted"> · {"$".repeat(place.price_level)}</span> : null}
            </p>
          )}
          {place.address && <p className="place-card-addr">{place.address}</p>}
          {place.review_summary?.tagline && (
            <p className="place-card-known">
              Known for: {place.review_summary.tagline.charAt(0).toUpperCase() + place.review_summary.tagline.slice(1)}
            </p>
          )}
        </div>
      </Link>
      {/* Hotel CTA sits outside the card link to avoid nested anchors. */}
      {isHotel && (
        <a href={cta.href} target="_blank" rel={cta.rel} className="place-card-cta">
          {cta.label}
        </a>
      )}
    </div>
  );
}

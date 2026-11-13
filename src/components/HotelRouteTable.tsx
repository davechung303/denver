import Link from "next/link";
import { bookingCta } from "@/lib/travelpayouts";
import { photoUrl, type Place } from "@/lib/places";

export interface RouteRow {
  place: Place;
  /** Headline figure, e.g. "7 min". */
  primary: string;
  /** Secondary figure, e.g. "0.35 mi". */
  secondary: string;
}

/**
 * One band of a hotel distance table (walk or drive).
 *
 * Shared by VenueDistanceTable and VenueDriveTable, which used to carry two
 * copies of the same row markup. Styling lives in globals.css (.data-table),
 * so each row ships a handful of short class names instead of ~1 KB of
 * utilities — twice, once in the HTML and once in the RSC payload.
 *
 * Thumbnails render only where `thumbs` is true (the closest band), because a
 * 48-photo table was most of the Red Rocks page's weight and the photo stops
 * helping once you're scanning numbers.
 */
export default function HotelRouteTable({
  rows,
  primaryLabel,
  secondaryLabel,
  thumbs = false,
}: {
  rows: RouteRow[];
  primaryLabel: string;
  secondaryLabel: string;
  thumbs?: boolean;
}) {
  return (
    <div className="data-table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>Hotel</th>
            <th>{primaryLabel}</th>
            <th>{secondaryLabel}</th>
            <th>Rating</th>
            <th>Rates</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ place, primary, secondary }) => {
            const href = `/denver/${place.neighborhood_slug}/hotels/${place.slug}`;
            const cta = bookingCta(place);
            return (
              <tr key={place.place_id}>
                <td>
                  <div className="hotel-cell">
                    {thumbs && (
                      <Link href={href} aria-hidden="true" tabIndex={-1} className="thumb">
                        {place.photos?.[0] && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={photoUrl(place.photos[0])} alt="" loading="lazy" decoding="async" width={48} height={48} />
                        )}
                      </Link>
                    )}
                    <div className="min-w-0">
                      <Link href={href} className="hotel-name">
                        {place.name}
                      </Link>
                      {place.review_summary?.tagline && <p className="tagline">{place.review_summary.tagline}</p>}
                    </div>
                  </div>
                </td>
                <td className="num font-semibold">{primary}</td>
                <td className="num muted">{secondary}</td>
                <td className="muted">{place.rating ? `★ ${place.rating.toFixed(1)}` : "—"}</td>
                <td>
                  <a href={cta.href} target="_blank" rel={cta.rel} className="rate-chip">
                    {cta.kind === "search" ? "Compare rates" : "Check rates"} &rarr;
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

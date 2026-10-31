// Expedia Creator affiliate short links
// Home / general landing page
const EXPEDIA_HOME = "https://expedia.com/affiliates/expedia-home.NcNzYg5";
// Flights search (pre-filled for Denver)
const EXPEDIA_FLIGHTS = "https://expedia.com/affiliates/expedia-home.6ch6qO8";
// Hotel search — Denver area
const EXPEDIA_HOTELS_DENVER = "https://expedia.com/affiliates/hotel-search-denver.unRLn22";

// Wrap a Ticketmaster event URL with the Impact affiliate link
const TM_AFFILIATE_BASE = "https://ticketmaster.evyy.net/c/3433500/264167/4272?u=";

export function ticketmasterAffiliateUrl(url: string | null): string | undefined {
  if (!url) return undefined;
  return TM_AFFILIATE_BASE + encodeURIComponent(url);
}

// Hotel CTAs — links to Expedia Denver hotel search
export function expediaHotelUrl(_hotelName?: string): string {
  return EXPEDIA_HOTELS_DENVER;
}

export function expediaDenverHotelsUrl(_area?: string): string {
  return EXPEDIA_HOTELS_DENVER;
}

// Flights to Denver
export function expediaFlightsToDenverUrl(): string {
  return EXPEDIA_FLIGHTS;
}

// General Expedia home (for homepage widgets etc.)
export function expediaHomeUrl(): string {
  return EXPEDIA_HOME;
}

export type BookingCta = {
  href: string;
  kind: "expedia" | "direct" | "search";
  /** Button label, where there is room for one. */
  label: string;
  /** Compact label for chips and table cells. */
  short: string;
  /** Affiliate links must carry rel=sponsored; a hotel's own site must not. */
  rel: string;
};

const SPONSORED = "noopener noreferrer sponsored";

/**
 * The booking CTA for one specific hotel.
 *
 * About a fifth of the hotels we carry are not on Expedia at all, and every
 * per-property CTA used to be `expedia_affiliate_url ?? expediaDenverHotelsUrl()`
 * — so a reader who clicked "Reserve on Expedia" on a named hotel landed on a
 * city-wide search box. That is a promise the click cannot keep, and a confused
 * click converts worse than an honest one.
 *
 * So: deep link where we have one, the hotel's own site where we don't, and a
 * plainly-labelled Denver search only when we have neither.
 */
export function bookingCta(place: {
  expedia_affiliate_url?: string | null;
  website?: string | null;
}): BookingCta {
  if (place.expedia_affiliate_url) {
    return { href: place.expedia_affiliate_url, kind: "expedia", label: "Reserve on Expedia", short: "Book", rel: SPONSORED };
  }
  if (place.website) {
    return { href: place.website, kind: "direct", label: "Visit hotel site", short: "Site", rel: "noopener noreferrer" };
  }
  return { href: EXPEDIA_HOTELS_DENVER, kind: "search", label: "Compare Denver hotels", short: "Compare", rel: SPONSORED };
}

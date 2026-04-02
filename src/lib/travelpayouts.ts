// Expedia Creator affiliate short links
// Home / general landing page
const EXPEDIA_HOME = "https://expedia.com/affiliates/expedia-home.NcNzYg5";
// Flights search (pre-filled for Denver)
const EXPEDIA_FLIGHTS = "https://expedia.com/affiliates/expedia-home.6ch6qO8";
// Hotel search — Denver area
const EXPEDIA_HOTELS_DENVER = "https://expedia.com/affiliates/hotel-search-denver.7MjEKrC";

// ZenHotels via Impact affiliate program
// Base link redirects to ZenHotels homepage with affiliate tracking — no deep link needed
const ZEN_AFFILIATE_BASE = "https://emergingtravelinc.pxf.io/7XXqW5";

export function zenhotelsUrl(_destination?: string): string {
  return ZEN_AFFILIATE_BASE;
}

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

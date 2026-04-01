// Expedia Creator affiliate params
const EXPEDIA_AFFCID = "US.DIRECT.PHG.1011l422631.0";
const EXPEDIA_AFFLID = "1110l34nmQjG";

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

// Hotel detail page CTA — Expedia resolves destination as a location, not a property name,
// so we use the Denver area search (regionId=996) for reliable results
export function expediaHotelUrl(_hotelName?: string): string {
  return expediaDenverHotelsUrl();
}

// Search all hotels in Denver or a specific neighborhood — uses regionId for city-level results
export function expediaDenverHotelsUrl(area = "Denver, Colorado"): string {
  const params = new URLSearchParams({
    destination: area,
    regionId: "996",
    sort: "RECOMMENDED",
    affcid: EXPEDIA_AFFCID,
    afflid: EXPEDIA_AFFLID,
    clickref: EXPEDIA_AFFLID,
    my_ad: `AFF.US.DIRECT.PHG.1011l422631.0`,
  });
  return `https://www.expedia.com/Hotel-Search?${params}`;
}

// Generate an Expedia flights-to-Denver search URL (no origin — user picks their city)
export function expediaFlightsToDenverUrl(): string {
  const params = new URLSearchParams({
    trip: "roundtrip",
    leg1: "from:anywhere,to:DEN",
    passengers: "adults:1",
    options: "cabinclass:economy",
    affcid: EXPEDIA_AFFCID,
    afflid: EXPEDIA_AFFLID,
    clickref: EXPEDIA_AFFLID,
    my_ad: `AFF.US.DIRECT.PHG.1011l422631.0`,
  });
  return `https://www.expedia.com/Flights-Search?${params}`;
}

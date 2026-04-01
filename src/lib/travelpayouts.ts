// Expedia Creator affiliate params
const EXPEDIA_AFFCID = "US.DIRECT.PHG.1011l422631.0";
const EXPEDIA_AFFLID = "1110l34nmQjG";

// Generate a ZenHotels search URL via the Impact affiliate program
// Deep link format: base?u=<encoded ZenHotels search URL>
// TODO: if/when ZenHotels B2B API credentials are available, replace with real-time pricing
const ZEN_AFFILIATE_BASE = "https://emergingtravelinc.pxf.io/7XXqW5";

export function zenhotelsUrl(destination: string): string {
  const searchUrl = `https://www.zenhotels.com/hotels/#destination=${encodeURIComponent(destination)}&adults=2`;
  return `${ZEN_AFFILIATE_BASE}?u=${encodeURIComponent(searchUrl)}`;
}

// Wrap a Ticketmaster event URL with the Impact affiliate link
const TM_AFFILIATE_BASE = "https://ticketmaster.evyy.net/c/3433500/264167/4272?u=";

export function ticketmasterAffiliateUrl(url: string | null): string | undefined {
  if (!url) return undefined;
  return TM_AFFILIATE_BASE + encodeURIComponent(url);
}

// Generate an Expedia hotel search URL with your Creator affiliate tags
export function expediaHotelUrl(hotelName: string): string {
  const params = new URLSearchParams({
    destination: hotelName,
    regionId: "996", // Denver, CO
    sort: "RECOMMENDED",
    affcid: EXPEDIA_AFFCID,
    afflid: EXPEDIA_AFFLID,
    clickref: EXPEDIA_AFFLID,
    my_ad: `AFF.US.DIRECT.PHG.1011l422631.0`,
  });
  return `https://www.expedia.com/Hotel-Search?${params}`;
}

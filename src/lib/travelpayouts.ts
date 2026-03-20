const MARKER = process.env.TRAVELPAYOUTS_TOKEN ?? "d14878a954670fad9a5ba2c38d4f833c";

// Expedia Creator affiliate params
const EXPEDIA_AFFCID = "US.DIRECT.PHG.1011l422631.0";
const EXPEDIA_AFFLID = "1110l34nmQjG";

// Generate a Travelpayouts hotel search affiliate link for a given hotel name
export function hotelSearchUrl(hotelName: string, city = "Denver"): string {
  const query = encodeURIComponent(`${hotelName} ${city}`);
  return `https://tp.media/r?marker=${MARKER}&trs=233738&p=4114&u=https%3A%2F%2Fwww.booking.com%2Fsearch.html%3Fss%3D${query}`;
}

// Generate a Travelpayouts direct hotel link from a Booking.com URL
export function affiliateUrl(directUrl: string): string {
  if (!directUrl) return "";
  const encoded = encodeURIComponent(directUrl);
  return `https://tp.media/r?marker=${MARKER}&trs=233738&p=4114&u=${encoded}`;
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

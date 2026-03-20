const MARKER = process.env.TRAVELPAYOUTS_TOKEN ?? "d14878a954670fad9a5ba2c38d4f833c";

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

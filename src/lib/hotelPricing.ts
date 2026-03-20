const TOKEN = process.env.TRAVELPAYOUTS_TOKEN ?? "d14878a954670fad9a5ba2c38d4f833c";
const BASE = "https://engine.hotellook.com/api/v2";

// Find the Hotellook hotel ID by name. Returns null if not found.
export async function lookupHotelId(name: string, city = "Denver"): Promise<string | null> {
  const query = encodeURIComponent(`${name} ${city}`);
  try {
    const res = await fetch(
      `${BASE}/lookup.json?query=${query}&lang=en&lookFor=hotel&limit=1&token=${TOKEN}`
    );
    if (!res.ok) return null;
    const data = await res.json();
    const hotel = data.results?.hotels?.[0];
    return hotel?.id ? String(hotel.id) : null;
  } catch {
    return null;
  }
}

// Get the minimum nightly price for a hotel (2 weeks out, 1 night, 2 adults).
// Returns null if not available in cache.
export async function getHotelMinPrice(hotelId: string): Promise<number | null> {
  const checkIn = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
  const checkOut = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);
  const fmt = (d: Date) => d.toISOString().split("T")[0];

  try {
    const res = await fetch(
      `${BASE}/cache.json?hotelIds=${hotelId}&checkIn=${fmt(checkIn)}&checkOut=${fmt(checkOut)}&currency=usd&token=${TOKEN}&adults=2&limit=1`
    );
    if (!res.ok) return null;
    const data = await res.json();
    const prices: { priceFrom: number }[] = data[hotelId] ?? [];
    if (prices.length === 0) return null;
    return Math.min(...prices.map((p) => p.priceFrom));
  } catch {
    return null;
  }
}

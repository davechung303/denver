const VIATOR_API_KEY = process.env.VIATOR_API_KEY!;
const VIATOR_BASE = "https://api.viator.com/partner";
const PARTNER_ID = "P00295470";

export interface ViatorProduct {
  productCode: string;
  title: string;
  description: string;
  duration?: { fixedDurationInMinutes?: number; variableDurationFromMinutes?: number; variableDurationToMinutes?: number };
  images: Array<{ variants: Array<{ url: string; width: number; height: number }> }>;
  pricing?: { summary: { fromPrice: number; fromPriceBeforeDiscount?: number }; currency: string };
  reviews?: { combinedAverageRating: number; totalReviews: number };
  productUrl?: string;
  tags?: number[];
  flags?: string[];
}

export interface ViatorSearchResponse {
  products?: {
    results: ViatorProduct[];
    totalCount: number;
  };
}

// Search Viator products by freetext
export async function searchViatorProducts(
  searchTerm: string,
  limit = 8
): Promise<ViatorProduct[]> {
  try {
    const res = await fetch(`${VIATOR_BASE}/search/freetext`, {
      method: "POST",
      headers: {
        "exp-api-key": VIATOR_API_KEY,
        "Accept-Language": "en-US",
        "Content-Type": "application/json",
        Accept: "application/json;version=2.0",
      },
      body: JSON.stringify({
        searchTerm,
        searchTypes: [
          {
            searchType: "PRODUCTS",
            pagination: { offset: 0, limit },
          },
        ],
        currency: "USD",
        language: "en",
      }),
      next: { revalidate: 86400 }, // cache 24h
    });

    if (!res.ok) {
      console.error("Viator API error:", res.status, await res.text());
      return [];
    }

    const json: ViatorSearchResponse = await res.json();
    return json.products?.results ?? [];
  } catch (e) {
    console.error("Viator fetch error:", e);
    return [];
  }
}

// Get the best thumbnail from a product
export function getViatorThumbnail(product: ViatorProduct): string | null {
  const variants = product.images?.[0]?.variants ?? [];
  // Prefer ~400px wide images
  const sorted = [...variants].sort((a, b) => Math.abs(a.width - 400) - Math.abs(b.width - 400));
  return sorted[0]?.url ?? null;
}

// Format duration into readable string
export function formatViatorDuration(duration?: ViatorProduct["duration"]): string | null {
  if (!duration) return null;
  if (duration.fixedDurationInMinutes) {
    const h = Math.floor(duration.fixedDurationInMinutes / 60);
    const m = duration.fixedDurationInMinutes % 60;
    if (h === 0) return `${m}min`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}min`;
  }
  if (duration.variableDurationFromMinutes && duration.variableDurationToMinutes) {
    const from = Math.round(duration.variableDurationFromMinutes / 60);
    const to = Math.round(duration.variableDurationToMinutes / 60);
    return `${from}–${to}h`;
  }
  return null;
}

// Build the affiliate booking URL
export function viatorBookingUrl(productCode: string): string {
  return `https://www.viator.com/tours/${productCode}?pid=${PARTNER_ID}&mcid=42383&medium=api`;
}

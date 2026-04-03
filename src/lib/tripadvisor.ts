const TA_API_KEY = process.env.TRIPADVISOR_API_KEY!;
const TA_BASE = "https://api.content.tripadvisor.com/api/v1";

export interface TALocationDetails {
  location_id: string;
  name: string;
  rating?: number;
  num_reviews?: number;
  ranking_data?: {
    ranking_string: string; // "#3 of 1,842 Restaurants in Denver"
    ranking: number;        // 3
    geo_location_name: string;
  };
  awards?: Array<{
    award_type: string;   // "Travelers_Choice" | "Travelers_Choice_Best_of_Best"
    year: string;
    display_name: string; // "Travelers' Choice"
  }>;
  trip_types?: Array<{
    name: string;         // "Business" | "Couples" | "Solo travel" | "Family" | "Friends getaway"
    value: string;        // "24" (percentage)
    localized_name: string;
  }>;
  subratings?: Record<string, {
    name: string;
    rating_image_url: string;
    value: string; // "4.5"
    localized_name: string;
  }>;
  cuisine?: Array<{ name: string; localized_name: string }>;
  address_obj?: {
    street1?: string;
    city?: string;
    state?: string;
    country?: string;
  };
  web_url?: string;
}

export interface TANearbyResult {
  location_id: string;
  name: string;
  distance: string;
  address_obj?: {
    street1?: string;
    city?: string;
  };
}

// Fetch location details for a known location_id
export async function getTALocationDetails(locationId: string): Promise<TALocationDetails | null> {
  const url = `${TA_BASE}/location/${locationId}/details?key=${TA_API_KEY}&language=en&currency=USD`;
  try {
    const res = await fetch(url, { next: { revalidate: 0 } });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// Search nearby locations to find location_id for a given lat/lng
export async function getTANearbySearch(
  lat: number,
  lng: number,
  category: "restaurants" | "hotels" | "attractions" = "restaurants",
  radiusKm = 0.15
): Promise<{ results: TANearbyResult[]; raw?: unknown }> {
  const url = `${TA_BASE}/location/nearby_search?key=${TA_API_KEY}&latLong=${lat},${lng}&category=${category}&language=en&radius=${radiusKm}&radiusUnit=km`;
  try {
    const res = await fetch(url, {
      next: { revalidate: 0 },
      headers: { "X-TripAdvisor-API-Key": TA_API_KEY },
    });
    const json = await res.json();
    if (!res.ok) return { results: [], raw: json };
    return { results: json.data ?? [], raw: json };
  } catch (e) {
    return { results: [], raw: String(e) };
  }
}

// Normalize names for fuzzy matching (lowercase, remove punctuation/articles)
export function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\b(the|a|an)\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Map a TA category string from our category_slug
export function toTACategory(categorySlug: string): "restaurants" | "hotels" | "attractions" {
  if (categorySlug === "hotels") return "hotels";
  if (categorySlug === "restaurants" || categorySlug === "bars" || categorySlug === "coffee") return "restaurants";
  return "attractions";
}

// Parse award type into a clean string
export function parseTAAward(awards?: TALocationDetails["awards"]): string | null {
  if (!awards || awards.length === 0) return null;
  // Prefer Best of Best > Travelers' Choice
  const bob = awards.find((a) => a.award_type.includes("Best_of_Best"));
  if (bob) return "Best of Best";
  const tc = awards.find((a) => a.award_type.includes("Travelers_Choice"));
  if (tc) return "Travelers' Choice";
  return null;
}

// Parse trip types into a simple {key: percentage} object
export function parseTATripTypes(tripTypes?: TALocationDetails["trip_types"]): Record<string, number> | null {
  if (!tripTypes || tripTypes.length === 0) return null;
  const result: Record<string, number> = {};
  for (const t of tripTypes) {
    const key = t.name.toLowerCase().replace(/\s+/g, "_");
    result[key] = parseFloat(t.value) || 0;
  }
  return result;
}

// Parse subratings into a simple {name: value} object
export function parseTASubratings(subratings?: TALocationDetails["subratings"]): Record<string, number> | null {
  if (!subratings) return null;
  const result: Record<string, number> = {};
  for (const [, sub] of Object.entries(subratings)) {
    result[sub.localized_name] = parseFloat(sub.value) || 0;
  }
  return Object.keys(result).length > 0 ? result : null;
}

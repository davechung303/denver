import { supabase } from "./supabase";
import { getNeighborhood, getCategory } from "./neighborhoods";

const PLACES_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY!;
const CACHE_TTL_HOURS = 24;

export interface Place {
  id: string;
  place_id: string;
  neighborhood_slug: string;
  category_slug: string;
  name: string;
  slug: string;
  address: string | null;
  phone: string | null;
  website: string | null;
  lat: number | null;
  lng: number | null;
  rating: number | null;
  review_count: number | null;
  price_level: number | null;
  hours: GoogleHours | null;
  photos: GooglePhoto[] | null;
  types: string[] | null;
  cached_at: string;
}

export interface GoogleHours {
  openNow?: boolean;
  weekdayDescriptions?: string[];
}

export interface GooglePhoto {
  name: string; // resource name e.g. places/xxx/photos/yyy
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function photoUrl(photoName: string, width = 600, height = 400): string {
  return `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=${width}&maxHeightPx=${height}&key=${PLACES_API_KEY}`;
}

export { photoUrl };

async function fetchFromGooglePlaces(
  neighborhoodSlug: string,
  categorySlug: string
): Promise<Place[]> {
  const neighborhood = getNeighborhood(neighborhoodSlug);
  const category = getCategory(categorySlug);
  if (!neighborhood || !category) return [];

  const textQuery = `${category.searchQuery} in ${neighborhood.searchName}`;

  const response = await fetch(
    "https://places.googleapis.com/v1/places:searchText",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": PLACES_API_KEY,
        "X-Goog-FieldMask": [
          "places.id",
          "places.displayName",
          "places.formattedAddress",
          "places.nationalPhoneNumber",
          "places.websiteUri",
          "places.location",
          "places.rating",
          "places.userRatingCount",
          "places.priceLevel",
          "places.regularOpeningHours",
          "places.photos",
          "places.types",
          "places.businessStatus",
        ].join(","),
      },
      body: JSON.stringify({
        textQuery,
        maxResultCount: 20,
        languageCode: "en",
      }),
    }
  );

  if (!response.ok) {
    console.error("Google Places API error:", response.status, await response.text());
    return [];
  }

  const data = await response.json();
  const rawPlaces = data.places ?? [];

  const places: Place[] = rawPlaces
    .filter((p: any) => p.businessStatus !== "CLOSED_PERMANENTLY")
    .map((p: any) => ({
      id: crypto.randomUUID(),
      place_id: p.id,
      neighborhood_slug: neighborhoodSlug,
      category_slug: categorySlug,
      name: p.displayName?.text ?? "",
      slug: slugify(p.displayName?.text ?? p.id),
      address: p.formattedAddress ?? null,
      phone: p.nationalPhoneNumber ?? null,
      website: p.websiteUri ?? null,
      lat: p.location?.latitude ?? null,
      lng: p.location?.longitude ?? null,
      rating: p.rating ?? null,
      review_count: p.userRatingCount ?? null,
      price_level: p.priceLevel
        ? ["PRICE_LEVEL_FREE", "PRICE_LEVEL_INEXPENSIVE", "PRICE_LEVEL_MODERATE", "PRICE_LEVEL_EXPENSIVE", "PRICE_LEVEL_VERY_EXPENSIVE"].indexOf(p.priceLevel)
        : null,
      hours: p.regularOpeningHours
        ? {
            openNow: p.regularOpeningHours.openNow,
            weekdayDescriptions: p.regularOpeningHours.weekdayDescriptions,
          }
        : null,
      photos: p.photos?.slice(0, 3).map((ph: any) => ({ name: ph.name })) ?? null,
      types: p.types ?? null,
      cached_at: new Date().toISOString(),
    }));

  // Upsert into Supabase cache
  if (places.length > 0) {
    const rows = places.map((p) => ({
      place_id: p.place_id,
      neighborhood_slug: p.neighborhood_slug,
      category_slug: p.category_slug,
      name: p.name,
      slug: p.slug,
      address: p.address,
      phone: p.phone,
      website: p.website,
      lat: p.lat,
      lng: p.lng,
      rating: p.rating,
      review_count: p.review_count,
      price_level: p.price_level,
      hours: p.hours as any,
      photos: p.photos as any,
      types: p.types,
      cached_at: p.cached_at,
    }));
    await supabase.from("places").upsert(rows, { onConflict: "place_id" });
  }

  return places;
}

export async function getPlaces(
  neighborhoodSlug: string,
  categorySlug: string
): Promise<Place[]> {
  const cutoff = new Date(Date.now() - CACHE_TTL_HOURS * 60 * 60 * 1000).toISOString();

  // Try Supabase cache first
  const { data: cached } = await supabase
    .from("places")
    .select("*")
    .eq("neighborhood_slug", neighborhoodSlug)
    .eq("category_slug", categorySlug)
    .gt("cached_at", cutoff)
    .order("rating", { ascending: false });

  if (cached && cached.length > 0) {
    return cached as Place[];
  }

  // Cache miss — fetch from Google
  return fetchFromGooglePlaces(neighborhoodSlug, categorySlug);
}

import { supabase } from "./supabase";
import { getNeighborhood, getCategory } from "./neighborhoods";
import { generateReviewSummary, type ReviewSummary } from "./reviewSummary";

// Use server-side key (no referrer restrictions) for API calls
// NEXT_PUBLIC_ key is for client-side map embeds only
const PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY!;
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
  reviews: GoogleReview[] | null;
  review_summary: ReviewSummary | null;
  cached_at: string;
}

export interface GoogleHours {
  openNow?: boolean;
  weekdayDescriptions?: string[];
}

export interface GooglePhoto {
  name: string; // resource name e.g. places/xxx/photos/yyy
}

export interface GoogleReview {
  name: string;
  relativePublishTimeDescription: string;
  rating: number;
  text?: { text: string; languageCode: string };
  authorAttribution?: { displayName: string; photoUri?: string };
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

const FIELD_MASK = [
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
  "nextPageToken",
].join(",");

async function searchPlaces(body: Record<string, unknown>): Promise<{ places: any[]; nextPageToken?: string }> {
  const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": PLACES_API_KEY,
      "X-Goog-FieldMask": FIELD_MASK,
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    console.error("Google Places API error:", response.status, await response.text());
    return { places: [] };
  }
  const data = await response.json();
  return { places: data.places ?? [], nextPageToken: data.nextPageToken };
}

async function fetchFromGooglePlaces(
  neighborhoodSlug: string,
  categorySlug: string,
  overrideQuery?: string
): Promise<Place[]> {
  const neighborhood = getNeighborhood(neighborhoodSlug);
  const category = getCategory(categorySlug);
  if (!neighborhood || (!category && !overrideQuery)) return [];

  const textQuery = overrideQuery ?? `${category!.searchQuery} in ${neighborhood.searchName}`;

  // Fetch up to 2 pages (40 results)
  const page1 = await searchPlaces({ textQuery, maxResultCount: 20, languageCode: "en" });
  let rawPlaces = page1.places;

  if (page1.nextPageToken) {
    const page2 = await searchPlaces({ pageToken: page1.nextPageToken, maxResultCount: 20, languageCode: "en" });
    rawPlaces = [...rawPlaces, ...page2.places];
  }

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
      reviews: null,
      review_summary: null,
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
      // reviews and review_summary intentionally omitted — managed separately by maybeGenerateSummary
      cached_at: p.cached_at,
    }));
    await supabase.from("places").upsert(rows, { onConflict: "place_id" });
  }

  return places;
}

async function fetchReviewsForPlace(placeId: string): Promise<GoogleReview[] | null> {
  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${placeId}`,
      {
        headers: {
          "X-Goog-Api-Key": PLACES_API_KEY,
          "X-Goog-FieldMask": "reviews",
        },
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.reviews) return null;
    return data.reviews.slice(0, 5).map((r: any) => ({
      name: r.name,
      relativePublishTimeDescription: r.relativePublishTimeDescription ?? "",
      rating: r.rating ?? 0,
      text: r.text ?? null,
      authorAttribution: r.authorAttribution ?? null,
    }));
  } catch {
    return null;
  }
}

const FOOD_CATEGORIES = new Set(["restaurants", "bars", "coffee"]);


async function maybeGenerateSummary(place: Place): Promise<Place> {
  const needsSummary = !place.review_summary;
  const needsDishes =
    FOOD_CATEGORIES.has(place.category_slug) &&
    place.review_summary &&
    !place.review_summary.popular_dishes;

  if (!needsSummary && !needsDishes) return place;

  // Fetch reviews from Place Details API if not already cached
  let reviews = place.reviews;
  if (!reviews || reviews.length === 0) {
    reviews = await fetchReviewsForPlace(place.place_id);
    if (reviews && reviews.length > 0) {
      await supabase
        .from("places")
        .update({ reviews: reviews as any })
        .eq("place_id", place.place_id);
      place = { ...place, reviews };
    }
  }

  if (!reviews || reviews.length === 0) return place;

  const summary = await generateReviewSummary(
    place.name,
    reviews,
    place.category_slug
  );
  if (summary) {
    await supabase
      .from("places")
      .update({ review_summary: summary as any })
      .eq("place_id", place.place_id);
    return { ...place, review_summary: summary };
  }
  return place;
}

export async function getPlace(
  neighborhoodSlug: string,
  categorySlug: string,
  slug: string
): Promise<Place | null> {
  const { data } = await supabase
    .from("places")
    .select("*")
    .eq("neighborhood_slug", neighborhoodSlug)
    .eq("category_slug", categorySlug)
    .eq("slug", slug)
    .single();

  // Row exists — generate summary if needed (fetches reviews lazily if missing)
  if (data) return maybeGenerateSummary(data as Place);

  // No row — fetch the full category from Google and find the match
  const places = await fetchFromGooglePlaces(neighborhoodSlug, categorySlug);
  const found = places.find((p) => p.slug === slug) ?? null;
  if (found) return maybeGenerateSummary(found);
  return null;
}

export async function getPlacesForSubcategory(
  neighborhoodSlug: string,
  categorySlug: string,
  subcategoryTypes: string[],
  subcategorySearchQuery: string,
  neighborhoodSearchName: string
): Promise<Place[]> {
  // First: filter from the already-cached category results
  const all = await getPlaces(neighborhoodSlug, categorySlug);
  const filtered = all.filter((p) => p.types?.some((t) => subcategoryTypes.includes(t)));

  if (filtered.length >= 4) return filtered;

  // Too sparse — do a targeted Google fetch and cache under a compound key
  const compoundSlug = `${categorySlug}-${subcategoryTypes[0]}`;
  const cutoff = new Date(Date.now() - CACHE_TTL_HOURS * 60 * 60 * 1000).toISOString();
  const { data: cached } = await supabase
    .from("places")
    .select("*")
    .eq("neighborhood_slug", neighborhoodSlug)
    .eq("category_slug", compoundSlug)
    .gt("cached_at", cutoff)
    .order("rating", { ascending: false });

  if (cached && cached.length > 0) {
    const merged = [...filtered, ...(cached as Place[]).filter((c) => !filtered.some((f) => f.place_id === c.place_id))];
    return merged;
  }

  const fresh = await fetchFromGooglePlaces(
    neighborhoodSlug,
    compoundSlug,
    `${subcategorySearchQuery} in ${neighborhoodSearchName}`
  );
  const merged = [...filtered, ...fresh.filter((f) => !filtered.some((e) => e.place_id === f.place_id))];
  return merged;
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

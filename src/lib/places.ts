import { supabase, supabaseAdmin } from "./supabase";
import { getNeighborhood, getCategory } from "./neighborhoods";
import { generateReviewSummary, type ReviewSummary } from "./reviewSummary";
import { getFoursquareData, type FoursquareTip } from "./foursquare";

// Use server-side key (no referrer restrictions) for API calls
// NEXT_PUBLIC_ key is for client-side map embeds only
const PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY!;
const CACHE_TTL_HOURS = 168; // 7 days — places data is stable, reduce DB reads

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
  fsq_id: string | null;
  fsq_tips: FoursquareTip[] | null;
  fsq_cached_at: string | null;
  cached_at: string;
  expedia_affiliate_url: string | null;
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

const SITE_URL = "https://davelovesdenver.com";

// Returns a proxy URL that keeps the API key server-side.
// Use relative form in JSX img src; absolute form for og:image metadata.
function photoUrl(photoName: string, _width = 600, _height = 400): string {
  return `/api/places-photo?name=${encodeURIComponent(photoName)}`;
}

function photoAbsoluteUrl(photoName: string): string {
  return `${SITE_URL}/api/places-photo?name=${encodeURIComponent(photoName)}`;
}

export { photoUrl, photoAbsoluteUrl };

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

async function fetchAllPagesForQuery(body: Record<string, unknown>): Promise<any[]> {
  const page1 = await searchPlaces({ ...body, maxResultCount: 20, languageCode: "en" });
  let results = page1.places;
  if (page1.nextPageToken) {
    const page2 = await searchPlaces({ pageToken: page1.nextPageToken, maxResultCount: 20, languageCode: "en" });
    results = [...results, ...page2.places];
  }
  return results;
}

async function fetchFromGooglePlaces(
  neighborhoodSlug: string,
  categorySlug: string,
  overrideQuery?: string
): Promise<Place[]> {
  const neighborhood = getNeighborhood(neighborhoodSlug);
  const category = getCategory(categorySlug);
  if (!neighborhood || (!category && !overrideQuery)) return [];

  // Hotels and activities serve a wider area than restaurants/bars
  const baseRadius = neighborhood.searchRadius ?? 1500.0;
  const wideCategories = new Set(["hotels", "things-to-do"]);
  const radius = wideCategories.has(categorySlug) ? Math.max(baseRadius, 3000.0) : baseRadius;
  const locationBias = {
    circle: {
      center: { latitude: neighborhood.lat, longitude: neighborhood.lng },
      radius,
    },
  };

  const primaryQuery = overrideQuery ?? `${category!.searchQuery} in ${neighborhood.searchName}`;

  // Run primary + any extra queries in parallel, then deduplicate
  const extraQueries = (!overrideQuery && category?.extraQueries)
    ? category.extraQueries.map((q) => `${q} in ${neighborhood.searchName}`)
    : [];

  const allResults = await Promise.all([
    fetchAllPagesForQuery({ textQuery: primaryQuery, locationBias }),
    ...extraQueries.map((q) => fetchAllPagesForQuery({ textQuery: q, locationBias })),
  ]);

  const seen = new Set<string>();
  const rawPlaces: any[] = [];
  for (const batch of allResults) {
    for (const p of batch) {
      if (!seen.has(p.id)) {
        seen.add(p.id);
        rawPlaces.push(p);
      }
    }
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
      fsq_id: null,
      fsq_tips: null,
      fsq_cached_at: null,
      cached_at: new Date().toISOString(),
      expedia_affiliate_url: null,
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
    await supabaseAdmin.from("places").upsert(rows, { onConflict: "place_id" });
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
    if (!res.ok) {
      const errText = await res.text();
      console.error(`[reviews] fetch failed for ${placeId}: ${res.status}`, errText.slice(0, 200));
      return null;
    }
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
  let freshReviews = false;
  if (!reviews || reviews.length === 0) {
    reviews = await fetchReviewsForPlace(place.place_id);
    console.log(`[summary] fetchReviews for ${place.name}: ${reviews?.length ?? 0} reviews`);
    if (reviews && reviews.length > 0) {
      freshReviews = true;
      place = { ...place, reviews };
    }
  }

  if (!reviews || reviews.length === 0) {
    console.log(`[summary] no reviews for ${place.name}, skipping summary`);
    return place;
  }

  const summary = await generateReviewSummary(
    place.name,
    reviews,
    place.category_slug
  );
  console.log(`[summary] generated for ${place.name}: ${summary ? "ok" : "null"}`);
  if (summary) {
    // Batch reviews + summary into a single UPDATE to halve DB writes
    const patch: Record<string, unknown> = { review_summary: summary };
    if (freshReviews) patch.reviews = reviews;
    await supabaseAdmin.from("places").update(patch).eq("place_id", place.place_id);
    return { ...place, review_summary: summary };
  } else if (freshReviews) {
    // Summary failed but we still have fresh reviews — persist them
    await supabaseAdmin.from("places").update({ reviews: reviews as any }).eq("place_id", place.place_id);
  }
  return place;
}

async function maybeFetchFoursquare(place: Place): Promise<Place> {
  if (!process.env.FOURSQUARE_API_KEY) return place;
  const TTL = 24 * 60 * 60 * 1000;
  if (place.fsq_cached_at && Date.now() - new Date(place.fsq_cached_at).getTime() < TTL) {
    return place;
  }
  const data = await getFoursquareData(place.name, place.lat, place.lng, place.fsq_id);
  if (!data) return place;
  const update = { fsq_id: data.fsq_id, fsq_tips: data.tips as any, fsq_cached_at: new Date().toISOString() };
  await supabaseAdmin.from("places").update(update).eq("place_id", place.place_id);
  return { ...place, ...update };
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
  if (data) {
    const withSummary = await maybeGenerateSummary(data as Place);
    return maybeFetchFoursquare(withSummary);
  }

  // Try any category (handles places cached under a compound subcategory slug)
  const { data: anyCategory } = await supabase
    .from("places")
    .select("*")
    .eq("neighborhood_slug", neighborhoodSlug)
    .eq("slug", slug)
    .single();

  if (anyCategory) {
    const withSummary = await maybeGenerateSummary(anyCategory as Place);
    return maybeFetchFoursquare(withSummary);
  }

  // No row — fetch the full category from Google and find the match
  const places = await fetchFromGooglePlaces(neighborhoodSlug, categorySlug);
  const found = places.find((p) => p.slug === slug) ?? null;
  if (found) {
    const withSummary = await maybeGenerateSummary(found);
    return maybeFetchFoursquare(withSummary);
  }
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

// A place is considered useful if it has a rating (real Google data) or at least one photo.
// Parks/landmarks named after the neighborhood with no data are shell records — hide them.
export function isUsefulPlace(place: Place): boolean {
  return (place.rating != null && place.rating > 0) || (place.photos != null && place.photos.length > 0);
}

// Google Places types that indicate an actual hotel (not vacation rentals / Airbnb-style)
const HOTEL_TYPES = new Set([
  "hotel",
  "motel",
  "resort_hotel",
  "extended_stay_hotel",
  "bed_and_breakfast",
  "boutique_hotel",
  "hostel",
  "inn",
]);

// Returns true only for proper hotel/lodging businesses, filtering out vacation rentals
export function isRealHotel(place: Place): boolean {
  return place.types?.some((t) => HOTEL_TYPES.has(t)) ?? false;
}

export async function getPlaces(
  neighborhoodSlug: string,
  categorySlug: string
): Promise<Place[]> {
  const cutoff = new Date(Date.now() - CACHE_TTL_HOURS * 60 * 60 * 1000).toISOString();

  // Trust the cache if it has any results within TTL — don't re-fetch just because
  // the count is low (that causes a Google API call on every page visit)
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

  // True cache miss (TTL expired or never fetched) — fetch from Google
  return fetchFromGooglePlaces(neighborhoodSlug, categorySlug);
}

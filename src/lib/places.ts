import { supabase, supabaseAdmin } from "./supabase";
import { getNeighborhood, getCategory, NEIGHBORHOODS, CATEGORIES } from "./neighborhoods";
import { generateReviewSummary, type ReviewSummary } from "./reviewSummary";

// Use server-side key (no referrer restrictions) for API calls
// NEXT_PUBLIC_ key is for client-side map embeds only
const PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY!;
const CACHE_TTL_HOURS = 720; // 30 days — places data is stable, refreshed monthly by cron

// Columns for listing/card views — excludes heavy `reviews` field (only needed on detail pages)
const LISTING_COLUMNS = "id, place_id, neighborhood_slug, category_slug, name, slug, address, phone, website, lat, lng, rating, review_count, price_level, hours, photos, types, review_summary, cached_at, expedia_affiliate_url";

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
  const radius = wideCategories.has(categorySlug) ? Math.max(baseRadius, 5000.0) : baseRadius;
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

  // COST GUARD: for the needsDishes backfill, only use already-cached reviews.
  // Never call the Google Places API on a page render — that costs $0.017/call
  // and fires on every crawler visit. The refresh-places cron handles backfilling.
  let reviews = place.reviews;
  let freshReviews = false;
  if (!reviews || reviews.length === 0) {
    if (needsDishes) {
      // No cached reviews and only need popular_dishes — skip to avoid Google API cost
      return place;
    }
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
    return withSummary;
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
    return withSummary;
  }

  // Not found in Supabase — return null. Google fetches only happen via refresh-places.
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

  // No Google fallback — return whatever we have from the main category cache.
  // Subcategory results improve automatically after the next monthly refresh-places run.
  return filtered;
}

// A place is considered useful if it has a rating (real Google data) or at least one photo.
// Parks/landmarks named after the neighborhood with no data are shell records — hide them.
export function isUsefulPlace(place: Place): boolean {
  return (place.rating != null && place.rating > 0) || (place.photos != null && place.photos.length > 0);
}

// Google Places types that indicate an actual hotel (not vacation rentals / Airbnb-style)
const HOTEL_TYPES = new Set([
  "lodging",
  "hotel",
  "motel",
  "resort_hotel",
  "extended_stay_hotel",
  "bed_and_breakfast",
  "boutique_hotel",
  "hostel",
  "inn",
]);

const VACATION_RENTAL_TYPES = new Set(["cottage", "vacation_rental", "vacation_home_rental", "farm"]);

// Returns true only for proper hotel/lodging businesses, filtering out vacation rentals
export function isRealHotel(place: Place): boolean {
  if (place.types?.some((t) => VACATION_RENTAL_TYPES.has(t))) return false;
  return place.types?.some((t) => HOTEL_TYPES.has(t)) ?? false;
}

// Real food-service establishments — excludes pure bars/sports bars that land in restaurant searches.
// Google Places types: https://developers.google.com/maps/documentation/places/web-service/place-types
const RESTAURANT_TYPES = new Set([
  "restaurant",
  "american_restaurant",
  "barbecue_restaurant",
  "brazilian_restaurant",
  "breakfast_restaurant",
  "brunch_restaurant",
  "chinese_restaurant",
  "fast_food_restaurant",
  "french_restaurant",
  "greek_restaurant",
  "hamburger_restaurant",
  "indian_restaurant",
  "indonesian_restaurant",
  "italian_restaurant",
  "japanese_restaurant",
  "korean_restaurant",
  "lebanese_restaurant",
  "mediterranean_restaurant",
  "mexican_restaurant",
  "middle_eastern_restaurant",
  "pizza_restaurant",
  "ramen_restaurant",
  "sandwich_shop",
  "seafood_restaurant",
  "spanish_restaurant",
  "steak_house",
  "sushi_restaurant",
  "thai_restaurant",
  "turkish_restaurant",
  "vegan_restaurant",
  "vegetarian_restaurant",
  "vietnamese_restaurant",
  "food",
  "meal_delivery",
  "meal_takeaway",
]);

export function isRealRestaurant(place: Place): boolean {
  if (place.types && place.types.length > 0) {
    return place.types.some((t) => RESTAURANT_TYPES.has(t));
  }
  return true; // No types stored — allow through
}

// Actual bar/drinking establishments — excludes restaurants that happen to be in the bars category.
const BAR_TYPES = new Set([
  "bar",
  "cocktail_bar",
  "wine_bar",
  "sports_bar",
  "pub",
  "brewery",
  "microbrewery",
  "distillery",
  "night_club",
  "karaoke",
]);

export function isRealBar(place: Place): boolean {
  if (place.types && place.types.length > 0) {
    return place.types.some((t) => BAR_TYPES.has(t));
  }
  return true; // No types stored — allow through
}

// Actual coffee/cafe places — filters out restaurants, vape shops, etc.
// Includes bakeries since many great Denver spots are coffee-bakery hybrids.
const COFFEE_TYPES = new Set([
  "coffee_shop",
  "cafe",
  "coffee_roastery",
  "bakery",
  "tea_house",
]);

export function isRealCoffeeShop(place: Place): boolean {
  // If types are available, require at least one coffee/cafe type
  if (place.types && place.types.length > 0) {
    return place.types.some((t) => COFFEE_TYPES.has(t));
  }
  // No types stored — allow through rather than hide the place
  return true;
}

// Score = rating × log10(review_count + 10) — balances quality with proven popularity.
// Highly-rated places with thousands of reviews beat fringe entries with 4 reviews at 5.0.
export function popularityScore(place: Pick<Place, "rating" | "review_count">): number {
  return (place.rating ?? 0) * Math.log10((place.review_count ?? 0) + 10);
}

// Quality score for "Best of" rankings.
// rating² amplifies the difference between 4.5★ and 4.9★.
// Review count scales up to 3000 — enough for Sushi Den (5200) to beat an obscure
// 4.9★ place with 200 reviews, but chains with 50k reviews don't get unlimited credit.
// e.g. Sushi Den 4.7★/5200 ≈ 76.8, obscure 4.9★/200 ≈ 68.7
export function qualityScore(place: Pick<Place, "rating" | "review_count">): number {
  const cappedCount = Math.min(place.review_count ?? 0, 3000);
  return (place.rating ?? 0) ** 2 * Math.log10(cappedCount + 10);
}

// Hidden gem: high rating (≥4.5) but not yet discovered (≤300 reviews)
export function isHiddenGem(place: Place): boolean {
  return (place.rating ?? 0) >= 4.5 && (place.review_count ?? 0) <= 300 && (place.review_count ?? 0) >= 10;
}

// Fetches all hidden gems citywide for the dedicated /denver/hidden-gems page.
// Slightly wider review window (20–500) vs the homepage widget (10–300), and
// requires a photo so cards don't look broken.
export async function getAllHiddenGems(): Promise<Place[]> {
  const { data } = await supabase
    .from("places")
    .select(LISTING_COLUMNS)
    .not("rating", "is", null)
    .gte("rating", 4.5)
    .gte("review_count", 20)
    .lte("review_count", 500)
    .order("rating", { ascending: false })
    .limit(300);

  return ((data ?? []) as Place[])
    .filter(isUsefulPlace)
    .sort((a, b) => qualityScore(b) - qualityScore(a));
}

export async function getBestOfDenver(
  categorySlug: string,
  limit = 8,
  options?: { requireTypes?: string[]; minReviews?: number; minRating?: number }
): Promise<Place[]> {
  const { data } = await supabase
    .from("places")
    .select(LISTING_COLUMNS)
    .like("category_slug", `${categorySlug}%`)
    .not("rating", "is", null)
    .gte("rating", options?.minRating ?? 4.2)
    .gte("review_count", options?.minReviews ?? 200)
    .order("rating", { ascending: false })
    .limit(150);

  const places = (data ?? []) as Place[];
  return places
    .filter(isUsefulPlace)
    .filter((p) =>
      !options?.requireTypes ||
      options.requireTypes.some((t) => p.types?.includes(t))
    )
    .sort((a, b) => qualityScore(b) - qualityScore(a))
    .slice(0, limit);
}

export interface TrendingPlace extends Place {
  velocity: number;        // new reviews in the window
  windowDays: number;      // actual days between snapshots used
  velocityPerWeek: number; // normalized to per-7-days for display
}

// Returns the top trending places citywide, ranked by review velocity.
// Velocity = reviews gained between oldest available snapshot in the window
// and the most recent snapshot. Weighted by rating so low-quality viral
// places don't dominate.
export async function getTrendingPlaces(
  windowDays = 30,
  limit = 8
): Promise<TrendingPlace[]> {
  const windowStart = new Date(Date.now() - windowDays * 24 * 60 * 60 * 1000).toISOString();

  // Fetch the two boundary snapshots per place in the window.
  // We get the oldest snapshot within the window (baseline) and the newest (current).
  const { data: snapshots, error } = await supabase
    .from("place_snapshots")
    .select("place_id, review_count, snapped_at")
    .gte("snapped_at", windowStart)
    .order("snapped_at", { ascending: true });

  if (error || !snapshots || snapshots.length === 0) return [];

  // Group by place_id → keep first (oldest) and last (newest) snapshot
  const byPlace = new Map<string, { oldest: typeof snapshots[0]; newest: typeof snapshots[0] }>();
  for (const snap of snapshots) {
    const entry = byPlace.get(snap.place_id);
    if (!entry) {
      byPlace.set(snap.place_id, { oldest: snap, newest: snap });
    } else {
      byPlace.set(snap.place_id, { oldest: entry.oldest, newest: snap });
    }
  }

  // Calculate velocity for places with at least 2 snapshots and positive growth
  const velocities: Array<{ place_id: string; velocity: number; windowDays: number; velocityPerWeek: number }> = [];
  for (const [place_id, { oldest, newest }] of byPlace) {
    if (oldest.snapped_at === newest.snapped_at) continue; // only one snapshot
    const gain = (newest.review_count ?? 0) - (oldest.review_count ?? 0);
    if (gain <= 0) continue;
    const daysBetween = (new Date(newest.snapped_at).getTime() - new Date(oldest.snapped_at).getTime()) / (1000 * 60 * 60 * 24);
    if (daysBetween < 1) continue;
    velocities.push({
      place_id,
      velocity: gain,
      windowDays: Math.round(daysBetween),
      velocityPerWeek: Math.round((gain / daysBetween) * 7),
    });
  }

  if (velocities.length === 0) return [];

  // Fetch place data for the top candidates (fetch more than limit to filter)
  const topIds = velocities
    .sort((a, b) => b.velocity - a.velocity)
    .slice(0, limit * 4)
    .map((v) => v.place_id);

  const { data: places } = await supabase
    .from("places")
    .select("*")
    .in("place_id", topIds)
    .not("rating", "is", null)
    .gte("rating", 4.0);

  if (!places) return [];

  const placeMap = new Map((places as Place[]).map((p) => [p.place_id, p]));

  return velocities
    .filter((v) => placeMap.has(v.place_id))
    .map((v) => ({
      ...placeMap.get(v.place_id)!,
      velocity: v.velocity,
      windowDays: v.windowDays,
      velocityPerWeek: v.velocityPerWeek,
    }))
    .sort((a, b) => {
      // Trending score: velocity weighted by quality (rating^2 normalizes 4.0 vs 4.9)
      const scoreA = a.velocity * (a.rating ?? 0) ** 2;
      const scoreB = b.velocity * (b.rating ?? 0) ** 2;
      return scoreB - scoreA;
    })
    .slice(0, limit);
}

// Places added to the DB in the last 30 days, ordered newest first.
// Uses created_at (set on insert, never updated) so monthly refresh-places
// cron doesn't reset the "new" status of existing places.
// Optionally scoped to a single neighborhood. Hotels excluded — not useful as "new openings."
export async function getRecentlyAddedPlaces(
  neighborhoodSlug?: string,
  limit = 12
): Promise<(Place & { created_at: string })[]> {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  let query = supabase
    .from("places")
    .select(LISTING_COLUMNS + ", created_at")
    .gte("created_at", thirtyDaysAgo)
    .not("photos", "is", null)
    .neq("category_slug", "hotels")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (neighborhoodSlug) {
    query = query.eq("neighborhood_slug", neighborhoodSlug);
  }

  const { data } = await query;
  return (data ?? []) as unknown as (Place & { created_at: string })[];
}

export async function getPlaces(
  neighborhoodSlug: string,
  categorySlug: string
): Promise<Place[]> {
  // Return whatever Supabase has — stale or fresh. Never call Google from a page render.
  // Google fetches only happen via the /api/refresh-places admin route (monthly cron).
  // This prevents surprise API bills from ISR revalidation or build-time pre-rendering.
  const { data } = await supabase
    .from("places")
    .select(LISTING_COLUMNS)
    .eq("neighborhood_slug", neighborhoodSlug)
    .eq("category_slug", categorySlug)
    .order("rating", { ascending: false });

  return (data ?? []) as Place[];
}

// Searches for newly opened places in each neighborhood for the discovery cron.
// Only upserts places NOT already in the DB — this is additive, not a full refresh.
// Runs weekly (~54 API calls for restaurants/bars/coffee across all neighborhoods).
export async function discoverNewPlaces(): Promise<{ added: number; neighborhoods: number }> {
  // Only the categories where new openings happen regularly
  const DISCOVERY_CATEGORIES = ["restaurants", "bars", "coffee"] as const;

  // Fetch all existing place_ids so we can skip them
  const { data: existing } = await supabaseAdmin
    .from("places")
    .select("place_id");
  const knownIds = new Set((existing ?? []).map((p: { place_id: string }) => p.place_id));

  let totalAdded = 0;
  let neighborhoodsChecked = 0;

  for (const neighborhood of NEIGHBORHOODS) {
    for (const categorySlug of DISCOVERY_CATEGORIES) {
      const category = CATEGORIES.find((c) => c.slug === categorySlug);
      if (!category) continue;

      // "new" prefix surfaces recently-opened places near the top of results
      const query = `new ${category.searchQuery} in ${neighborhood.searchName}`;
      const locationBias = {
        circle: {
          center: { latitude: neighborhood.lat, longitude: neighborhood.lng },
          radius: neighborhood.searchRadius ?? 1500,
        },
      };

      const places = await fetchAllPagesForQuery({ textQuery: query, locationBias });
      const newPlaces = places.filter(
        (p: any) => !knownIds.has(p.id) && p.businessStatus !== "CLOSED_PERMANENTLY"
      );

      if (newPlaces.length > 0) {
        const rows = newPlaces.map((p: any) => ({
          place_id: p.id,
          neighborhood_slug: neighborhood.slug,
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
            ? { openNow: p.regularOpeningHours.openNow, weekdayDescriptions: p.regularOpeningHours.weekdayDescriptions }
            : null,
          photos: p.photos?.slice(0, 3).map((ph: any) => ({ name: ph.name })) ?? null,
          types: p.types ?? null,
          cached_at: new Date().toISOString(),
        }));

        await supabaseAdmin.from("places").upsert(rows, { onConflict: "place_id", ignoreDuplicates: true });
        totalAdded += newPlaces.length;

        // Track new IDs so later iterations don't re-insert the same place under a different neighborhood
        newPlaces.forEach((p: any) => knownIds.add(p.id));
      }

      neighborhoodsChecked++;
      // Small delay between API calls to stay well within rate limits
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  return { added: totalAdded, neighborhoods: neighborhoodsChecked };
}

// Called only by /api/refresh-places — never from page renders.
// Checks the TTL, invalidates stale rows, and re-fetches from Google.
export async function refreshPlacesFromGoogle(
  neighborhoodSlug: string,
  categorySlug: string,
  minResults = 0
): Promise<Place[]> {
  const cutoff = new Date(Date.now() - CACHE_TTL_HOURS * 60 * 60 * 1000).toISOString();
  const { count } = await supabaseAdmin
    .from("places")
    .select("*", { count: "exact", head: true })
    .eq("neighborhood_slug", neighborhoodSlug)
    .eq("category_slug", categorySlug)
    .gt("cached_at", cutoff);

  // Skip if still fresh and above the minimum threshold
  if ((count ?? 0) >= minResults && minResults > 0) return [];

  return fetchFromGooglePlaces(neighborhoodSlug, categorySlug);
}

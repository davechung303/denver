import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getTANearbySearch, normalizeName, toTACategory } from "@/lib/tripadvisor";

export const maxDuration = 300;

// Maps our places to TripAdvisor location_ids via Nearby Search.
// Run once (or occasionally for new places). Only touches places with no ta_location_id yet.
//
// Budget: ~1 API call per place (100m radius → usually 1–5 results back)
// Usage:
//   GET /api/ta-map?limit=200             — map next 200 unmapped places
//   GET /api/ta-map?neighborhood=rino     — map a specific neighborhood
//   GET /api/ta-map?category=restaurants  — map a specific category

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const limit = parseInt(url.searchParams.get("limit") ?? "200");
  const onlyNeighborhood = url.searchParams.get("neighborhood");
  const onlyCategory = url.searchParams.get("category");

  // Fetch unmapped places that have lat/lng, ordered by qualityScore proxy (rating desc)
  let query = supabaseAdmin
    .from("places")
    .select("id, name, lat, lng, category_slug, neighborhood_slug, rating, review_count")
    .is("ta_location_id", null)
    .not("lat", "is", null)
    .not("lng", "is", null)
    .not("rating", "is", null)
    .order("rating", { ascending: false })
    .limit(limit);

  if (onlyNeighborhood) query = query.eq("neighborhood_slug", onlyNeighborhood);
  if (onlyCategory) query = query.eq("category_slug", onlyCategory);

  const { data: places, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!places || places.length === 0) return NextResponse.json({ mapped: 0, failed: 0, message: "No unmapped places found" });

  let mapped = 0;
  let failed = 0;
  let apiCalls = 0;
  const failures: string[] = [];

  // Debug mode: run on first place only and return raw TA response
  const debug = url.searchParams.get("debug") === "1";

  for (const place of places) {
    const taCategory = toTACategory(place.category_slug);
    const { results: nearby, raw } = await getTANearbySearch(place.lat!, place.lng!, taCategory);
    apiCalls++;

    if (debug) {
      return NextResponse.json({
        place: { name: place.name, lat: place.lat, lng: place.lng, category: place.category_slug },
        taCategory,
        taRaw: raw,
        taResults: nearby,
        keyPresent: !!process.env.TRIPADVISOR_API_KEY,
        keyPrefix: process.env.TRIPADVISOR_API_KEY?.slice(0, 6) ?? "missing",
      });
    }

    // Find the best match by name similarity
    const ourName = normalizeName(place.name);
    let bestMatch: { location_id: string; name: string } | null = null;

    for (const candidate of nearby) {
      const candidateName = normalizeName(candidate.name);
      // Exact match
      if (candidateName === ourName) {
        bestMatch = candidate;
        break;
      }
      // One contains the other (handles "Safta" vs "Safta Restaurant")
      if (candidateName.includes(ourName) || ourName.includes(candidateName)) {
        bestMatch = candidate;
        break;
      }
    }

    if (bestMatch) {
      await supabaseAdmin
        .from("places")
        .update({ ta_location_id: bestMatch.location_id })
        .eq("id", place.id);
      mapped++;
    } else {
      failed++;
      failures.push(`${place.name} (${place.neighborhood_slug}/${place.category_slug})`);
    }

    // Small delay to stay well within 50 calls/second rate limit
    await new Promise((r) => setTimeout(r, 25));
  }

  return NextResponse.json({
    processed: places.length,
    mapped,
    failed,
    apiCalls,
    failures: failures.slice(0, 20), // cap output
  });
}

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import {
  getTALocationDetails,
  parseTAAward,
  parseTATripTypes,
  parseTASubratings,
} from "@/lib/tripadvisor";

export const maxDuration = 300;

// Fetches TripAdvisor Location Details for all mapped places and updates the DB.
// Run 1x/month. Budget: ~1 call per place with a ta_location_id.
//
// Usage:
//   GET /api/ta-refresh                        — refresh all mapped places
//   GET /api/ta-refresh?neighborhood=rino      — refresh one neighborhood
//   GET /api/ta-refresh?limit=500              — refresh up to N places
//   GET /api/ta-refresh?stale_days=25          — only refresh if ta_cached_at is older than N days

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const limit = parseInt(url.searchParams.get("limit") ?? "1500");
  const staleDays = parseInt(url.searchParams.get("stale_days") ?? "20");
  const onlyNeighborhood = url.searchParams.get("neighborhood");

  const staleThreshold = new Date();
  staleThreshold.setDate(staleThreshold.getDate() - staleDays);

  // Fetch mapped places that haven't been refreshed recently
  let query = supabaseAdmin
    .from("places")
    .select("id, name, ta_location_id, neighborhood_slug, category_slug")
    .not("ta_location_id", "is", null)
    .or(`ta_cached_at.is.null,ta_cached_at.lt.${staleThreshold.toISOString()}`)
    .order("rating", { ascending: false })
    .limit(limit);

  if (onlyNeighborhood) query = query.eq("neighborhood_slug", onlyNeighborhood);

  const { data: places, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!places || places.length === 0) {
    return NextResponse.json({ refreshed: 0, message: "All mapped places are up to date" });
  }

  let refreshed = 0;
  let failed = 0;
  let apiCalls = 0;

  for (const place of places) {
    const details = await getTALocationDetails(place.ta_location_id!);
    apiCalls++;

    if (!details) {
      failed++;
      await new Promise((r) => setTimeout(r, 25));
      continue;
    }

    const award = parseTAAward(details.awards);
    const tripTypes = parseTATripTypes(details.trip_types);
    const subratings = parseTASubratings(details.subratings);
    const cuisine = details.cuisine?.map((c) => c.localized_name) ?? null;

    await supabaseAdmin
      .from("places")
      .update({
        ta_rating: details.rating ?? null,
        ta_num_reviews: details.num_reviews ?? null,
        ta_ranking_position: details.ranking_data?.ranking ?? null,
        ta_ranking_string: details.ranking_data?.ranking_string ?? null,
        ta_award: award,
        ta_trip_types: tripTypes,
        ta_subratings: subratings,
        ta_cuisine: cuisine,
        ta_cached_at: new Date().toISOString(),
      })
      .eq("id", place.id);

    refreshed++;

    // 25ms gap → max 40 calls/second, well within the 50/s limit
    await new Promise((r) => setTimeout(r, 25));
  }

  return NextResponse.json({
    processed: places.length,
    refreshed,
    failed,
    apiCalls,
  });
}

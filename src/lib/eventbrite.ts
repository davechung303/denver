import { supabase } from "./supabase";
import { NEIGHBORHOODS } from "./neighborhoods";

export interface DenverEvent {
  id: string;
  event_id: string;
  name: string;
  description: string | null;
  start_time: string;
  end_time: string | null;
  url: string;
  image_url: string | null;
  venue_name: string | null;
  venue_address: string | null;
  venue_lat: number | null;
  venue_lng: number | null;
  neighborhood_slug: string | null;
  is_free: boolean;
  cached_at: string;
}

const API_KEY = process.env.EVENTBRITE_API_KEY;

// Assign a neighborhood based on venue coordinates
function assignNeighborhood(lat: number, lng: number): string | null {
  // Simple bounding boxes for each neighborhood
  const bounds: Record<string, [number, number, number, number]> = {
    // [minLat, maxLat, minLng, maxLng]
    rino:             [39.755, 39.780, -104.998, -104.970],
    lodo:             [39.745, 39.760, -105.005, -104.988],
    "capitol-hill":   [39.727, 39.745, -104.985, -104.965],
    highlands:        [39.753, 39.775, -105.025, -105.000],
    "cherry-creek":   [39.708, 39.725, -104.960, -104.940],
    "five-points":    [39.747, 39.762, -104.980, -104.960],
    cole:             [39.758, 39.775, -104.970, -104.950],
    "washington-park":[39.700, 39.722, -104.975, -104.950],
  };

  for (const [slug, [minLat, maxLat, minLng, maxLng]] of Object.entries(bounds)) {
    if (lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng) {
      return slug;
    }
  }

  // Fallback: find nearest neighborhood center
  const centers: Record<string, [number, number]> = {
    rino: [39.765, -104.987],
    lodo: [39.752, -104.998],
    "capitol-hill": [39.734, -104.978],
    highlands: [39.760, -105.015],
    "cherry-creek": [39.715, -104.952],
    "five-points": [39.754, -104.974],
    cole: [39.766, -104.959],
    "washington-park": [39.711, -104.964],
  };

  let closest: string | null = null;
  let minDist = Infinity;
  for (const [slug, [cLat, cLng]] of Object.entries(centers)) {
    const dist = Math.sqrt((lat - cLat) ** 2 + (lng - cLng) ** 2);
    if (dist < minDist) { minDist = dist; closest = slug; }
  }
  // Only assign if within ~2 miles of a center (~0.03 degrees)
  return minDist < 0.03 ? closest : null;
}

export async function syncDenverEvents(): Promise<number> {
  if (!API_KEY) throw new Error("EVENTBRITE_API_KEY not set");

  const now = new Date().toISOString();
  const allEvents: object[] = [];
  let pageNumber = 1;
  let hasMore = true;

  while (hasMore && pageNumber <= 5) {
    const params = new URLSearchParams({
      "location.address": "Denver, CO",
      "location.within": "10mi",
      "start_date.range_start": now,
      "expand": "venue",
      "status": "live",
      "page_size": "50",
      "page": String(pageNumber),
    });

    const res = await fetch(
      `https://www.eventbriteapi.com/v3/events/search/?${params}`,
      { headers: { Authorization: `Bearer ${API_KEY}` } }
    );

    if (!res.ok) break;
    const data = await res.json();
    allEvents.push(...(data.events ?? []));
    hasMore = data.pagination?.has_more_items ?? false;
    pageNumber++;
  }

  const rows = (allEvents as any[])
    .filter((e) => e.venue?.latitude && e.venue?.longitude)
    .map((e) => {
      const lat = parseFloat(e.venue.latitude);
      const lng = parseFloat(e.venue.longitude);
      return {
        event_id: e.id,
        name: e.name?.text ?? "Untitled Event",
        description: e.description?.text?.slice(0, 500) ?? null,
        start_time: e.start?.utc ?? now,
        end_time: e.end?.utc ?? null,
        url: e.url,
        image_url: e.logo?.url ?? null,
        venue_name: e.venue?.name ?? null,
        venue_address: e.venue?.address?.localized_address_display ?? null,
        venue_lat: lat,
        venue_lng: lng,
        neighborhood_slug: assignNeighborhood(lat, lng),
        is_free: e.is_free ?? false,
        cached_at: new Date().toISOString(),
      };
    });

  if (rows.length > 0) {
    // Delete stale events and insert fresh batch
    await supabase.from("events").delete().lt("start_time", now);
    await supabase.from("events").upsert(rows, { onConflict: "event_id" });
  }

  return rows.length;
}

export async function getEventsForNeighborhood(
  neighborhoodSlug: string,
  limit = 4
): Promise<DenverEvent[]> {
  const { data } = await supabase
    .from("events")
    .select("*")
    .eq("neighborhood_slug", neighborhoodSlug)
    .gte("start_time", new Date().toISOString())
    .order("start_time", { ascending: true })
    .limit(limit);

  return (data ?? []) as DenverEvent[];
}

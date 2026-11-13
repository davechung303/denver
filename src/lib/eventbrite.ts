import { supabase, supabaseAdmin } from "./supabase";
import { NEIGHBORHOODS } from "./neighborhoods";
import { resolveNeighborhood } from "./neighborhoodResolver";

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
// Same coordinate filing as places (official neighborhood polygons). The old
// box loop now also hit the huge Day Trips box before the suburbs.
function assignNeighborhood(lat: number, lng: number): string | null {
  return resolveNeighborhood(lat, lng);
}

export async function syncDenverEvents(): Promise<number> {
  if (!API_KEY) throw new Error("EVENTBRITE_API_KEY not set");

  const now = new Date().toISOString();
  const allEvents: object[] = [];
  let pageNumber = 1;
  let hasMore = true;

  while (hasMore && pageNumber <= 5) {
    const params = new URLSearchParams({
      "location.latitude": "39.7392",
      "location.longitude": "-104.9903",
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

    if (!res.ok) {
      const errText = await res.text();
      console.error("Eventbrite API error:", res.status, errText);
      break;
    }
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
    await supabaseAdmin.from("events").delete().lt("start_time", now);
    await supabaseAdmin.from("events").upsert(rows, { onConflict: "event_id" });
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

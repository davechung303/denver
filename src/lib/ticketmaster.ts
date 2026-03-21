import { supabase, supabaseAdmin } from "./supabase";
import { NEIGHBORHOOD_BOUNDS } from "./neighborhoods";

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

const API_KEY = process.env.TICKETMASTER_API_KEY;

function assignNeighborhood(lat: number, lng: number): string | null {
  for (const [slug, [minLat, maxLat, minLng, maxLng]] of Object.entries(NEIGHBORHOOD_BOUNDS)) {
    if (lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng) {
      return slug;
    }
  }
  return null;
}

export async function syncDenverEvents(): Promise<number> {
  if (!API_KEY) throw new Error("TICKETMASTER_API_KEY not set");

  const now = new Date().toISOString();
  const allEvents: any[] = [];

  // Fetch up to 3 pages (600 events max)
  for (let page = 0; page < 3; page++) {
    const params = new URLSearchParams({
      apikey: API_KEY,
      city: "Denver",
      stateCode: "CO",
      radius: "20",
      unit: "miles",
      size: "200",
      page: String(page),
      sort: "date,asc",
      startDateTime: now.replace(/\.\d{3}Z$/, "Z"),
    });

    const res = await fetch(
      `https://app.ticketmaster.com/discovery/v2/events.json?${params}`
    );

    if (!res.ok) {
      console.error("Ticketmaster API error:", res.status, await res.text());
      break;
    }

    const data = await res.json();
    const events = data._embedded?.events ?? [];
    allEvents.push(...events);

    const totalPages = data.page?.totalPages ?? 1;
    if (page + 1 >= totalPages) break;
  }

  const rows = allEvents
    .map((e: any) => {
      const venue = e._embedded?.venues?.[0];
      const lat = venue?.location?.latitude ? parseFloat(venue.location.latitude) : null;
      const lng = venue?.location?.longitude ? parseFloat(venue.location.longitude) : null;
      const image = e.images?.find((img: any) => img.ratio === "16_9" && img.width > 500) ?? e.images?.[0];
      const startTime = e.dates?.start?.dateTime ?? (e.dates?.start?.localDate ? e.dates.start.localDate + "T00:00:00Z" : null);

      return {
        event_id: e.id,
        name: e.name ?? null,
        description: e.classifications?.[0]?.segment?.name ?? null,
        start_time: startTime,
        end_time: null,
        url: e.url ?? null,
        image_url: image?.url ?? null,
        venue_name: venue?.name ?? null,
        venue_address: venue?.address?.line1 ?? null,
        venue_lat: lat,
        venue_lng: lng,
        neighborhood_slug: lat && lng ? assignNeighborhood(lat, lng) : null,
        is_free: e.priceRanges?.[0]?.min === 0,
        cached_at: new Date().toISOString(),
      };
    })
    .filter((e) => e.event_id && e.name && e.start_time && e.url);

  if (rows.length > 0) {
    await supabaseAdmin.from("events").delete().lt("start_time", now);

    // Upsert in chunks of 50 to avoid payload limits and isolate bad rows
    let inserted = 0;
    for (let i = 0; i < rows.length; i += 50) {
      const chunk = rows.slice(i, i + 50);
      const { error } = await supabaseAdmin.from("events").upsert(chunk, { onConflict: "event_id" });
      if (error) console.error(`[events] chunk ${i}-${i + 50} error:`, error.message);
      else inserted += chunk.length;
    }
    console.log(`[events] inserted ${inserted}/${rows.length}`);
  }

  return rows.length;
}

export async function getEventsForNeighborhood(
  neighborhoodSlug: string,
  limit = 4
): Promise<DenverEvent[]> {
  const now = new Date().toISOString();

  // First try neighborhood-specific events
  const { data: local } = await supabase
    .from("events")
    .select("*")
    .eq("neighborhood_slug", neighborhoodSlug)
    .gte("start_time", now)
    .order("start_time", { ascending: true })
    .limit(limit);

  if (local && local.length >= limit) return local as DenverEvent[];

  // Fall back to upcoming Denver events (any neighborhood or unassigned)
  const { data: cityWide } = await supabase
    .from("events")
    .select("*")
    .gte("start_time", now)
    .order("start_time", { ascending: true })
    .limit(limit);

  const localIds = new Set((local ?? []).map((e: any) => e.event_id));
  const merged = [
    ...(local ?? []),
    ...(cityWide ?? []).filter((e: any) => !localIds.has(e.event_id)),
  ].slice(0, limit);

  return merged as DenverEvent[];
}

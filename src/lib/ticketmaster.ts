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
  // Enriched fields (populated by sync and live API fetches)
  genre: string | null;
  artist_name: string | null;
  spotify_url: string | null;
  youtube_url: string | null;
  status_code: string | null;
  min_price: number | null;
  max_price: number | null;
}

// Ticketmaster venue IDs for Denver area venues — stable, don't change
export const VENUE_IDS: Record<string, string> = {
  "red-rocks":                 "KovZpZAaeIvA",
  "ball-arena":                "KovZpZAFaJeA",
  "coors-field":               "KovZpZA6t7kA",
  "empower-field":             "KovZpa3Wne",
  "mission-ballroom":          "KovZ917AxRI",
  "fiddlers-green":            "KovZpZAEkakA",
  "ogden-theatre":             "KovZpZAJv67A",
  "paramount-theatre":         "KovZpZAFa1nA",
  "dicks-sporting-goods-park": "KovZpZAE7aJA",
};

const API_KEY = process.env.TICKETMASTER_API_KEY;

function mapTicketmasterEvent(e: any): DenverEvent | null {
  const venue = e._embedded?.venues?.[0];
  const attraction = e._embedded?.attractions?.[0];
  const lat = venue?.location?.latitude ? parseFloat(venue.location.latitude) : null;
  const lng = venue?.location?.longitude ? parseFloat(venue.location.longitude) : null;
  const image = e.images?.find((img: any) => img.ratio === "16_9" && img.width > 500) ?? e.images?.[0];
  const startTime = e.dates?.start?.dateTime ?? (e.dates?.start?.localDate ? e.dates.start.localDate + "T00:00:00Z" : null);
  if (!e.id || !e.name || !startTime || !e.url) return null;
  const priceRange = e.priceRanges?.[0];
  return {
    id: e.id,
    event_id: e.id,
    name: e.name,
    description: e.classifications?.[0]?.segment?.name ?? null,
    start_time: startTime,
    end_time: null,
    url: e.url,
    image_url: image?.url ?? null,
    venue_name: venue?.name ?? null,
    venue_address: venue?.address?.line1 ?? null,
    venue_lat: lat,
    venue_lng: lng,
    neighborhood_slug: lat && lng ? assignNeighborhood(lat, lng) : null,
    is_free: priceRange?.min === 0,
    cached_at: new Date().toISOString(),
    genre: e.classifications?.[0]?.genre?.name ?? null,
    artist_name: attraction?.name ?? null,
    spotify_url: attraction?.externalLinks?.spotify?.[0]?.url ?? null,
    youtube_url: attraction?.externalLinks?.youtube?.[0]?.url ?? null,
    status_code: e.dates?.status?.code ?? "onsale",
    min_price: priceRange?.min ?? null,
    max_price: priceRange?.max ?? null,
  };
}

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
      // lat/lng + radius covers all Denver metro venues including Red Rocks (Morrison)
      // and Fiddler's Green (Greenwood Village) which are missed by city:"Denver"
      latlong: "39.7392,-104.9903",
      radius: "30",
      unit: "miles",
      stateCode: "CO",
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
    .map(mapTicketmasterEvent)
    .filter(Boolean)
    .map((e) => ({ ...e, event_id: e!.event_id }));

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

// Query events for a specific venue by partial name match.
// Used by venue hub pages (near-red-rocks, near-ball-arena, etc.)
export async function getEventsForVenue(
  venueName: string,
  limit = 6
): Promise<DenverEvent[]> {
  const now = new Date().toISOString();
  const { data } = await supabase
    .from("events")
    .select("*")
    .ilike("venue_name", `%${venueName}%`)
    .gte("start_time", now)
    .order("start_time", { ascending: true })
    .limit(limit);
  return (data ?? []) as DenverEvent[];
}

// Fetch events for a specific venue directly from Ticketmaster API using stable venueId.
// Used by venue event pages — bypasses the city-wide DB sync so we get all shows for that venue.
// The fetch is cached for 1 hour via Next.js data cache (pages revalidate at 3600s).
export async function getEventsForVenueFromAPI(
  venueSlug: string,
  limit = 50
): Promise<DenverEvent[]> {
  const venueId = VENUE_IDS[venueSlug];
  if (!API_KEY || !venueId) return getEventsForVenue(venueSlug.replace(/-/g, " "), limit);

  const now = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
  const params = new URLSearchParams({
    apikey: API_KEY,
    venueId,
    size: String(Math.min(limit, 200)),
    sort: "date,asc",
    startDateTime: now,
  });

  try {
    const res = await fetch(
      `https://app.ticketmaster.com/discovery/v2/events.json?${params}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) throw new Error(`API ${res.status}`);
    const data = await res.json();
    const events: DenverEvent[] = (data._embedded?.events ?? [])
      .map(mapTicketmasterEvent)
      .filter(Boolean) as DenverEvent[];
    return events;
  } catch (err) {
    console.error(`[ticketmaster] live fetch failed for ${venueSlug}, falling back to DB:`, err);
    return getEventsForVenue(venueSlug.replace(/-/g, " "), limit);
  }
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

import { supabase, supabaseAdmin } from "./supabase";
import { NEIGHBORHOOD_BOUNDS } from "./neighborhoods";

export interface FeverEvent {
  id: string;
  event_id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  url: string;
  price: number | null;
  venue_name: string | null;
  venue_address: string | null;
  venue_lat: number | null;
  venue_lng: number | null;
  neighborhood_slug: string | null;
  category: string | null;
  subcategory: string | null;
  next_date: string | null;
  expiration_date: string | null;
  popularity: number | null;
  synced_at: string;
}

const CATALOG_ID = "15532";
const API_BASE = "https://api.impact.com";

function assignNeighborhood(lat: number, lng: number): string | null {
  for (const [slug, [minLat, maxLat, minLng, maxLng]] of Object.entries(NEIGHBORHOOD_BOUNDS)) {
    if (lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng) {
      return slug;
    }
  }
  return null;
}

function parseCoords(pattern: string | null): { lat: number | null; lng: number | null } {
  if (!pattern) return { lat: null, lng: null };
  const match = pattern.match(/\(?([\d.-]+);\s*([\d.-]+)\)?/);
  if (!match) return { lat: null, lng: null };
  return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
}

function parseNextDate(manufacturer: string | null): string | null {
  if (!manufacturer) return null;
  const dates = manufacturer.split(",").map((d) => d.trim()).filter(Boolean);
  const now = new Date().toISOString();
  return dates.find((d) => d > now) ?? dates[0] ?? null;
}

export async function syncFeverEvents(
  startAfter?: string,
  maxPages = 30
): Promise<{ count: number; nextStartAfter: string | null }> {
  const IMPACT_ACCOUNT_SID = process.env.IMPACT_ACCOUNT_SID;
  const IMPACT_AUTH_TOKEN = process.env.IMPACT_AUTH_TOKEN;

  if (!IMPACT_ACCOUNT_SID || !IMPACT_AUTH_TOKEN) {
    throw new Error("IMPACT_ACCOUNT_SID or IMPACT_AUTH_TOKEN not set");
  }

  const credentials = Buffer.from(`${IMPACT_ACCOUNT_SID}:${IMPACT_AUTH_TOKEN}`).toString("base64");
  const headers = {
    Authorization: `Basic ${credentials}`,
    Accept: "application/json",
  };
  const now = new Date().toISOString();

  const allDenverItems: any[] = [];
  const baseUri = `/Mediapartners/${IMPACT_ACCOUNT_SID}/Catalogs/${CATALOG_ID}/Items?PageSize=100`;
  let nextUri: string | null = startAfter
    ? `${baseUri}&AfterId=${startAfter}`
    : baseUri;
  let pageNum = 0;
  let lastNextUri: string | null = null;

  while (nextUri && pageNum < maxPages) {
    pageNum++;
    const response: Response = await fetch(`${API_BASE}${nextUri}`, { headers });

    if (!response.ok) {
      console.error(`[fever] API error page ${pageNum}:`, response.status, await response.text());
      break;
    }

    const data = await response.json();
    const items: any[] = data.Items ?? [];
    if (items.length === 0) break;

    const denverItems = items.filter(
      (item) =>
        item.Text2 === "Denver" &&
        item.Currency === "USD" &&
        !item.Category?.startsWith("Tier 4") &&
        (!item.ExpirationDate || item.ExpirationDate > now)
    );
    allDenverItems.push(...denverItems);

    const totalPages = parseInt(data["@numpages"] ?? "0", 10);
    console.log(`[fever] page ${pageNum}/${totalPages}, +${denverItems.length} Denver items`);

    lastNextUri = data["@nextpageuri"] || null;
    nextUri = lastNextUri;
  }

  // Extract AfterId from nextpageuri for the next batch call
  let nextStartAfter: string | null = null;
  if (lastNextUri && pageNum >= maxPages) {
    const match = lastNextUri.match(/AfterId=([^&]+)/);
    nextStartAfter = match ? match[1] : null;
  }

  if (allDenverItems.length === 0) {
    console.log("[fever] no Denver items in this batch");
    return { count: 0, nextStartAfter };
  }

  const rows = allDenverItems.map((item) => {
    const { lat, lng } = parseCoords(item.Pattern ?? null);
    return {
      event_id: String(item.CatalogItemId),
      name: item.Name ?? null,
      description: item.Description ?? null,
      image_url: item.ImageUrl ?? null,
      url: item.Url ?? null,
      price: item.CurrentPrice ? parseFloat(item.CurrentPrice) : null,
      venue_name: item.Material ?? null,
      venue_address: item.ShippingLabel ?? null,
      venue_lat: lat,
      venue_lng: lng,
      neighborhood_slug: lat && lng ? assignNeighborhood(lat, lng) : null,
      category: item.Category ?? null,
      subcategory: item.SubCategory ?? null,
      next_date: parseNextDate(item.Manufacturer ?? null),
      expiration_date: item.ExpirationDate ?? null,
      popularity: item.Numeric1 != null ? parseFloat(item.Numeric1) : null,
      synced_at: new Date().toISOString(),
    };
  }).filter((r) => r.event_id && r.name && r.url);

  // Only delete expired events on the first batch
  if (!startAfter) {
    await supabaseAdmin.from("fever_events").delete().lt("expiration_date", now);
  }

  let inserted = 0;
  for (let i = 0; i < rows.length; i += 50) {
    const chunk = rows.slice(i, i + 50);
    const { error } = await supabaseAdmin
      .from("fever_events")
      .upsert(chunk, { onConflict: "event_id" });
    if (error) console.error(`[fever] chunk ${i}-${i + 50} error:`, error.message);
    else inserted += chunk.length;
  }

  console.log(`[fever] upserted ${inserted}/${rows.length} Denver events`);
  return { count: rows.length, nextStartAfter };
}

export async function getFeverEvents(limit = 12): Promise<FeverEvent[]> {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("fever_events")
    .select("*")
    .or(`expiration_date.is.null,expiration_date.gt.${now}`)
    .order("popularity", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[fever] getFeverEvents error:", error.message);
    return [];
  }
  return (data ?? []) as FeverEvent[];
}

export async function getFeverEventsByCategory(
  subcategory: string,
  limit = 8
): Promise<FeverEvent[]> {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("fever_events")
    .select("*")
    .ilike("subcategory", `%${subcategory}%`)
    .or(`expiration_date.is.null,expiration_date.gt.${now}`)
    .order("popularity", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[fever] getFeverEventsByCategory error:", error.message);
    return [];
  }
  return (data ?? []) as FeverEvent[];
}

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
  // Format: "(lat; lng)"
  const match = pattern.match(/\(?([\d.-]+);\s*([\d.-]+)\)?/);
  if (!match) return { lat: null, lng: null };
  return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
}

function parseNextDate(manufacturer: string | null): string | null {
  if (!manufacturer) return null;
  // Comma-separated date strings — take the first upcoming one
  const dates = manufacturer.split(",").map((d) => d.trim()).filter(Boolean);
  const now = new Date().toISOString();
  const upcoming = dates.find((d) => d > now);
  return upcoming ?? dates[0] ?? null;
}

export async function syncFeverEvents(): Promise<number> {
  const IMPACT_ACCOUNT_SID = process.env.IMPACT_ACCOUNT_SID;
  const IMPACT_AUTH_TOKEN = process.env.IMPACT_AUTH_TOKEN;

  if (!IMPACT_ACCOUNT_SID || !IMPACT_AUTH_TOKEN) {
    throw new Error("IMPACT_ACCOUNT_SID or IMPACT_AUTH_TOKEN not set");
  }

  const credentials = Buffer.from(`${IMPACT_ACCOUNT_SID}:${IMPACT_AUTH_TOKEN}`).toString("base64");
  const headers = { Authorization: `Basic ${credentials}` };
  const now = new Date().toISOString();

  const allDenverItems: any[] = [];
  let page = 1;
  const pageSize = 100;

  while (true) {
    const apiUrl = `https://api.impact.com/Mediapartners/${IMPACT_ACCOUNT_SID}/Catalogs/${CATALOG_ID}/Items?PageSize=${pageSize}&Page=${page}`;
    const res = await fetch(apiUrl, { headers });

    if (!res.ok) {
      console.error(`[fever] API error page ${page}:`, res.status, await res.text());
      break;
    }

    const data = await res.json();
    const items: any[] = data.Items ?? [];

    if (items.length === 0) break;

    // Filter to Denver USD events with future expiration
    const denverItems = items.filter(
      (item) =>
        item.Text2 === "Denver" &&
        item.Currency === "USD" &&
        item.Category !== "Tier 4" && // non-commissionable
        (!item.ExpirationDate || item.ExpirationDate > now)
    );
    allDenverItems.push(...denverItems);

    const totalItems = data.TotalCount ?? 0;
    const totalPages = Math.ceil(totalItems / pageSize);
    console.log(`[fever] page ${page}/${totalPages}, found ${denverItems.length} Denver items this page`);

    if (page >= totalPages) break;
    page++;
  }

  if (allDenverItems.length === 0) {
    console.log("[fever] no Denver items found");
    return 0;
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

  // Delete expired events
  await supabaseAdmin.from("fever_events").delete().lt("expiration_date", now);

  // Upsert in chunks
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
  return rows.length;
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

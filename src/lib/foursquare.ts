export interface FoursquareTip {
  id: string;
  text: string;
  agree_count: number;
  created_at: string;
}

export interface FoursquareData {
  fsq_id: string;
  tips: FoursquareTip[];
}

const API_KEY = process.env.FOURSQUARE_API_KEY;
const FSQ_VERSION = "2025-06-17";

async function fsqFetch(path: string): Promise<any | null> {
  if (!API_KEY) return null;
  try {
    const res = await fetch(`https://places-api.foursquare.com${path}`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        Accept: "application/json",
        "X-Places-Api-Version": FSQ_VERSION,
      },
      next: { revalidate: 0 },
    });
    if (!res.ok) {
      console.error("Foursquare API error:", res.status, path);
      return null;
    }
    return res.json();
  } catch (e) {
    console.error("Foursquare fetch error:", e);
    return null;
  }
}

async function searchFsqId(
  name: string,
  lat: number | null,
  lng: number | null
): Promise<string | null> {
  // Try with coordinates first (500m radius)
  if (lat && lng) {
    const params = new URLSearchParams({ query: name, limit: "1", ll: `${lat},${lng}`, radius: "500" });
    const data = await fsqFetch(`/places/search?${params}`);
    const id = data?.results?.[0]?.fsq_place_id ?? null;
    if (id) return id;
  }

  // Fallback: search by name near Denver
  const params = new URLSearchParams({ query: name, limit: "1", near: "Denver, CO" });
  const data = await fsqFetch(`/places/search?${params}`);
  return data?.results?.[0]?.fsq_place_id ?? null;
}

async function fetchTips(fsqId: string): Promise<FoursquareTip[]> {
  const data = await fsqFetch(`/places/${fsqId}/tips?limit=5&sort=POPULAR`);
  if (!data) return [];
  // API returns a bare array
  const arr = Array.isArray(data) ? data : (data.results ?? []);
  return arr.slice(0, 5).map((t: any) => ({
    id: t.fsq_tip_id ?? t.id ?? "",
    text: t.text ?? "",
    agree_count: t.agree_count ?? 0,
    created_at: t.created_at ?? "",
  })).filter((t: FoursquareTip) => t.text.length > 0);
}

export async function getFoursquareData(
  name: string,
  lat: number | null,
  lng: number | null,
  existingFsqId?: string | null
): Promise<FoursquareData | null> {
  if (!API_KEY) return null;
  try {
    const fsqId = existingFsqId ?? (await searchFsqId(name, lat, lng));
    if (!fsqId) return null;
    const tips = await fetchTips(fsqId);
    return { fsq_id: fsqId, tips };
  } catch (e) {
    console.error("getFoursquareData error:", e);
    return null;
  }
}

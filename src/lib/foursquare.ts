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

async function fsqFetch(path: string): Promise<any | null> {
  if (!API_KEY) return null;
  try {
    const res = await fetch(`https://api.foursquare.com/v3${path}`, {
      headers: { Authorization: API_KEY, Accept: "application/json" },
      next: { revalidate: 0 }, // always fresh, we handle caching ourselves
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function searchFsqId(
  name: string,
  lat: number | null,
  lng: number | null
): Promise<string | null> {
  const params = new URLSearchParams({ query: name, limit: "1" });
  if (lat && lng) {
    params.set("ll", `${lat},${lng}`);
    params.set("radius", "250");
  } else {
    params.set("near", "Denver, CO");
  }
  const data = await fsqFetch(`/places/search?${params}`);
  return data?.results?.[0]?.fsq_id ?? null;
}

async function fetchTips(fsqId: string): Promise<FoursquareTip[]> {
  const data = await fsqFetch(`/places/${fsqId}/tips?limit=5&sort=POPULAR`);
  if (!data) return [];
  return (data as any[]).slice(0, 5).map((t: any) => ({
    id: t.id,
    text: t.text,
    agree_count: t.agree_count ?? 0,
    created_at: t.created_at ?? "",
  }));
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
  } catch {
    return null;
  }
}

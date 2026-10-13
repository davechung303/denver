import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const maxDuration = 300;

const PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY!;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const STORAGE_BUCKET = "place-photos";
const VALID_PHOTO_NAME = /^places\/[A-Za-z0-9_-]+\/photos\/[A-Za-z0-9_-]+$/;

async function fetchAndStorePhoto(photoName: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const googleUrl = `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=800&maxHeightPx=500&key=${PLACES_API_KEY}`;
    const res = await fetch(googleUrl);
    if (!res.ok) return { ok: false, error: `google_status=${res.status}` };

    const buffer = await res.arrayBuffer();
    const contentType = res.headers.get("content-type") ?? "image/jpeg";
    const ext = contentType.includes("png") ? "png" : contentType.includes("webp") ? "webp" : "jpg";
    const storagePath = `${photoName}.${ext}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .upload(storagePath, Buffer.from(buffer), { contentType, upsert: true, cacheControl: "31536000" });

    if (uploadError) return { ok: false, error: uploadError.message };

    const storageUrl = `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${storagePath}`;
    const { error: cacheError } = await supabaseAdmin
      .from("photo_cache")
      .upsert({ photo_name: photoName, cdn_url: storageUrl }, { onConflict: "photo_name" });

    if (cacheError) return { ok: false, error: cacheError.message };
    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: e.message };
  }
}

export async function GET(request: Request) {
  const auth = request.headers.get("Authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const batchSize = parseInt(url.searchParams.get("batch") ?? "50");

  // Build the set of place_ids that already have at least one photo in Storage.
  // Photo names look like places/{PLACE_ID}/photos/{ref}; the ref rotates, the
  // place_id doesn't — so key the "already have an image" check on the place.
  const cachedPlaceIds = new Set<string>();
  let cachePage = 0;
  const CACHE_PAGE = 1000;
  while (true) {
    const { data: cachedRows } = await supabaseAdmin
      .from("photo_cache")
      .select("photo_name")
      .range(cachePage * CACHE_PAGE, (cachePage + 1) * CACHE_PAGE - 1);
    if (!cachedRows || cachedRows.length === 0) break;
    for (const r of cachedRows) {
      const id = (r.photo_name as string).split("/")[1];
      if (id) cachedPlaceIds.add(id);
    }
    if (cachedRows.length < CACHE_PAGE) break;
    cachePage++;
  }

  // Only places refreshed recently have photo names Google will still honour
  // (names expire after ~2 weeks). Older places get picked up after the next
  // monthly refresh-places run.
  const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();

  let page = 0;
  const PAGE = 500;
  const uncached: string[] = [];

  while (true) {
    const { data: places } = await supabaseAdmin
      .from("places")
      .select("place_id, photos")
      .not("photos", "is", null)
      .gte("cached_at", fourteenDaysAgo)
      .range(page * PAGE, (page + 1) * PAGE - 1);

    if (!places || places.length === 0) break;

    for (const place of places) {
      // One image per place is enough — skip anything that already has one,
      // and only ever warm photos[0].
      if (cachedPlaceIds.has(place.place_id)) continue;
      const first = (place.photos as { name: string }[] | null)?.[0];
      if (first?.name && VALID_PHOTO_NAME.test(first.name)) uncached.push(first.name);
    }

    if (places.length < PAGE) break;
    page++;
  }

  if (uncached.length === 0) {
    return NextResponse.json({ total_uncached: 0, warmed: 0, failed: 0, remaining: 0 });
  }

  const toWarm = uncached.slice(0, batchSize);
  let warmed = 0;
  let failed = 0;

  const CONCURRENCY = 5;
  for (let i = 0; i < toWarm.length; i += CONCURRENCY) {
    const chunk = toWarm.slice(i, i + CONCURRENCY);
    const results = await Promise.all(chunk.map(fetchAndStorePhoto));
    warmed += results.filter((r) => r.ok).length;
    failed += results.filter((r) => !r.ok).length;
    if (i + CONCURRENCY < toWarm.length) {
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  return NextResponse.json({
    total_uncached: uncached.length,
    warmed,
    failed,
    remaining: uncached.length - toWarm.length,
  });
}

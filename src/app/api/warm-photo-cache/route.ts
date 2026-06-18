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

  // Get all cached photo names — paginate to avoid Supabase 1000-row default limit
  const cached = new Set<string>();
  let cachePage = 0;
  const CACHE_PAGE = 1000;
  while (true) {
    const { data: cachedRows } = await supabaseAdmin
      .from("photo_cache")
      .select("photo_name")
      .range(cachePage * CACHE_PAGE, (cachePage + 1) * CACHE_PAGE - 1);
    if (!cachedRows || cachedRows.length === 0) break;
    for (const r of cachedRows) cached.add(r.photo_name);
    if (cachedRows.length < CACHE_PAGE) break;
    cachePage++;
  }

  // Only warm photos from places refreshed within the last 7 days.
  // Google photo names expire in ~2 weeks, so names older than 7 days have
  // a high failure rate. Places outside this window need a fresh refresh-places run first.
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  let page = 0;
  const PAGE = 500;
  const uncached: string[] = [];

  while (true) {
    const { data: places } = await supabaseAdmin
      .from("places")
      .select("photos")
      .not("photos", "is", null)
      .gte("cached_at", sevenDaysAgo)
      .range(page * PAGE, (page + 1) * PAGE - 1);

    if (!places || places.length === 0) break;

    for (const place of places) {
      const photos = place.photos as { name: string }[] | null;
      if (!photos) continue;
      for (const photo of photos) {
        if (photo?.name && VALID_PHOTO_NAME.test(photo.name) && !cached.has(photo.name)) {
          uncached.push(photo.name);
        }
      }
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

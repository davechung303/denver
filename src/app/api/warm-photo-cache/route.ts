import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const maxDuration = 300;

const PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY!;
const VALID_PHOTO_NAME = /^places\/[A-Za-z0-9_-]+\/photos\/[A-Za-z0-9_-]+$/;

async function fetchAndCachePhoto(photoName: string): Promise<{ ok: boolean; error?: string; cdnUrl?: string }> {
  try {
    const googleUrl = `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=800&maxHeightPx=500&key=${PLACES_API_KEY}`;
    const redirectRes = await fetch(googleUrl, { redirect: "manual" });
    const cdnUrl = redirectRes.headers.get("location");
    if (!cdnUrl) return { ok: false, error: `no_redirect status=${redirectRes.status}` };
    const { error } = await supabaseAdmin
      .from("photo_cache")
      .upsert({ photo_name: photoName, cdn_url: cdnUrl }, { onConflict: "photo_name" });
    if (error) return { ok: false, error: error.message, cdnUrl };
    return { ok: true, cdnUrl };
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

  // Get all photo names from places
  let page = 0;
  const PAGE = 500;
  const uncached: string[] = [];

  while (true) {
    const { data: places } = await supabaseAdmin
      .from("places")
      .select("photos")
      .not("photos", "is", null)
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

  // Just test the first photo to surface any errors before running a full batch
  if (uncached.length === 0) {
    return NextResponse.json({ total_uncached: 0, warmed: 0, failed: 0, remaining: 0 });
  }

  const testResult = await fetchAndCachePhoto(uncached[0]);
  if (!testResult.ok) {
    return NextResponse.json({ error: testResult.error, photo: uncached[0], cdnUrl: testResult.cdnUrl }, { status: 500 });
  }

  // Test passed — warm the full batch
  const toWarm = uncached.slice(0, batchSize);
  let warmed = 1; // already warmed the test photo
  let failed = 0;

  const CONCURRENCY = 5;
  for (let i = 1; i < toWarm.length; i += CONCURRENCY) {
    const chunk = toWarm.slice(i, i + CONCURRENCY);
    const results = await Promise.all(chunk.map(fetchAndCachePhoto));
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

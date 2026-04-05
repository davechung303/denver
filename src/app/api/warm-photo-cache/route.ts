import { NextResponse } from "next/server";
import { supabase, supabaseAdmin } from "@/lib/supabase";

export const maxDuration = 300;

const PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY!;
const VALID_PHOTO_NAME = /^places\/[A-Za-z0-9_-]+\/photos\/[A-Za-z0-9_-]+$/;

async function fetchAndCachePhoto(photoName: string): Promise<boolean> {
  try {
    const googleUrl = `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=800&maxHeightPx=500&key=${PLACES_API_KEY}`;
    const redirectRes = await fetch(googleUrl, { redirect: "manual" });
    const cdnUrl = redirectRes.headers.get("location");
    if (!cdnUrl) return false;
    await supabaseAdmin
      .from("photo_cache")
      .upsert({ photo_name: photoName, cdn_url: cdnUrl }, { onConflict: "photo_name" });
    return true;
  } catch {
    return false;
  }
}

export async function GET(request: Request) {
  const auth = request.headers.get("Authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const batchSize = parseInt(url.searchParams.get("batch") ?? "50");

  // Get all cached photo names
  const { data: cachedRows } = await supabase
    .from("photo_cache")
    .select("photo_name");
  const cached = new Set((cachedRows ?? []).map((r: { photo_name: string }) => r.photo_name));

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

  // Warm up to batchSize uncached photos
  const toWarm = uncached.slice(0, batchSize);
  let warmed = 0;
  let failed = 0;

  // Process in parallel batches of 5 to stay within rate limits
  const CONCURRENCY = 5;
  for (let i = 0; i < toWarm.length; i += CONCURRENCY) {
    const chunk = toWarm.slice(i, i + CONCURRENCY);
    const results = await Promise.all(chunk.map(fetchAndCachePhoto));
    warmed += results.filter(Boolean).length;
    failed += results.filter((r) => !r).length;
    // Small pause between batches
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

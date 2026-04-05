import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY!;

// Only allow well-formed Places photo resource names — prevents this endpoint
// from being used as an arbitrary Google API proxy by bots or attackers.
const VALID_PHOTO_NAME = /^places\/[A-Za-z0-9_-]+\/photos\/[A-Za-z0-9_-]+$/;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const photoName = searchParams.get("name");

  if (!photoName || !VALID_PHOTO_NAME.test(photoName)) {
    return new NextResponse("Invalid photo name", { status: 400 });
  }

  // Check the persistent photo cache first — avoids hitting Google on every request.
  // CDN cache is purged on every deploy, but Supabase persists across deploys.
  // Use admin client to bypass RLS on photo_cache.
  const { data: cached } = await supabaseAdmin
    .from("photo_cache")
    .select("cdn_url")
    .eq("photo_name", photoName)
    .single();

  if (cached?.cdn_url) {
    return NextResponse.redirect(cached.cdn_url, {
      status: 301,
      headers: {
        "Cache-Control": "public, max-age=2592000, s-maxage=2592000",
      },
    });
  }

  // Cache miss — fetch from Google, capture the redirect URL, store it.
  const googleUrl = `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=800&maxHeightPx=500&key=${PLACES_API_KEY}`;

  try {
    // First pass: follow redirect manually to capture the CDN URL
    const redirectRes = await fetch(googleUrl, { redirect: "manual" });
    const cdnUrl = redirectRes.headers.get("location");

    if (cdnUrl) {
      // Store in Supabase so future requests (including after deploys) are free
      await supabaseAdmin
        .from("photo_cache")
        .upsert({ photo_name: photoName, cdn_url: cdnUrl }, { onConflict: "photo_name" });

      return NextResponse.redirect(cdnUrl, {
        status: 301,
        headers: {
          "Cache-Control": "public, max-age=2592000, s-maxage=2592000",
        },
      });
    }

    // Fallback: follow redirect and return image bytes if redirect URL not captured
    const res = await fetch(googleUrl);
    if (!res.ok) return new NextResponse("Photo fetch failed", { status: 502 });
    const buffer = await res.arrayBuffer();
    const contentType = res.headers.get("content-type") ?? "image/jpeg";
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=2592000, s-maxage=2592000, stale-while-revalidate=86400",
      },
    });
  } catch {
    return new NextResponse("Error", { status: 500 });
  }
}

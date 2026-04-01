import { NextResponse } from "next/server";

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

  const googleUrl = `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=800&maxHeightPx=500&key=${PLACES_API_KEY}`;

  try {
    const res = await fetch(googleUrl);
    if (!res.ok) return new NextResponse("Photo fetch failed", { status: 502 });
    const buffer = await res.arrayBuffer();
    const contentType = res.headers.get("content-type") ?? "image/jpeg";
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        // 30-day CDN + browser cache — place photos are stable, re-fetching is expensive
        "Cache-Control": "public, max-age=2592000, s-maxage=2592000, stale-while-revalidate=86400",
      },
    });
  } catch {
    return new NextResponse("Error", { status: 500 });
  }
}

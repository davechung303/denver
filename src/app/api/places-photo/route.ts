import { NextResponse, after } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY!;
const STORAGE_BUCKET = "place-photos";
const STORAGE_BASE = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}`;

// Only allow well-formed Places photo resource names — prevents this endpoint
// from being used as an arbitrary Google API proxy by bots or attackers.
const VALID_PHOTO_NAME = /^places\/[A-Za-z0-9_-]+\/photos\/[A-Za-z0-9_-]+$/;

// 1×1 transparent GIF — returned when a photo name is expired or invalid.
// Browsers render it as nothing (no broken-image icon), and the card's
// bg-slate-100 placeholder colour shows through instead.
const TRANSPARENT_GIF = Buffer.from("R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", "base64");

function placeholderResponse() {
  return new NextResponse(TRANSPARENT_GIF, {
    headers: {
      "Content-Type": "image/gif",
      "Cache-Control": "public, max-age=300, s-maxage=60",
    },
  });
}

function imageResponse(buffer: ArrayBuffer, contentType: string) {
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=2592000, s-maxage=2592000",
    },
  });
}

// Upload the bytes we just paid Google for and record them in photo_cache so the
// next request for this place is a free 301. Every supabase-js call here is
// awaited on purpose: PostgrestBuilder only sends its request when `.then()` runs,
// so an un-awaited `.upsert()` / `.update()` is silently a no-op. That no-op is why
// the proxy kept re-buying the same ~300 photos a day — Storage filled up with
// files that photo_cache never knew about. Callers run this inside `after()` so the
// image is still served immediately.
async function persistPhoto(photoName: string, buffer: ArrayBuffer, contentType: string) {
  const ext = contentType.includes("png") ? "png" : contentType.includes("webp") ? "webp" : "jpg";
  const storagePath = `${photoName}.${ext}`;
  const cdnUrl = `${STORAGE_BASE}/${storagePath}`;

  const { error: uploadError } = await supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .upload(storagePath, Buffer.from(buffer), { contentType, upsert: true, cacheControl: "31536000" });
  if (uploadError) {
    console.error("places-photo: storage upload failed", photoName, uploadError.message);
    return;
  }

  const { error: cacheError } = await supabaseAdmin
    .from("photo_cache")
    .upsert({ photo_name: photoName, cdn_url: cdnUrl }, { onConflict: "photo_name" });
  if (cacheError) {
    console.error("places-photo: photo_cache upsert failed", photoName, cacheError.message);
  }
}

async function recordFreshPhotoNames(placeId: string, photos: { name: string }[]) {
  const { error } = await supabaseAdmin
    .from("places")
    .update({ photos, cached_at: new Date().toISOString() })
    .eq("place_id", placeId);
  if (error) {
    console.error("places-photo: places.photos update failed", placeId, error.message);
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const photoName = searchParams.get("name");

  if (!photoName || !VALID_PHOTO_NAME.test(photoName)) {
    return new NextResponse("Invalid photo name", { status: 400 });
  }

  // Check photo_cache first — may hold a permanent Supabase Storage URL or a Google CDN URL.
  const { data: cached } = await supabaseAdmin
    .from("photo_cache")
    .select("cdn_url")
    .eq("photo_name", photoName)
    .single();

  if (cached?.cdn_url) {
    return NextResponse.redirect(cached.cdn_url, {
      status: 301,
      headers: { "Cache-Control": "public, max-age=31536000, s-maxage=31536000, immutable" },
    });
  }

  // Cache miss on this exact name. Google rotates photo names, and old URLs stay in
  // Google's index and in crawlers for months — this was the biggest line item on the
  // bill (~1,000 Google photo fetches/day at $0.007). If we already hold ANY photo for
  // this place, serve that instead. One image per place is all the site needs.
  const placeId = photoName.split("/")[1];
  if (placeId) {
    const { data: anyForPlace } = await supabaseAdmin
      .from("photo_cache")
      .select("cdn_url")
      .like("photo_name", `places/${placeId}/photos/%`)
      .limit(1)
      .maybeSingle();
    if (anyForPlace?.cdn_url) {
      return NextResponse.redirect(anyForPlace.cdn_url, {
        status: 301,
        headers: { "Cache-Control": "public, max-age=31536000, s-maxage=31536000, immutable" },
      });
    }
  }

  // Genuinely new place with nothing stored — fetch image bytes from Google.
  const googleUrl = `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=800&maxHeightPx=500&key=${PLACES_API_KEY}`;

  try {
    const res = await fetch(googleUrl);

    // Photo name expired — try to heal: fetch fresh names from Google Places API,
    // update the DB, then serve the fresh photo.
    if (!res.ok) {
      if (placeId) {
        const freshRes = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
          headers: { "X-Goog-Api-Key": PLACES_API_KEY, "X-Goog-FieldMask": "photos" },
        });
        if (freshRes.ok) {
          const freshData = await freshRes.json();
          const freshPhotos: { name: string }[] | undefined = freshData.photos
            ?.slice(0, 3)
            .map((p: { name: string }) => ({ name: p.name }));
          if (freshPhotos?.length) {
            after(() => recordFreshPhotoNames(placeId, freshPhotos));
            // Try to serve the first fresh photo
            const freshPhotoUrl = `https://places.googleapis.com/v1/${freshPhotos[0].name}/media?maxWidthPx=800&maxHeightPx=500&key=${PLACES_API_KEY}`;
            const freshImgRes = await fetch(freshPhotoUrl);
            if (freshImgRes.ok) {
              const buffer = await freshImgRes.arrayBuffer();
              const contentType = freshImgRes.headers.get("content-type") ?? "image/jpeg";
              after(() => persistPhoto(freshPhotos[0].name, buffer, contentType));
              return imageResponse(buffer, contentType);
            }
          }
        }
      }
      return placeholderResponse();
    }

    const buffer = await res.arrayBuffer();
    const contentType = res.headers.get("content-type") ?? "image/jpeg";

    // Serve bytes immediately; persist to Storage + photo_cache after the response
    // is sent so the next request for this place is a free redirect.
    after(() => persistPhoto(photoName, buffer, contentType));
    return imageResponse(buffer, contentType);
  } catch {
    return placeholderResponse();
  }
}

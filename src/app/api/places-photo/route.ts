import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY!;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const STORAGE_BUCKET = "place-photos";

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
      "Cache-Control": "public, max-age=86400",
    },
  });
}

function storagePublicUrl(photoName: string): string {
  return `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${photoName}`;
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

  // Check if the image is already in Supabase Storage (e.g. uploaded by warm-photo-cache)
  // by probing the public URL before hitting Google.
  const storageUrl = storagePublicUrl(photoName);
  const storageCheck = await fetch(storageUrl, { method: "HEAD" });
  if (storageCheck.ok) {
    // Already in storage — write to cache and redirect
    await supabaseAdmin
      .from("photo_cache")
      .upsert({ photo_name: photoName, cdn_url: storageUrl }, { onConflict: "photo_name" });
    return NextResponse.redirect(storageUrl, {
      status: 301,
      headers: { "Cache-Control": "public, max-age=31536000, s-maxage=31536000, immutable" },
    });
  }

  // Cache miss — fetch image bytes from Google.
  const googleUrl = `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=800&maxHeightPx=500&key=${PLACES_API_KEY}`;

  try {
    const res = await fetch(googleUrl);
    if (!res.ok) return placeholderResponse();

    const buffer = await res.arrayBuffer();
    const contentType = res.headers.get("content-type") ?? "image/jpeg";
    const ext = contentType.includes("png") ? "png" : contentType.includes("webp") ? "webp" : "jpg";
    const storagePath = `${photoName}.${ext}`;
    const finalStorageUrl = storagePublicUrl(storagePath);

    // Fire-and-forget: upload to Storage and cache the URL for future requests.
    // We don't await this — the image is served immediately from Google bytes below.
    supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .upload(storagePath, Buffer.from(buffer), { contentType, upsert: true, cacheControl: "31536000" })
      .then(({ error }) => {
        if (!error) {
          supabaseAdmin
            .from("photo_cache")
            .upsert({ photo_name: photoName, cdn_url: finalStorageUrl }, { onConflict: "photo_name" });
        }
      });

    // Serve bytes immediately — fast first load, Storage redirect on subsequent requests.
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=2592000, s-maxage=2592000",
      },
    });
  } catch {
    return placeholderResponse();
  }
}

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { generateReviewSummary } from "@/lib/reviewSummary";

export const maxDuration = 300;

const PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY!;
const CONCURRENCY = 3; // conservative — each slot hits Google + Claude

async function fetchReviews(placeId: string) {
  try {
    const res = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
      headers: { "X-Goog-Api-Key": PLACES_API_KEY, "X-Goog-FieldMask": "reviews" },
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.reviews?.length) return null;
    return data.reviews.slice(0, 5).map((r: any) => ({
      name: r.name,
      relativePublishTimeDescription: r.relativePublishTimeDescription ?? "",
      rating: r.rating ?? 0,
      text: r.text ?? null,
      authorAttribution: r.authorAttribution ?? null,
    }));
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const auth = request.headers.get("Authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const batchSize = parseInt(url.searchParams.get("batch") ?? "50");

  // Fetch places without review_summary — oldest cached_at first so less popular
  // places eventually get coverage too
  const { data: places, error } = await supabaseAdmin
    .from("places")
    .select("place_id, name, category_slug, reviews")
    .is("review_summary", null)
    .order("cached_at", { ascending: true })
    .limit(batchSize);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!places?.length) return NextResponse.json({ processed: 0, remaining: 0 });

  let ok = 0;
  let failed = 0;
  let noReviews = 0;

  // Process in concurrent chunks
  for (let i = 0; i < places.length; i += CONCURRENCY) {
    const chunk = places.slice(i, i + CONCURRENCY);
    await Promise.all(
      chunk.map(async (place) => {
        // Use cached reviews if available, otherwise fetch from Google
        let reviews = place.reviews as any[] | null;
        if (!reviews?.length) {
          reviews = await fetchReviews(place.place_id);
          if (!reviews?.length) {
            noReviews++;
            // Mark with empty sentinel so we don't keep retrying places with no reviews
            await supabaseAdmin
              .from("places")
              .update({ review_summary: { consensus: "", highlights: [], lowlights: [] } })
              .eq("place_id", place.place_id);
            return;
          }
          // Persist fresh reviews
          await supabaseAdmin
            .from("places")
            .update({ reviews })
            .eq("place_id", place.place_id);
        }

        const summary = await generateReviewSummary(place.name, reviews, place.category_slug);
        if (summary) {
          await supabaseAdmin
            .from("places")
            .update({ review_summary: summary })
            .eq("place_id", place.place_id);
          ok++;
        } else {
          failed++;
        }
      })
    );
    // Small pause between chunks to avoid rate-limiting
    if (i + CONCURRENCY < places.length) {
      await new Promise((r) => setTimeout(r, 300));
    }
  }

  return NextResponse.json({
    processed: places.length,
    summaries_generated: ok,
    no_reviews: noReviews,
    failed,
  });
}

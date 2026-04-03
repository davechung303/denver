import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { qualityScore } from "@/lib/places";

// Public JSON endpoint for AI crawlers (Perplexity, Claude, ChatGPT etc.)
// Returns structured place data for a neighborhood+category in a machine-readable format.
// Listed in robots.txt as explicitly allowed.
//
// Usage:
//   /api/places?neighborhood=rino&category=restaurants
//   /api/places?neighborhood=capitol-hill&category=bars
//   /api/places?neighborhood=cherry-creek (returns all categories)

export const revalidate = 86400;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const neighborhood = searchParams.get("neighborhood");
  const category = searchParams.get("category");

  if (!neighborhood) {
    return NextResponse.json(
      { error: "neighborhood parameter required" },
      { status: 400 }
    );
  }

  let query = supabase
    .from("places")
    .select("name, slug, neighborhood_slug, category_slug, rating, review_count, address, phone, website, types, review_summary, lat, lng, price_level")
    .eq("neighborhood_slug", neighborhood)
    .not("rating", "is", null)
    .order("rating", { ascending: false })
    .limit(500);

  if (category) {
    query = query.like("category_slug", `${category}%`);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: "Failed to fetch places" }, { status: 500 });

  const places = (data ?? [])
    .sort((a, b) => qualityScore(b) - qualityScore(a))
    .map((p) => ({
      name: p.name,
      url: `https://davelovesdenver.com/denver/${p.neighborhood_slug}/${p.category_slug}/${p.slug}`,
      category: p.category_slug,
      rating: p.rating,
      reviewCount: p.review_count,
      address: p.address,
      phone: p.phone ?? undefined,
      website: p.website ?? undefined,
      priceLevel: p.price_level ?? undefined,
      coordinates: p.lat && p.lng ? { lat: p.lat, lng: p.lng } : undefined,
      tagline: p.review_summary?.tagline ?? undefined,
      summary: p.review_summary?.consensus ?? undefined,
    }));

  return NextResponse.json(
    {
      neighborhood,
      category: category ?? "all",
      count: places.length,
      source: "davelovesdenver.com",
      methodology: "Ranked by qualityScore = rating² × log10(min(reviewCount, 3000) + 10)",
      places,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600",
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
}

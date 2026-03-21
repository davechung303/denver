import { NextResponse } from "next/server";
import { NEIGHBORHOODS, CATEGORIES } from "@/lib/neighborhoods";
import { getPlaces } from "@/lib/places";
import { supabaseAdmin } from "@/lib/supabase";

export const maxDuration = 300;

// Backdate cached_at so getPlaces treats it as a cache miss and re-fetches from Google
async function invalidateCache(neighborhoodSlug: string, categorySlug: string) {
  await supabaseAdmin
    .from("places")
    .update({ cached_at: "2000-01-01T00:00:00Z" })
    .eq("neighborhood_slug", neighborhoodSlug)
    .eq("category_slug", categorySlug);
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const onlyNeighborhood = url.searchParams.get("neighborhood"); // optional: refresh one neighborhood
  const onlyCategory = url.searchParams.get("category");         // optional: refresh one category
  const minResults = parseInt(url.searchParams.get("min") ?? "10"); // skip combos already above this

  const neighborhoods = onlyNeighborhood
    ? NEIGHBORHOODS.filter((n) => n.slug === onlyNeighborhood)
    : NEIGHBORHOODS;
  const categories = onlyCategory
    ? CATEGORIES.filter((c) => c.slug === onlyCategory)
    : CATEGORIES;

  const results: { neighborhood: string; category: string; count: number }[] = [];
  let skipped = 0;

  for (const n of neighborhoods) {
    for (const c of categories) {
      // Check current count
      const { count } = await supabaseAdmin
        .from("places")
        .select("*", { count: "exact", head: true })
        .eq("neighborhood_slug", n.slug)
        .eq("category_slug", c.slug);

      if ((count ?? 0) >= minResults) {
        skipped++;
        continue;
      }

      // Invalidate cache so getPlaces re-fetches from Google
      await invalidateCache(n.slug, c.slug);
      const places = await getPlaces(n.slug, c.slug);
      results.push({ neighborhood: n.slug, category: c.slug, count: places.length });
    }
  }

  return NextResponse.json({ refreshed: results.length, skipped, results });
}

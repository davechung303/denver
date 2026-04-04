import { NextResponse } from "next/server";
import { NEIGHBORHOODS, CATEGORIES } from "@/lib/neighborhoods";
import { refreshPlacesFromGoogle } from "@/lib/places";

export const maxDuration = 300;

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const onlyNeighborhood = url.searchParams.get("neighborhood");
  const onlyCategory = url.searchParams.get("category");

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
      // refreshPlacesFromGoogle checks TTL internally — returns [] if still fresh
      const places = await refreshPlacesFromGoogle(n.slug, c.slug);
      if (places.length === 0) {
        skipped++;
      } else {
        results.push({ neighborhood: n.slug, category: c.slug, count: places.length });
      }
    }
  }

  return NextResponse.json({ refreshed: results.length, skipped, results });
}

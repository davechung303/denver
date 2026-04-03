import type { MetadataRoute } from "next";
import { NEIGHBORHOODS, CATEGORIES } from "@/lib/neighborhoods";
import { SUBCATEGORIES } from "@/lib/subcategories";
import { supabase } from "@/lib/supabase";

const BASE_URL = "https://davelovesdenver.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/articles`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: `${BASE_URL}/events`, lastModified: now, changeFrequency: "daily", priority: 0.6 },
  ];

  const neighborhoodPages: MetadataRoute.Sitemap = NEIGHBORHOODS.map((n) => ({
    url: `${BASE_URL}/denver/${n.slug}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  const categoryPages: MetadataRoute.Sitemap = NEIGHBORHOODS.flatMap((n) =>
    CATEGORIES.map((c) => ({
      url: `${BASE_URL}/denver/${n.slug}/${c.slug}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.8,
    }))
  );

  // Subcategory pages (restaurants/bars subcategories per neighborhood)
  const subcategoryPages: MetadataRoute.Sitemap = NEIGHBORHOODS.flatMap((n) =>
    Object.entries(SUBCATEGORIES).flatMap(([categorySlug, subs]) =>
      subs.map((s) => ({
        url: `${BASE_URL}/denver/${n.slug}/${categorySlug}/${s.slug}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      }))
    )
  );

  // Article pages from Supabase
  const { data: articles } = await supabase
    .from("articles")
    .select("slug, updated_at")
    .order("updated_at", { ascending: false });

  const articlePages: MetadataRoute.Sitemap = (articles ?? []).map((a) => ({
    url: `${BASE_URL}/articles/${a.slug}`,
    lastModified: a.updated_at ? new Date(a.updated_at) : now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Place pages — paginate through all ~2,800 places with real lastModified from cached_at
  const placePages: MetadataRoute.Sitemap = [];
  let from = 0;
  const PAGE_SIZE = 1000;
  while (true) {
    const { data } = await supabase
      .from("places")
      .select("neighborhood_slug, category_slug, slug, cached_at")
      .range(from, from + PAGE_SIZE - 1);
    if (!data || data.length === 0) break;
    for (const p of data) {
      placePages.push({
        url: `${BASE_URL}/denver/${p.neighborhood_slug}/${p.category_slug}/${p.slug}`,
        lastModified: p.cached_at ? new Date(p.cached_at) : now,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      });
    }
    if (data.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }

  return [
    ...staticPages,
    { url: `${BASE_URL}/denver`, lastModified: now, changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${BASE_URL}/denver/hidden-gems`, lastModified: now, changeFrequency: "daily" as const, priority: 0.85 },
    { url: `${BASE_URL}/denver/experiences`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${BASE_URL}/videos`, lastModified: now, changeFrequency: "daily" as const, priority: 0.6 },
    ...neighborhoodPages,
    ...categoryPages,
    ...subcategoryPages,
    ...articlePages,
    ...placePages,
  ];
}

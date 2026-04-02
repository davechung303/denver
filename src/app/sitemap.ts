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

  return [
    ...staticPages,
    ...neighborhoodPages,
    ...categoryPages,
    ...subcategoryPages,
    ...articlePages,
  ];
}

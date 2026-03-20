import type { MetadataRoute } from "next";
import { NEIGHBORHOODS, CATEGORIES } from "@/lib/neighborhoods";

const BASE_URL = "https://davelovesdenver.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
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

  return [...staticPages, ...neighborhoodPages, ...categoryPages];
}

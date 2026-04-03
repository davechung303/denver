import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // General crawlers — allow everything except internal API routes
        userAgent: "*",
        allow: ["/", "/api/places"],
        disallow: ["/api/revalidate-all", "/api/snapshot-places", "/api/places-photo", "/api/ta-map", "/api/ta-refresh"],
      },
      {
        // AI crawlers — explicitly welcome; they respect robots.txt and we want citation
        userAgent: ["PerplexityBot", "GPTBot", "ChatGPT-User", "ClaudeBot", "Google-Extended", "Applebot-Extended"],
        allow: "/",
      },
    ],
    sitemap: "https://davelovesdenver.com/sitemap.xml",
    // llms.txt — structured overview for AI systems
    // https://davelovesdenver.com/llms.txt
  };
}

import Anthropic from "@anthropic-ai/sdk";
import { supabase } from "./supabase";
import { CATEGORIES, NEIGHBORHOODS } from "./neighborhoods";
import type { Place } from "./places";

export interface SearchIntent {
  category_slug: string | null;   // e.g. "restaurants", "hotels"
  neighborhood_slug: string | null; // e.g. "rino", "highlands"
  keywords: string;               // cleaned search terms for name matching
}

export interface SearchResults {
  topResults: Place[];
  relatedResults: Place[];
  intent: SearchIntent;
}

const LISTING_COLUMNS =
  "id, place_id, neighborhood_slug, category_slug, name, slug, address, phone, website, lat, lng, rating, review_count, price_level, hours, photos, types, review_summary, cached_at, expedia_affiliate_url";

// Use Claude Haiku to extract structured search intent
async function parseIntent(q: string): Promise<SearchIntent> {
  const fallback: SearchIntent = { category_slug: null, neighborhood_slug: null, keywords: q };

  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return fallback;

    const client = new Anthropic({ apiKey });

    const categoryNames = CATEGORIES.map((c) => `${c.slug} (${c.name})`).join(", ");
    const neighborhoodNames = NEIGHBORHOODS.map((n) => `${n.slug} (${n.name})`).join(", ");

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 200,
      messages: [
        {
          role: "user",
          content: `Extract search intent from this Denver query. Reply with JSON only, no explanation.

Query: "${q}"

Available category slugs: ${categoryNames}
Available neighborhood slugs: ${neighborhoodNames}

Rules:
- category_slug: match to one of the available slugs, or null if unclear
- neighborhood_slug: match to one of the available slugs, or null if not mentioned
- keywords: the specific place name or food/activity type being searched (e.g. "sushi", "rooftop bar", "Larimer Lounge")

Reply format: {"category_slug": "...", "neighborhood_slug": "...", "keywords": "..."}`,
        },
      ],
    });

    const text = message.content[0].type === "text" ? message.content[0].text.trim() : "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return fallback;

    const parsed = JSON.parse(jsonMatch[0]);
    return {
      category_slug: CATEGORIES.some((c) => c.slug === parsed.category_slug) ? parsed.category_slug : null,
      neighborhood_slug: NEIGHBORHOODS.some((n) => n.slug === parsed.neighborhood_slug) ? parsed.neighborhood_slug : null,
      keywords: parsed.keywords || q,
    };
  } catch {
    return fallback;
  }
}

export async function searchPlaces(q: string): Promise<SearchResults> {
  if (!q?.trim()) {
    return { topResults: [], relatedResults: [], intent: { category_slug: null, neighborhood_slug: null, keywords: q } };
  }

  const intent = await parseIntent(q);
  const { category_slug, neighborhood_slug, keywords } = intent;

  // Run queries in parallel
  const [nameMatchResult, filteredResult, fallbackResult] = await Promise.all([
    // Name/keyword match — broad text search on name
    supabase
      .from("places")
      .select(LISTING_COLUMNS)
      .ilike("name", `%${keywords}%`)
      .order("rating", { ascending: false })
      .limit(20),

    // Category + neighborhood filtered query
    (() => {
      let q = supabase
        .from("places")
        .select(LISTING_COLUMNS)
        .order("rating", { ascending: false })
        .limit(30);
      if (category_slug) q = q.eq("category_slug", category_slug);
      if (neighborhood_slug) q = q.eq("neighborhood_slug", neighborhood_slug);
      // Only run if at least one filter is set
      if (!category_slug && !neighborhood_slug) return Promise.resolve({ data: [], error: null });
      return q;
    })(),

    // Fallback: top-rated places across all categories if nothing else matches
    supabase
      .from("places")
      .select(LISTING_COLUMNS)
      .order("rating", { ascending: false })
      .gte("rating", 4.5)
      .limit(20),
  ]);

  const nameMatches: Place[] = (nameMatchResult.data ?? []) as Place[];
  const filtered: Place[] = (filteredResult.data ?? []) as Place[];
  const fallbackPlaces: Place[] = (fallbackResult.data ?? []) as Place[];

  // Build top results: name matches + high-rated filtered results
  const seenIds = new Set<string>();
  const topResults: Place[] = [];

  // Name matches first (most relevant)
  for (const p of nameMatches) {
    if (!seenIds.has(p.id)) {
      seenIds.add(p.id);
      topResults.push(p);
    }
  }

  // High-rated filtered matches next (4.0+ rating)
  for (const p of filtered) {
    if (!seenIds.has(p.id) && (p.rating ?? 0) >= 4.0) {
      seenIds.add(p.id);
      topResults.push(p);
    }
  }

  // Build related results: remaining filtered + fallback
  const relatedResults: Place[] = [];

  for (const p of filtered) {
    if (!seenIds.has(p.id)) {
      seenIds.add(p.id);
      relatedResults.push(p);
    }
  }

  // If top results are sparse, pull from fallback
  if (topResults.length < 3) {
    for (const p of fallbackPlaces) {
      if (!seenIds.has(p.id) && relatedResults.length < 15) {
        seenIds.add(p.id);
        relatedResults.push(p);
      }
    }
  }

  // Cap at reasonable sizes
  return {
    topResults: topResults.slice(0, 12),
    relatedResults: relatedResults.slice(0, 12),
    intent,
  };
}

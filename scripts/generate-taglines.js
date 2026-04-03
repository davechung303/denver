#!/usr/bin/env node
/**
 * Generates 5-7 word taglines for all places that have reviews but no tagline yet.
 * Run: node scripts/generate-taglines.js
 */

require("dotenv").config({ path: ".env.local" });
const Anthropic = require("@anthropic-ai/sdk").default;
const { createClient } = require("@supabase/supabase-js");

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function generateTagline(place) {
  const reviews = place.reviews ?? [];
  const reviewText = reviews
    .filter((r) => r.text?.text && r.text.text.length > 20)
    .slice(0, 5)
    .map((r) => `${r.rating}/5 — "${r.text.text}"`)
    .join("\n\n");

  const context = reviewText
    ? `Reviews:\n${reviewText}`
    : `Category: ${place.category_slug}\nRating: ${place.rating ?? "unknown"}`;

  const prompt = `Generate a 5-7 word tagline for "${place.name}" (${place.category_slug} in Denver).

The tagline should be lowercase, no period, specific — not generic. Focus on what makes this place unique: a signature dish, a view, a vibe, a standout feature.

Good examples:
- "wood-fired pizza with a perfect char"
- "rooftop views of the whole city"
- "best tonkotsu broth in Denver"
- "connected directly to the terminal"
- "single-origin pour-overs, excellent pastries"
- "laid-back dive bar with great wings"

${context}

Return ONLY the tagline text, nothing else.`;

  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 50,
    messages: [{ role: "user", content: prompt }],
  });

  const tagline = message.content[0].text.trim().replace(/^["']|["']$/g, "").replace(/\.$/, "");
  return tagline;
}

async function run() {
  // Fetch ALL places (paginated — Supabase caps at 1000 rows per request)
  const allPlaces = [];
  const PAGE = 1000;
  let from = 0;
  while (true) {
    const { data, error } = await db
      .from("places")
      .select("place_id, name, category_slug, rating, reviews, review_summary")
      .range(from, from + PAGE - 1);
    if (error) { console.error("Fetch error:", error.message); process.exit(1); }
    if (!data || data.length === 0) break;
    allPlaces.push(...data);
    if (data.length < PAGE) break;
    from += PAGE;
  }

  const places = allPlaces;
  const needsTagline = places.filter((p) => !p.review_summary?.tagline);

  console.log(`${places.length} total places, ${needsTagline.length} need taglines`);

  let done = 0, failed = 0;

  for (const place of needsTagline) {
    try {
      const tagline = await generateTagline(place);
      const updatedSummary = { ...(place.review_summary ?? {}), tagline };

      const { error: updateError } = await db
        .from("places")
        .update({ review_summary: updatedSummary })
        .eq("place_id", place.place_id);

      if (updateError) throw new Error(updateError.message);

      console.log(`✓ [${place.category_slug}] ${place.name}: "${tagline}"`);
      done++;

      // Brief pause to avoid rate limiting
      await new Promise((r) => setTimeout(r, 300));
    } catch (err) {
      console.log(`✗ ${place.name}: ${err.message}`);
      failed++;
    }
  }

  console.log(`\nDone: ${done} taglines generated, ${failed} failed`);
}

run();

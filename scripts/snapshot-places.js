#!/usr/bin/env node
/**
 * Takes a one-time review_count + rating snapshot of all places.
 * Run manually to seed the place_snapshots table before the weekly cron kicks in.
 * Usage: node scripts/snapshot-places.js
 */

require("dotenv").config({ path: ".env.local" });
const { createClient } = require("@supabase/supabase-js");

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
  const now = new Date().toISOString();
  let snapped = 0;
  let page = 0;
  const PAGE = 1000;

  while (true) {
    const { data: places, error } = await db
      .from("places")
      .select("place_id, review_count, rating")
      .not("review_count", "is", null)
      .range(page * PAGE, (page + 1) * PAGE - 1);

    if (error) { console.error("Fetch error:", error.message); process.exit(1); }
    if (!places || places.length === 0) break;

    const rows = places.map((p) => ({
      place_id: p.place_id,
      review_count: p.review_count,
      rating: p.rating,
      snapped_at: now,
    }));

    const { error: insertError } = await db.from("place_snapshots").insert(rows);
    if (insertError) { console.error("Insert error:", insertError.message); process.exit(1); }

    snapped += places.length;
    process.stdout.write(`\rSnapped ${snapped} places...`);
    if (places.length < PAGE) break;
    page++;
  }

  console.log(`\nDone: ${snapped} snapshots recorded at ${now}`);
}

run();

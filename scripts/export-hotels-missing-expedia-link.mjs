// Exports every hotel missing a per-property expedia_affiliate_url deep link to a CSV,
// for use as input to a Cowork/browser-automation pass over the Expedia Creator link builder.
// Usage: node scripts/export-hotels-missing-expedia-link.mjs [output.csv]

import { createClient } from "@supabase/supabase-js";
import { readFileSync, writeFileSync } from "fs";

const env = readFileSync(".env.local", "utf8");
for (const line of env.split("\n")) {
  const [k, ...v] = line.split("=");
  if (k && v.length) process.env[k.trim()] = v.join("=").trim();
}

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const outPath = process.argv[2] ?? "hotels-missing-expedia-link.csv";

// Same filter as isRealHotel()/VACATION_RENTAL_TYPES in src/lib/places.ts — excludes
// Airbnb/VRBO-style listings that got tagged category_slug="hotels" but aren't real hotels.
const HOTEL_TYPES = new Set([
  "lodging", "hotel", "motel", "resort_hotel", "extended_stay_hotel",
  "bed_and_breakfast", "boutique_hotel", "hostel", "inn",
]);
const VACATION_RENTAL_TYPES = new Set(["cottage", "vacation_rental", "vacation_home_rental", "farm"]);
function isRealHotel(place) {
  if (place.types?.some((t) => VACATION_RENTAL_TYPES.has(t))) return false;
  return place.types?.some((t) => HOTEL_TYPES.has(t)) ?? false;
}

function csvEscape(value) {
  const s = value == null ? "" : String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

const { data, error } = await db
  .from("places")
  .select("place_id, name, address, website, neighborhood_slug, rating, review_count, types")
  .eq("category_slug", "hotels")
  .is("expedia_affiliate_url", null)
  .order("review_count", { ascending: false, nullsFirst: false });

if (error) {
  console.error("Query error:", error.message);
  process.exit(1);
}

const realHotels = data.filter(isRealHotel);
const skipped = data.length - realHotels.length;

const header = "place_id,name,address,website,neighborhood_slug,rating,review_count,expedia_affiliate_url";
const rows = realHotels.map((p) =>
  [p.place_id, p.name, p.address, p.website, p.neighborhood_slug, p.rating, p.review_count, ""]
    .map(csvEscape)
    .join(",")
);

writeFileSync(outPath, [header, ...rows].join("\n") + "\n");
console.log(`Wrote ${realHotels.length} real hotels missing an Expedia affiliate link to ${outPath}`);
if (skipped > 0) console.log(`Skipped ${skipped} non-hotel listings (vacation rentals etc.) — not worth an affiliate link.`);
console.log("Sorted by review_count desc — do the highest-traffic hotels first for the best ROI per browser session.");

// Applies expedia_affiliate_url values (generated via Expedia Creator's link builder,
// e.g. by a Cowork/browser-automation pass) back onto the places table.
//
// Input CSV must have at least: expedia_affiliate_url, plus either place_id or name+address.
// (the format produced by scripts/export-hotels-missing-expedia-link.mjs, filled in.)
//
// Matching, per row (only rows with a non-empty expedia_affiliate_url):
//   1. place_id — if that place_id exists in our `places` (category=hotels) data, use it.
//   2. otherwise fall back to name + address (normalized, case-insensitive).
// Rows whose name+address match more than one DB hotel are reported as AMBIGUOUS and skipped.
// Rows matching nothing are reported as UNMATCHED and skipped.
//
// Usage:
//   node scripts/apply-expedia-affiliate-links.mjs hotels.csv            # dry run — report only
//   node scripts/apply-expedia-affiliate-links.mjs hotels.csv --apply    # writes to DB

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

const env = readFileSync(".env.local", "utf8");
for (const line of env.split("\n")) {
  const [k, ...v] = line.split("=");
  if (k && v.length) process.env[k.trim()] = v.join("=").trim();
}

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const inPath = process.argv[2];
const apply = process.argv.includes("--apply");
if (!inPath) {
  console.error("Usage: node scripts/apply-expedia-affiliate-links.mjs <file.csv> [--apply]");
  process.exit(1);
}

// Minimal CSV parser — handles quoted fields with commas/escaped quotes, which is all
// this file needs (values here are hotel names/addresses/URLs, no embedded newlines).
function parseCsv(text) {
  const lines = text.split(/\r?\n/).filter((l) => l.length > 0);
  const header = splitLine(lines[0]);
  return lines.slice(1).map((line) => {
    const cells = splitLine(line);
    return Object.fromEntries(header.map((h, i) => [h, cells[i] ?? ""]));
  });
}
function splitLine(line) {
  const cells = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQuotes) {
      if (c === '"' && line[i + 1] === '"') { cur += '"'; i++; }
      else if (c === '"') inQuotes = false;
      else cur += c;
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ",") { cells.push(cur); cur = ""; }
      else cur += c;
    }
  }
  cells.push(cur);
  return cells;
}

// Normalize for name+address fallback matching: lowercase, strip punctuation, collapse spaces.
function norm(s) {
  return (s ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
const nameAddrKey = (name, address) => `${norm(name)}|${norm(address)}`;

// Sanity check — only accept real Expedia Creator links, so a bad paste doesn't
// silently write garbage (or someone's raw hotel booking URL) into the DB.
const VALID_URL = /^https:\/\/(www\.)?expedia\.com\//i;

// --- Load current hotel rows from the DB to match against ---
const { data: dbHotels, error: dbErr } = await db
  .from("places")
  .select("place_id, name, address, expedia_affiliate_url")
  .eq("category_slug", "hotels");
if (dbErr) {
  console.error("DB query failed:", dbErr.message);
  process.exit(1);
}

const byPlaceId = new Map();
const byNameAddr = new Map(); // key -> array of rows (to detect ambiguity)
for (const h of dbHotels) {
  byPlaceId.set(h.place_id, h);
  const key = nameAddrKey(h.name, h.address);
  if (!byNameAddr.has(key)) byNameAddr.set(key, []);
  byNameAddr.get(key).push(h);
}

// --- Classify each CSV row ---
const rows = parseCsv(readFileSync(inPath, "utf8"));
const skippedEmpty = [];
const skippedInvalid = [];
const unmatched = [];
const ambiguous = [];
const matched = []; // { target: dbRow, via: "place_id"|"name+address", url, csvName }

for (const row of rows) {
  const url = (row.expedia_affiliate_url ?? "").trim();
  if (!url) { skippedEmpty.push(row); continue; }
  if (!VALID_URL.test(url)) { skippedInvalid.push({ ...row, url }); continue; }

  // 1. place_id match (only if that id actually exists in our data)
  const pid = (row.place_id ?? "").trim();
  if (pid && byPlaceId.has(pid)) {
    matched.push({ target: byPlaceId.get(pid), via: "place_id", url, csvName: row.name });
    continue;
  }

  // 2. fall back to name + address
  const key = nameAddrKey(row.name, row.address);
  const hits = byNameAddr.get(key) ?? [];
  if (hits.length === 1) {
    matched.push({ target: hits[0], via: "name+address", url, csvName: row.name });
  } else if (hits.length > 1) {
    ambiguous.push({ row, count: hits.length });
  } else {
    unmatched.push(row);
  }
}

// Split matched into: net-new, changed (overwrite different value), and no-op (already set to same).
const willSet = matched.filter((m) => !m.target.expedia_affiliate_url);
const willOverwrite = matched.filter((m) => m.target.expedia_affiliate_url && m.target.expedia_affiliate_url !== m.url);
const noChange = matched.filter((m) => m.target.expedia_affiliate_url === m.url);
const writes = [...willSet, ...willOverwrite];

// --- Report ---
console.log(`\n=== Expedia affiliate link ${apply ? "APPLY" : "DRY RUN"} ===`);
console.log(`CSV rows: ${rows.length}  |  DB hotels: ${dbHotels.length}`);
console.log(`Matched: ${matched.length}  (place_id: ${matched.filter((m) => m.via === "place_id").length}, name+address: ${matched.filter((m) => m.via === "name+address").length})`);
console.log(`  -> net-new links: ${willSet.length}`);
console.log(`  -> overwrite existing (different): ${willOverwrite.length}`);
console.log(`  -> already up to date (no change): ${noChange.length}`);
console.log(`Unmatched (no place_id or name+address hit): ${unmatched.length}`);
console.log(`Ambiguous (name+address matched >1 hotel): ${ambiguous.length}`);
console.log(`Skipped - blank Expedia URL (no match on Expedia): ${skippedEmpty.length}`);
console.log(`Skipped - URL not an expedia.com link: ${skippedInvalid.length}`);

if (writes.length) {
  console.log(`\n--- Changes that would be written (${writes.length}) ---`);
  for (const m of writes) {
    const from = m.target.expedia_affiliate_url ? m.target.expedia_affiliate_url : "(none)";
    console.log(`  [${m.via}] ${m.target.name}`);
    console.log(`      ${from}  ->  ${m.url}`);
  }
}
if (ambiguous.length) {
  console.log(`\n--- AMBIGUOUS (skipped - resolve by place_id) ---`);
  for (const a of ambiguous) console.log(`  "${a.row.name}" (${a.row.address}) matched ${a.count} DB hotels`);
}
if (unmatched.length) {
  console.log(`\n--- UNMATCHED (skipped) ---`);
  for (const r of unmatched) console.log(`  "${r.name}" (${r.address || "no address"}) place_id=${r.place_id || "none"}`);
}
if (skippedInvalid.length) {
  console.log(`\n--- INVALID URL (skipped) ---`);
  for (const r of skippedInvalid) console.log(`  ${r.name}: ${r.url}`);
}

if (!apply) {
  console.log(`\nDry run only - re-run with --apply to write ${writes.length} link(s) to the DB.`);
  process.exit(0);
}

// --- Apply: write by the matched DB row's place_id (correct even for name+address matches) ---
let ok = 0, failed = 0;
for (const m of writes) {
  const { error } = await db.from("places")
    .update({ expedia_affiliate_url: m.url })
    .eq("place_id", m.target.place_id);
  if (error) { console.error(`FAILED ${m.target.name} (${m.target.place_id}):`, error.message); failed++; }
  else ok++;
}
console.log(`\nApplied ${ok} link(s)${failed > 0 ? `, ${failed} failed` : ""}.`);

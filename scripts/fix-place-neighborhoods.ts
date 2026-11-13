#!/usr/bin/env -S npx tsx
/**
 * Re-file places under the neighborhood they actually sit in.
 *
 * Places were filed under whichever neighborhood's Google search found them,
 * and those searches use radii up to 8 km. That left Malibu Jack's Thornton
 * under Washington Park, Chatfield under Five Points and Lakeside Amusement
 * Park under the airport. This recomputes each place's neighborhood from its
 * coordinates with resolveNeighborhood() in src/lib/neighborhoods.ts.
 *
 * Dry run by default: writes a CSV of every proposed move and changes nothing.
 *
 *   npx tsx scripts/fix-place-neighborhoods.ts            # dry run
 *   npx tsx scripts/fix-place-neighborhoods.ts --apply    # write the moves
 *
 * Moving a place changes its URL. The detail page already 301s an old URL to
 * the place's current one, so links and rankings carry over. Moves that would
 * put two places with the same slug in the same neighborhood and category are
 * skipped and listed, because the detail page can't tell those apart.
 *
 * After --apply, revalidate the site (the weekly cron does it, or hit
 * /api/revalidate-all) so category pages and the sitemap pick up the moves.
 */
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolveNeighborhood, isOutsideMetro } from "../src/lib/neighborhoods";

config({ path: ".env.local" });

const APPLY = process.argv.includes("--apply");
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}
const db = createClient(url, key);

interface Row {
  place_id: string;
  name: string;
  slug: string;
  neighborhood_slug: string;
  category_slug: string;
  lat: number | null;
  lng: number | null;
}

async function loadPlaces(): Promise<Row[]> {
  const out: Row[] = [];
  const PAGE = 1000;
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await db
      .from("places")
      .select("place_id, name, slug, neighborhood_slug, category_slug, lat, lng")
      .order("place_id")
      .range(from, from + PAGE - 1);
    if (error) throw new Error(error.message);
    if (!data?.length) break;
    out.push(...(data as Row[]));
    if (data.length < PAGE) break;
  }
  return out;
}

const csvCell = (v: unknown) => {
  const s = v == null ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

async function main() {
  const places = await loadPlaces();
  console.log(`Loaded ${places.length} places.`);

  // Where every place will end up, so collisions are checked against the final state.
  const target = new Map<string, string>();
  for (const p of places) {
    target.set(p.place_id, resolveNeighborhood(p.lat, p.lng, p.neighborhood_slug) ?? p.neighborhood_slug);
  }

  const occupancy = new Map<string, string[]>();
  for (const p of places) {
    const k = `${target.get(p.place_id)}|${p.category_slug}|${p.slug}`;
    occupancy.set(k, [...(occupancy.get(k) ?? []), p.place_id]);
  }

  type Move = Row & { to: string; status: "move" | "skip-collision"; outside: boolean };
  const moves: Move[] = [];
  for (const p of places) {
    const to = target.get(p.place_id)!;
    if (to === p.neighborhood_slug) continue;
    const k = `${to}|${p.category_slug}|${p.slug}`;
    const collides = (occupancy.get(k) ?? []).length > 1;
    moves.push({ ...p, to, status: collides ? "skip-collision" : "move", outside: isOutsideMetro(p.lat, p.lng) });
  }

  const ready = moves.filter((m) => m.status === "move");
  const skipped = moves.filter((m) => m.status === "skip-collision");
  const outside = moves.filter((m) => m.outside);

  const flows = new Map<string, number>();
  for (const m of ready) flows.set(`${m.neighborhood_slug} -> ${m.to}`, (flows.get(`${m.neighborhood_slug} -> ${m.to}`) ?? 0) + 1);

  mkdirSync("scripts/out", { recursive: true });
  const header = ["status", "name", "category", "from", "to", "outside_metro", "lat", "lng", "old_url", "new_url", "place_id"];
  const lines = [header.join(",")];
  for (const m of moves) {
    lines.push(
      [
        m.status,
        m.name,
        m.category_slug,
        m.neighborhood_slug,
        m.to,
        m.outside ? "yes" : "",
        m.lat,
        m.lng,
        `/denver/${m.neighborhood_slug}/${m.category_slug}/${m.slug}`,
        `/denver/${m.to}/${m.category_slug}/${m.slug}`,
        m.place_id,
      ]
        .map(csvCell)
        .join(",")
    );
  }
  const csvPath = "scripts/out/neighborhood-moves.csv";
  writeFileSync(csvPath, lines.join("\n") + "\n");

  console.log(`\n${ready.length} places to move, ${skipped.length} skipped (slug collision), ${places.length - moves.length} already correct.`);
  console.log(`${outside.length} of the moves sit outside the suburbs box (far-north and far-south suburbs, Boulder, the mountains): check whether they belong on the site at all.`);
  console.log("\nBiggest flows:");
  for (const [flow, n] of [...flows.entries()].sort((a, b) => b[1] - a[1]).slice(0, 25)) {
    console.log(`  ${String(n).padStart(4)}  ${flow}`);
  }
  console.log(`\nFull list: ${csvPath}`);

  if (!APPLY) {
    console.log("\nDry run. Nothing changed. Re-run with --apply to write these moves.");
    return;
  }

  let done = 0;
  for (const m of ready) {
    const { error } = await db.from("places").update({ neighborhood_slug: m.to }).eq("place_id", m.place_id);
    if (error) {
      console.error(`Failed on ${m.name} (${m.place_id}): ${error.message}`);
      process.exit(1);
    }
    done++;
    if (done % 100 === 0) console.log(`  ${done}/${ready.length}`);
  }
  console.log(`\nMoved ${done} places. Revalidate the site so pages and the sitemap pick it up.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

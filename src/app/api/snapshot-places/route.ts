import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// Called weekly by Vercel Cron to capture review_count + rating snapshots.
// These snapshots power the "Trending" section on /denver — velocity =
// reviews gained over the last 30 days.
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date().toISOString();
  let snapped = 0;
  let page = 0;
  const PAGE = 1000;

  while (true) {
    const { data: places, error } = await supabaseAdmin
      .from("places")
      .select("place_id, review_count, rating")
      .not("review_count", "is", null)
      .range(page * PAGE, (page + 1) * PAGE - 1);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (!places || places.length === 0) break;

    const rows = places.map((p: { place_id: string; review_count: number | null; rating: number | null }) => ({
      place_id: p.place_id,
      review_count: p.review_count,
      rating: p.rating,
      snapped_at: now,
    }));

    const { error: insertError } = await supabaseAdmin
      .from("place_snapshots")
      .insert(rows);

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    snapped += places.length;
    if (places.length < PAGE) break;
    page++;
  }

  // Prune snapshots older than 90 days to keep the table lean
  const cutoff = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
  await supabaseAdmin
    .from("place_snapshots")
    .delete()
    .lt("snapped_at", cutoff);

  return NextResponse.json({ snapped, snapped_at: now });
}

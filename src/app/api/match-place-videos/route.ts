import { NextResponse, after } from "next/server";
import { revalidatePath } from "next/cache";
import { matchPlaceVideos, pathsForPlaces } from "@/lib/placeVideos";

export const maxDuration = 300;

const MAX_CHAIN = 60;

// Match videos to the places they feature and write takes from transcripts.
// Safe to call repeatedly: each video is matched once (places_matched_at) and
// each take written once.
//
// Responds immediately and does the work after the response. With chain=1,
// a run that leaves work undone calls this route again, so one trigger (the
// daily cron, or "Run" on the cron job in Vercel) drains the whole backlog.
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "8"), 40);
  const chain = url.searchParams.get("chain") === "1";
  const depth = parseInt(url.searchParams.get("depth") ?? "0");

  after(async () => {
    const result = await matchPlaceVideos(limit, 270_000);
    console.log(`[match-place-videos] depth=${depth}`, JSON.stringify({ ...result, log: undefined, changedPlaceIds: result.changedPlaceIds.length }));
    for (const line of result.log) console.log(`[match-place-videos] ${line}`);

    // Refresh the pages that changed, so a new match shows up now rather than
    // whenever that page's daily ISR window happens to roll over.
    for (const path of await pathsForPlaces(result.changedPlaceIds)) revalidatePath(path);

    const progressed = result.videos > 0 || result.takes > 0;
    if (chain && result.more && progressed && depth < MAX_CHAIN) {
      const next = new URL(url.pathname, url.origin);
      next.searchParams.set("limit", String(limit));
      next.searchParams.set("chain", "1");
      next.searchParams.set("depth", String(depth + 1));
      // The next run answers at once (its work happens in its own after()),
      // so this returns quickly and the runs don't overlap.
      await fetch(next, { headers: { Authorization: `Bearer ${process.env.CRON_SECRET}` } }).catch((err) =>
        console.error("[match-place-videos] chain call failed", err)
      );
    }
  });

  return NextResponse.json({ started: true, limit, chain, depth }, { status: 202 });
}

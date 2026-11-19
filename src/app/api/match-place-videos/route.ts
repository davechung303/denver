import { NextResponse, after } from "next/server";
import { revalidatePath } from "next/cache";
import { matchPlaceVideos, pathsForPlaces } from "@/lib/placeVideos";

export const maxDuration = 300;

// Match videos to the places they feature and write takes from transcripts.
// Safe to call repeatedly: each video is matched once (places_matched_at) and
// each take written once, so a run with nothing to do finishes in a second.
//
// Runs every 10 minutes from vercel.json. (An earlier version had each run
// call the next one; Vercel's loop protection stopped that after four hops.)
// Responds immediately and does the work after the response.
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "8"), 40);

  after(async () => {
    // Budget well under maxDuration (300s): a single AI call can take 30s+.
    const result = await matchPlaceVideos(limit, 190_000);
    if (result.videos > 0 || result.takes > 0 || result.errors > 0) {
      console.log("[match-place-videos]", JSON.stringify({ ...result, log: undefined, changedPlaceIds: result.changedPlaceIds.length }));
      for (const line of result.log) console.log(`[match-place-videos] ${line}`);
    }

    // Refresh the pages that changed, so a new match shows up now rather than
    // whenever that page's daily ISR window happens to roll over.
    for (const path of await pathsForPlaces(result.changedPlaceIds)) revalidatePath(path);
  });

  return NextResponse.json({ started: true, limit }, { status: 202 });
}

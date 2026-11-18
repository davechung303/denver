import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { matchPlaceVideos } from "@/lib/placeVideos";

export const maxDuration = 300;

// Daily: match new videos to the places they feature and write takes from
// their transcripts. Safe to call repeatedly — each video is matched once
// (youtube_videos.places_matched_at) and each take written once.
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "10"), 40);
  const result = await matchPlaceVideos(limit);

  if (result.matched > 0 || result.takes > 0) revalidatePath("/map");
  return NextResponse.json(result);
}

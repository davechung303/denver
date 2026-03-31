import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { generateArticle } from "@/lib/articles";
import { associateVideosWithNeighborhoods } from "@/lib/videoAssociations";

// Manual recovery endpoint: sync a specific video by ID, associate it, and generate its article.
// Usage: GET /api/sync-video?videoId=<ytVideoId>
// Requires Authorization: Bearer <CRON_SECRET>
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const videoId = url.searchParams.get("videoId");
  if (!videoId) {
    return NextResponse.json({ error: "videoId query param required" }, { status: 400 });
  }

  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "YOUTUBE_API_KEY not configured" }, { status: 500 });
  }

  // Fetch video metadata from YouTube
  const ytRes = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet,statistics,contentDetails&key=${apiKey}`
  );
  if (!ytRes.ok) {
    return NextResponse.json({ error: "YouTube API error" }, { status: 502 });
  }
  const ytData = await ytRes.json();
  const item = ytData.items?.[0];
  if (!item) {
    return NextResponse.json({ error: "Video not found on YouTube" }, { status: 404 });
  }

  const s = item.snippet;
  const stats = item.statistics;
  const cd = item.contentDetails;

  // Parse ISO 8601 duration to seconds
  const durMatch = (cd?.duration ?? "").match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  const durationSeconds = durMatch
    ? (parseInt(durMatch[1] ?? "0") * 3600) +
      (parseInt(durMatch[2] ?? "0") * 60) +
      parseInt(durMatch[3] ?? "0")
    : null;

  const videoRow = {
    video_id: videoId,
    title: s.title,
    description: s.description?.slice(0, 1000) ?? null,
    thumbnail_url: s.thumbnails?.high?.url ?? s.thumbnails?.default?.url ?? null,
    view_count: stats?.viewCount ? parseInt(stats.viewCount) : null,
    published_at: s.publishedAt ?? null,
    duration_seconds: durationSeconds,
    tags: s.tags ?? null,
    cached_at: new Date().toISOString(),
  };

  // Upsert into youtube_videos
  const { error: upsertError } = await supabase
    .from("youtube_videos")
    .upsert(videoRow, { onConflict: "video_id" });
  if (upsertError) {
    return NextResponse.json({ error: `DB upsert failed: ${upsertError.message}` }, { status: 500 });
  }

  // Run Claude-based association (picks up any unassociated videos including this one)
  await associateVideosWithNeighborhoods(5);

  // Generate article
  const result = await generateArticle(videoId);

  return NextResponse.json({ videoId, synced: true, article: result });
}

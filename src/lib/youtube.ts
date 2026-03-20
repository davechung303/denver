import { supabase } from "./supabase";

const API_KEY = process.env.YOUTUBE_API_KEY!;
const CHANNEL_HANDLE = "davechung";
const CACHE_TTL_HOURS = 24;

export interface Video {
  id: string;
  video_id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  view_count: number | null;
  published_at: string | null;
  tags: string[] | null;
  cached_at: string;
}

// Keyword maps for matching videos to pages
const NEIGHBORHOOD_KEYWORDS: Record<string, string[]> = {
  rino: ["rino", "river north", "art district"],
  lodo: ["lodo", "lower downtown", "union station", "coors field"],
  "capitol-hill": ["capitol hill", "cap hill"],
  highlands: ["highlands", "lohi", "lo-hi"],
  "cherry-creek": ["cherry creek"],
  "washington-park": ["washington park", "wash park"],
  "five-points": ["five points"],
  cole: ["cole neighborhood", "cole denver"],
  "curtis-park": ["curtis park"],
  baker: ["baker", "south broadway", "sobo"],
  "golden-triangle": ["golden triangle", "santa fe", "art museum"],
  uptown: ["uptown denver"],
  "sloan-lake": ["sloan lake"],
  berkeley: ["tennyson", "berkeley denver"],
  "platt-park": ["platt park", "south pearl"],
  "jefferson-park": ["jefferson park", "jeff park"],
};

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  restaurants: ["restaurant", "food", "eat", "dining", "brunch", "lunch", "dinner", "taco", "burger", "pizza", "sushi", "chef", "menu", "foodie"],
  hotels: ["hotel", "stay", "where to stay", "accommodation", "airbnb", "hostel"],
  bars: ["bar", "drink", "cocktail", "beer", "brewery", "nightlife", "happy hour", "whiskey", "wine"],
  "things-to-do": ["things to do", "activity", "attraction", "visit", "explore", "hike", "park", "museum", "concert", "event"],
  coffee: ["coffee", "cafe", "espresso", "latte", "cappuccino", "roaster"],
};

function scoreText(text: string, keywords: string[]): number {
  const lower = text.toLowerCase();
  return keywords.reduce((score, kw) => score + (lower.includes(kw) ? 1 : 0), 0);
}

function mapVideoToPages(video: { title: string; description: string | null; tags: string[] | null }) {
  const searchText = [video.title, video.description ?? "", ...(video.tags ?? [])].join(" ");
  const associations: { neighborhood_slug: string | null; category_slug: string | null; relevance_score: number }[] = [];

  // Find matching neighborhoods
  const neighborhoodMatches: { slug: string; score: number }[] = [];
  for (const [slug, keywords] of Object.entries(NEIGHBORHOOD_KEYWORDS)) {
    const score = scoreText(searchText, keywords);
    if (score > 0) neighborhoodMatches.push({ slug, score });
  }

  // Find matching categories
  const categoryMatches: { slug: string; score: number }[] = [];
  for (const [slug, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    const score = scoreText(searchText, keywords);
    if (score > 0) categoryMatches.push({ slug, score });
  }

  // Cross-match neighborhoods and categories
  if (neighborhoodMatches.length > 0 && categoryMatches.length > 0) {
    for (const n of neighborhoodMatches) {
      for (const c of categoryMatches) {
        associations.push({
          neighborhood_slug: n.slug,
          category_slug: c.slug,
          relevance_score: n.score + c.score,
        });
      }
    }
  } else if (neighborhoodMatches.length > 0) {
    for (const n of neighborhoodMatches) {
      associations.push({ neighborhood_slug: n.slug, category_slug: null, relevance_score: n.score });
    }
  } else if (categoryMatches.length > 0) {
    for (const c of categoryMatches) {
      associations.push({ neighborhood_slug: null, category_slug: c.slug, relevance_score: c.score });
    }
  }

  return associations;
}

async function getUploadsPlaylistId(): Promise<string | null> {
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?forHandle=${CHANNEL_HANDLE}&part=contentDetails&key=${API_KEY}`
  );
  if (!res.ok) return null;
  const data = await res.json();
  return data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads ?? null;
}

export async function syncVideos(): Promise<{ synced: number; error?: string }> {
  const playlistId = await getUploadsPlaylistId();
  if (!playlistId) return { synced: 0, error: "Could not fetch channel playlist ID" };

  // Fetch all videos from uploads playlist (up to 200)
  let allItems: any[] = [];
  let pageToken: string | undefined;

  do {
    const url = new URL("https://www.googleapis.com/youtube/v3/playlistItems");
    url.searchParams.set("playlistId", playlistId);
    url.searchParams.set("part", "snippet,contentDetails");
    url.searchParams.set("maxResults", "50");
    url.searchParams.set("key", API_KEY);
    if (pageToken) url.searchParams.set("pageToken", pageToken);

    const res = await fetch(url.toString());
    if (!res.ok) break;
    const data = await res.json();
    allItems = allItems.concat(data.items ?? []);
    pageToken = data.nextPageToken;
  } while (pageToken && allItems.length < 200);

  if (allItems.length === 0) return { synced: 0, error: "No videos found" };

  // Fetch statistics for all videos in batches of 50
  const videoIds = allItems.map((item: any) => item.contentDetails.videoId);
  const statsMap: Record<string, any> = {};

  for (let i = 0; i < videoIds.length; i += 50) {
    const batch = videoIds.slice(i, i + 50);
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?id=${batch.join(",")}&part=statistics,snippet&key=${API_KEY}`
    );
    if (!res.ok) continue;
    const data = await res.json();
    for (const item of data.items ?? []) {
      statsMap[item.id] = item;
    }
  }

  // Build video rows
  const videos: Omit<Video, "id">[] = allItems.map((item: any) => {
    const videoId = item.contentDetails.videoId;
    const stats = statsMap[videoId];
    return {
      video_id: videoId,
      title: item.snippet.title,
      description: item.snippet.description?.slice(0, 1000) ?? null,
      thumbnail_url: item.snippet.thumbnails?.high?.url ?? item.snippet.thumbnails?.default?.url ?? null,
      view_count: stats ? parseInt(stats.statistics.viewCount ?? "0") : null,
      published_at: item.snippet.publishedAt ?? null,
      tags: stats?.snippet?.tags ?? null,
      cached_at: new Date().toISOString(),
    };
  });

  // Upsert videos into Supabase
  await supabase.from("youtube_videos").upsert(videos, { onConflict: "video_id" });

  // Build and upsert page associations
  const associations = videos.flatMap((v) =>
    mapVideoToPages(v).map((assoc) => ({
      video_id: v.video_id,
      ...assoc,
    }))
  );

  if (associations.length > 0) {
    await supabase
      .from("video_page_associations")
      .upsert(associations, { onConflict: "video_id,neighborhood_slug,category_slug" });
  }

  return { synced: videos.length };
}

export async function getVideosForPage(
  neighborhoodSlug: string | null,
  categorySlug: string | null,
  limit = 3
): Promise<Video[]> {
  const cutoff = new Date(Date.now() - CACHE_TTL_HOURS * 60 * 60 * 1000).toISOString();

  // Check if we have any cached videos at all
  const { count } = await supabase
    .from("youtube_videos")
    .select("*", { count: "exact", head: true })
    .gt("cached_at", cutoff);

  if (!count || count === 0) {
    await syncVideos();
  }

  // Query via associations
  let query = supabase
    .from("video_page_associations")
    .select("video_id, relevance_score, youtube_videos(video_id, title, description, thumbnail_url, view_count, published_at, tags, cached_at)")
    .order("relevance_score", { ascending: false })
    .limit(limit);

  if (neighborhoodSlug) query = query.eq("neighborhood_slug", neighborhoodSlug);
  if (categorySlug) query = query.eq("category_slug", categorySlug);

  const { data } = await query;

  if (data && data.length > 0) {
    return data.map((row: any) => row.youtube_videos).filter(Boolean) as Video[];
  }

  // Fallback: return latest videos if no associations match
  const { data: latest } = await supabase
    .from("youtube_videos")
    .select("*")
    .order("published_at", { ascending: false })
    .limit(limit);

  return (latest ?? []) as Video[];
}

export function embedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}`;
}

export function watchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

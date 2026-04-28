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
  duration_seconds: number | null;
  tags: string[] | null;
  cached_at: string;
}

// Keyword maps for matching videos to pages
const DENVER_KEYWORDS = [
  "denver", "colorado", "co ", "mile high", "front range",
  "blucifer", "red rocks", "coors field", "union station", "lodo",
  "rino", "river north", "capitol hill", "highlands", "cherry creek",
  "wash park", "washington park", "five points", "baker", "golden triangle",
  "uptown", "sloan lake", "berkeley", "platt park", "jefferson park",
  "aurora", "lakewood", "littleton", "englewood", "arvada", "westminster",
  "thornton", "broomfield", "centennial", "parker", "castle rock",
  "boulder", "fort collins", "colorado springs", "pueblo", "cripple creek",
  "gaylord rockies", "dmns", "denver museum", "denver airport", "dia",
  "denver international", "nuggets", "broncos", "rockies", "avalanche",
  "ball arena", "empower field", "havana", "federal", "colfax",
  "16th street", "larimer", "tennyson", "south pearl", "santa fe",
  "congress park", "city park", "cheesman", "globeville", "swansea",
  "elyria", "montbello", "green valley", "stapleton", "central park",
  "lowry", "hilltop", "mayfair", "hale", "eckerd", "university hills",
  "virginia village", "harvey park", "barnum", "villa park",
  "west colfax", "sloan", "sun valley", "lincoln park",
];

const NEIGHBORHOOD_KEYWORDS: Record<string, string[]> = {
  rino: ["rino", "river north", "art district", "larimer street", "walnut street"],
  lodo: ["lodo", "lower downtown", "union station", "coors field", "16th street mall", "larimer square", "dairy block"],
  "capitol-hill": ["capitol hill", "cap hill", "colfax", "cheesman park", "congress park"],
  highlands: ["highlands", "lohi", "lo-hi", "tennyson", "32nd avenue", "highland bridge"],
  "cherry-creek": ["cherry creek", "fillmore", "steele street"],
  "washington-park": ["washington park", "wash park", "south gaylord", "old south pearl"],
  "five-points": ["five points", "welton", "historic five points"],
  cole: ["cole neighborhood", "cole denver"],
  "curtis-park": ["curtis park", "37th avenue"],
  baker: ["baker", "south broadway", "sobo", "antique row"],
  "golden-triangle": ["golden triangle", "santa fe", "art museum", "clyfford still", "byers"],
  uptown: ["uptown denver", "17th avenue", "restaurant row"],
  "sloan-lake": ["sloan lake", "edgewater", "sheridan"],
  berkeley: ["tennyson street", "berkeley denver", "44th avenue"],
  "platt-park": ["platt park", "south pearl", "pearl street"],
  "jefferson-park": ["jefferson park", "jeff park", "29th avenue"],
  airport: ["denver airport", "dia", "denver international", "blucifer", "airport horse", "united club", "concourse"],
  downtown: ["downtown denver", "16th street", "civic center", "convention center", "union station"],
  "denver-suburbs": ["aurora", "lakewood", "littleton", "englewood", "arvada", "westminster", "thornton", "centennial", "parker", "castle rock", "gaylord rockies", "broomfield"],
};

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  restaurants: [
    "restaurant", "food", "eat", "dining", "brunch", "lunch", "dinner",
    "taco", "burger", "pizza", "sushi", "chef", "menu", "foodie",
    "noodle", "ramen", "bbq", "barbecue", "dim sum", "omakase",
    "chicken", "donuts", "ice cream", "cone", "sushi", "korean",
    "japanese", "chinese", "mexican", "italian", "thai", "vietnamese",
    "green chile", "pickleball", "brunch spot", "conveyor belt",
    "hand-pulled", "crispy", "flavors", "kimchi", "robots", "robot",
    "shark tank", "cursed location", "classic", "neighborhood vibes",
    "hidden", "secret", "best", "new restaurant", "worth trying",
    "challenger", "favorite", "newcomer",
  ],
  hotels: [
    "hotel", "stay", "where to stay", "accommodation", "airbnb", "hostel",
    "resort", "gaylord", "lounge", "club lounge", "castle hotel",
    "legoland hotel", "what it's really like", "full tour", "review",
  ],
  bars: [
    "bar", "drink", "cocktail", "beer", "brewery", "nightlife",
    "happy hour", "whiskey", "wine", "distillery",
  ],
  "things-to-do": [
    "things to do", "activity", "attraction", "visit", "explore",
    "hike", "park", "museum", "concert", "event", "experience",
    "immersive", "lego", "bricks", "dinos", "dinosaur", "titanic",
    "ice castle", "ice slide", "mini golf", "golf course", "pickleball",
    "basketball", "nuggets", "broncos", "rockies", "avalanche",
    "night market", "festival", "japanese festival", "holiday market",
    "christmas", "holiday", "railroad", "loop", "vr", "virtual reality",
    "ancient egypt", "tunnels", "underground", "airport tour",
    "opening night", "crowd", "sneak peek", "what it's really like",
    "worth the drive", "fun or flop", "instagram vs reality",
  ],
  coffee: ["coffee", "cafe", "espresso", "latte", "cappuccino", "roaster"],
};

function scoreText(text: string, keywords: string[]): number {
  const lower = text.toLowerCase();
  return keywords.reduce((score, kw) => score + (lower.includes(kw) ? 1 : 0), 0);
}

function isDenverContent(text: string): boolean {
  const lower = text.toLowerCase();
  return DENVER_KEYWORDS.some((kw) => lower.includes(kw));
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

  const isDenver = isDenverContent(searchText);

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
  } else if (categoryMatches.length > 0 && isDenver) {
    // Denver content with a category but no specific neighborhood — leave neighborhood_slug null
    // so the Claude classifier can assign the right neighborhood later
    for (const c of categoryMatches) {
      associations.push({
        neighborhood_slug: null,
        category_slug: c.slug,
        relevance_score: c.score,
      });
    }
  }

  return associations;
}

async function getPlaylistIds(): Promise<{ uploads: string | null; shorts: string | null }> {
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?forHandle=${CHANNEL_HANDLE}&part=contentDetails,id&key=${API_KEY}`
  );
  if (!res.ok) return { uploads: null, shorts: null };
  const data = await res.json();
  const channelId: string = data.items?.[0]?.id ?? "";
  const uploads: string = data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads ?? null;
  // YouTube Shorts live in a separate UUSH playlist that the uploads playlist omits
  const shorts = channelId ? `UUSH${channelId.replace(/^UC/, "")}` : null;
  return { uploads, shorts };
}

async function fetchPlaylistItems(playlistId: string, max = 200): Promise<any[]> {
  const items: any[] = [];
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
    items.push(...(data.items ?? []));
    pageToken = data.nextPageToken;
  } while (pageToken && items.length < max);
  return items;
}

export async function syncVideos(): Promise<{ synced: number; error?: string }> {
  const { uploads, shorts } = await getPlaylistIds();
  if (!uploads) return { synced: 0, error: "Could not fetch channel playlist ID" };

  // Fetch from both playlists — Shorts often only appear in the UUSH playlist
  const [uploadItems, shortsItems] = await Promise.all([
    fetchPlaylistItems(uploads, 200),
    shorts ? fetchPlaylistItems(shorts, 200) : Promise.resolve([]),
  ]);

  // Deduplicate by video ID (many Shorts appear in both playlists)
  const seen = new Set<string>();
  const allItems = [...uploadItems, ...shortsItems].filter((item) => {
    const id = item.contentDetails?.videoId;
    if (!id || seen.has(id)) return false;
    seen.add(id);
    return true;
  });

  if (allItems.length === 0) return { synced: 0, error: "No videos found" };

  // Fetch statistics for all videos in batches of 50
  const videoIds = allItems.map((item: any) => item.contentDetails.videoId);
  const statsMap: Record<string, any> = {};

  for (let i = 0; i < videoIds.length; i += 50) {
    const batch = videoIds.slice(i, i + 50);
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?id=${batch.join(",")}&part=statistics,snippet,contentDetails&key=${API_KEY}`
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
      duration_seconds: stats?.contentDetails?.duration ? parseDuration(stats.contentDetails.duration) : null,
      tags: stats?.snippet?.tags ?? null,
      cached_at: new Date().toISOString(),
    };
  });

  // Upsert all videos without duration_seconds first (avoids overwriting valid cached values with null)
  const videosWithoutDuration = videos.map(({ duration_seconds, ...rest }) => rest);
  await supabase.from("youtube_videos").upsert(videosWithoutDuration, { onConflict: "video_id" });

  // Update duration_seconds in a single batch upsert for videos where we have a valid value
  // (one upsert instead of N individual UPDATEs — critical for Supabase Disk IO)
  const withDuration = videos
    .filter((v) => v.duration_seconds !== null)
    .map((v) => ({ video_id: v.video_id, duration_seconds: v.duration_seconds }));
  if (withDuration.length > 0) {
    await supabase.from("youtube_videos").upsert(withDuration, { onConflict: "video_id" });
  }

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
  // Never auto-sync from a page render — only the /api/sync-videos cron does that.
  // Auto-syncing caused ~1000 YouTube API calls per ISR cycle when 95+ pages
  // revalidated simultaneously and all saw a stale cache.

  // Query via associations — fetch more than needed to account for duplicate video_ids
  // (a video can have multiple associations for the same neighborhood with different categories)
  let query = supabase
    .from("video_page_associations")
    .select("video_id, relevance_score, youtube_videos(video_id, title, description, thumbnail_url, view_count, published_at, tags, cached_at)")
    .order("relevance_score", { ascending: false })
    .limit(limit * 5);

  if (neighborhoodSlug) query = query.eq("neighborhood_slug", neighborhoodSlug);
  if (categorySlug) query = query.eq("category_slug", categorySlug);

  const { data } = await query;

  if (data && data.length > 0) {
    const seen = new Set<string>();
    const unique = data
      .map((row: any) => row.youtube_videos)
      .filter(Boolean)
      .filter((v: any) => {
        if (seen.has(v.video_id)) return false;
        seen.add(v.video_id);
        return true;
      });
    return unique.slice(0, limit) as Video[];
  }

  // Fallback: return latest videos if no associations match
  const { data: latest } = await supabase
    .from("youtube_videos")
    .select("*")
    .order("published_at", { ascending: false })
    .limit(limit);

  return (latest ?? []) as Video[];
}

// Parse ISO 8601 duration (e.g. "PT3M15S") to total seconds
function parseDuration(iso: string): number {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const h = parseInt(match[1] ?? "0");
  const m = parseInt(match[2] ?? "0");
  const s = parseInt(match[3] ?? "0");
  return h * 3600 + m * 60 + s;
}

export function isShort(video: Pick<Video, "title" | "description" | "tags" | "duration_seconds">): boolean {
  // Duration-based detection: Shorts are 3 minutes or under
  if (video.duration_seconds !== null && video.duration_seconds !== undefined) {
    return video.duration_seconds <= 180;
  }
  // Fallback: tag/title/description signals for videos without duration
  if (video.title?.toLowerCase().includes("#short")) return true;
  if (video.tags?.some((t) => t.toLowerCase() === "shorts" || t.toLowerCase() === "short")) return true;
  if (video.description?.toLowerCase().includes("#shorts")) return true;
  return false;
}

export async function getAllVideos(): Promise<Video[]> {
  const { data } = await supabase
    .from("youtube_videos")
    .select("*")
    .order("published_at", { ascending: false });
  return (data ?? []) as Video[];
}

export async function getLatestLongFormVideos(limit = 5, excludeIds: string[] = []): Promise<Video[]> {
  const { data } = await supabase
    .from("youtube_videos")
    .select("*")
    .or("duration_seconds.is.null,duration_seconds.gt.180")
    .order("published_at", { ascending: false })
    .limit(limit + excludeIds.length);

  const videos = (data ?? []) as Video[];
  return videos.filter((v) => !excludeIds.includes(v.video_id)).slice(0, limit);
}

export async function getLatestShorts(limit = 5, excludeIds: string[] = []): Promise<Video[]> {
  const { data } = await supabase
    .from("youtube_videos")
    .select("*")
    .lte("duration_seconds", 180)
    .order("published_at", { ascending: false })
    .limit(limit + excludeIds.length);

  const videos = (data ?? []) as Video[];
  return videos.filter((v) => !excludeIds.includes(v.video_id)).slice(0, limit);
}

export async function getPopularDenverVideos(limit = 6): Promise<Video[]> {
  const oneYearAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString();

  // Get video IDs that have Denver associations
  const { data: assocData } = await supabase
    .from("video_page_associations")
    .select("video_id")
    .not("neighborhood_slug", "is", null);

  const denverIds = [...new Set(assocData?.map((r) => r.video_id) ?? [])];
  if (denverIds.length === 0) return [];

  // Fetch most-viewed non-Short Denver videos from the past year
  const { data } = await supabase
    .from("youtube_videos")
    .select("*")
    .in("video_id", denverIds)
    .gte("published_at", oneYearAgo)
    .or("duration_seconds.is.null,duration_seconds.gt.180")
    .order("view_count", { ascending: false })
    .limit(limit);

  return (data ?? []) as Video[];
}

export function embedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}`;
}

export function watchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

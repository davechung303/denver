import { supabaseAdmin } from "./supabase";

/**
 * Captions through the official YouTube Data API, signed in as Dave.
 *
 * YouTube blocks caption scraping from Vercel's servers, so the old
 * watch-page method returns nothing in production. captions.download works
 * for videos on the signed-in account, which is every video we care about.
 *
 * One-time setup: Dave visits /api/youtube-auth/start, signs in and clicks
 * Allow. The callback stores a refresh token in `app_secrets` (RLS on, no
 * public policies — readable only with the service-role key). Needs
 * YOUTUBE_OAUTH_CLIENT_ID and YOUTUBE_OAUTH_CLIENT_SECRET in Vercel.
 *
 * Quota: list (50) + download (200) units per video against the default
 * 10,000/day — about 40 videos a day, far more than new uploads need.
 */

export const YT_SCOPE = "https://www.googleapis.com/auth/youtube.force-ssl";
export const REFRESH_TOKEN_KEY = "youtube_refresh_token";
const CHANNEL_HANDLE = "davechung";

export function oauthRedirectUri(): string {
  return "https://davelovesdenver.com/api/youtube-auth/callback";
}

export function oauthConfigured(): boolean {
  return !!(process.env.YOUTUBE_OAUTH_CLIENT_ID && process.env.YOUTUBE_OAUTH_CLIENT_SECRET);
}

/** The channel id for @davechung, so the callback can refuse anyone else's account. */
export async function expectedChannelId(): Promise<string | null> {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) return null;
  const res = await fetch(`https://www.googleapis.com/youtube/v3/channels?forHandle=${CHANNEL_HANDLE}&part=id&key=${key}`);
  if (!res.ok) return null;
  const data = await res.json();
  return data.items?.[0]?.id ?? null;
}

let cachedToken: { token: string; expires: number } | null = null;

async function getAccessToken(): Promise<string | null> {
  if (!oauthConfigured()) return null;
  if (cachedToken && cachedToken.expires > Date.now() + 60_000) return cachedToken.token;

  const { data } = await supabaseAdmin.from("app_secrets").select("value").eq("key", REFRESH_TOKEN_KEY).maybeSingle();
  if (!data?.value) return null;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.YOUTUBE_OAUTH_CLIENT_ID!,
      client_secret: process.env.YOUTUBE_OAUTH_CLIENT_SECRET!,
      refresh_token: data.value,
      grant_type: "refresh_token",
    }),
  });
  if (!res.ok) {
    console.error("YouTube token refresh failed", res.status, await res.text());
    return null;
  }
  const json = await res.json();
  cachedToken = { token: json.access_token, expires: Date.now() + (json.expires_in ?? 3600) * 1000 };
  return cachedToken.token;
}

/** Strip an SRT file down to its spoken text. */
function srtToText(srt: string): string {
  return srt
    .split(/\r?\n/)
    .filter((line) => line.trim() && !/^\d+$/.test(line.trim()) && !/-->/.test(line))
    .join(" ")
    .replace(/<[^>]+>/g, "")
    .replace(/\[(music|applause|laughter)\]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Transcript for one of Dave's videos via the official API, or null if unavailable. */
export async function fetchOwnerTranscript(videoId: string): Promise<string | null> {
  const token = await getAccessToken();
  if (!token) return null;
  const auth = { Authorization: `Bearer ${token}` };

  const listRes = await fetch(`https://www.googleapis.com/youtube/v3/captions?part=snippet&videoId=${encodeURIComponent(videoId)}`, { headers: auth });
  if (!listRes.ok) {
    console.error("captions.list failed", videoId, listRes.status);
    return null;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tracks: any[] = (await listRes.json()).items ?? [];
  const isEn = (t: { snippet?: { language?: string } }) => t.snippet?.language?.startsWith("en");
  const track =
    tracks.find((t) => isEn(t) && t.snippet?.trackKind !== "asr") ??
    tracks.find((t) => isEn(t)) ??
    tracks[0];
  if (!track) return null;

  const dlRes = await fetch(`https://www.googleapis.com/youtube/v3/captions/${encodeURIComponent(track.id)}?tfmt=srt`, { headers: auth });
  if (!dlRes.ok) {
    console.error("captions.download failed", videoId, track.snippet?.trackKind, dlRes.status);
    return null;
  }
  const text = srtToText(await dlRes.text());
  return text.length >= 50 ? text : null;
}

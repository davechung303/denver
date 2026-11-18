import { NextResponse, type NextRequest } from "next/server";
import { supabase, supabaseAdmin } from "@/lib/supabase";
import { REFRESH_TOKEN_KEY, expectedChannelId, fetchOwnerTranscript, oauthConfigured, oauthRedirectUri } from "@/lib/youtubeCaptions";

function page(title: string, body: string, status = 200) {
  const html = `<!doctype html><meta name="robots" content="noindex"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title><body style="font:16px/1.5 system-ui,sans-serif;max-width:560px;margin:60px auto;padding:0 20px">
<h1 style="font-size:22px">${title}</h1>${body}</body>`;
  return new NextResponse(html, { status, headers: { "Content-Type": "text/html; charset=utf-8" } });
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

// Step 2 of the one-time YouTube captions sign-in. Stores the refresh token
// only if the account that signed in owns the @davechung channel.
export async function GET(request: NextRequest) {
  if (!oauthConfigured()) return page("Not set up", "<p>The YouTube OAuth client isn't configured in Vercel.</p>", 500);

  const params = request.nextUrl.searchParams;
  if (params.get("error")) return page("Sign-in cancelled", `<p>Google said: ${esc(params.get("error")!)}</p>`, 400);

  const state = params.get("state");
  if (!state || state !== request.cookies.get("yt_oauth_state")?.value) {
    return page("Sign-in expired", '<p>Please start again at <a href="/api/youtube-auth/start">/api/youtube-auth/start</a>.</p>', 400);
  }

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code: params.get("code") ?? "",
      client_id: process.env.YOUTUBE_OAUTH_CLIENT_ID!,
      client_secret: process.env.YOUTUBE_OAUTH_CLIENT_SECRET!,
      redirect_uri: oauthRedirectUri(),
      grant_type: "authorization_code",
    }),
  });
  if (!tokenRes.ok) return page("Sign-in failed", `<p>Google refused the code (${tokenRes.status}). Try again.</p>`, 400);
  const tokens = await tokenRes.json();
  if (!tokens.refresh_token) return page("Sign-in incomplete", "<p>Google didn't return a refresh token. Try again.</p>", 400);

  // Refuse any account that isn't the @davechung channel.
  const [mineRes, expected] = await Promise.all([
    fetch("https://www.googleapis.com/youtube/v3/channels?part=id,snippet&mine=true", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    }).then((r) => r.json()),
    expectedChannelId(),
  ]);
  const mine = mineRes.items?.[0];
  if (!expected || !mine || mine.id !== expected) {
    return page("Wrong account", "<p>That Google account doesn't own the @davechung channel, so nothing was saved. Sign in with the account that owns the channel.</p>", 403);
  }

  const { error } = await supabaseAdmin
    .from("app_secrets")
    .upsert({ key: REFRESH_TOKEN_KEY, value: tokens.refresh_token, updated_at: new Date().toISOString() }, { onConflict: "key" });
  if (error) return page("Couldn't save", `<p>Signed in, but saving failed: ${esc(error.message)}</p>`, 500);

  // Prove it works on the newest video, so a failure shows up now, not weeks later.
  const { data: latest } = await supabase
    .from("youtube_videos")
    .select("video_id, title")
    .order("published_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  let test = "";
  if (latest) {
    const transcript = await fetchOwnerTranscript(latest.video_id);
    test = transcript
      ? `<p>Test: pulled ${transcript.length.toLocaleString()} characters of captions from “${esc(latest.title)}”.</p>`
      : `<p>Test: no captions came back for “${esc(latest.title)}”. It may not have captions yet. New videos will keep being tried daily.</p>`;
  }

  return page(
    "YouTube captions connected",
    `<p>Signed in as <strong>${esc(mine.snippet?.title ?? "your channel")}</strong>. New videos will get transcripts automatically.</p>${test}<p>You can close this tab.</p>`
  );
}

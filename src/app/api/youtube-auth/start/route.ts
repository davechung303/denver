import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { YT_SCOPE, oauthConfigured, oauthRedirectUri } from "@/lib/youtubeCaptions";

// Step 1 of the one-time YouTube captions sign-in. Sends Dave to Google's
// consent screen; Google returns him to /api/youtube-auth/callback.
export async function GET() {
  if (!oauthConfigured()) {
    return new NextResponse("YouTube sign-in isn't set up yet: YOUTUBE_OAUTH_CLIENT_ID and YOUTUBE_OAUTH_CLIENT_SECRET are missing in Vercel.", { status: 500 });
  }

  const state = randomBytes(24).toString("hex");
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", process.env.YOUTUBE_OAUTH_CLIENT_ID!);
  url.searchParams.set("redirect_uri", oauthRedirectUri());
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", YT_SCOPE);
  url.searchParams.set("access_type", "offline");
  url.searchParams.set("prompt", "consent"); // always return a refresh token
  url.searchParams.set("state", state);

  const res = NextResponse.redirect(url.toString());
  res.cookies.set("yt_oauth_state", state, { httpOnly: true, secure: true, sameSite: "lax", path: "/api/youtube-auth", maxAge: 600 });
  return res;
}

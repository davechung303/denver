import { NextResponse } from "next/server";
import { syncVideos } from "@/lib/youtube";

// Called daily by Vercel Cron to refresh YouTube video cache
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await syncVideos();
  return NextResponse.json(result);
}

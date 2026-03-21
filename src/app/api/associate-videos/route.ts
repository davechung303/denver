import { NextResponse } from "next/server";
import { associateVideosWithNeighborhoods } from "@/lib/videoAssociations";

export const maxDuration = 300;

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const limit = parseInt(url.searchParams.get("limit") ?? "20");
  const result = await associateVideosWithNeighborhoods(limit);
  return NextResponse.json(result);
}

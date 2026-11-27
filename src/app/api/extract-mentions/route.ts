import { NextResponse, after } from "next/server";
import { extractVideoMentions } from "@/lib/videoMentions";

export const maxDuration = 300;

// Every 10 minutes: record every business named in videos not yet read (see
// src/lib/videoMentions.ts). Backfills the archive, then handles new uploads;
// with nothing pending it exits in a second.
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  after(async () => {
    const result = await extractVideoMentions(30, 5, 200_000);
    if (result.videos > 0 || result.errors > 0) {
      console.log("[extract-mentions]", JSON.stringify({ ...result, log: undefined }));
      for (const line of result.log) console.log(`[extract-mentions] ${line}`);
    }
  });

  return NextResponse.json({ started: true }, { status: 202 });
}

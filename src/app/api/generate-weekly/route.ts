import { NextResponse } from "next/server";
import { generateWeeklyGuide } from "@/lib/weeklyGuide";

export const maxDuration = 300;

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const fridayParam = url.searchParams.get("friday");
  const overrideFriday = fridayParam ? new Date(fridayParam) : undefined;

  const result = await generateWeeklyGuide(overrideFriday);
  return NextResponse.json(result);
}

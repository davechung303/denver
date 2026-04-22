import { NextResponse } from "next/server";
import { discoverNewPlaces } from "@/lib/places";

export const maxDuration = 300;

// Weekly cron — searches for newly opened places across all neighborhoods.
// Only inserts places not already in the DB. ~54 Google API calls per run.
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await discoverNewPlaces();
  return NextResponse.json({ ok: true, ...result });
}

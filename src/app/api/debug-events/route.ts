import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: Request) {
  const auth = req.headers.get("Authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { count } = await supabase.from("events").select("*", { count: "exact", head: true });
  const { data: sample } = await supabase
    .from("events")
    .select("name, neighborhood_slug, start_time, venue_name, venue_lat, venue_lng")
    .order("start_time")
    .limit(10);

  const { data: rino } = await supabase
    .from("events")
    .select("name, start_time")
    .eq("neighborhood_slug", "rino")
    .limit(5);

  return NextResponse.json({ total: count, sample, rino });
}

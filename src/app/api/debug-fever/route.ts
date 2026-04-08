import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const auth = req.headers.get("Authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sid = process.env.IMPACT_ACCOUNT_SID;
  const token = process.env.IMPACT_AUTH_TOKEN;
  if (!sid || !token) return NextResponse.json({ error: "creds missing" }, { status: 500 });

  const { createClient } = await import("@supabase/supabase-js");
  const db = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const now = new Date().toISOString();

  const { data: total } = await db.from("fever_events").select("event_id", { count: "exact", head: true });
  const { count: totalCount } = await db.from("fever_events").select("*", { count: "exact", head: true });
  const { data: sample, error } = await db.from("fever_events").select("event_id, name, next_date, expiration_date, popularity").order("popularity", { ascending: false }).limit(3);
  const { data: filtered, error: ferr } = await db.from("fever_events").select("event_id", { count: "exact", head: true }).or(`expiration_date.is.null,expiration_date.gt.${now}`);
  const { count: filteredCount } = await db.from("fever_events").select("*", { count: "exact", head: true }).or(`expiration_date.is.null,expiration_date.gt.${now}`);

  return NextResponse.json({
    totalCount,
    filteredCount,
    now,
    sample,
    sampleError: error?.message,
    filterError: ferr?.message,
  });
}

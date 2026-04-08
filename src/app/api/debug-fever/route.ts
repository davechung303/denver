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

  const oneYearOut = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const nowDate = now.slice(0, 10);

  const { count: totalCount } = await db.from("fever_events").select("*", { count: "exact", head: true });
  const { count: giftCardCount } = await db.from("fever_events").select("*", { count: "exact", head: true }).ilike("name", "%gift card%");
  const { count: nullNextDate } = await db.from("fever_events").select("*", { count: "exact", head: true }).is("next_date", null);

  // Non-gift-card events sample
  const { data: realSample, error } = await db
    .from("fever_events")
    .select("event_id, name, next_date, expiration_date, popularity")
    .not("name", "ilike", "%gift card%")
    .order("popularity", { ascending: false })
    .limit(5);

  // What passes the full getFeverEvents filter
  const { count: filteredCount } = await db
    .from("fever_events")
    .select("*", { count: "exact", head: true })
    .not("name", "ilike", "%gift card%")
    .gte("next_date", nowDate)
    .lte("next_date", oneYearOut);

  return NextResponse.json({
    totalCount, giftCardCount, nullNextDate, filteredCount,
    nowDate, oneYearOut,
    realSample,
    error: error?.message,
  });
}

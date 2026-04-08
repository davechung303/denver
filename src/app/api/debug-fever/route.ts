import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const auth = req.headers.get("Authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sid = process.env.IMPACT_ACCOUNT_SID;
  const token = process.env.IMPACT_AUTH_TOKEN;
  if (!sid || !token) return NextResponse.json({ error: "creds missing" }, { status: 500 });

  const credentials = Buffer.from(`${sid}:${token}`).toString("base64");
  const url = `https://api.impact.com/Mediapartners/${sid}/Catalogs/15532/Items?PageSize=3&Page=1`;
  const res = await fetch(url, { headers: { Authorization: `Basic ${credentials}` } });

  const text = await res.text();
  let data: any = null;
  try { data = JSON.parse(text); } catch {}

  const firstItem = data?.Items?.[0] ?? null;
  return NextResponse.json({
    status: res.status,
    rawBody: text.slice(0, 1000),
    totalCount: data?.TotalCount,
    itemCount: data?.Items?.length,
    firstItemKeys: firstItem ? Object.keys(firstItem) : [],
    firstItem,
  });
}

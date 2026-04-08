import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const auth = req.headers.get("Authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sid = process.env.IMPACT_ACCOUNT_SID;
  const token = process.env.IMPACT_AUTH_TOKEN;
  if (!sid || !token) return NextResponse.json({ error: "creds missing" }, { status: 500 });

  // Show stored values for debugging (partial, not full secrets)
  const sidInfo = { len: sid.length, start: sid.slice(0, 4), end: sid.slice(-4) };
  const tokenInfo = { len: token.length, start: token.slice(0, 4), end: token.slice(-4), charCodes: [...token].slice(-6).map(c => c.charCodeAt(0)) };

  const credentials = Buffer.from(`${sid}:${token}`).toString("base64");
  const url = `https://api.impact.com/Mediapartners/${sid}/Catalogs/15532/Items?PageSize=3&Page=1`;
  const res = await fetch(url, { headers: { Authorization: `Basic ${credentials}`, Accept: "application/json" } });

  const text = await res.text();
  return NextResponse.json({
    status: res.status,
    rawBody: text.slice(0, 200),
    sidInfo,
    tokenInfo,
  });
}

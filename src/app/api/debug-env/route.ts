import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const auth = req.headers.get("Authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    IMPACT_ACCOUNT_SID: process.env.IMPACT_ACCOUNT_SID ? "set" : "missing",
    IMPACT_AUTH_TOKEN: process.env.IMPACT_AUTH_TOKEN ? "set" : "missing",
    CRON_SECRET: process.env.CRON_SECRET ? "set" : "missing",
  });
}

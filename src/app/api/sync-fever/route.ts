import { NextResponse } from "next/server";
import { syncFeverEvents } from "@/lib/fever";

export async function GET(req: Request) {
  const auth = req.headers.get("Authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const count = await syncFeverEvents();
    return NextResponse.json({ ok: true, count });
  } catch (err: any) {
    console.error("[sync-fever] error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

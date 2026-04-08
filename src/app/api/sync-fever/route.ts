import { NextResponse } from "next/server";
import { syncFeverEvents } from "@/lib/fever";

export const maxDuration = 300; // 5 min — max on Vercel Pro

export async function GET(req: Request) {
  const auth = req.headers.get("Authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const startAfter = url.searchParams.get("startAfter") ?? undefined;
  const pagesPerBatch = 30;

  try {
    const { count, nextStartAfter } = await syncFeverEvents(startAfter, pagesPerBatch);
    return NextResponse.json({ ok: true, count, nextStartAfter });
  } catch (err: any) {
    console.error("[sync-fever] error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

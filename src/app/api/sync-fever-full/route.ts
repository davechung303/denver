import { NextResponse } from "next/server";
import { syncFeverEvents } from "@/lib/fever";

export const maxDuration = 300; // 5 min — max on Vercel Pro

// Full catalog sync — walks all pages in one invocation, used by daily cron
export async function GET(req: Request) {
  const auth = req.headers.get("Authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let total = 0;
  let startAfter: string | undefined = undefined;
  let batches = 0;

  // Chain batches of 20 pages until the catalog is exhausted
  while (true) {
    const { count, nextStartAfter } = await syncFeverEvents(startAfter, 20);
    total += count;
    batches++;
    if (!nextStartAfter) break;
    startAfter = nextStartAfter;
  }

  console.log(`[sync-fever-full] done: ${total} events across ${batches} batches`);
  return NextResponse.json({ ok: true, total, batches });
}

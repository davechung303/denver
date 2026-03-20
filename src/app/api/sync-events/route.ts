import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { syncDenverEvents } from "@/lib/ticketmaster";
import { NEIGHBORHOODS } from "@/lib/neighborhoods";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: Request) {
  const auth = req.headers.get("Authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const count = await syncDenverEvents();

    // Test write directly and return any error
    const testRow = {
      event_id: "test-001",
      name: "Test Event",
      start_time: new Date(Date.now() + 86400000).toISOString(),
      url: "https://example.com",
      is_free: false,
      cached_at: new Date().toISOString(),
    };
    const { error: testError } = await supabaseAdmin.from("events").upsert(testRow, { onConflict: "event_id" });
    if (testError) {
      return NextResponse.json({ ok: false, synced: count, writeError: testError.message, code: testError.code });
    }
    // Clean up test row
    await supabaseAdmin.from("events").delete().eq("event_id", "test-001");

    for (const n of NEIGHBORHOODS) {
      revalidatePath(`/denver/${n.slug}`);
    }
    return NextResponse.json({ ok: true, synced: count });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

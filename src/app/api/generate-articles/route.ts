import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { generateMissingArticles } from "@/lib/articles";

export const maxDuration = 300; // 5 minutes — requires Vercel Pro

// Called by Vercel Cron to generate articles for new videos
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const limit = parseInt(url.searchParams.get("limit") ?? "10");
  const result = await generateMissingArticles(limit);

  // Invalidate ISR cache so new articles appear immediately
  if (result.generated > 0) {
    revalidatePath("/");
    revalidatePath("/articles");
  }

  return NextResponse.json(result);
}
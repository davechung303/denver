import { NextResponse } from "next/server";
import { generateMissingArticles } from "@/lib/articles";

// Called daily by Vercel Cron to generate articles for new videos
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await generateMissingArticles(10);
  return NextResponse.json(result);
}
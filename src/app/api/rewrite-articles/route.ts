import { NextResponse, after } from "next/server";
import { revalidatePath } from "next/cache";
import { rewriteArticles } from "@/lib/articleRewrite";

export const maxDuration = 300;

// Every 10 minutes: rewrite articles flagged with articles.rewrite_mode from
// their transcripts (see src/lib/articleRewrite.ts). With nothing flagged it
// exits in a second. Responds immediately and works after the response.
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "4"), 10);

  after(async () => {
    const result = await rewriteArticles(limit, 190_000);
    if (result.drafted || result.published || result.skipped || result.errors) {
      console.log("[rewrite-articles]", JSON.stringify({ ...result, log: undefined }));
      for (const line of result.log) console.log(`[rewrite-articles] ${line}`);
    }
    for (const slug of result.slugs) revalidatePath(`/articles/${slug}`);
    if (result.published > 0) revalidatePath("/articles");
  });

  return NextResponse.json({ started: true, limit }, { status: 202 });
}

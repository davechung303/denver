import Anthropic from "@anthropic-ai/sdk";
import { supabase, supabaseAdmin } from "./supabase";
import { buildArticlePrompt, detectContentType } from "./articles";

/**
 * Rewrite existing articles from their video transcripts.
 *
 * Every article written before November 2026 was generated without a
 * transcript (the transcripts table was empty), so it was built from the
 * title and description alone. This rewrites them with what Dave actually
 * says in the video.
 *
 * Controlled per article from Supabase, with no deploys needed:
 *   articles.rewrite_mode = 'draft'   → new version saved to draft_content only
 *   articles.rewrite_mode = 'publish' → live content replaced; the original is
 *                                       kept in previous_content
 *   articles.rewrite_mode = null      → left alone
 * An article whose video has no transcript yet is skipped and picked up once
 * one exists. Slug and title never change, so URLs and rankings are kept.
 *
 * To revert one: update articles set content = previous_content where slug = '…'
 *
 * Every rewrite must quote phrases that really appear in the transcript, or
 * it's discarded (the same guard as place-video takes).
 */

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

const EVIDENCE_MARKER = "---EVIDENCE---";
const EVIDENCE_INSTRUCTION = `

=== GROUNDING CHECK ===
After the article, output a line containing only ${EVIDENCE_MARKER}, then 3 to 5 lines, each a phrase of 8 or more words copied EXACTLY from the transcript that the article relies on. These are removed before publishing and used to check the article against the video.`;

const BANNED = /\b(though|honest|honestly|calibrated|elevated|curated|intentional|offerings|nestled|boasts|vibrant|bustling|gastronomic|culinary journey)\b/i;

function loose(s: string): string {
  return s.toLowerCase().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
}

function parse(raw: string): { body: string; evidence: string[] } {
  const withoutTitle = raw.replace(/^TITLE:.*\n\n?/m, "").trim();
  const [body, evidenceBlock = ""] = withoutTitle.split(EVIDENCE_MARKER);
  const evidence = evidenceBlock
    .split("\n")
    .map((l) => l.replace(/^[-*\d.)\s"“]+|["”]+$/g, "").trim())
    .filter(Boolean);
  return { body: body.trim(), evidence };
}

function grounded(body: string, evidence: string[], transcript: string): boolean {
  if (body.length < 1500 || BANNED.test(body)) return false;
  const hay = loose(transcript);
  const hits = evidence.filter((e) => {
    const needle = loose(e);
    return needle.length >= 25 && hay.includes(needle);
  });
  return hits.length >= 2;
}

async function writeFromTranscript(
  video: { title: string; description: string | null },
  transcript: string,
  article: { content_type: string | null; neighborhood_slug: string | null; category_slug: string | null }
): Promise<string | null> {
  const contentType =
    article.content_type === "guide" || article.content_type === "review"
      ? article.content_type
      : detectContentType(video.title, video.description ?? "");
  const prompt =
    buildArticlePrompt({
      video,
      transcript,
      contentType,
      neighborhood: article.neighborhood_slug,
      category: article.category_slug,
      pressMentions: "",
    }) + EVIDENCE_INSTRUCTION;

  for (let attempt = 0; attempt < 2; attempt++) {
    const msg = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4000,
      messages: [{ role: "user", content: prompt }],
    });
    const block = msg.content[0];
    if (block?.type !== "text") continue;
    const { body, evidence } = parse(block.text);
    if (grounded(body, evidence, transcript)) return body;
  }
  return null;
}

export interface RewriteResult {
  drafted: number;
  published: number;
  skipped: number;
  errors: number;
  slugs: string[];
  log: string[];
}

export async function rewriteArticles(limit = 4, budgetMs = 190_000): Promise<RewriteResult> {
  const started = Date.now();
  const result: RewriteResult = { drafted: 0, published: 0, skipped: 0, errors: 0, slugs: [], log: [] };

  const { data: rows } = await supabaseAdmin
    .from("articles")
    .select("id, slug, video_id, content, previous_content, content_type, neighborhood_slug, category_slug, rewrite_mode, draft_generated_at")
    .not("rewrite_mode", "is", null)
    .is("transcript_rewritten_at", null)
    .order("generated_at", { ascending: false })
    .limit(200);

  let attempted = 0;
  for (const a of rows ?? []) {
    if (attempted >= limit || Date.now() - started > budgetMs - 75_000) break;
    if (a.rewrite_mode === "draft" && a.draft_generated_at) continue; // draft already waiting for review
    if (!a.video_id) continue;

    // Cached transcripts only: fetching from YouTube happens elsewhere, rate-limited.
    const { data: t } = await supabase.from("transcripts").select("transcript").eq("video_id", a.video_id).maybeSingle();
    if (!t?.transcript) continue;

    const { data: video } = await supabase.from("youtube_videos").select("title, description").eq("video_id", a.video_id).maybeSingle();
    if (!video) continue;

    attempted++;
    try {
      const body = await writeFromTranscript(video, t.transcript, a);
      const now = new Date().toISOString();
      if (!body) {
        result.skipped++;
        result.log.push(`skipped (failed grounding check twice): ${a.slug}`);
        // Mark it so it isn't retried every run; clear the column to retry.
        await supabaseAdmin.from("articles").update(
          a.rewrite_mode === "draft" ? { draft_generated_at: now } : { transcript_rewritten_at: now }
        ).eq("id", a.id);
        continue;
      }

      if (a.rewrite_mode === "draft") {
        await supabaseAdmin.from("articles").update({ draft_content: body, draft_generated_at: now }).eq("id", a.id);
        result.drafted++;
        result.log.push(`drafted: ${a.slug}`);
      } else {
        await supabaseAdmin
          .from("articles")
          .update({
            previous_content: a.previous_content ?? a.content, // keep the original, not an earlier rewrite
            content: body,
            draft_content: null,
            transcript_rewritten_at: now,
            updated_at: now,
          })
          .eq("id", a.id);
        result.published++;
        result.slugs.push(a.slug);
        result.log.push(`published: ${a.slug}`);
      }
    } catch (err) {
      result.errors++;
      result.log.push(`ERROR ${a.slug}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
  return result;
}

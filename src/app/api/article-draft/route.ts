import { NextResponse, type NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";

// Side-by-side review of article rewrites waiting in draft:
//   /api/article-draft            → list of drafts
//   /api/article-draft?slug=…     → current article vs transcript rewrite
// Not linked from the site and marked noindex. The drafts contain nothing
// that isn't headed for the public site anyway.

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

function render(md: string): string {
  return md
    .split(/\n{2,}/)
    .map((block) => {
      const b = block.trim();
      if (!b) return "";
      if (b.startsWith("### ")) return `<h3>${esc(b.slice(4))}</h3>`;
      if (b.startsWith("## ")) return `<h2>${esc(b.slice(3))}</h2>`;
      if (b.startsWith("# ")) return `<h2>${esc(b.slice(2))}</h2>`;
      return `<p>${esc(b).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br>")}</p>`;
    })
    .join("\n");
}

const words = (s: string) => s.split(/\s+/).filter(Boolean).length;

function page(title: string, body: string) {
  return new NextResponse(
    `<!doctype html><meta charset="utf-8"><meta name="robots" content="noindex,nofollow"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<style>
  body{font:16px/1.6 Georgia,serif;margin:0;color:#1a1a1a;background:#faf8f5}
  header{padding:20px 28px;border-bottom:1px solid #ddd;font-family:system-ui,sans-serif;background:#fff}
  header h1{font-size:20px;margin:0 0 4px} header p{margin:0;color:#666;font-size:14px}
  .cols{display:grid;grid-template-columns:1fr 1fr;gap:0}
  .col{padding:20px 28px;border-right:1px solid #ddd;min-width:0}
  .col h4{font:600 12px system-ui,sans-serif;text-transform:uppercase;letter-spacing:.06em;color:#a8361d;margin:0 0 12px}
  h2{font-size:21px;margin:28px 0 8px} h3{font-size:18px}
  ul{font-family:system-ui,sans-serif} a{color:#a8361d}
  @media(max-width:800px){.cols{grid-template-columns:1fr}}
</style>${body}`,
    { headers: { "Content-Type": "text/html; charset=utf-8", "X-Robots-Tag": "noindex, nofollow", "Cache-Control": "no-store" } }
  );
}

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");

  if (!slug) {
    const { data } = await supabase
      .from("articles")
      .select("slug, title, draft_content, draft_generated_at")
      .eq("rewrite_mode", "draft")
      .order("draft_generated_at", { ascending: false, nullsFirst: false });
    const items = (data ?? [])
      .map((a) => {
        const state = a.draft_content ? "ready" : a.draft_generated_at ? "failed the transcript check" : "being written…";
        return `<li><a href="?slug=${encodeURIComponent(a.slug)}">${esc(a.title)}</a> — ${state}</li>`;
      })
      .join("");
    return page("Article rewrites — drafts", `<header><h1>Article rewrites waiting for review</h1><p>Rewritten from the video transcripts. Nothing here is live yet.</p></header><div class="col"><ul>${items || "<li>No drafts.</li>"}</ul></div>`);
  }

  const { data: a } = await supabase
    .from("articles")
    .select("slug, title, content, draft_content, draft_generated_at")
    .eq("slug", slug)
    .maybeSingle();
  if (!a) return page("Not found", `<header><h1>No article with that slug</h1></header>`);

  const right = a.draft_content
    ? render(a.draft_content)
    : `<p><em>${a.draft_generated_at ? "The rewrite failed the transcript check, so there's no draft." : "Still being written — check back in a few minutes."}</em></p>`;

  return page(
    `${a.title} — draft`,
    `<header><h1>${esc(a.title)}</h1><p><a href="/api/article-draft">← all drafts</a> · <a href="/articles/${encodeURIComponent(a.slug)}">live page</a> · now ${words(a.content)} words${a.draft_content ? ` → draft ${words(a.draft_content)} words` : ""}</p></header>
<div class="cols"><div class="col"><h4>Live now (no transcript)</h4>${render(a.content)}</div><div class="col"><h4>Rewrite from the transcript</h4>${right}</div></div>`
  );
}

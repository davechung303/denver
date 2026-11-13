import { supabase } from "@/lib/supabase";

// The archive used to list only the newest 50 articles, so everything older
// had no internal links at all and was reachable only through the sitemap.
// It is now paginated at stable URLs: /articles, then /articles/page/2, 3, ...
export const ARTICLES_PER_PAGE = 48;

export async function getArticleCount(): Promise<number> {
  try {
    const { count } = await supabase.from("articles").select("slug", { count: "exact", head: true });
    return count ?? 0;
  } catch {
    return 0;
  }
}

export async function getArticlesPage(page: number) {
  const from = (page - 1) * ARTICLES_PER_PAGE;
  try {
    const { data } = await Promise.race([
      supabase
        .from("articles")
        .select(`
          slug,
          title,
          content_type,
          neighborhood_slug,
          category_slug,
          generated_at,
          places_mentioned,
          youtube_videos (
            video_id,
            thumbnail_url,
            view_count,
            published_at
          )
        `)
        .order("generated_at", { ascending: false })
        .order("slug", { ascending: true })
        .range(from, from + ARTICLES_PER_PAGE - 1),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error("db timeout")), 15000)),
    ]);
    return (data ?? []) as unknown as ArchiveArticle[];
  } catch {
    return [] as ArchiveArticle[];
  }
}

export function articlesPageHref(page: number): string {
  return page <= 1 ? "/articles" : `/articles/page/${page}`;
}

export interface ArchiveArticle {
  slug: string;
  title: string;
  content_type: string | null;
  places_mentioned?: { photo_url?: string | null }[] | null;
  youtube_videos?: { thumbnail_url?: string | null; view_count?: number | null } | null;
}

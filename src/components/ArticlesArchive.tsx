import Link from "next/link";
import { articlesPageHref, type ArchiveArticle } from "@/lib/articlesArchive";
import ArticleThumb from "@/components/ArticleThumb";

export function ArticleGrid({ articles }: { articles: ArchiveArticle[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/articles/${article.slug}`}
                  className="group flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:border-denver-amber hover:shadow-lg transition-all duration-200"
                >
                  {(() => {
                    const rawThumb = article.youtube_videos?.thumbnail_url;
                    const thumb = rawThumb?.replace(/\/hqdefault\.jpg$/, "/maxresdefault.jpg");
                    const pUrl = article.places_mentioned?.[0]?.photo_url;
                    const src = thumb || (pUrl?.startsWith("places/")
                      ? `/api/places-photo?name=${encodeURIComponent(pUrl)}`
                      : pUrl);
                    if (!src) return null;
                    return (
                      <div className="aspect-video overflow-hidden bg-slate-100 dark:bg-slate-800">
                        {rawThumb ? (
                          <ArticleThumb
                            src={src}
                            rawSrc={rawThumb}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <ArticleThumb
                            src={src}
                            fallbackSrc="https://images.unsplash.com/photo-1709689702529-6fa1f343e108?auto=format&fit=crop&w=1200&q=80"
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        )}
                      </div>
                    );
                  })()}
                  <div className="p-4 flex flex-col gap-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 capitalize">
                        {article.content_type}
                      </span>
                    </div>
                    <h2 className="font-semibold text-base leading-tight group-hover:text-denver-amber transition-colors line-clamp-2">
                      {article.title}
                    </h2>
                    {article.youtube_videos?.view_count && (
                      <p className="text-xs text-slate-400 mt-auto">
                        {article.youtube_videos.view_count.toLocaleString()} video views
                      </p>
                    )}
                  </div>
                </Link>
              ))}
    </div>
  );
}

export function ArticlePagination({ page, totalPages }: { page: number; totalPages: number }) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const base = "inline-flex items-center justify-center min-w-10 h-10 px-3 rounded-full text-sm font-semibold border transition-colors";
  return (
    <nav aria-label="Article pages" className="mt-12 flex flex-wrap items-center justify-center gap-2">
      {page > 1 && (
        <Link href={articlesPageHref(page - 1)} rel="prev" className={`${base} border-slate-300 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber`}>
          &larr; Newer
        </Link>
      )}
      {pages.map((p) =>
        p === page ? (
          <span key={p} aria-current="page" className={`${base} border-denver-amber bg-denver-amber text-white`}>
            {p}
          </span>
        ) : (
          <Link key={p} href={articlesPageHref(p)} className={`${base} border-slate-300 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber`}>
            {p}
          </Link>
        )
      )}
      {page < totalPages && (
        <Link href={articlesPageHref(page + 1)} rel="next" className={`${base} border-slate-300 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber`}>
          Older &rarr;
        </Link>
      )}
    </nav>
  );
}

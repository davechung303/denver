import type { Metadata } from "next";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import ArticleThumb from "@/components/ArticleThumb";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Denver Guides & Articles | Dave Loves Denver",
  description: "Local Denver guides, restaurant reviews, hotel picks, and neighborhood explainers from Dave Chung — Denver's most watched local YouTube creator.",
  alternates: { canonical: "https://davelovesdenver.com/articles" },
};

async function getArticles() {
  const { data } = await supabase
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
    .order("updated_at", { ascending: false })
    .limit(50);

  return data ?? [];
}

export default async function ArticlesPage() {
  const articles = await getArticles();

  return (
    <>
      <section className="bg-denver-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <p className="text-denver-amber text-sm font-semibold uppercase tracking-widest mb-3">
            Dave Loves Denver
          </p>
          <h1 className="text-4xl md:text-5xl font-bold">Denver Guides</h1>
          <p className="mt-4 text-white/70 text-lg max-w-2xl">
            Hyperlocal Denver guides, restaurant reviews, hotel picks, and neighborhood explainers — all from a local who actually lives here.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {articles.length > 0 ? (
          <>
            <p className="text-sm text-slate-400 mb-8">{articles.length} articles</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article: any) => (
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
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={src} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
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
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-slate-400 text-lg mb-2">Articles are being generated.</p>
            <p className="text-slate-500 text-sm">Check back soon — new content is on its way.</p>
          </div>
        )}
      </section>
    </>
  );
}

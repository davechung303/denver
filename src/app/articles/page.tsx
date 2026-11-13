import type { Metadata } from "next";
import { ArticleGrid, ArticlePagination } from "@/components/ArticlesArchive";
import { ARTICLES_PER_PAGE, getArticleCount, getArticlesPage } from "@/lib/articlesArchive";
import BookYourTrip from "@/components/BookYourTrip";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Denver Guides & Articles",
  description: "Local Denver guides, restaurant reviews, hotel picks, and neighborhood explainers from Dave Chung — Denver's most watched local creator, with 6.5 million views across YouTube and TikTok.",
  alternates: { canonical: "https://davelovesdenver.com/articles" },
};

export default async function ArticlesPage() {
  const [articles, total] = await Promise.all([getArticlesPage(1), getArticleCount()]);
  const totalPages = Math.max(1, Math.ceil(total / ARTICLES_PER_PAGE));

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
            <p className="text-sm text-slate-400 mb-8">{total || articles.length} articles</p>
            <ArticleGrid articles={articles} />
            <ArticlePagination page={1} totalPages={totalPages} />
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-slate-400 text-lg mb-2">Articles are being generated.</p>
            <p className="text-slate-500 text-sm">Check back soon — new content is on its way.</p>
          </div>
        )}
      </section>

      {/* Expedia stays + flights search — dated searches convert better than a bare hotel-search handoff */}
      <BookYourTrip
        pubref="articles-index"
        heading="Planning the trip itself?"
        blurb="Pick your dates and compare Denver hotels and flights in one search."
      />

    </>
  );
}

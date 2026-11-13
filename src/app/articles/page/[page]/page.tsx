import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { ArticleGrid, ArticlePagination } from "@/components/ArticlesArchive";
import { ARTICLES_PER_PAGE, getArticleCount, getArticlesPage } from "@/lib/articlesArchive";

export const revalidate = 86400;

type Props = { params: Promise<{ page: string }> };

function parsePage(raw: string): number | null {
  if (!/^\d+$/.test(raw)) return null;
  const n = Number(raw);
  return n >= 1 ? n : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { page: raw } = await params;
  const page = parsePage(raw);
  if (!page) return {};
  const url = `https://davelovesdenver.com/articles/page/${page}`;
  return {
    title: `Denver Guides & Articles, Page ${page}`,
    description: `Older Denver guides, restaurant reviews and neighborhood explainers from Dave Chung, page ${page} of the archive.`,
    alternates: { canonical: url },
    openGraph: { title: `Denver Guides & Articles, Page ${page}`, url, type: "website" },
  };
}

export default async function ArticlesArchivePage({ params }: Props) {
  const { page: raw } = await params;
  const page = parsePage(raw);
  if (!page) notFound();
  // Page 1 lives at /articles; one URL per page.
  if (page === 1) permanentRedirect("/articles");

  const [articles, total] = await Promise.all([getArticlesPage(page), getArticleCount()]);
  const totalPages = Math.max(1, Math.ceil(total / ARTICLES_PER_PAGE));
  if (page > totalPages || articles.length === 0) notFound();

  return (
    <>
      <section className="bg-denver-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <nav aria-label="Breadcrumb" className="text-sm text-white/50 mb-4">
            <Link href="/articles" className="hover:text-white transition-colors">Denver Guides</Link>
            <span aria-hidden="true"> / </span>
            <span className="text-white/80">Page {page}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold">Denver Guides, Page {page}</h1>
          <p className="mt-3 text-white/70">
            Articles {(page - 1) * ARTICLES_PER_PAGE + 1}–{(page - 1) * ARTICLES_PER_PAGE + articles.length} of {total}, newest first.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <ArticleGrid articles={articles} />
        <ArticlePagination page={page} totalPages={totalPages} />
      </section>
    </>
  );
}

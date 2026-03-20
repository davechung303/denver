import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { embedUrl } from "@/lib/youtube";
import { expediaHotelUrl, hotelSearchUrl } from "@/lib/travelpayouts";
import { getNeighborhood } from "@/lib/neighborhoods";
import SchemaMarkup from "@/components/SchemaMarkup";

export const revalidate = 86400;

interface Props {
  params: Promise<{ slug: string }>;
}

async function getArticle(slug: string) {
  const { data } = await supabase
    .from("articles")
    .select(`
      *,
      youtube_videos (
        video_id,
        title,
        description,
        thumbnail_url,
        view_count,
        published_at
      )
    `)
    .eq("slug", slug)
    .single();
  return data;
}

async function getRelatedArticles(slug: string, neighborhoodSlug: string | null, limit = 4) {
  let query = supabase
    .from("articles")
    .select(`
      slug,
      title,
      content_type,
      neighborhood_slug,
      youtube_videos (
        video_id,
        thumbnail_url,
        view_count
      )
    `)
    .neq("slug", slug)
    .limit(limit);

  if (neighborhoodSlug) {
    query = query.eq("neighborhood_slug", neighborhoodSlug);
  }

  const { data } = await query.order("generated_at", { ascending: false });
  return data ?? [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return {};

  const description = article.content.slice(0, 160).replace(/\n/g, " ");

  return {
    title: `${article.title} | Dave Loves Denver`,
    description,
    openGraph: {
      title: article.title,
      description,
      url: `https://davelovesdenver.com/articles/${slug}`,
      images: article.youtube_videos?.thumbnail_url
        ? [{ url: article.youtube_videos.thumbnail_url }]
        : [],
    },
    alternates: {
      canonical: `https://davelovesdenver.com/articles/${slug}`,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  const video = article.youtube_videos;
  const neighborhood = article.neighborhood_slug
    ? getNeighborhood(article.neighborhood_slug)
    : null;
  const related = await getRelatedArticles(slug, article.neighborhood_slug);

  const expediaUrl = article.expedia_url ??
    expediaHotelUrl(neighborhood ? `${neighborhood.name} Denver` : "Denver Colorado");

  const bookingUrl = article.neighborhood_slug
    ? hotelSearchUrl(`${neighborhood?.name ?? article.neighborhood_slug} Denver`)
    : hotelSearchUrl("Denver Colorado");

  const publishDate = video?.published_at
    ? new Date(video.published_at).toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric"
      })
    : null;

  const updatedDate = new Date(article.updated_at).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric"
  });

  const paragraphs = article.content
    .split(/\n+/)
    .map((p: string) => p.trim())
    .filter((p: string) => p.length > 0);

  const firstPara = paragraphs[0];
  const restParas = paragraphs.slice(1);

  return (
    <>
      <SchemaMarkup
        breadcrumbs={[
          { name: "Home", url: "https://davelovesdenver.com" },
          { name: "Articles", url: "https://davelovesdenver.com/articles" },
          { name: article.title, url: `https://davelovesdenver.com/articles/${slug}` },
        ]}
        videos={video ? [{
          name: video.title,
          description: video.description ?? "",
          thumbnailUrl: video.thumbnail_url ?? "",
          uploadDate: video.published_at ?? "",
          videoId: video.video_id,
        }] : []}
      />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <nav className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-slate-500">
            <li><Link href="/" className="hover:text-foreground transition-colors">Home</Link></li>
            <li>/</li>
            <li><Link href="/articles" className="hover:text-foreground transition-colors">Articles</Link></li>
            {neighborhood && (
              <>
                <li>/</li>
                <li>
                  <Link href={`/denver/${neighborhood.slug}`} className="hover:text-foreground transition-colors">
                    {neighborhood.name}
                  </Link>
                </li>
              </>
            )}
          </ol>
        </nav>
        <div className="flex items-center gap-2 flex-wrap mb-4">
          {neighborhood && (
            <Link href={`/denver/${neighborhood.slug}`} className="text-xs px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100 transition-colors">
              {neighborhood.name}
            </Link>
          )}
          {article.category_slug && (
            <span className="text-xs px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 capitalize">
              {article.category_slug.replace("-", " ")}
            </span>
          )}
          <span className="text-xs px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700 capitalize">
            {article.content_type}
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
          {article.title}
        </h1>
        <div className="flex items-center gap-3 mb-8 pb-8 border-b border-slate-200 dark:border-slate-800">
          <div className="w-10 h-10 rounded-full bg-denver-amber flex items-center justify-center text-slate-900 font-bold text-sm flex-shrink-0">
            DC
          </div>
          <div>
            <p className="text-sm font-semibold">Dave Chung</p>
            <p className="text-xs text-slate-500">
              Denver local · youtube.com/davechung
              {publishDate && ` · ${publishDate}`}
            </p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-xs text-slate-400">Updated</p>
            <p className="text-xs text-slate-500">{updatedDate}</p>
          </div>
        </div>
        <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
          {firstPara}
        </p>
        {video && (
          <div className="mb-8 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
            <div className="aspect-video">
              <iframe
                src={embedUrl(video.video_id)}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
            <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900 flex items-center justify-between">
              <p className="text-sm text-slate-500">{video.title}</p>
              {video.view_count && (
                <p className="text-xs text-slate-400">{video.view_count.toLocaleString()} views</p>
              )}
            </div>
          </div>
        )}
        <div className="prose prose-slate dark:prose-invert max-w-none mb-10">
          {restParas.map((para: string, i: number) => (
            <p key={i} className="text-base leading-relaxed mb-5 text-slate-700 dark:text-slate-300">
              {para}
            </p>
          ))}
        </div>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden mb-10">
          <div className="px-5 py-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
            <p className="text-sm font-semibold">
              {neighborhood ? `Staying near ${neighborhood.name}?` : "Planning a Denver trip?"}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">Dave recommends these booking options</p>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            <div className="flex items-center gap-4 px-5 py-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                <span className="text-blue-700 font-bold text-xs">EXP</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">Expedia</p>
                <p className="text-xs text-slate-500">
                  {neighborhood ? `Hotels near ${neighborhood.name}` : "Denver hotels"} — compare prices
                </p>
              </div>
              <a href={expediaUrl} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 px-4 py-2 bg-denver-amber text-slate-900 text-xs font-semibold rounded-xl hover:bg-amber-400 transition-colors">
                Search hotels
              </a>
            </div>
            <div className="flex items-center gap-4 px-5 py-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                <span className="text-blue-700 font-bold text-xs">BK</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">Booking.com</p>
                <p className="text-xs text-slate-500">
                  {neighborhood ? `${neighborhood.name} area` : "Denver"} — free cancellation options
                </p>
              </div>
              <a href={bookingUrl} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 px-4 py-2 bg-denver-amber text-slate-900 text-xs font-semibold rounded-xl hover:bg-amber-400 transition-colors">
                Search hotels
              </a>
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-slate-900 dark:bg-slate-800 px-6 py-6 mb-10 flex items-center gap-5 flex-wrap">
          <div className="w-12 h-12 rounded-xl bg-red-600 flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-white font-semibold">Enjoyed this guide?</p>
            <p className="text-slate-400 text-sm mt-0.5">Subscribe to Dave Loves Denver on YouTube for new videos every week</p>
          </div>
          <a href="https://youtube.com/davechung?sub_confirmation=1" target="_blank" rel="noopener noreferrer" className="flex-shrink-0 px-5 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-500 transition-colors">
            Subscribe
          </a>
        </div>
        {related.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-5">
              {neighborhood ? `More from ${neighborhood.name}` : "More Denver guides"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {related.map((rel: any) => (
                <Link key={rel.slug} href={`/articles/${rel.slug}`} className="group flex gap-3 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-denver-amber transition-all">
                  {rel.youtube_videos?.thumbnail_url && (
                    <div className="w-20 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100">
                      <img src={rel.youtube_videos.thumbnail_url} alt={rel.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold line-clamp-2 group-hover:text-denver-amber transition-colors">{rel.title}</p>
                    <p className="text-xs text-slate-400 mt-1 capitalize">{rel.content_type} · {rel.neighborhood_slug?.replace("-", " ")}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

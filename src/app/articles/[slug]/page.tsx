import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { embedUrl, getVideosForPage } from "@/lib/youtube";
import { expediaDenverHotelsUrl, expediaFlightsToDenverUrl } from "@/lib/travelpayouts";
import { getNeighborhood } from "@/lib/neighborhoods";
import { getPlaces, isRealHotel, isUsefulPlace, photoUrl, type Place } from "@/lib/places";
import { searchViatorProducts } from "@/lib/viator";
import SchemaMarkup from "@/components/SchemaMarkup";
import VideoCard from "@/components/VideoCard";
import ViatorProductCard from "@/components/ViatorProductCard";

export const revalidate = 86400;

// Neighborhood name → slug map. Longer/more specific phrases listed first to
// prevent partial matches (e.g. "River North Art District" before "River North").
const NEIGHBORHOOD_LINK_MAP: Array<[RegExp, string]> = [
  [/\bRiver North Art District\b/gi, "rino"],
  [/\bRiver North\b/gi, "rino"],
  [/\bRiNo\b/g, "rino"],
  [/\bLower Downtown\b/gi, "lodo"],
  [/\bLoDo\b/g, "lodo"],
  [/\bUnion Station\b/gi, "lodo"],
  [/\bCapitol Hill\b/gi, "capitol-hill"],
  [/\bCap Hill\b/gi, "capitol-hill"],
  [/\bthe Highlands\b/gi, "highlands"],
  [/\bHighlands neighborhood\b/gi, "highlands"],
  [/\bCherry Creek\b/gi, "cherry-creek"],
  [/\bFive Points\b/gi, "five-points"],
  [/\bWashington Park\b/gi, "washington-park"],
  [/\bWash Park\b/gi, "washington-park"],
  [/\bGolden Triangle\b/gi, "golden-triangle"],
  [/\bSloan Lake\b/gi, "sloan-lake"],
  [/\bPlatt Park\b/gi, "platt-park"],
  [/\bSouth Pearl Street\b/gi, "platt-park"],
  [/\bSouth Pearl\b/gi, "platt-park"],
  [/\bJefferson Park\b/gi, "jefferson-park"],
  [/\bCurtis Park\b/gi, "curtis-park"],
  [/\bTennyson Street\b/gi, "berkeley"],
  [/\bSouth Broadway\b/gi, "baker"],
  [/\bSoBo\b/g, "baker"],
];

// Replace neighborhood name mentions in text with internal links.
// Splits HTML into tags and text nodes so existing <a> tags are never touched.
function linkifyNeighborhoods(html: string): string {
  return html.replace(/(<[^>]+>)|([^<]+)/g, (match, tag, textNode) => {
    if (tag) return tag;
    let result = textNode;
    for (const [pattern, slug] of NEIGHBORHOOD_LINK_MAP) {
      result = result.replace(
        pattern,
        `<a href="/denver/${slug}" class="text-denver-amber hover:underline font-medium">$&</a>`
      );
    }
    return result;
  });
}

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
  const imageUrl = article.youtube_videos?.thumbnail_url ?? null;

  return {
    title: `${article.title} | Dave Loves Denver`,
    description,
    openGraph: {
      title: article.title,
      description,
      url: `https://davelovesdenver.com/articles/${slug}`,
      type: "article",
      publishedTime: article.updated_at ?? undefined,
      authors: ["https://davelovesdenver.com/about"],
      images: imageUrl ? [{ url: imageUrl }] : [],
    },
    alternates: {
      canonical: `https://davelovesdenver.com/articles/${slug}`,
    },
  };
}

// eslint-disable-next-line @next/next/no-img-element
function HotelCard({ hotel, fallbackUrl }: { hotel: Place; fallbackUrl: string }) {
  const photo = hotel.photos?.[0];
  const href = hotel.expedia_affiliate_url ?? fallbackUrl;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer sponsored"
      className="group flex flex-col rounded-xl overflow-hidden border border-white/10 hover:border-denver-amber transition-colors bg-white/5">
      <div className="aspect-[16/9] overflow-hidden bg-slate-800">
        {photo && (
          <img src={photoUrl(photo.name, 400, 225)} alt={hotel.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
        )}
      </div>
      <div className="p-3 flex flex-col gap-1 flex-1">
        <p className="text-sm font-semibold text-white line-clamp-1 group-hover:text-denver-amber transition-colors">{hotel.name}</p>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          {hotel.rating && <span className="text-amber-400">★ {hotel.rating.toFixed(1)}</span>}
          {hotel.price_level != null && hotel.price_level > 0 && <span>{"$".repeat(hotel.price_level)}</span>}
        </div>
        <p className="text-xs font-semibold text-denver-amber mt-auto pt-1">Book on Expedia →</p>
      </div>
    </a>
  );
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  const video = article.youtube_videos;
  const neighborhood = article.neighborhood_slug
    ? getNeighborhood(article.neighborhood_slug)
    : null;
  const isWeeklyGuide = article.content_type === "weekly-guide";

  const viatorQuery = neighborhood ? `${neighborhood.name} Denver` : "Denver Colorado";

  const [related, weeklyVideos, nearbyHotels, viatorProducts] = await Promise.all([
    getRelatedArticles(slug, article.neighborhood_slug),
    isWeeklyGuide
      ? getVideosForPage(null, article.category_slug ?? "things-to-do", 3)
      : Promise.resolve([]),
    article.neighborhood_slug
      ? getPlaces(article.neighborhood_slug, "hotels").then((h) =>
          h.filter(isRealHotel).filter(isUsefulPlace).slice(0, 3)
        )
      : Promise.resolve([] as Place[]),
    searchViatorProducts(viatorQuery, 6).then((p) => p.slice(0, 6)),
  ]);

  const expediaUrl = article.expedia_url ??
    expediaDenverHotelsUrl(neighborhood ? `${neighborhood.name} Denver, Colorado` : "Denver, Colorado");

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
        article={{
          title: article.title,
          slug,
          publishedAt: (video as any)?.published_at ?? article.generated_at,
          updatedAt: article.updated_at,
          imageUrl: (video as any)?.thumbnail_url ?? (article as any).places_mentioned?.[0]?.photo_url ?? null,
          description: article.content.slice(0, 200).replace(/\n/g, " "),
        }}
        videos={video ? [{
          name: video.title,
          description: video.description ?? "",
          thumbnailUrl: video.thumbnail_url ?? "",
          uploadDate: video.published_at ?? "",
          videoId: video.video_id,
        }] : []}
      />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">

        {/* Main content */}
        <div className="min-w-0">
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
        {/* Hero image for roundup articles */}
        {(() => {
          const a = article as any;
          const photo = a.places_mentioned?.[0];
          if (!["roundup", "weekly-guide"].includes(a.content_type) || !photo?.photo_url) return null;
          const imgSrc = photo.photo_url.startsWith("places/")
            ? `/api/places-photo?name=${encodeURIComponent(photo.photo_url)}`
            : photo.photo_url;
          return (
            <div className="mb-8 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
              <img src={imgSrc} alt={article.title} className="w-full h-64 object-cover" />
              {photo.photo_credit && photo.photo_credit !== "Google Places" && (
                <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900">
                  <p className="text-xs text-slate-400">
                    Photo:{" "}
                    <a href={photo.photo_credit_url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {photo.photo_credit}
                    </a>
                  </p>
                </div>
              )}
            </div>
          );
        })()}

        {firstPara.startsWith("## ") ? (
          <h2 className="text-xl font-bold mt-8 mb-3 text-slate-900 dark:text-slate-100">
            {firstPara.replace("## ", "")}
          </h2>
        ) : (
          <p
            className="text-lg leading-relaxed text-slate-700 dark:text-slate-300 mb-6"
            dangerouslySetInnerHTML={{ __html: linkifyNeighborhoods(firstPara) }}
          />
        )}
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
          {restParas.map((para: string, i: number) => {
            if (para.startsWith("### ")) {
              return (
                <h3 key={i} className="text-base font-semibold uppercase tracking-wide mt-8 mb-2 text-denver-amber">
                  {para.replace("### ", "")}
                </h3>
              );
            }
            if (para.startsWith("## ")) {
              return (
                <h2 key={i} className="text-xl font-bold mt-8 mb-3 text-slate-900 dark:text-slate-100">
                  {para.replace("## ", "")}
                </h2>
              );
            }
            if (para.startsWith("# ")) {
              return (
                <h1 key={i} className="text-2xl font-bold mt-8 mb-3 text-slate-900 dark:text-slate-100">
                  {para.replace("# ", "")}
                </h1>
              );
            }
            return (
              <p key={i} className="text-base leading-relaxed mb-5 text-slate-700 dark:text-slate-300"
                dangerouslySetInnerHTML={{
                  __html: linkifyNeighborhoods(
                    para
                      .replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-teal-600 dark:text-teal-400 underline hover:no-underline">$1</a>')
                      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
                  )
                }}
              />
            );
          })}
        </div>

        {/* Related videos for weekly guides */}
        {isWeeklyGuide && weeklyVideos.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-bold mb-2">Watch Dave's Denver Videos</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
              More from Dave's Denver series.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {weeklyVideos.map((v) => (
                <VideoCard key={v.video_id} video={v} />
              ))}
            </div>
          </div>
        )}

        {/* Trip planning module */}
        <div className="rounded-2xl overflow-hidden mb-10 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
          <div className="px-6 pt-6 pb-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-1">Plan Your Trip</p>
            <h3 className="text-xl font-bold">
              {neighborhood ? `Visiting ${neighborhood.name}?` : "Coming to Denver?"}
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              Book hotels, tours, and flights — all in one place.
            </p>
          </div>

          {/* Hotels */}
          <div className="px-6 py-5 border-t border-white/10">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-bold text-white">🏨 Where to Stay</p>
              <a href={expediaUrl} target="_blank" rel="noopener noreferrer sponsored"
                className="text-xs text-denver-amber hover:underline font-medium">
                {neighborhood ? `All ${neighborhood.name} hotels →` : "All Denver hotels →"}
              </a>
            </div>
            {nearbyHotels.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {nearbyHotels.map((hotel) => (
                  <HotelCard key={hotel.place_id} hotel={hotel} fallbackUrl={expediaUrl} />
                ))}
              </div>
            ) : (
              <a href={expediaUrl} target="_blank" rel="noopener noreferrer sponsored"
                className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3 hover:bg-white/10 transition-colors group">
                <p className="text-sm text-slate-300">
                  {neighborhood ? `Hotels near ${neighborhood.name}` : "Denver area hotels"} · compare prices
                </p>
                <span className="text-xs font-bold text-denver-amber shrink-0 ml-3 group-hover:underline">Search →</span>
              </a>
            )}
          </div>

          {/* Viator experiences */}
          {viatorProducts.length > 0 && (
            <div className="px-6 py-5 border-t border-white/10">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-bold text-white">🎯 Things to Do</p>
                <a href="https://www.viator.com/Denver/d672-ttd?pid=P00295470&mcid=42383&medium=api"
                  target="_blank" rel="noopener noreferrer sponsored"
                  className="text-xs text-denver-amber hover:underline font-medium">
                  Browse all experiences →
                </a>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {viatorProducts.map((product) => (
                  <ViatorProductCard key={product.productCode} product={product} />
                ))}
              </div>
            </div>
          )}

          {/* Flights */}
          <div className="px-6 py-5 border-t border-white/10">
            <div className="flex items-center gap-4 bg-white/5 rounded-xl px-4 py-3">
              <span className="text-2xl">✈️</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">Flights to Denver</p>
                <p className="text-xs text-slate-400">Search all airlines · DEN International Airport</p>
              </div>
              <a href={expediaFlightsToDenverUrl()} target="_blank" rel="noopener noreferrer sponsored"
                className="px-4 py-2 bg-denver-amber text-slate-900 text-xs font-bold rounded-lg hover:bg-amber-400 transition-colors shrink-0">
                Search flights
              </a>
            </div>
          </div>

          <p className="text-xs text-slate-500 px-6 pb-5">Affiliate links — booking supports this site at no extra cost to you.</p>
        </div>
        <div className="rounded-2xl bg-slate-900 dark:bg-slate-800 px-6 py-6 mb-10 flex items-center gap-5 flex-wrap">
          <div className="w-12 h-12 rounded-xl bg-red-600 flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-white font-semibold">Enjoyed this guide?</p>
            <p className="text-slate-400 text-sm mt-0.5">Subscribe to Dave Chung on YouTube for new Denver videos every week</p>
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
        </div>{/* end main content */}
      </div>
    </>
  );
}

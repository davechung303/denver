import type { Metadata } from "next";
import Link from "next/link";
import { NEIGHBORHOODS, CATEGORIES } from "@/lib/neighborhoods";
import { getPopularDenverVideos } from "@/lib/youtube";
import { getDenverWeather } from "@/lib/weather";
import { supabase } from "@/lib/supabase";
import VideoCard from "@/components/VideoCard";
import ArticleThumb from "@/components/ArticleThumb";
import WeatherWidget from "@/components/WeatherWidget";
import SchemaMarkup from "@/components/SchemaMarkup";

export const metadata: Metadata = {
  title: "Dave Loves Denver — Local Denver Guides, Videos & Restaurant Reviews",
  description:
    "Hyperlocal Denver guides, restaurant reviews, hotel picks, and neighborhood videos — written and filmed by a Denver local with over 2 million YouTube views.",
  openGraph: {
    title: "Dave Loves Denver",
    description:
      "Hyperlocal Denver guides, restaurant reviews, hotel picks, and neighborhood videos — written and filmed by a Denver local.",
    url: "https://davelovesdenver.com",
  },
};

export default async function HomePage() {
  const [videos, weather, articlesResult] = await Promise.all([
    getPopularDenverVideos(6),
    getDenverWeather(),
    supabase
      .from("articles")
      .select("slug, title, content_type, neighborhood_slug, category_slug, generated_at, places_mentioned, youtube_videos(thumbnail_url, view_count, published_at)")
      .order("generated_at", { ascending: false })
      .limit(20),
  ]);
  const articles = (articlesResult.data ?? []).slice(0, 7);
  return (
    <>
      <SchemaMarkup
        websiteSearch
        videos={videos.map((v) => ({
          name: v.title,
          description: v.description,
          thumbnailUrl: v.thumbnail_url,
          uploadDate: v.published_at,
          videoId: v.video_id,
        }))}
      />
      {/* Hero */}
      <section className="bg-denver-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left: text */}
            <div>
              {weather && (
                <div className="mb-6">
                  <WeatherWidget weather={weather} compact />
                </div>
              )}
              <p className="text-denver-amber text-sm font-semibold uppercase tracking-widest mb-4">
                Denver, Colorado
              </p>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
                Denver guides & videos from someone who actually lives here.
              </h1>
              <p className="mt-5 text-base text-white/70 leading-relaxed">
                I&apos;m Dave. I eat here, drink here, stay here, and film everything. Over 2 million YouTube
                views and counting — this is the real Denver.
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <Link
                  href="/articles"
                  className="inline-flex items-center gap-2 bg-denver-amber text-slate-900 font-semibold px-6 py-3 rounded-full hover:bg-amber-400 transition-colors"
                >
                  Read the Guides
                </Link>
                <Link
                  href="/videos"
                  className="inline-flex items-center gap-2 border border-white/20 text-white px-6 py-3 rounded-full hover:bg-white/10 transition-colors"
                >
                  Watch the Videos
                </Link>
              </div>
              <div className="mt-8 flex gap-8">
                <div>
                  <p className="text-2xl font-bold text-denver-amber">2M+</p>
                  <p className="text-xs text-white/50 mt-0.5 uppercase tracking-wide">YouTube Views</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-denver-amber">100+</p>
                  <p className="text-xs text-white/50 mt-0.5 uppercase tracking-wide">Guides & Reviews</p>
                </div>
              </div>
            </div>
            {/* Right: featured video */}
            <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <div className="aspect-video">
                <iframe
                  src="https://www.youtube.com/embed/ny7PDhZ9FOQ"
                  title="Denver Noodle Shops You Should Try In 2026"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
              <div className="px-4 py-3 bg-white/5">
                <p className="text-sm text-white/70">Denver Noodle Shops You Should Try In 2026</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Articles */}
      {articles.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold">Latest Guides & Reviews</h2>
              <p className="mt-2 text-slate-500 dark:text-slate-400">
                Denver restaurants, hotels, bars, and neighborhoods — written by a local.
              </p>
            </div>
            <Link
              href="/articles"
              className="hidden sm:inline-flex text-sm font-semibold text-denver-amber hover:underline"
            >
              See all guides &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article: any) => {
              const rawThumb = article.youtube_videos?.thumbnail_url;
              const thumb = rawThumb?.replace(/\/hqdefault\.jpg$/, "/maxresdefault.jpg");
              const photoUrl = article.places_mentioned?.[0]?.photo_url;
              const src = thumb || (photoUrl?.startsWith("places/")
                ? `/api/places-photo?name=${encodeURIComponent(photoUrl)}`
                : photoUrl);
              return (
                <Link
                  key={article.slug}
                  href={`/articles/${article.slug}`}
                  className="group flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:border-denver-amber hover:shadow-lg transition-all duration-200"
                >
                  {src && (
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
                  )}
                  <div className="p-4 flex flex-col gap-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 capitalize">
                        {article.content_type?.replace(/-/g, " ")}
                      </span>
                    </div>
                    <h3 className="font-semibold text-sm leading-tight group-hover:text-denver-amber transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/articles"
              className="inline-flex items-center gap-2 border border-slate-300 dark:border-slate-700 px-6 py-3 rounded-full text-sm font-semibold hover:border-denver-amber hover:text-denver-amber transition-colors"
            >
              See all guides &rarr;
            </Link>
          </div>
        </section>
      )}

      {/* YouTube Section */}
      <section className="bg-slate-50 dark:bg-slate-900/50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold">Popular Denver Videos</h2>
              <p className="mt-2 text-slate-500 dark:text-slate-400">
                The most-watched Denver neighborhood, restaurant, and hotel videos from my channel.
              </p>
            </div>
            <Link
              href="/videos"
              className="hidden sm:inline-flex text-sm font-semibold text-denver-amber hover:underline"
            >
              See all videos &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {videos.map((video) => (
              <VideoCard key={video.video_id} video={video} />
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/videos"
              className="text-sm font-semibold text-denver-amber hover:underline"
            >
              See all videos &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Neighborhoods Grid */}
      <section id="neighborhoods" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Explore by Neighborhood
          </h2>
          <p className="mt-3 text-slate-500 dark:text-slate-400 text-lg">
            Every corner of Denver has its own personality. Here&apos;s where I spend my time.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {NEIGHBORHOODS.map((n) => (
            <Link
              key={n.slug}
              href={`/denver/${n.slug}`}
              className="group relative overflow-hidden rounded-2xl aspect-[4/3] flex flex-col justify-end p-6 bg-gradient-to-br text-white hover:scale-[1.02] transition-transform duration-200"
              style={{ background: undefined }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={n.image} alt={n.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 group-hover:from-black/70 transition-all" />
              <div className="relative z-10">
                <p className="text-xs font-medium text-white/70 mb-1">{n.tagline}</p>
                <h3 className="text-2xl font-bold">{n.name}</h3>
                <p className="mt-2 text-sm text-white/80 line-clamp-2 leading-snug">{n.description}</p>
                <span className="mt-3 inline-flex items-center text-xs font-semibold text-white/90 group-hover:text-white transition-colors">
                  Explore {n.name} &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Browse by Category */}
      <section className="bg-slate-50 dark:bg-slate-900/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8">Browse by Category</h2>
          <div className="flex flex-wrap gap-3">
            {CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                href={`/denver/rino/${c.slug}`}
                className="px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-sm font-medium hover:border-denver-amber hover:text-denver-amber transition-colors"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="bg-denver-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold mb-4">Why I Built This</h2>
            <p className="text-white/70 leading-relaxed text-lg">
              Every Denver guide I found felt like it was written by an algorithm or someone who visited
              for a weekend. I&apos;ve lived here, explored every neighborhood, and filmed hundreds of hours
              of content. This site is my attempt to give you the real Denver — the places that locals
              actually go, the hotels worth the money, and the spots that never make the listicles.
            </p>
            <Link
              href="/about"
              className="mt-6 inline-flex items-center gap-2 text-denver-amber font-semibold hover:underline"
            >
              More about me &rarr;
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { NEIGHBORHOODS, CATEGORIES } from "@/lib/neighborhoods";
import { getVideosForPage } from "@/lib/youtube";
import { getDenverWeather } from "@/lib/weather";
import { supabase } from "@/lib/supabase";
import VideoCard from "@/components/VideoCard";
import WeatherWidget from "@/components/WeatherWidget";
import SchemaMarkup from "@/components/SchemaMarkup";

export const metadata: Metadata = {
  title: "Dave Loves Denver — Hyperlocal Denver Neighborhood Guide",
  description:
    "A hyperlocal guide to Denver's best neighborhoods, restaurants, hotels, bars, and things to do. Written by a local who actually lives it.",
  openGraph: {
    title: "Dave Loves Denver",
    description:
      "A hyperlocal guide to Denver's best neighborhoods, restaurants, hotels, bars, and things to do.",
    url: "https://davelovesdenver.com",
  },
};

export default async function HomePage() {
  const [videos, weather, articlesResult] = await Promise.all([
    getVideosForPage(null, null, 6),
    getDenverWeather(),
    supabase
      .from("articles")
      .select("slug, title, content_type, neighborhood_slug, category_slug, generated_at, youtube_videos(thumbnail_url, view_count)")
      .order("generated_at", { ascending: false })
      .limit(4),
  ]);
  const articles = articlesResult.data ?? [];
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36">
          {weather && (
            <div className="mb-8">
              <WeatherWidget weather={weather} compact />
            </div>
          )}
          <div className="max-w-3xl">
            <p className="text-denver-amber text-sm font-semibold uppercase tracking-widest mb-4">
              Denver, Colorado
            </p>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight">
              The Denver guide that actually feels like Denver.
            </h1>
            <p className="mt-6 text-lg md:text-xl text-white/70 leading-relaxed max-w-2xl">
              I&apos;m Dave. I live here, eat here, drink here, and film it all. This is my guide to the
              neighborhoods, restaurants, hotels, and hidden spots that make this city worth loving.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="#neighborhoods"
                className="inline-flex items-center gap-2 bg-denver-amber text-slate-900 font-semibold px-6 py-3 rounded-full hover:bg-amber-400 transition-colors"
              >
                Explore Neighborhoods
              </Link>
              <a
                href="https://youtube.com/davechung"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-white/20 text-white px-6 py-3 rounded-full hover:bg-white/10 transition-colors"
              >
                Watch on YouTube
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Neighborhoods Grid */}
      <section id="neighborhoods" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            The Neighborhoods
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
              <div className={`absolute inset-0 bg-gradient-to-br ${n.gradient} opacity-90 group-hover:opacity-100 transition-opacity`} />
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

      {/* YouTube Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold">From My Channel</h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              I film everything. Here&apos;s what I&apos;ve been exploring lately.
            </p>
          </div>
          <a
            href="https://youtube.com/davechung"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex text-sm font-semibold text-denver-amber hover:underline"
          >
            See all videos &rarr;
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {videos.map((video) => (
            <VideoCard key={video.video_id} video={video} />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <a
            href="https://youtube.com/davechung"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-denver-amber hover:underline"
          >
            See all videos &rarr;
          </a>
        </div>
      </section>

      {/* Latest Articles */}
      {articles.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold">Latest Guides & Articles</h2>
              <p className="mt-2 text-slate-500 dark:text-slate-400">
                Denver restaurants, hotels, neighborhoods — written by a local.
              </p>
            </div>
            <Link
              href="/articles"
              className="hidden sm:inline-flex text-sm font-semibold text-denver-amber hover:underline"
            >
              See all articles &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {articles.map((article: any) => (
              <Link
                key={article.slug}
                href={`/articles/${article.slug}`}
                className="group flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:border-denver-amber hover:shadow-lg transition-all duration-200"
              >
                {article.youtube_videos?.thumbnail_url && (
                  <div className="aspect-video overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={article.youtube_videos.thumbnail_url}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="p-4 flex flex-col gap-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {article.neighborhood_slug && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200 capitalize">
                        {article.neighborhood_slug.replace("-", " ")}
                      </span>
                    )}
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 capitalize">
                      {article.content_type}
                    </span>
                  </div>
                  <h3 className="font-semibold text-sm leading-tight group-hover:text-denver-amber transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link href="/articles" className="text-sm font-semibold text-denver-amber hover:underline">
              See all articles &rarr;
            </Link>
          </div>
        </section>
      )}

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

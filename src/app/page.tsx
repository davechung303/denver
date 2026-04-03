import type { Metadata } from "next";
import Link from "next/link";
import { NEIGHBORHOODS } from "@/lib/neighborhoods";
import { getPopularDenverVideos, getLatestLongFormVideos, watchUrl } from "@/lib/youtube";
import VideoCard from "@/components/VideoCard";
import SchemaMarkup from "@/components/SchemaMarkup";

export const revalidate = 3600;

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

const HERO_VIDEO_ID = "ny7PDhZ9FOQ";

export default async function HomePage() {
  let popularVideos: Awaited<ReturnType<typeof getPopularDenverVideos>> = [];
  let latestVideos: Awaited<ReturnType<typeof getLatestLongFormVideos>> = [];

  try {
    [popularVideos, latestVideos] = await Promise.race([
      Promise.all([
        getPopularDenverVideos(6),
        getLatestLongFormVideos(5, [HERO_VIDEO_ID]),
      ]),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error("db timeout")), 15000)),
    ]);
  } catch {
    // Supabase timeout — render with empty state
  }

  // Filter hero video and any videos already shown in the Latest section from Popular
  const shownIds = new Set([HERO_VIDEO_ID, ...latestVideos.map((v) => v.video_id)]);
  const videos = popularVideos.filter((v) => !shownIds.has(v.video_id));
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
              <p className="text-denver-amber text-sm font-semibold uppercase tracking-widest mb-4">
                Denver, Colorado
              </p>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
                A local&apos;s guide to Denver neighborhoods, restaurants, and hotels.
              </h1>
              <p className="mt-5 text-base text-white/70 leading-relaxed">
                I&apos;m Dave. I live here, eat here, and spend a lot of time exploring every corner of this city.
                This site is my attempt to make Denver easier to navigate — whether you&apos;re visiting for a weekend
                or just haven&apos;t found your favorite neighborhood spot yet.
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

      {/* Latest Videos — featured layout */}
      {latestVideos.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold">Latest Guides & Reviews</h2>
              <p className="mt-2 text-slate-500 dark:text-slate-400">
                Denver restaurants, hotels, bars, and neighborhoods — filmed by a local.
              </p>
            </div>
            <Link
              href="/videos"
              className="hidden sm:inline-flex text-sm font-semibold text-denver-amber hover:underline"
            >
              See all videos &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Featured video — takes 2 columns */}
            {latestVideos[0] && (() => {
              const v = latestVideos[0];
              return (
                <a
                  href={watchUrl(v.video_id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lg:col-span-2 group flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:border-denver-amber hover:shadow-lg transition-all duration-200"
                >
                  <div className="relative aspect-video overflow-hidden bg-slate-100 dark:bg-slate-800">
                    {v.thumbnail_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={v.thumbnail_url.replace(/\/hqdefault\.jpg$/, "/maxresdefault.jpg")}
                        alt={v.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                      <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                        <svg className="w-7 h-7 text-slate-900 ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="p-5 flex flex-col gap-2">
                    <h3 className="font-bold text-lg leading-snug group-hover:text-denver-amber transition-colors">
                      {v.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      {v.view_count && <span>{v.view_count >= 1000 ? `${(v.view_count / 1000).toFixed(1)}K` : v.view_count} views</span>}
                      {v.view_count && v.published_at && <span>·</span>}
                      {v.published_at && <span>{new Date(v.published_at).toLocaleDateString("en-US", { year: "numeric", month: "short" })}</span>}
                    </div>
                  </div>
                </a>
              );
            })()}

            {/* Sidebar: 2–3 more videos */}
            <div className="flex flex-col gap-4">
              {latestVideos.slice(1, 4).map((v) => (
                <VideoCard key={v.video_id} video={v} />
              ))}
            </div>
          </div>
        </section>
      )}

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

      {/* About */}
      <section className="bg-denver-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold mb-4">Why I Built This</h2>
            <p className="text-white/70 leading-relaxed text-lg">
              I kept getting asked the same questions — where to eat in RiNo, which hotel is actually
              worth it near downtown, what to do in neighborhoods people usually skip. I&apos;ve been making
              YouTube videos about Denver for years, and this site is the written companion to all of that.
              Everything here comes from time I&apos;ve actually spent in these places.
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

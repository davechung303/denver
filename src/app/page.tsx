import type { Metadata } from "next";
import Link from "next/link";
import { NEIGHBORHOODS } from "@/lib/neighborhoods";
import { getPopularDenverVideos } from "@/lib/youtube";
import VideoCard from "@/components/VideoCard";
import SchemaMarkup from "@/components/SchemaMarkup";
import { supabase } from "@/lib/supabase";
import { getPlaces, isRealHotel, photoUrl } from "@/lib/places";

const STAY_VENUES = [
  { href: "/hotels/near-coors-field", label: "Coors Field", sub: "Rockies games in LoDo", nb: "lodo" },
  { href: "/hotels/near-ball-arena", label: "Ball Arena", sub: "Nuggets, Avs & concerts", nb: "lodo" },
  { href: "/hotels/near-empower-field", label: "Empower Field", sub: "Broncos & stadium shows", nb: "jefferson-park" },
  { href: "/hotels/near-red-rocks", label: "Red Rocks", sub: "Shows in the foothills", nb: "denver-suburbs" },
  { href: "/hotels/near-denver-airport", label: "Denver Airport", sub: "Early flights & layovers", nb: "airport" },
  { href: "/hotels/near-cherry-creek", label: "Cherry Creek", sub: "Denver's nicest hotels", nb: "cherry-creek" },
];

async function getStayPhotos(): Promise<Record<string, string>> {
  try {
    const nbs = Array.from(new Set(STAY_VENUES.map((v) => v.nb)));
    const entries = await Promise.all(nbs.map(async (nb) => {
      const withPhoto = (await getPlaces(nb, "hotels")).filter(isRealHotel).find((h) => h.photos?.[0]);
      return [nb, withPhoto?.photos?.[0] ? photoUrl(withPhoto.photos[0]) : ""] as const;
    }));
    return Object.fromEntries(entries);
  } catch { return {}; }
}

export const revalidate = 86400;

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

const HERO_VIDEO_ID = "Jnbjxwl84c8";
const PINNED_VIDEO_IDS = ["ny7PDhZ9FOQ", "Zp66Pfg-ZqM"];
const EXCLUDED_VIDEO_IDS = new Set(["ygxF4hz7KBY", "yIX0Y5Wc7QQ", "zMYd-4Iqllo"]);

export default async function HomePage() {
  let popularVideos: Awaited<ReturnType<typeof getPopularDenverVideos>> = [];
  let latestArticles: any[] = [];

  let pinnedRaw: any[] = [];
  try {
    [popularVideos, latestArticles, pinnedRaw] = await Promise.race([
      Promise.all([
        getPopularDenverVideos(15),
        supabase
          .from("articles")
          .select(`slug, title, content_type, neighborhood_slug, generated_at, places_mentioned, youtube_videos (thumbnail_url)`)
          .order("generated_at", { ascending: false })
          .limit(4)
          .then(({ data }) => data ?? []),
        supabase
          .from("youtube_videos")
          .select("*")
          .in("video_id", PINNED_VIDEO_IDS)
          .then(({ data }) => data ?? []),
      ]),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error("db timeout")), 15000)),
    ]);
  } catch {
    // Supabase timeout — render with empty state
  }

  // Build Popular Videos: pinned first, then fill from popular, excluding hero + Gaylord Rockies
  const excludeIds = new Set([HERO_VIDEO_ID, ...EXCLUDED_VIDEO_IDS]);
  const popular = popularVideos.filter((v) => !excludeIds.has(v.video_id) && !PINNED_VIDEO_IDS.includes(v.video_id));
  const pinned = PINNED_VIDEO_IDS
    .map((id) => pinnedRaw.find((v: any) => v.video_id === id))
    .filter(Boolean);
  const videos = [...pinned, ...popular].slice(0, 6);
  const stayPhotos = await getStayPhotos();
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
                  <p className="text-2xl font-bold text-denver-amber">25K+</p>
                  <p className="text-xs text-white/50 mt-0.5 uppercase tracking-wide">Denver Subscribers</p>
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
                  src="https://www.youtube.com/embed/Jnbjxwl84c8"
                  title="Havana Street Night Market — Denver's Best Kept Secret"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
              <div className="px-4 py-3 bg-white/5">
                <p className="text-sm text-white/70">Havana Street Night Market — Denver&apos;s Best Kept Secret</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* As Heard On */}
      <section className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-slate-400 mb-6">As heard on</p>
          <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-16">
            <img
              src="/logo-koa-radio.webp"
              alt="KOA 850 AM 94.1 FM News Talk Sports"
              className="h-12 sm:h-14 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity"
            />
            <img
              src="/logo-citycast-denver.avif"
              alt="City Cast Denver"
              className="h-10 sm:h-12 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity"
            />
            <img
              src="https://i.scdn.co/image/ab6765630000ba8a2261e2b686f77054c4dd1686"
              alt="Off the Clock with Jon Eks"
              className="h-12 sm:h-14 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity rounded-lg"
            />
            <img
              src="https://www.witness.org/wp-content/uploads/2014/07/boingboing-700-175.png"
              alt="BoingBoing.net"
              className="h-8 sm:h-10 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity"
            />
          </div>
        </div>
      </section>

      {/* Latest Guides & Reviews — articles linking to internal pages */}
      {latestArticles.length > 0 && (
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
              See all articles &rarr;
            </Link>
          </div>

          {/* Article cards — link to /articles/[slug] */}
          {latestArticles.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {latestArticles.map((article: any) => {
                const rawThumb = article.youtube_videos?.thumbnail_url;
                const thumb = rawThumb?.replace(/\/hqdefault\.jpg$/, "/maxresdefault.jpg")
                  ?? article.places_mentioned?.[0]?.photo_url ?? null;
                return (
                  <Link
                    key={article.slug}
                    href={`/articles/${article.slug}`}
                    className="group flex flex-col rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-denver-amber hover:shadow-lg transition-all duration-200 bg-white dark:bg-slate-900"
                  >
                    <div className="relative aspect-video overflow-hidden bg-slate-100 dark:bg-slate-800">
                      {thumb && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={thumb} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                      )}
                    </div>
                    <div className="p-4 flex flex-col gap-1.5 flex-1">
                      {article.neighborhood_slug && (
                        <p className="text-xs font-medium text-denver-amber uppercase tracking-wide">{article.neighborhood_slug.replace(/-/g, " ")}</p>
                      )}
                      <h3 className="text-sm font-semibold leading-snug line-clamp-2 group-hover:text-denver-amber transition-colors">{article.title}</h3>
                      <p className="text-xs text-slate-400 mt-auto pt-1 capitalize">{article.content_type ?? "guide"}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

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

      {/* Where to Stay */}
      <section className="border-t border-slate-200 dark:border-slate-800 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-3">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold">Where to Stay in Denver</h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400 text-lg">
              Coming for a game, a show, or a conference? Here&apos;s where a local would book.
            </p>
          </div>
          <Link href="/hotels" className="hidden sm:inline-flex text-sm font-semibold text-denver-amber hover:underline">
            All hotel guides &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {STAY_VENUES.map((v) => {
            const img = stayPhotos[v.nb];
            return (
              <Link key={v.href} href={v.href}
                className="group relative overflow-hidden rounded-2xl aspect-[4/3] flex flex-col justify-end p-5 text-white hover:scale-[1.02] transition-transform duration-200"
              >
                {img ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={img} alt={`Hotels near ${v.label}`} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-denver-navy to-slate-700" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10 group-hover:from-black/75 transition-all" />
                <div className="relative z-10">
                  <h3 className="text-lg font-bold leading-tight">Hotels near {v.label}</h3>
                  <p className="mt-0.5 text-sm text-white/80 leading-snug">{v.sub}</p>
                </div>
              </Link>
            );
          })}
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {[
            { href: "/hotels/near-mission-ballroom", label: "Mission Ballroom" },
            { href: "/hotels/near-convention-center", label: "Convention Center" },
            { href: "/hotels/near-denver-zoo", label: "Denver Zoo" },
            { href: "/hotels/near-fiddlers-green", label: "Fiddler's Green" },
            { href: "/denver/where-to-stay", label: "By Neighborhood" },
            { href: "/hotels/best-value-denver", label: "Best Value" },
          ].map((h) => (
            <Link key={h.href} href={h.href}
              className="inline-flex items-center px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-sm font-medium hover:border-denver-amber hover:text-denver-amber transition-colors">
              {h.label}
            </Link>
          ))}
        </div>
        <div className="mt-6 sm:hidden text-center">
          <Link href="/hotels" className="text-sm font-semibold text-denver-amber hover:underline">All hotel guides &rarr;</Link>
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

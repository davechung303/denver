import type { Metadata } from "next";
import { getAllVideos, isShort } from "@/lib/youtube";
import VideosClient from "./VideosClient";
import { fitTitle, fitDescription } from "@/lib/seo";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: fitTitle("Videos"),
  description: fitDescription("Every Denver video from Dave Chung: neighborhood guides, restaurant reviews, hotel tours and hidden gems, from a channel with 6.5 million views."),
  robots: { index: false, follow: false }, // excluded from search indexing per plan
};

export default async function VideosPage() {
  let allVideos: Awaited<ReturnType<typeof getAllVideos>> = [];
  try {
    allVideos = await Promise.race([
      getAllVideos(),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error("db timeout")), 15000)),
    ]);
  } catch {
    // db timeout — render empty
  }
  // Only the fields a card shows. The whole Video row (descriptions, tags) used
  // to be serialized into the client component's props: ~430 KB of payload.
  const slim = (v: (typeof allVideos)[number]) => ({
    id: v.id,
    video_id: v.video_id,
    title: v.title,
    thumbnail_url: v.thumbnail_url,
    view_count: v.view_count,
    published_at: v.published_at,
    description: null,
    duration_seconds: null,
    tags: null,
    cached_at: "",
  });
  const videos = allVideos.filter((v) => !isShort(v)).map(slim);
  const shorts = allVideos.filter((v) => isShort(v)).map(slim);

  return (
    <>
      <section className="bg-denver-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <p className="kicker mb-3">
            youtube.com/davechung
          </p>
          <h1 className="text-4xl md:text-5xl font-bold">All Videos</h1>
          <p className="mt-4 text-white/70 text-lg max-w-2xl">
            Every Denver video I&apos;ve made — neighborhood guides, restaurant reviews, hotel tours, and hidden gems.
          </p>
        </div>
      </section>

      <VideosClient videos={videos} shorts={shorts} />
    </>
  );
}

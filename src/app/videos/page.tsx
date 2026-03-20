import type { Metadata } from "next";
import { getVideosForPage } from "@/lib/youtube";
import VideoCard from "@/components/VideoCard";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Videos",
  description: "Watch all of Dave's Denver videos — neighborhood guides, restaurant reviews, hotel tours, and more.",
  robots: { index: false, follow: false }, // excluded from search indexing per plan
};

export default async function VideosPage() {
  const videos = await getVideosForPage(null, null, 50);

  return (
    <>
      <section className="bg-denver-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <p className="text-denver-amber text-sm font-semibold uppercase tracking-widest mb-3">
            youtube.com/davechung
          </p>
          <h1 className="text-4xl md:text-5xl font-bold">All Videos</h1>
          <p className="mt-4 text-white/70 text-lg max-w-2xl">
            Every Denver video I&apos;ve made — neighborhood guides, restaurant reviews, hotel tours, and hidden gems.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {videos.length > 0 ? (
          <>
            <p className="text-sm text-slate-400 mb-8">{videos.length} videos</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <VideoCard key={video.video_id} video={video} />
              ))}
            </div>
          </>
        ) : (
          <p className="text-center text-slate-400 py-16">Videos loading — check back soon.</p>
        )}

        <div className="mt-12 text-center">
          <a
            href="https://youtube.com/davechung"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-denver-amber text-slate-900 font-semibold px-6 py-3 rounded-full hover:bg-amber-400 transition-colors"
          >
            Subscribe on YouTube &rarr;
          </a>
        </div>
      </section>
    </>
  );
}

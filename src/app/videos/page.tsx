import type { Metadata } from "next";
import { getAllVideos, isShort } from "@/lib/youtube";
import VideosClient from "./VideosClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Videos",
  description: "Watch all of Dave's Denver videos — neighborhood guides, restaurant reviews, hotel tours, and more.",
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
  const videos = allVideos.filter((v) => !isShort(v));
  const shorts = allVideos.filter((v) => isShort(v));

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

      <VideosClient videos={videos} shorts={shorts} />
    </>
  );
}

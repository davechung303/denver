"use client";

import { useState } from "react";
import VideoCard from "@/components/VideoCard";
import type { Video } from "@/lib/youtube";

const PAGE_SIZE = 24;

interface Props {
  videos: Video[];
  shorts: Video[];
}

export default function VideosClient({ videos, shorts }: Props) {
  const [videosShown, setVideosShown] = useState(PAGE_SIZE);
  const [shortsShown, setShortsShown] = useState(PAGE_SIZE);

  if (videos.length === 0 && shorts.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <p className="text-center text-slate-400 py-16">Videos loading — check back soon.</p>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {videos.length > 0 && (
        <div className="mb-16">
          <div className="mb-8">
            <h2 className="text-2xl font-bold">Videos</h2>
            <p className="text-sm text-slate-400 mt-1">{videos.length} videos</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.slice(0, videosShown).map((video) => (
              <VideoCard key={video.video_id} video={video} />
            ))}
          </div>
          {videosShown < videos.length && (
            <div className="mt-10 text-center">
              <button
                onClick={() => setVideosShown((n) => n + PAGE_SIZE)}
                className="px-6 py-3 border border-slate-300 dark:border-slate-700 rounded-full text-sm font-semibold hover:border-denver-amber hover:text-denver-amber transition-colors"
              >
                Load more videos ({videos.length - videosShown} remaining)
              </button>
            </div>
          )}
        </div>
      )}

      {shorts.length > 0 && (
        <div>
          <div className="mb-8">
            <h2 className="text-2xl font-bold">Shorts</h2>
            <p className="text-sm text-slate-400 mt-1">{shorts.length} shorts</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {shorts.slice(0, shortsShown).map((video) => (
              <VideoCard key={video.video_id} video={video} short />
            ))}
          </div>
          {shortsShown < shorts.length && (
            <div className="mt-10 text-center">
              <button
                onClick={() => setShortsShown((n) => n + PAGE_SIZE)}
                className="px-6 py-3 border border-slate-300 dark:border-slate-700 rounded-full text-sm font-semibold hover:border-denver-amber hover:text-denver-amber transition-colors"
              >
                Load more shorts ({shorts.length - shortsShown} remaining)
              </button>
            </div>
          )}
        </div>
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
  );
}

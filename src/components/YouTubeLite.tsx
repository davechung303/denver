"use client";

import { useState } from "react";

/**
 * A YouTube player that loads only when clicked.
 *
 * A real YouTube iframe pulls roughly a megabyte of player script on page load,
 * whether or not anyone presses play. This shows the video's thumbnail and a
 * play button, then swaps in the real player (autoplaying) on click. The
 * homepage hero and every article page had an eager iframe.
 */
export default function YouTubeLite({ videoId, title, priority = false }: { videoId: string; title: string; priority?: boolean }) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Play video: ${title}`}
      className="group relative block w-full h-full bg-black"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
        alt=""
        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
      />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex items-center justify-center w-16 h-11 rounded-xl bg-[#ff0033] group-hover:scale-105 transition-transform">
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white ml-0.5" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </span>
    </button>
  );
}

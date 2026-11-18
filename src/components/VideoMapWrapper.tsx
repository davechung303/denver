"use client";

import dynamic from "next/dynamic";

// Leaflet touches `window` on import, so the map only ever renders in the browser.
const VideoMap = dynamic(() => import("./VideoMap"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-slate-100 dark:bg-slate-800 animate-pulse" />,
});

export default function VideoMapWrapper(props: React.ComponentProps<typeof VideoMap>) {
  return <VideoMap {...props} />;
}

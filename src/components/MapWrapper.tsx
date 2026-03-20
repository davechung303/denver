"use client";

import dynamic from "next/dynamic";

const NeighborhoodMap = dynamic(() => import("./NeighborhoodMap"), { ssr: false });

export default function MapWrapper(props: React.ComponentProps<typeof NeighborhoodMap>) {
  return <NeighborhoodMap {...props} />;
}

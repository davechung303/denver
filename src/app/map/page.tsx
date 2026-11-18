import type { Metadata } from "next";
import Link from "next/link";
import { getVideoMapPins, type VideoMapPin } from "@/lib/placeVideos";
import { NEIGHBORHOODS, CATEGORIES, isInNeighborhood } from "@/lib/neighborhoods";
import VideoMapWrapper from "@/components/VideoMapWrapper";
import SchemaMarkup from "@/components/SchemaMarkup";
import { seoMeta } from "@/lib/seo";

export const revalidate = 86400;

const URL = "https://davelovesdenver.com/map";
const meta = seoMeta(
  "Dave's Denver Food Map: Every Place I've Filmed",
  "A map of every Denver restaurant, bar and spot I've made a video about. Tap a pin to watch the video and read my take."
);

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  openGraph: { title: meta.ogTitle, description: meta.description, url: URL },
  alternates: { canonical: URL },
};

function neighborhoodFor(pin: VideoMapPin) {
  // Coordinates first: neighborhood_slug reflects how a place was fetched, not where it is.
  return (
    NEIGHBORHOODS.find((n) => isInNeighborhood(pin.lat, pin.lng, n.slug)) ??
    NEIGHBORHOODS.find((n) => n.slug === pin.neighborhoodSlug) ??
    null
  );
}

export default async function MapPage() {
  const pins = await getVideoMapPins();
  const videoCount = new Set(pins.flatMap((p) => p.videos.map((v) => v.id))).size;

  const groups = new Map<string, { name: string; slug: string | null; pins: VideoMapPin[] }>();
  for (const pin of pins) {
    const n = neighborhoodFor(pin);
    const key = n?.slug ?? "elsewhere";
    if (!groups.has(key)) groups.set(key, { name: n?.name ?? "Around the metro", slug: n?.slug ?? null, pins: [] });
    groups.get(key)!.pins.push(pin);
  }
  const sortedGroups = [...groups.values()].sort((a, b) => b.pins.length - a.pins.length);
  for (const g of sortedGroups) g.pins.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>
      <SchemaMarkup
        breadcrumbs={[
          { name: "Home", url: "https://davelovesdenver.com" },
          { name: "Map", url: URL },
        ]}
        itemLists={[
          {
            name: "Places Dave Chung has filmed in Denver",
            items: pins.slice(0, 100).map((p) => ({ name: p.name, url: `https://davelovesdenver.com${p.href}` })),
          },
        ]}
      />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
        <p className="kicker mb-2">The map</p>
        <h1 className="text-4xl font-bold">Every Denver place I&apos;ve filmed</h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
          {`${pins.length} places from ${videoCount} of my videos, pinned where they are. `}Tap a pin to watch the video, then
          open the page for my take, hours and what&apos;s nearby. Numbered circles are groups of places &mdash; tap to zoom in.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="h-[72vh] min-h-[480px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
          <VideoMapWrapper pins={pins} zoom={11} />
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <h2 className="text-2xl font-bold mb-6">All the places, by neighborhood</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {sortedGroups.map((g) => (
            <div key={g.name}>
              <h3 className="text-lg font-semibold mb-3">
                {g.slug ? (
                  <Link href={`/denver/${g.slug}`} className="hover:text-denver-amber transition-colors">
                    {g.name}
                  </Link>
                ) : (
                  g.name
                )}{" "}
                <span className="text-slate-400 font-normal">({g.pins.length})</span>
              </h3>
              <ul className="space-y-1.5">
                {g.pins.map((p) => {
                  const cat = CATEGORIES.find((c) => p.categorySlug.startsWith(c.slug));
                  return (
                    <li key={p.placeId} className="text-sm">
                      <Link href={p.href} className="font-medium hover:text-denver-amber transition-colors">
                        {p.name}
                      </Link>
                      {cat && <span className="text-slate-500"> · {cat.name}</span>}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

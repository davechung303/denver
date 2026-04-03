import type { Metadata } from "next";
import Link from "next/link";
import { NEIGHBORHOODS } from "@/lib/neighborhoods";

export const metadata: Metadata = {
  title: "About Dave",
  description: "I'm Dave — a Denver local, content creator, and the person behind Dave Loves Denver. Here's why I built this guide and what you can expect to find here.",
  openGraph: {
    url: "https://davelovesdenver.com/about",
  },
  alternates: {
    canonical: "https://davelovesdenver.com/about",
  },
};

export default function AboutPage() {
  return (
    <>
      <section className="bg-denver-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <p className="text-denver-amber text-sm font-semibold uppercase tracking-widest mb-3">
            About
          </p>
          <h1 className="text-5xl md:text-6xl font-bold">Dave Loves Denver</h1>
          <p className="mt-4 text-white/70 text-xl">A local guide, built by someone who actually lives here.</p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
          <p>
            I&apos;m Dave. I&apos;ve lived in Denver long enough to know which brunch spot is worth the wait,
            which brewery is actually great versus just Instagrammable, and which neighborhoods are quietly
            becoming the most interesting places in the city.
          </p>
          <p>
            I started filming Denver content on YouTube because I kept getting asked the same questions:
            <em> &ldquo;Where should I eat in RiNo? What&apos;s the best hotel near downtown? Is Capitol Hill actually worth visiting?&rdquo;</em>
          </p>
          <p>
            This site is the long-form answer to all of those questions. It&apos;s a neighborhood-by-neighborhood
            guide built on real experience, not sponsored content or algorithm-chasing. Every restaurant,
            hotel, and bar on here is rated by Google and filtered through the lens of someone who
            actually spends time in these places.
          </p>
          <p>
            I also pull in live data from Google Maps so ratings and hours are always current — not
            frozen in some article that was written three years ago and never updated.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-12">What you&apos;ll find here</h2>
          <ul className="space-y-2 list-disc list-inside">
            <li>Neighborhood guides for every corner of Denver</li>
            <li>Restaurant, hotel, bar, and coffee shop listings with live Google ratings</li>
            <li>My YouTube videos embedded on every relevant page</li>
            <li>Hotel booking links so you can plan a trip from start to finish</li>
            <li>Honest takes from someone who lives here</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-12">Find me on YouTube</h2>
          <p>
            I post Denver content regularly — neighborhood walkthroughs, restaurant reviews, hidden gems,
            and hotel tours. Subscribe if you want to see Denver the way I see it.
          </p>
          <a
            href="https://youtube.com/davechung"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-denver-amber text-slate-900 font-semibold px-6 py-3 rounded-full hover:bg-amber-400 transition-colors no-underline"
          >
            Watch on YouTube &rarr;
          </a>
        </div>

        {/* Neighborhood links */}
        <div className="mt-20 pt-12 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-2xl font-bold mb-8">Start exploring</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {NEIGHBORHOODS.map((n) => (
              <Link
                key={n.slug}
                href={`/denver/${n.slug}`}
                className="group relative overflow-hidden rounded-xl aspect-video flex items-end p-3 hover:scale-[1.02] transition-transform"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={n.image} alt={n.name} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
                <span className="relative z-10 text-white text-sm font-bold">{n.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

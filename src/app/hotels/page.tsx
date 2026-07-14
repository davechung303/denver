import type { Metadata } from "next";
import Link from "next/link";
import { getPlaces, isRealHotel, photoUrl } from "@/lib/places";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Where to Stay in Denver — Hotels by Venue & Neighborhood | Dave Loves Denver",
  description:
    "A local's index of where to stay in Denver — the best hotels near every major venue (Coors Field, Ball Arena, Red Rocks, the airport and more), plus neighborhood guides and game-day parking tips.",
  alternates: { canonical: "https://davelovesdenver.com/hotels" },
  openGraph: {
    title: "Where to Stay in Denver — Hotels by Venue & Neighborhood",
    description: "The best hotels near every major Denver venue, plus neighborhood guides — from a local.",
    url: "https://davelovesdenver.com/hotels",
  },
};

type Venue = { href: string; name: string; blurb: string; nb: string };
type Group = { title: string; venues: Venue[] };

const GROUPS: Group[] = [
  {
    title: "Sports & Big Events",
    venues: [
      { href: "/hotels/near-coors-field", name: "Coors Field", blurb: "Rockies games — walkable LoDo hotels.", nb: "lodo" },
      { href: "/hotels/near-ball-arena", name: "Ball Arena", blurb: "Nuggets, Avalanche & concerts.", nb: "lodo" },
      { href: "/hotels/near-empower-field", name: "Empower Field at Mile High", blurb: "Broncos games & stadium shows.", nb: "jefferson-park" },
      { href: "/hotels/near-national-western", name: "National Western Complex", blurb: "The Stock Show, rodeos & events.", nb: "rino" },
    ],
  },
  {
    title: "Concerts & Amphitheaters",
    venues: [
      { href: "/hotels/near-red-rocks", name: "Red Rocks Amphitheatre", blurb: "Morrison, Lakewood & shuttle options.", nb: "denver-suburbs" },
      { href: "/hotels/near-mission-ballroom", name: "Mission Ballroom", blurb: "RiNo's best mid-size venue.", nb: "rino" },
      { href: "/hotels/near-fiddlers-green", name: "Fiddler's Green Amphitheatre", blurb: "The DTC chain-hotel cluster.", nb: "denver-suburbs" },
    ],
  },
  {
    title: "Attractions & Family",
    venues: [
      { href: "/hotels/near-denver-zoo", name: "Denver Zoo", blurb: "City Park — family-friendly Uptown stays.", nb: "uptown" },
      { href: "/hotels/near-city-park", name: "City Park", blurb: "Zoo, museum & Jazz in the Park.", nb: "uptown" },
      { href: "/hotels/near-botanic-gardens", name: "Denver Botanic Gardens", blurb: "Cap Hill & Cherry Creek options.", nb: "capitol-hill" },
      { href: "/hotels/near-elitch-gardens", name: "Elitch Gardens", blurb: "Theme-park stays with a pool.", nb: "jefferson-park" },
    ],
  },
  {
    title: "Business, Airport & Medical",
    venues: [
      { href: "/hotels/near-convention-center", name: "Colorado Convention Center", blurb: "Walkable downtown conference hotels.", nb: "downtown" },
      { href: "/hotels/near-denver-airport", name: "Denver Airport (DEN)", blurb: "Early flights, late arrivals & shuttles.", nb: "airport" },
      { href: "/hotels/near-anschutz", name: "Anschutz Medical Campus", blurb: "Convenient stays for medical visits.", nb: "denver-suburbs" },
      { href: "/hotels/near-cherry-creek", name: "Cherry Creek", blurb: "Denver's nicest luxury & boutique hotels.", nb: "cherry-creek" },
    ],
  },
];

const ALL_HREFS = GROUPS.flatMap((g) => g.venues.map((v) => v.href));

// Fetch one representative hotel photo per neighborhood used above, so venue cards
// are image-backed (like the homepage). Falls back to a gradient where none exists.
async function getNeighborhoodPhotos(): Promise<Record<string, string>> {
  const nbs = Array.from(new Set(GROUPS.flatMap((g) => g.venues.map((v) => v.nb))));
  const entries = await Promise.all(
    nbs.map(async (nb) => {
      const hotels = (await getPlaces(nb, "hotels")).filter(isRealHotel);
      const withPhoto = hotels.find((h) => h.photos?.[0]);
      return [nb, withPhoto?.photos?.[0] ? photoUrl(withPhoto.photos[0]) : ""] as const;
    })
  );
  return Object.fromEntries(entries);
}

export default async function HotelsHubPage() {
  const photos = await getNeighborhoodPhotos();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
        { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://davelovesdenver.com" },
          { "@type": "ListItem", position: 2, name: "Hotels", item: "https://davelovesdenver.com/hotels" },
        ]},
        { "@context": "https://schema.org", "@type": "CollectionPage",
          name: "Where to Stay in Denver",
          description: "A local's index of the best hotels near every major Denver venue, plus neighborhood guides.",
          url: "https://davelovesdenver.com/hotels",
          hasPart: ALL_HREFS.map((h) => ({ "@type": "WebPage", url: `https://davelovesdenver.com${h}` })),
          speakableSpecification: { "@type": "SpeakableSpecification", cssSelector: ["[data-speakable]"] },
        },
      ])}} />

      <section className="bg-denver-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <nav className="flex items-center gap-2 text-sm text-white/50 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white/80">Hotels</span>
          </nav>
          <p className="text-denver-amber text-sm font-semibold uppercase tracking-widest mb-3">Where to Stay</p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight" data-speakable>Where to Stay in Denver</h1>
          <p className="mt-4 text-lg text-white/70 max-w-2xl" data-speakable>
            Whatever brought you to Denver — a Rockies game, a Red Rocks show, a conference, or an early flight — here&apos;s where a local would actually book, organized by what you&apos;re here for.
          </p>
        </div>
      </section>

      {/* Venue groups — image-backed cards */}
      {GROUPS.map((group) => (
        <section key={group.title} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-2xl font-bold mb-6">{group.title}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {group.venues.map((v) => {
              const img = photos[v.nb];
              return (
                <Link key={v.href} href={v.href}
                  className="group relative overflow-hidden rounded-2xl aspect-[4/3] flex flex-col justify-end p-5 text-white hover:scale-[1.02] transition-transform duration-200"
                >
                  {img ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={img} alt={`Hotels near ${v.name}`} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-denver-navy to-slate-700" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10 group-hover:from-black/75 transition-all" />
                  <div className="relative z-10">
                    <h3 className="text-lg font-bold leading-tight">Hotels near {v.name}</h3>
                    <p className="mt-1 text-sm text-white/80 leading-snug line-clamp-2">{v.blurb}</p>
                    <span className="mt-2 inline-flex items-center text-xs font-semibold text-denver-amber">View hotels &rarr;</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ))}

      {/* Neighborhood guide + value */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-100 dark:border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Link href="/denver/where-to-stay"
            className="group bg-denver-navy text-white rounded-2xl p-8 hover:bg-denver-navy/90 transition-colors">
            <h2 className="text-2xl font-bold">Where to Stay by Neighborhood</h2>
            <p className="mt-2 text-white/70 text-sm leading-relaxed">Prefer to pick an area first? The full neighborhood guide — LoDo, RiNo, Cherry Creek, Cap Hill and more — with the trade-offs of each.</p>
            <span className="mt-4 inline-flex items-center text-sm font-semibold text-denver-amber">Read the neighborhood guide &rarr;</span>
          </Link>
          <Link href="/hotels/best-value-denver"
            className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 hover:border-denver-amber transition-colors">
            <h2 className="text-2xl font-bold group-hover:text-denver-amber transition-colors">Best-Value Hotels in Denver</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">The highest-rated hotels for the money across the city — where to get the most without overpaying downtown.</p>
            <span className="mt-4 inline-flex items-center text-sm font-semibold text-denver-amber">See best value &rarr;</span>
          </Link>
        </div>
      </section>

      {/* Planning guides */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold mb-6">Denver Trip Planning Guides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/denver/coors-field-parking"
            className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-denver-amber transition-colors">
            <h3 className="font-bold group-hover:text-denver-amber transition-colors">Coors Field Parking Guide</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Where to park for a Rockies game, what it costs, and how to skip the hassle entirely.</p>
          </Link>
          <Link href="/denver/red-rocks-shuttle"
            className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-denver-amber transition-colors">
            <h3 className="font-bold group-hover:text-denver-amber transition-colors">Red Rocks Shuttle Guide</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">How to get to a show without driving — shuttles from downtown, costs, and why locals skip the car.</p>
          </Link>
          <Link href="/denver/denver-airport-shuttle"
            className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-denver-amber transition-colors">
            <h3 className="font-bold group-hover:text-denver-amber transition-colors">Denver Airport Shuttle Guide</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">DEN to downtown, your hotel, or the mountains — the train, shuttles, and rideshare compared.</p>
          </Link>
          <Link href="/events"
            className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-denver-amber transition-colors">
            <h3 className="font-bold group-hover:text-denver-amber transition-colors">Denver Events Calendar</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Concerts, games and shows — line up your stay with what&apos;s on while you&apos;re in town.</p>
          </Link>
          <Link href="/denver/things-to-do"
            className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-denver-amber transition-colors">
            <h3 className="font-bold group-hover:text-denver-amber transition-colors">Things to Do in Denver</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Attractions, tours and experiences to fill the days around your event.</p>
          </Link>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { NEIGHBORHOODS } from "@/lib/neighborhoods";
import LinkedText from "@/components/LinkedText";
import { buildMentionIndex, findMentions } from "@/lib/hotelMentions";
import { getHotelPool } from "@/lib/places";
import { expediaDenverHotelsUrl } from "@/lib/travelpayouts";
import { getPlaces, isRealHotel, photoUrl, type Place } from "@/lib/places";
import BookYourTrip from "@/components/BookYourTrip";
import HowThisListWasMade from "@/components/HowThisListWasMade";
import SchemaMarkup from "@/components/SchemaMarkup";
import { STAY_AREAS, QUICK_PICKS, STAY_FAQS } from "@/lib/stayGuide";
import { COMPARISONS } from "@/lib/stayComparisons";
import { assignStayVideos, flattenStayVideos } from "@/lib/stayVideos";
import { getAllVideos } from "@/lib/youtube";
import VideoCard from "@/components/VideoCard";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Where to Stay in Denver — A Local's Neighborhood Guide",
  description:
    "Which Denver neighborhood to book, and who each one is wrong for. LoDo, RiNo, Cherry Creek, Cap Hill and more — with walk times, real costs and honest disqualifiers.",
  openGraph: {
    title: "Where to Stay in Denver — Best Neighborhoods for Hotels",
    description:
      "LoDo, RiNo, Highlands, Cherry Creek and more — an honest breakdown of Denver's hotel neighborhoods and who each one suits.",
    url: "https://davelovesdenver.com/denver/where-to-stay",
    images: [
      {
        url: "https://images.unsplash.com/photo-1566036604088-319bcef67086?auto=format&fit=crop&w=1600&q=80",
        width: 1600,
        alt: "Where to stay in Denver Colorado",
      },
    ],
  },
  alternates: {
    canonical: "https://davelovesdenver.com/denver/where-to-stay",
  },
};

const UPDATED = "2026-08-28";
const UPDATED_LABEL = "August 28, 2026";

const HOTEL_NEIGHBORHOODS = STAY_AREAS;

// eslint-disable-next-line @next/next/no-img-element
function HotelCardStacked({ place }: { place: Place }) {
  const href = place.expedia_affiliate_url ?? expediaDenverHotelsUrl();
  const photo = place.photos?.[0];
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="group flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 hover:border-denver-amber hover:shadow-md transition-all duration-200"
    >
      <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800">
        {photo ? (
          <img src={photoUrl(photo)} alt={place.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
        ) : (
          <div className="w-full h-full bg-slate-200 dark:bg-slate-700" />
        )}
      </div>
      <div className="flex flex-col justify-center gap-0.5 min-w-0 flex-1">
        <h3 className="font-semibold text-sm leading-snug group-hover:text-denver-amber transition-colors line-clamp-2">{place.name}</h3>
        {place.rating && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-500">
            ★ {place.rating.toFixed(1)}
            {place.review_count && <span className="text-slate-400 font-normal">({place.review_count.toLocaleString()})</span>}
          </span>
        )}
        <span className="text-xs text-denver-amber font-medium group-hover:underline">Book on Expedia &rarr;</span>
      </div>
    </a>
  );
}

const FAQS = STAY_FAQS;

export default async function WhereToStayPage() {
  // Only areas with a NEIGHBORHOODS entry render, so only those get videos —
  // otherwise VideoObject schema could describe a section that never appears.
  const areaSlugs = HOTEL_NEIGHBORHOODS.filter((a) =>
    NEIGHBORHOODS.some((nb) => nb.slug === a.slug)
  ).map((a) => a.slug);

  // Fetch hotels for all neighborhoods in parallel
  const [allVideos, mentionPool, hotelsByNeighborhood] = await Promise.all([
    getAllVideos(),
    getHotelPool(),
    Promise.all(
    HOTEL_NEIGHBORHOODS.map(async (hn) => {
      const places = await getPlaces(hn.slug, "hotels");
      const real = places.filter(isRealHotel).filter((p) => p.rating != null);
      // Use real hotels; if fewer than 4, fall back to any rated lodging
      const hotels = (real.length >= 4 ? real : places.filter((p) => p.rating != null)).slice(0, 4);
      return { slug: hn.slug, hotels };
    })
    ),
  ]);

  // The pillar named dozens of real hotels in prose and linked none of them.
  const mentions = buildMentionIndex(mentionPool);
  const poolBySlug = new Map(mentionPool.map((h) => [h.slug, h]));

  // Assigned in page order against a shared used-set, so no video repeats.
  const areaVideos = assignStayVideos(allVideos, areaSlugs, 2);
  const pageVideos = flattenStayVideos(areaVideos, areaSlugs);
  const hotelMap = new Map(hotelsByNeighborhood.map((h) => [h.slug, h.hotels]));

  return (
    <>
      <SchemaMarkup
        breadcrumbs={[
          { name: "Home", url: "https://davelovesdenver.com" },
          { name: "Denver", url: "https://davelovesdenver.com/denver" },
          { name: "Where to Stay in Denver", url: "https://davelovesdenver.com/denver/where-to-stay" },
        ]}
        article={{
          title: "Where to Stay in Denver",
          slug: "denver/where-to-stay",
          url: "https://davelovesdenver.com/denver/where-to-stay",
          publishedAt: UPDATED,
          updatedAt: UPDATED,
          description: "Which Denver neighborhood to book, and who each one is wrong for.",
        }}
        faqs={FAQS.map((f) => ({ question: f.q, answer: f.a }))}
        videos={pageVideos.map((v) => ({
          name: v.title,
          description: v.description,
          thumbnailUrl: v.thumbnail_url,
          uploadDate: v.published_at,
          videoId: v.video_id,
        }))}
      />
      {/* Hero */}
      <section className="bg-denver-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <nav className="flex items-center gap-2 text-sm text-white/50 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/denver" className="hover:text-white transition-colors">Denver</Link>
            <span>/</span>
            <span className="text-white/80">Where to Stay</span>
          </nav>
          <p className="text-denver-amber text-sm font-semibold uppercase tracking-widest mb-3">Denver, Colorado</p>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">Where to Stay in Denver</h1>
          <p className="mt-5 text-xl text-white/70 max-w-2xl leading-relaxed">
            Stay in LoDo if it&apos;s your first visit and you want to walk everywhere. Stay in RiNo if you care more about
            where you&apos;ll eat. Cap Hill is the best value close in, Cherry Creek has the nicest rooms, and the airport
            district is only worth it for a 6am flight. Below: what each neighborhood costs, what you can walk to, and
            who should skip it.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/60">
            <span>
              By <Link href="/about" className="text-denver-amber hover:underline font-medium">Dave Chung</Link>
            </span>
            <span aria-hidden="true">&middot;</span>
            <span>Updated <time dateTime={UPDATED}>{UPDATED_LABEL}</time></span>
          </div>
        </div>
      </section>

      {/* Expedia stays + flights search — dated searches convert better than a bare hotel-search handoff */}
      <BookYourTrip
        pubref="where-to-stay"
        heading="Know your dates?"
        blurb="Rates move a lot night to night. Price your exact stay before you commit to a neighborhood below."
      />

      {/* Quick answer table — written to stand alone if an answer engine lifts it. */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <h2 className="text-2xl font-bold mb-2">Which Denver neighborhood should you book?</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6">The short version. Each one is covered in full below.</p>
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900">
              <tr>
                <th className="text-left font-semibold px-4 py-3 text-slate-500 dark:text-slate-400 uppercase tracking-wide text-xs">Neighborhood</th>
                <th className="text-left font-semibold px-4 py-3 text-slate-500 dark:text-slate-400 uppercase tracking-wide text-xs">Book it if</th>
              </tr>
            </thead>
            <tbody>
              {QUICK_PICKS.map((q) => {
                const nb = NEIGHBORHOODS.find((n) => n.slug === q.slug);
                return (
                <tr key={q.slug} className="group/row border-t border-slate-100 dark:border-slate-800 hover:bg-slate-50/70 dark:hover:bg-slate-900/40 transition-colors">
                  <td className="px-4 py-3 align-middle">
                    <a href={`#${q.slug}`} className="flex items-center gap-3 min-w-[12rem] font-medium hover:text-denver-amber transition-colors">
                      <span className="relative w-14 h-14 shrink-0 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800">
                        {nb ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={nb.image}
                            alt=""
                            loading="lazy"
                            className="w-full h-full object-cover group-hover/row:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <span className="block w-full h-full bg-slate-200 dark:bg-slate-700" />
                        )}
                      </span>
                      <span>{q.area}</span>
                    </a>
                  </td>
                  <td className="px-4 py-3 align-middle text-slate-600 dark:text-slate-400">{q.verdict}</td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-6 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          Two logistics pages worth reading before you book:{" "}
          <Link href="/denver/hotel-costs" className="text-denver-amber hover:underline">what a Denver hotel actually costs</Link>{" "}
          once tax and parking are in, and{" "}
          <Link href="/denver/airport-train" className="text-denver-amber hover:underline">the A Line from the airport</Link>,
          which decides whether you need a car at all. If you’re coming from sea level, {" "}
          <Link href="/denver/altitude" className="text-denver-amber hover:underline">what’s actually true about Denver’s altitude</Link>{" "}
          is shorter and more useful than the version you’ve been told.
        </p>
      </section>

      {/* The logistics pages. Sourced, specific, and the reason people link to us. */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <h2 className="text-2xl font-bold mb-2">The questions that actually decide it</h2>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl mb-6">
          Every figure on these pages is sourced, and anything we could not verify from a primary source
          was left out rather than estimated. That is the whole point of them.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { href: "/denver/is-downtown-denver-safe", title: "Is downtown Denver safe?", blurb: "Police district data, what changed at Union Station, and why the hour matters more than the block." },
            { href: "/denver/hotel-parking", title: "What hotel parking costs", blurb: "$45 to $70 a night downtown, published hotel by hotel — and the public garage charging $23." },
            { href: "/denver/hotel-free-parking", title: "Where parking is actually free", blurb: "No downtown hotel. Not the airport strip either, whatever the booking sites say. Here's the verified list." },
            { href: "/denver/hotels-near-light-rail", title: "Hotels near light rail", blurb: "The downtown lines are suspended for reconstruction. Which stations still work, measured on foot." },
            { href: "/denver/new-hotels-in-denver", title: "New hotels in Denver", blurb: "Five have opened in twenty months. What's paused, what closed, and the booking pages for hotels that no longer exist." },
            { href: "/denver/mountain-view-hotels", title: "Hotels with mountain views", blurb: "Only four sell a room named for it. Where the view is real, where the upgrade is a waste, and why." },
            { href: "/denver/bachelorette-party-hotels", title: "Group and bachelorette weekends", blurb: "Most rooms here cap at four adults. What genuinely sleeps six or eight, and which hotels connect rooms." },
            { href: "/denver/resort-fees", title: "Do Denver hotels charge resort fees?", blurb: "Some do, most downtown flags don’t, and the law changed in 2025 and again in 2026." },
            { href: "/denver/hotel-costs", title: "What a Denver hotel really costs", blurb: "Rate, tax and parking together, which is the only number worth comparing." },
            { href: "/denver/airport-train", title: "The A Line from the airport", blurb: "37 minutes for $10 — and the $10 is a day pass, not a one-way." },
            { href: "/denver/den-layover", title: "Leaving DEN on a layover", blurb: "About three and a half hours of overhead. Here’s the layover length that makes it worth it." },
            { href: "/denver/ski-basecamp", title: "Denver as a ski basecamp", blurb: "Verified distances, the ski train, the Snowstang bus, and when I-70 actually jams." },
            { href: "/denver/altitude", title: "The altitude, honestly", blurb: "Denver is 5,280 feet. The CDC's threshold for altitude illness is 8,000." },
            { href: "/denver/red-rocks-what-to-know", title: "Red Rocks: the rules nobody tells you", blurb: "Bag size, no re-entry, the overnight rule, and 193 steps at 6,450 feet." },
            { href: "/denver/coors-field-parking", title: "Coors Field parking", blurb: "Where to leave the car on a game night without paying the lot price." },
          ].map((g) => (
            <Link
              key={g.href}
              href={g.href}
              className="block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-denver-amber transition-colors"
            >
              <h3 className="font-bold mb-1 text-sm">{g.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{g.blurb}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Walkability, measured. The single most-asked question on the Denver
          travel forums is "where do I base myself", and the recurring failure
          of every answer to it is that nobody gives a number. These are routed
          pedestrian distances, not straight lines. */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <h2 className="text-2xl font-bold mb-2">How far apart are these places on foot?</h2>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl mb-6">
          Every guide to Denver tells you a neighborhood is walkable and none of them tells you to what.
          These are routed pedestrian distances between the places people actually mean when they name a
          neighborhood &mdash; not straight lines, and not the whole neighborhood, which in RiNo&apos;s case is
          more than a mile long.
        </p>
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900">
              <tr>
                {["From", "To", "On foot"].map((h) => (
                  <th key={h} className="text-left font-semibold px-4 py-3 text-slate-500 dark:text-slate-400 uppercase tracking-wide text-xs">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Union Station", "Larimer Square, LoDo", "805 m · 11 min"],
                ["Union Station", "Convention Center", "1.6 km · 21 min"],
                ["Union Station", "LoHi, 16th & Boulder", "1.7 km · 22 min"],
                ["Union Station", "RiNo at 25th & Larimer", "1.5 km · 20 min"],
                ["Union Station", "RiNo at 27th & Larimer", "2.1 km · 28 min"],
                ["Larimer Square, LoDo", "Convention Center", "821 m · 11 min"],
                ["Larimer Square, LoDo", "RiNo at 25th & Larimer", "1.4 km · 19 min"],
                ["Larimer Square, LoDo", "RiNo at 30th & Larimer", "2.6 km · 35 min"],
                ["Larimer Square, LoDo", "Golden Triangle, Art Museum", "1.7 km · 22 min"],
                ["Coors Field", "RiNo at 25th & Larimer", "883 m · 12 min"],
                ["Coors Field", "RiNo at 30th & Larimer", "2.0 km · 26 min"],
                ["Convention Center", "Golden Triangle, Art Museum", "945 m · 13 min"],
                ["Convention Center", "Capitol Hill, Colfax & Pearl", "1.5 km · 20 min"],
                ["LoHi, 16th & Boulder", "RiNo at 27th & Larimer", "3.3 km · 43 min"],
                ["Convention Center", "Cherry Creek North", "5.5 km · 73 min"],
                ["Union Station", "Cherry Creek North", "6.5 km · 87 min"],
              ].map((r) => (
                <tr key={r[0] + r[1]} className="border-t border-slate-100 dark:border-slate-800">
                  <td className="px-4 py-3 align-top font-medium">{r[0]}</td>
                  <td className="px-4 py-3 align-top text-slate-600 dark:text-slate-400">{r[1]}</td>
                  <td className="px-4 py-3 align-top text-slate-600 dark:text-slate-400 whitespace-nowrap">{r[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            <strong className="text-slate-900 dark:text-slate-100">Cherry Creek is not walkable from downtown.</strong>{" "}
            An hour and a half on foot from Union Station. People ask this constantly and get told it is
            &ldquo;close&rdquo; &mdash; it is close by car, and it is a different trip on foot. Related trap: a lot of
            hotels marketed as &ldquo;Cherry Creek area&rdquo; actually sit out on Colorado Boulevard, which is a long
            walk from the shops and restaurants people book Cherry Creek for. Check the street address, not the name.
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            <strong className="text-slate-900 dark:text-slate-100">RiNo is long and thin, so where you book inside it matters.</strong>{" "}
            The south end at 25th is a 19-minute walk from LoDo and 12 from Coors Field. The north end at 30th
            is 35 and 26. That is the difference between walking home and calling a car, and no listing page
            will tell you which end you are on.
          </p>
        </div>
      </section>

      {/* Head-to-head pages. Most people arrive already down to two areas. */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <h2 className="text-2xl font-bold mb-2">Already down to two?</h2>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl mb-6">
          Most people arrive at this page having narrowed it to a pair and wanting someone to break the tie.
          Each of these answers in the first paragraph, then shows the rates, the walk times and the reason
          you might want to ignore the answer.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {COMPARISONS.map((c) => (
            <Link
              key={c.slug}
              href={`/denver/where-to-stay/${c.slug}`}
              className="block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-denver-amber transition-colors"
            >
              <h3 className="font-bold mb-1">
                {c.aName} vs {c.bName}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{c.metaDescription}</p>
              <span className="mt-3 inline-flex items-center text-xs font-semibold text-denver-amber">Read the comparison &rarr;</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Quick nav strip */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 py-3">
            {HOTEL_NEIGHBORHOODS.map((hn) => (
              <a
                key={hn.slug}
                href={`#${hn.slug}`}
                className="px-3 py-1.5 text-xs font-medium rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-denver-amber hover:text-white transition-colors whitespace-nowrap"
              >
                {NEIGHBORHOODS.find((nb) => nb.slug === hn.slug)?.name ?? hn.slug}
              </a>
            ))}
            <Link href="/hotels/near-red-rocks" className="px-3 py-1.5 text-xs font-medium rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-denver-amber hover:text-white transition-colors whitespace-nowrap">
              Red Rocks shows
            </Link>
            <Link href="/hotels/near-empower-field" className="px-3 py-1.5 text-xs font-medium rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-denver-amber hover:text-white transition-colors whitespace-nowrap">
              Broncos games
            </Link>
            <Link href="/hotels/near-mission-ballroom" className="px-3 py-1.5 text-xs font-medium rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-denver-amber hover:text-white transition-colors whitespace-nowrap">
              Mission Ballroom
            </Link>
            <Link href="/hotels/near-fiddlers-green" className="px-3 py-1.5 text-xs font-medium rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-denver-amber hover:text-white transition-colors whitespace-nowrap">
              Fiddler&apos;s Green
            </Link>
            <Link href="/hotels/near-convention-center" className="px-3 py-1.5 text-xs font-medium rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-denver-amber hover:text-white transition-colors whitespace-nowrap">
              Convention Center
            </Link>
            <Link href="/hotels/near-city-park" className="px-3 py-1.5 text-xs font-medium rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-denver-amber hover:text-white transition-colors whitespace-nowrap">
              City Park &amp; Zoo
            </Link>
            <Link href="/hotels/near-botanic-gardens" className="px-3 py-1.5 text-xs font-medium rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-denver-amber hover:text-white transition-colors whitespace-nowrap">
              Botanic Gardens
            </Link>
            <Link href="/hotels/near-cherry-creek" className="px-3 py-1.5 text-xs font-medium rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-denver-amber hover:text-white transition-colors whitespace-nowrap">
              Cherry Creek
            </Link>
          </div>
        </div>
      </div>

      {/* Neighborhood sections */}
      {HOTEL_NEIGHBORHOODS.map((hn) => {
        const n = NEIGHBORHOODS.find((nb) => nb.slug === hn.slug);
        if (!n) return null;
        // One link per hotel per neighborhood section.
        const seen = new Set<string>();
        // The right third of these sections was empty on every desktop screen.
        // Fill it with the hotels this section's own prose names — computed up
        // front rather than read off `seen`, which is populated during render.
        const areaCopy = [hn.take, hn.walk, hn.eat, hn.cost, hn.hotels, hn.transit, hn.changing ?? "", hn.skip].join("\n");
        const named = findMentions(areaCopy, mentions, new Set<string>())
          .map((m) => poolBySlug.get(m.slug))
          .filter((h): h is NonNullable<typeof h> => Boolean(h));
        const asideHotels = (named.length > 0 ? named : hotelMap.get(hn.slug) ?? []).slice(0, 3);

        return (
          <section
            key={hn.slug}
            id={hn.slug}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-b border-slate-100 dark:border-slate-800"
          >
            {/* Content */}
            <div className="lg:grid lg:grid-cols-3 lg:gap-10">
            <div className="max-w-3xl lg:col-span-2">
              {/* Neighborhood image badge */}
              <div className="relative inline-flex items-center gap-2 mb-5">
                <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={n.image}
                    alt={n.name}
                    className="w-full h-full object-cover"
                  />

                  <div className={`absolute inset-0 bg-gradient-to-br ${n.gradient} opacity-40`} />
                </div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{n.tagline}</span>
              </div>

              <h2 className="text-3xl font-bold mb-2">{n.name}</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-6">{n.description}</p>

              <blockquote className="border-l-4 border-denver-amber pl-5 py-1 mb-8 text-slate-600 dark:text-slate-400 text-lg leading-relaxed italic">
                &ldquo;{hn.take}&rdquo;
                <footer className="mt-2 text-sm not-italic text-slate-400 dark:text-slate-500">— Dave</footer>
              </blockquote>

              <div className="mb-8 flex flex-wrap gap-2 text-sm">
                <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-medium">
                  Best for: {hn.bestFor}
                </span>
                <span className="px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 font-medium">
                  Not for: {hn.notFor}
                </span>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold mb-1.5">What you can walk to from {n.name}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed"><LinkedText text={hn.walk} index={mentions} seen={seen} chipLimit={2} /></p>
                </div>
                <div>
                  <h3 className="text-base font-bold mb-1.5">Where you&apos;ll eat</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed"><LinkedText text={hn.eat} index={mentions} seen={seen} chipLimit={2} /></p>
                </div>
                <div>
                  <h3 className="text-base font-bold mb-1.5">What it costs</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed"><LinkedText text={hn.cost} index={mentions} seen={seen} chipLimit={2} /></p>
                </div>
                <div>
                  <h3 className="text-base font-bold mb-1.5">Where to book in {n.name}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed"><LinkedText text={hn.hotels} index={mentions} seen={seen} chipLimit={2} /></p>
                </div>
                <div>
                  <h3 className="text-base font-bold mb-1.5">Getting around</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed"><LinkedText text={hn.transit} index={mentions} seen={seen} chipLimit={2} /></p>
                </div>
                {hn.changing && (
                  <div>
                    <h3 className="text-base font-bold mb-1.5">What&apos;s changing here</h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed"><LinkedText text={hn.changing ?? ""} index={mentions} seen={seen} chipLimit={2} /></p>
                  </div>
                )}
                <div className="rounded-xl bg-slate-50 dark:bg-slate-900 p-5">
                  <h3 className="text-base font-bold mb-1.5">Who should skip {n.name}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed"><LinkedText text={hn.skip} index={mentions} seen={seen} chipLimit={2} /></p>
                </div>
              </div>

              <div className="mt-8">

              <a
                href={expediaDenverHotelsUrl(n.name)}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-denver-amber hover:bg-amber-500 text-white text-sm font-semibold rounded-full transition-colors"
              >
                Browse hotels in {n.name} &rarr;
              </a>
              </div>
              {hn.venueLinks && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {hn.venueLinks.map((v) => (
                    <Link key={v.href} href={v.href}
                      className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-300 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber text-sm font-medium rounded-full transition-colors"
                    >
                      {v.label} &rarr;
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {asideHotels.length > 0 && (
              <aside className="hidden lg:block lg:col-span-1">
                <div className="sticky top-24">
                  <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">
                    {named.length > 0 ? `Named above in ${n.name}` : `Top-rated in ${n.name}`}
                  </h3>
                  <div className="space-y-4">
                    {asideHotels.map((h) => (
                      <HotelCardStacked key={h.place_id} place={h} />
                    ))}
                  </div>
                  <a
                    href={expediaDenverHotelsUrl(n.name)}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="mt-4 inline-flex items-center text-sm font-semibold text-denver-amber hover:underline"
                  >
                    All {n.name} hotels &rarr;
                  </a>
                </div>
              </aside>
            )}
            </div>

            {/* Hotels + map side by side */}
            {(() => {
              const hotels = hotelMap.get(hn.slug) ?? [];
              if (hotels.length === 0 && !n.stay22EmbedId) return null;
              return (
                <div className="mt-8 flex flex-col lg:flex-row gap-4">
                  {/* Left: stacked hotel cards */}
                  {hotels.length > 0 && (
                    <div className="flex flex-col gap-2 lg:w-2/5">
                      <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Top-Rated Hotels in {n.name}</h3>
                      {hotels.map((hotel) => <HotelCardStacked key={hotel.place_id} place={hotel} />)}
                    </div>
                  )}
                  {/* Right: map — absolute fill to match card column height */}
                  {n.stay22EmbedId && (
                    <div className="hidden lg:block flex-1 relative">
                      <iframe
                        src={`https://www.stay22.com/embed/${n.stay22EmbedId}`}
                        frameBorder="0"
                        className="absolute inset-0 w-full h-full rounded-2xl"
                        title={`Hotels in ${n.name}, Denver`}
                        loading="lazy"
                      />
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Related videos from the channel. There are no hotel-guide videos
                yet, so these are framed as related Denver watching rather than
                as coverage of this neighborhood. */}
            {(areaVideos[hn.slug]?.videos.length ?? 0) > 0 && (
              <div className="mt-10 max-w-3xl">
                <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">
                  Related Denver videos
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                  From Dave&apos;s channel &mdash; worth a watch while you&apos;re planning.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {areaVideos[hn.slug].videos.map((v) => (
                    <VideoCard key={v.video_id} video={v} />
                  ))}
                </div>
              </div>
            )}
          </section>
        );
      })}

      {/* FAQ */}
      <section className="bg-slate-50 dark:bg-slate-900/50 py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-10">Frequently Asked Questions</h2>
          <div className="space-y-8">
            {FAQS.map((faq) => (
              <div key={faq.q}>
                <h3 className="text-lg font-semibold mb-2">{faq.q}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Venue hotel guides */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-2xl font-bold mb-2">Hotels Near Denver Venues &amp; Attractions</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">Here for a specific event or attraction? These guides cover the best options for each.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {[
            { href: "/hotels/near-red-rocks", label: "Red Rocks Amphitheatre" },
            { href: "/hotels/near-empower-field", label: "Empower Field at Mile High" },
            { href: "/hotels/near-coors-field", label: "Coors Field" },
            { href: "/hotels/near-ball-arena", label: "Ball Arena" },
            { href: "/hotels/near-mission-ballroom", label: "Mission Ballroom" },
            { href: "/hotels/near-fiddlers-green", label: "Fiddler's Green" },
            { href: "/hotels/near-convention-center", label: "Convention Center" },
            { href: "/hotels/near-denver-airport", label: "Denver Airport (DEN)" },
            { href: "/hotels/near-city-park", label: "City Park & Denver Zoo" },
            { href: "/hotels/near-botanic-gardens", label: "Botanic Gardens" },
            { href: "/hotels/near-cherry-creek", label: "Cherry Creek North" },
            { href: "/hotels/best-value-denver", label: "Best Value Hotels (4.3+ rating)" },
          ].map((v) => (
            <Link key={v.href} href={v.href}
              className="flex items-center justify-between gap-2 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-denver-amber hover:text-denver-amber text-sm font-medium transition-all"
            >
              <span>{v.label}</span>
              <span className="text-denver-amber flex-shrink-0">&rarr;</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-wrap gap-4">
          <Link
            href="/denver"
            className="inline-flex items-center gap-2 px-6 py-3 bg-denver-navy hover:bg-denver-navy/90 text-white text-sm font-semibold rounded-full transition-colors"
          >
            Browse all of Denver &rarr;
          </Link>
          <Link
            href="/denver/experiences"
            className="inline-flex items-center gap-2 px-6 py-3 border border-slate-300 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber text-sm font-semibold rounded-full transition-colors"
          >
            See tours &amp; experiences &rarr;
          </Link>
        </div>
      </section>

      {/* Methodology sits after the argument, not in front of it. A reader who
          has not been told anything yet has no reason to care how we know it. */}
      <HowThisListWasMade updated={UPDATED} what="guide" />
    </>
  );
}

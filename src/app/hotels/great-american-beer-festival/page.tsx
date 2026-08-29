import type { Metadata } from "next";
import Link from "next/link";
import { getPlaces, isRealHotel } from "@/lib/places";
import VenueHotelCard from "@/components/VenueHotelCard";
import BookYourTrip from "@/components/BookYourTrip";
import SchemaMarkup from "@/components/SchemaMarkup";
import { expediaDenverHotelsUrl } from "@/lib/travelpayouts";

export const revalidate = 21600;

const UPDATED = "2026-08-29";
const UPDATED_LABEL = "August 29, 2026";

export const metadata: Metadata = {
  title: "Where to Stay for GABF 2026 — It Moved to Ruby Hill",
  description:
    "The Great American Beer Festival left the Convention Center. It's at Levitt Pavilion in Ruby Hill Park, Oct 10–11, and almost every lodging guide online is still wrong. Where to actually book.",
  alternates: { canonical: "https://davelovesdenver.com/hotels/great-american-beer-festival" },
  openGraph: {
    title: "Where to Stay for GABF 2026 — It Moved to Ruby Hill",
    description:
      "GABF is outdoors at Levitt Pavilion this year, five miles from the Convention Center hotels every guide still recommends.",
    url: "https://davelovesdenver.com/hotels/great-american-beer-festival",
    type: "article",
    publishedTime: UPDATED,
    modifiedTime: UPDATED,
  },
};

const FAQS = [
  {
    q: "Where is the Great American Beer Festival in 2026?",
    a: "Levitt Pavilion Denver, at 1380 W Florida Ave in Ruby Hill Park — southwest Denver, roughly five miles from downtown. It is not at the Colorado Convention Center. 2026 is the first year GABF has been held outdoors in more than four decades of running.",
  },
  {
    q: "What are the GABF 2026 dates and session times?",
    a: "Saturday October 10 and Sunday October 11, 2026, from 12:00pm to 4:00pm both days. There is one four-hour session per day. That is a real change from the Convention Center years, which ran three days with as many as four sessions, including evenings.",
  },
  {
    q: "Is GABF 2026 sold out?",
    a: "Partly. Saturday festival tickets and the two-day pass are sold out. Sunday is still available, as are both PAIRED tiers. The awards ceremony takes place during the Sunday session and is open to festival ticket holders, which is a decent argument for Sunday anyway.",
  },
  {
    q: "Where should I stay for GABF 2026?",
    a: "There is no hotel cluster at Ruby Hill — the nearest hotel of any kind is about a mile away and the nearest real cluster is roughly three miles off in Baker, five downtown. Baker and South Broadway are the closest sensible base. Downtown makes sense if you want the rest of GABF week, and the official festival shuttle leaves from the Sheraton downtown.",
  },
  {
    q: "Is there parking at Levitt Pavilion for GABF?",
    a: "There are about 580 spaces across three lots inside Ruby Hill Park, against roughly 7,500 attendees per session. Assume you will not get one. Parking on the grass is enforced by Denver Park Rangers, and Levitt asks people not to park in the residential streets west of the park.",
  },
  {
    q: "Can you take light rail to GABF at Ruby Hill?",
    a: "Yes, but with a walk. Take the C Line to Evans Station, which is about 1.4 miles from the park — roughly a 26-minute walk. Note the D Line was suspended in June 2026, so older guides naming it are out of date. Because sessions end at 4pm, that walk is in daylight.",
  },
  {
    q: "Is there a shuttle to GABF 2026?",
    a: "Yes. The official festival shuttle runs from the Sheraton Denver Downtown starting at 11:00am, every 15 to 30 minutes. It is a paid add-on to your ticket and must be reserved by October 1.",
  },
  {
    q: "Can you bike to GABF at Ruby Hill Park?",
    a: "This is the best-kept secret of the new venue. The South Platte River Trail runs right past Ruby Hill Park and connects continuously to downtown, and Levitt has bike corrals directly in front of the venue entrance. It is an off-street paved ride each way, arriving for a noon start and leaving at 4pm in daylight.",
  },
];

export default async function GabfPage() {
  const [bakerHotels, lodoHotels] = await Promise.all([
    getPlaces("baker", "hotels"),
    getPlaces("lodo", "hotels"),
  ]);
  const baker = bakerHotels.filter(isRealHotel).filter((p) => p.rating != null).slice(0, 4);
  const lodo = lodoHotels.filter(isRealHotel).filter((p) => p.rating != null).slice(0, 4);

  return (
    <main>
      <SchemaMarkup
        breadcrumbs={[
          { name: "Home", url: "https://davelovesdenver.com" },
          { name: "Denver Hotel Guides", url: "https://davelovesdenver.com/hotels" },
          { name: "Where to Stay for GABF 2026", url: "https://davelovesdenver.com/hotels/great-american-beer-festival" },
        ]}
        article={{
          title: "Where to Stay for GABF 2026",
          slug: "hotels/great-american-beer-festival",
          url: "https://davelovesdenver.com/hotels/great-american-beer-festival",
          publishedAt: UPDATED,
          updatedAt: UPDATED,
          description: "GABF 2026 moved to Levitt Pavilion in Ruby Hill Park. Where to actually stay.",
        }}
        faqs={FAQS.map((f) => ({ question: f.q, answer: f.a }))}
      />

      {/* Hero */}
      <section className="bg-denver-navy text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <nav aria-label="Breadcrumb" className="text-sm text-white/50 mb-5">
            <ol className="flex flex-wrap items-center gap-2">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/hotels" className="hover:text-white transition-colors">Hotel Guides</Link></li>
              <li aria-hidden="true">/</li>
              <li className="text-white/80">GABF 2026</li>
            </ol>
          </nav>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight">Where to Stay for GABF 2026</h1>

          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/60">
            <span>By <Link href="/about" className="text-denver-amber hover:underline font-medium">Dave Chung</Link></span>
            <span aria-hidden="true">&middot;</span>
            <span>Updated <time dateTime={UPDATED}>{UPDATED_LABEL}</time></span>
          </div>

          <p className="mt-6 text-lg text-white/80 leading-relaxed">
            The Great American Beer Festival is not at the Colorado Convention Center this year. It moved outdoors to
            Levitt Pavilion in Ruby Hill Park, about five miles southwest, on Saturday 10 and Sunday 11 October, noon
            to 4pm each day. Almost every lodging guide online &mdash; including the festival&apos;s own hotel page
            &mdash; still recommends downtown hotels chosen for the old venue. Here&apos;s what actually makes sense.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">

        {/* The correction */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold mb-4">What changed, and why the advice online is wrong</h2>
          <p className="text-lg leading-relaxed border-l-4 border-denver-amber pl-5 py-1 text-slate-700 dark:text-slate-300">
            GABF 2026 is at Levitt Pavilion Denver, 1380 W Florida Ave, inside Ruby Hill Park. That is roughly five
            miles from the Colorado Convention Center, in a residential part of southwest Denver with no hotels at the
            gate. Guides written for the Convention Center years are not slightly out of date &mdash; they are pointing
            at the wrong side of the city.
          </p>
          <p className="mt-5 leading-relaxed text-slate-600 dark:text-slate-400">
            The festival&apos;s own hotel page lists five properties. Four are downtown Convention Center hotels held
            over from the previous format. Only one &mdash; a Lakewood package built around a free festival shuttle
            &mdash; was chosen with the new venue in mind. The Sheraton is defensible too, but only because it is where
            the official shuttle departs.
          </p>
          <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-400">
            The scale changed as well. GABF is selling about 15,000 tickets across the two days this year, roughly 7,500 per
            session, with 207 breweries pouring. In 2019 the Convention Center event drew about 60,000 attendees
            across four sessions with more than 800 breweries. This is a much smaller, quieter festival than the one
            most people remember, and it puts far less pressure on downtown hotels than it used to.
          </p>
        </section>

        {/* The format */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold mb-4">The format change nobody is writing about</h2>
          <p className="text-lg leading-relaxed border-l-4 border-denver-amber pl-5 py-1 text-slate-700 dark:text-slate-300">
            One four-hour session per day, noon to 4pm, both days. No evening sessions. That single fact removes most
            of the logistics anxiety people carry over from the old format &mdash; you are not leaving a beer festival
            at 10pm in an unfamiliar part of town, you are leaving at four in the afternoon in daylight.
          </p>
          <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900">
                <tr>
                  <th className="text-left font-semibold px-4 py-3 text-slate-500 dark:text-slate-400 uppercase tracking-wide text-xs">Detail</th>
                  <th className="text-left font-semibold px-4 py-3 text-slate-500 dark:text-slate-400 uppercase tracking-wide text-xs">2026</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-slate-100 dark:border-slate-800"><td className="px-4 py-3 font-medium">Dates</td><td className="px-4 py-3 text-slate-600 dark:text-slate-400">Sat 10 &amp; Sun 11 October</td></tr>
                <tr className="border-t border-slate-100 dark:border-slate-800"><td className="px-4 py-3 font-medium">Session times</td><td className="px-4 py-3 text-slate-600 dark:text-slate-400">12:00pm&ndash;4:00pm, one session per day</td></tr>
                <tr className="border-t border-slate-100 dark:border-slate-800"><td className="px-4 py-3 font-medium">Venue</td><td className="px-4 py-3 text-slate-600 dark:text-slate-400">Levitt Pavilion, 1380 W Florida Ave, Ruby Hill Park</td></tr>
                <tr className="border-t border-slate-100 dark:border-slate-800"><td className="px-4 py-3 font-medium">Availability</td><td className="px-4 py-3 text-slate-600 dark:text-slate-400">Saturday and the 2-day pass are sold out. Sunday still available.</td></tr>
                <tr className="border-t border-slate-100 dark:border-slate-800"><td className="px-4 py-3 font-medium">Re-entry</td><td className="px-4 py-3 text-slate-600 dark:text-slate-400">None. Once you leave, you&apos;re done.</td></tr>
                <tr className="border-t border-slate-100 dark:border-slate-800"><td className="px-4 py-3 font-medium">Weather</td><td className="px-4 py-3 text-slate-600 dark:text-slate-400">Rain or shine, no weather refunds. It is October in Denver &mdash; bring layers.</td></tr>
                <tr className="border-t border-slate-100 dark:border-slate-800"><td className="px-4 py-3 font-medium">Bags</td><td className="px-4 py-3 text-slate-600 dark:text-slate-400">No backpacks, no coat check, no lockers. One empty clear plastic bottle up to 32oz is fine.</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-5 leading-relaxed text-slate-600 dark:text-slate-400">
            The awards ceremony runs during the Sunday session and is open to ticket holders. Given Saturday is gone
            anyway, Sunday is the better ticket on both counts.
          </p>
        </section>

        {/* Getting there */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold mb-4">How to actually get to Ruby Hill</h2>
          <p className="text-lg leading-relaxed border-l-4 border-denver-amber pl-5 py-1 text-slate-700 dark:text-slate-300">
            There are about 580 parking spaces in Ruby Hill Park against roughly 7,500 people per session. Plan on not
            driving. In rough order of how well they work: bike, the official shuttle, rideshare, light rail with a
            walk, and then driving as a last resort.
          </p>

          <h3 className="text-base font-bold mt-8 mb-1.5">Bike &mdash; genuinely the best option, and nobody says so</h3>
          <p className="leading-relaxed text-slate-600 dark:text-slate-400">
            The South Platte River Trail runs past Ruby Hill Park and connects continuously to downtown, off-street and
            paved the whole way. Levitt has bike corrals directly in front of the venue entrance. You ride in for a noon
            start and ride out at 4pm in daylight. Denver Parks posts trail detours, so check before you set off. For a festival with no re-entry, no coat check and no parking, arriving
            on a bike solves four problems at once.
          </p>

          <h3 className="text-base font-bold mt-8 mb-1.5">The official shuttle</h3>
          <p className="leading-relaxed text-slate-600 dark:text-slate-400">
            Runs from the Sheraton Denver Downtown from 11:00am, every 15 to 30 minutes. It is a paid add-on to your
            festival ticket, roughly $21 for one day, and it has to be reserved by <strong>October 1</strong>. If you
            are staying downtown and don&apos;t want to think about any of this, buy it now rather than later.
          </p>

          <h3 className="text-base font-bold mt-8 mb-1.5">Light rail</h3>
          <p className="leading-relaxed text-slate-600 dark:text-slate-400">
            Take the <strong>C Line to Evans Station</strong>, then walk about 1.4 miles &mdash; roughly 26 minutes.
            One correction worth making: the D Line was suspended in June 2026 for downtown rail reconstruction and is set to be permanently
            discontinued in RTD&apos;s 27 September service change, so any guide telling you to take the D or H Line to
            Evans was written before that. RTD has another service change
            landing in September, just before the festival, so check the trip planner for your actual date.
          </p>
          <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-400">
            Route 22, which runs West Evans Avenue, gets you closer &mdash; the stop at W Evans Ave and S Pecos St is about
            an 11-minute walk from the park. RTD split the old Route 21 in June 2026; the eastern half kept the 21
            number, so a guide sending you to Route 21 for the west side is out of date.
          </p>

          <h3 className="text-base font-bold mt-8 mb-1.5">Driving and parking</h3>
          <p className="leading-relaxed text-slate-600 dark:text-slate-400">
            Park traffic enters via Jewell Ave and exits via Florida Ave on a one-way park road. With one exit and
            thousands of people leaving inside the same hour, expect the exit to be slow. There is a paid lot at
            1498 S Lipan St &mdash; note the S, because the festival&apos;s own directions page drops it, and plain
            &ldquo;1498 Lipan St&rdquo; resolves to a different part of the city, several miles north.
          </p>
          <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-400">
            Don&apos;t park on the grass. That sounds like ordinary park etiquette and it isn&apos;t: Ruby Hill was
            part of the Denver Radium Superfund site, and the former landfill beneath it is capped. Disturbing the
            ground triggers mandatory reporting to city and state health departments, and the disturbed area has to be
            tested for asbestos and other contaminants &mdash; which is why rangers actually enforce it.
            Levitt also asks people to stay out of the residential streets to the west, and after years of concert
            spillover the neighborhood is not in a forgiving mood about it.
          </p>
        </section>

        <BookYourTrip
          pubref="gabf-2026"
          heading="Know your GABF dates?"
          blurb="Sunday 11 October is the session still on sale. Price your nights before downtown fills up for the weekend."
        />

        {/* Where to stay */}
        <section className="mt-14 mb-14">
          <h2 className="text-2xl font-bold mb-4">Where to stay</h2>
          <p className="text-lg leading-relaxed border-l-4 border-denver-amber pl-5 py-1 text-slate-700 dark:text-slate-300">
            There is no hotel cluster at Ruby Hill. The closest lodging of any kind is a budget motel about a mile away
            on South Broadway; the nearest real cluster is about three miles off in Baker, and five downtown. So the question
            isn&apos;t which hotel is closest &mdash; it&apos;s which base makes the whole weekend work.
          </p>

          <h3 className="text-base font-bold mt-8 mb-1.5">Baker and South Broadway &mdash; closest that makes sense</h3>
          <p className="leading-relaxed text-slate-600 dark:text-slate-400">
            The nearest real lodging to the venue, on the Broadway corridor, with bars and restaurants you can walk to
            afterwards and the I-25 &amp; Broadway station for getting around. If your priority is a short trip to and
            from the festival without giving up somewhere to go at night, this is the pick.
          </p>
          {baker.length > 0 && (
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {baker.map((h) => <VenueHotelCard key={h.place_id} place={h} />)}
            </div>
          )}

          <h3 className="text-base font-bold mt-10 mb-1.5">Downtown and LoDo &mdash; worst for the venue, best for the week</h3>
          <p className="leading-relaxed text-slate-600 dark:text-slate-400">
            Furthest from Ruby Hill, and still the right answer for a lot of people. The official shuttle leaves from
            the Sheraton, the city-wide tap takeovers and brewery events cluster downtown and in RiNo rather than
            anywhere near the park, and a noon session start means the commute happens at a civilized hour. If you are
            coming for GABF <em>week</em> rather than one four-hour session, stay central.
          </p>
          {lodo.length > 0 && (
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {lodo.map((h) => <VenueHotelCard key={h.place_id} place={h} />)}
            </div>
          )}

          <h3 className="text-base font-bold mt-10 mb-1.5">RiNo &mdash; if the breweries are the point</h3>
          <p className="leading-relaxed text-slate-600 dark:text-slate-400">
            The densest brewery district in the city and the furthest from the venue. Given the festival is a single
            daytime session, that trade is easier to make this year than it would have been under the old format.
            The full breakdown is in the{" "}
            <Link href="/denver/where-to-stay" className="text-denver-amber hover:underline">neighborhood guide</Link>.
          </p>

          <h3 className="text-base font-bold mt-10 mb-1.5">Lakewood &mdash; only for the shuttle</h3>
          <p className="leading-relaxed text-slate-600 dark:text-slate-400">
            The festival&apos;s official Lakewood package bundles a free shuttle to Levitt Pavilion with a room. It is
            the only entry on the official hotel list chosen for the new venue. It is also isolated from everything else
            happening that week, and the listing had some inconsistencies when I checked, so call the hotel directly
            before booking it.
          </p>

          <h3 className="text-base font-bold mt-10 mb-1.5">One trap to avoid</h3>
          <p className="leading-relaxed text-slate-600 dark:text-slate-400">
            &ldquo;Stay along the light rail in Englewood&rdquo; sounds sensible and often isn&apos;t. Many hotels
            listing an Englewood address are actually in the Denver Tech Center, ten miles out and on the E and R lines
            &mdash; not the C Line that serves Evans Station. Check the actual line before you book on that logic.
          </p>

          <div className="mt-8">
            <a
              href={expediaDenverHotelsUrl("Baker Denver")}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-denver-amber hover:bg-amber-500 text-white text-sm font-semibold rounded-full transition-colors"
            >
              Compare Denver hotels for GABF weekend &rarr;
            </a>
          </div>
        </section>

        {/* Deadlines */}
        <section className="mb-14 rounded-2xl bg-slate-50 dark:bg-slate-900 p-7">
          <h2 className="text-lg font-bold mb-3">Dates that matter before October</h2>
          <ul className="space-y-2.5 text-slate-600 dark:text-slate-400">
            <li className="flex gap-3"><span aria-hidden="true" className="text-denver-amber mt-1 shrink-0">&bull;</span><span><strong>17 September</strong> &mdash; booking deadline on most of the official hotel blocks, including the Lakewood shuttle package.</span></li>
            <li className="flex gap-3"><span aria-hidden="true" className="text-denver-amber mt-1 shrink-0">&bull;</span><span><strong>22 September</strong> &mdash; deadline on the Sheraton block, which is also where the shuttle departs.</span></li>
            <li className="flex gap-3"><span aria-hidden="true" className="text-denver-amber mt-1 shrink-0">&bull;</span><span><strong>1 October</strong> &mdash; last day to reserve the festival shuttle add-on.</span></li>
            <li className="flex gap-3"><span aria-hidden="true" className="text-denver-amber mt-1 shrink-0">&bull;</span><span><strong>10&ndash;11 October</strong> &mdash; the festival, noon to 4pm both days.</span></li>
          </ul>
        </section>

        {/* FAQ */}
        <section className="border-t border-slate-200 dark:border-slate-800 pt-12">
          <h2 className="text-2xl font-bold mb-8">Common questions</h2>
          <div className="space-y-7">
            {FAQS.map((f) => (
              <div key={f.q}>
                <h3 className="text-lg font-semibold mb-2">{f.q}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related */}
        <section className="mt-14 rounded-2xl bg-slate-50 dark:bg-slate-900 p-7">
          <h2 className="text-lg font-bold mb-2">Before you book</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-5">
            Three things worth knowing about booking a Denver hotel in general, whichever neighborhood you land on.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/denver/where-to-stay" className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber text-sm font-medium rounded-full transition-colors">Where to stay in Denver &rarr;</Link>
            <Link href="/denver/hotel-costs" className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber text-sm font-medium rounded-full transition-colors">What a Denver hotel actually costs &rarr;</Link>
            <Link href="/denver/airport-train" className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber text-sm font-medium rounded-full transition-colors">Getting in from the airport &rarr;</Link>
          </div>
        </section>
      </div>
    </main>
  );
}

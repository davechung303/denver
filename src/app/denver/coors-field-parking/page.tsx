import type { Metadata } from "next";
import Link from "next/link";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Coors Field Parking Guide — Where to Park for a Rockies Game (From a Local) | Dave Loves Denver",
  description:
    "Everything you need to know about parking at Coors Field for a Rockies game: official lots vs. nearby garages, what game-day parking actually costs, how to reserve ahead, free and cheap options, and the light-rail move that skips it all.",
  alternates: { canonical: "https://davelovesdenver.com/denver/coors-field-parking" },
  openGraph: {
    title: "Coors Field Parking Guide — Where to Park for a Rockies Game",
    description: "Official lots, nearby garages, game-day rates, and the smarter ways to get to Coors Field — from a local.",
    url: "https://davelovesdenver.com/denver/coors-field-parking",
  },
};

const FAQS = [
  {
    q: "How much does parking cost at Coors Field?",
    a: "It varies a lot by game and location. The closest official and private lots typically run higher on game days — expect roughly $15–$40+ depending on the opponent, the day of week, and how close you are to the gates. Marquee opponents and weekend night games push prices to the top of that range; weekday afternoon games against smaller-draw teams are cheaper. Reserving ahead almost always beats the drive-up rate.",
  },
  {
    q: "Where is the closest parking to Coors Field?",
    a: "The official ballpark lots sit just north and east of the stadium, and there are private surface lots and garages within a few blocks throughout LoDo along Blake, Wazee, Park Avenue West, and the numbered streets. The closest lots fill first and cost the most; a spot four or five blocks out is often far cheaper and only adds a short walk.",
  },
  {
    q: "Can you reserve Coors Field parking in advance?",
    a: "Yes — SpotHero and similar apps let you pre-book a specific lot or garage and lock in a rate before you arrive. For popular games it's the difference between a guaranteed spot at a known price and circling LoDo hoping for a drive-up space. Book as soon as you know you're going.",
  },
  {
    q: "Is there free parking near Coors Field?",
    a: "There's some free and metered street parking in the neighborhoods around LoDo and RiNo, but on game days it's limited, time-restricted, and gone early — and you'll want to read every sign carefully to avoid a ticket or tow. It can work for a weekday afternoon game if you arrive well ahead of first pitch, but don't count on it for a weekend night.",
  },
  {
    q: "What's the best way to get to Coors Field without parking?",
    a: "Take RTD rail to Union Station and walk about 10 minutes to the ballpark — no parking fee, no post-game traffic. Even better, stay at a walkable LoDo hotel and skip driving entirely: walk to the game, walk to Blake Street for pregame, and walk back when you're ready.",
  },
  {
    q: "How early should I arrive to park for a Rockies game?",
    a: "For a weekend or marquee game, aim to be parked 60–90 minutes before first pitch — the closest lots fill fast and Blake Street pregame is half the fun. For a quiet weekday afternoon game you have more slack, but arriving early still means cheaper street options and a calmer walk in.",
  },
  {
    q: "Is tailgating allowed at Coors Field?",
    a: "Some lots permit limited tailgating and others don't, and the rules can change season to season — always check the Colorado Rockies' official parking page for the current policy on the specific lot before you plan a tailgate.",
  },
];

export default function CoorsFieldParkingGuide() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
        { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://davelovesdenver.com" },
          { "@type": "ListItem", position: 2, name: "Coors Field Parking Guide", item: "https://davelovesdenver.com/denver/coors-field-parking" },
        ]},
        { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQS.map((f) => ({
          "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a },
        }))},
        { "@context": "https://schema.org", "@type": "Article",
          headline: "Coors Field Parking Guide — Where to Park for a Rockies Game",
          description: "A local's guide to parking at Coors Field: official lots, nearby garages, game-day rates, reserving ahead, free options, and the light-rail alternative.",
          author: { "@type": "Person", name: "Dave" },
          publisher: { "@type": "Organization", name: "Dave Loves Denver" },
          mainEntityOfPage: "https://davelovesdenver.com/denver/coors-field-parking",
          speakableSpecification: { "@type": "SpeakableSpecification", cssSelector: ["[data-speakable]"] },
        },
      ])}} />

      <section className="bg-denver-navy text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <nav className="flex items-center gap-2 text-sm text-white/50 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/hotels/near-coors-field" className="hover:text-white transition-colors">Coors Field</Link>
            <span>/</span>
            <span className="text-white/80">Parking Guide</span>
          </nav>
          <p className="text-denver-amber text-sm font-semibold uppercase tracking-widest mb-3">LoDo, Denver</p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight" data-speakable>Coors Field Parking Guide</h1>
          <p className="mt-4 text-lg text-white/70 max-w-2xl" data-speakable>
            Where to park for a Rockies game, what it actually costs, and the two moves locals use to skip the whole headache.
          </p>
        </div>
      </section>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* TL;DR */}
        <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-3">The short version</h2>
          <ul className="space-y-2 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
            <li>• <strong>Driving in?</strong> Reserve a lot ahead on SpotHero — it beats the drive-up rate and guarantees a spot.</li>
            <li>• <strong>Closest lots</strong> (official ballpark + private garages) fill first and cost most; a few blocks out is cheaper.</li>
            <li>• <strong>Game-day rates</strong> typically run ~$15–$40+ depending on opponent, day, and proximity.</li>
            <li>• <strong>The smart move:</strong> take RTD rail to Union Station and walk ~10 minutes, or stay in a walkable LoDo hotel and don&apos;t drive at all.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-3" data-speakable>Your parking options, ranked</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            Coors Field sits right in LoDo (Lower Downtown), which is great news for getting there and mixed news for parking: you&apos;re surrounded by options, but they&apos;re all competing with a dense, busy neighborhood. Here&apos;s how they stack up.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="font-bold text-lg mb-1">1. Official ballpark lots</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              The Rockies operate lots just north and east of the stadium. They&apos;re the most convenient for getting in and out of the gates, and they&apos;re priced accordingly. They also sell out for popular games, so if this is your plan, reserve where possible and arrive early. Check the Colorado Rockies&apos; official parking page for current lot locations, rates, and any tailgating rules.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-1">2. Private lots &amp; garages in LoDo</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Dozens of private surface lots and parking garages ring the ballpark along Blake, Wazee, Market, Park Avenue West, and the numbered streets. Prices drop noticeably as you move a few blocks out — a garage five or six blocks away can be half the price of a lot across from the gates, for a walk you&apos;d barely notice. This is the sweet spot for most people.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-1">3. Reserve ahead (SpotHero)</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Apps like SpotHero let you pre-book a specific lot or garage and lock in a rate before you leave home. For a marquee opponent or a weekend night game, this turns &ldquo;circling LoDo for 20 minutes&rdquo; into &ldquo;drive straight to a guaranteed spot.&rdquo; It&apos;s the single best tip for anyone set on driving.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-1">4. Street parking</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              There&apos;s metered and some free street parking in the surrounding blocks and into RiNo, but on game days it&apos;s limited, time-restricted, and gone early. Read every sign — LoDo&apos;s tow enforcement is real. Viable for a weekday afternoon game if you arrive well ahead of first pitch; risky for a weekend night.
            </p>
          </div>
        </div>

        {/* The better move */}
        <div className="bg-denver-navy text-white rounded-2xl p-6 lg:p-8">
          <h2 className="text-2xl font-bold mb-2">The locals&apos; move: don&apos;t park at all</h2>
          <p className="text-white/70 text-sm leading-relaxed mb-3">
            The single best thing about Coors Field&apos;s location is that you don&apos;t need to drive to it. Two ways to skip parking entirely:
          </p>
          <p className="text-white/80 text-sm leading-relaxed mb-2">
            <strong>Take the train.</strong> Ride RTD rail to Union Station and walk about 10 minutes to the ballpark. No parking fee, and — crucially — no sitting in the post-game exit crawl while everyone else fights out of the lots.
          </p>
          <p className="text-white/80 text-sm leading-relaxed">
            <strong>Stay walkable.</strong> Book a LoDo hotel and the whole night is on foot: walk to Blake Street for pregame, walk into the park, walk back when you&apos;re ready. It&apos;s the best version of a Rockies game night — and the hotels a few blocks out are often cheaper than a game-day parking spot plus a rideshare each way.
          </p>
          <Link href="/hotels/near-coors-field" className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-denver-amber hover:bg-amber-500 text-white text-sm font-semibold rounded-full transition-colors">
            Hotels walking distance to Coors Field &rarr;
          </Link>
        </div>

        {/* Game day tips */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Game-day parking tips</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-bold mb-1">Arrive early — it&apos;s cheaper and calmer</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Being parked 60–90 minutes before first pitch means the closest lots are still open, street options still exist, and you get the Blake Street pregame that makes a day game worth it.</p>
            </div>
            <div>
              <h3 className="font-bold mb-1">Plan your exit before the game, not after</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">The post-game exit from the closest lots is the slow part. Parking a few blocks out — or better, walking/taking the train — gets you moving while everyone else idles up the garage ramp.</p>
            </div>
            <div>
              <h3 className="font-bold mb-1">Match your spend to the opponent</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">A quiet Tuesday afternoon game and a weekend series against a big draw are completely different parking situations. Big games: reserve ahead. Small games: you have room to find a cheaper street or lot option.</p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {FAQS.map((faq) => (
              <div key={faq.q}>
                <h3 className="font-semibold mb-1">{faq.q}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Related */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Link href="/hotels/near-coors-field" className="inline-flex items-center gap-2 px-5 py-2.5 bg-denver-navy hover:bg-denver-navy/90 text-white text-sm font-semibold rounded-full transition-colors">
            Hotels near Coors Field &rarr;
          </Link>
          <Link href="/events/coors-field" className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber text-sm font-semibold rounded-full transition-colors">
            Coors Field events &rarr;
          </Link>
          <Link href="/hotels" className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber text-sm font-semibold rounded-full transition-colors">
            Where to stay in Denver &rarr;
          </Link>
        </div>
      </article>
    </>
  );
}

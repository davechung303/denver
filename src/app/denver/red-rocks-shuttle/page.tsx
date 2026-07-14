import type { Metadata } from "next";
import Link from "next/link";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Red Rocks Shuttle Guide — How to Get to a Show Without Driving (From a Local) | Dave Loves Denver",
  description:
    "Every way to shuttle to a Red Rocks concert: round-trip bar and event shuttles from downtown Denver, RTD event service, hotel options, and why a shuttle beats driving or Ubering to the show. What it costs and how to book.",
  alternates: { canonical: "https://davelovesdenver.com/denver/red-rocks-shuttle" },
  openGraph: {
    title: "Red Rocks Shuttle Guide — How to Get to a Show Without Driving",
    description: "Round-trip shuttles from downtown Denver, RTD event service, and the smart way to skip Red Rocks traffic — from a local.",
    url: "https://davelovesdenver.com/denver/red-rocks-shuttle",
  },
};

const FAQS = [
  {
    q: "Is there a shuttle to Red Rocks Amphitheatre?",
    a: "Yes — on show nights, multiple round-trip shuttles run to Red Rocks from downtown Denver and LoDo, operated by bars, restaurants, and dedicated event-transport companies. RTD (Denver's transit agency) also runs special event bus service to the venue for many larger concerts. There's no single official shuttle, so you pick the operator and pickup point that works for you and book ahead.",
  },
  {
    q: "Where do Red Rocks shuttles leave from?",
    a: "Most depart from downtown Denver and LoDo — often from a bar or restaurant that runs the service, so your ticket usually includes a pregame spot to gather before the bus leaves. Some pick up from other metro points. Always confirm the exact pickup location and departure time when you book; the bus leaves on schedule whether you're on it or not.",
  },
  {
    q: "How much does a Red Rocks shuttle cost?",
    a: "Round-trip shuttle fares typically run in the ~$25–$50 per-person range depending on the operator, the pickup point, and the show. That's often comparable to — or cheaper than — surge-priced rideshares both ways, and it removes the parking and driving entirely. Prices and availability vary by night, so book as soon as you have tickets.",
  },
  {
    q: "Is a shuttle better than driving or Ubering to Red Rocks?",
    a: "For most people, yes. Red Rocks parking is free but the post-show exit is notoriously slow, and rideshares surge hard when 9,000 people leave at once — and can be tough to get at all up at the venue. A shuttle skips the parking exit, means nobody has to stay sober to drive mountain roads at night, and gets you dropped closer than general parking. Driving makes sense mainly if you're coming from the west suburbs and beating traffic.",
  },
  {
    q: "How do I get to Red Rocks from downtown Denver without a car?",
    a: "A pre-booked show shuttle is the simplest option. Otherwise, check whether RTD is running event bus service for your specific concert. Rideshare works to get there but is unreliable and expensive for the trip back. If you're staying near the venue, ask your hotel whether it offers or can arrange show-night transport.",
  },
  {
    q: "What time do Red Rocks shuttles come back?",
    a: "Return shuttles generally leave shortly after the show ends — operators build in time for the encore but won't wait indefinitely, so know your return time and pickup spot before the show starts. This is the one real tradeoff versus driving: you leave on the shuttle's schedule, not the moment you decide.",
  },
  {
    q: "What should I bring for a Red Rocks show?",
    a: "Layers — Red Rocks sits at 6,450 feet and the temperature drops sharply after sunset, even in summer. A jacket, a small clear bag that meets the venue's bag policy, and water. If you're on a shuttle you don't have to worry about parking or driving, so you can relax and enjoy the show.",
  },
];

export default function RedRocksShuttleGuide() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
        { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://davelovesdenver.com" },
          { "@type": "ListItem", position: 2, name: "Red Rocks Shuttle Guide", item: "https://davelovesdenver.com/denver/red-rocks-shuttle" },
        ]},
        { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQS.map((f) => ({
          "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a },
        }))},
        { "@context": "https://schema.org", "@type": "Article",
          headline: "Red Rocks Shuttle Guide — How to Get to a Show Without Driving",
          description: "A local's guide to shuttling to Red Rocks: downtown bar and event shuttles, RTD event service, costs, and why it beats driving or Ubering.",
          author: { "@type": "Person", name: "Dave" },
          publisher: { "@type": "Organization", name: "Dave Loves Denver" },
          mainEntityOfPage: "https://davelovesdenver.com/denver/red-rocks-shuttle",
          speakableSpecification: { "@type": "SpeakableSpecification", cssSelector: ["[data-speakable]"] },
        },
      ])}} />

      <section className="bg-denver-navy text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <nav className="flex items-center gap-2 text-sm text-white/50 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/hotels/near-red-rocks" className="hover:text-white transition-colors">Red Rocks</Link>
            <span>/</span>
            <span className="text-white/80">Shuttle Guide</span>
          </nav>
          <p className="text-denver-amber text-sm font-semibold uppercase tracking-widest mb-3">Morrison, Colorado</p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight" data-speakable>Red Rocks Shuttle Guide</h1>
          <p className="mt-4 text-lg text-white/70 max-w-2xl" data-speakable>
            How to get to a Red Rocks show without driving — the shuttle options, what they cost, and why locals rarely take their own car.
          </p>
        </div>
      </section>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-3">The short version</h2>
          <ul className="space-y-2 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
            <li>• <strong>Book a round-trip shuttle</strong> from downtown/LoDo — the easiest way, and it skips the brutal post-show parking exit.</li>
            <li>• <strong>Check RTD</strong> for special event bus service to your specific concert.</li>
            <li>• <strong>Fares</strong> typically run ~$25–$50 round trip — often cheaper than surge rideshares both ways.</li>
            <li>• <strong>Book early</strong> — shuttles sell out for big shows, and you leave on their schedule, so know your return time.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-3" data-speakable>Why locals shuttle instead of drive</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            Red Rocks is one of the greatest venues on earth, and it&apos;s carved into the mountains outside Morrison — about 30–40 minutes from downtown Denver with no walkable place to stay right at the gates. Parking is free, but when 9,000 people leave at the same time, the exit crawls and rideshares surge (when you can get one at all up there). A shuttle turns the worst part of the night into someone else&apos;s problem: no parking, no mountain-road driving in the dark, and nobody in your group has to stay sober to drive home.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="font-bold text-lg mb-1">1. Downtown bar &amp; event shuttles</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              The most popular option. On show nights, bars, restaurants, and dedicated event-transport companies run round-trip buses from downtown Denver and LoDo. Because many are run by a bar, your ticket often includes a pregame gathering spot before the bus leaves. These sell out for popular concerts — book as soon as you have show tickets, and confirm the pickup point and departure time.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-1">2. RTD event bus service</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              For many larger concerts, RTD (Denver&apos;s public transit agency) runs special event bus service to Red Rocks. It&apos;s typically the most affordable option when it&apos;s offered — but it&apos;s show-specific, so check the RTD site for your particular date rather than assuming it runs every night.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-1">3. Hotel &amp; group transport</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              If you&apos;re staying nearby, ask your hotel whether it offers or can arrange show-night transport — some near the venue do. For a bigger group, a private charter van or bus can work out to a reasonable per-person cost and gives you your own schedule. Confirm details directly with the operator.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-1">4. Rideshare (with a warning)</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Uber and Lyft will get you <em>there</em> fine. The problem is the ride <em>back</em>: prices surge hard and cars are scarce when the show lets out. If you go this route, expect to wait and pay a premium — which is exactly why a pre-booked shuttle is usually the smarter call.
            </p>
          </div>
        </div>

        <div className="bg-denver-navy text-white rounded-2xl p-6 lg:p-8">
          <h2 className="text-2xl font-bold mb-2">Staying the night? Base in Denver.</h2>
          <p className="text-white/70 text-sm leading-relaxed mb-3">
            There&apos;s no walkable hotel at Red Rocks, so most people either base in Denver and shuttle out, or stay in the west-metro suburbs (Lakewood, Golden) for a shorter drive. If you want the full trip — great food, bars, and the city — stay downtown and take a shuttle to the show.
          </p>
          <Link href="/hotels/near-red-rocks" className="inline-flex items-center gap-2 px-5 py-2.5 bg-denver-amber hover:bg-amber-500 text-white text-sm font-semibold rounded-full transition-colors">
            Where to stay for a Red Rocks show &rarr;
          </Link>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Shuttle-night tips</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-bold mb-1">Book the moment you have tickets</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Shuttles for popular shows sell out well before the concert. The good pickup times and points go first.</p>
            </div>
            <div>
              <h3 className="font-bold mb-1">Know your return time and spot</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">The one tradeoff versus driving: you leave on the shuttle&apos;s schedule. Confirm the return departure and pickup location before the show, not after.</p>
            </div>
            <div>
              <h3 className="font-bold mb-1">Dress for 6,450 feet after dark</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">It gets cold fast after sunset, even in summer. Bring a jacket, and check the venue&apos;s current bag policy before you pack.</p>
            </div>
          </div>
        </div>

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

        <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Link href="/hotels/near-red-rocks" className="inline-flex items-center gap-2 px-5 py-2.5 bg-denver-navy hover:bg-denver-navy/90 text-white text-sm font-semibold rounded-full transition-colors">
            Hotels near Red Rocks &rarr;
          </Link>
          <Link href="/events/red-rocks" className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber text-sm font-semibold rounded-full transition-colors">
            Upcoming Red Rocks shows &rarr;
          </Link>
          <Link href="/hotels" className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber text-sm font-semibold rounded-full transition-colors">
            Where to stay in Denver &rarr;
          </Link>
        </div>
      </article>
    </>
  );
}

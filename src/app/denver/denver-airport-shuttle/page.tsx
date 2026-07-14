import type { Metadata } from "next";
import Link from "next/link";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Denver Airport Shuttle Guide — DEN to Downtown, Hotels & the Mountains | Dave Loves Denver",
  description:
    "How to get from Denver International Airport (DEN) to where you're going: the A Line train to downtown, free hotel shuttles, shared-ride shuttles to the ski towns, and rideshare — what each costs and when to use it.",
  alternates: { canonical: "https://davelovesdenver.com/denver/denver-airport-shuttle" },
  openGraph: {
    title: "Denver Airport Shuttle Guide — DEN to Downtown, Hotels & the Mountains",
    description: "The A Line train, hotel shuttles, mountain shuttles, and rideshare from DEN — costs and when to use each, from a local.",
    url: "https://davelovesdenver.com/denver/denver-airport-shuttle",
  },
};

const FAQS = [
  {
    q: "Is there a shuttle from Denver Airport to downtown?",
    a: "The best 'shuttle' to downtown is actually the train: RTD's A Line runs from inside the DEN terminal to Union Station in about 37 minutes for a flat fare (around $10.50). From Union Station you're in the heart of LoDo and a short walk or rideshare from most downtown hotels. It's cheaper and often faster than a car during rush hour.",
  },
  {
    q: "Do hotels near Denver Airport have free shuttles?",
    a: "Most hotels within a few miles of DEN run complimentary airport shuttles, typically every 20–30 minutes during the day. Always confirm the hours when you book — overnight frequency drops, so if you have a red-eye arrival or a pre-dawn departure, check the exact schedule (or pick the terminal-connected hotel, which needs no shuttle at all).",
  },
  {
    q: "How do I get from Denver Airport to the ski resorts?",
    a: "Shared-ride mountain shuttle companies run scheduled service from DEN to the resort towns — Vail, Breckenridge, Keystone, Winter Park, and more. You book a seat in advance for a set per-person fare, and they handle the drive up I-70 (which you may not want to do yourself in winter). For groups, a private mountain transfer or a rental car with snow-capable tires are the other options.",
  },
  {
    q: "How much is a taxi or Uber from Denver Airport to downtown?",
    a: "Rideshare and taxi runs roughly $40–$65 to downtown depending on traffic and surge, versus about $10.50 on the A Line train. Rideshare makes sense if you're carrying a lot of luggage, traveling as a group, arriving at an odd hour, or heading somewhere the train doesn't serve well. For a solo traveler headed to LoDo or RiNo, the train usually wins.",
  },
  {
    q: "How far is Denver Airport from downtown?",
    a: "DEN sits about 25 miles northeast of downtown Denver — a 30–45 minute drive depending on traffic, or about 37 minutes on the A Line train. It's genuinely far from the city, which is why it's worth planning your ground transport rather than defaulting to a pricey rideshare.",
  },
  {
    q: "What's the cheapest way from DEN to Denver?",
    a: "The A Line train at roughly $10.50 is by far the cheapest way into the city, and RTD's wider bus and rail network connects from Union Station. If your hotel is near the airport, its free shuttle is effectively $0. Rideshare and taxis are the most expensive option for a solo trip downtown.",
  },
  {
    q: "Should I stay near the airport or downtown?",
    a: "Stay downtown unless you have a very early flight or a very late arrival — DEN is 30–45 minutes out, so an airport-area hotel means commuting into the city every day or missing it entirely. Save the airport hotels (and their free shuttles) for the night before an early departure or after a late landing.",
  },
];

export default function DenverAirportShuttleGuide() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
        { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://davelovesdenver.com" },
          { "@type": "ListItem", position: 2, name: "Denver Airport Shuttle Guide", item: "https://davelovesdenver.com/denver/denver-airport-shuttle" },
        ]},
        { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQS.map((f) => ({
          "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a },
        }))},
        { "@context": "https://schema.org", "@type": "Article",
          headline: "Denver Airport Shuttle Guide — DEN to Downtown, Hotels & the Mountains",
          description: "A local's guide to getting from Denver International Airport: the A Line train, hotel shuttles, mountain shuttles, and rideshare — costs and when to use each.",
          author: { "@type": "Person", name: "Dave" },
          publisher: { "@type": "Organization", name: "Dave Loves Denver" },
          mainEntityOfPage: "https://davelovesdenver.com/denver/denver-airport-shuttle",
          speakableSpecification: { "@type": "SpeakableSpecification", cssSelector: ["[data-speakable]"] },
        },
      ])}} />

      <section className="bg-denver-navy text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <nav className="flex items-center gap-2 text-sm text-white/50 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/hotels/near-denver-airport" className="hover:text-white transition-colors">Denver Airport</Link>
            <span>/</span>
            <span className="text-white/80">Shuttle Guide</span>
          </nav>
          <p className="text-denver-amber text-sm font-semibold uppercase tracking-widest mb-3">Denver International Airport</p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight" data-speakable>Denver Airport Shuttle Guide</h1>
          <p className="mt-4 text-lg text-white/70 max-w-2xl" data-speakable>
            Every way from DEN to where you&apos;re actually going — downtown, your hotel, or the mountains — with what each costs and when it&apos;s the right call.
          </p>
        </div>
      </section>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-3">The short version</h2>
          <ul className="space-y-2 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
            <li>• <strong>Going downtown?</strong> Take the A Line train — ~37 min to Union Station, ~$10.50, straight from the terminal.</li>
            <li>• <strong>Staying by the airport?</strong> Most nearby hotels run free shuttles every 20–30 min — confirm overnight hours.</li>
            <li>• <strong>Headed to the mountains?</strong> Book a shared-ride mountain shuttle to the ski towns in advance.</li>
            <li>• <strong>Lots of bags or a group?</strong> Rideshare is ~$40–65 downtown — worth it sometimes, but the train usually wins solo.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-3" data-speakable>First, where are you going?</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            DEN is about 25 miles northeast of downtown — genuinely far, which is why the &ldquo;best&rdquo; way out depends entirely on your destination. Downtown, an airport hotel, and a mountain resort each have a different right answer. Here&apos;s how to choose.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="font-bold text-lg mb-1">1. To downtown Denver — the A Line train</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              The commuter train boards right at the terminal and runs to Union Station in about 37 minutes for a flat fare (around $10.50), every 15 minutes for most of the day. It drops you in the middle of LoDo, walkable or a short rideshare to most downtown hotels. For a solo traveler or couple without a mountain of luggage headed to LoDo or RiNo, it&apos;s the cheapest and often the fastest option.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-1">2. To an airport-area hotel — free hotel shuttle</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Most hotels within a few miles of DEN run complimentary shuttles every 20–30 minutes. This is effectively free transport for a pre-flight or post-arrival night. Confirm the schedule when booking — overnight frequency thins out, so for a red-eye or a pre-dawn departure, check the exact hours or choose the terminal-connected hotel that needs no shuttle at all.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-1">3. To the ski resorts — mountain shuttles</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Shared-ride mountain shuttle companies run scheduled service from DEN up I-70 to the resort towns — Vail, Breckenridge, Keystone, Winter Park and others. You reserve a seat ahead for a set per-person fare and let them handle the winter drive. For groups, a private transfer or a rental car with proper winter tires are the alternatives. Book in advance, especially in ski season.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-1">4. Rideshare &amp; taxi — when bags win</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Uber, Lyft, and taxis run roughly $40–$65 to downtown, with surge common at peak arrival times. They&apos;re the right call when you&apos;ve got a lot of luggage, you&apos;re traveling as a group (split, it&apos;s competitive), you land at an odd hour, or you&apos;re headed somewhere transit doesn&apos;t serve well.
            </p>
          </div>
        </div>

        <div className="bg-denver-navy text-white rounded-2xl p-6 lg:p-8">
          <h2 className="text-2xl font-bold mb-2">The rule of thumb</h2>
          <p className="text-white/70 text-sm leading-relaxed mb-3">
            Only stay near the airport if you have a very early flight or a very late arrival. DEN is 30–45 minutes from the city, so an airport hotel otherwise means commuting in every day or skipping Denver entirely. For an early departure, an airport hotel with a free shuttle is perfect; for everything else, base downtown and take the train in.
          </p>
          <Link href="/hotels/near-denver-airport" className="inline-flex items-center gap-2 px-5 py-2.5 bg-denver-amber hover:bg-amber-500 text-white text-sm font-semibold rounded-full transition-colors">
            Hotels near Denver Airport &rarr;
          </Link>
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
          <Link href="/hotels/near-denver-airport" className="inline-flex items-center gap-2 px-5 py-2.5 bg-denver-navy hover:bg-denver-navy/90 text-white text-sm font-semibold rounded-full transition-colors">
            Hotels near Denver Airport &rarr;
          </Link>
          <Link href="/denver/where-to-stay" className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber text-sm font-semibold rounded-full transition-colors">
            Where to stay in Denver &rarr;
          </Link>
          <Link href="/hotels" className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber text-sm font-semibold rounded-full transition-colors">
            All hotel guides &rarr;
          </Link>
        </div>
      </article>
    </>
  );
}

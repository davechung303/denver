import type { Metadata } from "next";
import Link from "next/link";
import ViatorWidget from "@/components/ViatorWidget";
import { NEIGHBORHOODS } from "@/lib/neighborhoods";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Best Tours & Experiences in Denver, CO — Dave Loves Denver",
  description:
    "The best tours and experiences in Denver — food tours, brewery tours, bike tours, and only-in-Denver adventures. Honest picks from a local who actually lives here.",
  openGraph: {
    title: "Best Tours & Experiences in Denver",
    description:
      "Food tours, brewery tours, bike tours, and only-in-Denver adventures — honest picks from a local.",
    url: "https://davelovesdenver.com/denver/experiences",
  },
  alternates: {
    canonical: "https://davelovesdenver.com/denver/experiences",
  },
};

const EXPERIENCE_TYPES = [
  {
    id: "food",
    emoji: "🍽️",
    title: "Food Tours",
    searchTerm: "Denver food tour",
    dave: "Whenever I travel somewhere new, a food tour is one of the first things I book. It's the fastest way to understand a city — you try things you'd never order on your own, end up in neighborhoods you didn't know existed, and usually learn something interesting along the way. Denver's food scene earns it.",
  },
  {
    id: "brewery",
    emoji: "🍺",
    title: "Brewery Tours",
    searchTerm: "Denver brewery tour",
    dave: "Denver has been a beer city for a long time, and for good reason. Our breweries compete with anyone in the country, and we host some of the most respected competitions in the industry. If you're booking a brewery tour, enjoy it — just remember you're drinking at altitude. It hits different up here.",
  },
  {
    id: "outdoor",
    emoji: "🚴",
    title: "Outdoor & Bike Tours",
    searchTerm: "Denver outdoor tours",
    dave: "The best way to see Denver is to get out of the car. I'm a big fan of bike tours specifically — you cover more ground than walking, you're actually outside, and you see parts of the city most visitors completely miss.",
  },
  {
    id: "unique",
    emoji: "🏔️",
    title: "Only in Denver",
    searchTerm: "Denver unique experiences",
    dave: "Denver works for pretty much anyone, which is rare for a city this size. Whether you've been here a dozen times or you're completely new, there's something here you haven't tried yet. Lean into that.",
  },
];

const FAQS = [
  {
    q: "Are food tours worth it in Denver?",
    a: "Yes — especially if it's your first time in the city. A good food tour covers 4–6 stops across a neighborhood, gives you context you wouldn't get on your own, and usually lands you in spots you'd have walked right past. It's one of the better ways to spend 2–3 hours.",
  },
  {
    q: "How do Denver's breweries compare?",
    a: "Denver has been a serious beer city for decades. We host some of the most respected brewing competitions in the world, and local breweries like Great Divide, Breckenridge, and Odell have national reputations. RiNo has the highest concentration of craft breweries — a brewery tour there covers a lot of ground quickly.",
  },
  {
    q: "What's the best time of year for outdoor experiences in Denver?",
    a: "May through October is the sweet spot. Summers are warm and sunny with low humidity. Fall is spectacular — mild temps, golden light, and fewer crowds than summer. Winter is fine for indoor experiences but bike tours and walking tours are best avoided unless you don't mind the cold.",
  },
  {
    q: "Is drinking at altitude in Denver really different?",
    a: "Yes, genuinely. Denver sits at 5,280 feet — a mile above sea level. Alcohol hits faster and dehydration sets in quicker. If you're booking a brewery tour, drink water between tastings and eat something first. It's a real thing, not just a local joke.",
  },
  {
    q: "What should I skip in Denver?",
    a: "Not everything that gets recommended deserves the hype. Some locals will steer you toward Cherry Creek Mall, the Buckhorn Exchange, or restaurants running on reputation from years ago. Every city has its tourist traps — Denver's no different. But the good here genuinely outweighs the bad if you know where to look.",
  },
];

export default function ExperiencesPage() {
  return (
    <>
      {/* FAQ schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQS.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />

      {/* Hero */}
      <section className="bg-denver-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <nav className="flex items-center gap-2 text-sm text-white/50 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/denver" className="hover:text-white transition-colors">Denver</Link>
            <span>/</span>
            <span className="text-white/80">Experiences</span>
          </nav>
          <p className="text-denver-amber text-sm font-semibold uppercase tracking-widest mb-3">Denver, Colorado</p>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">Tours & Experiences</h1>
          <p className="mt-5 text-xl text-white/70 max-w-2xl leading-relaxed">
            Denver has a lot going on. Here&apos;s how I&apos;d actually spend my time — and my money — if I were visiting for the first time (or the tenth).
          </p>
        </div>
      </section>

      {/* Experience sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        {EXPERIENCE_TYPES.map((type) => (
          <section key={type.id} id={type.id}>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">{type.emoji}</span>
              <h2 className="text-3xl font-bold">{type.title}</h2>
            </div>
            {/* Dave's editorial note */}
            <blockquote className="border-l-4 border-denver-amber pl-5 py-1 mb-8 text-slate-600 dark:text-slate-400 text-lg leading-relaxed italic">
              &ldquo;{type.dave}&rdquo;
              <footer className="mt-2 text-sm not-italic text-slate-400 dark:text-slate-500">— Dave</footer>
            </blockquote>
            <ViatorWidget searchTerm={type.searchTerm} />
          </section>
        ))}
      </div>

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

      {/* Neighborhood CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-2xl font-bold mb-8">Explore Denver by Neighborhood</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {NEIGHBORHOODS.map((n) => (
            <Link
              key={n.slug}
              href={`/denver/${n.slug}`}
              className="group relative overflow-hidden rounded-2xl aspect-video flex flex-col justify-end p-4 hover:scale-[1.02] transition-transform duration-200"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={n.image} alt={n.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 group-hover:from-black/70 transition-all" />
              <div className="relative z-10 text-white">
                <p className="text-xs text-white/70">{n.tagline}</p>
                <h3 className="font-bold">{n.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

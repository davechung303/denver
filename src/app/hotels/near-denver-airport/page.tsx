import type { Metadata } from "next";
import Link from "next/link";
import { getPlaces, isRealHotel, photoUrl, type Place } from "@/lib/places";
import { expediaDenverHotelsUrl } from "@/lib/travelpayouts";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Hotels Near Denver Airport (DEN) — Best Options for Every Budget | Dave Loves Denver",
  description:
    "The best hotels near Denver International Airport — from the Westin connected to the terminal to the Gaylord Rockies and budget options along Peña Blvd. Honest picks for early flights and late arrivals.",
  alternates: { canonical: "https://davelovesdenver.com/hotels/near-denver-airport" },
  openGraph: {
    title: "Hotels Near Denver Airport (DEN)",
    description: "From the Westin inside the terminal to the Gaylord Rockies — the best airport hotels for early flights, late arrivals, and layovers.",
    url: "https://davelovesdenver.com/hotels/near-denver-airport",
  },
};

const FAQS = [
  {
    q: "Is there a hotel connected to Denver International Airport?",
    a: "Yes — the Westin Denver International Airport is physically connected to the main terminal via a covered walkway. You can walk from your room to security in about 10 minutes. It's not cheap, but if you have a very early flight or a same-day connection, it's worth every dollar.",
  },
  {
    q: "How far is Denver Airport from downtown hotels?",
    a: "About 30–45 minutes by car depending on traffic, or roughly 37 minutes on the A Line train from Union Station. If you're spending most of your time in the city, staying near DEN adds real friction. Save the airport-area hotels for arrival nights or early departure days.",
  },
  {
    q: "What is the Gaylord Rockies Resort?",
    a: "The Gaylord Rockies is a massive resort-style hotel about 10 minutes from the terminal. It has an indoor water park, multiple restaurants, a spa, and mountain views. It's genuinely worth a stay even if you're not flying anywhere — Denver locals book it for staycations. Families especially love it.",
  },
  {
    q: "Are there cheap hotels near Denver Airport?",
    a: "Yes — the area around DEN has a good range of budget options: Hampton Inn, Marriott, Hyatt Place, and several independent options along Peña Blvd and Tower Road. You're paying for proximity to the airport, not the neighborhood, so budget options here are a better value than budget options in some other parts of Denver.",
  },
  {
    q: "Do Denver airport hotels offer free shuttles?",
    a: "Most hotels within a few miles of DEN offer complimentary airport shuttles — usually running every 20–30 minutes. Always confirm when you book. The Westin doesn't need one since it's connected. The Gaylord runs a dedicated shuttle.",
  },
  {
    q: "Should I stay near the airport or downtown Denver?",
    a: "Stay downtown unless you have a very early flight (before 7am) or a very late arrival (after midnight). DEN is far from the city — 30–45 minutes each way — and staying near the airport means either Ubering into Denver every day or missing the city almost entirely.",
  },
];

// eslint-disable-next-line @next/next/no-img-element
function HotelCard({ place }: { place: Place }) {
  const href = place.expedia_affiliate_url ?? expediaDenverHotelsUrl("Denver Airport");
  const photo = place.photos?.[0];
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="group flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 hover:border-denver-amber hover:shadow-md transition-all duration-200"
    >
      <div className="relative w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800">
        {photo ? (
          <img src={photoUrl(photo.name, 128, 128)} alt={place.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
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
        <span className="text-xs text-denver-amber font-medium">Book on Expedia &rarr;</span>
      </div>
    </a>
  );
}

export default async function HotelsNearDenverAirportPage() {
  const places = await getPlaces("airport", "hotels");
  const hotels = places.filter(isRealHotel).filter((p) => p.rating != null).slice(0, 6);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
        { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://davelovesdenver.com" },
          { "@type": "ListItem", position: 2, name: "Hotels Near Denver Airport", item: "https://davelovesdenver.com/hotels/near-denver-airport" },
        ]},
        { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQS.map((f) => ({
          "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a },
        }))},
      ])}} />

      {/* Hero */}
      <section className="bg-denver-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <nav className="flex items-center gap-2 text-sm text-white/50 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white/80">Hotels Near Denver Airport</span>
          </nav>
          <p className="text-denver-amber text-sm font-semibold uppercase tracking-widest mb-3">Denver International Airport</p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">Hotels Near Denver Airport</h1>
          <p className="mt-4 text-lg text-white/70 max-w-2xl">
            Early flight tomorrow. Late arrival tonight. Here&apos;s exactly where to stay near DEN — and what&apos;s actually worth booking.
          </p>
        </div>
      </section>

      {/* Editorial + hotel cards side by side */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-100 dark:border-slate-800">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Left: editorial */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">The Honest Breakdown</h2>
            <div>
              <h3 className="font-bold mb-1">The Westin (connected to terminal)</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Physically attached to the terminal via a covered walkway — about 10 minutes to security. If you have a 6am flight or just landed at 11pm, this is the right call. Not cheap, but it delivers.</p>
            </div>
            <div>
              <h3 className="font-bold mb-1">Gaylord Rockies Resort (~10 min)</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">A full resort with an indoor water park, restaurants, spa, and mountain views. Denver locals book it for staycations. If you&apos;re traveling with kids or want one night that feels like an event, this is the pick.</p>
            </div>
            <div>
              <h3 className="font-bold mb-1">Budget & Mid-Range</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Hampton Inn, Hyatt Place, and Marriott options cluster along Peña Blvd — most with free airport shuttles every 20–30 min. Good value for a pre-flight night when you don&apos;t need anything fancy.</p>
            </div>
            <blockquote className="border-l-4 border-denver-amber pl-4 text-slate-600 dark:text-slate-400 text-sm leading-relaxed italic">
              &ldquo;DEN is genuinely far from the city — 30–45 minutes on a good day. Only stay out here if you have a very early flight or a very late arrival. Otherwise, stay downtown and Uber to the airport.&rdquo;
              <footer className="mt-1 text-xs not-italic text-slate-400">— Dave</footer>
            </blockquote>
          </div>

          {/* Right: hotel cards */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Top-Rated Options</p>
            {hotels.map((hotel) => <HotelCard key={hotel.place_id} place={hotel} />)}
            <a href={expediaDenverHotelsUrl("Denver Airport")} target="_blank" rel="noopener noreferrer"
              className="mt-2 inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-denver-amber hover:bg-amber-500 text-white text-sm font-semibold rounded-full transition-colors"
            >
              See all Denver Airport hotels &rarr;
            </a>
          </div>
        </div>
      </section>

      {/* Full-width Stay22 map */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-bold mb-4">Hotel Map — Denver Airport Area</h2>
        <div className="relative w-full h-[480px]">
          <iframe src="https://www.stay22.com/embed/69d053d05021760e928bc4cb" frameBorder="0"
            className="absolute inset-0 w-full h-full rounded-2xl" title="Hotels near Denver International Airport" loading="lazy" />
        </div>
      </section>

      {/* Getting around */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-bold mb-6">Getting Between DEN and Denver</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { title: "A Line Train", body: "37 minutes from DEN to Union Station. Runs every 15 min. $10.50 each way. Best if you're not checking bags and heading to LoDo or RiNo." },
            { title: "Uber / Lyft", body: "30–45 minutes to downtown. Expect $40–65 each way. Surge pricing is common during peak arrivals — book ahead or take the train." },
            { title: "Hotel Shuttles", body: "Most airport-area hotels run free shuttles every 20–30 min. The Westin doesn't need one — it's connected. Always confirm hours when booking." },
          ].map((tip) => (
            <div key={tip.title} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
              <h3 className="font-bold mb-2">{tip.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{tip.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-slate-50 dark:bg-slate-900/50 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8">Frequently Asked Questions</h2>
          <div className="space-y-7">
            {FAQS.map((faq) => (
              <div key={faq.q}>
                <h3 className="font-semibold mb-1">{faq.q}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTAs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-lg font-bold mb-3">Staying Longer? Find a Better Base.</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-5 text-sm max-w-xl">If you&apos;re spending more than a night in Denver, you&apos;ll be much better off staying closer to the city.</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/denver/where-to-stay" className="inline-flex items-center gap-2 px-5 py-2.5 bg-denver-navy hover:bg-denver-navy/90 text-white text-sm font-semibold rounded-full transition-colors">
            Full Denver hotel guide &rarr;
          </Link>
          <Link href="/hotels/near-coors-field" className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber text-sm font-semibold rounded-full transition-colors">
            Hotels near Coors Field &rarr;
          </Link>
          <Link href="/hotels/near-red-rocks" className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber text-sm font-semibold rounded-full transition-colors">
            Hotels near Red Rocks &rarr;
          </Link>
        </div>
      </section>
    </>
  );
}

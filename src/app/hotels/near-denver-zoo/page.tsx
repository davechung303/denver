import type { Metadata } from "next";
import Link from "next/link";
import { getPlaces, isRealHotel, photoUrl, type Place } from "@/lib/places";
import { expediaDenverHotelsUrl, ticketmasterAffiliateUrl } from "@/lib/travelpayouts";
import { getEventsForVenue } from "@/lib/ticketmaster";
import EventCard from "@/components/EventCard";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Hotels Near Denver Zoo — Best Places to Stay in City Park | Dave Loves Denver",
  description:
    "The best hotels near the Denver Zoo in City Park — walkable options in Uptown, Five Points, and Capitol Hill. A local's guide to staying close to one of Denver's best attractions.",
  alternates: { canonical: "https://davelovesdenver.com/hotels/near-denver-zoo" },
  openGraph: {
    title: "Hotels Near Denver Zoo Denver",
    description: "Hotels near the Denver Zoo — Uptown, Five Points, and Capitol Hill options from a local.",
    url: "https://davelovesdenver.com/hotels/near-denver-zoo",
  },
};

const FAQS = [
  {
    q: "What hotels are closest to the Denver Zoo?",
    a: "The Denver Zoo is in City Park on the east side of downtown. Uptown is the closest neighborhood with real hotel options — about a 10-minute walk or short drive. Capitol Hill and Five Points also have options within 15 minutes.",
  },
  {
    q: "Is the Denver Zoo walkable from downtown hotels?",
    a: "It's a bit far from LoDo — about 1.5–2 miles, which is a 30-minute walk. Most people drive or use rideshare. Uptown and Capitol Hill are the closest neighborhoods with walkable options.",
  },
  {
    q: "What else is in City Park near the Denver Zoo?",
    a: "City Park is one of Denver's best parks — lake, tennis courts, and great skyline views. The Denver Museum of Nature & Science is right there too. It's a genuinely good place to spend a morning before or after the zoo.",
  },
  {
    q: "How much time do you need at the Denver Zoo?",
    a: "Budget 3–4 hours for a thorough visit. The zoo is genuinely large and well-maintained. Early morning is best — animals are more active and crowds are thinner. It opens at 9am most days.",
  },
  {
    q: "Is parking easy at the Denver Zoo?",
    a: "There's a large parking lot on site. On busy weekends it can fill up — arrive early or use the overflow lots nearby. Street parking around City Park is also an option.",
  },
];

// eslint-disable-next-line @next/next/no-img-element
function HotelCard({ place }: { place: Place }) {
  const href = place.expedia_affiliate_url ?? expediaDenverHotelsUrl("Uptown Denver");
  const photo = place.photos?.[0];
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="group flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 hover:border-denver-amber hover:shadow-md transition-all duration-200"
    >
      <div className="relative w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800">
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
        <span className="text-xs text-denver-amber font-medium">Book on Expedia &rarr;</span>
      </div>
    </a>
  );
}

export default async function HotelsNearDenverZooPage() {
  const [uptownPl, fivePointsPl, events] = await Promise.all([
    getPlaces("uptown", "hotels"),
    getPlaces("five-points", "hotels"),
    getEventsForVenue("Denver Zoo", 6),
  ]);
  const seen = new Set<string>();
  const hotels = [...uptownPl, ...fivePointsPl]
    .filter(isRealHotel).filter((p) => p.rating != null)
    .filter((p) => { if (seen.has(p.place_id)) return false; seen.add(p.place_id); return true; })
    .slice(0, 6);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
        { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://davelovesdenver.com" },
          { "@type": "ListItem", position: 2, name: "Hotels Near Denver Zoo", item: "https://davelovesdenver.com/hotels/near-denver-zoo" },
        ]},
        { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQS.map((f) => ({
          "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a },
        }))},
        { "@context": "https://schema.org", "@type": "WebPage",
          name: "Hotels Near Denver Zoo",
          description: "The best hotels near the Denver Zoo in City Park — walkable options in Uptown, Five Points, and Capitol Hill. A local's guide to staying close to one of Denver's best attractions.",
          url: "https://davelovesdenver.com/hotels/near-denver-zoo",
          speakableSpecification: { "@type": "SpeakableSpecification", cssSelector: ["[data-speakable]"] },
        },
      ])}} />

      <section className="bg-denver-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <nav className="flex items-center gap-2 text-sm text-white/50 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white/80">Hotels Near Denver Zoo</span>
          </nav>
          <p className="text-denver-amber text-sm font-semibold uppercase tracking-widest mb-3">City Park, Denver</p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight" data-speakable>Hotels Near Denver Zoo</h1>
          <p className="mt-4 text-lg text-white/70 max-w-2xl" data-speakable>
            The Denver Zoo is one of the best in the country — right in City Park with the Rockies as a backdrop. Here&apos;s where to stay close by.
          </p>
        </div>
      </section>

      {/* Editorial + hotel cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-100 dark:border-slate-800">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Where to Stay</h2>
            <div>
              <h3 className="font-bold mb-1">Uptown (closest, 10 min)</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">The best base for a zoo trip. Uptown is east of downtown with solid hotel options, great restaurants on 17th and 18th Ave, and easy access to City Park. You can walk, drive, or take a quick rideshare.</p>
            </div>
            <div>
              <h3 className="font-bold mb-1">Capitol Hill (10–15 min)</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">South of Uptown and City Park — has some budget-friendly and boutique hotel options. Good neighborhood with its own character, walkable to Cheesman Park and the zoo.</p>
            </div>
            <div>
              <h3 className="font-bold mb-1">Five Points / RiNo (15 min)</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Just northwest of City Park. Best for visitors who want to combine a zoo trip with Denver&apos;s best food and brewery scene. Short drive or rideshare to the zoo from here.</p>
            </div>
            <blockquote className="border-l-4 border-denver-amber pl-4 text-slate-600 dark:text-slate-400 text-sm leading-relaxed italic" data-speakable>
              &ldquo;The Denver Zoo is legitimately impressive — well-maintained, thoughtful exhibits, and the mountain backdrop makes it feel uniquely Denver. Go early. Stay in Uptown, walk through City Park to get there, and grab brunch after on 17th Avenue.&rdquo;
              <footer className="mt-1 text-xs not-italic text-slate-400">— Dave</footer>
            </blockquote>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Uptown & Five Points</p>
            {hotels.map((hotel) => <HotelCard key={hotel.place_id} place={hotel} />)}
            <a href={expediaDenverHotelsUrl("Uptown Denver Zoo")} target="_blank" rel="noopener noreferrer"
              className="mt-2 inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-denver-amber hover:bg-amber-500 text-white text-sm font-semibold rounded-full transition-colors"
            >
              See all nearby hotels &rarr;
            </a>
          </div>
        </div>
      </section>

      {/* Upcoming Events at Denver Zoo */}
      {events.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <h2 className="text-xl font-bold">Upcoming Events at Denver Zoo</h2>
            <a href={ticketmasterAffiliateUrl("https://www.ticketmaster.com/search?q=denver+zoo")} target="_blank" rel="noopener noreferrer"
              className="text-sm text-denver-amber font-semibold hover:underline">
              All events &rarr;
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event) => <EventCard key={event.event_id} event={event} />)}
          </div>
        </section>
      )}

      {/* Visit Tips */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-bold mb-6">Zoo Visit Tips</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { title: "Go Early", body: "The zoo opens at 9am. Early mornings mean more active animals, cooler temperatures, and thinner crowds. Budget 3–4 hours for a thorough visit." },
            { title: "City Park First", body: "City Park surrounds the zoo — take a walk around the lake before or after your visit. The views of the Denver skyline and Rockies are some of the best in the city." },
            { title: "Denver Museum Next Door", body: "The Denver Museum of Nature & Science is right next to the zoo — combine both in a day trip or save one for the next morning." },
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

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-wrap gap-3">
          <Link href="/denver/where-to-stay" className="inline-flex items-center gap-2 px-5 py-2.5 bg-denver-navy hover:bg-denver-navy/90 text-white text-sm font-semibold rounded-full transition-colors">
            Full Denver hotel guide &rarr;
          </Link>
          <Link href="/hotels/near-city-park" className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber text-sm font-semibold rounded-full transition-colors">
            Hotels near City Park &rarr;
          </Link>
          <Link href="/hotels/near-botanic-gardens" className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber text-sm font-semibold rounded-full transition-colors">
            Hotels near Botanic Gardens &rarr;
          </Link>
          <Link href="/hotels/near-coors-field" className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber text-sm font-semibold rounded-full transition-colors">
            Hotels near Coors Field &rarr;
          </Link>
        </div>
      </section>
    </>
  );
}

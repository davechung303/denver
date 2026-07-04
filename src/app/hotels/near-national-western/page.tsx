import type { Metadata } from "next";
import Link from "next/link";
import { getPlaces, isRealHotel, photoUrl, type Place } from "@/lib/places";
import { expediaDenverHotelsUrl, ticketmasterAffiliateUrl } from "@/lib/travelpayouts";
import { getEventsForVenue } from "@/lib/ticketmaster";
import EventCard from "@/components/EventCard";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Hotels Near National Western Complex Denver — Best Places to Stay | Dave Loves Denver",
  description:
    "The best hotels near National Western Complex in Denver — RiNo and Five Points options for the Stock Show, concerts, and events at one of Denver's largest event venues.",
  alternates: { canonical: "https://davelovesdenver.com/hotels/near-national-western" },
  openGraph: {
    title: "Hotels Near National Western Complex Denver",
    description: "Hotels near National Western Complex — RiNo and Five Points options for the Stock Show and events.",
    url: "https://davelovesdenver.com/hotels/near-national-western",
  },
};

const FAQS = [
  {
    q: "What hotels are closest to National Western Complex?",
    a: "National Western Complex sits just north of RiNo along the South Platte River. RiNo hotels are the closest with real options, about a 10–15 minute walk or short rideshare. Five Points and downtown have more hotel density further away.",
  },
  {
    q: "When is the National Western Stock Show?",
    a: "The National Western Stock Show runs for about two weeks in January — typically starting mid-January. It's the largest event at the complex and one of the largest stock shows in the world. Hotels nearby book up fast during Stock Show; book well in advance.",
  },
  {
    q: "What other events happen at National Western Complex?",
    a: "Beyond the Stock Show, National Western hosts concerts, trade shows, monster truck events, and rodeos throughout the year. The complex was recently renovated and now hosts a wider variety of events year-round.",
  },
  {
    q: "Is RiNo a good base for National Western events?",
    a: "Yes — RiNo is the closest neighborhood with significant hotel and restaurant options. You're close to the complex, in Denver's best food and bar neighborhood, and easy to get around from.",
  },
  {
    q: "How far is National Western from downtown Denver?",
    a: "About 2 miles northeast of LoDo — roughly a 10-minute drive or 15-minute rideshare. Not walking distance from downtown, but a short ride.",
  },
];

// eslint-disable-next-line @next/next/no-img-element
function HotelCard({ place }: { place: Place }) {
  const href = place.expedia_affiliate_url ?? expediaDenverHotelsUrl("RiNo Denver");
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

export default async function HotelsNearNationalWesternPage() {
  const [rinoPl, fivePointsPl, events] = await Promise.all([
    getPlaces("rino", "hotels"),
    getPlaces("five-points", "hotels"),
    getEventsForVenue("National Western", 6),
  ]);
  const seen = new Set<string>();
  const hotels = [...rinoPl, ...fivePointsPl]
    .filter(isRealHotel).filter((p) => p.rating != null)
    .filter((p) => { if (seen.has(p.place_id)) return false; seen.add(p.place_id); return true; })
    .slice(0, 6);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
        { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://davelovesdenver.com" },
          { "@type": "ListItem", position: 2, name: "Hotels Near National Western Complex", item: "https://davelovesdenver.com/hotels/near-national-western" },
        ]},
        { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQS.map((f) => ({
          "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a },
        }))},
        { "@context": "https://schema.org", "@type": "WebPage",
          name: "Hotels Near National Western Complex Denver",
          description: "The best hotels near National Western Complex in Denver — RiNo and Five Points options for the Stock Show, concerts, and events at one of Denver's largest event venues.",
          url: "https://davelovesdenver.com/hotels/near-national-western",
          speakableSpecification: { "@type": "SpeakableSpecification", cssSelector: ["[data-speakable]"] },
        },
      ])}} />

      <section className="bg-denver-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <nav className="flex items-center gap-2 text-sm text-white/50 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white/80">Hotels Near National Western Complex</span>
          </nav>
          <p className="text-denver-amber text-sm font-semibold uppercase tracking-widest mb-3">RiNo & Five Points, Denver</p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight" data-speakable>Hotels Near National Western Complex</h1>
          <p className="mt-4 text-lg text-white/70 max-w-2xl" data-speakable>
            The Stock Show. Concerts. Rodeos. National Western Complex hosts some of Denver&apos;s biggest events — here&apos;s where to stay close by.
          </p>
        </div>
      </section>

      {/* Editorial + hotel cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-100 dark:border-slate-800">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Where to Stay</h2>
            <div>
              <h3 className="font-bold mb-1">RiNo (closest with options, 10–15 min)</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">The River North Art District is right next door to National Western Complex along the South Platte. RiNo is Denver&apos;s best neighborhood for restaurants and breweries — staying here means you&apos;re close to the complex and surrounded by great food and drink options.</p>
            </div>
            <div>
              <h3 className="font-bold mb-1">Five Points (15–20 min)</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Just south of the complex, Five Points is historically Denver&apos;s jazz neighborhood with a strong restaurant scene. A short rideshare from National Western and central to the rest of the city.</p>
            </div>
            <div>
              <h3 className="font-bold mb-1">Downtown / LoDo (short drive)</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">If you&apos;re spending multiple days in Denver, downtown is the right base. National Western is a 10-minute drive or rideshare, and you&apos;ll have everything else at your doorstep. For Stock Show, book downtown hotels 6+ months in advance — they fill up entirely.</p>
            </div>
            <blockquote className="border-l-4 border-denver-amber pl-4 text-slate-600 dark:text-slate-400 text-sm leading-relaxed italic" data-speakable>
              &ldquo;The National Western Stock Show is one of those only-in-Denver things — January, ice on the roads, and thousands of people in cowboy hats and Carhartt. It&apos;s genuinely fun even if ranching is not your world. Stay in RiNo and walk over, or book downtown early.&rdquo;
              <footer className="mt-1 text-xs not-italic text-slate-400">— Dave</footer>
            </blockquote>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">RiNo & Five Points</p>
            {hotels.map((hotel) => <HotelCard key={hotel.place_id} place={hotel} />)}
            <a href={expediaDenverHotelsUrl("RiNo Denver National Western")} target="_blank" rel="noopener noreferrer"
              className="mt-2 inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-denver-amber hover:bg-amber-500 text-white text-sm font-semibold rounded-full transition-colors"
            >
              See all nearby hotels &rarr;
            </a>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      {events.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <h2 className="text-xl font-bold">Upcoming Events at National Western Complex</h2>
            <a href={ticketmasterAffiliateUrl("https://www.ticketmaster.com/search?q=national+western+complex+denver")} target="_blank" rel="noopener noreferrer"
              className="text-sm text-denver-amber font-semibold hover:underline">
              All events &rarr;
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event) => <EventCard key={event.event_id} event={event} />)}
          </div>
        </section>
      )}

      {/* Tips */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-bold mb-6">Event Tips</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { title: "Stock Show: Book Early", body: "The National Western Stock Show in January is one of the largest in the world. Denver hotels fill up entirely — book 6 months out if you're planning to attend. Prices spike significantly during the two-week run." },
            { title: "RiNo Before and After", body: "RiNo's restaurants and breweries are walking distance from the complex — one of the better pre-event dining situations for any venue in Denver. Odell Denver, Ratio Beerworks, and dozens of restaurants are right there." },
            { title: "Rideshare Is Easiest", body: "Parking at National Western exists but can be chaotic around major events. Rideshare from RiNo or LoDo is usually the cleaner option — drop-off is direct and you avoid the post-event lot." },
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
          <Link href="/hotels/near-mission-ballroom" className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber text-sm font-semibold rounded-full transition-colors">
            Hotels near Mission Ballroom &rarr;
          </Link>
          <Link href="/hotels/near-coors-field" className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber text-sm font-semibold rounded-full transition-colors">
            Hotels near Coors Field &rarr;
          </Link>
          <Link href="/hotels/near-ball-arena" className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber text-sm font-semibold rounded-full transition-colors">
            Hotels near Ball Arena &rarr;
          </Link>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { getPlaces, isRealHotel, photoUrl } from "@/lib/places";
import VenueHotelCard from "@/components/VenueHotelCard";
import { expediaDenverHotelsUrl, ticketmasterAffiliateUrl } from "@/lib/travelpayouts";
import { getEventsForVenue } from "@/lib/ticketmaster";
import EventCard from "@/components/EventCard";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Hotels Near National Western Complex Denver — Best Places to Stay | Dave Loves Denver",
  description:
    "The local's guide to hotels near National Western Complex in Denver — RiNo and Five Points picks, how the N Line rail and Stock Show shuttles work, plus parking and the best budget options.",
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
  {
    q: "Is there a shuttle or train to National Western Complex?",
    a: "Yes — RTD's N Line commuter rail has a station serving the National Western Center, so you can ride in from Union Station and skip driving. During the Stock Show, expect additional park-and-ride and event shuttle options too; confirm the current routes on the RTD and Stock Show sites, as they change year to year.",
  },
  {
    q: "Is there parking at National Western Complex?",
    a: "Yes, the complex has on-site lots, but they fill and prices climb during the Stock Show and big events, and the post-event exit can be slow. If you're driving, arrive early; otherwise the N Line, a rideshare from RiNo, or a Stock Show park-and-ride is usually the cleaner call.",
  },
  {
    q: "Are there cheap hotels near National Western Complex?",
    a: "The best value is typically Five Points or the RiNo edge a block or two out, on a non-event date — Stock Show in January spikes rates across the whole metro. Book early for the Stock Show and you'll pay far less than a last-minute rate.",
  },
];


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
  const heroPhoto = hotels.find((h) => h.photos?.[0])?.photos?.[0];

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

      <section className="relative bg-denver-navy text-white overflow-hidden">
        {heroPhoto && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photoUrl(heroPhoto)} alt="Hotels in Denver" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-denver-navy via-denver-navy/85 to-denver-navy/40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
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
            {hotels.map((hotel) => <VenueHotelCard key={hotel.place_id} place={hotel} />)}
            <a href={expediaDenverHotelsUrl("RiNo Denver National Western")} target="_blank" rel="noopener noreferrer"
              className="mt-2 inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-denver-amber hover:bg-amber-500 text-white text-sm font-semibold rounded-full transition-colors"
            >
              See all nearby hotels &rarr;
            </a>
          </div>
        </div>
      </section>

      {/* Best for every trip — closest / cheap / Stock Show */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-2xl font-bold mb-6">Best Hotels Near National Western for Every Trip</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Link href="/denver/rino/hotels" className="block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:border-denver-amber transition-colors">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Best overall</p>
            <h3 className="font-bold mb-2">RiNo</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Closest neighborhood with real options, next door along the Platte, and Denver&apos;s best food and brewery scene for before and after. Short walk or rideshare to the complex.</p>
            <span className="mt-3 inline-flex items-center text-xs font-semibold text-denver-amber">Browse hotels &rarr;</span>
          </Link>
          <Link href="/denver/five-points/hotels" className="block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:border-denver-amber transition-colors">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Best on a budget</p>
            <h3 className="font-bold mb-2">Five Points &amp; the RiNo edge</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">A block or two out and a non-event date is the value sweet spot. Still a short ride to the complex, well under prime RiNo or downtown pricing.</p>
            <span className="mt-3 inline-flex items-center text-xs font-semibold text-denver-amber">Browse hotels &rarr;</span>
          </Link>
          <Link href="/denver/downtown/hotels" className="block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:border-denver-amber transition-colors">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Best for the Stock Show</p>
            <h3 className="font-bold mb-2">Downtown, booked early</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">The January Stock Show fills hotels metro-wide. Lock a downtown base months ahead, then take the N Line or a park-and-ride in — the whole city is your after-hours when you&apos;re not at the show.</p>
            <span className="mt-3 inline-flex items-center text-xs font-semibold text-denver-amber">Browse hotels &rarr;</span>
          </Link>
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-bold mb-4">Explore RiNo & Five Points</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/denver/rino" className="inline-flex items-center px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-sm font-medium hover:border-denver-amber hover:text-denver-amber transition-colors">RiNo guide</Link>
          <Link href="/denver/rino/restaurants" className="inline-flex items-center px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-sm font-medium hover:border-denver-amber hover:text-denver-amber transition-colors">RiNo restaurants</Link>
          <Link href="/denver/five-points" className="inline-flex items-center px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-sm font-medium hover:border-denver-amber hover:text-denver-amber transition-colors">Five Points</Link>
          <Link href="/hotels/near-coors-field" className="inline-flex items-center px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-sm font-medium hover:border-denver-amber hover:text-denver-amber transition-colors">Hotels near Coors Field</Link>
        </div>
      </section>

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

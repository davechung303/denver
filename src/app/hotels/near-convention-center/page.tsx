import type { Metadata } from "next";
import Link from "next/link";
import { getPlaces, isRealHotel } from "@/lib/places";
import VenueHotelCard from "@/components/VenueHotelCard";
import { expediaDenverHotelsUrl } from "@/lib/travelpayouts";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Hotels Near Colorado Convention Center Denver — Best Conference Hotel Options | Dave Loves Denver",
  description:
    "The local's guide to hotels near the Colorado Convention Center in downtown Denver — the connected Hyatt Regency, Marriott-family options, plus the best luxury, budget, and walkable picks for conferences.",
  alternates: { canonical: "https://davelovesdenver.com/hotels/near-convention-center" },
  openGraph: {
    title: "Hotels Near Colorado Convention Center Denver",
    description: "Walkable downtown Denver hotels for conventions and conferences at the Colorado Convention Center.",
    url: "https://davelovesdenver.com/hotels/near-convention-center",
  },
};

const FAQS = [
  {
    q: "What hotels are attached to or adjacent to the Colorado Convention Center?",
    a: "The Hyatt Regency Denver at Colorado Convention Center is directly connected via skywalk — the most convenient option for attendees. The Sheraton Denver Downtown and the Westin Denver Downtown are also within a few blocks.",
  },
  {
    q: "How far is the Colorado Convention Center from Union Station?",
    a: "About a 10–15 minute walk west along 16th Street Mall. The free 16th Street Mall shuttle runs right past, making it an easy connection between the convention center and Union Station hotels or the train station.",
  },
  {
    q: "Is there parking near the Colorado Convention Center?",
    a: "Yes — several parking garages are within a block, including the convention center's own garage. Daily rates during large conventions can be high; rideshare from a nearby hotel often makes more sense.",
  },
  {
    q: "What is there to do near the Colorado Convention Center after hours?",
    a: "You're in downtown Denver, so the options are good. Larimer Square is a 5-minute walk and has some of Denver's best restaurants. The Golden Triangle neighborhood is directly south with great museum access — Denver Art Museum, Clyfford Still, and History Colorado are all walking distance.",
  },
  {
    q: "Is the Colorado Convention Center easy to reach from Denver Airport?",
    a: "Yes — the A-Line commuter train runs from DEN directly to Union Station in about 37 minutes for a flat $10.50. From Union Station, it's a 15-minute walk or a $10 Uber to the convention center.",
  },
  {
    q: "Are there Marriott hotels near the Colorado Convention Center?",
    a: "Yes — several Marriott-family hotels are within a few blocks, including the Sheraton Denver Downtown and the Westin Denver Downtown, plus other Marriott brands along the 16th Street corridor. The Hyatt Regency is the Hyatt option and the only one connected to the center directly. Brand-loyalty travelers have strong choices in every flag downtown.",
  },
  {
    q: "Are there cheap hotels near the Colorado Convention Center?",
    a: "The best value is the Golden Triangle just south or a step out from the 16th Street core, both a short walk or free mall-shuttle ride to the center. Rates spike downtown during large conventions, so booking early — before your event's room block fills — is where the savings are.",
  },
  {
    q: "What is the Colorado Convention Center's address?",
    a: "The Colorado Convention Center is at 700 14th Street, Denver, CO 80202, in the heart of downtown. The Big Blue Bear (I See What You Mean) sculpture peering into the windows on 14th Street is the easiest landmark to find the main entrance.",
  },
];


export default async function HotelsNearConventionCenterPage() {
  const [downtownPl, goldenPl] = await Promise.all([
    getPlaces("downtown", "hotels"),
    getPlaces("golden-triangle", "hotels"),
  ]);
  const hotels = [...downtownPl, ...goldenPl]
    .filter(isRealHotel)
    .filter((p) => p.rating != null)
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, 6);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
        { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://davelovesdenver.com" },
          { "@type": "ListItem", position: 2, name: "Hotels Near Convention Center", item: "https://davelovesdenver.com/hotels/near-convention-center" },
        ]},
        { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQS.map((f) => ({
          "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a },
        }))},
        { "@context": "https://schema.org", "@type": "WebPage",
          name: "Hotels Near Colorado Convention Center Denver",
          description: "The local's guide to hotels near the Colorado Convention Center in downtown Denver — the connected Hyatt Regency, Marriott-family options, plus the best luxury, budget, and walkable picks for conferences.",
          url: "https://davelovesdenver.com/hotels/near-convention-center",
          speakableSpecification: { "@type": "SpeakableSpecification", cssSelector: ["[data-speakable]"] },
        },
      ])}} />

      <section className="bg-denver-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <nav className="flex items-center gap-2 text-sm text-white/50 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white/80">Hotels Near Convention Center</span>
          </nav>
          <p className="text-denver-amber text-sm font-semibold uppercase tracking-widest mb-3">Downtown Denver</p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight" data-speakable>Hotels Near Colorado Convention Center</h1>
          <p className="mt-4 text-lg text-white/70 max-w-2xl" data-speakable>
            The Colorado Convention Center is right in the heart of downtown Denver, surrounded by good hotels and an easy walk to Larimer Square, the Golden Triangle museums, and everything LoDo has to offer.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-100 dark:border-slate-800">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Your Options</h2>
            <div>
              <h3 className="font-bold mb-1">Convention Center Adjacent (best for attendees)</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">The Hyatt Regency Denver connects directly to the convention center via skywalk — the most convenient option when you&apos;re spending a full day in meetings. Worth the premium for multi-day conferences.</p>
            </div>
            <div>
              <h3 className="font-bold mb-1">Golden Triangle (1–3 min walk)</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Directly south of the convention center, the Golden Triangle has quieter hotels with good value and museum access. A few blocks puts you at the Denver Art Museum, Clyfford Still, and History Colorado. Good option if you want something to do after conference hours.</p>
            </div>
            <div>
              <h3 className="font-bold mb-1">LoDo &amp; Union Station (10–15 min walk)</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">The 16th Street Mall shuttle connects LoDo hotels to the convention center area quickly. If you want access to Denver&apos;s best bars and restaurants on evenings off, LoDo is the right choice.</p>
            </div>
            <blockquote className="border-l-4 border-denver-amber pl-4 text-slate-600 dark:text-slate-400 text-sm leading-relaxed italic">
              &ldquo;The convention center is genuinely well-located. You&apos;re ten minutes from everything good in downtown Denver on foot. Skip the hotel restaurants after your sessions — Larimer Square and the Golden Triangle have far better options within walking distance.&rdquo;
              <footer className="mt-1 text-xs not-italic text-slate-400">— Dave</footer>
            </blockquote>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Downtown &amp; Golden Triangle Hotels</p>
            {hotels.map((hotel) => <VenueHotelCard key={hotel.place_id} place={hotel} />)}
            <a href={expediaDenverHotelsUrl("Downtown Denver Convention Center")} target="_blank" rel="noopener noreferrer"
              className="mt-2 inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-denver-amber hover:bg-amber-500 text-white text-sm font-semibold rounded-full transition-colors"
            >
              See all nearby hotels &rarr;
            </a>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-2xl font-bold mb-6">Best Hotels Near the Convention Center for Every Trip</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <a href={expediaDenverHotelsUrl()} target="_blank" rel="noopener noreferrer sponsored" className="block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:border-denver-amber transition-colors">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Best for attendees</p>
            <h3 className="font-bold mb-2">Hyatt Regency (connected)</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">The only hotel joined to the center by skywalk — room to session without stepping outside. Worth the premium for a full multi-day conference.</p>
          </a>
          <a href={expediaDenverHotelsUrl()} target="_blank" rel="noopener noreferrer sponsored" className="block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:border-denver-amber transition-colors">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Best on a budget</p>
            <h3 className="font-bold mb-2">Golden Triangle</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Quieter hotels a few blocks south at better value, with the Art Museum and History Colorado on your doorstep for downtime. A short walk or mall-shuttle ride to the center.</p>
          </a>
          <a href={expediaDenverHotelsUrl()} target="_blank" rel="noopener noreferrer sponsored" className="block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:border-denver-amber transition-colors">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Best luxury &amp; brand-name</p>
            <h3 className="font-bold mb-2">Sheraton, Westin &amp; LoDo</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Full-service Marriott-family flags like the Sheraton and Westin sit within a few blocks, with the best dining and nightlife toward Larimer Square and LoDo for evenings off.</p>
          </a>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-bold mb-6">Conference Tips</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { title: "A-Line from the Airport", body: "Skip the $60 Uber from DEN. The A-Line commuter train runs directly to Union Station in 37 minutes for $10.50. From there it's a short walk or rideshare to any downtown hotel." },
            { title: "16th Street Mall Shuttle", body: "The free 16th Street Mall shuttle runs the length of downtown and connects the convention center area to LoDo, Union Station, and all the hotel clusters in between. Runs frequently all day." },
            { title: "Dinner Beyond the Hotel", body: "Convention center hotel restaurants are priced for expense accounts. Larimer Square is a 5-minute walk and has Denver's best dining concentration. Same for the Golden Triangle to the south." },
          ].map((tip) => (
            <div key={tip.title} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
              <h3 className="font-bold mb-2">{tip.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{tip.body}</p>
            </div>
          ))}
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
          <Link href="/hotels/near-ball-arena" className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber text-sm font-semibold rounded-full transition-colors">
            Hotels near Ball Arena &rarr;
          </Link>
          <Link href="/hotels/near-coors-field" className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber text-sm font-semibold rounded-full transition-colors">
            Hotels near Coors Field &rarr;
          </Link>
          <Link href="/hotels/near-denver-airport" className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber text-sm font-semibold rounded-full transition-colors">
            Hotels near Denver Airport &rarr;
          </Link>
        </div>
      </section>
    </>
  );
}

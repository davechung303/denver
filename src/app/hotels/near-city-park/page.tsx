import type { Metadata } from "next";
import Link from "next/link";
import { getPlaces, isRealHotel } from "@/lib/places";
import VenueHotelCard from "@/components/VenueHotelCard";
import { expediaDenverHotelsUrl } from "@/lib/travelpayouts";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Hotels Near City Park Denver — Best Places to Stay for the Zoo & Museum | Dave Loves Denver",
  description:
    "The local's guide to hotels near City Park in Denver — the best walkable picks for the Denver Zoo and museum, plus budget options and where the Catbird design hotel fits in.",
  alternates: { canonical: "https://davelovesdenver.com/hotels/near-city-park" },
  openGraph: {
    title: "Hotels Near City Park Denver",
    description: "Where to stay near Denver Zoo, the Museum of Nature & Science, and City Park.",
    url: "https://davelovesdenver.com/hotels/near-city-park",
  },
};

const FAQS = [
  {
    q: "What is there to do at City Park Denver?",
    a: "City Park is Denver's largest urban park and home to the Denver Zoo, the Denver Museum of Nature & Science, Ferril Lake, and City Park Jazz (free summer concerts on Sundays). It's one of the best urban parks in the country.",
  },
  {
    q: "What neighborhoods are closest to City Park?",
    a: "City Park is bordered by Uptown to the west, City Park West to the southwest, Congress Park to the south, and Park Hill to the east. Hotels in Uptown and Congress Park put you closest to the park's main attractions.",
  },
  {
    q: "Is City Park walkable from downtown Denver?",
    a: "It's about 1.5 miles east of downtown — walkable in good weather (30 minutes), but most people Uber. Uptown hotels cut that down significantly.",
  },
  {
    q: "When is City Park Jazz?",
    a: "City Park Jazz runs on Sunday afternoons in summer — typically June through August. It's free, family-friendly, and one of the best recurring events in Denver. Bring a blanket and something from a nearby food truck.",
  },
  {
    q: "Is Denver Zoo worth visiting?",
    a: "Yes — it's one of the better zoos in the country and significantly more engaging than the average city zoo. Allow 3–4 hours. Early morning on weekdays has the best crowd situation.",
  },
  {
    q: "What are the best hotels near City Park?",
    a: "Uptown is the best base — closest to the park's west entrance, walkable to the zoo and museum, and lined with 17th Avenue restaurants. For a design-forward stay, the Catbird in nearby RiNo is a popular apartment-style hotel a short ride away. Downtown works too if City Park is one stop on a bigger Denver trip.",
  },
  {
    q: "Are there cheap hotels near City Park?",
    a: "Capitol Hill, just south, has the most budget-friendly and boutique options within 10–15 minutes of the park. Weekdays beat weekends, and staying a neighborhood out from LoDo generally undercuts downtown rates while keeping you close to the zoo.",
  },
];


export default async function HotelsNearCityParkPage() {
  const [uptownPl, downtownPl] = await Promise.all([
    getPlaces("uptown", "hotels"),
    getPlaces("downtown", "hotels"),
  ]);
  const hotels = [...uptownPl, ...downtownPl]
    .filter(isRealHotel)
    .filter((p) => p.rating != null)
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, 6);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
        { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://davelovesdenver.com" },
          { "@type": "ListItem", position: 2, name: "Hotels Near City Park", item: "https://davelovesdenver.com/hotels/near-city-park" },
        ]},
        { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQS.map((f) => ({
          "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a },
        }))},
        { "@context": "https://schema.org", "@type": "WebPage",
          name: "Hotels Near City Park Denver",
          description: "The local's guide to hotels near City Park in Denver — the best walkable picks for the Denver Zoo and museum, plus budget options and where the Catbird design hotel fits in.",
          url: "https://davelovesdenver.com/hotels/near-city-park",
          speakableSpecification: { "@type": "SpeakableSpecification", cssSelector: ["[data-speakable]"] },
        },
      ])}} />

      <section className="bg-denver-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <nav className="flex items-center gap-2 text-sm text-white/50 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white/80">Hotels Near City Park</span>
          </nav>
          <p className="text-denver-amber text-sm font-semibold uppercase tracking-widest mb-3">Denver, Colorado</p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight" data-speakable>Hotels Near City Park Denver</h1>
          <p className="mt-4 text-lg text-white/70 max-w-2xl" data-speakable>
            City Park is home to the Denver Zoo, the Museum of Nature &amp; Science, and some of the best skyline views in the city. Here&apos;s where to stay to make the most of it.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-100 dark:border-slate-800">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Your Options</h2>
            <div>
              <h3 className="font-bold mb-1">Uptown (closest, walkable to the park)</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Uptown is the best base for City Park access. You&apos;re walking distance to the park&apos;s west entrance, and 17th Avenue has some of Denver&apos;s best mid-range restaurants. It&apos;s also close enough to downtown that you can Uber if you need to.</p>
            </div>
            <div>
              <h3 className="font-bold mb-1">Congress Park (south of the park)</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Just south of City Park, Congress Park is a quiet residential neighborhood with some B&B and smaller hotel options. Close to the Botanic Gardens as well.</p>
            </div>
            <div>
              <h3 className="font-bold mb-1">Downtown (1.5 miles, Uber-convenient)</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">More hotel options at every price point, with a short rideshare to City Park. If you want central access to all of Denver and City Park is one of several activities, downtown is the practical choice.</p>
            </div>
            <blockquote className="border-l-4 border-denver-amber pl-4 text-slate-600 dark:text-slate-400 text-sm leading-relaxed italic">
              &ldquo;City Park is one of those places that makes Denver feel like a real city. The museum sits on a hill with mountain views on a clear day, and City Park Jazz on a summer Sunday is as good as Denver gets. Stay in Uptown — 17th Avenue is genuinely underrated.&rdquo;
              <footer className="mt-1 text-xs not-italic text-slate-400">— Dave</footer>
            </blockquote>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Uptown &amp; Downtown Hotels</p>
            {hotels.map((hotel) => <VenueHotelCard key={hotel.place_id} place={hotel} />)}
            <a href={expediaDenverHotelsUrl("Uptown Denver City Park")} target="_blank" rel="noopener noreferrer"
              className="mt-2 inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-denver-amber hover:bg-amber-500 text-white text-sm font-semibold rounded-full transition-colors"
            >
              See all nearby hotels &rarr;
            </a>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-2xl font-bold mb-6">Best Hotels Near City Park for Every Trip</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Best for the zoo &amp; museum</p>
            <h3 className="font-bold mb-2">Uptown</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Closest walkable base, right by the park&apos;s west entrance, with 17th Avenue dining. The simplest choice for a day at the zoo and the Museum of Nature &amp; Science.</p>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Best on a budget</p>
            <h3 className="font-bold mb-2">Capitol Hill</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">The most budget-friendly and boutique options within 10–15 minutes of the park. Weekdays beat weekends, and you&apos;re still close to City Park and downtown.</p>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Best design stay</p>
            <h3 className="font-bold mb-2">Catbird, RiNo</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">A short ride northwest, the Catbird is an apartment-style design hotel with a rooftop — a fun base if you want to pair the zoo with RiNo&apos;s food and brewery scene.</p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-bold mb-6">City Park Tips</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { title: "Denver Zoo: Go Early", body: "The Denver Zoo is significantly better in the first two hours after opening. Crowds build by midday, especially on weekends. Early morning is also when the animals are most active." },
            { title: "City Park Jazz: Free Sundays", body: "From June through August, City Park Jazz runs Sunday afternoons 3–5pm. It's free, family-friendly, and one of the best recurring events in Denver. Bring a blanket and arrive early for a good spot." },
            { title: "DMNS on Clear Days", body: "The Denver Museum of Nature & Science sits on a hill in City Park. On clear days, the view of the Rockies from the east steps of the museum is one of the best in Denver. Worth walking up even if you're not going in." },
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
          <Link href="/hotels/near-botanic-gardens" className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber text-sm font-semibold rounded-full transition-colors">
            Hotels near Botanic Gardens &rarr;
          </Link>
          <Link href="/hotels/near-cherry-creek" className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber text-sm font-semibold rounded-full transition-colors">
            Hotels near Cherry Creek &rarr;
          </Link>
          <Link href="/hotels/near-convention-center" className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber text-sm font-semibold rounded-full transition-colors">
            Hotels near Convention Center &rarr;
          </Link>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { getEventsForVenue } from "@/lib/ticketmaster";
import { ticketmasterAffiliateUrl } from "@/lib/travelpayouts";
import EventCard from "@/components/EventCard";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Fiddler's Green Amphitheatre Events & Concert Schedule 2026 | Dave Loves Denver",
  description:
    "Full schedule of upcoming concerts and shows at Fiddler's Green Amphitheatre in Greenwood Village. Browse events, buy tickets, and find nearby hotels.",
  alternates: { canonical: "https://davelovesdenver.com/events/fiddlers-green" },
  openGraph: {
    title: "Fiddler's Green Amphitheatre Events & Concert Schedule 2026",
    description: "Upcoming shows at Fiddler's Green — full schedule and tickets.",
    url: "https://davelovesdenver.com/events/fiddlers-green",
  },
};

const FAQS = [
  {
    q: "What kind of acts play Fiddler's Green?",
    a: "Fiddler's Green hosts major touring acts in the 10,000–18,000 range — too big for Mission Ballroom, not quite stadium scale. Dave Matthews Band, Phish, Kenny Chesney, country tours, and summer amphitheater staples play here regularly. The outdoor summer season is the main draw.",
  },
  {
    q: "Is Fiddler's Green lawn or reserved seating?",
    a: "Both. The covered pavilion has assigned seating; the lawn behind is general admission and can be one of the better ways to experience an amphitheater show. Bring a blanket if the evening gets cool — Colorado nights drop fast.",
  },
  {
    q: "How do I get to Fiddler's Green from Denver?",
    a: "It's about 15 miles south of downtown on I-25. Budget 30–45 minutes each way on show nights — southbound I-25 backs up before big shows. Rideshare works but surges hard post-show. A designated driver or pre-booked car service removes the problem.",
  },
  {
    q: "Is there parking at Fiddler's Green?",
    a: "Ample on-site parking is available. Arrive early — the lots fill up and traffic backs up on the access roads before major shows. Pre-paid parking passes are available and worth it.",
  },
  {
    q: "What's near Fiddler's Green for dinner?",
    a: "The Denver Tech Center area has chain restaurants but not much character. For a proper pre-show dinner, Cherry Creek is 15 minutes north with significantly better options. Some people drive into the city, eat, and then head south to the show.",
  },
];

export default async function EventsFiddlersGreenPage() {
  const events = await getEventsForVenue("Fiddler", 20);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
        { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://davelovesdenver.com" },
          { "@type": "ListItem", position: 2, name: "Events", item: "https://davelovesdenver.com/events" },
          { "@type": "ListItem", position: 3, name: "Fiddler's Green", item: "https://davelovesdenver.com/events/fiddlers-green" },
        ]},
        { "@context": "https://schema.org", "@type": "WebPage",
          name: "Fiddler's Green Amphitheatre Events & Concert Schedule 2026",
          description: "Full schedule of upcoming concerts and shows at Fiddler's Green Amphitheatre in Greenwood Village.",
          url: "https://davelovesdenver.com/events/fiddlers-green",
          speakableSpecification: { "@type": "SpeakableSpecification", cssSelector: ["[data-speakable]"] },
        },
        { "@context": "https://schema.org", "@type": "MusicVenue",
          name: "Fiddler's Green Amphitheatre",
          address: { "@type": "PostalAddress", streetAddress: "6350 Greenwood Plaza Blvd", addressLocality: "Greenwood Village", addressRegion: "CO", postalCode: "80111" },
        },
        { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQS.map((f) => ({
          "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a },
        }))},
        ...events.map((e) => ({
          "@context": "https://schema.org", "@type": "Event",
          name: e.name, startDate: e.start_time,
          location: { "@type": "Place", name: "Fiddler's Green Amphitheatre", address: "6350 Greenwood Plaza Blvd, Greenwood Village, CO 80111" },
          ...(e.image_url ? { image: e.image_url } : {}),
          url: e.url,
          eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
          eventStatus: "https://schema.org/EventScheduled",
        })),
      ])}} />

      <section className="bg-denver-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <nav className="flex items-center gap-2 text-sm text-white/50 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/events" className="hover:text-white transition-colors">Events</Link>
            <span>/</span>
            <span className="text-white/80">Fiddler&apos;s Green</span>
          </nav>
          <p className="text-denver-amber text-sm font-semibold uppercase tracking-widest mb-3">Greenwood Village, Colorado</p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight" data-speakable>Upcoming Shows at Fiddler&apos;s Green Amphitheatre</h1>
          <p className="mt-4 text-lg text-white/70 max-w-2xl" data-speakable>
            Denver&apos;s mid-size outdoor amphitheater — 18,000 capacity, summer season, major touring acts. The lawn experience here is hard to beat on a Colorado evening.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h2 className="text-xl font-bold">{events.length > 0 ? `${events.length} Upcoming Shows` : "Upcoming Shows"}</h2>
          <a href={ticketmasterAffiliateUrl("https://www.ticketmaster.com/search?q=fiddlers+green+amphitheatre")} target="_blank" rel="noopener noreferrer"
            className="text-sm text-denver-amber font-semibold hover:underline">All shows on Ticketmaster &rarr;</a>
        </div>
        {events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event) => <EventCard key={event.event_id} event={event} />)}
          </div>
        ) : (
          <div className="py-12 text-center text-slate-500">
            <p className="text-lg font-medium mb-2">No upcoming events found right now.</p>
            <a href={ticketmasterAffiliateUrl("https://www.ticketmaster.com/search?q=fiddlers+green+amphitheatre")} target="_blank" rel="noopener noreferrer"
              className="text-denver-amber font-semibold hover:underline text-sm">Check Ticketmaster for the full schedule &rarr;</a>
          </div>
        )}
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-100 dark:border-slate-800">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">About Fiddler&apos;s Green</h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Fiddler&apos;s Green Amphitheatre sits in the Denver Tech Center area of Greenwood Village, about 15 miles south of downtown. The 18,000-capacity venue operates a summer concert season running May through September, hosting the kind of major tours that are too big for Mission Ballroom but can&apos;t fill a stadium.</p>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">The covered pavilion holds around 7,500 in assigned seats; the lawn behind it takes another 10,500. Lawn tickets are often significantly cheaper and the experience on a clear Colorado evening is excellent.</p>
            <blockquote className="border-l-4 border-denver-amber pl-4 text-slate-600 dark:text-slate-400 text-sm leading-relaxed italic" data-speakable>
              &ldquo;Fiddler&apos;s Green lawn on a summer evening is underrated. The venue is surrounded by office parks so the neighborhood context is minimal, but the show itself — blanket on the lawn, Colorado sky, good act — is a solid night out.&rdquo;
              <footer className="mt-1 text-xs not-italic text-slate-400">— Dave</footer>
            </blockquote>
          </div>
          <div className="grid grid-cols-2 gap-4 content-start">
            {[
              { label: "Capacity", value: "18,000" },
              { label: "Season", value: "May–Sept" },
              { label: "Location", value: "Greenwood Village" },
              { label: "From Downtown", value: "30 min" },
            ].map((stat) => (
              <div key={stat.label} className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-5">
                <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-xl font-bold leading-tight">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-100 dark:border-slate-800">
        <div className="bg-denver-navy text-white rounded-2xl p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h2 className="text-xl font-bold mb-2">Staying for the show?</h2>
            <p className="text-white/70 text-sm max-w-md">DTC hotels put you minutes away. We cover the closest options and whether it&apos;s worth staying downtown instead.</p>
          </div>
          <Link href="/hotels/near-fiddlers-green"
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-denver-amber hover:bg-amber-500 text-white font-semibold rounded-full transition-colors text-sm">
            Hotels near Fiddler&apos;s Green &rarr;
          </Link>
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
          <Link href="/hotels/near-fiddlers-green" className="inline-flex items-center gap-2 px-5 py-2.5 bg-denver-navy hover:bg-denver-navy/90 text-white text-sm font-semibold rounded-full transition-colors">Hotels near Fiddler&apos;s Green &rarr;</Link>
          <Link href="/events/red-rocks" className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber text-sm font-semibold rounded-full transition-colors">Red Rocks shows &rarr;</Link>
          <Link href="/events/mission-ballroom" className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber text-sm font-semibold rounded-full transition-colors">Mission Ballroom shows &rarr;</Link>
          <Link href="/events/ball-arena" className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 hover:border-denver-amber hover:text-denver-amber text-sm font-semibold rounded-full transition-colors">Ball Arena events &rarr;</Link>
        </div>
      </section>
    </>
  );
}

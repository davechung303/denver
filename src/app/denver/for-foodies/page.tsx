import type { Metadata } from "next";
import Link from "next/link";
import { NEIGHBORHOODS } from "@/lib/neighborhoods";
import { getBestOfDenver, isRealRestaurant, photoUrl, type Place } from "@/lib/places";
import SchemaMarkup from "@/components/SchemaMarkup";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Denver for Foodies — The Ultimate Food Guide to Denver, CO",
  description:
    "The definitive Denver food guide: best restaurants by neighborhood, top coffee shops, hidden gem eats, and the neighborhoods serious food people actually know.",
  openGraph: {
    title: "Denver for Foodies — The Ultimate Food Guide",
    description: "Best restaurants, coffee, and food neighborhoods in Denver — from someone who actually lives here.",
    url: "https://davelovesdenver.com/denver/for-foodies",
    images: [{ url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80", width: 1200, height: 630 }],
  },
  alternates: { canonical: "https://davelovesdenver.com/denver/for-foodies" },
};

const FOOD_NEIGHBORHOODS = ["rino", "highlands", "cherry-creek", "baker", "uptown", "platt-park"];

// eslint-disable-next-line @next/next/no-img-element
function PlacePhoto({ place, className }: { place: Place; className?: string }) {
  const photo = place.photos?.[0];
  if (!photo) return <div className={`bg-slate-100 dark:bg-slate-800 ${className}`} />;
  return <img src={photoUrl(photo.name, 600, 400)} alt={place.name} className={`object-cover ${className}`} loading="lazy" />;
}

function RatingBadge({ place }: { place: Place }) {
  if (!place.rating) return null;
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-500">
      ★ {place.rating.toFixed(1)}
      {place.review_count && <span className="text-slate-400 font-normal">({place.review_count.toLocaleString()})</span>}
    </span>
  );
}

function NeighborhoodChip({ slug }: { slug: string }) {
  const n = NEIGHBORHOODS.find((n) => n.slug === slug);
  if (!n) return null;
  return <span className="text-xs font-medium text-denver-amber">{n.name}</span>;
}

function RestaurantCard({ place }: { place: Place }) {
  const href = `/denver/${place.neighborhood_slug}/${place.category_slug}/${place.slug}`;
  return (
    <a href={href} className="group flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:border-denver-amber hover:shadow-xl transition-all duration-200">
      <div className="relative aspect-[16/9] overflow-hidden bg-slate-100 dark:bg-slate-800">
        <PlacePhoto place={place} className="w-full h-full group-hover:scale-105 transition-transform duration-300" />
      </div>
      <div className="p-5 flex flex-col gap-2 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <NeighborhoodChip slug={place.neighborhood_slug} />
          {place.price_level != null && place.price_level > 0 && <span className="text-xs text-slate-400">{"$".repeat(place.price_level)}</span>}
        </div>
        <h3 className="font-bold text-base leading-snug group-hover:text-denver-amber transition-colors">{place.name}</h3>
        <RatingBadge place={place} />
        {place.review_summary?.tagline && <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{place.review_summary.tagline.charAt(0).toUpperCase() + place.review_summary.tagline.slice(1)}</p>}
      </div>
    </a>
  );
}

function CoffeeCard({ place }: { place: Place }) {
  const href = `/denver/${place.neighborhood_slug}/${place.category_slug}/${place.slug}`;
  return (
    <a href={href} className="group flex gap-3 items-start bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 hover:border-denver-amber hover:shadow-md transition-all duration-200">
      <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800">
        <PlacePhoto place={place} className="w-full h-full" />
      </div>
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <NeighborhoodChip slug={place.neighborhood_slug} />
        <h3 className="font-semibold text-sm leading-snug group-hover:text-denver-amber transition-colors line-clamp-2">{place.name}</h3>
        <RatingBadge place={place} />
        {place.review_summary?.tagline && <p className="text-xs text-slate-400 line-clamp-2">{place.review_summary.tagline.charAt(0).toUpperCase() + place.review_summary.tagline.slice(1)}</p>}
      </div>
    </a>
  );
}

const FAQS = [
  {
    question: "What is the best neighborhood for food in Denver?",
    answer: "RiNo (River North) and Highlands/LoHi are Denver's strongest food neighborhoods, with the highest concentration of top-rated restaurants per block. Cherry Creek is the best for upscale dining, Baker (South Broadway) for casual spots with personality, and Uptown's 17th Avenue corridor is one of the most underrated dining streets in the city.",
  },
  {
    question: "What food is Denver known for?",
    answer: "Denver is known for Colorado-raised beef, green chile (a regional staple), Rocky Mountain cuisine, and a fast-growing farm-to-table scene. The city also has one of the best craft brewery ecosystems in the country, and neighborhoods like Aurora have exceptional ethnic food — Vietnamese, Korean, Ethiopian, and Salvadoran — that most visitors never find.",
  },
  {
    question: "Does Denver have good restaurants?",
    answer: "Yes — Denver's restaurant scene has matured significantly in the past decade. The city has James Beard-nominated chefs, a strong farm-to-table foundation, and neighborhood spots that would hold up in any food city. Sushi Den, Comal Heritage Food Incubator, Morin, and Work & Class are good examples of the range. The food press hasn't fully caught up with how good Denver actually is.",
  },
  {
    question: "Where do locals eat in Denver?",
    answer: "Locals tend to eat in Uptown (17th Avenue), Platt Park (South Pearl Street), Baker (South Broadway), and Sloan Lake/Edgewater — neighborhoods that don't show up on tourist lists but have great owner-operated spots. RiNo and Highlands are known to locals too, but those are also on every visitor's radar. The suburbs, especially Aurora and Lakewood, are where locals go for the best ethnic food in the metro.",
  },
];

export default async function ForFoodiesPage() {
  const [rawRestaurants, coffee] = await Promise.all([
    getBestOfDenver("restaurants", 100, { minReviews: 50, minRating: 4.3 }).then((r) => r.filter(isRealRestaurant)),
    getBestOfDenver("coffee", 8, { requireTypes: ["coffee_shop", "cafe", "coffee_roastery"] }),
  ]);
  const topRestaurants = rawRestaurants.slice(0, 8);
  const foodNeighborhoods = FOOD_NEIGHBORHOODS.map((slug) => NEIGHBORHOODS.find((n) => n.slug === slug)).filter(Boolean) as typeof NEIGHBORHOODS;

  return (
    <>
      <SchemaMarkup
        breadcrumbs={[
          { name: "Home", url: "https://davelovesdenver.com" },
          { name: "Best of Denver", url: "https://davelovesdenver.com/denver" },
          { name: "For Foodies", url: "https://davelovesdenver.com/denver/for-foodies" },
        ]}
        itemLists={[{
          name: "Best Restaurants in Denver for Foodies",
          description: "The top-rated restaurants in Denver, curated for serious food lovers.",
          items: topRestaurants.map((p) => ({ name: p.name, url: `/denver/${p.neighborhood_slug}/${p.category_slug}/${p.slug}` })),
        }]}
        faqs={FAQS}
      />

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <ol className="flex items-center gap-2 text-sm text-slate-500">
          <li><Link href="/" className="hover:text-foreground transition-colors">Home</Link></li>
          <li>/</li>
          <li><Link href="/denver" className="hover:text-foreground transition-colors">Best of Denver</Link></li>
          <li>/</li>
          <li className="text-foreground font-medium">For Foodies</li>
        </ol>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <p className="text-denver-amber text-sm font-semibold uppercase tracking-widest mb-3">A food lover&apos;s guide</p>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight max-w-2xl">Denver for Foodies</h1>
        <p className="mt-4 text-slate-500 dark:text-slate-400 text-lg max-w-2xl leading-relaxed">
          Denver&apos;s food scene has been quietly getting better for a decade and still doesn&apos;t get enough credit. From James Beard-level cooking in RiNo to the best green chile you&apos;ve ever had at a no-name spot in the suburbs — here&apos;s what serious food people actually need to know.
        </p>
        {/* Quick nav */}
        <div className="mt-8 flex flex-wrap gap-2">
          {[
            { href: "#restaurants", label: "Top Restaurants" },
            { href: "#neighborhoods", label: "Food Neighborhoods" },
            { href: "#coffee", label: "Best Coffee" },
            { href: "#hidden-gems", label: "Hidden Gems" },
          ].map((link) => (
            <a key={link.href} href={link.href} className="px-3 py-1 text-sm font-medium border border-slate-200 dark:border-slate-700 rounded-full hover:border-denver-amber hover:text-denver-amber transition-colors">
              {link.label}
            </a>
          ))}
        </div>
      </section>

      {/* Top Restaurants */}
      {topRestaurants.length > 0 && (
        <section id="restaurants" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Top Restaurants in Denver</h2>
              <p className="mt-1 text-slate-500 dark:text-slate-400 text-sm">Ranked by rating and review count — the places with both quality and proof.</p>
            </div>
            <Link href="/denver/best-restaurants" className="hidden sm:inline-flex text-sm font-semibold text-denver-amber hover:underline shrink-0 ml-4">
              See all {rawRestaurants.length} &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {topRestaurants.map((place) => <RestaurantCard key={place.place_id} place={place} />)}
          </div>
          <div className="mt-6 sm:hidden">
            <Link href="/denver/best-restaurants" className="text-sm font-semibold text-denver-amber hover:underline">
              See all {rawRestaurants.length} restaurants &rarr;
            </Link>
          </div>
        </section>
      )}

      {/* Food Neighborhoods */}
      <section id="neighborhoods" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Best Neighborhoods for Food</h2>
          <p className="mt-1 text-slate-500 dark:text-slate-400 text-sm">The Denver neighborhoods with the strongest restaurant scenes.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {foodNeighborhoods.map((n) => (
            <Link key={n.slug} href={`/denver/${n.slug}/restaurants`} className="group relative overflow-hidden rounded-2xl aspect-video flex items-end p-5 hover:scale-[1.02] transition-transform duration-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={n.image} alt={n.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
              <div className="relative z-10 text-white">
                <p className="text-xs text-white/70 mb-0.5">{n.tagline}</p>
                <h3 className="font-bold text-lg leading-tight">{n.name}</h3>
                <p className="text-xs text-denver-amber font-semibold mt-1 group-hover:underline">Best restaurants &rarr;</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Coffee */}
      {coffee.length > 0 && (
        <section id="coffee" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Best Coffee in Denver</h2>
              <p className="mt-1 text-slate-500 dark:text-slate-400 text-sm">Denver takes its coffee seriously. These are the spots worth going out of your way for.</p>
            </div>
            <Link href="/denver/best-coffee" className="hidden sm:inline-flex text-sm font-semibold text-denver-amber hover:underline shrink-0 ml-4">
              See all &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {coffee.map((place) => <CoffeeCard key={place.place_id} place={place} />)}
          </div>
        </section>
      )}

      {/* Hidden Gems CTA */}
      <section id="hidden-gems" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-8 md:p-12">
          <p className="text-denver-amber text-sm font-semibold uppercase tracking-widest mb-3">4.5★+ with under 500 reviews</p>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Hidden Gem Restaurants</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mb-8">
            The places Denver locals know that haven&apos;t blown up yet. High ratings, low review counts, organized by neighborhood so you can find gems wherever you&apos;re headed.
          </p>
          <Link href="/denver/hidden-gems" className="inline-flex items-center gap-2 px-6 py-3 bg-denver-amber text-slate-900 font-bold rounded-xl hover:bg-amber-400 transition-colors">
            Explore hidden gems &rarr;
          </Link>
        </div>
      </section>

      {/* FAQs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <h2 className="text-2xl font-bold mb-8">Denver Food FAQ</h2>
        <div className="space-y-6 max-w-3xl">
          {FAQS.map((faq) => (
            <div key={faq.question} className="border-b border-slate-200 dark:border-slate-800 pb-6">
              <h3 className="font-semibold text-base mb-2">{faq.question}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-denver-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold">Full Denver guide</h2>
            <p className="text-white/70 mt-2 max-w-md">Hotels, bars, things to do, and the complete neighborhood breakdown — everything you need for a Denver trip.</p>
          </div>
          <Link href="/denver" className="shrink-0 px-6 py-3 bg-denver-amber text-slate-900 font-bold rounded-xl hover:bg-amber-400 transition-colors">
            Best of Denver &rarr;
          </Link>
        </div>
      </section>
    </>
  );
}

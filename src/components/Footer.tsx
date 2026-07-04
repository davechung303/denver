import Link from "next/link";

const TOP_NEIGHBORHOODS = [
  { slug: "rino", name: "RiNo" },
  { slug: "lodo", name: "LoDo" },
  { slug: "highlands", name: "Highlands" },
  { slug: "cherry-creek", name: "Cherry Creek" },
  { slug: "capitol-hill", name: "Capitol Hill" },
  { slug: "washington-park", name: "Washington Park" },
  { slug: "baker", name: "Baker" },
  { slug: "five-points", name: "Five Points" },
  { slug: "platt-park", name: "Platt Park" },
  { slug: "sloan-lake", name: "Sloan Lake" },
];

const BEST_OF = [
  { href: "/denver/best-mexican-food", label: "Best Mexican Food" },
  { href: "/denver/best-sushi", label: "Best Sushi" },
  { href: "/denver/best-burgers", label: "Best Burgers" },
  { href: "/denver/best-pizza", label: "Best Pizza" },
  { href: "/denver/best-steakhouses", label: "Best Steakhouses" },
  { href: "/denver/best-coffee", label: "Best Coffee" },
  { href: "/denver/best-bars", label: "Best Bars" },
  { href: "/denver/best-things-to-do", label: "Best Things to Do" },
  { href: "/denver/for-foodies", label: "For Foodies" },
];

const EXPLORE = [
  { href: "/denver", label: "Best of Denver" },
  { href: "/denver/hidden-gems", label: "Hidden Gems" },
  { href: "/denver/where-to-stay", label: "Where to Stay" },
  { href: "/denver/experiences", label: "Experiences" },
  { href: "/articles", label: "Guides & Reviews" },
  { href: "/videos", label: "Videos" },
  { href: "/events", label: "Events" },
  { href: "/about", label: "About Dave" },
];

const VENUE_EVENTS = [
  { href: "/events/red-rocks", label: "Red Rocks" },
  { href: "/events/ball-arena", label: "Ball Arena" },
  { href: "/events/coors-field", label: "Coors Field" },
  { href: "/events/empower-field", label: "Empower Field" },
  { href: "/events/mission-ballroom", label: "Mission Ballroom" },
  { href: "/events/fiddlers-green", label: "Fiddler's Green" },
  { href: "/events/ogden-theatre", label: "Ogden Theatre" },
  { href: "/events/paramount-theatre", label: "Paramount Theatre" },
  { href: "/events/dicks-sporting-goods-park", label: "Dick's Sporting Goods Park" },
];

const HOTEL_GUIDES = [
  { href: "/denver/where-to-stay", label: "Where to Stay in Denver" },
  { href: "/hotels/best-value-denver", label: "Best Value Hotels" },
  { href: "/hotels/near-red-rocks", label: "Near Red Rocks" },
  { href: "/hotels/near-empower-field", label: "Near Empower Field" },
  { href: "/hotels/near-coors-field", label: "Near Coors Field" },
  { href: "/hotels/near-ball-arena", label: "Near Ball Arena" },
  { href: "/hotels/near-mission-ballroom", label: "Near Mission Ballroom" },
  { href: "/hotels/near-fiddlers-green", label: "Near Fiddler's Green" },
  { href: "/hotels/near-convention-center", label: "Near Convention Center" },
  { href: "/hotels/near-denver-airport", label: "Near Denver Airport" },
  { href: "/hotels/near-city-park", label: "Near City Park" },
  { href: "/hotels/near-botanic-gardens", label: "Near Botanic Gardens" },
  { href: "/hotels/near-cherry-creek", label: "Near Cherry Creek" },
  { href: "/hotels/near-denver-zoo", label: "Near Denver Zoo" },
  { href: "/hotels/near-elitch-gardens", label: "Near Elitch Gardens" },
  { href: "/hotels/near-national-western", label: "Near National Western" },
  { href: "/hotels/near-anschutz", label: "Near Anschutz" },
];

export default function Footer() {
  return (
    <footer className="bg-denver-navy text-white/70 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-10">

          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Link href="/" className="text-white font-bold text-lg hover:text-denver-amber transition-colors">
              Dave Loves Denver
            </Link>
            <p className="mt-3 text-sm leading-relaxed max-w-xs">
              A hyperlocal guide to Denver neighborhoods, restaurants, hotels, and things to do — written by a local.
            </p>
            <div className="mt-5 flex gap-4">
              <a href="https://youtube.com/davechung" target="_blank" rel="noopener noreferrer"
                className="text-sm hover:text-white transition-colors flex items-center gap-1.5">
                <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                </svg>
                YouTube
              </a>
            </div>
          </div>

          {/* Neighborhoods */}
          <div className="col-span-1">
            <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">Neighborhoods</p>
            <ul className="space-y-2">
              {TOP_NEIGHBORHOODS.map((n) => (
                <li key={n.slug}>
                  <Link href={`/denver/${n.slug}`} className="text-sm hover:text-white transition-colors">
                    {n.name}
                  </Link>
                </li>
              ))}
              <li className="pt-1">
                <Link href="/denver" className="text-sm text-denver-amber hover:underline font-medium">
                  All neighborhoods →
                </Link>
              </li>
            </ul>
          </div>

          {/* Best Of */}
          <div className="col-span-1">
            <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">Best Of Denver</p>
            <ul className="space-y-2">
              {BEST_OF.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore */}
          <div className="col-span-1">
            <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">Explore</p>
            <ul className="space-y-2">
              {EXPLORE.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Venue Events */}
          <div className="col-span-1">
            <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">Venue Events</p>
            <ul className="space-y-2">
              {VENUE_EVENTS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hotel Guides */}
          <div className="col-span-1">
            <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">Hotel Guides</p>
            <ul className="space-y-2">
              {HOTEL_GUIDES.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            &copy; {new Date().getFullYear()} Dave Loves Denver. All rights reserved.
          </p>
          <p className="text-xs text-white/30">
            Denver, Colorado · davelovesdenver.com
          </p>
        </div>
      </div>
    </footer>
  );
}

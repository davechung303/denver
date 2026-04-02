import Link from "next/link";
import { NEIGHBORHOODS, CATEGORIES } from "@/lib/neighborhoods";

export default function Footer() {
  return (
    <footer className="bg-denver-navy text-white/70 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="text-white font-bold text-lg hover:text-denver-amber transition-colors">
              Dave Loves Denver
            </Link>
            <p className="mt-3 text-sm leading-relaxed">
              A hyperlocal guide to the best neighborhoods, restaurants, hotels, and things to do in Denver, Colorado.
            </p>
            <div className="mt-4 flex gap-3">
              <a
                href="https://youtube.com/davechung"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:text-white transition-colors"
              >
                YouTube
              </a>
            </div>
          </div>

          {/* Neighborhoods */}
          <div>
            <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">Neighborhoods</p>
            <ul className="space-y-2">
              {NEIGHBORHOODS.map((n) => (
                <li key={n.slug}>
                  <Link
                    href={`/denver/${n.slug}`}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {n.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">Explore</p>
            <ul className="space-y-2">
              {CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/denver/rino/${c.slug}`}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Site */}
          <div>
            <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">Site</p>
            <ul className="space-y-2">
              {[
                { href: "/", label: "Home" },
                { href: "/articles", label: "Articles" },
                { href: "/events", label: "Events" },
                { href: "/videos", label: "Videos" },
                { href: "/about", label: "About" },
              ].map((link) => (
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
            davelovesdenver.com
          </p>
        </div>
      </div>
    </footer>
  );
}

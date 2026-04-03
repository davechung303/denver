"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NEIGHBORHOODS } from "@/lib/neighborhoods";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [neighborhoodsOpen, setNeighborhoodsOpen] = useState(false);
  const pathname = usePathname();

  const closeAll = () => {
    setOpen(false);
    setNeighborhoodsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-denver-navy border-b border-white/10">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            onClick={closeAll}
            className="text-white font-bold text-lg tracking-tight hover:text-denver-amber transition-colors"
          >
            Dave Loves Denver
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {/* Popular link */}
            <Link
              href="/denver"
              className={`px-4 py-2 text-sm transition-colors rounded-md hover:bg-white/10 ${pathname === "/denver" ? "text-denver-amber font-semibold" : "text-white/80 hover:text-white"}`}
            >
              Popular
            </Link>

            {/* Hidden Gems link */}
            <Link
              href="/denver/hidden-gems"
              className={`px-4 py-2 text-sm transition-colors rounded-md hover:bg-white/10 ${pathname === "/denver/hidden-gems" ? "text-denver-amber font-semibold" : "text-white/80 hover:text-white"}`}
            >
              Hidden Gems
            </Link>

            {/* Experiences link */}
            <Link
              href="/denver/experiences"
              className={`px-4 py-2 text-sm transition-colors rounded-md hover:bg-white/10 ${pathname === "/denver/experiences" ? "text-denver-amber font-semibold" : "text-white/80 hover:text-white"}`}
            >
              Experiences
            </Link>

            {/* Neighborhoods dropdown */}
            <div className="relative">
              <button
                onClick={() => setNeighborhoodsOpen(!neighborhoodsOpen)}
                className="flex items-center gap-1 px-4 py-2 text-sm text-white/80 hover:text-white transition-colors rounded-md hover:bg-white/10"
              >
                Explore Neighborhoods
                <svg
                  className={`w-4 h-4 transition-transform ${neighborhoodsOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {neighborhoodsOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setNeighborhoodsOpen(false)}
                  />
                  <div className="absolute top-full right-0 mt-1 w-[480px] bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-20 p-4">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3 px-1">
                      Denver Neighborhoods
                    </p>
                    <div className="grid grid-cols-2 gap-1">
                      {NEIGHBORHOODS.map((n) => (
                        <Link
                          key={n.slug}
                          href={`/denver/${n.slug}`}
                          onClick={() => setNeighborhoodsOpen(false)}
                          className="flex flex-col px-3 py-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                          <span className="text-sm font-semibold text-slate-900 dark:text-white">{n.name}</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{n.tagline}</span>
                        </Link>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 px-1">
                      <Link
                        href="/#neighborhoods"
                        onClick={() => setNeighborhoodsOpen(false)}
                        className="text-xs font-semibold text-denver-amber hover:underline"
                      >
                        View all neighborhoods &rarr;
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>

            <Link
              href="/events"
              className="px-4 py-2 text-sm text-white/80 hover:text-white transition-colors rounded-md hover:bg-white/10"
            >
              Events
            </Link>

            <Link
              href="/videos"
              className="px-4 py-2 text-sm text-white/80 hover:text-white transition-colors rounded-md hover:bg-white/10"
            >
              Videos
            </Link>

            <Link
              href="/articles"
              className="px-4 py-2 text-sm text-white/80 hover:text-white transition-colors rounded-md hover:bg-white/10"
            >
              Articles
            </Link>

            <Link
              href="/about"
              className="px-4 py-2 text-sm text-white/80 hover:text-white transition-colors rounded-md hover:bg-white/10"
            >
              About
            </Link>

            <div className="w-px h-5 bg-white/20 mx-2" />

            {/* YouTube Subscribe */}
            <a
              href="https://www.youtube.com/davechung"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FF0000] hover:bg-[#cc0000] text-white text-xs font-semibold rounded-full transition-colors"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              Subscribe
            </a>

            {/* TikTok Follow */}
            <a
              href="https://www.tiktok.com/@davelovesdenver"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-full transition-colors border border-white/20"
            >
              <svg className="w-3 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.16 8.16 0 0 0 4.77 1.52V6.77a4.85 4.85 0 0 1-1-.08z"/>
              </svg>
              Follow
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 text-white/80 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {open ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden border-t border-white/10 py-4 space-y-1">
            <Link
              href="/denver"
              onClick={closeAll}
              className="block px-4 py-2.5 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-colors font-semibold"
            >
              Popular
            </Link>
            <Link
              href="/denver/hidden-gems"
              onClick={closeAll}
              className="block px-4 py-2.5 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-colors font-semibold"
            >
              Hidden Gems
            </Link>
            <Link
              href="/denver/experiences"
              onClick={closeAll}
              className="block px-4 py-2.5 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-colors font-semibold"
            >
              Experiences
            </Link>
            <div className="border-b border-white/10 pb-3 mb-3 mt-1">
              <p className="px-4 py-1 text-xs font-semibold text-white/40 uppercase tracking-widest">
                Explore Neighborhoods
              </p>
              {NEIGHBORHOODS.map((n) => (
                <Link
                  key={n.slug}
                  href={`/denver/${n.slug}`}
                  onClick={closeAll}
                  className="flex items-center justify-between px-4 py-2.5 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                >
                  <span>{n.name}</span>
                  <span className="text-xs text-white/40">{n.tagline}</span>
                </Link>
              ))}
            </div>
            <Link
              href="/events"
              onClick={closeAll}
              className="block px-4 py-2.5 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-colors"
            >
              Events
            </Link>
            <Link
              href="/videos"
              onClick={closeAll}
              className="block px-4 py-2.5 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-colors"
            >
              Videos
            </Link>
            <Link
              href="/articles"
              onClick={closeAll}
              className="block px-4 py-2.5 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-colors"
            >
              Articles
            </Link>
            <Link
              href="/about"
              onClick={closeAll}
              className="block px-4 py-2.5 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-colors"
            >
              About
            </Link>
            <div className="border-t border-white/10 pt-4 mt-3 px-4 flex gap-3">
              <a
                href="https://www.youtube.com/davechung"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 bg-[#FF0000] hover:bg-[#cc0000] text-white text-sm font-semibold rounded-full transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                Subscribe
              </a>
              <a
                href="https://www.tiktok.com/@davelovesdenver"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded-full transition-colors border border-white/20"
              >
                <svg className="w-3.5 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.16 8.16 0 0 0 4.77 1.52V6.77a4.85 4.85 0 0 1-1-.08z"/>
                </svg>
                Follow
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

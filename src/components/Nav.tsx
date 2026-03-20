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
            {/* Neighborhoods dropdown */}
            <div className="relative">
              <button
                onClick={() => setNeighborhoodsOpen(!neighborhoodsOpen)}
                className="flex items-center gap-1 px-4 py-2 text-sm text-white/80 hover:text-white transition-colors rounded-md hover:bg-white/10"
              >
                Neighborhoods
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
                  <div className="absolute top-full left-0 mt-1 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-20 py-2">
                    {NEIGHBORHOODS.map((n) => (
                      <Link
                        key={n.slug}
                        href={`/denver/${n.slug}`}
                        onClick={() => setNeighborhoodsOpen(false)}
                        className="flex flex-col px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <span className="text-sm font-medium text-slate-900 dark:text-white">{n.name}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">{n.tagline}</span>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>

            <Link
              href="/videos"
              className="px-4 py-2 text-sm text-white/80 hover:text-white transition-colors rounded-md hover:bg-white/10"
            >
              Videos
            </Link>

            <Link
              href="/about"
              className="px-4 py-2 text-sm text-white/80 hover:text-white transition-colors rounded-md hover:bg-white/10"
            >
              About
            </Link>
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
            <p className="px-4 py-1 text-xs font-semibold text-white/40 uppercase tracking-widest">
              Neighborhoods
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
            <div className="border-t border-white/10 pt-3 mt-3 space-y-1">
              <Link
                href="/videos"
                onClick={closeAll}
                className="block px-4 py-2.5 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-colors"
              >
                Videos
              </Link>
              <Link
                href="/about"
                onClick={closeAll}
                className="block px-4 py-2.5 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-colors"
              >
                About
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

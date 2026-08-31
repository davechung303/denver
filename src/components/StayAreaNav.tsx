"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Sticky jump nav for the where-to-stay pillar.
 *
 * Deliberately NOT tabs. Tabs would hide nine of the ten neighborhoods behind
 * client state: the content stops being findable with ctrl-F, stops being
 * deep-linkable, and stops being reliably weighted by search and answer engines,
 * which is the entire point of the page. This gives the same "jump to my
 * neighborhood" affordance while every word stays in the DOM at full weight.
 *
 * The links are plain anchors, so navigation works with JavaScript off. The only
 * thing JS adds is highlighting where you currently are.
 */
export default function StayAreaNav({
  areas,
}: {
  areas: { slug: string; label: string }[];
}) {
  const [active, setActive] = useState<string | null>(null);
  const stripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const els = areas
      .map((a) => document.getElementById(a.slug))
      .filter((el): el is HTMLElement => Boolean(el));
    if (els.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        const top = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (top) setActive(top.target.id);
      },
      // Bias the "current" section to whatever is just under the sticky bars.
      { rootMargin: "-140px 0px -55% 0px", threshold: 0 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [areas]);

  // Keep the active pill in view without ever scrolling the page itself.
  useEffect(() => {
    const strip = stripRef.current;
    if (!active || !strip) return;
    const pill = strip.querySelector<HTMLElement>(`[data-slug="${active}"]`);
    if (!pill) return;
    strip.scrollTo({
      left: pill.offsetLeft - strip.clientWidth / 2 + pill.clientWidth / 2,
      behavior: "smooth",
    });
  }, [active]);

  return (
    <nav
      aria-label="Jump to a neighborhood"
      className="sticky top-16 z-40 border-y border-slate-200 dark:border-slate-800 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={stripRef}
          className="flex items-center gap-2 overflow-x-auto py-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          <span className="shrink-0 pr-1 text-xs font-semibold uppercase tracking-widest text-slate-400">
            Jump to
          </span>
          {areas.map((a) => {
            const on = active === a.slug;
            return (
              <a
                key={a.slug}
                data-slug={a.slug}
                href={`#${a.slug}`}
                aria-current={on ? "true" : undefined}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  on
                    ? "bg-denver-amber text-white"
                    : "bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
                }`}
              >
                {a.label}
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

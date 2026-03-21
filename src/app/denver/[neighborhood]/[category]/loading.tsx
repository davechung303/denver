"use client";

import { useEffect, useState } from "react";

const PHRASES = [
  "Tallying up the star ratings…",
  "Sniffing out the best green chile in the neighborhood…",
  "Checking who's open right now…",
  "Scouting new hotspots…",
  "Reading the latest reviews…",
  "Finding a great cup of coffee…",
  "Looking for nearby events this weekend…",
  "Ranking the rooftop bars…",
  "Counting outdoor patios…",
  "Asking locals what's good…",
  "Hunting down happy hour deals…",
  "Checking the Denver weather…",
  "Finding brunch spots worth the wait…",
  "Unearthing hidden gems…",
  "Checking which food trucks are out…",
  "Sorting through thousands of reviews…",
  "Lining up the best date night spots…",
  "Finding places with good vibes…",
];

export default function CategoryLoading() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % PHRASES.length);
        setVisible(true);
      }, 300);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="relative w-16 h-16 mb-8">
        <div className="absolute inset-0 rounded-full border-4 border-slate-200 dark:border-slate-800" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-denver-amber animate-spin" />
      </div>

      <p
        className="text-lg font-medium text-slate-600 dark:text-slate-400 transition-opacity duration-300 max-w-sm"
        style={{ opacity: visible ? 1 : 0 }}
      >
        {PHRASES[index]}
      </p>

      <p className="mt-3 text-sm text-slate-400 dark:text-slate-600">
        Putting together your neighborhood guide…
      </p>
    </div>
  );
}

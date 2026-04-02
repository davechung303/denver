"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const PHRASES: Record<string, string[]> = {
  restaurants: [
    "Pulling up the latest reviews…",
    "Checking what people are ordering…",
    "Looking up current hours…",
    "Finding the most popular dishes…",
    "Reading through recent Google reviews…",
    "Seeing what the regulars recommend…",
    "Checking if reservations are needed…",
    "Looking at the menu highlights…",
    "Finding out what's worth ordering…",
    "Checking the price range…",
    "Seeing if they take walk-ins…",
    "Finding out what's good on the menu…",
  ],
  hotels: [
    "Pulling up guest reviews…",
    "Checking hotel amenities…",
    "Looking at recent guest ratings…",
    "Finding out what's included…",
    "Checking the neighborhood walkability…",
    "Reading what guests say about the rooms…",
    "Looking up nearby restaurants and things to do…",
    "Seeing what travelers liked most…",
    "Checking parking and transit options…",
    "Finding the best rate sources…",
  ],
  bars: [
    "Checking tonight's specials…",
    "Finding the best happy hour deals…",
    "Reading what people are drinking…",
    "Looking up the tap list…",
    "Seeing what the crowd is like…",
    "Checking if they have a patio…",
    "Finding out what's on draft…",
    "Reading the cocktail menu reviews…",
    "Checking weekend hours…",
    "Looking at the vibe and atmosphere…",
  ],
  coffee: [
    "Checking the roast profiles…",
    "Seeing if they do pour-overs…",
    "Finding out if there's good seating…",
    "Checking the wifi situation…",
    "Reading what regulars order…",
    "Looking at the pastry options…",
    "Seeing if they source beans locally…",
    "Checking morning hours…",
    "Finding out what people come back for…",
    "Looking up the espresso ratings…",
  ],
  "things-to-do": [
    "Checking what's on this weekend…",
    "Looking up hours and ticket info…",
    "Finding out what people enjoy most…",
    "Seeing how long visits typically take…",
    "Reading recent visitor reviews…",
    "Checking if you need to book ahead…",
    "Finding nearby things to pair with this…",
    "Looking at the top activities nearby…",
    "Checking what locals actually recommend…",
    "Seeing what's worth the trip…",
  ],
  default: [
    "Tallying up the star ratings…",
    "Reading the latest reviews…",
    "Checking who's open right now…",
    "Asking locals what's good…",
    "Sorting through hundreds of reviews…",
    "Finding the hidden gems…",
    "Looking up what people recommend…",
    "Checking the latest ratings…",
  ],
};

const SUBTITLES: Record<string, string> = {
  restaurants: "Putting together everything you need to decide where to eat…",
  hotels: "Pulling in reviews, amenities, and what's nearby…",
  bars: "Getting the full picture on this spot…",
  coffee: "Rounding up the details on this coffee shop…",
  "things-to-do": "Compiling what you need to know before you go…",
  default: "Putting together your guide…",
};

function getCategoryFromPath(pathname: string): string {
  // Path: /denver/[neighborhood]/[category]/[slug]
  const parts = pathname.split("/").filter(Boolean);
  // parts[0] = "denver", parts[1] = neighborhood, parts[2] = category
  return parts[2] ?? "default";
}

export default function CategoryLoading() {
  const pathname = usePathname();
  const category = getCategoryFromPath(pathname);
  const phrases = PHRASES[category] ?? PHRASES.default;
  const subtitle = SUBTITLES[category] ?? SUBTITLES.default;

  const [index, setIndex] = useState(() => Math.floor(Math.random() * phrases.length));
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % phrases.length);
        setVisible(true);
      }, 300);
    }, 2200);
    return () => clearInterval(interval);
  }, [phrases.length]);

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
        {phrases[index]}
      </p>

      <p className="mt-3 text-sm text-slate-400 dark:text-slate-600">
        {subtitle}
      </p>
    </div>
  );
}

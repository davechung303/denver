"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const PHRASES: Record<string, string[]> = {
  restaurants: [
    "Checking what people are actually ordering…",
    "Reading through the recent reviews…",
    "Finding out what's worth getting…",
    "Seeing if reservations are needed…",
    "Pulling up the menu highlights…",
    "Checking current hours…",
    "Looking at what the regulars say…",
    "Figuring out the price range…",
    "Seeing what dishes keep coming up in reviews…",
    "Checking if there's outdoor seating…",
    "Finding out what to skip and what to order…",
    "Seeing if walk-ins are welcome…",
  ],
  hotels: [
    "Reading recent guest reviews…",
    "Checking what's actually included…",
    "Seeing what travelers say about the rooms…",
    "Looking up walkability from this hotel…",
    "Finding the best nearby restaurants…",
    "Checking parking and getting-around options…",
    "Seeing what guests loved — and what they didn't…",
    "Looking at things to do within walking distance…",
    "Finding out if breakfast is worth it…",
    "Checking what floor the best views are on…",
  ],
  bars: [
    "Checking what's on tap…",
    "Finding out if they do happy hour…",
    "Reading what people are drinking…",
    "Looking up the cocktail situation…",
    "Seeing if there's a patio…",
    "Checking weekend hours…",
    "Finding out what the crowd is like…",
    "Looking at the bar snack situation…",
    "Checking if it's a reservation kind of place…",
    "Seeing what people say about the vibe…",
  ],
  coffee: [
    "Checking the espresso ratings…",
    "Seeing if they do single-origin pour-overs…",
    "Looking at the pastry situation…",
    "Checking the wifi and seating setup…",
    "Finding out what regulars always get…",
    "Seeing if they roast in-house…",
    "Checking morning hours…",
    "Reading what people say about the vibe…",
    "Finding out if it's a work-from-here kind of spot…",
    "Looking at what's worth ordering besides the coffee…",
  ],
  "things-to-do": [
    "Checking hours and whether you need tickets…",
    "Seeing how long people usually stay…",
    "Reading what visitors say is worth it…",
    "Finding out if you need to book ahead…",
    "Looking up what to do nearby after this…",
    "Checking what's best about this place…",
    "Seeing what locals actually recommend…",
    "Finding out what to skip and what not to miss…",
    "Reading the recent reviews…",
    "Checking if it's worth the trip…",
  ],
  default: [
    "Reading the latest reviews…",
    "Checking who's open right now…",
    "Sorting through ratings…",
    "Finding out what's worth your time…",
    "Checking what locals recommend…",
    "Pulling up the details…",
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

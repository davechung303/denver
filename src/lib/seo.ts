// Title/description length control.
//
// Google shows roughly 60 characters of a title and ~155 of a description.
// The root layout appends " | Dave Loves Denver" (20 chars) through its title
// template. When a page title plus that suffix would overflow, we return an
// absolute title instead so the keyword-bearing part is never cut off.

import type { Metadata } from "next";

export const BRAND = "Dave Loves Denver";
const SUFFIX_LEN = ` | ${BRAND}`.length; // 20
export const TITLE_MAX = 60;
export const DESC_MAX = 155;
const DESC_MIN = 100;

type Title = NonNullable<Metadata["title"]>;

function cutAtWord(s: string, max: number): string {
  if (s.length <= max) return s;
  const slice = s.slice(0, max + 1);
  const lastSpace = slice.lastIndexOf(" ");
  const cut = (lastSpace > max * 0.6 ? slice.slice(0, lastSpace) : s.slice(0, max)).trim();
  // Don't leave a dangling separator or conjunction at the end.
  return cut.replace(/[\s—–\-|:,&·]+$/u, "").replace(/\s+(and|or|the|a|in|near|of|for|&)$/i, "");
}

/** Plain string version of a fitted title (for OpenGraph/Twitter, which ignore the template). */
export function fitTitleText(t: string): string {
  const clean = t.replace(/\s+/g, " ").trim();
  if (clean.length + SUFFIX_LEN <= TITLE_MAX) return `${clean} | ${BRAND}`;
  return cutAtWord(clean, TITLE_MAX);
}

/** Title for `metadata.title`: keeps the brand suffix when it fits, otherwise drops it. */
export function fitTitle(t: string): Title {
  const clean = t.replace(/\s+/g, " ").trim();
  if (clean.length + SUFFIX_LEN <= TITLE_MAX) return clean;
  return { absolute: cutAtWord(clean, TITLE_MAX) };
}

/** Description trimmed to ≤155 chars, preferring a sentence boundary. */
export function fitDescription(d: string): string {
  const clean = d
    .replace(/\s+/g, " ")
    .replace(/\s+([.,])/g, "$1")
    .replace(/\.{2,}/g, ".")
    .trim();
  if (clean.length <= DESC_MAX) return clean;
  const window = clean.slice(0, DESC_MAX);
  const lastStop = Math.max(window.lastIndexOf(". "), window.lastIndexOf("! "), window.lastIndexOf("? "));
  if (lastStop + 1 >= DESC_MIN) return window.slice(0, lastStop + 1);
  return `${cutAtWord(clean, DESC_MAX - 1)}…`;
}

/** Convenience: fitted title + description + matching OpenGraph title. */
export function seoMeta(title: string, description: string): {
  title: Title;
  description: string;
  ogTitle: string;
} {
  return { title: fitTitle(title), description: fitDescription(description), ogTitle: fitTitleText(title) };
}

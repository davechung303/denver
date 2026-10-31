import Link from "next/link";
import { findMentions, type MentionIndex } from "@/lib/hotelMentions";

/**
 * Inline internal links in guide copy, written as `[label](/denver/altitude)`.
 *
 * Guide prose could only ever link hotels, so a sentence about the A Line fare
 * or what parking costs sat a few pixels from the guide that answers it with
 * nothing joining the two. Only site-relative paths are accepted — this is for
 * internal linking, not for handing authority to someone else.
 */
export const INLINE_LINK = /\[([^\]]+)\]\((\/[^)\s]*)\)/g;

/** The same copy with the link syntax flattened — for JSON-LD and meta text. */
export function stripInlineLinks(text: string) {
  return text.replace(INLINE_LINK, "$1");
}

// Renders a string of guide copy with the first mention of each hotel turned
// into a link to that hotel's detail page, followed by a small affiliate
// "Book" chip. The chip is the point: a reader who has just read a sentence
// about a specific hotel is the highest-intent click on the page.
export default function LinkedText({
  text,
  index,
  seen,
  chipLimit = 4,
  tone = "light",
}: {
  text: string;
  index: MentionIndex;
  seen: Set<string>;
  /** "navy" renders for the dark page header, where slate-900 text is invisible. */
  tone?: "light" | "navy";
  /**
   * Booking chips per section. Past this the hotel still links — the internal
   * link is free and useful — but the chip stops, because a section with
   * fourteen of them reads as an ad farm rather than a recommendation.
   * `seen` already counts the hotels linked so far in this section, so the
   * running total needs no mutable state.
   */
  chipLimit?: number;
}) {
  const navy = tone === "navy";
  const linkClass = navy
    ? "font-semibold text-white underline decoration-denver-amber decoration-2 underline-offset-2 hover:text-denver-amber transition-colors"
    : "font-medium text-slate-900 dark:text-slate-100 underline decoration-denver-amber decoration-2 underline-offset-2 hover:text-denver-amber transition-colors";
  const chipClass = navy
    ? "ml-1.5 inline-flex items-center rounded-full bg-denver-amber px-2 py-0.5 text-[11px] font-bold text-white align-middle hover:bg-amber-400 transition-colors"
    : "ml-1.5 inline-flex items-center rounded-full bg-denver-amber/10 px-2 py-0.5 text-[11px] font-semibold text-denver-amber align-middle hover:bg-denver-amber hover:text-white transition-colors";

  // Hotel mentions inside one plain stretch of copy. `seen` carries across
  // calls, so the chip budget stays a running total for the whole section
  // rather than resetting at every inline link.
  function hotels(plain: string, key: string): React.ReactNode {
    const linkedBefore = seen.size;
    const hits = findMentions(plain, index, seen);
    if (hits.length === 0) return plain;

    const nodes: React.ReactNode[] = [];
    let cursor = 0;

    hits.forEach((h, n) => {
      if (h.start > cursor) nodes.push(plain.slice(cursor, h.start));
      const m = index.bySlug[h.slug];
      const chip = linkedBefore + n < chipLimit;
      nodes.push(
        <span key={`${key}-${h.slug}-${n}`}>
          <Link
            href={m.detailHref}
            className={linkClass}
          >
            {h.text}
          </Link>
          {chip && (
            <a
              href={m.bookHref}
              target="_blank"
              rel={m.bookRel}
              className={chipClass}
            >
              {m.bookLabel}
            </a>
          )}
        </span>
      );
      cursor = h.end;
    });

    if (cursor < plain.length) nodes.push(plain.slice(cursor));
    return <>{nodes}</>;
  }

  // Split on inline links first so hotel detection only ever runs on the plain
  // stretches — an anchor nested inside an anchor is invalid HTML, and a hotel
  // name used as a guide link's label is exactly how that would happen.
  const nodes: React.ReactNode[] = [];
  let cursor = 0;
  let n = 0;

  for (const m of text.matchAll(INLINE_LINK)) {
    const at = m.index ?? 0;
    if (at > cursor) nodes.push(hotels(text.slice(cursor, at), `p${n}`));
    nodes.push(
      <Link key={`g${n}`} href={m[2]} className={linkClass}>
        {m[1]}
      </Link>
    );
    cursor = at + m[0].length;
    n += 1;
  }

  if (cursor === 0) return <>{hotels(text, "p0")}</>;
  if (cursor < text.length) nodes.push(hotels(text.slice(cursor), `p${n}`));
  return <>{nodes}</>;
}

import Link from "next/link";
import { findMentions, type MentionIndex } from "@/lib/hotelMentions";

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
  const linkedBefore = seen.size;
  const hits = findMentions(text, index, seen);
  if (hits.length === 0) return <>{text}</>;

  const nodes: React.ReactNode[] = [];
  let cursor = 0;

  hits.forEach((h, n) => {
    if (h.start > cursor) nodes.push(text.slice(cursor, h.start));
    const m = index.bySlug[h.slug];
    const chip = linkedBefore + n < chipLimit;
    nodes.push(
      <span key={`${h.slug}-${n}`}>
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
            rel="noopener noreferrer sponsored"
            className={chipClass}
          >
            Book
          </a>
        )}
      </span>
    );
    cursor = h.end;
  });

  if (cursor < text.length) nodes.push(text.slice(cursor));
  return <>{nodes}</>;
}

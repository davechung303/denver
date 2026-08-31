/**
 * Viator search term for a hotel detail page, keyed by neighborhood.
 *
 * A generic "Denver tours" strip on 250 near-identical detail pages would be
 * 250 near-identical blocks — thin, and it makes the pages more like each other
 * at exactly the moment we want them distinct. Keying by neighborhood gives each
 * one a genuinely different set, and because Next dedupes identical fetches it
 * also means about fifteen API calls instead of two hundred and fifty.
 */
const BY_NEIGHBORHOOD: Record<string, string> = {
  rino: "Denver brewery tour",
  "five-points": "Denver brewery tour",
  cole: "Denver brewery tour",
  lodo: "Denver food tour",
  downtown: "Denver city tour",
  "golden-triangle": "Denver museum tour",
  "capitol-hill": "Denver history walking tour",
  uptown: "Denver history walking tour",
  highlands: "Denver food tour",
  "jefferson-park": "Denver city tour",
  berkeley: "Denver food tour",
  "sloan-lake": "Denver outdoor adventure",
  "cherry-creek": "Denver shopping and dining tour",
  "washington-park": "Denver bike tour",
  "platt-park": "Denver food tour",
  airport: "Rocky Mountain day trip from Denver",
  "denver-suburbs": "Red Rocks and foothills tour from Denver",
};

const DEFAULT_TERM = "Denver city tour";

export function experiencesTermFor(neighborhoodSlug: string | null | undefined): string {
  if (!neighborhoodSlug) return DEFAULT_TERM;
  return BY_NEIGHBORHOOD[neighborhoodSlug] ?? DEFAULT_TERM;
}

// Places we must not recommend, and why.
//
// The places table is a cache of Google data, and Google keeps serving a
// business long after it shuts — rating, review count and photos intact.
// Nothing in the pipeline notices. That is how the NATIV Hotel, permanently
// closed and unbookable, ended up in six of our routed walk tables with a 4.0
// and 669 reviews beside it.
//
// Recommending a closed business is the most damaging factual error this site
// can make: instantly checkable, it wastes a reader's trip, and it is exactly
// what a hyperlocal guide is meant to be immune to. So exclusions are recorded
// here the moment they are confirmed, rather than waiting for a cache refresh
// that may never drop the row.
//
// Two cautions learned the hard way while compiling this list:
//
//   - A live-looking listing is not evidence of operation. Expedia, Hotels.com
//     and Booking.com were still selling "Sonder by Marriott Bonvoy The
//     Artesian" ten months after Sonder shut every US property overnight.
//   - sonder.com itself is now a trap. The brand was bought in July 2026 by a
//     company that explicitly did not acquire the properties, leases or staff,
//     and the site still serves property pages with prices. It looks
//     first-party and is not.
//
// Confirm against the business itself, or its absence from a channel that
// used to carry it, and keep the note.

export const EXCLUDED_PLACES: Record<string, string> = {
  // Permanently closed; no longer bookable on Expedia. Confirmed August 2026.
  // Was carrying routed walk distances to six venues before it was caught.
  "nativ-hotel": "Permanently closed",

  // Was "Sonder by Marriott Bonvoy The Artesian", 3258 N Tejon St. Sonder
  // ceased all US operations on 11 November 2025 and told guests to vacate the
  // same morning; Marriott terminated the license. No successor operator.
  "the-artesian": "Closed in the Sonder collapse, November 2025",

  // Fails every independent test: no website, no presence on any booking
  // channel, no local coverage, and the only address anyone publishes is about
  // a mile and a half from the coordinates in our cache. Reads as a Google
  // Places phantom rather than a hotel that closed.
  "hotel-diablo": "Cannot be verified as a real, operating hotel",

  // Open, but it is a ~230-unit short-term-rental building rather than a hotel.
  // It should not sit in a hotel walk table next to the Four Seasons, and
  // Denver's primary-residence STR rules make it a bad recommendation anyway.
  "espadn-lohi": "Short-term-rental building, not a hotel",
};

export function isExcludedPlace(slug: string | null | undefined): boolean {
  return slug != null && slug in EXCLUDED_PLACES;
}

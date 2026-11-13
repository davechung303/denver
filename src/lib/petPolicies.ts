// Pet policies for the hotels on /denver/pet-friendly-hotels.
//
// Hand-curated, like excludedPlaces.ts. Published pet fees for Denver hotels
// contradict each other across BringFido, Visit Denver, Romingo and even the
// hotels' own pages, so every row here was taken from the hotel's own site or
// its brand page and then checked by phone with the front desk. Where the call
// disagreed with the website, the call wins and the note says so.
//
// This feeds the guide's comparison table, its ItemList schema and the
// "Bringing a dog?" box on each hotel's detail page. Re-check it with the
// quarterly fact refresh: a pet fee is the kind of number that changes quietly.

export interface PetPolicy {
  /** places.slug. Null when the hotel isn't in our places data yet. */
  slug: string | null;
  /** Display name, written to match a hotelMentions alias so copy auto-links. */
  name: string;
  area: string;
  /** Section anchor on the guide this hotel belongs to. */
  anchor: "downtown" | "cherry-creek" | "airport" | "tech-center";
  fee: string;
  weight: string;
  maxPets: string;
  /** What the front desk said about leaving a dog alone in the room. */
  leftAlone: string;
  /** What three nights with two dogs costs in pet fees. Null if two dogs aren't allowed. */
  threeNightsTwoDogs: number | null;
  /** True when the hotel takes dogs but not cats. */
  dogsOnly?: boolean;
  /** The hotel's own policy page. Omitted where the hotel publishes none and the phone call is the source. */
  sourceUrl?: string;
  /** ISO date the policy was confirmed by phone. */
  checkedOn: string;
}

const CHECKED = "2026-11-12";

/** Ordered cheapest first for a three-night stay with two dogs. */
export const PET_POLICIES: PetPolicy[] = [
  {
    slug: "kimpton-hotel-monaco-denver",
    name: "Kimpton Hotel Monaco",
    area: "Downtown",
    anchor: "downtown",
    fee: "None, and no deposit",
    weight: "None (the dog has to fit in the elevator)",
    maxPets: "No limit",
    leftAlone: "No",
    threeNightsTwoDogs: 0,
    sourceUrl: "https://www.monaco-denver.com/denver-boutique-hotel-amenities/pet-friendly/",
    checkedOn: CHECKED,
  },
  {
    slug: "thompson-denver-by-hyatt",
    name: "Thompson Denver",
    area: "LoDo",
    anchor: "downtown",
    fee: "None",
    weight: "None",
    maxPets: "2 dogs",
    leftAlone: "Yes, if you leave your number with the front desk",
    threeNightsTwoDogs: 0,
    sourceUrl: "https://www.hyatt.com/thompson-hotels/en-US/denth-thompson-denver/policies",
    checkedOn: CHECKED,
  },
  {
    slug: "hotel-teatro",
    name: "Hotel Teatro",
    area: "Theatre District",
    anchor: "downtown",
    fee: "None",
    weight: "None",
    maxPets: "No limit",
    leftAlone: "Yes; they'll call you if there's a noise complaint",
    threeNightsTwoDogs: 0,
    sourceUrl: "https://hotelteatro.com/pet-friendly/",
    checkedOn: CHECKED,
  },
  {
    slug: "magnolia-hotel-denver-a-tribute-portfolio-hotel",
    name: "Magnolia Hotel",
    area: "Downtown",
    anchor: "downtown",
    fee: "None; you pay for any damage",
    weight: "None",
    maxPets: "2",
    leftAlone: "No",
    threeNightsTwoDogs: 0,
    sourceUrl: "https://www.marriott.com/DENMG",
    checkedOn: CHECKED,
  },
  {
    slug: null,
    name: "Kimpton Claret",
    area: "Tech Center (Belleview Station)",
    anchor: "tech-center",
    fee: "None",
    weight: "None",
    maxPets: "No limit",
    leftAlone: "Yes",
    threeNightsTwoDogs: 0,
    sourceUrl: "https://www.ihg.com/kimptonhotels/hotels/us/en/claret-hotel-denver-co/denim/hoteldetail/amenities",
    checkedOn: CHECKED,
  },
  {
    slug: "the-maven-hotel-at-dairy-block",
    name: "The Maven",
    area: "Dairy Block",
    anchor: "downtown",
    fee: "$50 once per stay",
    weight: "Not stated",
    maxPets: "2",
    leftAlone: "Yes, unless there's a noise complaint",
    threeNightsTwoDogs: 50,
    dogsOnly: true,
    sourceUrl: "https://www.themavenhotel.com/about/dogs-welcome",
    checkedOn: CHECKED,
  },
  {
    slug: "the-rally-hotel-at-mcgregor-square",
    name: "The Rally",
    area: "McGregor Square",
    anchor: "downtown",
    fee: "$50 once per stay (the website says per pet; the front desk says per stay)",
    weight: "None",
    maxPets: "No limit",
    leftAlone: "Yes; they take your contact details",
    threeNightsTwoDogs: 50,
    dogsOnly: true,
    sourceUrl: "https://www.therallyhotel.com/our-hotel/dog-friendly",
    checkedOn: CHECKED,
  },
  {
    slug: "catbird-hotel",
    name: "Catbird",
    area: "RiNo",
    anchor: "downtown",
    fee: "$75 once per stay",
    weight: "None",
    maxPets: "Not stated",
    leftAlone: "Yes",
    threeNightsTwoDogs: 75,
    checkedOn: CHECKED,
  },
  {
    slug: "hyatt-place-denvercherry-creek",
    name: "Hyatt Place Denver/Cherry Creek",
    area: "Cherry Creek / Glendale",
    anchor: "cherry-creek",
    fee: "$100 per stay (1 to 6 nights)",
    weight: "50 lb each, 75 lb combined",
    maxPets: "2",
    leftAlone: "Yes; they'll call about noise and may charge a fee",
    threeNightsTwoDogs: 100,
    sourceUrl: "https://www.hyatt.com/hyatt-place/en-US/denzc-hyatt-place-denver-cherry-creek/hotel-info",
    checkedOn: CHECKED,
  },
  {
    slug: "the-brown-palace-hotel-and-spa-autograph-collection",
    name: "The Brown Palace",
    area: "Downtown",
    anchor: "downtown",
    fee: "$125 per stay, non-refundable",
    weight: "50 lb",
    maxPets: "2",
    leftAlone: "No",
    threeNightsTwoDogs: 125,
    dogsOnly: true,
    sourceUrl: "https://www.marriott.com/DENAK",
    checkedOn: CHECKED,
  },
  {
    slug: "the-crawford-hotel",
    name: "The Crawford",
    area: "Union Station",
    anchor: "downtown",
    fee: "$50 per room, per night (not per dog)",
    weight: "60 lb",
    maxPets: "2",
    leftAlone: "Up to 30 minutes",
    threeNightsTwoDogs: 150,
    dogsOnly: true,
    sourceUrl: "https://www.thecrawfordhotel.com/rooms-suites/classic-premium/",
    checkedOn: CHECKED,
  },
  {
    slug: "hotel-clio-a-luxury-collection-hotel-denver-cherry-creek",
    name: "Hotel Clio",
    area: "Cherry Creek",
    anchor: "cherry-creek",
    fee: "$150 per stay, non-refundable",
    weight: "None",
    maxPets: "2",
    leftAlone: "Yes; you sign a form letting staff in for an emergency",
    threeNightsTwoDogs: 150,
    sourceUrl: "https://www.marriott.com/hotels/travel/denld/",
    checkedOn: CHECKED,
  },
  {
    slug: "the-westin-denver-downtown",
    name: "The Westin Denver Downtown",
    area: "Downtown",
    anchor: "downtown",
    fee: "$50 per night, non-refundable",
    weight: "40 lb",
    maxPets: "2",
    leftAlone: "No",
    threeNightsTwoDogs: 150,
    sourceUrl: "https://www.marriott.com/es/hotels/denwi-the-westin-denver-downtown/overview/",
    checkedOn: CHECKED,
  },
  {
    slug: "la-quinta-inn-suites-by-wyndham-denver-airport-dia",
    name: "La Quinta DIA",
    area: "Airport (Tower Rd)",
    anchor: "airport",
    fee: "$25 per pet, per night",
    weight: "None",
    maxPets: "2",
    leftAlone: "No",
    threeNightsTwoDogs: 150,
    checkedOn: CHECKED,
  },
  {
    slug: "halcyon-a-hotel-in-cherry-creek-denver",
    name: "Halcyon",
    area: "Cherry Creek",
    anchor: "cherry-creek",
    fee: "$150 per pet, per stay",
    weight: "70 lb",
    maxPets: "2",
    leftAlone: "Yes, if you tell the front desk",
    threeNightsTwoDogs: 300,
    dogsOnly: true,
    sourceUrl: "https://www.halcyonhotelcherrycreek.com/hotel/halcyon-hounds",
    checkedOn: CHECKED,
  },
  {
    slug: "the-oxford-hotel",
    name: "The Oxford",
    area: "LoDo",
    anchor: "downtown",
    fee: "$50 per pet, per night",
    weight: "None",
    maxPets: "2 dogs",
    leftAlone: "No",
    threeNightsTwoDogs: 300,
    sourceUrl: "https://theoxfordhotel.com/our-hotel/dog-friendly",
    checkedOn: CHECKED,
  },
  {
    slug: "the-jacquard-autograph-collection",
    name: "The Jacquard",
    area: "Cherry Creek",
    anchor: "cherry-creek",
    fee: "$150 per pet, per stay",
    weight: "50 lb",
    maxPets: "1",
    leftAlone: "Only if crated or contained",
    threeNightsTwoDogs: null,
    sourceUrl: "https://www.marriott.com/en-us/hotels/dencr-the-jacquard-autograph-collection/overview/",
    checkedOn: CHECKED,
  },
  {
    slug: "the-westin-denver-international-airport",
    name: "The Westin Denver International Airport",
    area: "Airport (at the terminal)",
    anchor: "airport",
    fee: "$50 per stay",
    weight: "80 lb",
    maxPets: "1",
    leftAlone: "No",
    threeNightsTwoDogs: null,
    sourceUrl: "https://marriott.com/DENAW",
    checkedOn: CHECKED,
  },
];

const BY_SLUG = new Map(PET_POLICIES.filter((p) => p.slug).map((p) => [p.slug as string, p]));

export function petPolicyFor(slug: string): PetPolicy | null {
  return BY_SLUG.get(slug) ?? null;
}

export function formatPetCost(n: number | null): string {
  if (n === null) return "1 pet max";
  return n === 0 ? "$0" : `$${n}`;
}

import type { Place } from "./places";
import { expediaDenverHotelsUrl } from "./travelpayouts";

// Guide copy names real hotels constantly and, until now, none of those names
// was a link. Every one of them is a reader at the highest possible intent —
// they are reading about that specific hotel — and we were sending them to
// Google to find it.
//
// Matching is deliberately dumb: a hand-curated alias list, matched
// case-sensitively on word boundaries. No fuzzy matching, no name-splitting,
// no inference. "The Source Hotel" links; "the source of the problem" does not.
// If a hotel is not in this map it simply does not link, which is the correct
// failure mode.
const ALIASES: Record<string, string[]> = {
  "springhill-suites-by-marriott-denver-downtown": ["SpringHill Suites by Marriott Denver Downtown", "SpringHill Suites Denver Downtown"],
  "hilton-denver-city-center": ["Hilton Denver City Center"],
  "hyatt-centric-downtown-denver": ["Hyatt Centric Downtown Denver", "Hyatt Centric"],
  "aloft-by-marriott-denver-downtown": ["Aloft by Marriott Denver Downtown", "Aloft Denver Downtown"],
  "tru-by-hilton-denver-downtown-convention-center": ["Tru by Hilton Denver Downtown Convention Center"],
  "homewood-suites-by-hilton-denver-downtown-convention-center": ["Homewood Suites by Hilton Denver Downtown Convention Center", "Homewood Suites Convention Center", "Homewood Suites"],
  "hampton-inn-suites-denver-downtown-convention-center": ["Hampton Inn & Suites Denver Downtown Convention Center"],
  "the-slate-hotel-denver-downtown-tapestry-by-hilton": ["The Slate Hotel Denver Downtown", "The Slate"],
  "hyatt-house-denverdowntown": ["Hyatt House Denver/Downtown", "Hyatt House Denver Downtown"],
  "renaissance-denver-downtown-city-center-hotel": ["Renaissance Denver Downtown City Center"],
  "element-by-marriott-denver-downtown-east": ["Element by Marriott Denver Downtown East", "Element Denver Downtown East"],
  "residence-inn-by-marriott-denver-city-center": ["Residence Inn by Marriott Denver City Center", "Residence Inn Denver City Center"],
  "courtyard-by-marriott-denver-downtown": ["Courtyard by Marriott Denver Downtown"],
  "holiday-inn-express-denver-downtown-by-ihg": ["Holiday Inn Express Denver Downtown"],
  "warwick-denver": ["Warwick Denver"],
  "kasa-union-station-denver": ["Kasa Union Station Denver", "Kasa Union Station"],
  "vb-hotel-by-best-western-denver-rino": ["V\u012bb Hotel by Best Western Denver RiNo", "V\u012bb Hotel"],
  "hyatt-place-pea-station-denver-airport": ["Hyatt Place Pe\u00f1a Station / Denver Airport", "Hyatt Place Pe\u00f1a Station"],
  "sheraton-denver-west-hotel": ["Sheraton Denver West Hotel", "Sheraton Denver West"],
  "hampton-inn-by-hilton-denver-west-federal-center": ["Hampton Inn by Hilton Denver West Federal Center", "Hampton Inn Denver West Federal Center"],
  "denver-marriott-tech-center": ["Denver Marriott Tech Center"],
  "hyatt-regency-denver-tech-center": ["Hyatt Regency Denver Tech Center"],
  "hampton-inn-suites-denver-tech-center": ["Hampton Inn & Suites Denver Tech Center"],
  "residence-inn-by-marriott-denver-tech-center": ["Residence Inn by Marriott Denver Tech Center", "Residence Inn Denver Tech Center"],
  "wingate-by-wyndham-greenwood-villagedenver-tech": ["Wingate by Wyndham Greenwood Village/Denver Tech"],
  "doubletree-by-hilton-hotel-denver-tech-center": ["DoubleTree by Hilton Hotel Denver Tech Center", "DoubleTree Denver Tech Center"],
  "residence-inn-by-marriott-denver-southpark-meadows-mall": ["Residence Inn by Marriott Denver South/Park Meadows Mall"],
  "hilton-garden-inn-denver-south-park-meadows-area": ["Hilton Garden Inn Denver South Park Meadows Area", "Hilton Garden Inn Denver South Park Meadows"],
  "even-hotel-denver-tech-center-englewood-by-ihg": ["EVEN Hotel Denver Tech Center-Englewood", "EVEN Hotel Denver Tech Center"],
  "hampton-inn-suites-denversouth-ridgegate": ["Hampton Inn & Suites Denver/South-RidgeGate"],
  "fairfield-by-marriott-inn-suites-denver-auroramedical-center": ["Fairfield by Marriott Inn & Suites Denver Aurora/Medical Center", "Fairfield Denver Aurora/Medical Center"],
  "hampton-inn-suites-aurora-south-denver": ["Hampton Inn & Suites Aurora South Denver"],
  "doubletree-by-hilton-hotel-denver---aurora": ["DoubleTree by Hilton Hotel Denver - Aurora", "DoubleTree Denver - Aurora"],
  "holiday-inn-express-suites-denver-aurora-medical-campus": ["Holiday Inn Express & Suites Denver Aurora Medical Campus"],
  "gravity-haus-denver-hotel": ["Gravity Haus Denver"],
  "hyatt-regency-denver-at-colorado-convention-center": [
    "Hyatt Regency Denver at the Colorado Convention Center",
    "Hyatt Regency Denver at Colorado Convention Center",
    "Hyatt Regency Denver at the Convention Center",
    "Hyatt Regency Denver",
    "Hyatt Regency",
  ],
  "four-seasons-hotel-denver": ["Four Seasons Hotel Denver", "Four Seasons"],
  "hotel-clio-a-luxury-collection-hotel-denver-cherry-creek": ["Hotel Clio", "Clio"],
  "populus-denver": ["Populus"],
  "the-source-hotel": ["The Source Hotel", "The Source"],
  "the-maven-hotel-at-dairy-block": ["The Maven at Dairy Block", "The Maven"],
  "the-oxford-hotel": ["The Oxford Hotel", "The Oxford"],
  "the-crawford-hotel": ["The Crawford Hotel", "The Crawford"],
  "the-brown-palace-hotel-and-spa-autograph-collection": ["The Brown Palace"],
  "the-rally-hotel-at-mcgregor-square": ["The Rally Hotel", "The Rally"],
  "the-curtis-denver---a-doubletree-by-hilton-hotel": ["The Curtis Denver", "The Curtis"],
  "the-jacquard-autograph-collection": ["The Jacquard, Autograph Collection", "The Jacquard"],
  "cambria-hotel-denver-downtown-rino": [
    "Cambria Hotel Denver Downtown RiNo",
    "Cambria Denver Downtown RiNo",
    "Cambria in RiNo",
  ],
  "hotel-indigo-denver-downtown-union-station-by-ihg": [
    "Hotel Indigo Denver Downtown-Union Station",
    "Hotel Indigo Union Station",
    "Hotel Indigo",
  ],
  "sonesta-denver-downtown": ["Sonesta Denver Downtown", "Sonesta"],
  "embassy-suites-by-hilton-denver-downtown-convention-center": [
    "Embassy Suites by Hilton Denver Downtown Convention Center",
    "Embassy Suites Denver Downtown Convention Center",
    "Embassy Suites Convention Center",
  ],
  "hilton-garden-inn-denver-downtown": ["Hilton Garden Inn Denver Downtown"],
  "hilton-garden-inn-denver-union-station": [
    "Hilton Garden Inn Denver Union Station",
    "Hilton Garden Inn Union Station",
  ],
  "home2-by-hilton-denver-downtown-convention-center": [
    "Home2 by Hilton Denver Downtown Convention Center",
    "Home2 Suites Convention Center",
    "Home2 Suites",
  ],
  "courtyard-by-marriott-denver-cherry-creek": [
    "Courtyard by Marriott Denver Cherry Creek",
    "Courtyard by Marriott Cherry Creek",
    "Courtyard Cherry Creek",
  ],
  "courtyard-by-marriott-denver-downtown-west": [
    "Courtyard by Marriott Denver Downtown West",
    "Courtyard Denver Downtown West",
  ],
  "hampton-inn-suites-denver-cherry-creek": [
    "Hampton Inn & Suites Denver-Cherry Creek",
    "Hampton Inn & Suites Cherry Creek",
    "Hampton Inn Cherry Creek",
  ],
  "grand-hyatt-denver": ["Grand Hyatt Denver", "Grand Hyatt"],
  "thompson-denver-by-hyatt": ["Thompson Denver", "Thompson"],
  "the-westin-denver-downtown": ["The Westin Denver Downtown", "The Westin"],
  "the-art-hotel-denver-curio-collection-by-hilton": ["The Art Hotel"],
  "le-mridien-denver-downtown": ["Le Méridien Denver Downtown", "Le Méridien"],
  "catbird-hotel": ["Catbird Hotel", "Catbird"],
  "the-ramble-hotel": ["The Ramble Hotel", "The Ramble"],
  "halcyon-a-hotel-in-cherry-creek-denver": ["Halcyon"],
  "clayton-hotel-members-club---cherry-creek-denver": ["Clayton Hotel", "Clayton"],
  "magnolia-hotel-denver-a-tribute-portfolio-hotel": ["Magnolia Hotel", "Magnolia"],
  "kimpton-hotel-monaco-denver": ["Kimpton Hotel Monaco", "Hotel Monaco", "Monaco"],
  "hotel-teatro": ["Hotel Teatro", "Teatro"],
  "sheraton-denver-downtown-hotel": ["Sheraton Denver Downtown"],
  "limelight-denver": ["Limelight Denver", "Limelight"],
  "ac-hotel-denver-rino": ["AC Hotel Denver RiNo"],
  "urban-cowboy-denver": ["Urban Cowboy Denver", "Urban Cowboy"],
  "apiary-hotel-belleview-station-denver": ["Apiary Hotel Belleview Station", "Apiary"],
  "the-westin-denver-international-airport": ["The Westin Denver International Airport"],
  "gaylord-rockies-resort-convention-center": ["Gaylord Rockies Resort", "Gaylord Rockies"],
  "hyatt-house-denverlakewood-at-belmar": ["Hyatt House Denver/Lakewood at Belmar", "Hyatt House at Belmar"],
  "hilton-garden-inn-arvada-denver": ["Hilton Garden Inn Arvada Denver", "Hilton Garden Inn Arvada"],
};

export interface HotelMention {
  slug: string;
  name: string;
  detailHref: string;
  bookHref: string;
  hasAffiliate: boolean;
}

export interface MentionIndex {
  /** Aliases sorted longest-first so the fullest name wins an overlap. */
  aliases: { alias: string; slug: string }[];
  bySlug: Record<string, HotelMention>;
}

export const EMPTY_MENTION_INDEX: MentionIndex = { aliases: [], bySlug: {} };

export function buildMentionIndex(pool: Place[]): MentionIndex {
  const bySlug: Record<string, HotelMention> = {};
  const aliases: { alias: string; slug: string }[] = [];

  for (const p of pool) {
    const list = ALIASES[p.slug];
    if (!list) continue;
    bySlug[p.slug] = {
      slug: p.slug,
      name: p.name,
      detailHref: `/denver/${p.neighborhood_slug}/hotels/${p.slug}`,
      bookHref: p.expedia_affiliate_url ?? expediaDenverHotelsUrl(),
      hasAffiliate: Boolean(p.expedia_affiliate_url),
    };
    for (const alias of list) aliases.push({ alias, slug: p.slug });
  }

  aliases.sort((a, b) => b.alias.length - a.alias.length);
  return { aliases, bySlug };
}

export function lookupMention(index: MentionIndex, slug: string): HotelMention | null {
  return index.bySlug[slug] ?? null;
}

const WORD = /[A-Za-z0-9]/;

export interface MentionHit {
  start: number;
  end: number;
  slug: string;
  text: string;
}

/**
 * Find the first un-linked mention of each hotel in `text`. `seen` is mutated:
 * a hotel links once per section, not once per paragraph, so the copy does not
 * turn into a wall of blue.
 */
export function findMentions(text: string, index: MentionIndex, seen: Set<string>): MentionHit[] {
  const hits: MentionHit[] = [];
  const claimed: boolean[] = new Array(text.length).fill(false);

  for (const { alias, slug } of index.aliases) {
    if (seen.has(slug)) continue;
    let from = 0;
    for (;;) {
      const i = text.indexOf(alias, from);
      if (i === -1) break;
      const end = i + alias.length;
      const beforeOk = i === 0 || !WORD.test(text[i - 1]);
      const afterOk = end >= text.length || !WORD.test(text[end]);
      const free = !claimed.slice(i, end).some(Boolean);
      if (beforeOk && afterOk && free) {
        for (let k = i; k < end; k++) claimed[k] = true;
        hits.push({ start: i, end, slug, text: alias });
        seen.add(slug);
        break;
      }
      from = i + 1;
    }
  }

  return hits.sort((a, b) => a.start - b.start);
}

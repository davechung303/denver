export interface Subcategory {
  slug: string;
  name: string;
  description: (neighborhoodName: string) => string;
  types: string[]; // Google place types to match against place.types
  searchQuery: string; // used when filtered results are sparse
}

export const RESTAURANT_SUBCATEGORIES: Subcategory[] = [
  {
    slug: "japanese",
    name: "Japanese & Sushi",
    description: (n) =>
      `Sushi, ramen, izakaya — ${n} has a surprisingly strong Japanese food scene for a landlocked city.`,
    types: ["japanese_restaurant", "sushi_restaurant", "ramen_restaurant"],
    searchQuery: "Japanese restaurant sushi ramen",
  },
  {
    slug: "mexican",
    name: "Mexican",
    description: (n) =>
      `Denver's proximity to New Mexico and a strong local community means the Mexican food in ${n} punches well above its weight.`,
    types: ["mexican_restaurant"],
    searchQuery: "Mexican restaurant tacos",
  },
  {
    slug: "italian",
    name: "Italian",
    description: (n) =>
      `From old-school red sauce joints to modern pasta bars, ${n}'s Italian scene has range.`,
    types: ["italian_restaurant"],
    searchQuery: "Italian restaurant pasta",
  },
  {
    slug: "pizza",
    name: "Pizza",
    description: (n) =>
      `${n} is not a pizza city by reputation, but the spots that do it right here are genuinely great.`,
    types: ["pizza_restaurant"],
    searchQuery: "pizza restaurant",
  },
  {
    slug: "brunch",
    name: "Brunch & Breakfast",
    description: (n) =>
      `Denver takes brunch seriously. The weekend lines in ${n} will tell you everything you need to know.`,
    types: ["breakfast_restaurant", "brunch_restaurant"],
    searchQuery: "brunch breakfast restaurant",
  },
  {
    slug: "burgers",
    name: "Burgers & American",
    description: (n) =>
      `A great burger is hard to fake. These are the spots in ${n} that actually get it right.`,
    types: ["hamburger_restaurant", "american_restaurant"],
    searchQuery: "burger restaurant American food",
  },
  {
    slug: "asian",
    name: "Asian",
    description: (n) =>
      `Chinese, Thai, Vietnamese, Korean — ${n}'s Asian food scene is more diverse than most people expect.`,
    types: [
      "chinese_restaurant",
      "thai_restaurant",
      "vietnamese_restaurant",
      "korean_restaurant",
      "asian_restaurant",
    ],
    searchQuery: "Asian restaurant Chinese Thai Vietnamese Korean",
  },
  {
    slug: "mediterranean",
    name: "Mediterranean & Middle Eastern",
    description: (n) =>
      `From mezze to shawarma, the Mediterranean spots in ${n} are some of the most underrated in the city.`,
    types: ["mediterranean_restaurant", "middle_eastern_restaurant", "greek_restaurant"],
    searchQuery: "Mediterranean Middle Eastern Greek restaurant",
  },
  {
    slug: "steakhouse",
    name: "Steakhouses",
    description: (n) =>
      `Colorado beef is the real deal. The steakhouses in ${n} know it and deliver accordingly.`,
    types: ["steak_house"],
    searchQuery: "steakhouse steak restaurant",
  },
  {
    slug: "vegetarian",
    name: "Vegetarian & Vegan",
    description: (n) =>
      `${n}'s plant-based scene has grown up fast. These aren't afterthought menus — they're the whole point.`,
    types: ["vegetarian_restaurant", "vegan_restaurant"],
    searchQuery: "vegetarian vegan restaurant",
  },
  {
    slug: "seafood",
    name: "Seafood",
    description: (n) =>
      `Landlocked state, but don't count out the seafood. The places in ${n} that do it well fly their fish in fresh.`,
    types: ["seafood_restaurant"],
    searchQuery: "seafood restaurant fish",
  },
  {
    slug: "bbq",
    name: "BBQ",
    description: (n) =>
      `Colorado has its own BBQ identity — a mix of Texas, Kansas City, and high-altitude improvisation. ${n} has some good ones.`,
    types: ["barbecue_restaurant"],
    searchQuery: "BBQ barbecue restaurant",
  },
];

export const BAR_SUBCATEGORIES: Subcategory[] = [
  {
    slug: "breweries",
    name: "Craft Breweries",
    description: (n) =>
      `Colorado's craft beer scene is world-class. The taprooms in ${n} are some of the best in the state.`,
    types: ["brewery"],
    searchQuery: "craft brewery taproom beer",
  },
  {
    slug: "cocktail-bars",
    name: "Cocktail Bars",
    description: (n) =>
      `${n}'s cocktail bar scene has gotten serious. These are the places that take what's in the glass as seriously as what's on the wall.`,
    types: ["cocktail_bar", "bar"],
    searchQuery: "cocktail bar speakeasy craft cocktails",
  },
  {
    slug: "wine-bars",
    name: "Wine Bars",
    description: (n) =>
      `A solid wine program is harder to pull off than it looks. These spots in ${n} do it right.`,
    types: ["wine_bar"],
    searchQuery: "wine bar",
  },
  {
    slug: "sports-bars",
    name: "Sports Bars",
    description: (n) =>
      `Denver is a serious sports town. These ${n} spots have the screens, the sound, and the crowd to prove it.`,
    types: ["sports_bar"],
    searchQuery: "sports bar",
  },
];

export const SUBCATEGORIES: Record<string, Subcategory[]> = {
  restaurants: RESTAURANT_SUBCATEGORIES,
  bars: BAR_SUBCATEGORIES,
};

export function getSubcategory(categorySlug: string, slug: string): Subcategory | undefined {
  return SUBCATEGORIES[categorySlug]?.find((s) => s.slug === slug);
}

export function getSubcategories(categorySlug: string): Subcategory[] {
  return SUBCATEGORIES[categorySlug] ?? [];
}

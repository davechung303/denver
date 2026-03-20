export interface Category {
  slug: string;
  name: string;
  searchQuery: string; // appended to neighborhood name in Places API search
}

export interface Neighborhood {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  gradient: string;
  searchName: string; // human-readable name used in Places API searches
}

export const CATEGORIES: Category[] = [
  { slug: "restaurants", name: "Restaurants", searchQuery: "best restaurants" },
  { slug: "hotels", name: "Hotels", searchQuery: "hotels" },
  { slug: "bars", name: "Bars & Drinks", searchQuery: "bars and nightlife" },
  { slug: "things-to-do", name: "Things To Do", searchQuery: "things to do attractions" },
  { slug: "coffee", name: "Coffee", searchQuery: "coffee shops cafes" },
];

export const NEIGHBORHOODS: Neighborhood[] = [
  {
    slug: "rino",
    name: "RiNo",
    tagline: "River North Art District",
    description:
      "Murals around every corner, world-class breweries, and some of the city's best restaurants. RiNo is where Denver's art scene lives.",
    gradient: "from-rose-600 to-orange-500",
    searchName: "River North Art District RiNo Denver Colorado",
  },
  {
    slug: "lodo",
    name: "LoDo",
    tagline: "Lower Downtown",
    description:
      "Historic cobblestone streets, Union Station, rooftop bars, and Coors Field. The beating heart of downtown Denver.",
    gradient: "from-slate-700 to-slate-500",
    searchName: "LoDo Lower Downtown Denver Colorado",
  },
  {
    slug: "capitol-hill",
    name: "Capitol Hill",
    tagline: "Eclectic & Electric",
    description:
      "Dive bars, live music venues, vintage shops, and incredible street art. Cap Hill has a personality unlike anywhere else in the city.",
    gradient: "from-violet-700 to-purple-500",
    searchName: "Capitol Hill Denver Colorado",
  },
  {
    slug: "highlands",
    name: "Highlands",
    tagline: "Views & Vibes",
    description:
      "Stunning views of the skyline, the best brunch spots in Denver, and a neighborhood that somehow stays cool without trying.",
    gradient: "from-emerald-700 to-teal-500",
    searchName: "Highlands LoHi Denver Colorado",
  },
  {
    slug: "cherry-creek",
    name: "Cherry Creek",
    tagline: "Upscale & Walkable",
    description:
      "Denver's upscale shopping and dining district. Local boutiques, excellent restaurants, and a farmers market worth the trip.",
    gradient: "from-amber-600 to-yellow-500",
    searchName: "Cherry Creek Denver Colorado",
  },
  {
    slug: "five-points",
    name: "Five Points",
    tagline: "Jazz Heritage & Culture",
    description:
      "Once called the Harlem of the West, Five Points is rich with jazz history, soul food, and a creative energy that's coming back strong.",
    gradient: "from-orange-700 to-amber-500",
    searchName: "Five Points Denver Colorado",
  },
  {
    slug: "cole",
    name: "Cole",
    tagline: "Denver's Hidden Gem",
    description:
      "One of Denver's most underrated neighborhoods. Cole is quietly becoming one of the most interesting places to eat and drink in the city.",
    gradient: "from-lime-700 to-green-500",
    searchName: "Cole neighborhood Denver Colorado",
  },
  {
    slug: "washington-park",
    name: "Washington Park",
    tagline: "Parks & Coffee",
    description:
      "Built around one of Denver's most beautiful parks. Wash Park is the go-to for morning runs, coffee hangs, and underrated brunch spots.",
    gradient: "from-sky-700 to-blue-500",
    searchName: "Washington Park Denver Colorado",
  },
];

export function getNeighborhood(slug: string): Neighborhood | undefined {
  return NEIGHBORHOODS.find((n) => n.slug === slug);
}

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

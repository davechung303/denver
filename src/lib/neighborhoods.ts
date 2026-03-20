export interface Category {
  slug: string;
  name: string;
  searchQuery: string; // appended to neighborhood name in Places API search
  extraQueries?: string[]; // additional parallel searches to supplement sparse results
}

export interface Neighborhood {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  gradient: string;
  searchName: string; // human-readable name used in Places API searches
  lat: number; // center coordinates for maps
  lng: number;
}

export const CATEGORIES: Category[] = [
  { slug: "restaurants", name: "Restaurants", searchQuery: "best restaurants" },
  { slug: "hotels", name: "Hotels", searchQuery: "hotels" },
  { slug: "bars", name: "Bars & Drinks", searchQuery: "bars and nightlife" },
  {
    slug: "things-to-do",
    name: "Things To Do",
    searchQuery: "things to do attractions",
    extraQueries: ["art galleries and museums", "live music venues entertainment", "parks recreation outdoor activities"],
  },
  {
    slug: "coffee",
    name: "Coffee",
    searchQuery: "coffee shops cafes",
    extraQueries: ["tea shops juice bars", "bakeries pastry shops"],
  },
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
    lat: 39.7656, lng: -104.9869,
  },
  {
    slug: "lodo",
    name: "LoDo",
    tagline: "Lower Downtown",
    description:
      "Historic cobblestone streets, Union Station, rooftop bars, and Coors Field. The beating heart of downtown Denver.",
    gradient: "from-slate-700 to-slate-500",
    searchName: "LoDo Lower Downtown Denver Colorado",
    lat: 39.7527, lng: -104.9987,
  },
  {
    slug: "capitol-hill",
    name: "Capitol Hill",
    tagline: "Eclectic & Electric",
    description:
      "Dive bars, live music venues, vintage shops, and incredible street art. Cap Hill has a personality unlike anywhere else in the city.",
    gradient: "from-violet-700 to-purple-500",
    searchName: "Capitol Hill Denver Colorado",
    lat: 39.7348, lng: -104.9782,
  },
  {
    slug: "highlands",
    name: "Highlands",
    tagline: "Views & Vibes",
    description:
      "Stunning views of the skyline, the best brunch spots in Denver, and a neighborhood that somehow stays cool without trying.",
    gradient: "from-emerald-700 to-teal-500",
    searchName: "Highlands LoHi Denver Colorado",
    lat: 39.7604, lng: -105.0153,
  },
  {
    slug: "cherry-creek",
    name: "Cherry Creek",
    tagline: "Upscale & Walkable",
    description:
      "Denver's upscale shopping and dining district. Local boutiques, excellent restaurants, and a farmers market worth the trip.",
    gradient: "from-amber-600 to-yellow-500",
    searchName: "Cherry Creek Denver Colorado",
    lat: 39.7155, lng: -104.9522,
  },
  {
    slug: "five-points",
    name: "Five Points",
    tagline: "Jazz Heritage & Culture",
    description:
      "Once called the Harlem of the West, Five Points is rich with jazz history, soul food, and a creative energy that's coming back strong.",
    gradient: "from-orange-700 to-amber-500",
    searchName: "Five Points Denver Colorado",
    lat: 39.7544, lng: -104.9742,
  },
  {
    slug: "cole",
    name: "Cole",
    tagline: "Denver's Hidden Gem",
    description:
      "One of Denver's most underrated neighborhoods. Cole is quietly becoming one of the most interesting places to eat and drink in the city.",
    gradient: "from-lime-700 to-green-500",
    searchName: "Cole neighborhood Denver Colorado",
    lat: 39.7665, lng: -104.9588,
  },
  {
    slug: "washington-park",
    name: "Washington Park",
    tagline: "Parks & Coffee",
    description:
      "Built around one of Denver's most beautiful parks. Wash Park is the go-to for morning runs, coffee hangs, and underrated brunch spots.",
    gradient: "from-sky-700 to-blue-500",
    searchName: "Washington Park Denver Colorado",
    lat: 39.7112, lng: -104.9638,
  },
];

// Unique descriptions per neighborhood × category combination
export const CATEGORY_DESCRIPTIONS: Record<string, Record<string, string>> = {
  rino: {
    restaurants: "RiNo's food scene punches way above its weight. You've got James Beard-level cooking alongside hole-in-the-wall gems — all within walking distance of the same murals.",
    bars: "Craft beer is practically the currency of RiNo. Between Odell, Breckenridge, and a dozen taprooms you've probably never heard of, this is the best neighborhood in Denver to just wander and drink.",
    coffee: "RiNo takes its coffee as seriously as its art. Expect single-origin pour-overs, exposed brick, and baristas who can actually tell you where the beans came from.",
    hotels: "Staying in RiNo puts you in the middle of Denver's most creative neighborhood — walking distance to restaurants, breweries, and galleries that don't exist anywhere else in the city.",
    "things-to-do": "Between the art walks, weekend markets, and brewery tours, you could spend a full weekend in RiNo and not repeat yourself once.",
  },
  lodo: {
    restaurants: "LoDo has everything from pre-game bites near Coors Field to white-tablecloth dinners steps from Union Station. The restaurant density here is unmatched in Denver.",
    bars: "Rooftop bars, game-day sports bars, and cocktail lounges tucked into historic brick buildings — LoDo's bar scene covers every occasion.",
    coffee: "Whether you need a quick espresso before catching the train or a spot to actually sit and work, LoDo's coffee shops are built for the commuter and the wanderer alike.",
    hotels: "Union Station alone is worth the trip, but there are strong options at every price point in LoDo — all walkable to the best of downtown Denver.",
    "things-to-do": "Coors Field, Union Station, Larimer Square — LoDo is the most tourist-friendly corner of Denver, but locals keep coming back for good reason.",
  },
  "capitol-hill": {
    restaurants: "Cap Hill feeds the night owls, the artists, and the locals who want good food without the pretense. The late-night options here are some of the best in the city.",
    bars: "Dive bars, craft cocktail rooms, and live music venues share the same blocks. Capitol Hill's bar scene is the most character-filled in Denver — not the fanciest, but the most fun.",
    coffee: "Indie coffee shops with strong opinions and strong pours. Cap Hill is where Denver's creative class goes to caffeinate and figure out their next move.",
    hotels: "Capitol Hill isn't known for hotels, but it's central enough to be a smart base — close to everything without the downtown premium.",
    "things-to-do": "The Molly Brown House, Cheesman Park, and some of the best live music venues in Denver. Cap Hill rewards the curious.",
  },
  highlands: {
    restaurants: "Highlands has some of the best restaurants in Denver, full stop. The LoHi stretch in particular has a concentration of great spots that would hold up in any food city.",
    bars: "The views of downtown from the Highlands bars are genuinely hard to beat. Come for the cocktails, stay for the skyline.",
    coffee: "The morning coffee culture in Highlands is real. These are neighborhood spots where the regulars have their order memorized and nobody's in a rush.",
    hotels: "Staying in Highlands gives you a residential feel with fast access to downtown. It's where people who've visited Denver before choose to stay the second time.",
    "things-to-do": "Walk the Highland Bridge for the best view of downtown, explore Sloan's Lake, and wander the 32nd Ave corridor for good food and local shops.",
  },
  "cherry-creek": {
    restaurants: "Cherry Creek's restaurant scene leans upscale without being stuffy. Some of Denver's best-executed food is happening here, from farm-to-table to destination sushi.",
    bars: "The cocktail bars in Cherry Creek are polished and intentional — great for a date night or a business drink where the setting actually matters.",
    coffee: "Cherry Creek coffee shops tend to be design-forward and quieter than RiNo. Good for a focused morning or catching up without shouting over music.",
    hotels: "Cherry Creek hotels are among Denver's nicest. You're close to excellent shopping and restaurants, and far enough from downtown that it actually stays quiet.",
    "things-to-do": "The Cherry Creek Farmers Market, the Arts Festival, and boutique shopping that's actually worth your time — Cherry Creek earns its reputation.",
  },
  "five-points": {
    restaurants: "Five Points is where Denver's soul food history lives alongside a new wave of chefs who are paying attention to what came before them.",
    bars: "Historic jazz venues and newer craft cocktail bars share the same streets. The Five Points bar scene is eclectic by design and better for it.",
    coffee: "Smaller coffee spots with strong neighborhood identity. Five Points is not trying to be the next RiNo — and that's exactly what makes it interesting.",
    hotels: "Five Points sits close to downtown and RiNo but feels like its own place. A good base if you want to be near the action without being in it.",
    "things-to-do": "The Blair-Caldwell African American Research Library, the annual Jazz Festival, and murals that tell Denver's actual history — not just the tourist version.",
  },
  cole: {
    restaurants: "Cole's restaurant scene is small but mighty — the kind of spots the people who live there aren't in a hurry to share with everyone else.",
    bars: "A handful of low-key bars with the feel of a neighborhood that hasn't been discovered yet. Drink here before everyone else figures it out.",
    coffee: "Quiet neighborhood coffee shops where the regulars actually know each other. This is what coffee culture looks like before it gets trendy.",
    hotels: "Cole doesn't have many hotels, but it's close enough to RiNo and Five Points to work as a base if you want something genuinely off the beaten path.",
    "things-to-do": "City of Cuernavaca Park, Cole's underrated residential architecture, and easy access to the best of RiNo without the weekend crowds.",
  },
  "washington-park": {
    restaurants: "The dining corridor on South Gaylord and Old South Pearl is one of Denver's most walkable strips. Great options for every meal of the day, none of them trying too hard.",
    bars: "Wash Park bars have a real neighborhood feel — these are the spots where you run into people you know. More laid-back than downtown, more cocktail-forward than you'd expect.",
    coffee: "Washington Park is Denver's best neighborhood for a morning coffee before a walk around the lake. The cafes here are built around the outdoor lifestyle.",
    hotels: "Wash Park is mostly residential — not many hotels, but it's a peaceful base away from downtown with great walkability and the park right there.",
    "things-to-do": "Washington Park is one of the best urban parks in Colorado. Running paths, paddleboating, volleyball, and some of the best people-watching in the city on any warm day.",
  },
};

// Map Google place types to human-readable cuisine/category tags
const TYPE_TAG_MAP: Record<string, string> = {
  japanese_restaurant: "Japanese",
  sushi_restaurant: "Sushi",
  ramen_restaurant: "Ramen",
  korean_restaurant: "Korean",
  chinese_restaurant: "Chinese",
  thai_restaurant: "Thai",
  vietnamese_restaurant: "Vietnamese",
  indian_restaurant: "Indian",
  mexican_restaurant: "Mexican",
  italian_restaurant: "Italian",
  pizza_restaurant: "Pizza",
  american_restaurant: "American",
  hamburger_restaurant: "Burgers",
  seafood_restaurant: "Seafood",
  steak_house: "Steakhouse",
  vegetarian_restaurant: "Vegetarian",
  vegan_restaurant: "Vegan",
  breakfast_restaurant: "Breakfast",
  brunch_restaurant: "Brunch",
  mediterranean_restaurant: "Mediterranean",
  middle_eastern_restaurant: "Middle Eastern",
  french_restaurant: "French",
  spanish_restaurant: "Spanish",
  greek_restaurant: "Greek",
  barbecue_restaurant: "BBQ",
  sandwich_shop: "Sandwiches",
  diner: "Diner",
  cocktail_bar: "Cocktails",
  wine_bar: "Wine Bar",
  sports_bar: "Sports Bar",
  brewery: "Brewery",
  bar: "Bar",
  night_club: "Nightclub",
  coffee_shop: "Coffee",
  cafe: "Café",
  bakery: "Bakery",
  hotel: "Hotel",
  extended_stay_hotel: "Extended Stay",
  boutique_hotel: "Boutique Hotel",
  resort_hotel: "Resort",
  art_gallery: "Gallery",
  museum: "Museum",
  park: "Park",
  tourist_attraction: "Attraction",
  bowling_alley: "Bowling",
  movie_theater: "Cinema",
  amusement_park: "Amusement",
  spa: "Spa",
  gym: "Gym",
};

export function getPlaceTag(types: string[] | null): string | null {
  if (!types) return null;
  for (const type of types) {
    if (TYPE_TAG_MAP[type]) return TYPE_TAG_MAP[type];
  }
  return null;
}

// [minLat, maxLat, minLng, maxLng]
export const NEIGHBORHOOD_BOUNDS: Record<string, [number, number, number, number]> = {
  rino:             [39.755, 39.780, -104.998, -104.970],
  lodo:             [39.745, 39.760, -105.005, -104.988],
  "capitol-hill":   [39.727, 39.745, -104.985, -104.965],
  highlands:        [39.753, 39.775, -105.025, -105.000],
  "cherry-creek":   [39.708, 39.725, -104.960, -104.940],
  "five-points":    [39.747, 39.762, -104.980, -104.960],
  cole:             [39.758, 39.775, -104.970, -104.950],
  "washington-park":[39.700, 39.722, -104.975, -104.950],
};

export function isInNeighborhood(lat: number | null, lng: number | null, slug: string): boolean {
  if (!lat || !lng) return false;
  const bounds = NEIGHBORHOOD_BOUNDS[slug];
  if (!bounds) return false;
  const [minLat, maxLat, minLng, maxLng] = bounds;
  return lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng;
}

export function getNeighborhood(slug: string): Neighborhood | undefined {
  return NEIGHBORHOODS.find((n) => n.slug === slug);
}

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

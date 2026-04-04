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
  gradient: string; // CSS fallback color while image loads
  image: string;    // Unsplash photo URL — swap any ID at unsplash.com/photos/{id}
  searchName: string; // human-readable name used in Places API searches
  lat: number; // center coordinates for maps
  lng: number;
  searchRadius?: number; // Places API search radius in meters (default 1500)
  stay22EmbedId?: string; // Stay22 hotel map embed ID
}

export const CATEGORIES: Category[] = [
  { slug: "restaurants", name: "Restaurants", searchQuery: "best restaurants" },
  { slug: "hotels", name: "Hotels", searchQuery: "hotels" },
  { slug: "bars", name: "Bars & Drinks", searchQuery: "bars and nightlife" },
  {
    slug: "things-to-do",
    name: "Things To Do",
    searchQuery: "things to do activities attractions",
  },
  {
    slug: "coffee",
    name: "Coffee",
    searchQuery: "coffee shops cafes",
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
    image: "https://images.unsplash.com/photo-1573297627466-6bed413a43f1?auto=format&fit=crop&w=1200&q=80",
    searchName: "River North Art District RiNo Denver Colorado",
    lat: 39.7656, lng: -104.9869,
    stay22EmbedId: "69d052a831f29079785728f1",
  },
  {
    slug: "lodo",
    name: "LoDo",
    tagline: "Lower Downtown",
    description:
      "Historic cobblestone streets, Union Station, rooftop bars, and Coors Field. The beating heart of downtown Denver.",
    gradient: "from-slate-700 to-slate-500",
    image: "https://images.unsplash.com/photo-1566036604088-319bcef67086?auto=format&fit=crop&w=1200&q=80",
    searchName: "LoDo Lower Downtown Denver Colorado",
    lat: 39.7527, lng: -104.9987,
    stay22EmbedId: "69d053e731f2907978572a8b",
    searchRadius: 2000,
  },
  {
    slug: "capitol-hill",
    name: "Capitol Hill",
    tagline: "Eclectic & Electric",
    description:
      "Dive bars, live music venues, vintage shops, and incredible street art. Cap Hill has a personality unlike anywhere else in the city.",
    gradient: "from-violet-700 to-purple-500",
    image: "https://images.unsplash.com/photo-1586193771953-929042f3a381?auto=format&fit=crop&w=1200&q=80",
    searchName: "Capitol Hill Denver Colorado",
    lat: 39.7348, lng: -104.9782,
    stay22EmbedId: "69d052cb5021760e928bc3db",
  },
  {
    slug: "highlands",
    name: "Highlands",
    tagline: "Views & Vibes",
    description:
      "Stunning views of the skyline, the best brunch spots in Denver, and a neighborhood that somehow stays cool without trying.",
    gradient: "from-emerald-700 to-teal-500",
    image: "https://images.unsplash.com/photo-1546156929-a4c0ac411f47?auto=format&fit=crop&w=1200&q=80",
    stay22EmbedId: "69d0540e31f2907978572aee",
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
    image: "https://images.unsplash.com/photo-1548966595-d87fccfc8a7f?auto=format&fit=crop&w=1200&q=80",
    searchName: "Cherry Creek Denver Colorado",
    lat: 39.7155, lng: -104.9522,
    stay22EmbedId: "69d052e9bfb4999cdf000553",
  },
  {
    slug: "five-points",
    name: "Five Points",
    tagline: "Jazz Heritage & Culture",
    description:
      "Once called the Harlem of the West, Five Points is rich with jazz history, soul food, and a creative energy that's coming back strong.",
    gradient: "from-orange-700 to-amber-500",
    image: "https://images.unsplash.com/photo-1677051949386-d999c9076424?auto=format&fit=crop&w=1200&q=80",
    searchName: "Five Points Denver Colorado",
    lat: 39.7544, lng: -104.9742,
    searchRadius: 4000,
    stay22EmbedId: "69d054248ef49a292b4d71e1",
  },
  {
    slug: "cole",
    name: "Cole",
    tagline: "Denver's Hidden Gem",
    description:
      "One of Denver's most underrated neighborhoods. Cole is quietly becoming one of the most interesting places to eat and drink in the city.",
    gradient: "from-lime-700 to-green-500",
    image: "https://images.unsplash.com/photo-1664736608475-0460bbe37bc2?auto=format&fit=crop&w=1200&q=80",
    searchName: "Cole neighborhood Denver Colorado",
    lat: 39.7665, lng: -104.9588,
    stay22EmbedId: "69d053065021760e928bc417",
  },
  {
    slug: "washington-park",
    name: "Washington Park",
    tagline: "Parks & Coffee",
    description:
      "Built around one of Denver's most beautiful parks. Wash Park is the go-to for morning runs, coffee hangs, and underrated brunch spots.",
    gradient: "from-sky-700 to-blue-500",
    image: "https://images.unsplash.com/photo-1632714393265-9adbc6ab8a91?auto=format&fit=crop&w=1200&q=80",
    searchName: "Washington Park Denver Colorado",
    lat: 39.7112, lng: -104.9638,
    stay22EmbedId: "69d05442bfb4999cdf000704",
  },
  {
    slug: "baker",
    name: "Baker",
    tagline: "South Broadway's Best",
    description:
      "South Broadway runs through Baker and brings with it some of Denver's best dive bars, vintage shops, and no-frills restaurants. This is the neighborhood that doesn't care what's trendy.",
    gradient: "from-red-700 to-rose-500",
    image: "https://images.unsplash.com/photo-1548966595-d87fccfc8a7f?auto=format&fit=crop&w=1200&q=80",
    searchName: "Baker neighborhood South Broadway Denver Colorado",
    lat: 39.7135, lng: -104.9862,
    stay22EmbedId: "69d0532231f290797857297a",
  },
  {
    slug: "golden-triangle",
    name: "Golden Triangle",
    tagline: "Art & Architecture",
    description:
      "Home to the Denver Art Museum, Clyfford Still Museum, and the History Colorado Center. The Golden Triangle is where culture actually lives in this city.",
    gradient: "from-fuchsia-700 to-pink-500",
    image: "https://images.unsplash.com/photo-1586193771953-929042f3a381?auto=format&fit=crop&w=1200&q=80",
    searchName: "Golden Triangle Denver Colorado Santa Fe Arts District",
    lat: 39.7356, lng: -104.9908,
    stay22EmbedId: "69d0545e8ef49a292b4d7220",
  },
  {
    slug: "uptown",
    name: "Uptown",
    tagline: "Restaurant Row",
    description:
      "17th Avenue between downtown and City Park is one of the most underrated dining corridors in Denver. Uptown has been quietly great for years without making a big deal about it.",
    gradient: "from-cyan-700 to-teal-500",
    image: "https://images.unsplash.com/photo-1702568681326-7aff5eb7e80b?auto=format&fit=crop&w=1200&q=80",
    searchName: "Uptown Denver Colorado 17th Avenue restaurant row",
    lat: 39.7432, lng: -104.9702,
    stay22EmbedId: "69d0533a8ef49a292b4d708d",
  },
  {
    slug: "sloan-lake",
    name: "Sloan Lake",
    tagline: "Lakeside Living",
    description:
      "Centered around one of Denver's largest lakes, Sloan Lake has a neighborhood feel that's hard to find this close to downtown. The food scene has quietly gotten really good.",
    gradient: "from-blue-700 to-cyan-500",
    image: "https://images.unsplash.com/photo-1712403235961-3d0a14d8e33b?auto=format&fit=crop&w=1200&q=80",
    searchName: "Sloan Lake Denver Colorado Edgewater",
    lat: 39.7589, lng: -105.0356,
    stay22EmbedId: "69d0547d31f2907978572baa",
  },
  {
    slug: "berkeley",
    name: "Berkeley",
    tagline: "Tennyson Street",
    description:
      "Tennyson Street is one of the most walkable strips in Denver — independent coffee shops, galleries, and restaurants that have been here for years alongside genuinely good newcomers.",
    gradient: "from-lime-600 to-green-400",
    image: "https://images.unsplash.com/photo-1546156929-a4c0ac411f47?auto=format&fit=crop&w=1200&q=80",
    searchName: "Berkeley Denver Colorado Tennyson Street",
    lat: 39.7784, lng: -105.0388,
    stay22EmbedId: "69d05359bfb4999cdf0005eb",
    searchRadius: 2500,
  },
  {
    slug: "platt-park",
    name: "Platt Park",
    tagline: "South Pearl Street",
    description:
      "South Pearl Street is the kind of walkable neighborhood strip that most cities wish they had. Platt Park feels residential in the best way — like the locals actually chose it.",
    gradient: "from-pink-700 to-rose-400",
    image: "https://images.unsplash.com/photo-1709689702529-6fa1f343e108?auto=format&fit=crop&w=1200&q=80",
    searchName: "Platt Park Denver Colorado South Pearl Street",
    lat: 39.6962, lng: -104.9762,
    stay22EmbedId: "69d054b5bfb4999cdf000781",
  },
  {
    slug: "jefferson-park",
    name: "Jefferson Park",
    tagline: "Downtown Views",
    description:
      "Jefferson Park sits just west of downtown with some of the best skyline views in the city. The bar and restaurant scene has grown fast — and most people still haven't found it.",
    gradient: "from-indigo-700 to-violet-500",
    image: "https://images.unsplash.com/photo-1619856699906-09e1f58c98b1?auto=format&fit=crop&w=1200&q=80",
    searchName: "Jefferson Park Denver Colorado Jeff Park",
    lat: 39.7535, lng: -105.0168,
    stay22EmbedId: "69d0538131f29079785729f4",
    searchRadius: 3500,
  },
  {
    slug: "curtis-park",
    name: "Curtis Park",
    tagline: "Historic & Happening",
    description:
      "One of Denver's oldest neighborhoods, Curtis Park sits between Five Points and RiNo with the quiet confidence of a place that was here before either of those neighborhoods got cool.",
    gradient: "from-orange-600 to-red-500",
    image: "https://images.unsplash.com/photo-1483937107025-27d8bebc7074?auto=format&fit=crop&w=1200&q=80",
    searchName: "Curtis Park Denver Colorado",
    lat: 39.7562, lng: -104.9672,
    stay22EmbedId: "69d054cf8ef49a292b4d7342",
  },
  {
    slug: "downtown",
    name: "Downtown",
    tagline: "The Center of It All",
    description:
      "The 16th Street Mall, Larimer Square, Civic Center Park — downtown Denver is more walkable than most people give it credit for, and the food scene has gotten significantly better.",
    gradient: "from-zinc-700 to-slate-500",
    image: "https://images.unsplash.com/photo-1677051949386-d999c9076424?auto=format&fit=crop&w=1200&q=80",
    searchName: "Downtown Denver Colorado 16th Street Mall",
    lat: 39.7420, lng: -104.9876,
    stay22EmbedId: "69d053b3bfb4999cdf00063b",
  },
  {
    slug: "denver-suburbs",
    name: "Denver Suburbs",
    tagline: "Aurora, Lakewood & Beyond",
    description:
      "Aurora, Lakewood, Littleton, Englewood — the suburbs have gotten genuinely interesting. Some of the best ethnic food in the entire metro is out here, and most Denverites haven't found it yet.",
    gradient: "from-stone-600 to-neutral-500",
    image: "https://images.unsplash.com/photo-1613003492754-a022330915ac?auto=format&fit=crop&w=1200&q=80",
    searchName: "Aurora Lakewood Littleton Englewood Denver suburbs Colorado",
    lat: 39.7294, lng: -104.8319,
    stay22EmbedId: "69d054f1bfb4999cdf0007de",
  },
  {
    slug: "airport",
    name: "DEN Airport Area",
    tagline: "DIA & Gaylord Rockies",
    description:
      "DEN is one of the biggest airports in the world — confusing if you don't know it, genuinely great if you do. Plus the Gaylord Rockies is worth a visit even if you're not flying anywhere.",
    gradient: "from-blue-800 to-indigo-600",
    image: "https://images.unsplash.com/photo-1698760000085-1b0af6df057e?auto=format&fit=crop&w=1200&q=80",
    stay22EmbedId: "69d053d05021760e928bc4cb",
    searchName: "Denver International Airport DIA Colorado",
    lat: 39.856, lng: -104.674,
    searchRadius: 8000,
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
  baker: {
    restaurants: "South Broadway is one of the better stretches for food in Denver — unpretentious spots that have been around long enough to actually be good, plus a few newer places that fit right in.",
    bars: "Baker's dive bar scene on South Broadway is the real deal. These are the bars that have no interest in being trendy, and that's exactly why people keep coming back.",
    coffee: "Neighborhood coffee shops that match Baker's vibe — nothing precious, just good coffee in spots that feel like they belong to the people who actually live here.",
    hotels: "Baker doesn't have many hotels, but South Broadway puts you within striking distance of both downtown and the South Denver neighborhoods worth exploring.",
    "things-to-do": "The antique shops and vintage stores along South Broadway are legitimately worth browsing. Baker also has easy access to the Santa Fe Arts District for gallery walks.",
  },
  "golden-triangle": {
    restaurants: "The Golden Triangle has a quieter restaurant scene than RiNo, but what's here is worth knowing — good spots that don't rely on foot traffic from the museum crowd.",
    bars: "A handful of low-key bars that serve the after-museum crowd and the neighborhood regulars equally. Not the biggest scene, but a real one.",
    coffee: "Coffee shops near the museums that are good enough to actually go out of your way for, not just because they're convenient.",
    hotels: "Staying in the Golden Triangle puts you steps from the Denver Art Museum and a short walk from everything in downtown and Capitol Hill.",
    "things-to-do": "The Denver Art Museum, Clyfford Still Museum, and History Colorado Center are all here. This is the highest concentration of serious cultural institutions in the city.",
  },
  uptown: {
    restaurants: "17th Avenue is one of the most underrated dining streets in Denver. The block between downtown and City Park has been quietly great for years — longer than most people realize.",
    bars: "Uptown's bar scene is more neighborhood than nightlife — the kind of spots where you can actually have a conversation and the bartender remembers what you drink.",
    coffee: "Good independent cafes that serve the working professionals and young residents who make up most of Uptown's daytime crowd.",
    hotels: "Uptown sits between downtown and City Park, making it one of the better-located neighborhoods in Denver for visitors who want to explore both.",
    "things-to-do": "City Park is a short walk away, with the Denver Zoo and Denver Museum of Nature and Science. Uptown is also a good base for walking to both downtown and the Cap Hill music scene.",
  },
  "sloan-lake": {
    restaurants: "The food scene around Sloan Lake and into Edgewater has gotten genuinely good. There's a stretch of restaurants on Sheridan that's worth the drive even from across town.",
    bars: "The bars around Sloan Lake are the kind of neighborhood spots that don't show up on anyone's best-of list, but the locals aren't complaining.",
    coffee: "Laid-back coffee shops that match the pace of a neighborhood built around a lake. Good for a slow morning before a walk around the water.",
    hotels: "Sloan Lake is close to Highlands and Jefferson Park — a residential feel with fast access to some of Denver's best restaurants and bars.",
    "things-to-do": "The 2.6-mile loop around Sloan Lake is one of the better urban walks in Denver. The park hosts events in summer, and the skyline views from the west side of the lake are worth the trip.",
  },
  berkeley: {
    restaurants: "Tennyson Street has a concentration of good independent restaurants that would be notable in any neighborhood. The fact that most people outside northwest Denver haven't found it yet is their loss.",
    bars: "The bars on Tennyson are the kind that make you want to move to the neighborhood — good drinks, no attitude, and a crowd that's actually from here.",
    coffee: "Some of Denver's best independent coffee is on Tennyson Street. Berkeley takes its coffee seriously without making it a whole thing.",
    hotels: "Berkeley doesn't have much in the way of hotels, but it's close enough to the highway to work as a base if you have a car and want a quieter neighborhood feel.",
    "things-to-do": "Walking Tennyson Street is genuinely enjoyable — galleries, vintage shops, and independent stores mixed in with the restaurants and cafes. Berkeley Regis Park is nearby for outdoor space.",
  },
  "platt-park": {
    restaurants: "South Pearl Street is one of Denver's best walkable dining strips. The restaurants here tend to be owner-operated and have been around long enough to actually know what they're doing.",
    bars: "Platt Park's bars are neighborhood institutions — places where the staff knows the regulars and the vibe is more backyard hang than bar scene.",
    coffee: "South Pearl has excellent coffee options, and the proximity to Washington Park means the morning crowd actually shows up. Good spots for a sit-down morning.",
    hotels: "Platt Park is mostly residential and short on hotels, but it's a great base for exploring South Denver — close to Washington Park and an easy drive to Cherry Creek.",
    "things-to-do": "The Platt Park Farmers Market on South Pearl is one of Denver's best. The neighborhood is also walking distance from Washington Park for the full south Denver experience.",
  },
  "jefferson-park": {
    restaurants: "Jeff Park's restaurant scene has grown fast, and most of it is legitimately good. The fact that it's less crowded than RiNo or Highlands is a feature, not a bug.",
    bars: "The bars in Jefferson Park have some of the best views of the downtown skyline in Denver. Come for the drinks, stay for the backdrop.",
    coffee: "Smaller coffee spots with a neighborhood feel that hasn't been crowded out yet. Jefferson Park is still at the right stage — discovered enough to be good, not so discovered it's annoying.",
    hotels: "Jefferson Park sits just west of downtown with easy access to Coors Field and Ball Arena. A smart base for visitors who want to be close to the action without the full downtown premium.",
    "things-to-do": "Jefferson Park itself has one of the better views of the city. The neighborhood is also a short walk from the stadiums and an easy Uber to anything else in Denver.",
  },
  "curtis-park": {
    restaurants: "Curtis Park sits between Five Points and RiNo, which means it has access to good food without the full weekend crowds. A few spots here are worth specifically seeking out.",
    bars: "Low-key bars in a neighborhood that's been around long enough to not care about being on trend. The Curtis Park bar scene is for people who live here.",
    coffee: "Quiet neighborhood cafes in one of Denver's oldest residential areas. Not a destination coffee scene, but good enough that you won't feel like you missed out.",
    hotels: "Curtis Park doesn't have hotels, but it's central — close to RiNo, Five Points, and downtown, with a residential feel that's hard to find that close to the middle of the city.",
    "things-to-do": "Curtis Park is one of Denver's most historically significant neighborhoods. The Victorian-era architecture and the park itself are worth a walk, especially before the RiNo weekend crowds show up.",
  },
  downtown: {
    restaurants: "Downtown Denver's restaurant scene has improved significantly. Larimer Square alone has enough good options to fill a full weekend, and the 16th Street Mall corridor has gotten better than its reputation.",
    bars: "From rooftop bars with mountain views to historic cocktail lounges in old bank buildings, downtown Denver has more range than people give it credit for.",
    coffee: "Coffee shops built for the commuter and the laptop crowd — fast, good, and spread out enough that you can almost always find a seat on a weekday morning.",
    hotels: "Downtown Denver has the widest range of hotel options in the city. You're walking distance to Union Station, Coors Field, and the best of LoDo.",
    "things-to-do": "The 16th Street Mall, Larimer Square, Civic Center Park, and the Convention Center are all here. Downtown is the most walkable part of Denver and a good anchor for any trip.",
  },
  "denver-suburbs": {
    restaurants: "Aurora and Lakewood have some of the best ethnic food in the entire Denver metro — Vietnamese, Korean, Ethiopian, Salvadoran. Most Denverites don't know what they're missing.",
    bars: "The suburban bar scene is more neighborhood than nightlife, but there are gems if you know where to look. Some of the best dive bars in the metro are out here.",
    coffee: "The suburbs have a growing independent coffee scene that's worth paying attention to — especially in Lakewood and along the Colfax corridor east of downtown.",
    hotels: "Suburban hotels offer some of the best value in the metro, especially along I-25 and near the light rail lines that connect quickly to downtown.",
    "things-to-do": "Red Rocks Amphitheatre, Belmar in Lakewood, the Stanley Marketplace in Aurora, and the Cherry Creek State Park are all out here. The suburbs have more going on than the Denver food press bothers to cover.",
  },
  airport: {
    restaurants: "DEN has more than the usual airport food — there are legitimately good options past security if you know which terminal to head to. The Gaylord Rockies has a full dining scene worth knowing about.",
    bars: "Airport bars get a bad reputation they don't always deserve. DEN has solid options in the main terminal and both concourses, and the Gaylord Rockies has a bar scene that stands on its own.",
    coffee: "Coffee options at DEN are better than most airports, with a few local Denver brands represented. Know where to go before you get there and you won't end up at a chain.",
    hotels: "The Westin at DEN is connected directly to the terminal — genuinely convenient if you have an early flight or a long layover. The Gaylord Rockies is worth it as a destination in itself.",
    "things-to-do": "The Gaylord Rockies Resort is a legitimate destination even if you're not flying — ice skating, water park, and mountain views that most people in Denver have never taken advantage of.",
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
  lodo:             [39.742, 39.765, -105.012, -104.980],
  "capitol-hill":   [39.727, 39.745, -104.985, -104.965],
  highlands:        [39.753, 39.775, -105.025, -105.000],
  "cherry-creek":   [39.708, 39.725, -104.960, -104.940],
  "five-points":    [39.742, 39.774, -104.992, -104.952],
  cole:             [39.758, 39.775, -104.970, -104.950],
  "washington-park":[39.700, 39.722, -104.975, -104.950],
  baker:             [39.704, 39.723, -104.998, -104.973],
  "golden-triangle": [39.727, 39.742, -105.002, -104.980],
  uptown:            [39.737, 39.751, -104.978, -104.960],
  "sloan-lake":      [39.750, 39.770, -105.052, -105.020],
  berkeley:          [39.769, 39.790, -105.056, -105.025],
  "platt-park":      [39.687, 39.706, -104.986, -104.965],
  "jefferson-park":  [39.740, 39.768, -105.038, -104.998],
  "curtis-park":     [39.748, 39.764, -104.978, -104.956],
  downtown:          [39.735, 39.752, -105.002, -104.975],
  "denver-suburbs":  [39.600, 39.820, -105.180, -104.720],
  airport:           [39.810, 39.882, -104.760, -104.630],
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

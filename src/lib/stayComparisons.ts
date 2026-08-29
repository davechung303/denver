// A-vs-B lodging comparisons.
//
// These exist because the query is real and the SERP for it is thin: people
// type "cherry creek or downtown denver" and get listicles that recommend
// both. Every page here answers in the first paragraph, names who should
// ignore the answer, and shows the arithmetic.
//
// Distances quoted as "routed" come from src/lib/venueWalks.ts — OSRM
// pedestrian routing over OpenStreetMap, not straight lines. Named places and
// dates were checked against primary sources in August 2026; re-check on the
// quarterly refresh.

export interface ComparisonRow {
  label: string;
  a: string;
  b: string;
}

export interface Comparison {
  slug: string;
  aName: string;
  bName: string;
  /** Pillar anchors, for the "read the full area write-up" links. */
  aArea: string;
  bArea: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  /** The direct answer. Written to stand alone if lifted out of the page. */
  verdict: string;
  chooseA: string[];
  chooseB: string[];
  rows: ComparisonRow[];
  sections: { h: string; body: string[] }[];
  faqs: { q: string; a: string }[];
  links: { href: string; label: string }[];
  updated: string;
}

export const COMPARISONS: Comparison[] = [
  {
    slug: "cherry-creek-vs-downtown",
    aName: "Cherry Creek",
    bName: "Downtown",
    aArea: "cherry-creek",
    bArea: "downtown",
    h1: "Cherry Creek or Downtown Denver: Which Should You Book?",
    metaTitle: "Cherry Creek vs Downtown Denver: Where to Stay",
    metaDescription:
      "Downtown for a first or short visit; Cherry Creek when the hotel is the point. The honest trade-offs on rates, walkability, food and the missing light rail.",
    ogTitle: "Cherry Creek vs Downtown Denver — Where to Stay",
    ogDescription:
      "A local's straight answer on booking Cherry Creek or downtown Denver, with the rate behavior and transit facts that actually decide it.",
    verdict:
      "Book downtown if this is a first visit, a short visit, or a trip built around a game or a conference — you will walk to most of what you came for. Book Cherry Creek if the hotel is part of the reason you are traveling: it has Denver's best rooms, its best fine dining and a genuinely walkable sixteen-block grid of shops and galleries. The catch is that Cherry Creek has no light rail at all, so every downtown evening becomes a fifteen-minute rideshare each way. That is fine for two dinners and tiresome for five days.",
    chooseA: [
      "The room matters as much as the city — spa, rooftop pool, a suite worth staying in during the day.",
      "You are here to shop, or to eat somewhere like Matsuhisa without then walking past a bail bondsman.",
      "It is an anniversary, a milestone, or a trip where a taxi twice a day is not the thing you will remember.",
      "You are visiting in the middle of a Rockies homestand, when downtown rates spike and Cherry Creek's barely move.",
    ],
    chooseB: [
      "It is your first time in Denver and you want to see the city rather than commute into it.",
      "Your trip has a fixed anchor: Coors Field, Ball Arena, the Convention Center, a show at the Performing Arts Complex.",
      "You are here two or three nights and every hour in a car is an hour you paid for and did not use.",
      "You want the option of not planning — 16th Street and the FreeRide make downtown the most forgiving base in the city.",
    ],
    rows: [
      { label: "Nightly rate", a: "Denver's highest, and the least event-driven — Cherry Creek does not spike for baseball", b: "Mid-to-high, driven by the convention calendar far more than by weekends" },
      { label: "What you walk to", a: "Cherry Creek North: roughly sixteen blocks of galleries, restaurants and independent shops, plus the shopping center across First Avenue", b: "16th Street, Larimer Square, the Convention Center, the Denver Art Museum, the Performing Arts Complex, both stadiums" },
      { label: "Food", a: "Denver's fine-dining center — Matsuhisa, Del Frisco's, Hillstone, Blue Island Oyster Bar. The Cherry Cricket, open since 1945, is the counterweight", b: "Convenient rather than exceptional. Guard and Grace, ChoLon, Larimer Square. The best food is a short walk out in any direction" },
      { label: "After 10pm", a: "Quiet, by design. That is the product, not a flaw", b: "Busy on the LoDo side, thin and empty toward the Capitol and the eastern edge" },
      { label: "Light rail", a: "None. Rideshare downtown runs about fifteen minutes outside rush hour", b: "The FreeRide runs 16th Street end to end every 4 to 12 minutes, free, with rail at both ends" },
      { label: "Parking", a: "Easier and often cheaper; this is a neighborhood built for cars", b: "Typically $45 to $70 a night for overnight self-park or valet — price it with the room" },
      { label: "Best for", a: "Luxury travelers, shoppers, couples, anyone whose hotel is the occasion", b: "First visits, short visits, sport, conferences, anyone who wants to stop planning" },
      { label: "Wrong for", a: "Tight budgets, nightlife, and a two-night first visit you will spend commuting", b: "Anyone hunting neighborhood character — downtown has less of it than the areas around it" },
    ],
    sections: [
      {
        h: "The one question that settles it",
        body: [
          "Ask what you would do with an unplanned evening. If the answer is a good dinner and an early night, Cherry Creek wins outright — you walk out of the lobby into the best restaurant density in the city for that kind of night, and you are not competing for a table with a convention. If the answer is anything else — a game, a show, a bar, a walk to see what the place actually looks like — downtown wins, because Cherry Creek's answer to all of those is a car.",
          "This is not a quality question. Cherry Creek has nicer hotels than downtown and it is not close. It is a geography question, and Denver's geography is unusually unforgiving about it: the city's attractions are clustered in a corridor that Cherry Creek sits outside of, with no rail connection to bridge the gap.",
        ],
      },
      {
        h: "What each one is actually within walking distance of",
        body: [
          "Cherry Creek North is the walkable part and the shopping center is the enclosed part, and the distinction matters more than the maps suggest. North is a real grid of low-rise blocks you can wander for an afternoon. Across First Avenue, the mall is a mall. Both are good; only one of them is the reason to stay in a walkable neighborhood.",
          "Downtown's walking radius is larger and more varied. 16th Street reopened in October 2025 after three and a half years and $175 million of reconstruction, and was renamed in the process — the 16th Street Mall is now simply 16th Street, and the free MallRide is the 16th Street FreeRide. Any guide still routing you around construction detours was written before that. From the middle of it you reach the Convention Center, Larimer Square, the Performing Arts Complex and the Denver Art Museum on foot.",
          "The honest caveat about downtown: parts of it still look half-finished. Vacant storefronts remain, though retail vacancy hit its lowest level since tracking began in 2021 and foot traffic was up 13% year over year by April 2026. The blocks toward the Capitol and the eastern edge of the ballpark district go quiet after dark — empty rather than menacing, but worth knowing when you choose which end to book.",
        ],
      },
      {
        h: "The money, honestly",
        body: [
          "Cherry Creek is more expensive on almost any night. The exception is the one worth planning around: Cherry Creek's rates barely respond to the Rockies schedule, and downtown's move a lot. On a home-game weekend the premium narrows enough that the comparison stops being obvious, which is the single most useful piece of Denver rate arbitrage there is.",
          "Downtown's own spikes come from the Colorado Convention Center rather than from weekends. A citywide can double a Tuesday rate. Before you assume midweek is cheap, check what is booked — CEDIA Expo runs September 1 to 4, 2026 and Splunk's .conf26 follows on September 14 to 17, and those two weeks price nothing like the ones either side of them.",
          "Then add parking. Downtown overnight parking typically runs $45 to $70 a night; The Crawford publishes valet at $68. Cherry Creek parking is easier and generally cheaper. If you are driving, that gap is real money and it closes some of the rate difference.",
        ],
      },
      {
        h: "Getting between them",
        body: [
          "There is no train. Rideshare is about fifteen minutes outside rush hour and longer inside it. The alternative most visitors never hear about is the Cherry Creek Trail, which runs from the neighborhood toward downtown flat and separated from traffic the whole way — a genuinely pleasant walk or bike in decent weather, and a reminder that the two areas are not far apart so much as badly connected.",
          "If your itinerary has you downtown three evenings out of four, book downtown. The rides are not expensive individually; they are just a tax you pay repeatedly for a decision you made once.",
        ],
      },
    ],
    faqs: [
      {
        q: "Is Cherry Creek or downtown Denver better for a first visit?",
        a: "Downtown, in almost every case. A first visit means seeing Union Station, 16th Street, Larimer Square, the museums and probably a game — all of which are walkable or one short ride from a downtown hotel and all of which are a fifteen-minute rideshare from Cherry Creek. Cherry Creek is a better neighborhood to return to on a second or third trip, when you already know the city and are optimizing for the room and the food.",
      },
      {
        q: "How far is Cherry Creek from downtown Denver?",
        a: "About fifteen minutes by rideshare outside rush hour, longer during it. There is no light rail connection at all — this is the single biggest practical difference between the two. The Cherry Creek Trail links them on foot or by bike, flat and separated from traffic, which is a nice option in good weather and not a substitute for transit in January.",
      },
      {
        q: "Is Cherry Creek worth the extra money?",
        a: "If the hotel is part of why you are traveling, yes — the rooms are the best in the city and it is not close. If the hotel is where you sleep between the things you came to do, no: you can eat at the same Cherry Creek restaurants and sleep downtown for meaningfully less, and you will spend the difference on rides either way.",
      },
      {
        q: "Which is safer, Cherry Creek or downtown Denver?",
        a: "Cherry Creek is quieter at night, which is what most people mean by the question. Downtown is busy where it is busy and empty where it is not: the LoDo and 16th Street blocks have people on them into the evening, while the stretches toward the Capitol and east of the ballpark thin out after dark. Choosing which end of downtown you book does more for how a stay feels than choosing between the two neighborhoods.",
      },
      {
        q: "Is there nightlife in Cherry Creek?",
        a: "Not really, and that is deliberate. Cherry Creek is quiet after dinner. If you want a bar past ten, you are ordering a car to LoDo, RiNo or Capitol Hill — which is fine once and annoying by the third night.",
      },
    ],
    links: [
      { href: "/denver/where-to-stay#cherry-creek", label: "The full Cherry Creek write-up" },
      { href: "/denver/where-to-stay#downtown", label: "The full downtown write-up" },
      { href: "/denver/cherry-creek/hotels", label: "Cherry Creek hotels" },
      { href: "/denver/downtown/hotels", label: "Downtown hotels" },
      { href: "/denver/hotel-costs", label: "What a Denver hotel actually costs" },
      { href: "/hotels/near-convention-center", label: "Staying for a Convention Center conference" },
    ],
    updated: "2026-08-29",
  },
  {
    slug: "union-station-vs-rino",
    aName: "Union Station",
    bName: "RiNo",
    aArea: "lodo",
    bArea: "rino",
    h1: "Union Station or RiNo: Where to Stay in Denver",
    metaTitle: "Union Station vs RiNo: Where to Stay in Denver",
    metaDescription:
      "RiNo if you came to eat, Union Station if you came for a game or arrived with luggage. One A Line stop apart — with routed walk times to Coors Field for both.",
    ogTitle: "Union Station vs RiNo — Where to Stay in Denver",
    ogDescription:
      "The honest split between Denver's two best bases: rate behavior, routed walk times to Coors Field, and the noise question nobody warns you about.",
    verdict:
      "Stay at Union Station if the trip is built around a game, a train, or arriving with luggage and no plan — it is the most connected block in Colorado and Coors Field routes at seven to fourteen minutes on foot from its hotels. Stay in RiNo if you came to eat: it has the best restaurant and brewery density in the city, it is one A Line stop from Union Station on the same train that runs to the airport, and it does not spike for Rockies weekends the way LoDo does. The real cost of RiNo is noise, and the real cost of Union Station is money.",
    chooseA: [
      "You are arriving by train from the airport and want to walk to your room from the platform.",
      "The trip is a Rockies or Nuggets game and you want the ballpark district on your doorstep.",
      "It is a first visit and you would rather not think about how to get anywhere.",
      "You want a hotel that is itself a reason to be there — The Crawford is inside the station building.",
    ],
    chooseB: [
      "You picked Denver partly for the food, and you want three dinners within a ten-minute walk.",
      "You are booking a baseball weekend and would rather not pay the LoDo premium for it.",
      "You want breweries, murals and a neighborhood that looks like somewhere rather than everywhere.",
      "You are staying more than a couple of nights and an apartment-style room with a kitchen appeals.",
    ],
    rows: [
      { label: "Walk to Coors Field", a: "Routed on foot, 0.36 to 0.72 miles from the Union Station hotels — seven to fourteen minutes. The Rally Hotel is 0.12 miles", b: "0.8 to 1.7 miles depending where in RiNo you book — sixteen to thirty-five minutes" },
      { label: "Rate behavior", a: "The most expensive sleep in Denver, and it moves with the Rockies schedule rather than the calendar", b: "Consistently cheaper, and the gap widens on home-game weekends because RiNo does not follow the ballpark" },
      { label: "Food", a: "Convenient, not exceptional. Mercantile and Ultreia in the building, Rioja and Jax on Larimer Square, Wynkoop across the street", b: "The best in the city. Uchi, Cart-Driver, Temaki Den, Dio Mio, Barcelona, Bierstadt Lagerhaus, Nocturne for jazz" },
      { label: "Noise", a: "Loud around Blake Street on weekends; ask for a room off the street side", b: "Real, and worse near the venues. It is an industrial district that became a nightlife district" },
      { label: "Transit", a: "The hub. A Line to DEN in about 37 minutes, E and W lines west, the FreeRide along 16th Street", b: "38th &amp; Blake is one stop from Union Station and a direct run to the airport on the same train, no transfer" },
      { label: "Hotels", a: "The Crawford inside the station, The Oxford across the street, The Rally on McGregor Square, The Maven, Limelight, Thompson, Hotel Indigo", b: "The Ramble at the south end, Catbird for longer stays, The Source Hotel, Cambria from 2024 and an AC Hotel from June 2026" },
      { label: "Best for", a: "First visits, games, conferences, anyone who wants logistics to disappear", b: "Food-led trips, repeat visitors, baseball weekends booked on value" },
      { label: "Wrong for", a: "Light sleepers, and anyone for whom the rate is the deciding number", b: "Anyone who wants a quiet street outside the door, or a Sunday morning with something open" },
    ],
    sections: [
      {
        h: "They are closer than the argument suggests",
        body: [
          "One A Line stop separates 38th &amp; Blake from Union Station, and it is the same train that runs to the airport with no transfer. That single fact makes RiNo one of the easiest neighborhoods in Denver to arrive in with luggage, and it collapses most of the distance in this comparison. You are not choosing between connected and stranded; you are choosing between two well-connected bases with different characters.",
          "What does not collapse is the walk to the ballpark. Routed over real sidewalks and crossings, Coors Field is 0.36 to 0.72 miles from the Union Station hotels — call it seven to fourteen minutes — and 0.8 to 1.7 miles from RiNo's, which is sixteen to thirty-five. RiNo is long and thin, so where you book inside it changes that answer more than the neighborhood label does: the south end is closer to downtown, the north end is closer to the music.",
        ],
      },
      {
        h: "The baseball arbitrage",
        body: [
          "This is the most useful thing to know about booking a Denver trip around the Rockies. LoDo and Union Station rates move sharply with the home schedule. RiNo's do not move nearly as much. On a home-game weekend the same money buys a materially better room in RiNo, and the walk from RiNo's south end is comparable to the walk from the outer LoDo hotels anyway.",
          "The exception is a big night at Mission Ballroom or a neighborhood festival, when the north end of RiNo prices like downtown. Check what is on at the venue before you assume RiNo is the cheap option — the whole point is that the two neighborhoods spike on different calendars, which cuts both ways.",
        ],
      },
      {
        h: "The noise question",
        body: [
          "Both are loud, differently. Union Station's noise is a weekend crowd on Blake Street and bar close at 2am, concentrated in a few blocks — ask for a room off the street side and it largely goes away. RiNo's noise is structural: the neighborhood is warehouses that became bars and venues, so the sound is spread across the district rather than confined to one strip, and it is worst near Larimer Lounge and Mission Ballroom.",
          "The corollary nobody mentions: RiNo on a Sunday morning is emptier than visitors expect. If your idea of a good trip includes wandering out for coffee at nine on a Sunday and finding the street busy, Union Station does that better.",
        ],
      },
      {
        h: "If you cannot decide",
        body: [
          "Split the difference at the south end of RiNo, roughly between 25th and 30th. You are ten to fifteen minutes from Coors Field on foot, inside the restaurant density, and far enough from the venues to sleep. That is where most repeat visitors end up, and it is the answer when the trip is neither purely a game nor purely a food trip.",
        ],
      },
    ],
    faqs: [
      {
        q: "Is RiNo walkable to Coors Field?",
        a: "From the south end, yes: routed on foot it is about 0.8 miles from the nearest RiNo hotels, sixteen minutes or so. From the north end near Mission Ballroom it is 1.4 to 1.7 miles, which is a half-hour walk and most people ride it. The Union Station hotels are meaningfully closer at 0.36 to 0.72 miles.",
      },
      {
        q: "Is RiNo cheaper than Union Station?",
        a: "Usually, and the gap is widest exactly when it helps most — on Rockies home-game weekends, when downtown rates spike and RiNo's stay flatter. The exception is a large show at Mission Ballroom or a neighborhood festival, when the north end of RiNo prices like downtown.",
      },
      {
        q: "How do you get from RiNo to Denver airport?",
        a: "The 38th &amp; Blake station is on the A Line, the same train that runs from Union Station to DEN, so it is a direct run with no transfer — about 37 minutes end to end from Union Station and a few minutes less from 38th &amp; Blake. That is the strongest practical argument for RiNo over almost anywhere else in the city.",
      },
      {
        q: "Is RiNo safe at night?",
        a: "It is busy where the bars and venues are and quiet in the warehouse blocks between them, and the walk between those two states can feel abrupt if you are not expecting it. Most visitors are fine; most visitors also end up ordering a car for the last stretch home rather than walking six empty blocks. Booking near the Larimer Street spine rather than out on the edges is the practical fix.",
      },
      {
        q: "Which is better for a first trip to Denver?",
        a: "Union Station, narrowly. A first visit usually includes the station itself, a game, 16th Street and at least one thing downtown, and staying on top of all of it removes decisions you do not yet have the local knowledge to make well. RiNo is the better second trip.",
      },
    ],
    links: [
      { href: "/denver/where-to-stay#lodo", label: "The full LoDo and Union Station write-up" },
      { href: "/denver/where-to-stay#rino", label: "The full RiNo write-up" },
      { href: "/hotels/near-coors-field", label: "Routed walk times to Coors Field" },
      { href: "/hotels/near-mission-ballroom", label: "Staying for a Mission Ballroom show" },
      { href: "/denver/rino/hotels", label: "RiNo hotels" },
      { href: "/denver/airport-train", label: "How the A Line airport train works" },
    ],
    updated: "2026-08-29",
  },
  {
    slug: "lodo-vs-golden-triangle",
    aName: "LoDo",
    bName: "the Golden Triangle",
    aArea: "lodo",
    bArea: "golden-triangle",
    h1: "LoDo or the Golden Triangle: Where to Stay in Denver",
    metaTitle: "LoDo vs Golden Triangle: Where to Stay in Denver",
    metaDescription:
      "LoDo for sport, arrival and noise; the Golden Triangle for four museums on foot, Populus, and evenings that are genuinely quiet — for less money.",
    ogTitle: "LoDo vs the Golden Triangle — Where to Stay in Denver",
    ogDescription:
      "Two ends of the same downtown, twenty minutes apart. Which one suits your trip, and what each one costs you.",
    verdict:
      "Stay in LoDo if the trip involves a game, a train or a crowd — it is the most connected and most expensive part of Denver, and you will not need a car once. Stay in the Golden Triangle if you came for the museums or you want a good room without paying the ballpark tax: four major museums, the Capitol and Civic Center Park sit inside a ten-minute walk, rates run below downtown apart from Populus, and the evenings are silent. The two are about a fifteen-minute walk apart along the length of 16th Street, so this is a question of what you want outside the lobby door, not of access.",
    chooseA: [
      "There is a Rockies, Nuggets or Avalanche game on the itinerary.",
      "You are arriving on the A Line and want to roll a suitcase to the front desk.",
      "You want bars, crowds, and the option of walking home from all of them.",
      "You would rather pay more than think about logistics even once.",
    ],
    chooseB: [
      "Museums are the reason you came, or at least on the list.",
      "You want a design-led hotel — Populus or The Art Hotel — without Cherry Creek's rates.",
      "You are a light sleeper, or traveling with someone who is.",
      "You are here for a conference: the Convention Center is closer from this side than from Union Station.",
    ],
    rows: [
      { label: "What is outside the door", a: "Union Station, Larimer Square, McGregor Square, Coors Field, the Dairy Block, Denver Milk Market", b: "The Denver Art Museum, the Clyfford Still Museum, History Colorado, The Kirkland, the State Capitol, Civic Center Park" },
      { label: "Nightly rate", a: "Denver's highest, and it tracks the Rockies schedule", b: "Mid-range with a high ceiling — Populus prices like a destination hotel, everything else sits below downtown" },
      { label: "Evenings", a: "Loud. Bar close is 2am and weekend nights are busy right through", b: "Genuinely quiet, not code for anything. The streets empty when the museums close" },
      { label: "Food", a: "Convenient and pricey. Rioja, Jax, Wynkoop, Terminal Bar. Walk fifteen minutes northeast and it improves sharply", b: "Thin, and that is the trade. Cuba Cuba, Leven Deli, Fire at The Art Hotel. Capitol Hill and downtown are a short walk for dinner" },
      { label: "Convention Center", a: "About a mile on foot from the Union Station hotels — nineteen to twenty-three minutes routed", b: "Closer, and downhill on 16th Street or one stop on the FreeRide" },
      { label: "Transit", a: "Union Station: the A Line to DEN, the E and W lines, and the FreeRide", b: "Civic Center Station is the FreeRide's southern terminus and a major bus hub, with light rail at the Colfax stations" },
      { label: "Hotels", a: "The Crawford, The Oxford, The Rally, The Maven, Limelight, Thompson, Hotel Indigo", b: "Populus (October 2024, 265 rooms), The Art Hotel, and a run of extended-stay and Marriott-family properties along the eastern edge" },
      { label: "Wrong for", a: "Light sleepers, and anyone counting the rate", b: "Anyone who wants activity outside the lobby, or who will resent walking fifteen minutes for a decent dinner" },
    ],
    sections: [
      {
        h: "Four museums inside ten minutes, and one most visitors miss",
        body: [
          "The Golden Triangle's case is unusually concrete: the Denver Art Museum, the Clyfford Still Museum and the History Colorado Center are all within a ten-minute walk of each other, and so is a fourth building most visitors have never heard of. The Kirkland, on Bannock, merged into the Denver Art Museum in October 2024 and is covered by the same ticket. It packs Arts and Crafts through mid-century design into a jewel box, hung salon-style, and it is the best twenty minutes in the neighborhood.",
          "Add the State Capitol, Civic Center Park and the southern end of 16th Street and you have a dense, low-effort morning that does not involve a car or a train. Almost nothing in LoDo compares on that particular axis — LoDo's walkable assets are a ballpark, an arena and a very good train station.",
        ],
      },
      {
        h: "Populus changed the arithmetic",
        body: [
          "Populus opened at 14th and Colfax in October 2024 with 265 rooms and one of Denver's four Michelin Keys, and a facade you will recognize from photographs before you arrive. It moved the Golden Triangle from a neighborhood people stayed in because it was cheaper into one people book on purpose, and it raised the ceiling on what the area costs.",
          "The floor did not move much, which is the useful part. The extended-stay and Marriott-family properties along the eastern edge still sit well under downtown and a long way under Cherry Creek, in a neighborhood with more to walk to than the rate suggests. If you want the design hotel, book Populus or The Art Hotel; if you want the location at a sane price, book behind them.",
        ],
      },
      {
        h: "Noise is the real dividing line",
        body: [
          "LoDo is loud on weekend nights and the blocks around Blake Street are the loudest part of it. That is not a complaint — it is what people book LoDo for — but it means a street-facing room on a Saturday is a different product from the same room on a Tuesday. Ask for a room off the street side and most of it goes away.",
          "The Golden Triangle is quiet in a way that surprises people who assume downtown-adjacent means busy. There is no nightlife to speak of and the streets empty out after closing time. That is either exactly the appeal or an immediate dealbreaker, and it is worth being honest with yourself about which before you book, because it will not change during your stay.",
        ],
      },
      {
        h: "For a conference, the Golden Triangle is underrated",
        body: [
          "Convention attendees default to the hotels ringing the Colorado Convention Center, and when a citywide is in they pay for that default. The Golden Triangle sits on the other side of the same walk — closer than the Union Station cluster, which routes at about a mile on foot — with rates that follow the convention calendar less closely and evenings you can actually sleep through.",
          "The FreeRide runs the length of 16th Street from Civic Center to Union Station every four to twelve minutes, free, which makes the Golden Triangle a one-vehicle-free-ride commute to almost anything downtown.",
        ],
      },
    ],
    faqs: [
      {
        q: "Is the Golden Triangle a good area to stay in Denver?",
        a: "Yes, for a specific traveler: someone who wants the Denver Art Museum, the Clyfford Still, History Colorado and The Kirkland on foot, a good room at below-downtown rates, and quiet evenings. It is a bad choice for anyone who wants activity outside the lobby — there is essentially no nightlife and the streets empty when the museums close.",
      },
      {
        q: "How far is the Golden Triangle from LoDo?",
        a: "About a fifteen-minute walk along 16th Street, or the length of the free 16th Street FreeRide, which runs every four to twelve minutes between Civic Center Station and Union Station. They are two ends of the same downtown rather than separate parts of the city.",
      },
      {
        q: "Is LoDo worth the extra money?",
        a: "For a game weekend or a first visit, usually yes — the walk-everywhere convenience is real and you will use it. For a museum trip, a conference or a quiet few days, no: you are paying a premium driven by the Rockies schedule for proximity to things you have no plans to visit.",
      },
      {
        q: "Which is closer to the Colorado Convention Center?",
        a: "The Golden Triangle. From the Union Station hotels the Convention Center routes at about a mile on foot, nineteen to twenty-three minutes. From the Golden Triangle it is shorter, and the FreeRide covers the difference either way.",
      },
      {
        q: "Where should I stay in Denver with a light sleeper?",
        a: "The Golden Triangle, or the quieter back side of the Union Station cluster. LoDo's weekend noise runs to 2am and is concentrated around Blake Street. If you do book LoDo, ask explicitly for a room off the street side — it is the single most effective request you can make at check-in.",
      },
    ],
    links: [
      { href: "/denver/where-to-stay#lodo", label: "The full LoDo and Union Station write-up" },
      { href: "/denver/where-to-stay#golden-triangle", label: "The full Golden Triangle write-up" },
      { href: "/hotels/near-convention-center", label: "Routed walk times to the Convention Center" },
      { href: "/hotels/near-coors-field", label: "Routed walk times to Coors Field" },
      { href: "/denver/golden-triangle/hotels", label: "Golden Triangle hotels" },
      { href: "/denver/hotel-costs", label: "What a Denver hotel actually costs" },
    ],
    updated: "2026-08-29",
  },
  {
    slug: "downtown-vs-airport",
    aName: "Downtown Denver",
    bName: "the DEN airport district",
    aArea: "downtown",
    bArea: "airport",
    h1: "Downtown Denver or a DEN Airport Hotel: Which Should You Book?",
    metaTitle: "Downtown Denver vs DEN Airport Hotels: Where to Stay",
    metaDescription:
      "Book the airport only for a flight before about 7am or a landing after midnight. Otherwise the A Line runs to Union Station in 37 minutes on a $10 day pass.",
    ogTitle: "Downtown Denver vs DEN Airport Hotels",
    ogDescription:
      "The airport district is the cheapest bed in metro Denver and the most expensive place to stay. Here is the arithmetic.",
    verdict:
      "Book downtown unless your flight leaves before roughly 7am or lands after midnight. Denver's airport is 25 miles from the city, and the A Line covers it in about 37 minutes on a $10 Airport Day Pass — which is a day pass, not a one-way, a detail almost every national guide gets wrong. Airport-district rooms are the cheapest in metro Denver by a wide margin, and two rideshares a day into the city erase that saving by the second morning while costing you three hours in a car. The exceptions are real but narrow: a genuinely early departure, a genuinely late arrival, or a trip where the Gaylord Rockies is itself the destination.",
    chooseA: [
      "You are here to see Denver, for any number of nights.",
      "Your flight is at a civilized hour and you are willing to leave the hotel ninety minutes earlier.",
      "You would rather spend the difference on the room than on rides.",
      "You want to be able to walk somewhere for dinner without checking a shuttle timetable.",
    ],
    chooseB: [
      "Your departure is before about 7am, or you land after the last useful train.",
      "You are traveling with small children and one more transfer is one too many.",
      "The Gaylord Rockies is the point — the water park, the restaurants, the ICE! exhibition at Christmas.",
      "You are leaving a car behind while you fly, and you are booking a real park-and-fly stay.",
    ],
    rows: [
      { label: "Nightly rate", a: "Mid-to-high, driven by the convention calendar more than by weekends", b: "The cheapest in metro Denver by a wide margin — which is exactly what tempts people into a whole trip out here" },
      { label: "Getting into the city", a: "You are already in it", b: "A Line to Union Station in about 37 minutes for a $10 Airport Day Pass, trains every 15 minutes through the middle of the day" },
      { label: "Getting to your gate", a: "37 minutes on the train, or a rideshare that costs several times the fare", b: "Minutes, if you booked the Westin at the terminal. Otherwise a hotel shuttle whose frequency varies a lot between properties" },
      { label: "What you can walk to", a: "16th Street, Larimer Square, the Convention Center, the museums, both stadiums", b: "Nothing. This is a car-and-shuttle district built on former prairie, and pretending otherwise does nobody any favors" },
      { label: "Food", a: "Guard and Grace, ChoLon, Larimer Square, and better again a short walk out in any direction", b: "Hotel restaurants and chains along Tower Road and Peña Boulevard" },
      { label: "Hotels", a: "The Brown Palace, open since 1892, Hotel Teatro, the Kimpton Monaco, Le Méridien, Grand Hyatt, the newly renovated Curtis and Hyatt Regency", b: "The Westin attached to the terminal, the Gaylord Rockies resort, and the Gateway Park cluster on Tower Road" },
      { label: "Best for", a: "Anyone visiting Denver", b: "Early departures, late landings, and families who want the Gaylord as the trip" },
    ],
    sections: [
      {
        h: "Do the arithmetic before you book the cheap room",
        body: [
          "Airport-district rates look like a bargain because they are one, in isolation. The trouble is that a hotel is not a room; it is a room plus everything you do from it. Two rideshares a day between the airport district and central Denver will typically erase the nightly saving by the second morning, and you will have spent something like three hours in a car to achieve it.",
          "The train changes the math in one direction only. The A Line is excellent for getting between the airport and the city, so a stay downtown with an early-ish flight is easy. It does not make the airport district a good base, because the Gateway Park hotels are not at the station — you still need a shuttle or a car to reach the train, which is the transfer that makes the whole plan tiring.",
        ],
      },
      {
        h: "The A Line detail nearly every guide gets wrong",
        body: [
          "The fare from DEN to Union Station is a $10 Airport Day Pass, and it is a day pass. It covers the rest of that day's travel on RTD, not just the one ride in. National guides routinely describe it as a one-way ticket, which makes the train look worse against a rideshare than it is.",
          "Trains run every 15 minutes through the middle of the day and take about 37 minutes end to end. For most arrivals that is faster than a car in traffic, and it lands you inside Union Station, which is where you probably wanted to be anyway.",
        ],
      },
      {
        h: "When the airport district is genuinely the right call",
        body: [
          "A departure before about 7am. Working backwards from a 6am flight through bag drop, security and the train timetable puts you leaving a downtown hotel at an hour that ruins the night before and most of the day after. That is the case where an airport room buys you sleep, and sleep is worth more than the rate difference.",
          "A late landing, for the same reason in reverse. And one genuine destination exception: the Gaylord Rockies is a resort rather than an airport hotel, with restaurants, a water park and a seasonal ICE! exhibition at Christmas. Families book it as the trip, not as a stopover, and that is a coherent plan.",
          "If you are leaving a car while you fly, book the room you are actually sleeping in. Park-and-fly packages require a real stay, and cars left in hotel lots without one get towed.",
        ],
      },
      {
        h: "The Westin is the only true walk-to-the-gate option",
        body: [
          "The Westin Denver International Airport is attached to the terminal, so you walk to your gate. That is the entire reason to pay for it, and for a 5am departure it is often worth it outright. Everything else in the district runs a shuttle, and shuttle frequency varies enormously between properties — that is the thing to confirm before you book, not the star rating.",
        ],
      },
    ],
    faqs: [
      {
        q: "Should I stay near Denver airport or downtown?",
        a: "Downtown, unless your flight leaves before about 7am or lands after midnight. Denver's airport is 25 miles out and the airport district has nothing you can walk to, so a stay there means a rideshare or shuttle for everything. The A Line makes a downtown stay workable for all but the earliest flights.",
      },
      {
        q: "How much is the train from Denver airport to downtown?",
        a: "A $10 Airport Day Pass, which is a day pass rather than a one-way ticket — it covers the rest of that day on RTD. The A Line runs to Union Station in about 37 minutes, every 15 minutes through the middle of the day.",
      },
      {
        q: "Is there a hotel inside Denver airport?",
        a: "The Westin Denver International Airport is attached to the terminal, so you walk from your room to security. It is the only property in the district with no transfer at all, and for a very early departure that is usually what you are paying for.",
      },
      {
        q: "Are Denver airport hotels cheaper?",
        a: "Yes, and by a wide margin — they are the cheapest rooms in metro Denver. The saving survives one night before an early flight and does not survive a whole trip: two rides a day into the city typically cancels it out by the second morning.",
      },
      {
        q: "Do Denver airport hotels have free shuttles?",
        a: "Most of the Gateway Park cluster on Tower Road does, but frequency varies a lot between properties and that is what matters at 4am. Confirm the first shuttle of the morning and how often it runs before booking, rather than assuming a shuttle exists on the schedule you need.",
      },
    ],
    links: [
      { href: "/denver/where-to-stay#downtown", label: "The full downtown write-up" },
      { href: "/denver/where-to-stay#airport", label: "The full airport-district write-up" },
      { href: "/denver/airport-train", label: "How the A Line airport train works" },
      { href: "/hotels/near-denver-airport", label: "Hotels near Denver airport (DEN)" },
      { href: "/denver/denver-airport-shuttle", label: "Denver airport shuttles" },
      { href: "/denver/hotel-costs", label: "What a Denver hotel actually costs" },
    ],
    updated: "2026-08-29",
  },
];

export function getComparison(slug: string): Comparison | undefined {
  return COMPARISONS.find((c) => c.slug === slug);
}

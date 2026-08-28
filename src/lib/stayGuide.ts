// Editorial content for the "Where to Stay in Denver" pillar.
//
// Each area is a standardized module: the take (first-person, Dave's own copy),
// what you can actually walk to, where to eat, which hotels and what each is
// for, what it costs, how you get around, what's changing, and who should skip
// it. The "skip" field is deliberate — every recommendation gets a
// disqualifier, because a guide that likes everything is useless.
//
// Nothing here invents first-hand experience. Named places are stated as fact,
// not as personal endorsement, and every one was checked open and correctly
// located as of August 2026. Claims that could not be verified against a primary
// source were cut rather than estimated. Businesses close: re-check this file's
// named places on the quarterly refresh.

export interface StayArea {
  slug: string;
  bestFor: string;
  notFor: string;
  take: string;
  walk: string;
  eat: string;
  hotels: string;
  cost: string;
  transit: string;
  changing?: string;
  skip: string;
  venueLinks?: { href: string; label: string }[];
}

export const STAY_AREAS: StayArea[] = [
  {
    slug: "lodo",
    bestFor: "First-timers and sports fans",
    notFor: "Light sleepers on a Saturday",
    take:
      "LoDo is the easiest place to stay in Denver if it's your first time. Union Station is one of the best train stations in the country — it's also a hotel, a food hall, and a hangout spot. You're walking distance from Coors Field, Ball Arena, and basically everything downtown. It costs more than staying elsewhere, but you won't need Uber as much.",
    walk:
      "This is the only Denver neighborhood where a car is genuinely optional. Coors Field is under ten minutes on foot from Union Station, and McGregor Square sits between the two — a plaza with bars and a giant screen that fills up before first pitch. Ball Arena is a fifteen-minute walk or one light-rail stop. Larimer Square, the oldest commercial block in the city, is five minutes south. The Dairy Block alley and Denver Milk Market are two minutes east. The 16th Street FreeRide runs the length of 16th Street to Civic Center every 4 to 12 minutes, free, no ticket. Cross the Millennium Bridge and you're in Riverfront Park, then over the pedestrian bridge into LoHi in about twenty minutes total.",
    eat:
      "Union Station's great hall alone covers a lot of ground — Mercantile and Ultreia sit in the building and the Terminal Bar occupies the old ticket windows. Rioja on Larimer Square and Jax Fish House are the long-standing LoDo reservations. Wynkoop, open since 1988 and the city's original brewpub, is across from the station. Blake Street is where the pregame crowd goes and Tom's Watch Bar is the loudest of it. The honest caveat: LoDo is not where Denver's best restaurants are. It is where the most convenient ones are. Walk fifteen minutes northeast into RiNo and the food improves sharply for the same money.",
    hotels:
      "The Crawford is inside Union Station itself and holds one of Denver's four Michelin Keys — the pick when the trip is the occasion. The Oxford, across the street, is Denver's oldest hotel and the quieter room. The Rally Hotel sits on McGregor Square directly across from Coors Field with a rooftop deck and plunge pool overlooking the ballpark district, which makes it the obvious game-weekend booking and the first to sell out. The Maven at Dairy Block is the design-forward mid-range option, Limelight is the reliable one, and Thompson Denver brought Ludo Lefebvre's Chez Maggy in with it. Hotel Indigo on the quieter back side of the station trades a little atmosphere for a lower rate.",
    cost:
      "The most expensive night's sleep in the city, and it moves with the Rockies schedule rather than the calendar. Home-game weekends spike hard; midweek is dramatically cheaper for the same room. Overnight parking downtown typically runs $50 to $70 a night — The Crawford publishes valet at $68 — so if you're driving, price the room and the parking together or you'll be surprised at checkout. Book game weekends four to six weeks out; the cheap rooms go first and the gap between LoDo and RiNo widens as the date closes.",
    transit:
      "Union Station is the hub. The A Line runs to the airport in about 37 minutes, the E and W lines reach Ball Arena and Empower Field, and the FreeRide covers 16th Street. Nothing else in Denver is this connected, and it's the single strongest argument for paying LoDo rates on a first visit.",
    changing:
      "Two projects would reshape the western edge of downtown if they land. The River Mile proposes replacing Elitch Gardens with a walkable neighborhood along the South Platte — housing, parks and public river access. The Sports Mile is a promenade proposed within the 55-acre Ball Arena redevelopment, running along Wynkoop from Coors Field past Ball Arena toward Empower Field and meant to be busy on non-game days too. Neither is built — Elitch Gardens says it will keep operating for the foreseeable future, and the Ball Arena first phase targets 2032. Both are worth knowing about if you're the kind of visitor who cares what a place is becoming.",
    skip:
      "Skip LoDo if you want quiet. Bar close is 2am and the blocks around Blake Street are loud on weekend nights — ask for a room off the street side. Skip it too if value matters more than convenience: RiNo and Capitol Hill put you 10 to 20 minutes away for meaningfully less, and on a game weekend the saving is large enough to notice.",
    venueLinks: [
      { href: "/hotels/near-coors-field", label: "Where to stay for a Rockies game" },
      { href: "/hotels/near-ball-arena", label: "Where to stay for a Nuggets or Avalanche game" },
    ],
  },
  {
    slug: "rino",
    bestFor: "Food and art lovers",
    notFor: "Anyone who needs a quiet street",
    take:
      "RiNo is where I'd stay if I were visiting Denver right now. The restaurant density is the best in the city, the breweries are world-class, and there's always something happening. It's a 10-minute walk from downtown and well-positioned for getting around. The only downside is it can get loud on weekends — pick a hotel on the quieter end of the neighborhood if that matters to you.",
    walk:
      "Larimer Street and Walnut are the spine, and most of what you came for sits between 25th and 40th. Coors Field is a 10 to 15 minute walk from the neighborhood's south end. Mission Ballroom is at the north end by the 38th and Blake station, and Larimer Lounge is the small-room venue in the middle. The murals people photograph aren't in one place — they're spread across the warehouse blocks, which is why walking it beats driving through. The neighborhood is long and thin, so where you book inside it matters more than in most of Denver: the south end is closer to downtown, the north end is closer to the music.",
    eat:
      "This is the argument for the neighborhood. Uchi is the destination sushi room. Cart-Driver does pizza and oysters out of a shipping container. Temaki Den and Colorado Sake Co sit a few blocks apart and anchor a serious Japanese scene. Barcelona Wine Bar and Corsica handle the wine end, Fish N Beer the oysters, Dio Mio the pasta. Bierstadt Lagerhaus is the beer hall worth going out of your way for, Black Shirt Brewing does pizza alongside, and Nocturne is the jazz room. For a visitor picking a base purely on where they'll eat dinner three nights running, it's this one.",
    hotels:
      "The Ramble Hotel anchors the south end and put a Death & Co bar in its lobby, which tells you the intended crowd. Catbird is an extended-stay format with kitchens and a rooftop, useful if you're in town more than a few nights. The Source Hotel is a new-build tower attached by walkway to the historic foundry that houses The Source market hall. Cambria arrived in 2024 and an AC Hotel opened in June 2026, both newer-build and more predictable. Supply has grown steadily here, which is part of why rates stay saner than LoDo's.",
    cost:
      "Cheaper than LoDo, and the gap widens on Rockies weekends when downtown rates spike and RiNo doesn't move as much. That arbitrage is the single most useful thing to know about booking a Denver baseball trip: same walk to the ballpark as the outer LoDo hotels, often noticeably less money. Festival weekends are the exception — when something large is on at Mission Ballroom or the neighborhood's own events fill up, the north end prices like downtown.",
    transit:
      "The 38th and Blake station puts you one stop from Union Station and a straight run to the airport on the same A Line train, no transfer. That single fact makes RiNo one of the easiest neighborhoods in Denver to arrive in with luggage.",
    skip:
      "Skip RiNo if you want to walk out of your hotel into a quiet street. It's an industrial district that became a nightlife district and the weekend noise is real, particularly near the venues. Skip it too if your trip is built around a game rather than the food — LoDo is closer to both stadiums, and on a Sunday morning RiNo is emptier than visitors expect.",
    venueLinks: [
      { href: "/hotels/near-mission-ballroom", label: "Where to stay for a Mission Ballroom show" },
    ],
  },
  {
    slug: "highlands",
    bestFor: "Couples and weekend trips",
    notFor: "Travelers without a rideshare budget",
    take:
      "The best views of the Denver skyline are from Highlands. The restaurant scene on 32nd Ave and LoHi is excellent. It's slightly removed from downtown — you'll probably Uber to Coors Field — but if you're here for a good time rather than a specific event, Highlands is hard to beat for a weekend stay.",
    walk:
      "The pedestrian bridge over I-25 connects LoHi to Riverfront Park and downtown on foot, and it surprises people — it's a genuine fifteen-minute walk into LoDo, not a theoretical one. Within the neighborhood there are two separate clusters worth knowing apart: the LoHi blocks around 16th and Boulder, dense and new, and Highlands Square up on 32nd Avenue, older and more residential. They're about a mile apart. Tennyson Street in neighboring Berkeley is a third strip and a short ride further out.",
    eat:
      "Worth knowing before you book: almost all of the food is up on the 30th-to-33rd blocks rather than in the newer LoHi cluster. Root Down and Linger, the latter in a converted mortuary, are the two visitors hear about first. Bar Dough and Uncle sit together on 32nd; Postino is the one that's genuinely in LoHi. Avanti Food & Beverage is a multi-vendor hall with a rooftop deck facing the skyline, which is the cheapest way to get the view everyone comes for. Williams & Graham is the cocktail bar behind a bookshop front and takes the reservation seriously. Gaetano's on Tejon has genuine neighborhood history. Blue Pan does Detroit-style pizza, and Proto's has been doing its thing on Platte Street across the river for over twenty years.",
    hotels:
      "Here's the honest problem, and it's the thing national guides paper over: LoHi and Highlands have almost no hotels. Search either and you'll mostly get vacation rentals. Guides get around this by listing a downtown property and calling it LoHi. If you specifically want a hotel room, you're looking at Jefferson Park on the edge of the neighborhood, or you're booking in LoDo and walking the bridge over for dinner — which is a perfectly good plan and worth naming as the plan rather than pretending otherwise.",
    cost:
      "Where rooms exist they price below Cherry Creek and around LoDo. But the real cost here is transport rather than the room. Budget for rides: Coors Field, Ball Arena and the airport train all involve either the bridge walk or a car.",
    transit:
      "No light rail. You walk the bridge into downtown, or you ride. That's the trade you make for the views and the restaurants, and across a four-night stay it adds up faster than people plan for.",
    skip:
      "Skip Highlands if you need a traditional hotel with a front desk, or if the trip is built around events at Coors Field or Ball Arena. Skip it too if you're arriving late with luggage — getting here from the airport means the A Line plus a ride, where LoDo is just the train.",
  },
  {
    slug: "cherry-creek",
    bestFor: "Luxury travelers and shoppers",
    notFor: "Anyone who wants a night out after 10pm",
    take:
      "Cherry Creek has the nicest hotels in Denver. If you want a spa, a rooftop pool, or a room that doesn't face a parking garage, this is your neighborhood. The Cherry Creek Shopping Center is here, but so is some of Denver's best fine dining. It's a short Uber to downtown.",
    walk:
      "Cherry Creek North is a genuine grid of walkable blocks — roughly sixteen of them, full of galleries, restaurants and independent shops, which is unusual for a city that mostly isn't built that way. The mall sits across First Avenue from it, and the distinction matters: North is the walkable part, the shopping center is the enclosed part. The Cherry Creek Trail runs from here toward downtown, flat and separated from traffic the whole way.",
    eat:
      "Fine dining is the neighborhood's stock in trade. Matsuhisa does the high-end omakase. Del Frisco's and Hillstone cover the steak-and-expense-account end. Blue Island Oyster Bar, North Italia and True Food Kitchen fill the middle. The Cherry Cricket is the counterweight — a burger institution that has been here since 1945, long before anything glossy around it. This is where you book the anniversary dinner, not where you find the cheap noodle shop.",
    hotels:
      "Clayton Members Club & Hotel holds one of Denver's four Michelin Keys and has the rooftop pool people book it for. Halcyon is the other design-led option. The JW Marriott sits on the North side, and Moxy is the newer, younger, cheaper entry. If you're choosing a Denver trip on the strength of the room rather than the location, the shortlist starts here and at Populus in the Golden Triangle.",
    cost:
      "Denver's priciest rooms sit here, and they're worth it if the hotel is part of why you came. It's also the least event-driven pricing in the city — Cherry Creek doesn't spike for baseball — so on a Rockies weekend the premium over LoDo narrows more than you'd expect. The Cherry Creek Arts Festival over the July 4th weekend is the one reliable local spike.",
    transit:
      "No light rail. Rideshare downtown runs about 15 minutes outside rush hour. If your trip is mostly downtown, this is the wrong base and the daily rides will annoy you.",
    skip:
      "Skip Cherry Creek if you want nightlife — it's quiet after dinner by design, and that's the product rather than a flaw. Skip it if the budget is tight, because you can eat at the same restaurants and sleep somewhere else for considerably less. And skip it on a first two-night visit, when you'll spend the trip commuting to the things you came to see.",
    venueLinks: [
      { href: "/hotels/near-cherry-creek", label: "Hotels in Cherry Creek" },
    ],
  },
  {
    slug: "downtown",
    bestFor: "Convenience and walkability",
    notFor: "Travelers looking for neighborhood character",
    take:
      "Downtown gets a bad reputation from locals, but for visitors it makes a lot of sense. You're central to everything, and the 16th Street Mall connects you to LoDo quickly. Larimer Square alone is worth the visit. If you want to minimize logistics, stay downtown.",
    walk:
      "16th Street reopened over the first weekend of October 2025 after three years and $175 million of construction. It was officially renamed too: the 16th Street Mall is now just 16th Street, and the free MallRide is now the 16th Street FreeRide. Plenty of locals still use the old names, but a guide describing the construction detours as current was written before the reopening. From the middle of the street you can walk to the Colorado Convention Center, Larimer Square, the Denver Performing Arts Complex and the Denver Art Museum, and the FreeRide covers the length of it if you'd rather not.",
    eat:
      "Guard and Grace is the downtown steakhouse. ChoLon, Tamayo and Osteria Marco cover the middle. Larimer Square is the concentrated version of downtown dining and the prettiest block to eat on. Beyond that, downtown food is convenient rather than exceptional — the good stuff is a short walk out in any direction, Uptown for 17th Avenue and RiNo for everything else.",
    hotels:
      "The Brown Palace has been open since 1892 and is the one downtown hotel that's a destination in itself, atrium lobby and afternoon tea included. Hotel Teatro faces the Performing Arts Complex. The Kimpton Monaco, Le Méridien, Grand Hyatt, Magnolia and AC Hotel Downtown make up the reliable mid-to-upper tier. The Curtis unveiled a full renovation in March 2026. The Hyatt Regency, attached to the Convention Center, completed a $70 million refresh of all 1,100 rooms in April 2026 — relevant if you're here for a conference and remember it being tired.",
    cost:
      "Mid-to-high, and driven by the convention calendar rather than by weekends. A citywide at the Colorado Convention Center can double a Tuesday rate. Check what's booked before assuming midweek is cheap — CEDIA Expo runs 1–4 September 2026 and Splunk's .conf26 follows 14–17 September, and those two weeks price nothing like the ones either side of them.",
    transit:
      "The FreeRide runs 16th Street end to end for free, every 4 to 12 minutes, with light rail at both ends — Union Station at the north, Civic Center at the south. For a visitor who doesn't want to think about logistics, this is the most forgiving base in the city.",
    skip:
      "Two honest warnings. 16th Street still has vacant storefronts and stretches of it feel half-finished, though the trend is going the right way — retail vacancy hit its lowest level since tracking began in 2021, and foot traffic was up 13% year over year by April 2026. And the blocks toward the Capitol and the eastern edge of the ballpark district get thin on foot after dark — not dangerous so much as empty, which is a different thing but still worth knowing when you're picking which end of downtown to book.",
    venueLinks: [
      { href: "/hotels/near-convention-center", label: "Where to stay for a Convention Center conference" },
    ],
  },
  {
    slug: "capitol-hill",
    bestFor: "Budget travelers and nightlife",
    notFor: "Families with young kids",
    take:
      "Cap Hill has some of the most affordable hotels close to downtown Denver. You're a 20-minute walk from LoDo and surrounded by bars, live music venues, and late-night food. It's got an edge to it — but if you want to stay somewhere with actual character, Cap Hill delivers.",
    walk:
      "Colfax runs through it and so does most of Denver's live music — the Ogden and the Fillmore are half a mile apart on Colfax, which makes this the obvious base for a show night. The Bluebird is a further two miles east — a short ride rather than a walk. The State Capitol, the Denver Art Museum and Civic Center Park sit on the western edge. Cheesman Park and the Denver Botanic Gardens are on the eastern edge, about fifteen minutes apart on foot. The Molly Brown House Museum is mid-neighborhood and is the silver-boom mansion you can actually go inside.",
    eat:
      "Cheap and good, in volume — this is late-night food territory rather than reservation territory, and the density is the point. City O' City is the long-running vegetarian room and Bang Up To The Elephant does Caribbean a few blocks over. Cosmo's covers the after-a-show slice. Thump, Roostercat and The Corner Beet handle mornings, and Stoney's is the large, loud neighborhood bar.",
    hotels:
      "The historic housing stock means smaller and more characterful properties rather than glass boxes. Urban Cowboy opened in a restored 1880s mansion here in 2024 and is the most distinctive room in the neighborhood. Beyond that you're mostly choosing between modest independents and chains on the Colfax and Broadway edges, which is exactly why the rates are what they are.",
    cost:
      "The best value in central Denver, and the gap holds up even on event weekends because Cap Hill doesn't price off the ballpark. If your trip is downtown-centric but your budget isn't, this is the neighborhood that solves it — twenty minutes on foot to LoDo, at meaningfully less per night.",
    transit:
      "No light rail through the middle. You walk, take the Colfax bus, or ride. Everything central is close enough that it rarely matters, and the walk into downtown is flat.",
    skip:
      "Skip Cap Hill if you're traveling with young kids, or if you want a predictable chain-hotel experience with a pool and a parking garage. Colfax is Colfax — that's the character people come for and the reason some visitors would rather be somewhere else. If you're arriving late and want a quiet street, book elsewhere.",
    venueLinks: [
      { href: "/hotels/near-botanic-gardens", label: "Hotels near the Denver Botanic Gardens" },
    ],
  },
  {
    slug: "uptown",
    bestFor: "Foodies who don't want to pay LoDo rates",
    notFor: "Anyone whose trip is built around a game",
    take:
      "Uptown doesn't get enough credit as a place to stay. 17th Avenue is one of the best restaurant strips in Denver, and you're close to both downtown and City Park. Hotels here tend to be mid-range and good value. If eating well is your main priority, this is a smart base.",
    walk:
      "17th Avenue is the spine, and it has carried the Restaurant Row name for years. It's genuinely walkable end to end, about a mile of it. Downtown is 10 to 15 minutes west on foot. City Park is a similar walk east, and it holds both the Denver Zoo and the Denver Museum of Nature & Science — which makes Uptown one of the few Denver neighborhoods with a real restaurant strip and a full day of family attractions inside walking distance of the same hotel.",
    eat:
      "Steuben's is the anchor, doing comfort food and a patio that runs all summer. Watercourse is the vegetarian institution. Olive & Finch and Onefold handle breakfast, White Pie the mid-week dinner, Dos Santos the tacos and tequila. Ace Eat Serve pairs a menu with ping-pong tables. The strip has the density of RiNo at lower prices and without the weekend crowds.",
    hotels:
      "Mid-range and stable, mostly on the downtown-facing edge — the Kimpton Monaco, Le Méridien and Magnolia all sit close enough to count. The Brown Palace is a short walk. There's little that's boutique or destination here; you're booking Uptown for what's outside the hotel rather than inside it.",
    cost:
      "Reliable rather than cheap, and it doesn't spike the way LoDo does for baseball. That makes it the sensible fallback on a home-game weekend when downtown rates go silly and RiNo has filled up.",
    transit:
      "Walkable to downtown, buses along the main avenues, no light rail. For a trip centred on food and the park museums you won't miss it. For anything at Empower Field or the airport, you'll want to start from Union Station.",
    skip:
      "Skip Uptown if the trip is built around Coors Field or Ball Arena — you'll walk 25 minutes or pay for rides both ways. Skip it too if you want a hotel with a pool and a view, because that isn't what's here. It's a neighborhood you stay in to eat well and spend nothing on the room.",
    venueLinks: [
      { href: "/hotels/near-city-park", label: "Hotels near City Park" },
      { href: "/hotels/near-denver-zoo", label: "Hotels near the Denver Zoo" },
    ],
  },
  {
    slug: "washington-park",
    bestFor: "Families and slower trips",
    notFor: "First-time visitors on a short stay",
    take:
      "Wash Park is a great choice if you're traveling with kids or you want to actually slow down. The park is beautiful, the neighborhood is safe and walkable, and the coffee shops are legitimately good. You'll Uber downtown but that's fine — this is the kind of neighborhood that makes Denver feel like a real city.",
    walk:
      "The park is the draw: 165 acres, two lakes, formal gardens, and a loop that fills with runners every evening. Old South Gaylord is the small commercial block on the eastern edge — a couple of streets of restaurants and shops, the kind of thing Denver has less of than it should. South Pearl Street in neighbouring Platt Park is a second strip a short ride south, with a Sunday farmers market in season.",
    eat:
      "Neighborhood restaurants rather than destination ones, with one significant exception: South Pearl punches far above its size. Kizaki, the omakase counter from a co-founder of Sushi Den, sits on that strip — a handful of seats, two sittings a night, around twenty courses. Closer in, Homegrown Tap & Dough and Max Gill & Grill cover Old South Gaylord. Lucile's does Creole breakfast about a mile northwest on Logan.",
    hotels:
      "Limited inventory, because this is a residential neighborhood — which is precisely why it feels the way it does. Expect to choose between a small handful of options rather than compare twenty, and expect most of them to sit on the edges rather than in the middle of it.",
    cost:
      "Moderate, and stable. Nothing here prices off the event calendar, which is a quiet advantage if your dates happen to collide with a citywide convention or a big weekend at the ballpark.",
    transit:
      "Light rail runs along the western edge at the Louisiana–Pearl and University stations, which gets you downtown without a car. Within the neighborhood you walk. Getting to the airport means light rail plus a transfer at Union Station.",
    skip:
      "Skip Wash Park if it's a two-night first visit. You'll spend the trip commuting to the things you came to see and wonder why the guide recommended it. This neighborhood rewards a longer stay, a repeat visit, or a trip where the point is the park rather than the city.",
  },
  {
    slug: "golden-triangle",
    bestFor: "Museums and design-minded travelers",
    notFor: "Anyone who wants a lively street outside the door",
    take:
      "The Golden Triangle is walking distance to the Denver Art Museum, the Clyfford Still Museum, and the History Colorado Center. If museums and culture are high on your list, staying here means you're walking to all of it. Quiet neighborhood, well-located.",
    walk:
      "There's a fourth building most visitors miss: The Kirkland at the Denver Art Museum, on Bannock, which merged into the DAM in October 2024 and is covered by the same ticket. It packs Arts and Crafts through mid-century design into a jewel box, hung salon-style. Add the State Capitol, Civic Center Park and the southern end of 16th Street and it's all inside a ten-minute walk. That's a lot of museum inside ten minutes, in a neighborhood most visitors have never heard of.",
    eat:
      "Thinner than the neighborhoods either side, and that's the trade. Cuba Cuba, in a pair of converted houses, is the long-standing local pick. Leven Deli covers lunch. Fire, at The Art Hotel, has a patio facing the museum. Capitol Hill and downtown are both a short walk for dinner, so you're never stuck — you just won't stumble into anything.",
    hotels:
      "Populus opened at 14th and Colfax in October 2024 — 265 rooms, one of Denver's four Michelin Keys, and a building whose facade you'll recognise from photographs before you arrive. It changed both what this neighborhood costs and what it's known for. The Art Hotel is the other design-led option, hung with real work and connected to the museum campus by a short walk. Below those, several extended-stay and Marriott-family properties sit along the eastern edge at rates well under Cherry Creek.",
    cost:
      "Mid-range with a high ceiling. Populus prices like a destination hotel because it is one; everything else in the neighborhood sits comfortably below downtown. Rates here follow the convention calendar more than the sports one.",
    transit:
      "Civic Center Station is the southern terminus of the 16th Street FreeRide and a major bus hub, and light rail is a short walk at the Colfax stations. Downtown is close enough to walk in under fifteen minutes.",
    skip:
      "Skip the Golden Triangle if you want to walk out of the lobby into activity. It is quiet in the evenings — genuinely quiet, not code for anything else — which is either exactly the appeal or an immediate dealbreaker. There's no nightlife to speak of and the streets empty out after the museums close.",
  },
  {
    slug: "airport",
    bestFor: "Early flights and late arrivals",
    notFor: "Anyone who actually wants to see Denver",
    take:
      "If you have a 6am flight or a midnight arrival, staying near DEN makes more sense than spending $80 on an Uber to downtown. There are solid options at every price point out here, and the Gaylord Rockies is worth knowing about if you want something more than just a sleep-and-fly.",
    walk:
      "Nothing, and pretending otherwise does nobody any favours. This is a car-and-shuttle district built on former prairie. The Westin is the exception: it's attached to the terminal, so you walk to your gate, which is the whole reason to pay for it.",
    eat:
      "Hotel restaurants and chains along Tower Road and Peña Boulevard. The Gaylord Rockies has enough inside it — restaurants, a water park, a seasonal ICE! exhibition at Christmas — to make an evening of, which is the argument for choosing it over a cheaper room nearby rather than treating it as an airport hotel at all.",
    hotels:
      "The Westin at the terminal is the no-transfer option. The Gaylord Rockies is the resort, and it's a destination for families in its own right rather than a stopover. Below those, the Gateway Park cluster on Tower Road holds the usual Hampton, Hyatt Place and Best Western Plus options, most with free shuttles — though shuttle frequency varies a lot between them, and that's the thing worth confirming before you book a 5am departure.",
    cost:
      "The cheapest hotel rates in metro Denver by a wide margin, which is what tempts people into booking here for a whole trip. Do the arithmetic first: two rideshares a day into the city will erase the saving by the second morning, and you'll have spent three hours in a car doing it.",
    transit:
      "The A Line runs from the airport to Union Station in about 37 minutes for a $10 Airport Day Pass — and it is a day pass, not a one-way, which almost every national guide gets wrong. Trains run every 15 minutes through the middle of the day. Unless your flight is genuinely early, the A Line usually beats booking out here at all.",
    skip:
      "Skip the airport district for anything but the night before an early departure or the night of a late landing. And if you're leaving a car while you fly, book the room you're actually sleeping in — park-and-fly packages require a real stay, and cars left in hotel lots without one get towed.",
    venueLinks: [
      { href: "/hotels/near-denver-airport", label: "Where to stay near Denver Airport (DEN)" },
    ],
  },
];

// Quick-answer comparison table, rendered above the neighborhood sections.
// This is the passage most likely to be lifted into an AI answer, so it has to
// stand alone without the surrounding page.
export const QUICK_PICKS: { area: string; slug: string; verdict: string }[] = [
  { area: "LoDo / Union Station", slug: "lodo", verdict: "First visit, or any trip built around a game. Walk everywhere, pay for the privilege." },
  { area: "RiNo", slug: "rino", verdict: "Best food and breweries in the city, one A Line stop from Union Station. Loud on weekends." },
  { area: "Downtown", slug: "downtown", verdict: "Most central and most forgiving. Rates follow the convention calendar, not the weekend." },
  { area: "Capitol Hill", slug: "capitol-hill", verdict: "Best value close in, most character, and the live-music strip on the doorstep." },
  { area: "Uptown", slug: "uptown", verdict: "17th Avenue restaurants at mid-range rates, walkable to downtown and the park museums." },
  { area: "Golden Triangle", slug: "golden-triangle", verdict: "The city's museum cluster on foot, and Populus. Dead quiet at night, which is the point." },
  { area: "Cherry Creek", slug: "cherry-creek", verdict: "Denver's nicest rooms and best fine dining. No nightlife, no light rail." },
  { area: "Highlands / LoHi", slug: "highlands", verdict: "Best skyline views and a great restaurant strip — but barely any actual hotels." },
  { area: "Washington Park", slug: "washington-park", verdict: "Families and longer stays. Wrong choice for a two-night first visit." },
  { area: "Near DEN", slug: "airport", verdict: "Only for a 6am departure or a midnight landing. Otherwise take the A Line." },
];

export const STAY_FAQS: { q: string; a: string }[] = [
  {
    q: "What is the best area to stay in Denver for a first visit?",
    a: "LoDo, around Union Station. It is the one part of Denver where you can arrive by train from the airport, walk to Coors Field and Ball Arena, and get through a three-night trip without ever renting a car. You pay a premium for that, and it's usually worth it on a first visit. RiNo is the better choice if you care more about where you'll eat than how far you'll walk to a game.",
  },
  {
    q: "Do I need a car in Denver?",
    a: "Not if you stay in LoDo, downtown, RiNo or the Golden Triangle. The A Line connects the airport to Union Station in about 37 minutes, the 16th Street FreeRide runs the length of downtown for free, and light rail reaches Empower Field and Ball Arena. You'll want a car for Red Rocks, the foothills, or anything in the suburbs.",
  },
  {
    q: "Which Denver neighborhood is best for food?",
    a: "RiNo, by a clear margin — the highest concentration of restaurants and breweries in the city, in a walkable strip along Larimer and Walnut. Uptown's 17th Avenue is the better-value version of the same idea, and Cherry Creek has the fine dining. LoDo is the most convenient place to eat and the least interesting.",
  },
  {
    q: "What is the cheapest area to stay in central Denver?",
    a: "Capitol Hill. It sits a flat 20-minute walk from LoDo, doesn't price off the Rockies schedule the way downtown does, and has the live-music venues and late-night food on its own streets. The trade is that it's older, louder near Colfax, and short on chain hotels with parking garages.",
  },
  {
    q: "How much does the train from Denver airport cost?",
    a: "$10, and it is an Airport Day Pass rather than a one-way ticket — the same $10 covers your return trip later that day plus unlimited other RTD rides. The A Line takes about 37 minutes between Denver International Airport and Union Station and runs every 15 minutes through the middle of the day.",
  },
  {
    q: "What is Denver hotel tax?",
    a: "Denver's lodger's tax is 10.75%, and hotels with 50 or more rooms add a further 1% Tourism Improvement District surcharge, bringing it to 11.75% before state and district sales taxes are added on top. Budget for the advertised nightly rate plus meaningfully more at checkout.",
  },
  {
    q: "How much is hotel parking in downtown Denver?",
    a: "Typically $50 to $70 a night for self-park or valet at downtown hotels — The Crawford publishes valet at $68. If you're driving to Denver, compare the room rate plus parking rather than the room rate alone. Staying somewhere walkable and skipping the car entirely is often cheaper than a cheaper room plus two nights of valet.",
  },
  {
    q: "Will I get altitude sickness in Denver?",
    a: "Probably not. The CDC puts the threshold for altitude illness at sleeping altitudes of 8,000 feet and above, while noting some people are affected lower; Denver sits at 5,280. What the CDC does advise for anyone arriving at altitude is to avoid alcohol for the first 48 hours, keep exercise mild for the first 48 hours, and not skip your usual caffeine. The real adjustment comes if you day-trip into the mountains.",
  },
  {
    q: "Is downtown Denver safe to stay in?",
    a: "Yes, with the ordinary caveats of any American downtown. The more useful warning is about emptiness rather than danger: the blocks toward the Capitol and the eastern edge of the ballpark district get very quiet on foot after dark. LoDo and the Union Station blocks stay busy, which is part of why they're the easy recommendation for a first visit.",
  },
  {
    q: "Which Denver hotels have a Michelin Key?",
    a: "Four: Populus in the Golden Triangle, The Crawford Hotel inside Union Station, the Four Seasons Hotel Denver, and Clayton Members Club & Hotel in Cherry Creek. Each holds one Key. Statewide, only Dunton Hot Springs near Dolores holds two.",
  },
  {
    q: "Where should I stay in Denver for a Rockies game?",
    a: "LoDo, or the south end of RiNo. The Rally Hotel sits on McGregor Square directly across from Coors Field and The Crawford is under a ten-minute walk. LoDo rates spike on home-game weekends, so the useful move is booking RiNo instead — a 10 to 15 minute walk to the gates, frequently for noticeably less.",
  },
  {
    q: "When are Denver hotel rates highest?",
    a: "Rates track events more than seasons. A citywide convention at the Colorado Convention Center can double a midweek rate downtown, Rockies home weekends spike LoDo, and the National Western Stock Show fills the I-70 corridor for sixteen days each January. Denver's overnight visitation is flatter across the year than most people expect, so the calendar matters more than the month.",
  },
];

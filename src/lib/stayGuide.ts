// Editorial content for the "Where to Stay in Denver" pillar.
//
// Each area is a standardized module: the take (first-person), what you can
// actually walk to, where to eat, what it costs, how you get around, and who
// should skip it. The "skip" field is deliberate — every recommendation gets a
// disqualifier, because a guide that likes everything is useless.
//
// Facts carry sources in comments where they were verified. Nothing here
// invents first-hand experience.

export interface StayArea {
  slug: string;
  bestFor: string;
  notFor: string;
  take: string;
  walk: string;
  eat: string;
  cost: string;
  transit: string;
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
      "This is the only Denver neighborhood where a car is genuinely optional. Coors Field is about seven minutes on foot from Union Station. Ball Arena is a walk or one light-rail stop. The 16th Street FreeRide runs the length of 16th Street to Civic Center every 4 to 12 minutes, free, no ticket. Larimer Square, the Dairy Block and the Riverfront Park footbridges are all inside a 15-minute radius. If you land at DEN, the A Line drops you at Union Station and you may never touch a car for the rest of the trip.",
    eat:
      "The Union Station great hall alone covers a lot of ground, and Blake Street is where the pregame crowd goes. The honest caveat is that LoDo is not where Denver's best restaurants are. It is where the most convenient ones are. Walk fifteen minutes northeast into RiNo and the food improves sharply for the same money.",
    cost:
      "The most expensive night's sleep in the city, and it moves with the Rockies schedule. Home-game weekends spike; midweek is dramatically cheaper. Overnight parking downtown typically runs $50 to $70 a night — The Crawford publishes valet at $68 — so if you're driving, price the room and the parking together or you'll be surprised at checkout.",
    transit:
      "Union Station is the hub for the A Line to the airport, the E and W lines to Empower Field, and the FreeRide down 16th Street. Nothing else in Denver is this connected.",
    skip:
      "Skip LoDo if you want quiet. Bar close is 2am and the blocks around Blake Street are loud on weekend nights. Skip it too if value matters more than convenience — RiNo and Capitol Hill put you 10 to 20 minutes away for meaningfully less.",
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
      "Larimer Street and Walnut are the spine, and most of what you came for sits between 25th and 40th. Coors Field is a 10 to 15 minute walk from the neighborhood's south end. Mission Ballroom is at the north end by the 38th and Blake station. The murals people photograph are not in one place — they're spread across the warehouse blocks, which is the point of walking it rather than driving through.",
    eat:
      "This is the argument for the neighborhood. RiNo has the highest concentration of restaurants worth crossing town for in Denver, and the brewery density is unmatched anywhere in the state. If you are picking a base purely on where you'll eat dinner for three nights running, it's this one.",
    cost:
      "Cheaper than LoDo, and the gap widens on Rockies weekends when downtown rates spike and RiNo doesn't move as much. Newer hotels have opened steadily here — Cambria arrived in 2024, an AC Hotel in June 2026 — which keeps supply loose enough that rates stay reasonable outside festival weekends.",
    transit:
      "The 38th and Blake station puts you one stop from Union Station and a straight 30-minute run to the airport on the same A Line train. That single fact makes RiNo one of the easiest neighborhoods in Denver to arrive in.",
    skip:
      "Skip RiNo if you want to walk out of your hotel into a quiet street. It's an industrial district that turned into a nightlife district, and the weekend noise is real. Also skip it if you're here for a game rather than the food — LoDo is closer to both stadiums.",
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
      "The pedestrian bridge over I-25 connects LoHi to Riverfront Park and downtown on foot, which surprises people — it's a genuine walk, not a theoretical one. Within the neighborhood, 32nd Avenue and the LoHi blocks around 16th and Boulder are dense enough to spend a whole evening without moving the car.",
    eat:
      "Linger, in a converted mortuary on 30th, is the one visitors hear about first. The 32nd Avenue blocks and the LoHi cluster around 16th and Boulder carry the rest of it. Tennyson Street, a few minutes further into Berkeley, is a second strip worth the trip on its own, and Proto's has been doing the same thing well on Platte Street across the river for over twenty years.",
    cost:
      "Here's the honest problem: LoHi and Highlands have almost no hotels. Search either and you'll mostly find vacation rentals. National guides paper over this by listing a downtown property and calling it LoHi. If you want a hotel room specifically, you're looking at Jefferson Park on the edge of the neighborhood, or you're staying downtown and visiting.",
    transit:
      "No light rail. You'll walk the bridge into downtown or take a rideshare. Budget for it — this is the trade you make for the views and the restaurants.",
    skip:
      "Skip Highlands if you need a traditional hotel with a front desk, or if you're building the trip around events at Coors Field or Ball Arena. The rideshare adds up fast across a four-night stay.",
  },
  {
    slug: "cherry-creek",
    bestFor: "Luxury travelers and shoppers",
    notFor: "Anyone who wants a night out after 10pm",
    take:
      "Cherry Creek has the nicest hotels in Denver. If you want a spa, a rooftop pool, or a room that doesn't face a parking garage, this is your neighborhood. The Cherry Creek Shopping Center is here, but so is some of Denver's best fine dining. It's a short Uber to downtown.",
    walk:
      "Cherry Creek North is a genuine grid of walkable blocks — galleries, restaurants and shops across a dozen or so streets, which is unusual for Denver. The Cherry Creek Trail runs from here toward downtown and is one of the better urban bike paths in the country.",
    eat:
      "The fine-dining concentration is the highest in the city outside of a handful of downtown rooms. This is where you book the anniversary dinner, not where you find the cheap noodle shop.",
    cost:
      "The most expensive average rate in Denver, and worth it if the hotel is part of why you came. Clayton Members Club is one of only four Denver hotels to hold a Michelin Key, alongside Populus, The Crawford and the Four Seasons — a useful shortlist if you're deciding purely on the room.",
    transit:
      "No light rail. Rideshare to downtown runs about 15 minutes outside rush hour. If your trip is mostly downtown, this is the wrong base.",
    skip:
      "Skip Cherry Creek if you want nightlife. It's quiet after dinner by design. Skip it also if the budget is tight — you can eat at the same restaurants and sleep somewhere else for considerably less.",
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
      "16th Street reopened over the first weekend of October 2025 after three years and $175 million of construction. It was officially renamed too: the 16th Street Mall is now just 16th Street, and the free MallRide is now the 16th Street FreeRide. Plenty of locals still use the old names, but a guide that describes the construction detours as current was written before the reopening. From the middle of it you can walk to the Colorado Convention Center, Larimer Square, the Denver Art Museum and LoDo.",
    eat:
      "Larimer Square is the concentrated version. Beyond it, downtown dining is convenient rather than exceptional, and the good stuff is a short walk out in any direction — Uptown for 17th Avenue, RiNo for everything else.",
    cost:
      "Mid-to-high, and heavily driven by the convention calendar rather than by weekends. A citywide at the Convention Center can double rates on a Tuesday. Check what's booked before you assume midweek is cheap.",
    transit:
      "The FreeRide runs 16th Street end to end for free, every 4 to 12 minutes, and connects to Union Station at one end and Civic Center at the other. Both ends are light-rail stations.",
    skip:
      "Two honest warnings. 16th Street had a 25% retail vacancy rate at reopening, so parts of it still feel half-finished even though foot traffic was up 13% year over year by April 2026. And the blocks toward the Capitol and the ballpark edge get thin on foot traffic after dark — not dangerous so much as empty, which is a different thing but still worth knowing when you're choosing which end of downtown to book.",
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
      "Colfax runs through it, and so does most of Denver's live music. The State Capitol, the Denver Art Museum and Civic Center Park are on the western edge. The Denver Botanic Gardens sit on the eastern edge by Cheesman Park. Twenty minutes on foot gets you to LoDo; ten gets you to the museums.",
    eat:
      "Cheap and good, in volume. This is late-night food territory rather than reservation territory, and the density of it is the reason people who live here rarely leave the neighborhood on a weeknight.",
    cost:
      "The best value in central Denver. The historic housing stock means smaller, older, more characterful properties — Urban Cowboy opened in a restored 1880s mansion here in 2024 — rather than the glass boxes downtown.",
    transit:
      "No light rail through the middle of it. You walk, or you catch the Colfax bus, or you rideshare. Everything central is close enough that this rarely matters.",
    skip:
      "Skip Cap Hill if you're traveling with young kids or you want a predictable chain-hotel experience. Colfax is Colfax — that's the character people come for and the reason some visitors would rather be elsewhere.",
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
      "17th Avenue is the spine and it's genuinely walkable end to end. Downtown is a 10 to 15 minute walk west. City Park, the Denver Zoo and the Denver Museum of Nature & Science are a similar walk east — which makes Uptown one of the few places you can put both a restaurant strip and a full day of family attractions inside walking distance.",
    eat:
      "Restaurant Row is the local name for 17th and it earns it. The strip has the density of RiNo at lower prices and without the weekend crowds.",
    cost:
      "Mid-range and stable. It doesn't spike the way LoDo does for baseball, which makes it a reliable fallback on a game weekend when downtown rates go silly.",
    transit:
      "Walkable to downtown, bus service along the main avenues, no light rail. For a trip centered on food and the park museums, you won't miss it.",
    skip:
      "Skip Uptown if your trip is built around Coors Field or Ball Arena — you'll walk 25 minutes or pay for rides. Skip it too if you want a hotel with a pool and a view; that isn't what's here.",
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
      "The park itself is the draw — 165 acres with two lakes and a loop that fills with runners every evening. South Gaylord Street and the South Pearl Street strip in neighboring Platt Park are both small, walkable commercial blocks of the kind Denver doesn't have many of.",
    eat:
      "Neighborhood restaurants rather than destination ones, with the notable exception of South Pearl, which punches well above its size. Kizaki, the omakase counter from the founder of Sushi Den, is on that strip — a handful of seats, two sittings a night, around twenty courses.",
    cost:
      "Limited hotel inventory — this is a residential neighborhood, which is exactly why it feels the way it does. Expect to be choosing between a small number of options rather than comparing twenty.",
    transit:
      "Light rail runs along the western edge at Louisiana–Pearl and University stations, which connects you downtown without a car. Within the neighborhood you walk.",
    skip:
      "Skip Wash Park if it's a two-night first visit. You'll spend the trip commuting to the things you came to see. This neighborhood rewards a longer stay, or a repeat visit where you already know what you want to do.",
  },
  {
    slug: "golden-triangle",
    bestFor: "Museums and design-minded travelers",
    notFor: "Anyone who wants a lively street outside the door",
    take:
      "The Golden Triangle is walking distance to the Denver Art Museum, the Clyfford Still Museum, and the History Colorado Center. If museums and culture are high on your list, staying here means you're walking to all of it. Quiet neighborhood, well-located.",
    walk:
      "Three major museums, the State Capitol, Civic Center Park and the western end of 16th Street are all inside a ten-minute walk. It's the densest concentration of culture in the state and it sits in a neighborhood most visitors have never heard of.",
    eat:
      "Thin on its own, and that's the trade. Capitol Hill and downtown are both a short walk for dinner, so you're never stuck — you just won't stumble into it.",
    cost:
      "Populus opened here at 14th and Colfax in October 2024 — 265 rooms, and one of the four Denver hotels holding a Michelin Key. It changed what this neighborhood costs and what it's known for. Beyond it, rates sit below Cherry Creek and around downtown.",
    transit:
      "Civic Center Station is the southern terminus of the 16th Street FreeRide and a major bus hub. Light rail is a short walk at the Colfax stations.",
    skip:
      "Skip the Golden Triangle if you want to walk out of the lobby into activity. It's quiet in the evenings — genuinely quiet, not code for anything else — which is either the appeal or the dealbreaker.",
  },
  {
    slug: "airport",
    bestFor: "Early flights and late arrivals",
    notFor: "Anyone who actually wants to see Denver",
    take:
      "If you have a 6am flight or a midnight arrival, staying near DEN makes more sense than spending $80 on an Uber to downtown. There are solid options at every price point out here, and the Gaylord Rockies is worth knowing about if you want something more than just a sleep-and-fly.",
    walk:
      "Nothing. This is a car-and-shuttle district built on former prairie, and pretending otherwise does nobody any favors. The Westin is the exception — it's attached to the terminal, so you walk to your gate.",
    eat:
      "Hotel restaurants and chains along Tower Road and Peña Boulevard. The Gaylord Rockies has enough inside it to make an evening of, which is the argument for choosing it over a cheaper room nearby.",
    cost:
      "The cheapest hotel rates in metro Denver by a wide margin, which is what tempts people into booking here for a whole trip. Do the arithmetic first: two rideshares a day into the city will erase the savings by the second morning.",
    transit:
      "The A Line runs from the airport to Union Station in about 37 minutes for a $10 Airport Day Pass — and it is a day pass, not a one-way, which almost every national guide gets wrong. Trains run every 15 minutes through most of the day. If your flight isn't at 6am, the A Line usually beats booking out here at all.",
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
  { area: "Downtown", slug: "downtown", verdict: "Most central and most convenient. Rates follow the convention calendar, not the weekend." },
  { area: "Capitol Hill", slug: "capitol-hill", verdict: "Best value close in, with the most character. Colfax nightlife on the doorstep." },
  { area: "Uptown", slug: "uptown", verdict: "17th Avenue restaurants at mid-range rates, walkable to downtown and the park museums." },
  { area: "Golden Triangle", slug: "golden-triangle", verdict: "Three major museums on foot. Quiet at night, which is the whole point." },
  { area: "Cherry Creek", slug: "cherry-creek", verdict: "Denver's nicest hotels and best fine dining. No nightlife, no light rail." },
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
    q: "How much does the train from Denver airport cost?",
    a: "$10, and it is an Airport Day Pass rather than a one-way ticket — the same $10 covers your return trip later that day plus unlimited other RTD rides. The A Line takes about 37 minutes between Denver International Airport and Union Station and runs every 15 minutes through most of the day.",
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
    a: "Probably not. The CDC puts the threshold for altitude illness at sleeping altitudes of 8,000 feet and above; Denver sits at 5,280. What the CDC does advise for anyone arriving at altitude is to avoid alcohol for the first 48 hours, keep exercise mild for the first 48 hours, and not skip your usual caffeine. The real adjustment comes if you day-trip into the mountains, where the elevation is genuinely high.",
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
    q: "When are Denver hotel rates highest?",
    a: "Rates track events more than seasons. A citywide convention at the Colorado Convention Center can double a midweek rate downtown, Rockies home weekends spike LoDo, and the National Western Stock Show fills the I-70 corridor for sixteen days each January. Denver's overnight visitation is flatter across the year than most people expect, so the calendar matters more than the month.",
  },
];

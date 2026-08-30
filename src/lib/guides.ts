// Support guides for the "Where to Stay in Denver" cluster.
//
// These are the link magnets: short, factual, ruthlessly specific pages that
// answer a logistics question no national travel blog bothers to get right.
// They rarely convert on their own — they exist to be cited, to be linked from
// everywhere, and to prove the site knows things the aggregators don't.
//
// Every figure here is sourced. Where a number could not be verified from a
// primary source it is omitted rather than estimated.

export interface GuideSection {
  h2: string;
  /** 40–60 word self-contained answer. Written to survive being quoted alone. */
  answer: string;
  body?: string[];
  table?: { head: string[]; rows: string[][] };
  list?: string[];
  /**
   * Hotel slugs to render as large image cards directly under this section.
   * These pages were walls of text with the only photography far below the
   * fold; a spotlight puts the rooms beside the argument for them.
   */
  spotlight?: { slugs: string[]; heading?: string; note?: string };
}

/**
 * Booking module for a guide page.
 *
 * These pages were shipped as pure link magnets and carried no way to book at
 * all — which is a strange thing to do on a page about what a hotel costs.
 * Each guide now names the neighborhoods its reader is actually choosing
 * between, and the template renders real properties with per-hotel affiliate
 * links rather than a generic "browse Denver hotels" dead end.
 */
export interface GuideBooking {
  /** Sub-ID reported to Expedia so revenue can be attributed to this page. */
  pubref: string;
  heading: string;
  blurb: string;
  /** Omit for pages where showing specific hotels would be arbitrary. */
  areas?: { slug: string; label: string; note: string }[];
}

export interface Guide {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  /** Lead passage. Must fully answer the primary query on its own. */
  lede: string;
  sections: GuideSection[];
  faqs: { q: string; a: string }[];
  booking?: GuideBooking;
  updated: string;
}

export const GUIDES: Record<string, Guide> = {
  "airport-train": {
    slug: "airport-train",
    title: "The A Line: Denver Airport to Downtown by Train",
    metaTitle: "Denver Airport to Downtown by Train — A Line Fares & Times",
    metaDescription:
      "The A Line runs DEN to Union Station in about 37 minutes for $10 — and that $10 is a day pass, not a one-way. Fares, frequency and which hotels sit on the line.",
    ogTitle: "Denver Airport to Downtown: The A Line, Explained",
    ogDescription:
      "About 37 minutes, every 15 minutes, $10 for an Airport Day Pass that covers your return trip too.",
    lede:
      "The University of Colorado A Line runs between Denver International Airport and Union Station in about 37 minutes, every 15 minutes through the middle of the day. The fare is $10 — and it is an Airport Day Pass, not a one-way ticket, so the same $10 covers your trip back later that day plus unlimited other RTD rides. Almost every national guide to Denver gets this wrong and tells you $10 each way.",
    updated: "2026-08-28",
    sections: [
      {
        h2: "How much does the train from Denver airport cost?",
        answer:
          "$10 for an Airport Day Pass. RTD sells it as a day pass rather than a single ride, so a same-day round trip between the airport and downtown costs $10 total, and it also covers every other RTD bus and train you take that day.",
        body: [
          "That distinction is worth real money on a short trip. If you land Friday, ride into town, and take light rail to a game on Saturday, you are buying two day passes rather than four single fares.",
          "Riders 19 and under travel free on RTD, so a family arriving with teenagers pays for the adults only.",
        ],
        table: {
          head: ["Pass", "Adult", "Discount"],
          rows: [
            ["Airport Day Pass", "$10.00", "No additional charge for discount-fare riders"],
            ["3-hour pass", "$2.75", "$1.35"],
            ["Day pass", "$5.50", "$2.70"],
            ["Monthly pass (includes airport)", "$88.00", "$27.00"],
            ["Upgrade to airport from a 3-hour pass", "$7.25", "—"],
            ["Upgrade to airport from a day pass", "$4.50", "—"],
          ],
        },
      },
      {
        h2: "How long does the A Line take, and how often does it run?",
        answer:
          "About 37 minutes end to end between Denver International Airport and Union Station, covering 23 miles. Trains run every 15 minutes through the middle of the day and every 30 minutes early and late, seven days a week. RTD adjusts the exact windows at each service change — the next takes effect 27 September 2026 — so check the live schedule for your travel date.",
        body: [
          "First and last departures shift with the schedule and RTD does not publish them in a form worth quoting here. If you are catching a genuinely early flight or landing near midnight, check RTD's live schedule for the day you travel rather than trusting any guide, including this one.",
        ],
      },
      {
        h2: "Which Denver hotels are on the A Line?",
        spotlight: {
          slugs: [
            "the-crawford-hotel",
            "the-oxford-hotel",
            "limelight-denver",
            "hotel-indigo-denver-downtown-union-station-by-ihg",
          ],
          heading: "Rooms at the end of the line",
          note: "All four are inside a few minutes' walk of Union Station, where the A Line terminates. The Crawford is literally inside the building.",
        },
        answer:
          "The A Line has eight stations, and three of them put you inside a walkable Denver neighborhood: Union Station for LoDo and downtown, 38th and Blake for RiNo, and Central Park for the east-side residential neighborhoods. Book near one of those and you can skip the rental car entirely.",
        list: [
          "Union Station — LoDo, downtown, the 16th Street FreeRide, and connections to Empower Field and Ball Arena",
          "38th and Blake — RiNo, and a short walk to Mission Ballroom",
          "40th and Colorado",
          "Central Park",
          "Peoria",
          "40th and Airport Blvd — Gateway Park, the airport hotel cluster",
          "61st and Peña",
          "Denver Airport",
        ],
        body: [
          "The practical version: staying at Union Station or in RiNo means the airport is a single train ride with no transfer. That is unusual for a US city and it is the strongest argument for paying LoDo rates on a first visit.",
        ],
      },
      {
        h2: "Is the A Line better than a rideshare from the airport?",
        answer:
          "For downtown, RiNo or anywhere near Union Station, yes — it is faster than rush-hour traffic, costs $10 for the round trip, and drops you in the middle of the city. A rideshare wins if you are staying somewhere the train does not reach, arriving outside service hours, or traveling with more luggage than you want to carry.",
        body: [
          "This page covers the train. Hotel shuttles, mountain shuttles, rideshare and taxi costs are covered separately in the Denver airport ground-transport guide. Denver gets an unusually high share of visitors by air — 42% of overnight visitors arrive by plane, against a national average of 28% — which is why the airport connection matters more here than in most US cities.",
        ],
      },
      {
        h2: "Getting to Denver venues without a car",
        answer:
          "Light rail reaches most of Denver's major venues directly from downtown. Empower Field is two stops from Union Station on the E or W line. Ball Arena has its own station on the E and W lines. Mission Ballroom sits by the 38th and Blake A Line station.",
        list: [
          "Coors Field — walk from Union Station, about seven minutes",
          "Ball Arena — Ball Arena/Elitch Gardens station on the E and W lines",
          "Empower Field at Mile High — two stops from Union Station on the E or W line",
          "Mission Ballroom — 38th and Blake on the A Line, one stop from Union Station",
          "Fiddler's Green Amphitheatre — a 10-minute walk from Arapahoe at Village Center station",
          "Red Rocks Amphitheatre — no transit service. You drive, take a private show shuttle, or use a rideshare.",
        ],
      },
      {
        h2: "What about the 16th Street FreeRide?",
        answer:
          "The free shuttle along 16th Street is now called the 16th Street FreeRide, not the MallRide, and the street itself is now just 16th Street rather than the 16th Street Mall. It runs Union Station to Civic Center every 4 to 12 minutes, free, with no ticket.",
        body: [
          "16th Street reopened over the first weekend of October 2025 after more than three years and $175 million of reconstruction. Guides that still call it the MallRide or describe the construction detours were written before that and have not been touched since.",
        ],
      },
    ],
    faqs: [
      {
        q: "Is the $10 A Line fare each way?",
        a: "No. RTD sells it as an Airport Day Pass, so $10 covers the trip out, the trip back the same day, and any other RTD bus or train you use that day.",
      },
      {
        q: "Do I need to buy the A Line ticket in advance?",
        a: "No. Buy it at the station or in RTD's app before you board. There are no reservations and no assigned seats.",
      },
      {
        q: "How do you buy an A Line ticket at the airport?",
        a: "At the ticket kiosks by the platform — they are at the bottom of the escalator down from the terminal, and they take cash or card. You do not need an account and you do not need the app, though RTD's MyRide app works if you prefer. Buy before you board: inspectors check tickets on the A Line regularly. Youth 19 and under and active-duty US military ride free, which is worth knowing before you buy four adult fares for a family.",
      },
      {
        q: "How long is an RTD day pass valid?",
        a: "Until 2:59am, not 24 hours from when you activate it. That trips people up: a pass bought at 4pm on Tuesday is dead at 3am Wednesday, not at 4pm Wednesday. The upside is that within one service day an Airport Day Pass covers multiple airport round-trips, so if you are collecting someone later the same day you do not need a second one.",
      },
      {
        q: "Which level of Denver airport is baggage claim on?",
        a: "Baggage claim is on Level 5, on both the east and west sides of the terminal. Passenger pickup is Level 4. People mix these two up constantly when arranging to meet someone — if you are being collected, agree on Level 4 and a side, east or west, because the building is long enough that the side matters more than the level.",
      },
      {
        q: "Where does the A Line drop you in downtown Denver?",
        a: "Union Station, in the middle of LoDo. The station building itself holds The Crawford Hotel, a food hall and several bars, and the 16th Street FreeRide starts from the door.",
      },
      {
        q: "Have RTD fares changed recently?",
        a: "Not since 1 January 2024, when RTD simplified and in most cases lowered its fares. Fare news from 2026 concerns Access-on-Demand paratransit, not the trains or buses.",
      },
    ],
    booking: {
      pubref: "guide-airport-train",
      heading: "Book where the train actually stops",
      blurb: "The A Line only saves you money if your hotel is near one of its stations. These two clusters are the ones it genuinely serves — Union Station at the end of the line, and the airport district for a pre-dawn departure.",
      areas: [
        { slug: "lodo", label: "LoDo & Union Station", note: "You get off the train and walk to the front desk. The most expensive sleep in Denver, and the only one where the A Line does all the work." },
        { slug: "airport", label: "Near DEN", note: "For a flight before about 7am, when working backwards through the timetable makes a downtown room a bad night's sleep." },
      ],
    },
  },

  "hotel-costs": {
    slug: "hotel-costs",
    title: "What a Denver Hotel Actually Costs",
    metaTitle: "What a Denver Hotel Actually Costs — Taxes & Parking",
    metaDescription:
      "Denver's lodger's tax is 10.75%, larger hotels add 1% more, and downtown parking runs $50–$70 a night. What the advertised rate doesn't tell you.",
    ogTitle: "What a Denver Hotel Actually Costs",
    ogDescription:
      "Lodger's tax, the Tourism Improvement District surcharge, and $50–$70 nightly parking — the real number at checkout.",
    lede:
      "The advertised nightly rate is not what you pay in Denver. Add the city's 10.75% lodger's tax, a further 1% Tourism Improvement District surcharge at hotels with 50 or more rooms, state and district sales taxes on top of that, and $50 to $70 a night if you are parking a car downtown. On a three-night stay with a rental car, the gap between the rate you booked and the bill you settle is routinely more than a hundred dollars.",
    updated: "2026-08-28",
    sections: [
      {
        h2: "What is Denver's hotel tax?",
        answer:
          "Denver charges a 10.75% lodger's tax on hotel stays. Hotels with 50 or more rooms add a 1% Tourism Improvement District surcharge, taking it to 11.75%. Colorado state sales tax and district taxes are applied on top of that.",
        body: [
          "The 10.75% and the 1% surcharge are the figures to plan around. The full combined rate including state and district taxes varies, and Denver Treasury is the authority worth checking if you need an exact number for an expense claim.",
          "Practically: take the nightly rate and add at least 12%, more once state and district sales taxes land. If you need an exact figure for an expense claim, Denver Treasury is the authority.",
        ],
      },
      {
        h2: "How much is hotel parking in downtown Denver?",
        answer:
          "Expect $50 to $70 a night for self-park or valet at a downtown Denver hotel. The Crawford Hotel publishes valet at $68. Some hotels charge for their own garage while a reserved spot in a lot down the block costs less — it is worth asking which arrangement your hotel uses.",
        body: [
          "This is the single most common budgeting mistake visitors make in Denver. A $180 room with $65 valet is a $245 room, and a $210 room you can walk away from is cheaper.",
          "If you are driving in for a game or a show, reserving a garage spot in advance locks a rate and guarantees a space rather than circling. Rates at the lots closest to Coors Field and Ball Arena surge on event days and the nearest ones sell out early.",
        ],
      },
      {
        h2: "Is it cheaper to stay downtown without a car?",
        answer:
          "Usually, yes. A walkable downtown or LoDo room plus the A Line from the airport frequently beats a cheaper suburban or airport room plus a rental car, parking and fuel — particularly on trips of three nights or fewer where you would leave the car parked most of the time.",
        list: [
          "Airport to downtown on the A Line: $10 for a day pass covering the return trip",
          "Downtown hotel parking: $50–$70 per night",
          "Rental car: daily rate plus fuel plus that parking, every night of the stay",
        ],
        body: [
          "The exception is a trip built around the mountains, Red Rocks or anything in the suburbs. Red Rocks in particular has no transit service at all, so a show there means driving, a private show shuttle, or a rideshare.",
        ],
      },
      {
        h2: "When are Denver hotel rates highest?",
        answer:
          "Denver rates follow the event calendar more than the season. A citywide convention can double a midweek downtown rate, Rockies home weekends spike LoDo, and the National Western Stock Show fills the I-70 corridor for sixteen days every January.",
        body: [
          "Overnight visitation is flatter across the year than most people assume — the third quarter is the peak at 28% of overnight visitors and the first quarter the trough at 22%. That narrow spread is why checking what is booked in town beats picking a month.",
        ],
        list: [
          "Great American Beer Festival — 10–11 October 2026. Note it has moved outdoors to Levitt Pavilion at Ruby Hill in southwest Denver, not the Colorado Convention Center. Guides still sending you downtown for it are out of date.",
          "CEDIA Expo — 1–4 September 2026, Colorado Convention Center",
          "Splunk .conf26 — 14–17 September 2026, Colorado Convention Center",
          "National Western Stock Show — 9–24 January 2027",
          "Denver March Powwow — 19–21 March 2027, Denver Coliseum",
            ],
      },
      {
        h2: "Is downtown Denver getting more expensive?",
        answer:
          "Rates softened through 2025 and have been recovering since. Downtown Denver occupancy was 69% in March 2026, up from 61% a year earlier, with RevPAR at $150 against $118. The new-supply pipeline is light, which tends to firm rates rather than soften them.",
        body: [
          "For a visitor the useful read is that discounting is thinning out. Booking further ahead is worth more in 2026 than it was in 2025, particularly around the convention calendar.",
        ],
      },
    ],
    faqs: [
      {
        q: "What is Denver's lodger's tax?",
        a: "10.75%, plus a 1% Tourism Improvement District surcharge at hotels with 50 or more rooms. State and district sales taxes apply on top.",
      },
      {
        q: "Do Denver hotels charge resort fees?",
        a: "Some do, and they are separate from the lodger's tax and from parking. Check the booking's fee breakdown before comparing two rates, because a lower headline rate with a daily fee and paid parking can land higher than a more expensive room without them.",
      },
      {
        q: "How much should I budget per night for a downtown Denver hotel?",
        a: "Take the advertised rate, add at least 12% in taxes — more once state and district sales taxes are applied — and add $50 to $70 if you are parking a car. That total is the number worth comparing between hotels.",
      },
      {
        q: "Is parking cheaper at hotels outside downtown?",
        a: "Generally yes, and often free at airport-area and suburban hotels. Whether that saves money depends on how many rideshares into the city it costs you — two a day will usually erase the difference.",
      },
    ],
    booking: {
      pubref: "guide-hotel-costs",
      heading: "See what your dates actually cost",
      blurb: "Rates on this page move with the convention and Rockies calendars rather than with weekends, so the only number worth comparing is the one for your dates. Here are the two clusters most visitors end up choosing between.",
      areas: [
        { slug: "downtown", label: "Downtown", note: "Priced off the Colorado Convention Center calendar. A citywide can double a Tuesday rate, and the weeks either side price nothing like it." },
        { slug: "rino", label: "RiNo", note: "Cheaper than LoDo and it does not follow the ballpark, which is why the gap widens exactly on the weekends you were going to pay most." },
      ],
    },
  },

  altitude: {
    slug: "altitude",
    title: "Denver Altitude: What's Actually True",
    metaTitle: "Denver Altitude: What's Actually True at 5,280 Feet",
    metaDescription:
      "The CDC puts altitude illness risk at 8,000 feet and above. Denver is 5,280. What that means for your first 48 hours, and where altitude genuinely matters.",
    ogTitle: "Denver Altitude: What's Actually True",
    ogDescription:
      "Denver sits below the CDC's threshold for altitude illness. The advice that is actually sourced, and the advice that isn't.",
    lede:
      "Denver sits at 5,280 feet, and the CDC puts the threshold for altitude illness at sleeping altitudes of 8,000 feet and above, while noting some people are affected lower. So the standard warning that you will get altitude sickness in Denver is not supported by the CDC's own criterion. What is worth knowing is milder, and the real adjustment comes when visitors day-trip into the mountains, where the elevation genuinely is high.",
    updated: "2026-08-28",
    sections: [
      {
        h2: "Will I get altitude sickness in Denver?",
        answer:
          "Probably not. The CDC associates altitude illness with sleeping altitudes of 8,000 feet and above — and sometimes lower — while Denver sits at 5,280. Visitors more often notice that alcohol hits harder and the first night's sleep is poor, which is a different and much milder thing.",
        body: [
          "This is not medical advice, and people vary. If you have a heart or lung condition, or you are pregnant, your own doctor's guidance beats a travel guide's.",
        ],
      },
      {
        h2: "What does the CDC actually recommend at altitude?",
        answer:
          "Four things, none of which is the advice you usually hear: avoid alcohol for the first 48 hours, keep exercise mild for the first 48 hours, maintain your normal caffeine intake, and ascend gradually if you are heading higher.",
        list: [
          "Avoid alcohol for the first 48 hours — the CDC classes it as a respiratory depressant to avoid for sleep at altitude. This is the sourced version of 'drinks hit harder in Denver'.",
          "Mild exercise only for the first 48 hours. A hard hike on day one is the classic mistake.",
          "Do not skip your usual coffee. Caffeine withdrawal produces headaches that get misread as altitude sickness.",
          "Ascend gradually. Going from sea level to a night above 9,000 feet in one day is a genuine risk; going to Denver is not.",
        ],
      },
      {
        h2: "Does drinking extra water help with Denver's altitude?",
        answer:
          "The CDC does not publish hydration guidance for altitude acclimatisation. The advice to drink far more water than usual in Denver is repeated everywhere but is not sourced to the CDC's altitude recommendations, which cover alcohol, exertion, caffeine and rate of ascent instead.",
        body: [
          "Drinking normally in a dry climate is sensible on its own terms. It is just not the altitude intervention it is usually presented as, and it tends to crowd out the guidance that is actually documented.",
        ],
      },
      {
        h2: "What does altitude sickness feel like?",
        answer:
          "Acute mountain sickness presents like a hangover: a headache plus at least one of appetite loss, dizziness, fatigue, nausea and occasionally vomiting. Onset is typically 2 to 12 hours after arriving at altitude, which is why it often gets blamed on the first night's sleep.",
        body: [
          "Above about 9,000 feet, periodic breathing during sleep becomes close to universal, and disturbed sleep is the most common complaint travelers report at high altitude. Again — these are mountain numbers, not Denver ones.",
          "If symptoms are severe, or if someone becomes confused or unsteady on their feet at altitude, that is a reason to descend and seek medical care rather than to wait it out.",
        ],
      },
      {
        h2: "Where does altitude actually matter on a Denver trip?",
        answer:
          "In the mountains, not the city. A day trip to the high country can put you above 10,000 feet within ninety minutes of downtown, which is a different physiological situation from your hotel room in LoDo.",
        list: [
          "Red Rocks Amphitheatre sits at 6,400 feet — still below the CDC threshold, though its own FAQ calls the climb to the seats a challenging workout at that elevation. Westword puts the uphill walk from the Lower South lots at fifteen to thirty minutes, longer depending on your pace.",
          "Mount Blue Sky, Loveland Pass and the ski resorts all put you well above 8,000 feet.",
          "If you are sleeping in the mountains rather than day-tripping, that is when the CDC's gradual-ascent guidance applies to you.",
        ],
      },
    ],
    faqs: [
      {
        q: "How high is Denver?",
        a: "5,280 feet — one mile, which is where the Mile High City name comes from. That is below the 8,000-foot sleeping altitude the CDC associates with altitude illness.",
      },
      {
        q: "Does alcohol hit harder in Denver?",
        a: "The CDC advises avoiding alcohol for the first 48 hours at altitude, classing it as a respiratory depressant to avoid for sleep. That is the sourced basis for the folk wisdom.",
      },
      {
        q: "How long does it take to adjust to Denver's altitude?",
        a: "The CDC's guidance around mild exercise and avoiding alcohol covers the first 48 hours. Most visitors to Denver specifically notice little beyond a poor first night's sleep.",
      },
      {
        q: "Should I take altitude sickness medication for Denver?",
        a: "That is a decision for your doctor, and acetazolamide is generally discussed for rapid ascent to genuinely high altitude rather than for a trip to a city at 5,280 feet.",
      },
    ],
    booking: {
      pubref: "guide-altitude",
      heading: "Where to stay while you adjust",
      blurb: "Elevation is the one thing that does not vary across Denver — every neighborhood sits at the same 5,280 feet, so no hotel here is going to be gentler on you than another. What actually helps in the first day or two is not needing to drive: a walkable base, and letting the mountains wait a day.",
      areas: [
        { slug: "lodo", label: "LoDo & Union Station", note: "The most walkable base in the city, and the one where the mountains are a train rather than a drive — the Winter Park ski train and the Snowstang buses both leave from Union Station, so you can gain four thousand feet without being the one at the wheel." },
        { slug: "downtown", label: "Downtown", note: "Flat, central and car-free, with the free 16th Street FreeRide if the first afternoon leaves you flatter than you expected. Cheaper than LoDo and every bit as walkable." },
      ],
    },
  },
  "is-downtown-denver-safe": {
    slug: "is-downtown-denver-safe",
    title: "Is It Safe to Stay in Downtown Denver?",
    metaTitle: "Is Downtown Denver Safe to Stay In? A Local's Honest Answer",
    metaDescription:
      "Yes, with caveats that are about the hour rather than the block. Denver police district data, what changed at Union Station, and what the 2026 numbers actually say.",
    ogTitle: "Is Downtown Denver Safe? The Honest Version",
    ogDescription:
      "Police district data, RTD's Union Station numbers, and the time of night that actually matters — without the scaremongering or the sales pitch.",
    lede:
      "Yes — downtown Denver is a reasonable place to stay, and the thing that changes your experience most is the hour, not the address. Denver Police District 6, which covers downtown, Union Station and northern Capitol Hill, carries the largest share of the city's violent crime by volume and was the only district where violent crime rose in 2025. It is also down more than 15% year to date in 2026. Union Station's security calls fell nearly 60% between early 2022 and early 2025. The consistent theme in the city's own response is late night — after midnight, and Friday and Saturday bar closing — rather than any particular street.",
    updated: "2026-08-29",
    sections: [
      {
        h2: "What do the crime numbers actually say?",
        answer:
          "Citywide, Denver recorded 37 homicides in 2025 — the fewest since 2014 and down 48% from 2024. Downtown is the exception to that improvement: District 6 was the only Denver police district where violent crime rose in 2025, up about 5.5%. Through 2026, District 6 violent crime is down more than 15% year to date.",
        body: [
          "Those two facts sit awkwardly together and both are real, so the honest reading is a trajectory rather than a verdict: 2025 was a bad year for downtown against a good year for the city, and 2026 has been going the other way. District 6 also runs the highest raw volume of violent crime of any Denver district, which is what you would expect from the district containing the bars, the stadiums, the transit hub and the largest concentration of people in Colorado — volume follows footfall.",
          "For the longer view, District 6 violent crime fell 2% between 2021 and 2025, and property crime dropped nearly 28% between 2022 and 2025. Citywide auto theft — Denver's signature problem for years — was down 26.8% in the first half of 2026 against the same period in 2025.",
        ],
      },
      {
        h2: "Is Union Station safe?",
        answer:
          "Much safer than its reputation, and the change is documented. RTD's three-year Reclaiming Union Station program cut security-related calls for service from around 5,000 in the first quarter of 2022 to 2,127 in the first quarter of 2025 — a drop of nearly 60%.",
        body: [
          "The RTD police force grew from fewer than 20 full-time certified officers in 2022 to roughly 100, targeting 150. The bus concourse lighting was replaced with backlit panels, camera feeds now display at the main entrances, platform stairs became emergency-exit-only, and RTD police gained authority to enforce municipal violations directly on site. If you last passed through Union Station in 2022 and formed an opinion, that opinion is out of date.",
        ],
      },
      {
        h2: "What is the city actually doing about it?",
        answer:
          "In April 2025 Denver launched a Downtown Safety Action Plan: a dedicated ten-officer downtown unit working on foot, bike and motorcycle, ten extra foot patrols a day, a mounted patrol, a police kiosk at 16th and Arapahoe, five additional private security officers through the Business Improvement District, and a downtown mental health and substance use team.",
        body: [
          "The detail worth noticing is the timing. Officials and downtown business owners both describe the problem window as late night — after midnight, and the Friday and Saturday bar let-out hours — and the plan is built around covering that window. That matches what visitors report: downtown at seven in the evening and downtown at two in the morning are different places.",
          "Separately, the Downtown Development Authority has approved roughly $225 million in loans and grants out of a $570 million bond program, mostly to convert empty offices into apartments. More residents is the slow structural fix; the patrols are the fast one.",
        ],
      },
      {
        h2: "Did the 16th Street reopening change anything?",
        answer:
          "Measurably, yes. 16th Street fully reopened on October 4, 2025 after three and a half years and $175 million of reconstruction. Foot traffic was up 11% year to date as of July 2026 — about 162,000 additional visits — and average dwell time rose by 16 minutes against 2025.",
        body: [
          "Ground-floor vacancy on 16th Street had climbed to around 30% during construction, and the departures were the ones you would notice: Sephora, Starbucks, Chili's, Hard Rock Cafe, McDonald's. The corridor now counts about 200 retailers and restaurants including more than 40 sidewalk cafes, with over 1,200 residential units on the street itself and more than 1,800 hotel rooms adjacent to it.",
          "Busier streets are safer streets, and that is the mechanism doing most of the work here. Downtown-wide foot traffic reached 95% of 2019 levels in April 2026, and 16th Street itself was running 13% above the previous April.",
        ],
      },
      {
        h2: "So what should you actually do?",
        answer:
          "Behave the way you would in any large American downtown: keep to streets with people on them, take a car rather than a twenty-minute walk after midnight, and do not leave anything visible in a parked vehicle. Denver's vehicle break-in rate has been its most persistent problem, and it is also the one most within your control.",
        list: [
          "Book the busy end. The blocks around Union Station, McGregor Square and 16th Street have people on them into the evening; the further east and south you go toward the Capitol, the thinner the street gets after dark.",
          "Treat after-midnight as a car, not a walk. That is the window the city's own safety plan is built around, and it is cheap insurance.",
          "Empty the car completely. Not the trunk — empty. Denver auto theft and break-ins are improving fast but they start from a high base.",
          "Ask for a room off the street side if you are anywhere near Blake Street. This is a noise problem more than a safety one, but it is the single most useful request at check-in.",
        ],
      },
      {
        h2: "Is downtown safer than staying somewhere else in Denver?",
        answer:
          "Not necessarily safer, but more forgiving. Downtown has the most people, the most lighting, the most police presence and the most transit, and it is the only part of the city where you can reasonably not have a car. Quieter neighborhoods feel calmer at night and put you in a rideshare for everything.",
        body: [
          "If a quiet street outside the door matters more than walkability, the Golden Triangle and Cherry Creek both deliver that, and Cherry Creek in particular is silent after dinner by design. That is a lifestyle choice rather than a safety calculation — you are trading the presence of other people for the absence of them, and which of those feels safer is genuinely personal.",
        ],
      },
    ],
    faqs: [
      {
        q: "Is downtown Denver safe at night?",
        a: "Up to around midnight, on streets with people on them, it is much like any large American downtown. After midnight it thins out, and that is the window Denver's own Downtown Safety Action Plan was built to cover — the city added a ten-officer downtown unit, extra foot patrols and a police kiosk at 16th and Arapahoe specifically for late-night and bar let-out hours. Take a car rather than a long walk at that hour and the calculation changes entirely.",
      },
      {
        q: "Is 16th Street safe now that it has reopened?",
        a: "Busier, which is the thing that matters most. Since the October 2025 reopening, foot traffic is up 11% year to date and average dwell time is up 16 minutes, with downtown-wide foot traffic back to about 95% of 2019 levels by April 2026. The city also placed its new downtown police kiosk on the corridor at 16th and Arapahoe. Crowded streets are the mechanism; the numbers say the street is getting crowded again.",
      },
      {
        q: "Is Denver Union Station safe?",
        a: "Yes, and it has improved sharply. RTD's Reclaiming Union Station program cut security-related calls for service by nearly 60% between the first quarter of 2022 and the first quarter of 2025, grew the transit police force from under 20 officers to about 100, replaced the concourse lighting and made platform stairs emergency-exit-only. Its reputation is running several years behind its condition.",
      },
      {
        q: "Which part of downtown Denver should I avoid?",
        a: "Local reporting deliberately avoids naming blocks, and so will we — the honest signal in the data is the hour, not the street. What is fair to say is that the streets get emptier as you move east and south toward the Capitol and away from the ballpark district, and empty is a different thing from dangerous but still worth knowing when you choose which end of downtown to book.",
      },
      {
        q: "Is Denver safe for solo travelers?",
        a: "Broadly yes, with the usual big-city caveats and one Denver-specific one: keep nothing in your car. Overall Denver crime was roughly flat in the first half of 2026 and down about 8% against its three-year average, homicides hit their lowest per-capita rate since 1990 in 2025, and auto theft fell 26.8% year over year. Book a hotel on a busy block, use a car late at night, and downtown is straightforward.",
      },
    ],
    booking: {
      pubref: "guide-downtown-safe",
      heading: "Book the busy end",
      blurb: "The practical version of everything above: stay where there are people on the street into the evening. These are the two clusters that stay busy, and the ones the city's own foot patrols and the new 16th and Arapahoe police kiosk cover.",
      areas: [
        { slug: "lodo", label: "LoDo & Union Station", note: "The busiest blocks in the city into the evening, and the ones where RTD cut security calls by nearly 60% between 2022 and 2025." },
        { slug: "downtown", label: "Downtown & 16th Street", note: "Foot traffic up 11% year to date since the reopening, with 16 more minutes of average dwell time. Book toward the 16th Street end rather than out toward the Capitol." },
      ],
    },
  },
  "hotel-parking": {
    slug: "hotel-parking",
    title: "What Denver Hotel Parking Actually Costs",
    metaTitle: "Denver Hotel Parking Costs — Published Rates, Hotel by Hotel",
    metaDescription:
      "Downtown Denver hotel parking runs $45 to $70 a night. Published rates from the hotels themselves, plus the public garage that charges $23 for the same 24 hours.",
    ogTitle: "Denver Hotel Parking: The Real Numbers",
    ogDescription:
      "Published overnight rates from the hotels' own sites, and the cheaper option two blocks away.",
    lede:
      "Overnight parking at a downtown Denver hotel runs roughly $45 to $70 a night, and the rate is almost never shown next to the room rate when you book. A city-run public garage charges $23 for the same twelve to twenty-four hours. On a three-night stay that difference is around $100 — enough to be worth ten minutes of planning, and enough that you should price the room and the parking together rather than being surprised at checkout.",
    updated: "2026-08-29",
    sections: [
      {
        h2: "How much is parking at downtown Denver hotels?",
        answer:
          "Published rates from the hotels' own websites, as of August 2026. Self-park where offered runs $45 to $57; valet runs $60 to $70. Several downtown properties offer valet only, which removes the cheaper option entirely.",
        table: {
          head: ["Hotel", "Self-park", "Valet"],
          rows: [
            ["Sheraton Denver Downtown", "$57", "$67 ($77 oversized)"],
            ["Hilton Denver City Center", "$57", "$67"],
            ["The Curtis Denver", "$45, in-and-out", "Not offered"],
            ["The Brown Palace", "Not offered", "$66, in-and-out"],
            ["Limelight Denver", "Not listed", "$64 ($80 over 7 ft)"],
            ["The Oxford Hotel", "Not listed", "$62"],
            ["The Rally Hotel", "Not offered", "$60"],
            ["Embassy Suites Convention Center", "Not offered", "$70"],
          ],
        },
        body: [
          "Two caveats worth knowing before you budget. First, these are the published nightly rates and taxes are usually additional. Second, oversized-vehicle surcharges are real and specific: the Sheraton adds $10 and Limelight adds $16 for anything over seven feet, which catches a lot of rental SUVs with a roof box.",
          "The Rally Hotel currently publishes $60 a day on one page and refers to a $54 valet fee on its Park and Rally offer page. Both are live on its own site, so confirm at booking rather than assuming.",
        ],
      },
      {
        h2: "Is a public garage cheaper than the hotel?",
        answer:
          "Substantially. The city-operated Denver Performing Arts Complex garage charges $23 for twelve to twenty-four hours, against $45 to $70 at the hotels — a saving of roughly $25 to $50 a night. Its rate card is published, which is more than most hotel parking pages manage.",
        table: {
          head: ["Duration", "Denver Performing Arts Complex garage"],
          rows: [
            ["Under 1 hour", "$7"],
            ["1 to 2 hours", "$9"],
            ["2 to 5 hours", "$13"],
            ["5 to 8 hours", "$17"],
            ["8 to 12 hours", "$19"],
            ["12 to 24 hours", "$23"],
            ["Event rate", "$18 all day Saturday and Sunday, and two hours before large events"],
            ["Early Bird", "$11, in by 7:30am and out by 6pm"],
          ],
        },
        body: [
          "One trap in the fine print: a new parking day begins at 4:00am, and a car that exits after 4am picks up additional charges. If you are coming out at six in the morning for a flight, you are paying for two days.",
          "The trade is convenience and weather. Walking four blocks to a garage in July is nothing; doing it at eleven at night in February with luggage is a different proposition. For a stay where the car sits unused for three days, the garage is the obvious answer. For a ski trip where you are in and out daily, in-and-out privileges at the hotel — The Curtis and The Brown Palace both offer them — may be worth the premium.",
        ],
      },
      {
        h2: "Which Denver hotels have free parking?",
        answer:
          "None downtown — we checked nine on their own brand sites and every one charges. Genuinely free parking means Lakewood, Arvada, Aurora, the Tech Center or Central Park, and there are eight properties we could verify. Airport-area parking is cheap rather than free, at about $12 to $20 a night. The full verified list is in our free-parking guide.",
        table: {
          head: ["Hotel", "Self-park", "Airport shuttle"],
          rows: [
            ["avid hotel Denver Airport Area", "$12", "Complimentary, 24 hours"],
            ["Atwell Suites Denver Airport", "$15", "Free, 4:00am to 11:30pm"],
            ["Embassy Suites DEN", "$19", "$8 round trip"],
            ["Embassy Suites Denver Tech Center", "$20", "n/a"],
          ],
        },
        body: [
          "Note the Embassy Suites at the airport: the parking is cheap and the shuttle is not free. That combination is common enough out there that it is worth reading both lines before booking on the basis of one.",
          "If you are leaving a car behind while you fly, book the room you are actually sleeping in. Park-and-fly packages require a real stay, and cars left in hotel lots without one get towed.",
        ],
      },
      {
        h2: "Can you skip the car entirely?",
        answer:
          "In LoDo, Union Station, downtown and RiNo, yes — and it is usually the cheapest answer. The A Line runs from the airport to Union Station in about 37 minutes for a $10 Airport Day Pass, which covers the rest of that day's RTD travel too. Three nights of downtown parking costs more than a week of transit.",
        body: [
          "The calculation flips the moment your trip includes the mountains, Red Rocks or anything in the suburbs. Red Rocks has no scheduled transit service most of the year, and the ski areas are a car or a booked bus. If half your trip is mountain and half is city, one honest option is to stay downtown without a car and rent one for the days you need it — Denver has plenty of downtown rental counters and a daily rental plus a day's parking often beats five days of parking you did not use.",
        ],
      },
    ],
    faqs: [
      {
        q: "How much is overnight parking in downtown Denver?",
        a: "At hotels, roughly $45 to $70 a night as published on their own sites — $45 self-park at The Curtis at the low end, $70 valet at the Embassy Suites Convention Center at the high end, with $57 self-park and $67 valet typical at the big convention hotels. A city-run public garage charges $23 for the same twelve to twenty-four hours.",
      },
      {
        q: "Is hotel parking included in Denver hotel rates?",
        a: "Almost never downtown, and it is rarely displayed beside the room rate when you book. Since the FTC's fee rule took effect in May 2025 and Colorado's own pricing law on January 1, 2026, mandatory fees have to appear in the advertised total — but parking is generally treated as optional rather than mandatory, so it can still surprise you at checkout. Price it in yourself.",
      },
      {
        q: "Can I park somewhere cheaper and walk to my hotel?",
        a: "Yes. The Denver Performing Arts Complex garage publishes $23 for twelve to twenty-four hours, versus $45 to $70 at the hotels. Watch the 4:00am rollover: a new parking day starts then, so an early-morning exit costs you a second day.",
      },
      {
        q: "Do Denver airport hotels have free parking?",
        a: "We could not verify a single one that does. Published rates at airport-district properties run about $12 to $20 a night, which is a fraction of downtown but not nothing. Check the shuttle separately — some airport hotels charge for it, including one that charges $8 round trip while parking is $19.",
      },
      {
        q: "Do I need a car in Denver?",
        a: "Not if you are staying downtown, in LoDo, at Union Station or in RiNo and spending your time in the city — the A Line from the airport, the free 16th Street FreeRide and short walks cover it. You need one for the mountains, for Red Rocks, and for anything in the suburbs. Renting for the days you need it often beats paying for parking on the days you don't.",
      },
    ],
    booking: {
      pubref: "guide-hotel-parking",
      heading: "Price the room and the parking together",
      blurb: "A $45 to $70 nightly parking charge is a third night on a three-night stay, and it is almost never shown beside the room rate. Compare these with the parking number from the table above already in your head.",
      areas: [
        { slug: "downtown", label: "Downtown", note: "Where the $57 self-park and $67 valet rates cluster. Worth checking whether in-and-out privileges are included if you are driving daily." },
        { slug: "airport", label: "Near DEN", note: "Published parking runs about $12 to $20 a night out here. Check the shuttle separately — some charge for it while the parking is cheap." },
      ],
    },
  },
  "resort-fees": {
    slug: "resort-fees",
    title: "Do Denver Hotels Charge Resort Fees?",
    metaTitle: "Denver Hotel Resort & Destination Fees — What's Real in 2026",
    metaDescription:
      "Some do, most downtown flags don't. What's verified, what the FTC rule and Colorado's 2026 pricing law changed, and how to check before you book.",
    ogTitle: "Denver Resort and Destination Fees, Explained",
    ogDescription:
      "Which Denver hotels charge them, what the law now requires, and the one check that settles it before you book.",
    lede:
      "Some Denver hotels charge a daily destination or amenity fee, but it is far from universal and the sums are smaller than in Las Vegas or Miami — around $25 to $35 a night at the properties that charge one. Several major downtown hotels charge nothing beyond parking. Since May 12, 2025 the FTC's fee rule has required US lodging to show the total price including all mandatory fees up front, and Colorado's own pricing law followed on January 1, 2026 — so the fee should now appear in the price you are quoted rather than at checkout.",
    updated: "2026-08-29",
    sections: [
      {
        h2: "Which Denver hotels charge a destination fee?",
        answer:
          "Fewer than the aggregator lists suggest. Verified directly from the hotels' own websites: The Crawford charges $30 plus tax per day, and The Maven at Dairy Block and The Rally Hotel both charge $28 plus tax per room per night. All three are LoDo properties, which is the pattern worth noticing — the fee clusters in the ballpark district rather than across downtown.",
        body: [
          "Just as usefully, several major downtown hotels publish no destination fee at all on their own sites — the Hilton Denver City Center, The Curtis, The Brown Palace and the Embassy Suites Convention Center all list parking charges and nothing else. If a comparison site tells you one of those charges a resort fee, check the hotel's own page before you believe it.",
          "Third-party fee databases list around twenty-five Denver properties with fees in the $20 to $41 range, but those figures usually appear to include tax, which is why they do not match what the hotels themselves quote. Treat them as leads to check, not as prices.",
        ],
      },
      {
        h2: "What does a Denver destination fee actually cover?",
        answer:
          "Typically a bundle of things you may or may not use: wifi, a fitness center credit, a drink or coffee credit, bike rental, local calls. The fee is mandatory whether you use any of it or not, which is what separates it from a genuine add-on.",
        body: [
          "It is worth being clear-eyed about the economics. A destination fee lets a hotel advertise a lower nightly rate while collecting the same total, and historically it also kept some revenue out of the base rate for commission and comparison purposes. The FTC rule addressed the advertising half of that problem; it did not abolish the fee.",
        ],
      },
      {
        h2: "What did the FTC rule change?",
        answer:
          "The FTC's Rule on Unfair or Deceptive Fees took effect on May 12, 2025. It covers short-term lodging and live-event ticketing, and requires the total price including all mandatory fees to be disclosed clearly and up front, at every stage of the booking process. It does not ban any fee or cap any amount.",
        body: [
          "That distinction matters and gets misreported constantly. Resort and destination fees are still entirely legal. What changed is that they must be in the number you see when you are comparing, rather than appearing after you have committed. If you are seeing a rate on a booking site that jumps at the final screen, that is the thing the rule was written about.",
        ],
      },
      {
        h2: "Does Colorado have its own law?",
        answer:
          "Yes. Colorado HB25-1090, Protections Against Deceptive Pricing Practices, was signed on April 21, 2025 and took effect January 1, 2026. It requires businesses to clearly and conspicuously disclose the maximum total price when advertising, and prohibits misrepresenting pricing.",
        body: [
          "The bill carves out exemptions for food service, broadband providers, delivery companies and real estate services. Lodging is not among the exemptions, and hospitality law practices have read it as applying to hotels — though the statute does not name lodging explicitly, so we are describing the exemption list rather than making a legal claim of our own.",
          "The practical upshot for a visitor is the same either way: from 2026, the advertised Denver hotel price should be the price.",
        ],
      },
      {
        h2: "How do you check before booking?",
        answer:
          "Open the hotel's own website and look for a page called Amenities, Hotel Information or Getting Here — that is where Denver hotels put both parking and destination fees, and it is the only source that is both current and authoritative. Aggregator fee databases go stale and usually include tax.",
        list: [
          "Search the hotel's own site for \"destination fee\", \"amenity fee\" or \"resort fee\" — the exact wording varies and the fee hides under all three.",
          "Check the parking page at the same time. Parking is the larger number at almost every downtown Denver hotel, and it is usually treated as optional rather than mandatory, so it may not be in the advertised total.",
          "Compare the final booking total, not the nightly rate. Post-2025 that number should include mandatory fees, which makes it the only honest comparison across properties.",
          "If a fee appears at check-in that was not in your booking total, that is now a disclosure problem rather than a matter of hotel policy — raise it at the desk.",
        ],
      },
    ],
    faqs: [
      {
        q: "Do Denver hotels charge resort fees?",
        a: "Some do, most downtown flags do not, and the amounts are modest by US standards. Verified from the hotels' own sites: The Crawford charges $30 plus tax per day, and The Maven at Dairy Block and The Rally Hotel both charge $28 plus tax per room per night. The Hilton Denver City Center, The Curtis, The Brown Palace and the Embassy Suites Convention Center publish no destination fee at all.",
      },
      {
        q: "How much is a destination fee in Denver?",
        a: "Around $25 to $35 a night at the properties that charge one, before tax. That is well below the Las Vegas and Miami range. Parking, at $45 to $70 a night downtown, is the bigger line item at almost every Denver hotel.",
      },
      {
        q: "Are resort fees legal?",
        a: "Yes. The FTC's Rule on Unfair or Deceptive Fees, effective May 12, 2025, requires the total price including mandatory fees to be disclosed up front but explicitly does not prohibit any type or amount of fee. Colorado's HB25-1090 took the same approach when it took effect on January 1, 2026 — a transparency requirement, not a ban.",
      },
      {
        q: "Can you refuse to pay a resort fee?",
        a: "Not as a matter of right if it was disclosed in your booking total — it is part of the contracted price. If it was not disclosed, that is a different conversation and worth having at the front desk, because since 2025 the disclosure is what the law requires. In practice, choosing a hotel that does not charge one is easier than arguing about it, and in Denver you have plenty of those.",
      },
      {
        q: "Does the destination fee include parking?",
        a: "Almost never in Denver. They are separate charges and parking is the larger of the two. Assume you are paying both unless the hotel's own page says otherwise.",
      },
    ],
    booking: {
      pubref: "guide-resort-fees",
      heading: "Compare the total, not the nightly rate",
      blurb: "Since 2025 the advertised price has to include mandatory fees, which finally makes the booking total the honest comparison across properties. Run your dates and compare those, not the headline rate.",
      areas: [
        { slug: "downtown", label: "Downtown", note: "Several of the big downtown flags publish no destination fee at all — only parking. The Hilton City Center, The Curtis and The Brown Palace are all in that group." },
        { slug: "lodo", label: "LoDo", note: "Where Denver's destination fees actually cluster: The Crawford at $30 plus tax, The Maven and The Rally at $28. Still modest by US standards, but budget for it." },
      ],
    },
  },
  "ski-basecamp": {
    slug: "ski-basecamp",
    title: "Using Denver as a Ski Basecamp",
    metaTitle: "Denver as a Ski Basecamp — Drive Times, Trains & the I-70 Reality",
    metaDescription:
      "Sleep in Denver, ski Winter Park, Loveland or Copper. Verified distances, the ski train, the Snowstang bus, the traction law and when I-70 actually jams.",
    ogTitle: "Denver as a Ski Basecamp: The Honest Logistics",
    ogDescription:
      "Distances, the train, the bus, the traction law and the two hours of I-70 that decide your whole day.",
    lede:
      "Denver works as a ski basecamp, and it is cheaper than sleeping in a resort town — but the thing that decides whether it is pleasant is I-70 rather than the mileage. Westbound traffic builds from 9am on Saturdays with delays of up to 45 minutes between 10:30am and 3pm, and eastbound Sunday delays of 15 to 30 minutes run from noon to 5pm. The resorts are close: Loveland is 53 miles from Denver, Winter Park 67, Copper 75, Keystone 72 from downtown. The trick is leaving before the corridor fills, or not driving at all.",
    updated: "2026-08-29",
    sections: [
      {
        h2: "How far are the ski areas from Denver?",
        answer:
          "Eldora is nominally the closest at 49 miles, though by a different road through Boulder rather than I-70. On the I-70 corridor itself Loveland is first at 53 miles, then Winter Park at 67, Keystone at 72 from downtown, Copper at 75, Breckenridge at 104 from the airport and Vail at 119 from the airport. Vail and Breckenridge both publish about an hour and three quarters in clear conditions.",
        table: {
          head: ["Resort", "Distance", "As published by"],
          rows: [
            ["Eldora", "49 miles from Denver", "Colorado Ski Country"],
            ["Loveland Ski Area", "53 miles west of Denver", "Loveland"],
            ["Winter Park", "67 miles west of Denver", "Winter Park Resort"],
            ["Keystone", "72 miles from downtown Denver", "Keystone"],
            ["Copper Mountain", "75 miles west of Denver", "Colorado Ski Country"],
            ["Breckenridge", "104 miles from DEN, about 1h45", "Breckenridge"],
            ["Vail", "119 miles west of DEN, about 1h45", "Vail"],
          ],
        },
        body: [
          "Read the reference point rather than the number. Resorts publish distance from the airport, from downtown, or from an unspecified \"Denver\", and those differ by more than twenty miles. The table above says which each one is, because a guide that blends them is telling you Vail is nearer than it is.",
          "We have deliberately not published drive times for the resorts that do not publish their own. Only Breckenridge and Vail do, and both caveat it heavily. On a Saturday in February the honest answer to \"how long does it take\" is a range wide enough to be useless, which is the real point of this page.",
        ],
      },
      {
        h2: "When does I-70 actually jam?",
        answer:
          "CDOT's own forecast: westbound Saturday traffic builds from 9am with peak delays up to 45 minutes between 10:30am and 3pm. Eastbound Sunday runs 15 to 30 minutes of delay between noon and 5pm. CDOT's advice is to start early, or leave the mountains after 7pm.",
        body: [
          "Those are the average numbers. On a powder Saturday, or after an accident in the Eisenhower Tunnel, they are much worse and there is no alternative route worth taking. This is the single fact that decides whether basing in Denver feels clever or feels like a mistake: a 7am departure and a 7pm return is a genuinely good day, and a 10am departure is two hours of your life in the left lane.",
          "The Mountain Express Lanes are open on weekends and holidays and can be paid through ExpressToll. Rates are dynamic, so check them at the time rather than trusting any figure you read in a guide, this one included.",
        ],
      },
      {
        h2: "What is the traction law?",
        answer:
          "On I-70 between Dotsero and Morrison, from September 1 to May 31, your vehicle needs tires with at least 3/16 inch of tread that are winter, all-weather or mud-and-snow rated — or chains. It applies to all vehicles including 4WD and AWD. Non-compliance is a $50 fine plus a $17 surcharge.",
        body: [
          "The 2025 update shifted the emphasis onto tire condition and type regardless of drivetrain, and added a requirement that two-wheel-drive vehicles carry chains or an approved traction device. It catches out a lot of visitors who assume an AWD rental is automatically compliant. It may not be — rental fleets run all-season tires, and all-season is not the same as all-weather. If you are renting for a ski day, it is a fair question to ask at the counter.",
        ],
      },
      {
        h2: "Can you ski from Denver without a car?",
        spotlight: {
          slugs: [
            "the-crawford-hotel",
            "the-oxford-hotel",
            "limelight-denver",
            "the-maven-hotel-at-dairy-block",
          ],
          heading: "Stay where the ski train leaves from",
          note: "The Winter Park Express departs Union Station early. Booking within a block of it is the difference between catching it and driving I-70.",
        },
        answer:
          "Yes, three ways: the Winter Park Express train from Union Station, CDOT's Snowstang buses to Arapahoe Basin, Breckenridge, Copper and Loveland, and RTD's regular Route NB to Eldora for a $5.50 day pass. All of them beat driving on a Saturday.",
        body: [
          "The Winter Park Express runs from Union Station straight to the base area — Winter Park bills itself as the only ski resort in North America with a train that drops you at the lifts. In the 2025-26 season it ran 57 round trips, Fridays to Sundays in late December and Thursdays to Sundays from January to late March, departing Denver at 7:00am and arriving at the resort at 9:11am, returning at 4:35pm to reach Denver at 7:05pm. Fares started at $9 one way. The 2026-27 season has not been announced as of late August 2026; Amtrak announced last season in early November, so watch for it then.",
          "Snowstang, run by CDOT, served A-Basin, Breckenridge, Copper and Loveland in 2025-26 on Saturdays, Sundays and holiday Mondays, from Denver Union Station, the RTD Federal Center Station and the Wooly Mammoth Park-n-Ride at Morrison. The fare was $25 round trip, $12.50 for children. The Copper run left Union Station at 6:25am and arrived at 8:45am. The 2026-27 schedule had not been published when this was written.",
          "Eldora is the quiet outlier and the only one available on ordinary transit with no reservation: RTD Route NB runs hourly through the season from Downtown Boulder Station, first drop-off at Eldora 6:58am and last pick-up 5:13pm, on a $5.50 day pass. From Denver, take Route FF1 from Union Station to Downtown Boulder Station and transfer. Skis have to be bagged before boarding.",
        ],
      },
      {
        h2: "Is basing in Denver actually better than a resort town?",
        answer:
          "It is better for a trip that is not only skiing, and worse for a trip that is. Denver hotel rates run far below Vail or Breckenridge in season, the food is better and the flights are cheaper, but you spend two to four hours a day in the corridor and you cannot ski the first hour.",
        list: [
          "Base in Denver if you are skiing two or three days out of five, traveling with non-skiers, or want a city evening.",
          "Base in Denver if you are willing to leave at 6:30 or 7am. The whole plan rests on that.",
          "Base in the mountains if you are skiing every day, chasing powder mornings, or traveling with small children for whom a 6:30am departure is not a plan.",
          "Split the difference on a long trip: two or three nights in Denver at the start, then move up. You get the city and the first chair.",
        ],
      },
    ],
    faqs: [
      {
        q: "Can you stay in Denver and ski?",
        a: "Yes, and plenty of people do. Loveland is 53 miles from Denver, Winter Park 67 and Keystone 72 from downtown, so a day trip is straightforward if you leave early. The constraint is I-70: CDOT forecasts westbound delays of up to 45 minutes between 10:30am and 3pm on Saturdays, so a 7am departure and a post-7pm return is the difference between a good day and a bad one.",
      },
      {
        q: "What is the closest ski area to Denver?",
        a: "Eldora, at 49 miles, though it sits off the I-70 corridor on a different road through Boulder. On I-70 itself the closest is Loveland Ski Area at 53 miles, right at exit 216 just before the Eisenhower Tunnel. Eldora is also the only area reachable from Denver on ordinary RTD transit — Route NB from Downtown Boulder Station on a $5.50 day pass.",
      },
      {
        q: "Is there a ski train from Denver?",
        a: "The Winter Park Express runs from Union Station to the Winter Park base area, about two hours and eleven minutes each way. In 2025-26 it ran 57 round trips between late December and late March, departing Denver at 7:00am and returning at 7:05pm, with fares from $9 one way. Amtrak has not announced the 2026-27 season as of late August 2026 — it announced last season in early November.",
      },
      {
        q: "Do I need snow tires to drive to the Colorado ski areas?",
        a: "On I-70 between Dotsero and Morrison, from September 1 to May 31, you need at least 3/16 inch of tread on winter, all-weather or mud-and-snow rated tires, or chains — and it applies to 4WD and AWD vehicles too. Non-compliance costs $50 plus a $17 surcharge. Rental fleets typically run all-season tires, which are not the same thing as all-weather, so it is worth asking at the counter.",
      },
      {
        q: "Is there a bus from Denver to the ski resorts?",
        a: "CDOT's Snowstang served Arapahoe Basin, Breckenridge, Copper Mountain and Loveland in the 2025-26 season on Saturdays, Sundays and holiday Mondays, from Union Station, the Federal Center Station and the Wooly Mammoth Park-n-Ride, at $25 round trip. The 2026-27 schedule had not been announced when this was written, so check CDOT before planning around it.",
      },
      {
        q: "How early should you leave Denver to ski?",
        a: "Before 7am on a weekend. CDOT's own forecast has westbound I-70 building from 9am and peaking between 10:30am and 3pm, so leaving at 6:30 or 7 puts you ahead of it. Coming back, the choice is to leave the hill by about 2pm or to eat dinner in the mountains and drive after 7pm — anything in between is the Sunday eastbound backup.",
      },
    ],
    booking: {
      pubref: "guide-ski-basecamp",
      heading: "Book the basecamp",
      blurb: "The whole plan rests on leaving by about 7am, so book somewhere you can get out of quickly — and, if you are taking the ski train or the Snowstang bus, somewhere near Union Station where both of them start.",
      areas: [
        { slug: "lodo", label: "LoDo & Union Station", note: "Where the Winter Park Express and the Snowstang buses depart. If you are skiing without a car, this is the only base that makes sense." },
        { slug: "downtown", label: "Downtown", note: "Cheaper than LoDo, still a straight run onto I-25 and west onto I-70, and a better dinner when you get back down." },
      ],
    },
  },
  "den-layover": {
    slug: "den-layover",
    title: "Can You Leave Denver Airport on a Layover?",
    metaTitle: "DEN Layover: Can You Leave the Airport? The Honest Math",
    metaDescription:
      "You need about five hours to make it worth leaving DEN. The A Line is 37 minutes each way, DEN asks for two hours back — here's what that leaves you.",
    ogTitle: "Leaving Denver Airport on a Layover",
    ogDescription:
      "The A Line, the two-hour rule, and how much layover you actually need before downtown is worth it.",
    lede:
      "You can leave, and the train makes it easier than at most US airports — but the overhead is about three and a half hours before you have seen anything. The A Line takes 37 minutes each way between Denver Airport Station and Union Station, and DEN asks you to be back at least two hours before departure. With a five-hour layover you get roughly ninety minutes downtown. Under four hours, stay in the terminal.",
    updated: "2026-08-29",
    sections: [
      {
        h2: "How long a layover do you need to leave DEN?",
        answer:
          "About five hours, minimum. The arithmetic: 37 minutes in on the A Line, 37 minutes back, DEN's own advice to arrive two hours before your flight, plus the walk to the Transit Center on Level 1 and waiting for a train. That is roughly three and a half hours of overhead before you have done anything.",
        table: {
          head: ["Layover length", "Realistic verdict"],
          rows: [
            ["Under 3 hours", "Stay airside. You will spend the whole thing in motion."],
            ["3 to 4 hours", "Stay in the terminal. The public art collection is one of the largest at any airport in the world and is genuinely worth a slow walk."],
            ["5 hours", "Doable. About 90 minutes at Union Station — a meal, a walk to the Millennium Bridge, back."],
            ["6 to 8 hours", "Comfortable. Enough for Union Station, Larimer Square and a proper lunch."],
            ["Overnight", "Take the train and book downtown, unless your onward flight is before about 7am."],
          ],
        },
        body: [
          "International connections change the math in the wrong direction: add immigration on arrival and a longer check-in on departure and you want an hour more than the figures above. Domestic-to-domestic on the same ticket is the easy case.",
        ],
      },
      {
        h2: "How does the A Line work?",
        answer:
          "The University of Colorado A Line runs from the Denver Airport Station on Level 1 of the terminal to Union Station in 37 minutes, every 15 minutes through most of the day and every 30 minutes early and late. The fare is a $10 Airport Day Pass — a day pass, not a one-way, so the return is included.",
        body: [
          "On the summer 2026 timetable, trains ran from Union Station between 3:00am and 1:00am, and from Denver Airport Station between about 4:12am and 1:57am. RTD changes its schedules seasonally, so check the current timetable before you plan a tight connection around a specific departure.",
          "Two fare details almost every guide gets wrong. First, the $10 is a day pass covering unlimited RTD travel for the rest of that service day, which makes the train dramatically better value than the rideshare it is compared against. Second, riders 19 and under travel free on all RTD services, and discount fares — for seniors 65 and over, riders with disabilities, Medicare recipients and LiVE enrollees — already include airport travel, so those passengers do not pay the $10 at all.",
        ],
      },
      {
        h2: "What can you actually do with 90 minutes downtown?",
        answer:
          "The train arrives inside Union Station, which is the single best thing to do with a short window: it is a working station, a food hall and a bar all at once, and you can eat well without leaving the building. Beyond it, Larimer Square is five minutes on foot and the Millennium Bridge about ten.",
        list: [
          "Eat in the great hall. Mercantile and Ultreia are in the building and the Terminal Bar occupies the old ticket windows.",
          "Walk Larimer Square, the oldest commercial block in the city, five minutes south.",
          "Cross the Millennium Bridge into Riverfront Park for the skyline view, about ten minutes each way.",
          "Take the free 16th Street FreeRide — it runs the length of 16th Street every four to twelve minutes and costs nothing.",
          "Leave a hard buffer. Set an alarm for the train you intend to catch, not the one after it.",
        ],
      },
      {
        h2: "Is it worth staying in the terminal instead?",
        answer:
          "For anything under about four hours, yes. DEN holds one of the largest public art collections of any airport in the world, both security checkpoints now run seventeen lanes with technology that lets you leave liquids and laptops in your bag, and the dining is better than airport average.",
        body: [
          "The West checkpoint opened in February 2024 and the East in August 2025, both on Level 6 and both serving all gates, which removed the bottleneck DEN was known for. The Great Hall program continues into 2027 — airline check-in on the south end of Level 6, the meet-and-greet areas and additional circulation are still under construction, and the South Level 6 terminal bridge and its escalator are closed until mid-November — so allow for detours inside the building itself.",
          "DEN publishes real-time security wait times rather than averages, and asks you to arrive at least two hours before your flight. We are not going to publish a typical wait figure, because the airport deliberately does not.",
        ],
      },
      {
        h2: "Should you book a hotel for a long layover?",
        spotlight: {
          slugs: [
            "the-westin-denver-international-airport",
            "cambria-hotel-denver-international-airport",
          ],
          heading: "If the layover is long enough to sleep",
          note: "The Westin sits on top of the terminal — no shuttle, no leaving security landside twice. The Cambria is the cheaper version of the same idea.",
        },
        answer:
          "If it is overnight and your onward flight leaves before about 7am, book near the airport — the Westin is attached to the terminal, so you walk to your gate. If your flight is later than that, take the train and book downtown: the rooms are better, the food is better, and the A Line handles the morning.",
        body: [
          "Airport-district rooms are the cheapest in metro Denver by a wide margin, which is exactly why people over-book them. For one night before an early departure that saving is real. For anything longer it evaporates: the district has nothing within walking distance, and two rides a day into the city cancel the difference by the second morning.",
        ],
      },
    ],
    faqs: [
      {
        q: "Can you leave Denver airport during a layover?",
        a: "Yes, on a domestic connection there is nothing stopping you — you simply re-clear security on the way back. Whether it is worth it is a timing question: the A Line is 37 minutes each way and DEN asks you to return two hours before departure, so budget about three and a half hours of overhead. Five hours is the realistic minimum for a trip downtown.",
      },
      {
        q: "How far is downtown Denver from the airport?",
        a: "DEN publishes travel times rather than a distance: 25 to 35 minutes by taxi or rideshare, 37 minutes on the A Line train, and 45 to 60 minutes by shared van. The train leaves from the Transit Center on Level 1 and arrives inside Union Station.",
      },
      {
        q: "How much is the train from Denver airport?",
        a: "$10 for an Airport Day Pass — and it is a day pass, not a one-way ticket, so it covers your return and any other RTD travel that day. Riders 19 and under travel free, and discount fares for seniors, riders with disabilities, Medicare recipients and LiVE enrollees already include airport travel.",
      },
      {
        q: "What time does the last train leave Denver airport?",
        a: "On the summer 2026 timetable, the last A Line departure from Denver Airport Station was about 1:57am and the last from Union Station was 1:00am, with first trains around 4:12am and 3:00am respectively. RTD changes schedules seasonally, so confirm the current timetable before planning a late arrival around it.",
      },
      {
        q: "Is there anything to do at Denver airport?",
        a: "More than most. DEN's public art collection is among the largest at any airport in the world, with Colorado-specific exhibitions alongside it, and both security checkpoints now run seventeen lanes with technology that lets you keep liquids and laptops in your bag. For a layover under four hours that is a better use of the time than a round trip on the train.",
      },
    ],
    booking: {
      pubref: "guide-den-layover",
      heading: "Long layover, or an overnight?",
      blurb: "The cut-off is roughly a 7am onward flight. Earlier than that, book at the airport and walk to your gate. Later, take the train and sleep somewhere with a decent dinner attached.",
      areas: [
        { slug: "airport", label: "Near DEN", note: "The Westin is attached to the terminal, so you walk to security. Everything else out here runs a shuttle whose frequency varies a lot — confirm the first departure of the morning." },
        { slug: "lodo", label: "LoDo & Union Station", note: "The A Line drops you inside Union Station, so an overnight downtown costs you 37 minutes each way and buys a much better evening." },
      ],
    },
  },
  "red-rocks-what-to-know": {
    slug: "red-rocks-what-to-know",
    title: "Red Rocks: The Rules Nobody Tells You Until You're There",
    metaTitle: "Red Rocks Rules: Bags, Re-Entry, Parking & the 193 Steps",
    metaDescription:
      "The bag size that actually gets in, why you can't leave and come back, what the 193 steps really feel like at 6,450 feet, and where the overflow lot is.",
    ogTitle: "Red Rocks: What to Know Before Your First Show",
    ogDescription:
      "Bag policy, re-entry, the overnight rule, the steps, and the parking situation — the official versions, not the ones circulating online.",
    lede:
      "Four things catch first-timers at Red Rocks. Bags must be single-pocket or clear and no bigger than 13 by 15 by 8 inches — multi-pocket bags are refused at the gate whatever their size. Once your ticket is scanned you cannot leave and come back; re-entry is allowed only for weather or medical emergencies. Tickets are digital-only through AXS, and rows 1 to 4 are non-transferable. And the venue sits at 6,450 feet with 193 steps from the stage to the top plaza, a hundred feet of climb, which is more than the photographs suggest.",
    updated: "2026-08-29",
    sections: [
      {
        h2: "What bags are allowed at Red Rocks?",
        answer:
          "Single-pocket bags and clear bags no larger than 13 by 15 by 8 inches. Small purses and fanny packs of 6 by 9 inches or smaller are fine. Hydration packs are allowed up to 2 liters. Bags with multiple pockets are prohibited regardless of size, and everything must fit under your seat space of 18 by 12 inches.",
        body: [
          "The multi-pocket rule is the one that catches people, because it is about construction rather than volume — a small backpack with a front pocket is out, and a larger single-compartment tote is in. Bags are opened for inspection at the gate.",
          "One widely circulated figure is wrong: some syndicated coverage lists the maximum as 13 by 15 by 18 inches. The venue's own policy page says 8 inches for the third dimension. Use the official number.",
          "You may bring an empty reusable water bottle — Nalgene, aluminum or stainless, 32 ounces or less. Glass and aluminum cans are prohibited, as are umbrellas, weapons of any kind, laptops and tablets, and cameras with removable lenses, GoPros and 360-degree cameras.",
        ],
      },
      {
        h2: "Can you leave Red Rocks and come back in?",
        answer:
          "No. In the venue's own words: once you enter and your ticket has been scanned, you cannot leave the show and re-enter. Re-entry is permitted only in weather-related or medical emergencies. Whatever you left in the car stays in the car.",
        body: [
          "This is the single most common Red Rocks mistake, and it interacts badly with the walk from the overflow lot. Take the jacket in with you. The venue is at 6,450 feet and the temperature can fall sharply once the sun goes behind Ship Rock, including in July.",
        ],
      },
      {
        h2: "Can you sleep in your car at Red Rocks?",
        answer:
          "No. Overnight camping is prohibited in all parking lots, roadways and natural areas at Red Rocks Park. You may, however, leave a vehicle unoccupied until 10am the following day — so the car can stay, you cannot.",
        body: [
          "That distinction is the practical one for anyone planning to drink at a show: leaving the car overnight and collecting it in the morning is explicitly allowed, sleeping in it is not.",
        ],
      },
      {
        h2: "How does parking work?",
        answer:
          "Parking and admission to the park are free. Lots open two hours before doors. The lots are Top Circle, Upper North, Upper South, Lower South 2, the Trading Post lot and the Jurassic Lot — and when the closer ones fill, arrivals are directed to the Jurassic Lot, a mile from the South Gate.",
        body: [
          "The venue does not publish a time by which the lots fill, so treat the Jurassic Lot as the realistic outcome of a late arrival rather than a rare one. The routes from the lots to the gates may be partly dirt or uphill, which is a reason to think about footwear before you leave the hotel.",
          "Complimentary shuttles run around the park during arrival, helping people in from the further lots, with limited service after the show from the Top Circle and Trading Post lots back to the Jurassic Lot. Rideshare, taxi and private pick-up all happen at the Jurassic Lot.",
          "Groups in a vehicle carrying at least 24 passengers and at least 85% full can reserve the Upper North Lot through an online form 48 hours ahead, first come first served. There is no general reservation system for ordinary cars.",
        ],
      },
      {
        h2: "How hard is the climb?",
        answer:
          "There are 193 steps from the stage to the top plaza and a hundred feet of elevation change from stage to the top row, all at 6,450 feet. The venue's own advice is to drink plenty of water and take your time on the stairs, which is more useful than it sounds if you flew in that morning.",
        body: [
          "The amphitheater is cut into a 738-acre park between two formations — Creation Rock to the north stands 300 feet and Ship Rock to the south 200 — and the seating bowl itself runs 320 feet wide by 480 feet long. None of that is flat.",
          "Accessible parking is designated in the Top Circle Lot, about 500 feet from Row 70, and in the Upper South Lot, which is served by an accessible shuttle running to a point roughly 275 feet from Row 1. Rows 1 and 70 are both step-free; rows 2 and 3 have limited-mobility and sensory accessible seating. A placard or plate is required and spaces are first come, first served.",
        ],
      },
      {
        h2: "How do the tickets work?",
        answer:
          "Red Rocks ticketing runs through AXS, and AXS mobile delivery is the only admission method — there are no paper tickets. Rows 1 to 4 are non-transferable: the original purchaser must arrive with the whole party and present the app or a registered ID, and photo ID may be checked at the gate.",
        body: [
          "That front-rows rule exists to break up resale on the most speculated-on seats, and it is enforced. If you are buying rows 1 to 4 second-hand from anyone other than an official transfer, you are buying a problem.",
        ],
      },
      {
        h2: "What else happens at Red Rocks besides concerts?",
        answer:
          "Two long-running series, both official. Film on the Rocks screens films on Monday evenings across the summer — the 2026 run was its 27th season, five dates between June and August, doors at 6:30pm and the film at 8:30pm, tickets $25 to $50. Yoga on the Rocks runs Saturday mornings from late May to late August, doors at 6am and yoga at 7am, $23 a session.",
        body: [
          "The park itself is free to visit outside event hours — the amphitheater, the visitor center and the Trading Post all cost nothing, and on a weekday morning with nobody there it is one of the better free things to do near Denver. In 2025 the venue hosted 236 events with 1.75 million paid attendance, plus another 1.1 million people who simply came to look.",
        ],
      },
    ],
    faqs: [
      {
        q: "What size bag can you take into Red Rocks?",
        a: "Single-pocket or clear bags no larger than 13 by 15 by 8 inches, plus small purses and fanny packs of 6 by 9 inches or less. Bags with multiple pockets are prohibited whatever their size, which is what catches most people. Hydration packs up to 2 liters are allowed, and everything has to fit in your 18-by-12-inch seat space.",
      },
      {
        q: "Can you re-enter Red Rocks after leaving?",
        a: "No. Once your ticket is scanned you cannot leave and come back, except for a weather or medical emergency. Bring your jacket in with you — the venue is at 6,450 feet and it gets cold after dark even in midsummer.",
      },
      {
        q: "Is parking free at Red Rocks?",
        a: "Yes — parking and park admission are both free. Lots open two hours before doors, and once the closer lots fill, arrivals are directed to the Jurassic Lot about a mile from the South Gate. The venue does not publish a fill time, so arriving early is the only reliable way to park close.",
      },
      {
        q: "How many steps are there at Red Rocks?",
        a: "193, from the stage to the top plaza, with about a hundred feet of elevation change from the stage to the top row — all at 6,450 feet. Accessible parking and a shuttle exist for rows 1 to 3 and row 70; a placard or plate is required and spaces are first come, first served.",
      },
      {
        q: "Can you sleep in your car at Red Rocks after a show?",
        a: "You can leave the car and collect it later — vehicles may stay unoccupied until 10am the next day — but overnight camping is prohibited in every lot, roadway and natural area in the park. Leave the car, take a ride home.",
      },
      {
        q: "How far is Red Rocks from Denver?",
        a: "The amphitheater is at 18300 W Alameda Pkwy in Morrison — officially about seven miles from Golden and less than two miles from the town of Morrison. Red Rocks does not publish a distance from downtown Denver, and there is no scheduled RTD or Bustang service to the venue, so the realistic options are driving, a rideshare, or one of the show-night shuttles that run from downtown.",
      },
    ],
    booking: {
      pubref: "guide-red-rocks-rules",
      heading: "Most people base in Denver and ride out",
      blurb: "There is no scheduled transit to Red Rocks and nothing to do in Morrison after a show, so the usual answer is a downtown hotel and a show-night shuttle. Book the room, then book the shuttle.",
      areas: [
        { slug: "lodo", label: "LoDo & Union Station", note: "Where most of the show-night shuttles pick up, which removes the parking lot, the Jurassic overflow walk and the drive home in one decision." },
        { slug: "downtown", label: "Downtown", note: "Same shuttle access a few blocks further in, usually for less money, with more to do before doors." },
      ],
    },
  },
  "hotel-free-parking": {
    slug: "hotel-free-parking",
    title: "Which Denver Hotels Actually Have Free Parking",
    metaTitle: "Denver Hotels With Free Parking — Verified, Not Guessed",
    metaDescription:
      "No downtown Denver hotel has free parking. The airport strip everyone assumes is free charges $12–17. Here's where it's genuinely free, checked on the hotels' own sites.",
    ogTitle: "Denver Hotels With Free Parking: the Verified List",
    ogDescription:
      "Nine downtown hotels checked, zero free. Five airport hotels checked, all paid. Here's where it's actually free — and the conditions nobody mentions.",
    lede:
      "Not one downtown Denver hotel offers free parking. We checked nine on their own brand sites and the cheapest was $42 a night. The bigger surprise is the airport strip, where everyone assumes parking is thrown in: every Tower Road and Gateway Park property we checked charges $12 to $17 a day. That gap between assumption and reality is exactly why booking sites flag airport hotels as having free parking — they are misreading park-and-fly packages. Genuinely free parking in Denver means going out to Lakewood, Arvada, Aurora, the Tech Center or Central Park.",
    updated: "2026-08-30",
    sections: [
      {
        h2: "Does any downtown Denver hotel have free parking?",
        answer:
          "No. We checked nine downtown and near-downtown properties on their own brand sites and every one charges. The range runs $42 to $70 a night, and two of them will not let you self-park at any price — it is valet or nothing.",
        table: {
          head: ["Hotel", "What it charges", "Notes"],
          rows: [
            ["Embassy Suites Convention Center", "$70 valet", "No self-parking at all. Add $10 for an oversize vehicle"],
            ["Sheraton Denver Downtown", "$57 self / $67 valet", "Oversize valet is $77"],
            ["Homewood Suites Convention Center", "$60 valet", "No self-parking. Covered and secured"],
            ["Home2 Suites Convention Center", "$55 self", "No valet offered"],
            ["The Curtis Denver", "$45 self", "Covered, with in-and-out privileges"],
            ["Element Denver Downtown East", "$45 self", "$250 a week. Gated, EV charging on site"],
            ["Residence Inn Denver City Center", "$42 self", "Register at the desk before you park"],
            ["Kasa Union Station", "$25 a day", "Collected through your booking confirmation"],
            ["The Source Hotel, RiNo", "$24 daily maximum", "First hour free. See the three-night catch below"],
          ],
        },
        body: [
          "The two valet-only properties are worth pausing on. At the Embassy Suites and the Homewood Suites on the Convention Center block, there is no cheaper option to find — you cannot decide to park yourself. Budget the full valet rate or plan to use a public garage.",
          "For context, the city-run Denver Performing Arts Complex garage charges $23 for twelve to twenty-four hours. Against $70 valet, that is a $47 difference a night, and it is a four-block walk.",
        ],
      },
      {
        h2: "Why do booking sites say airport hotels have free parking?",
        answer:
          "Because those hotels sell park-and-fly packages, and the flag gets misread. Every airport-corridor property we checked charges for parking on its own site: $12 at the Home2 Suites, $15 at the Homewood Suites, $15.99 at the Staybridge, $16 at the Hampton Gateway Park, $17 at the Residence Inn Gateway Park.",
        body: [
          "This is the single most common piece of wrong information about Denver hotels, and it is wrong in the direction that costs you money — you book expecting free and pay $17 a night. Park-and-fly is a paid package that includes leaving your car while you travel. It is not the same as free overnight parking, and it usually requires an actual stay.",
          "Airport parking is still cheap in absolute terms, which is the honest framing: $12 to $17 a night against $42 to $70 downtown. Just do not book it believing it is nothing.",
        ],
      },
      {
        h2: "So where is parking actually free?",
        answer:
          "Eight properties we could verify from the hotel's own site, all of them outside the central neighborhoods. Lakewood and the West Colfax corridor is the strongest cluster, and Drury Plaza at Central Park is the pick if you want free parking without going far out.",
        table: {
          head: ["Hotel", "Area", "What the hotel's own site says"],
          rows: [
            ["Drury Plaza Denver Central Park", "Central Park", "Free during stay, self-park, on site"],
            ["Drury Inn & Suites Denver Tech Center", "Centennial", "Free during stay"],
            ["Hampton Inn Denver West Federal Center", "Lakewood", "Complimentary self-parking, on-site lot"],
            ["Home2 Suites Denver West Federal Center", "Lakewood", "Self-parking on site, complimentary"],
            ["Hampton Inn & Suites Wheat Ridge", "Wheat Ridge", "Complimentary self-parking, plus EV charging"],
            ["Hampton Inn & Suites Aurora South", "Aurora", "Self-parking on site, complimentary"],
            ["Home2 Suites Aurora Medical Center", "Aurora", "Self-parking on site, complimentary"],
            ["Hilton Garden Inn Arvada Denver", "Arvada", "Self-parking on site, complimentary"],
          ],
        },
        body: [
          "Drury Plaza at Central Park is the one worth knowing about even if free parking is not your priority. It is the only hotel we found that publishes both free parking and real room capacity — a maximum of five in a standard room, or six in a suite with a king bedroom and a queen sofa sleeper in a separate living area. For a family driving in, that combination is rare in this city.",
        ],
      },
      {
        h2: "The conditions nobody mentions",
        answer:
          "Four of the eight free-parking hotels do not offer in-and-out privileges, which matters a great deal if you are using the hotel as a base for day trips. And two Denver properties advertise free parking with strings attached that are easy to miss.",
        list: [
          "No in-and-out at the Hampton West Federal Center, Home2 West Federal Center, Hampton Wheat Ridge or Hilton Garden Inn Arvada. Free to park, but leaving and returning may not be allowed on the same stay. Confirm before you plan a day in the mountains.",
          "The Source Hotel's \"Cars Stay Free\" package requires a stay of three nights or more. On a two-night weekend you pay the $24 daily maximum like everyone else.",
          "Kasa RiNo's own site contradicts itself: one line offers a space for one vehicle per reservation on select room categories, another states parking is $25 a day. Two conditions stacked on top of each other. Confirm against your specific unit type before booking on the strength of it.",
          "Oversize vehicles are unaccounted for. None of the eight free properties publishes a policy either way, so if you are in an RV, a lifted van or towing anything, none of them can be treated as confirmed.",
        ],
      },
      {
        h2: "Is it worth staying out of town to park free?",
        answer:
          "Rarely, if you came to see Denver. Free parking saves you $42 to $70 a night, but a Lakewood or Arvada base adds a twenty to thirty minute drive each way plus downtown parking when you get there — which puts you back where you started, with the driving added.",
        body: [
          "The arithmetic works in two cases. If you are driving to Denver and using it as a launch point for the mountains rather than the city, a west-side base on the I-70 corridor genuinely saves both money and driving. And if you are here for something specific in Aurora, Centennial or the Tech Center, the free-parking cluster is right there.",
          "For a normal city trip, the cheaper move is to stay downtown and put the car in a public garage. Three nights downtown with garage parking still beats three nights in Lakewood once you count the trips in.",
        ],
      },
    ],
    faqs: [
      {
        q: "Do any downtown Denver hotels have free parking?",
        a: "No. We checked nine downtown and near-downtown properties on their own brand sites and every one charges, from $42 a night at the Residence Inn City Center to $70 valet at the Embassy Suites Convention Center. The Embassy Suites and the Homewood Suites do not offer self-parking at any price.",
      },
      {
        q: "Which Denver hotels have free parking?",
        a: "Verified from the hotels' own sites: Drury Plaza Denver Central Park, Drury Inn & Suites Denver Tech Center, Hampton Inn Denver West Federal Center and Home2 Suites Denver West Federal Center in Lakewood, Hampton Inn & Suites Wheat Ridge, Hampton Inn & Suites Aurora South, Home2 Suites Aurora Medical Center, and the Hilton Garden Inn Arvada. All are outside the central neighborhoods.",
      },
      {
        q: "Is parking free at Denver airport hotels?",
        a: "No, and this is the most common piece of wrong information about Denver hotels. Every airport-corridor property we checked charges: $12 at the Home2 Suites, $15 at the Homewood Suites, $15.99 at the Staybridge, $16 at the Hampton Gateway Park, $17 at the Residence Inn Gateway Park. Booking sites flag these as free because they misread park-and-fly packages, which are a paid product.",
      },
      {
        q: "Why do booking sites show free parking when the hotel charges?",
        a: "Two reasons. Airport hotels sell park-and-fly packages that get miscategorized as free parking, and OTA amenity flags for Denver are frequently stale in general — properties listed as free self-park turn out to be valet-only, or the free lot is offsite. The hotel's own site is the only source worth trusting, and it is usually on a page called Hotel Information or Getting Here.",
      },
      {
        q: "What is the cheapest way to park in downtown Denver overnight?",
        a: "A public garage rather than your hotel. The city-run Denver Performing Arts Complex garage charges $23 for twelve to twenty-four hours against $42 to $70 at hotels. Watch the 4am rollover, though — a new parking day starts then, so an early-morning airport run costs you a second day.",
      },
    ],
    booking: {
      pubref: "guide-free-parking",
      heading: "If you're paying for parking anyway",
      blurb: "Free parking means staying well out of the city, and for most trips the arithmetic doesn't favor it. If you'd rather be central and put the car in a garage, these are the two clusters worth comparing.",
      areas: [
        { slug: "downtown", label: "Downtown", note: "Where the $42 to $70 parking rates live — but also where you can leave the car alone for three days and walk everywhere instead." },
        { slug: "airport", label: "Near DEN", note: "Parking runs $12 to $17 a night out here, not free, but a fraction of downtown. Worth it the night before an early flight and hard to justify for longer." },
      ],
    },
  },
  "bachelorette-party-hotels": {
    slug: "bachelorette-party-hotels",
    title: "Where to Stay for a Denver Bachelorette (or Any Group Weekend)",
    metaTitle: "Denver Bachelorette Hotels: Where a Group Actually Fits",
    metaDescription:
      "Most Denver hotel rooms cap at four adults, whatever the sofa bed suggests. What genuinely sleeps six or eight, which hotels connect rooms, and the fees that wreck a split bill.",
    ogTitle: "Denver Bachelorette Weekends: the Lodging Answer",
    ogDescription:
      "The pages ranking for this sell party supplies. This one answers the question you actually have: where does a group of eight sleep, and what does it really cost each.",
    lede:
      "Book RiNo if the weekend is about the bars and the food, and LoDo if it is about walking home from everything at one in the morning. But the decision that actually bites is capacity: Denver hotel rooms hold fewer people than a group assumes, the Embassy Suites two-room suite everyone reaches for caps at four adults, and the single best answer in the city — a four-bedroom house inside a RiNo hotel that sleeps eight — does not appear in any of the guides currently ranking for this.",
    updated: "2026-08-30",
    sections: [
      {
        h2: "How many people actually fit in one room?",
        answer:
          "Fewer than you think, and the hotels make it hard to find out. Hilton, Marriott and Hyatt all hide maximum occupancy behind the dated booking flow — none of them publishes it on the public page. Of the eighteen Denver properties we checked, only two publish a full occupancy table, and neither has a single room that sleeps five.",
        body: [
          "The one number that is published is the one that surprises people. The Embassy Suites Denver Downtown Convention Center — the two-room suite with the pull-out sofa that every group reaches for first — states a maximum of four adults per room, and offers no rollaway. The sofa bed is real. The headroom is not.",
          "The Hyatt House downtown has a different problem: every unit in the building is a single king. There is no two-queen room and no two-bedroom unit anywhere in the property. A king plus a sofa bed is the ceiling, which works for a couple with a friend and not for four adults who would rather not share.",
          "The most promising candidate we could not confirm is the Staybridge Suites downtown, whose Double Queen Studio Suites pair two queens with a pull-out. Two queens plus a sofa is a genuine five or six — but IHG publishes no number, so treat it as a phone call rather than a fact.",
        ],
      },
      {
        h2: "The one place in Denver that sleeps eight",
        spotlight: {
          slugs: ["catbird-hotel"],
          heading: "The Klee House is here",
          note: "Four bedrooms, a full kitchen, and a stated capacity of eight, inside a RiNo hotel. It is one unit, so it goes early.",
        },
        answer:
          "The Klee House at the Catbird Hotel in RiNo: four bedrooms, two and a half bathrooms, 2,500 square feet, a full kitchen, and a stated capacity of eight guests. It is a house inside a hotel, in the neighborhood you were going out in anyway.",
        body: [
          "For a group of eight this changes the arithmetic completely. Four hotel rooms at Denver weekend rates against one house — with a kitchen for the morning after, a living room to get ready in, and no corridor between you — usually lands cheaper per person and always lands better. It is also walkable to the RiNo bars and breweries, which removes the ride home.",
          "It is one unit, so it goes early. If your dates are fixed and the group is six or more, price this before anything else on the list, because everything else is a compromise around it.",
        ],
      },
      {
        h2: "If you need connecting rooms",
        spotlight: {
          slugs: [
            "grand-hyatt-denver",
            "hyatt-regency-denver-at-colorado-convention-center",
            "embassy-suites-by-hilton-denver-downtown-convention-center",
          ],
          heading: "The three worth calling",
          note: "Deepest connecting-room inventory downtown. None of them publishes a request procedure, so call the property rather than trusting a booking-site filter.",
        },
        answer:
          "Ask the hotel directly, and ask before you book — no Denver property publishes a request procedure, and the booking-site \"connecting rooms\" filter is unreliable. The Grand Hyatt has the deepest connecting inventory in the city, and the Homewood Suites on the Convention Center block is the one that says outright it has none.",
        body: [
          "The Grand Hyatt's Hospitality Parlor connects to a king or a two-queen room, and multiple rooms can be joined into a three-bedroom configuration. Its Executive Suite pairs a king bedroom with a sleeper sofa and a dining table and has a connecting option, and the VIP Suite comes with an adjoining king bedroom. For a group that wants to be together without being in one room, that is the strongest set of options downtown.",
          "The Hyatt Regency at the Convention Center is the other one worth calling. Its Blue Spruce and Monarch suites both connect to one or two additional bedrooms, and the Monarch seats twelve at a dining table — useful if the plan involves a night in rather than a night out.",
          "Both Embassy Suites properties confirm connecting rooms are available. The Homewood Suites on the Convention Center block confirms they are not, which is the sort of thing worth knowing before you split a group across it.",
        ],
      },
      {
        h2: "RiNo or LoDo?",
        answer:
          "RiNo if the weekend is built around eating and drinking well; LoDo if it is built around walking. RiNo has the best restaurant and brewery density in Denver and the rooms cost less, but it is long and thin, so where you book inside it matters more than the neighborhood name. LoDo is the compact one — bar close is 2am and everything is inside a few blocks.",
        list: [
          "Book the RiNo spine between roughly 25th and 30th and you are inside the food and far enough from the venues to sleep. Be honest about the walk, though: 25th and Larimer is 19 minutes on foot from Larimer Square, and 30th is 35. RiNo is a long thin neighborhood and the north end is a ride, not a stroll.",
          "Book LoDo and accept the noise. The blocks around Blake Street are loud on weekend nights, which is either the point or the problem. Ask for a room off the street side either way.",
          "RiNo rates do not follow the Rockies schedule and LoDo's do. On a home-game weekend the same money buys a better room in RiNo — the single most useful piece of Denver rate arbitrage there is.",
          "Neither needs a car. That is worth protecting: downtown hotel parking runs $42 to $70 a night, which is a real line on a split bill for a car nobody will move.",
        ],
      },
      {
        h2: "The fees that wreck a split bill",
        answer:
          "Two line items catch groups: a destination fee of $28 to $30 a night at several LoDo hotels, and parking at $42 to $70. On a two-night stay across three rooms, that is a couple of hundred dollars that never appeared in anyone's mental math when the group agreed a budget.",
        table: {
          head: ["Hotel", "Destination fee", "Parking"],
          rows: [
            ["The Crawford", "$30 + tax per night", "Valet $68"],
            ["The Maven at Dairy Block", "$28 + tax per night", "See hotel"],
            ["The Rally Hotel", "$28 + tax per night", "Valet $60"],
            ["The Curtis Denver", "None published", "$45 self-park"],
            ["Hilton Denver City Center", "None published", "$57 self / $67 valet"],
            ["The Brown Palace", "None published", "$66 valet"],
            ["Embassy Suites Convention Center", "None published", "$70 valet, no self-park"],
          ],
        },
        body: [
          "Since 2025 the advertised price has to include mandatory fees, so the booking total is now the honest number to compare across properties — not the nightly rate. Compare totals, divide by heads, then decide.",
          "One more: the city-run Performing Arts Complex garage charges $23 for twelve to twenty-four hours against $42 to $70 at the hotels. If somebody is driving in and the car will sit all weekend, that is the move.",
        ],
      },
      {
        h2: "When to book",
        answer:
          "Earlier than feels necessary, and check what else is happening. Denver lodging demand is event-locked: the Stock Show takes sixteen days of January, GABF takes a weekend in October, the Colfax Marathon closes roads across the city in May, and eighty-one Rockies home games move LoDo rates all summer.",
        body: [
          "The practical version: pick your weekend, then check it against the events calendar before anyone puts money down. A bachelorette weekend that lands on a citywide convention or a home stand can cost a third more for the same rooms, and the group-sized options — the suites, the connecting sets, the Klee House — are the first things gone.",
        ],
      },
    ],
    faqs: [
      {
        q: "Where should a bachelorette party stay in Denver?",
        a: "RiNo if the weekend is about food and breweries, LoDo if it is about walking home from the bars. RiNo has the better restaurant density and cheaper rooms and does not spike for Rockies weekends; LoDo is more compact and louder. For a group of six or more, look first at the Klee House at the Catbird in RiNo — four bedrooms, a full kitchen, sleeps eight.",
      },
      {
        q: "What Denver hotel rooms sleep 6 or 8 people?",
        a: "Very few, and most brands hide occupancy behind the booking flow. The clearest published answer is the Catbird's Klee House at eight guests across four bedrooms. The Staybridge Suites downtown pairs two queens with a pull-out, which should be five or six, but IHG publishes no number. Note that the Embassy Suites downtown, which groups often assume is the answer, caps at four adults per room.",
      },
      {
        q: "Do Denver hotels have connecting rooms?",
        a: "Some, but no Denver property publishes how to request them, and the booking-site filter for connecting rooms is unreliable. The Grand Hyatt has the deepest inventory — its Hospitality Parlor connects to a king or two-queen room and multiple rooms can form a three-bedroom set. The Hyatt Regency's Blue Spruce and Monarch suites connect to one or two additional bedrooms. The Homewood Suites Convention Center states it has none. Call before booking.",
      },
      {
        q: "How much does a Denver bachelorette weekend cost per person?",
        a: "Budget beyond the nightly rate. Several LoDo hotels add a destination fee of $28 to $30 a night, and downtown parking runs $42 to $70. Across three rooms and two nights those two lines alone can add a couple of hundred dollars. Since 2025 mandatory fees have to appear in the advertised total, so compare booking totals rather than nightly rates, then divide.",
      },
      {
        q: "Is RiNo or LoDo better for a group weekend?",
        a: "RiNo for eating and drinking, LoDo for walking. RiNo is long and thin so where you book inside it matters — the stretch between about 25th and 30th puts you in the food and still within fifteen minutes of LoDo on foot. LoDo is compact and loud, with bar close at 2am. Neither needs a car, which matters when parking is $42 to $70 a night.",
      },
    ],
    booking: {
      pubref: "guide-bachelorette",
      heading: "Book the group in",
      blurb: "Group-sized rooms are the first thing to go on a Denver weekend, and the difference between RiNo and LoDo rates is real. Put the dates in and compare both sides before the group commits.",
      areas: [
        { slug: "rino", label: "RiNo", note: "Best food and brewery density in the city, cheaper than LoDo, and it doesn't follow the Rockies schedule. The Catbird's four-bedroom Klee House is here." },
        { slug: "lodo", label: "LoDo & Union Station", note: "The compact one — everything inside a few blocks and nobody needs a car or a ride home. Loudest around Blake Street, and it's where the destination fees cluster." },
      ],
    },
  },
  "mountain-view-hotels": {
    slug: "mountain-view-hotels",
    title: "Denver Hotels With Mountain Views: Which Ones Are Actually Real",
    metaTitle: "Denver Hotels With Mountain Views: Which Ones Are Real",
    metaDescription:
      "Only four Denver hotels sell a room named for the mountain view. We checked every published room list and mined our own guest-review data. Here's what you get, and where the upgrade is a waste.",
    ogTitle: "Denver Mountain-View Hotels: Four Real Ones, and the Traps",
    ogDescription:
      "Most Denver hotels don't advertise a mountain view at all — some advertise the opposite. Here's which rooms genuinely face the Front Range, from published inventory and guest reports.",
    lede:
      "Four hotels in Denver sell a guest room with \"mountain view\" in its name: the Four Seasons, the Hyatt Regency at the Convention Center, Hotel Clio in Cherry Creek, and Populus. That is the whole list, and it surprised us — the assumption going in was that every hotel in a city with a mountain range on the horizon would be selling the window. Most do not. The Oxford advertises views of the Lower Downtown neighborhood. The Maven sells Sky Yard, city, alley and Coors Field views and no mountain view at all. Denver's highest open-air rooftop bar makes no mountain claim in its own marketing. When a view is that easy to sell and a hotel doesn't sell it, that tells you something.",
    updated: "2026-08-30",
    sections: [
      {
        h2: "Which Denver hotels sell a room with a mountain view?",
        spotlight: {
          slugs: [
            "hyatt-regency-denver-at-colorado-convention-center",
            "four-seasons-hotel-denver",
            "hotel-clio-a-luxury-collection-hotel-denver-cherry-creek",
            "populus-denver",
          ],
          heading: "The four you can actually book",
          note: "Every other mountain view in Denver is a room assignment you have to ask for. These four sell it as a category.",
        },
        answer:
          "Four. We went through the published room lists on the brands' own sites and only these four name a bookable guest room for the view. The Hyatt Regency has the deepest inventory of the group — it is the only Denver hotel selling mountain-view rooms in both bed configurations.",
        table: {
          head: ["Hotel", "What it's called", "What you're buying"],
          rows: [
            ["Hyatt Regency Denver at the Convention Center", "1 King Bed Mountain View / 2 Queen Beds Mountain View", "The deepest mountain-view inventory in the city, and the only one offering it as a two-queen. Peaks Lounge on the 27th floor is the same view without the room rate"],
            ["Four Seasons Hotel Denver", "Deluxe Mountain-View Room", "Also sold as an accessible room. The tallest hotel tower downtown, so the sightline clears more than the others"],
            ["Hotel Clio, Cherry Creek", "King Guest Room — Mountain View / Queen/Queen Guest Room — Mountain View", "The only real option outside downtown. Clio splits inventory by aspect: the Deluxe rooms face Cherry Creek instead"],
            ["Populus", "Mountain Studio Suite with Rocky Mountain Views / Summit Junior Suite", "Thirteen floors, so this is a foreground view rather than a horizon one. The Summit is a top-floor category"],
          ],
        },
        body: [
          "Clio is the one to be careful with. Marriott gates the bookable category list behind a dated availability search, so the mountain-view names appear in the room photography and the marketing copy — \"unobstructed views of the Rocky Mountains in select guest rooms\" — rather than in a list you can browse. Put your dates in before you assume it's available on the night you want.",
          "Two properties that used to belong on this list no longer do. The Source Hotel in RiNo sold a Mountain View Suite; that page now returns a 404 and the current room list runs Ironworks, Studio and Deluxe categories with no mountain designation. Google still surfaces the old URL, which is a good reminder that a search result is not inventory.",
        ],
      },
      {
        h2: "Doesn't every Denver hotel advertise a mountain view?",
        answer:
          "No, and the ones that stay quiet are the more useful signal. The Crawford, the Oxford, the Teatro, the Ramble, the Catbird, the Halcyon, the Clayton, the Magnolia and the Monaco publish no mountain claim anywhere in their room descriptions. The Oxford goes further and tells you what you actually get: views of the Lower Downtown neighborhood.",
        body: [
          "The Maven at Dairy Block is the clearest case. It sells rooms by view — Sky Yard view, city view, alley view, Coors Field view — so it clearly believes the window is worth pricing. There is no mountain-view category, and there is no mountain language. A hotel that itemizes its views and leaves that one out has told you the answer.",
          "The same holds up high. 54thirty at Le Méridien bills itself as downtown Denver's highest open-air rooftop bar and makes no mountain claim in its own marketing, while the Hyatt Regency's Peaks Lounge twenty-seven floors up leads with the Rockies. Height alone doesn't do it. What's standing between you and west does.",
          "Three hotels make a mountain claim without naming a room for it: the Grand Hyatt, the Thompson and The Rally all describe mountain views inside high-floor, corner or suite descriptions. The Grand Hyatt's is the most specific — its high-floor category is defined as floors 16 and above. Those are worth asking about at the desk, but they are not something you can select at booking.",
        ],
      },
      {
        h2: "What guests actually report seeing",
        spotlight: {
          slugs: [
            "sonesta-denver-downtown",
            "courtyard-by-marriott-denver-cherry-creek",
            "the-jacquard-autograph-collection",
            "home2-by-hilton-denver-downtown-convention-center",
          ],
          heading: "Where the guest reports are strongest",
          note: "None of these sells a mountain-view room type. All four have guests describing one anyway — ask for a high floor.",
        },
        answer:
          "We searched our own Google review data across 250 Denver hotels for mountain mentions. Thirty-one properties have guests describing a mountain view, which is far more than the four selling one — but the useful detail is that guests keep naming the specific floor, side or room type that delivers it.",
        list: [
          "Hyatt Regency Denver — \"Watching the sunset over Denver with the mountains in the distance from the rooftop lounge is something special.\" The rooftop keeps coming up more than the rooms do.",
          "Sonesta Denver Downtown — \"The views were incredible, a perfect mix of the Denver skyline and the beautiful Rocky Mountains in the distance.\" Guests consistently attach this to the upper floors, not the building.",
          "Hilton Garden Inn Denver Downtown — \"I had a room on the 12th floor, which had a nice territorial view of the city and mountains.\" The floor number is the whole claim.",
          "Courtyard by Marriott Cherry Creek — \"Beautiful Views of the City & Rockies!\" A high-rise in a low-rise neighborhood, which is the geometry that works.",
          "The Jacquard, Cherry Creek — \"an unbeatable rooftop bar & pool with the most incredible views of the Front Range.\" Rooftop again, not rooms.",
          "Home2 Suites Convention Center — \"There is a great view of the Rockies.\" One of the cheapest rooms on this page.",
          "Courtyard Denver Downtown West — \"From the 2nd floor terrace we had a little peek at the mountains and a gorgeous view of Downtown Denver and the Broncos Stadium.\" An honest description of a partial view, which is rarer than it should be.",
        ],
        body: [
          "Read those back and a pattern falls out: the reliable mountain views in Denver are on rooftops and upper floors, and almost nobody reports one from a standard room on a low floor. If the view is the reason for the trip, the floor matters more than the hotel.",
        ],
      },
      {
        h2: "The mountain-view upgrades that disappoint",
        answer:
          "Paying for the view is the part that goes wrong. Guests report being charged for a mountain view and given something else at three separate properties, and one hotel's mountain-view rooms are on the noisy side of the building.",
        table: {
          head: ["Property", "What guests report", "What to do"],
          rows: [
            ["Hilton Garden Inn Arvada", "\"The Mountain View is not really a view so don't pay for the upgrade even if it is only $5 extra a night\"", "Skip the upgrade"],
            ["Hotel Indigo Union Station", "A guest bought a mountain-view room for an anniversary and was given a view of a wall. IHG publishes no mountain-view room type at this hotel", "Don't pay for a view that isn't a published category"],
            ["Hampton Inn & Suites Cherry Creek", "The mountain view guests praise is from the front entrance and the parking lot, not from the rooms", "Fine hotel, wrong reason to book it"],
            ["Cambria Denver Downtown RiNo", "\"Our odd numbered room did NOT have a mountain view\"", "Ask for an even-numbered room at check-in"],
            ["The Source Hotel, RiNo", "\"the mountain-view side of the hotel that we stayed on was very noisy at night\" — construction and truck traffic", "The view side and the quiet side are different sides"],
          ],
        },
        body: [
          "The Hilton Garden Inn Denver Union Station sits in an awkward middle. Its gallery includes a photo captioned \"Guestroom Mountain View\" and guests do report seeing mountains in the distance, but there is no bookable mountain-view category or view upgrade on Hilton's site. If someone offers you one at the desk, it is a room assignment, not a room type.",
        ],
      },
      {
        h2: "Why a west window works on some Denver blocks and not others",
        answer:
          "Because Denver protects almost nothing. The city has no citywide height limit, and only fourteen mapped view planes — all of which protect the view from public places, not from your window. The city's own language is blunt: whether it's a single-story home or a high rise, other buildings are allowed to block the view from a residence.",
        body: [
          "That makes the foreground everything. LoDo has the best one in the city and it is protected by accident rather than design: the Lower Downtown Neighborhood Plan sets a height of 55 feet by right, and about 85% of LoDo's 131 contributing historic buildings already stand under that. A five-story western foreground is why a mid-rise room near Union Station can see over the top of the neighborhood, and why the same floor in the CBD sees a building.",
          "The central business district is the opposite case. All ten of Denver's tallest buildings sit on that spine, and the newest ones went up in exactly the wrong places for a hotel window — 1900 Lawrence at 30 floors in 2024, described as Denver's largest skyscraper in 40 years, Block 162 at 30 floors in 2021, One River North at 16 in 2024, and the Upton Residences at roughly 38 floors opening this year. In the CBD, high floors are not a bonus. They are the entry price.",
          "The one to watch is Ball Arena. Its rezoning amended the Old City Hall view plane and passed 10 to 1, and that parcel sits directly west of LoDo and Union Station — the exact ground a west-facing LoDo window looks across. Residents raised blocked mountain views during the process. Nothing has been built yet, but a mountain view booked in LoDo today is not a permanent feature of the block.",
        ],
      },
      {
        h2: "The cheaper way to buy the view",
        spotlight: {
          slugs: [
            "grand-hyatt-denver",
            "the-rally-hotel-at-mcgregor-square",
            "the-art-hotel-denver-curio-collection-by-hilton",
            "the-westin-denver-downtown",
          ],
          heading: "Rooftops you can visit without a room",
          note: "All four claim mountain views from a bar or pool deck on their own site. A drink up there costs less than a view upgrade — and you get to see the weather first.",
        },
        answer:
          "Drink it instead of sleeping in it. Six Denver hotels claim mountain views from a rooftop or top-floor bar on their own sites, and a cocktail costs less than a view upgrade at every one of them.",
        list: [
          "Peaks Lounge, Hyatt Regency — 27th floor, and the one our review data endorses most consistently. It is the same aspect as the hotel's mountain-view rooms.",
          "Pinnacle Club, Grand Hyatt — 38th floor, the highest of the set.",
          "Stellar Jay, Populus — the rooftop of the building whose room categories are named for the same view.",
          "SkyBridge, The Rally Hotel — over the Coors Field side of LoDo, where the low foreground helps.",
          "The Westin Denver Downtown rooftop pool — the Westin's mountain claims live in its gallery labels rather than its room names.",
          "FIRE at The Art Hotel — Golden Triangle, looking back across the low-rise museum district.",
          "The Jacquard rooftop pool, Cherry Creek — the Front Range view our guests rate highest outside downtown.",
        ],
        body: [
          "This is also the honest hedge. A rooftop lets you see the weather before you commit: the Front Range disappears behind haze, cloud and summer smoke often enough that a view upgrade booked three months out is partly a bet on air quality.",
        ],
      },
      {
        h2: "What to ask before you pay for the view",
        answer:
          "Four questions, and none of them can be answered by a booking site. No Denver hotel publishes the compass direction a room faces, so every mountain claim you read at booking is marketing language rather than a verified sightline.",
        list: [
          "Is this a room category or a room assignment? A category is contractual. An assignment is a favor, and the Hotel Indigo guest who paid for a view of a wall is what happens when the two get confused.",
          "What floor, specifically? Guests reporting real mountain views in Denver are on the 12th floor and up, or on a rooftop. Ask for a floor number, not a floor range.",
          "What is directly west of the building, and is anything going up there? A hotel that can answer this is telling you it knows its own view. One that can't is selling you a direction.",
          "Is the view side the quiet side? At The Source they are not. Ask before you choose the window over the sleep.",
        ],
      },
    ],
    faqs: [
      {
        q: "Which Denver hotels have mountain view rooms?",
        a: "Four hotels sell a guest room named for the mountain view: the Hyatt Regency Denver at the Colorado Convention Center (1 King Bed Mountain View and 2 Queen Beds Mountain View), the Four Seasons Hotel Denver (Deluxe Mountain-View Room), Hotel Clio in Cherry Creek (King and Queen/Queen Guest Rooms — Mountain View), and Populus (Mountain Studio Suite with Rocky Mountain Views, plus the top-floor Summit Junior Suite). Many other Denver hotels have rooms that happen to face the mountains, but those are room assignments rather than bookable categories.",
      },
      {
        q: "Can you see the mountains from downtown Denver hotels?",
        a: "From upper floors and rooftops, yes; from a standard low floor in the central business district, usually not. All ten of Denver's tallest buildings are on the downtown spine, the city has no citywide height limit, and its fourteen mapped view planes protect views from public places rather than from hotel windows. Guests reporting genuine mountain views in our review data are almost always on the 12th floor or higher, or on a rooftop.",
      },
      {
        q: "Is a mountain view room upgrade in Denver worth it?",
        a: "Only when it is a published room category at a hotel tall enough to clear its western foreground. Guests at the Hilton Garden Inn Arvada advise skipping the upgrade outright — \"not really a view\" even at $5 extra a night — and a guest at the Hotel Indigo Union Station paid for a mountain view and got a wall, at a hotel that publishes no mountain-view room type. If the view is the point, the Hyatt Regency's Peaks Lounge on the 27th floor gives you the same aspect for the price of a drink.",
      },
      {
        q: "Which side of a Denver hotel faces the mountains?",
        a: "West. The Front Range runs the length of Denver's western horizon, so a west-facing window is the requirement — but no Denver hotel publishes which rooms face which direction, so you have to ask. Guests at the Cambria in RiNo report that odd-numbered rooms face away from the mountains, and guests at The Source report the mountain side is also the noisy side.",
      },
      {
        q: "Why do so few Denver hotels advertise mountain views?",
        a: "Because most of them can't honestly claim one. Denver's downtown core is dense and tall enough that a west window frequently looks at another building, and hotels that sell views by name tend to sell what they actually have — the Maven at Dairy Block itemizes Sky Yard, city, alley and Coors Field views with no mountain option, and the Oxford advertises views of the Lower Downtown neighborhood. LoDo is the exception worth knowing: its 55-foot height-by-right and its low historic building stock leave a genuine gap to see over.",
      },
    ],
    booking: {
      pubref: "guide-mountain-views",
      heading: "Book the window",
      blurb: "Mountain-view categories are a small slice of a hotel's inventory and they sell out before the standard rooms do. Put your dates in and check both neighborhoods — downtown has the height, Cherry Creek has the open western foreground.",
      areas: [
        { slug: "downtown", label: "Downtown & the Convention Center", note: "Where the four mountain-view categories cluster, and where height is the price of entry. The Hyatt Regency has the deepest inventory and the 27th-floor lounge to match." },
        { slug: "cherry-creek", label: "Cherry Creek", note: "Lower buildings, more open sky to the west, and the strongest Front Range reports in our review data outside downtown. Hotel Clio splits its rooms by aspect, so ask for the mountain side." },
      ],
    },
  },
  "new-hotels-in-denver": {
    slug: "new-hotels-in-denver",
    title: "New Hotels in Denver: What Has Actually Opened",
    metaTitle: "New Hotels in Denver: What Has Actually Opened",
    metaDescription:
      "Five hotels opened in Denver proper in the last twenty months, not the dozen the listicles claim. What's new, what's paused, what closed, and the booking pages for hotels that no longer exist.",
    ogTitle: "Denver's New Hotels: Five in Twenty Months",
    ogDescription:
      "The convention-center Marriott is paused. Virgin has slipped three times. And sonder.com is still selling rooms in Denver buildings that closed in November 2025.",
    lede:
      "Five hotels have opened inside Denver city limits since January 2025. That is the real number, and it is a long way from the dozen you will find on the lists that pad themselves with 2024 openings — Populus, Urban Cowboy, the Cambria in RiNo and the Kimpton Claret all opened before this window. The 559-room Marriott that was supposed to fix the convention-center block is paused. Virgin Hotels has slipped three times and no source confirms it has broken ground. Meanwhile the most important thing to know about new Denver hotels is defensive: sonder.com is still taking bookings for four Denver buildings that closed in November 2025.",
    updated: "2026-08-30",
    sections: [
      {
        h2: "What new hotels have opened in Denver?",
        answer:
          "Five in the city proper since January 2025, and they are smaller and more scattered than the pipeline stories suggested. The AC Hotel Denver RiNo in June 2026 is the most significant of them at 128 rooms; the Apiary at Belleview Station in February is the largest at 175.",
        table: {
          head: ["Hotel", "Opened", "Rooms", "Where"],
          rows: [
            ["AC Hotel Denver RiNo", "June 2026", "128", "RiNo — the first full-service flag in the neighborhood's core"],
            ["Apiary Hotel Belleview Station", "February 2026", "175", "Belleview Station, on the light rail south of the Tech Center"],
            ["All Inn Hotel", "March 2026", "54", "City Park West, on the Bluebird stretch of Colfax"],
            ["La Vista Motel", "November 2025", "23", "East Colfax — a motel reworking, not a new build"],
            ["Courtyard by Marriott Denver Downtown West", "January 2025", "110–116", "Sun Valley, walking distance to Empower Field"],
          ],
        },
        spotlight: {
          slugs: [
            "ac-hotel-denver-rino",
            "apiary-hotel-belleview-station-denver",
            "courtyard-by-marriott-denver-downtown-west",
          ],
          heading: "The three you can book tonight",
          note: "The two smallest openings are boutique conversions on Colfax and are not carried by the major booking channels the way these are.",
        },
        body: [
          "One more sits just over the line and is worth naming: the Holiday Inn & Suites Commerce City–Denver Airport opened in August 2026 with 106 rooms, and it is the first ground-up build of Holiday Inn's new lobby prototype anywhere. If you are pricing the airport corridor, it is the newest room out there by a wide margin.",
          "Note the room count on the Courtyard Downtown West: sources give 110 and 116 and we could not resolve which is right. It does not change anything for a traveler, but it is the kind of small discrepancy that tells you how loosely this information gets copied around.",
        ],
      },
      {
        h2: "What new Denver hotels are coming next?",
        answer:
          "Nothing we can verify as under construction. The two projects everyone names are the 559-room convention-center Marriott, which was explicitly paused in July 2026, and Virgin Hotels Denver, which has slipped from 2025 to 2026 to 2027 with no source confirming it broke ground.",
        table: {
          head: ["Project", "Size", "Status as of August 2026"],
          rows: [
            ["Convention Center Marriott, 14th & Stout", "~559 rooms", "Paused July 2026 — financing costs and soft group travel. No revised date published"],
            ["Virgin Hotels Denver, Fox Park", "241 keys", "Target slipped 2025 → 2026 → 2027. No confirmation of a groundbreaking"],
            ["Train Denver, RiNo", "Not published", "Announced, then dormant for years"],
            ["Fairfield / TownePlace dual-brand", "Not published", "Announced, then dormant for years"],
          ],
        },
        body: [
          "Denver has a long history of hotels that get announced, get a rendering, get written up, and never get built. Treat any of these as a real room only when someone can point at a construction fence. The convention-center Marriott is the one that would actually change downtown supply, and its pause is the single most useful fact on this page for anyone planning a 2027 event.",
        ],
      },
      {
        h2: "Why is sonder.com still selling Denver hotels that closed?",
        answer:
          "Because the website outlived the company. When Sonder collapsed in November 2025, a buyer acquired its trademarks and domain names out of bankruptcy — not its buildings, leases or staff — and relaunched sonder.com as a booking aggregator. A live listing with recent reviews and nightly rates is not evidence the building is operating.",
        body: [
          "Four Denver buildings went dark on 10 November 2025: The Artesian at 3258 Tejon, the Skyline building at 2600 Bryant with 93 units, the Osage at 3206 Osage with 20 units, and 3354 Larimer with 23. We could not verify that any of them has reopened under a new operator. The full portfolio may have been larger; the reporting that would settle it is paywalled.",
          "This is the single most expensive mistake available to a Denver traveler right now, because everything about the listing looks normal — photos, a rate, a review dated after the closure. If you are booking anything that carries the Sonder name in Denver, the only safe check is whether a named, reachable operator answers the phone at that address.",
          "It generalizes, too. An OTA listing is inventory data, not proof of operation, and we have found the same pattern on hotels that closed for unrelated reasons. We keep a list of Denver properties we refuse to recommend for exactly this reason, and nothing on it appears anywhere on this site.",
        ],
      },
      {
        h2: "What changed at the hotels that were already here?",
        answer:
          "Two things worth knowing. The Hyatt Regency Denver finished a $70 million renovation of all 1,100 guestrooms in April 2026, which makes it effectively a new hotel at an old address. And the Brown Palace was listed for sale in March 2026 — listed, not sold.",
        spotlight: {
          slugs: [
            "hyatt-regency-denver-at-colorado-convention-center",
            "the-brown-palace-hotel-and-spa-autograph-collection",
          ],
          heading: "Old addresses, new rooms",
          note: "If you stayed at the Hyatt Regency before 2026, you have not stayed in these rooms.",
        },
        body: [
          "A rebrand or a gut renovation is functionally a new hotel to anyone searching, and it is the category the listicles miss entirely because there is no ribbon-cutting to write about. The Hyatt Regency is the clearest case in Denver right now: a full reimagination of 1,100 rooms and suites, finished this spring.",
          "The Brown Palace listing covers 472 rooms including the adjacent Holiday Inn Express. As of this writing no sale has been announced, and nothing about the guest experience has changed. We mention it only because a sale would be the biggest ownership story in Denver hospitality in years, and because you will see it reported as a done deal somewhere.",
          "One correction while we are here: the Hotel Born became the Limelight Denver in May 2023, not recently. It shows up on new-hotel lists constantly.",
        ],
      },
      {
        h2: "What Denver hotels have closed?",
        answer:
          "Fewer than you would expect, and none of them were ordinary commercial failures. Beyond the four Sonder buildings, the notable closures are the Nativ Hotel downtown, which is permanently closed, and a Comfort Inn on North Quebec Street that shut in March 2026 after serving as a city shelter.",
        list: [
          "Nativ Hotel, downtown — permanently closed and unbookable. It still appears in search results with a live rating, which is why it is worth naming.",
          "The Artesian, Skyline, Osage and 3354 Larimer — closed 10 November 2025 in the Sonder collapse. Still listed on sonder.com.",
          "Comfort Inn, North Quebec Street — closed March 2026. It had been operating as a city shelter rather than as a hotel.",
          "The former Stay Inn — vacant since 2023 and city-owned; being sold rather than reopened.",
          "Royal Palace Motel — demolished in May 2025, but it had been closed since 2013. It belongs in a demolition list, not a closure list.",
        ],
      },
      {
        h2: "Why do the new-hotel lists get this wrong?",
        answer:
          "Two reasons. They pad the window — 2024 openings like Populus and Urban Cowboy keep getting recycled as new — and they copy from sources that are themselves stale, including Denver's own tourism board.",
        body: [
          "We checked Visit Denver's hotel pages against primary sources while building this page and would not cite them. They still list a Sonder building as open, give the Courtyard Downtown West a room count off by more than a thousand, and attribute two Marriott brands to Hilton. That is a lead-generation surface, not a reference, and a great deal of the Denver hotel content on the internet is downstream of it.",
          "The honest version of the Denver story is that supply growth has slowed sharply. Five city openings in twenty months, the biggest project paused, and the flashiest one unbuilt. If you are choosing between neighborhoods rather than waiting for something to open, the pages below are more useful than this one.",
        ],
      },
    ],
    faqs: [
      {
        q: "What new hotels have opened in Denver in 2026?",
        a: "Three inside the city: the AC Hotel Denver RiNo in June with 128 rooms, the Apiary Hotel at Belleview Station in February with 175, and the 54-room All Inn Hotel in City Park West in March. Just outside the city, the Holiday Inn & Suites Commerce City–Denver Airport opened in August with 106 rooms and is the first ground-up build of Holiday Inn's new lobby prototype anywhere.",
      },
      {
        q: "Is the new convention center hotel in Denver open?",
        a: "No. The roughly 559-room Marriott planned for 14th and Stout was explicitly paused in July 2026, with financing costs and soft group travel cited, and no revised opening date has been published. If you are planning an event that assumed that supply, plan without it.",
      },
      {
        q: "When is Virgin Hotels Denver opening?",
        a: "Unknown. The 241-key Fox Park project has slipped from 2025 to 2026 to 2027, and no source we could find confirms it has broken ground. Denver has a long record of announced hotels that never got built, so treat this as a proposal rather than a date.",
      },
      {
        q: "Are Sonder hotels in Denver still open?",
        a: "No. Four Denver buildings — The Artesian on Tejon, Skyline on Bryant, the Osage, and 3354 Larimer — closed on 10 November 2025 when Sonder collapsed. A buyer acquired the Sonder trademarks and domains out of bankruptcy but no buildings, and relaunched sonder.com as a booking aggregator, so live listings with recent reviews and nightly rates still appear for addresses that are not operating. Do not book one without reaching a named operator by phone.",
      },
      {
        q: "Which Denver hotel was most recently renovated?",
        a: "The Hyatt Regency Denver at the Colorado Convention Center completed a $70 million renovation of all 1,100 guestrooms and suites in April 2026. For a traveler that matters more than most of the actual openings on this page — it is the largest block of genuinely new rooms downtown, at an address that has been there for years.",
      },
    ],
    booking: {
      pubref: "guide-new-hotels",
      heading: "Book the new ones",
      blurb: "New rooms price oddly in their first year — sometimes under the market to fill, sometimes over it because the photography is good. Put your dates in and compare the new stock against the neighborhood it landed in.",
      areas: [
        { slug: "rino", label: "RiNo", note: "Where the newest full-service hotel in Denver opened this June, and still the best food and brewery density in the city." },
        { slug: "downtown", label: "Downtown", note: "No new supply here since January 2025 and the big convention-center project is paused — but the largest renovation in the city just finished." },
      ],
    },
  },
  "hotels-near-light-rail": {
    slug: "hotels-near-light-rail",
    title: "Denver Hotels Near Light Rail: Which Stations Actually Work",
    metaTitle: "Denver Hotels Near Light Rail Stations, Walk-Timed",
    metaDescription:
      "Denver's downtown light rail is suspended for reconstruction through at least early 2027. Here's what's still running, which hotels are genuinely walkable from a station, and the airport stop with nothing near it.",
    ogTitle: "Denver Hotels Near Rail: The Downtown Lines Are Closed",
    ogDescription:
      "The D, H and L lines are suspended. Union Station and the A Line are the rail that matters right now — measured hotel by hotel, on foot.",
    lede:
      "Book at Union Station and you are on seven rail lines including the airport train. That is the short answer, and right now it is close to the only answer, because Denver's downtown light rail is switched off: the D, H and L lines are suspended for the Downtown Rail Reconstruction Project through at least the first quarter of 2027, which means Theatre District–Convention Center, 16th & California, 16th & Stout and the rest of the downtown platforms have no train at them today. Downtown moves on the free 16th Street FreeRide instead. Every walk on this page is a routed pedestrian distance from the station entrance, not a straight line — a distinction that turns out to matter enormously at one airport stop.",
    updated: "2026-08-30",
    sections: [
      {
        h2: "Which Denver rail lines are running right now?",
        answer:
          "Nine: four commuter rail lines and five light rail lines. Three light rail lines — D, H and L — are suspended for the Downtown Rail Reconstruction Project, and a temporary T Line launched on 7 June 2026 to cover part of the gap.",
        table: {
          head: ["Line", "Type", "Runs between"],
          rows: [
            ["A", "Commuter rail", "Union Station ↔ Denver Airport — the one most visitors need"],
            ["B", "Commuter rail", "Union Station ↔ Westminster"],
            ["G", "Commuter rail", "Union Station ↔ Wheat Ridge Ward"],
            ["N", "Commuter rail", "Union Station ↔ Eastlake & 124th"],
            ["C", "Light rail", "Union Station ↔ Mineral — temporarily reinstated to cover the D Line"],
            ["E", "Light rail", "Union Station ↔ RidgeGate Parkway"],
            ["R", "Light rail", "Peoria ↔ RidgeGate Parkway — extended south in June 2026"],
            ["T", "Light rail", "Lincoln ↔ I-25 & Broadway — new, temporary, opened June 2026"],
            ["W", "Light rail", "Union Station ↔ Jefferson County Government Center–Golden"],
            ["D, H, L", "Light rail", "Suspended. No service at the downtown platforms"],
          ],
        },
        body: [
          "If you have read an older guide to staying near Denver light rail, it was almost certainly written around the D and H lines running up the 16th Street corridor. That is not the network you will arrive to. Check RTD's own rail page before you build a trip around a line letter — this is the most fluid part of Denver travel planning right now.",
        ],
      },
      {
        h2: "Which Denver hotels are closest to Union Station?",
        answer:
          "The Crawford Hotel is 103 metres from the platforms because it is inside the building. Limelight Denver is 146 metres, The Oxford Hotel 214, and seven properties sit within a seven-minute walk. Union Station carries the A, B, C, E, G, N and W lines, which is more rail than the rest of the city combined.",
        table: {
          head: ["Hotel", "Walk from the station", "On foot"],
          rows: [
            ["The Crawford Hotel", "103 m · 0.06 mi", "About 1 minute — it is in the station"],
            ["Limelight Denver", "146 m · 0.09 mi", "About 2 minutes"],
            ["The Oxford Hotel", "214 m · 0.13 mi", "About 3 minutes"],
            ["Hotel Indigo Denver Downtown-Union Station by IHG", "330 m · 0.21 mi", "About 4 minutes"],
            ["The Maven Hotel at Dairy Block", "483 m · 0.30 mi", "About 6 minutes"],
            ["The Rally Hotel at McGregor Square", "592 m · 0.37 mi", "About 7 minutes"],
            ["Hilton Garden Inn Denver Union Station", "594 m · 0.37 mi", "About 7 minutes"],
          ],
        },
        spotlight: {
          slugs: ["the-crawford-hotel", "limelight-denver", "the-oxford-hotel", "hotel-indigo-denver-downtown-union-station-by-ihg"],
          heading: "The four inside a four-minute walk",
          note: "If you are arriving by train and leaving by train, this is the shortlist. Nothing else in Denver is this close to this much rail.",
        },
        body: [
          "The Crawford is worth understanding properly: the hotel occupies the upper floors of Denver Union Station itself, so the walk from your room to the airport train is an elevator and a lobby. For a late arrival or an early departure that is not a small thing.",
          "One caution about the neighborhood rather than the trains: this is the loudest corner of LoDo on a weekend night, and several of these hotels charge a destination fee of $28 to $30 on top of the rate. Neither of those shows up on a transit map.",
        ],
      },
      {
        h2: "Which hotels are near an A Line station to the airport?",
        answer:
          "Four, plus the two ends. The Westin sits 98 metres from the Denver Airport platform, Hyatt Place Peña Station is 383 metres from 61st & Peña, and 38th & Blake in RiNo has four hotels within a twelve-minute walk. The middle of the line has nothing.",
        table: {
          head: ["Station", "Hotel", "Walk"],
          rows: [
            ["Denver Airport", "The Westin Denver International Airport", "98 m · about 1 minute"],
            ["61st & Peña", "Hyatt Place Peña Station / Denver Airport", "383 m · about 5 minutes"],
            ["38th & Blake", "Catbird Hotel", "443 m · about 6 minutes"],
            ["38th & Blake", "Vīb Hotel by Best Western Denver RiNo", "673 m · about 8 minutes"],
            ["38th & Blake", "Cambria Hotel Denver Downtown RiNo", "699 m · about 9 minutes"],
            ["38th & Blake", "The Source Hotel", "908 m · about 11 minutes"],
            ["Central Park, 40th & Colorado, Peoria", "Nothing within a 15-minute walk", "—"],
          ],
        },
        spotlight: {
          slugs: ["catbird-hotel", "cambria-hotel-denver-downtown-rino", "the-source-hotel", "the-westin-denver-international-airport"],
          heading: "One train, no transfers, no car",
          note: "38th & Blake is one stop from Union Station and a straight run to the airport. It is the best transit position in Denver outside the station itself.",
        },
        body: [
          "38th & Blake is the underrated one. It is a single stop from Union Station on the same train that goes to the airport, it sits in RiNo where the food and the breweries are, and the rooms cost less than the equivalent downtown. If you are flying in, eating well, and flying out, that is the whole trip solved without a car.",
          "The A Line runs the 23 miles between the airport and Union Station in about 37 minutes, every 15 minutes from 6am to 8pm and every 30 minutes outside that.",
        ],
      },
      {
        h2: "Why the Gateway Park airport hotels are not walkable",
        answer:
          "Because there is no path. Six hotels sit within 1,158 metres of the 40th Avenue & Airport Boulevard–Gateway Park station as the crow flies, and not one is reachable in under 1,300 metres on foot. The routed walks run 1,307 to 1,590 metres — a penalty of a third to two-thirds, because the direct line crosses roads with no crossing.",
        table: {
          head: ["Hotel at Gateway Park", "Straight line", "Actual walking route"],
          rows: [
            ["Woolley's Classic Suites", "645 m", "1,570 m — 2.4× further"],
            ["Hilton Garden Inn Denver Airport", "816 m", "1,307 m"],
            ["Hampton Inn & Suites Denver/Airport-Gateway Park", "835 m", "1,392 m"],
            ["Courtyard Denver Airport at Gateway Park", "924 m", "1,389 m"],
            ["Hyatt Place Denver Airport", "941 m", "1,391 m"],
            ["Cambria Hotel Denver International Airport", "1,158 m", "1,590 m"],
          ],
        },
        body: [
          "This is exactly the gap that a map-based \"hotels near the station\" list will not show you, and it is why every distance on this page is routed rather than measured with a ruler. Woolley's looks like a seven-minute walk and is a twenty-minute one, along roads built for cars.",
          "The practical version: at Gateway Park, use the hotel shuttle. Do not book one of these on the theory that you will walk to the train with luggage. If you want to actually walk to an A Line platform, the options are the Westin at the airport itself, the Hyatt Place at 61st & Peña, or the RiNo cluster at 38th & Blake.",
        ],
      },
      {
        h2: "What does it mean that the downtown light rail is closed?",
        answer:
          "For a visitor, less than it sounds. The downtown platforms with no train are all on the 16th Street corridor, and the free 16th Street FreeRide bus runs that corridor every 4 to 12 minutes from early morning to late at night, from Union Station to Wade Blank Civic Center. You do not need a ticket and there is no fare.",
        body: [
          "The stations currently without rail service are Theatre District–Convention Center, 16th & California, 16th & Stout, 18th & California, 18th & Stout, 20th & Welton, 25th & Welton, 30th & Downing and Colfax at Auraria. The platforms are still there and buses still serve the area — there is simply no train.",
          "So a hotel that markets itself as steps from a light rail station downtown is, at the moment, steps from a platform. The Hilton Denver City Center is 91 metres from 18th & California, the Magnolia Hotel is 98 from 16th & Stout, Le Méridien Denver Downtown is 142 from 16th & California and the Embassy Suites by Hilton Denver Downtown Convention Center is 169 from Theatre District. All excellent locations; none of them currently a train.",
          "What those hotels do have is the FreeRide, which is genuinely useful and genuinely free, and a walk to Union Station of fifteen to twenty-five minutes if you want the A Line. Plan the airport leg from Union Station rather than from your front door.",
          "One caveat we would rather state than hide: RTD has floated eliminating the 16th Street FreeRide in four of five budget-reduction scenarios it published in July 2026, and the B Line in all five. Nothing has been cut — the FreeRide is running now, and RTD has temporarily increased it to roughly three-minute frequency to cover the rail work. But if you are planning a 2027 trip around a free downtown shuttle, check that it still exists before you count on it.",
        ],
      },
      {
        h2: "Hotels near the C, E and W lines",
        answer:
          "Thin, and mostly on the western edge. Ball Arena–Elitch Gardens is the useful downtown-adjacent stop with four hotels inside a sixteen-minute walk, and the Sheraton Denver West is 593 metres from Federal Center out on the W Line.",
        table: {
          head: ["Station", "Lines", "Nearest hotels, on foot"],
          rows: [
            ["Ball Arena–Elitch Gardens", "C, E, W", "SpringHill Suites by Marriott Denver Downtown 810 m; Limelight Denver 1,160 m; Hotel Teatro 1,261 m; The Crawford Hotel 1,299 m"],
            ["Empower Field at Mile High", "C, E, W", "SpringHill Suites by Marriott Denver Downtown, 1,134 m"],
            ["Decatur–Federal", "W", "Courtyard by Marriott Denver Downtown West, 1,063 m"],
            ["Federal Center", "W", "Sheraton Denver West Hotel 593 m; Hampton Inn by Hilton Denver West Federal Center 1,103 m"],
          ],
        },
        body: [
          "Ball Arena–Elitch Gardens is the stop worth knowing for an event night. It puts you one short ride from three light rail lines and a fifteen-minute walk from most of LoDo, and it is the only rail station in Denver that a Nuggets or Avalanche crowd actually uses in volume.",
        ],
      },
      {
        h2: "Hotels near rail in the Tech Center and the southeast",
        answer:
          "This is where staying on rail genuinely pays, because the alternative is I-25 at rush hour. The Residence Inn Denver Tech Center is 373 metres from Arapahoe at Village Center, and Belleview has four hotels within a fifteen-minute walk of a platform served by three lines.",
        table: {
          head: ["Station", "Lines", "Nearest hotels, on foot"],
          rows: [
            ["Arapahoe at Village Center", "E, R, T", "Residence Inn by Marriott Denver Tech Center 373 m; Wingate by Wyndham Greenwood Village/Denver Tech 982 m"],
            ["Belleview", "E, R, T", "Denver Marriott Tech Center 784 m; Hyatt Regency Denver Tech Center 907 m; Hampton Inn & Suites Denver Tech Center 1,165 m"],
            ["County Line", "E, R, T", "Residence Inn by Marriott Denver South/Park Meadows Mall, 654 m"],
            ["Lincoln", "E, R, T", "Hilton Garden Inn Denver South Park Meadows Area, 654 m"],
            ["Orchard", "E, R, T", "DoubleTree by Hilton Hotel Denver Tech Center, 746 m"],
            ["Dry Creek", "E, R, T", "EVEN Hotel Denver Tech Center-Englewood, 949 m"],
            ["Sky Ridge", "E, R", "Hampton Inn & Suites Denver/South-RidgeGate, 558 m"],
          ],
        },
        body: [
          "If your trip is a conference at the Tech Center rather than a weekend downtown, book one of these and skip the rental car entirely. The E Line runs straight to Union Station, and the drive it replaces is the worst commute in Colorado.",
        ],
      },
      {
        h2: "Hotels near the R Line for Anschutz and Aurora",
        answer:
          "Two stations matter. Iliff has three hotels within a fourteen-minute walk, led by the Fairfield Denver Aurora/Medical Center at 462 metres, and the Colfax station in Aurora puts the Holiday Inn Express Denver Aurora Medical Campus 646 metres away.",
        table: {
          head: ["Station", "Hotel", "Walk"],
          rows: [
            ["Iliff", "Fairfield by Marriott Inn & Suites Denver Aurora/Medical Center", "462 m · about 6 minutes"],
            ["Iliff", "Hampton Inn & Suites Aurora South Denver", "491 m · about 6 minutes"],
            ["Iliff", "DoubleTree by Hilton Hotel Denver - Aurora", "1,076 m · about 13 minutes"],
            ["Colfax (Aurora)", "Holiday Inn Express & Suites Denver Aurora Medical Campus", "646 m · about 8 minutes"],
          ],
        },
        body: [
          "Note the name collision: the Colfax station on the R Line in Aurora is a completely different place from Colfax at Auraria downtown, which currently has no rail service at all. Booking sites confuse these two regularly.",
        ],
      },
      {
        h2: "What does the train cost?",
        answer:
          "A three-hour pass is $2.75 and a day pass is $5.50. The airport is separate: there is no one-way airport ticket, only a $10 Airport Day Pass, or an upgrade of $7.25 from a three-hour pass or $4.50 from a day pass. Youth 19 and under and active-duty US military ride free on everything.",
        list: [
          "Three-hour pass $2.75 — the effective one-way fare for everything except the airport.",
          "Day pass $5.50. If you are making three trips, this is already cheaper.",
          "Airport Day Pass $10 — and note it is a day pass, not a one-way, so the return trip is included if it falls on the same service day.",
          "Discount fares run $1.35 for three hours, $2.70 for a day, and the Airport Day Pass carries no additional charge on the discount program.",
          "The 16th Street FreeRide is free and needs no ticket at all.",
        ],
      },
      {
        h2: "How we measured these walks",
        answer:
          "Every distance is a routed pedestrian path from the station entrance to the hotel, computed with an OpenStreetMap foot-routing engine — the way a person actually walks, following crossings and paths. Times assume a steady 80 metres a minute, which is an unhurried adult pace.",
        body: [
          "We used routed distances rather than straight lines because Denver punishes the difference. At Gateway Park a hotel 645 metres away as the crow flies is a 1,570 metre walk. Downtown, where the grid is dense and every corner has a crossing, the two numbers land within a few percent of each other. A list that measures with a ruler will be right downtown and badly wrong everywhere else.",
          "Two caveats worth stating. Routing does not know about luggage, and it does not know about winter — a nine-minute walk in July is a different proposition in February with a suitcase. And station data changes: the rail network described here was checked against RTD's own facility pages in August 2026, during an unusually disrupted period. Check the line before you book the room.",
        ],
      },
    ],
    faqs: [
      {
        q: "Which Denver hotel is closest to a light rail station?",
        a: "The Crawford Hotel, at 103 metres — it occupies the upper floors of Denver Union Station itself, so the walk to the platform is an elevator and a lobby. Union Station carries seven lines including the A Line to the airport. Limelight Denver at 146 metres and The Oxford Hotel at 214 are the next closest, and seven hotels in total sit within a seven-minute walk.",
      },
      {
        q: "Is Denver's downtown light rail running?",
        a: "No. The D, H and L lines are suspended for the Downtown Rail Reconstruction Project through at least the first quarter of 2027, so Theatre District–Convention Center, 16th & California, 16th & Stout, 18th & California, 18th & Stout, 20th & Welton, 25th & Welton, 30th & Downing and Colfax at Auraria currently have no train. The platforms and the buses remain, and the free 16th Street FreeRide runs that corridor every 4 to 12 minutes.",
      },
      {
        q: "Can you take the train from Denver airport to your hotel?",
        a: "Yes, on the A Line, which runs the 23 miles to Union Station in about 37 minutes, every 15 minutes between 6am and 8pm. It costs $10 for an Airport Day Pass — there is no cheaper one-way. The hotels you can walk to from an A Line platform are the Westin at the airport itself (98 m), the Hyatt Place at 61st & Peña (383 m), and four in RiNo at 38th & Blake, led by the Catbird Hotel at 443 m.",
      },
      {
        q: "Are the Gateway Park airport hotels walkable to the train?",
        a: "No, despite looking like it on a map. Six hotels sit within 1,158 metres of the 40th & Airport–Gateway Park station in a straight line, but the shortest actual walking route to any of them is 1,307 metres and the longest is 1,590 — the roads out there have no pedestrian crossings on the direct line. Use the hotel shuttle instead, or book at 61st & Peña or 38th & Blake if walking to the platform matters.",
      },
      {
        q: "Which Denver hotels are on the A Line to the airport?",
        a: "Working outward from downtown: The Crawford, Limelight, The Oxford, Hotel Indigo, The Maven, The Rally and the Hilton Garden Inn at Union Station; the Catbird, Vīb, Cambria RiNo and The Source at 38th & Blake; the Hyatt Place at 61st & Peña; and the Westin at the airport station. The three intermediate stops — Central Park, 40th & Colorado and Peoria — have no hotel within a fifteen-minute walk.",
      },
    ],
    booking: {
      pubref: "guide-light-rail",
      heading: "Book on the line",
      blurb: "Rooms at Union Station carry a premium and a destination fee; a stop out in RiNo puts you on the same train for less. Check both on your dates before deciding what the walk is worth.",
      areas: [
        { slug: "lodo", label: "LoDo & Union Station", note: "Seven rail lines including the airport train, and the only hotel in Denver that is inside a station. Loudest on weekend nights, and where the destination fees cluster." },
        { slug: "rino", label: "RiNo", note: "38th & Blake is one stop from Union Station on the airport line. Better food, cheaper rooms, and no car needed either way." },
      ],
    },
  },
};

export const GUIDE_SLUGS = Object.keys(GUIDES);

/**
 * Ordered card copy for the guides. These pages were islands — each one linked
 * up to the pillar and nowhere sideways, so a new guide had exactly two
 * internal links pointing at it and took weeks to get discovered. Every guide
 * now links to the three that follow it here, wrapping around, which gives
 * each page three inbound contextual links the moment it ships.
 */
export const GUIDE_CARDS: { slug: string; title: string; blurb: string }[] = [
  { slug: "hotels-near-light-rail", title: "Hotels near light rail", blurb: "The downtown lines are suspended. Which stations still work, walk-timed hotel by hotel." },
  { slug: "new-hotels-in-denver", title: "New hotels in Denver", blurb: "Five have opened in twenty months, not the dozen the lists claim. Plus what's paused and what closed." },
  { slug: "mountain-view-hotels", title: "Hotels with mountain views", blurb: "Only four sell a room named for it — and some famous ones advertise the opposite." },
  { slug: "hotel-free-parking", title: "Where parking is actually free", blurb: "No downtown hotel. Not the airport strip either, whatever the booking sites say." },
  { slug: "bachelorette-party-hotels", title: "Group and bachelorette weekends", blurb: "Most rooms cap at four adults. What genuinely sleeps six or eight." },
  { slug: "hotel-parking", title: "What hotel parking costs", blurb: "$42 to $70 a night downtown, published hotel by hotel." },
  { slug: "resort-fees", title: "Do Denver hotels charge resort fees?", blurb: "Some do, most downtown flags don't, and the law changed twice." },
  { slug: "hotel-costs", title: "What a Denver hotel really costs", blurb: "Rate, tax and parking together — the only number worth comparing." },
  { slug: "is-downtown-denver-safe", title: "Is downtown Denver safe?", blurb: "District data, what changed at Union Station, and why the hour beats the block." },
  { slug: "altitude", title: "The altitude, honestly", blurb: "What a mile up actually does to you, and the first-night mistakes." },
  { slug: "airport-train", title: "The A Line from the airport", blurb: "37 minutes for $10 — and the $10 is a day pass, not a one-way." },
  { slug: "den-layover", title: "Leaving DEN on a layover", blurb: "About three and a half hours of overhead. Here's when it's worth it." },
  { slug: "ski-basecamp", title: "Denver as a ski basecamp", blurb: "Verified distances, the ski train, the Snowstang, and when I-70 jams." },
  { slug: "red-rocks-what-to-know", title: "Red Rocks, before you go", blurb: "The climb, the parking, the altitude, and what you cannot bring in." },
];

export function relatedGuides(slug: string, count = 3) {
  const i = GUIDE_CARDS.findIndex((g) => g.slug === slug);
  const start = i === -1 ? 0 : i + 1;
  return Array.from({ length: count }, (_, n) => GUIDE_CARDS[(start + n) % GUIDE_CARDS.length])
    .filter((g) => g.slug !== slug);
}

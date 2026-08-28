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
          "For downtown, RiNo or anywhere near Union Station, yes — it is faster than rush-hour traffic, costs $10 for the round trip, and drops you in the middle of the city. A rideshare wins if you are staying somewhere the train does not reach, arriving outside service hours, or travelling with more luggage than you want to carry.",
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
        q: "Where does the A Line drop you in downtown Denver?",
        a: "Union Station, in the middle of LoDo. The station building itself holds The Crawford Hotel, a food hall and several bars, and the 16th Street FreeRide starts from the door.",
      },
      {
        q: "Have RTD fares changed recently?",
        a: "Not since 1 January 2024, when RTD simplified and in most cases lowered its fares. Fare news from 2026 concerns Access-on-Demand paratransit, not the trains or buses.",
      },
    ],
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
          "Above about 9,000 feet, periodic breathing during sleep becomes close to universal, and disturbed sleep is the most common complaint travellers report at high altitude. Again — these are mountain numbers, not Denver ones.",
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
  },
};

export const GUIDE_SLUGS = Object.keys(GUIDES);

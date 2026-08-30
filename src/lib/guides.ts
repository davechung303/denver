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
          "Effectively none downtown, and we could not verify a single genuinely free option in the airport district or the suburbs either. What is true is that airport-area parking is cheap rather than free: published rates at properties near DEN run about $12 to $20 a night.",
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
};

export const GUIDE_SLUGS = Object.keys(GUIDES);

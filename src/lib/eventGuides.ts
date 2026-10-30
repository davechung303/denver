// Durable event lodging pages.
//
// Denver's lodging demand is event-locked and recurring: the Stock Show every
// January, the Colfax Marathon every May, GABF in October. One URL per event
// that stays accurate year to year beats a dated post that dies in February.
//
// Year-specific facts (dates, prices, attendance) are marked in comments and
// are the only things that need touching on the annual refresh. Everything
// else is the recurring shape of the event.
//
// Every figure is from the event's own site or the operating agency. Anything
// that could not be verified was left out — including, deliberately, the
// "hotels sell out" claim that every other guide makes about the Stock Show
// and none of them source.

export interface EventSection {
  h2: string;
  /** Self-contained answer, written to survive being quoted alone. */
  answer: string;
  body?: string[];
  list?: string[];
  table?: { head: string[]; rows: string[][] };
}

export interface EventGuide {
  slug: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  /** Shown under the H1. */
  kicker: string;
  lede: string;
  /** Sub-ID reported to Expedia for this page. */
  pubref: string;
  /** Hotel modules, each pulling a neighborhood. */
  lodging: { neighborhood: string; heading: string; blurb: string }[];
  sections: EventSection[];
  faqs: { q: string; a: string }[];
  links: { href: string; label: string }[];
  /** Only present when the organizer has officially announced dates. */
  event?: {
    name: string;
    startDate: string;
    endDate: string;
    locationName: string;
    locationAddress: string;
    officialUrl: string;
  };
  updated: string;
}

export const EVENT_GUIDES: EventGuide[] = [
  {
    slug: "national-western-stock-show",
    h1: "Where to Stay for the National Western Stock Show",
    metaTitle: "National Western Stock Show: Where to Stay & How to Get There",
    metaDescription:
      "Sixteen days each January, 750,000 visitors, and nothing within a real walk of the complex. Where to book, why a rodeo ticket includes parking, and the free shuttle.",
    ogTitle: "Where to Stay for the National Western Stock Show",
    ogDescription:
      "The lodging and logistics guide for Denver's biggest January event — including the free Coors Field shuttle most visitors never find.",
    kicker: "Sixteen days every January · National Western Complex",
    lede:
      "The National Western Stock Show runs sixteen days every January at the National Western Complex, about two and a half miles northeast of downtown Denver. The 2027 edition is January 9 to 24. Nothing near the complex is a genuine walk — routed on foot the nearest hotel in our set is 0.83 miles and everything downtown is two and a half to three and a half miles — so this is a trip where you choose your base on food and evenings and plan on a short ride each morning. The useful thing almost nobody tells you: any ticketed event includes free parking and grounds admission, and there is a free shuttle from Coors Field.",
    pubref: "event-stock-show",
    lodging: [
      {
        neighborhood: "rino",
        heading: "RiNo — closest with real options",
        blurb:
          "The nearest hotels to the complex, and the best food and brewery scene in the city for the evening afterwards. Routed on foot the closest of them is 0.83 miles from the grounds, so figure seventeen to twenty-five minutes walking or a few minutes by car — which in January is not really a choice.",
      },
      {
        neighborhood: "downtown",
        heading: "Downtown — more rooms, more brands, a short ride",
        blurb:
          "Two and a half to three and a half miles out, which is a car or the N Line rather than a walk. What you get is the full range of hotels, the 16th Street FreeRide, and the parade route on your doorstep if you are here for the kick-off.",
      },
      {
        neighborhood: "lodo",
        heading: "LoDo and Union Station — the transit answer",
        blurb:
          "The N Line runs from Union Station to a station at the complex itself, which makes this the one base where you can do the whole trip without a car. It is also the most expensive sleep in Denver, so weigh that against the ride you are avoiding.",
      },
    ],
    sections: [
      {
        h2: "When is the National Western Stock Show?",
        answer:
          "Sixteen days in mid-to-late January. The 2027 show runs January 9 to 24; the 2026 show ran January 10 to 25 and was the 120th. The kick-off parade is the day before opening — Thursday, January 7, 2027, at noon.",
        body: [
          "The pattern across recent years is a sixteen-day run starting on the second Saturday of January, which puts the Martin Luther King Jr. holiday weekend inside it. That is not published as a rule by the organizers, so treat it as a reliable shape rather than a guarantee, and check the official dates before booking a non-refundable room.",
          "The parade is worth planning around even if you never go to the grounds. It starts at Union Station, runs twelve blocks down 17th Street and finishes at 17th and Glenarm, with more than thirty Longhorn cattle walking through downtown Denver alongside horses, marching bands and tractors. It has run every January since the 1960s.",
        ],
      },
      {
        h2: "How big is it, really?",
        answer:
          "Bigger than visitors expect. The 2026 show drew 750,039 people across its sixteen days — an all-time record, beating the 726,972 set in 2006. The Junior Livestock Auction totaled $1,875,500, and the grand champion market steer sold for $320,000.",
        body: [
          "Attendance has regularly exceeded 700,000 in recent years, which is the number to hold in your head when you are deciding how far ahead to book. Denver in January is otherwise a quiet lodging month, and the Stock Show is the thing that changes that.",
        ],
      },
      {
        h2: "Do you need separate tickets for the rodeo?",
        answer:
          "Yes — grounds admission and rodeo tickets are separate. But the detail that saves money runs the other way: all ticketed events include free parking and grounds admission, so a rodeo ticket already covers your entry to the grounds and your car. Buying both is a common and avoidable mistake.",
        body: [
          "Pricing is tiered by adult, child three to eleven, and free for under-twos, with a Guest Badge covering all sixteen days if you are going more than a couple of times. Ticketing runs through Ticketmaster and 2027 prices go on sale in fall 2026.",
          "The rodeo slate recurs year to year even though the dates move: Colorado vs the World, the Mexican Rodeo Extravaganza, PBR bull riding, the MLK Jr. African-American Heritage Rodeo on the holiday weekend, plus first responder, military appreciation and Pink Pro rodeos. Mutton bustin' — children aged five to seven and under fifty-five pounds, riding sheep — runs on the grounds and is the single best thing to watch if you have never been.",
          "The trade show is open Sunday to Thursday from 9am to 8pm and Friday and Saturday from 9am to 9pm.",
        ],
      },
      {
        h2: "Where do you park, and is there a train?",
        answer:
          "There is free on-site parking at the Denver Coliseum and Lot F, first come first served, and a free park-and-ride from Coors Field Lot A at 1601 Park Ave W. That lot opens at 8am and complimentary shuttles run every ten to fifteen minutes to the Hall of Education, continuing until an hour after the final rodeo ends.",
        body: [
          "The RTD N Line has a station at the complex — 48th Ave/Brighton Blvd at National Western Center, 4903 N Brighton Blvd — running from Union Station. Note that this station has no RTD parking, so it works as a way to arrive from a downtown hotel and not as a park-and-ride.",
          "Rideshare drop-off and pick-up is at 4655 Humboldt Street, in front of the complex and the Denver Coliseum. In January, with ice on the roads and the lots busy, this is what most visitors staying downtown actually do.",
        ],
      },
      {
        h2: "What has changed at the complex?",
        answer:
          "A great deal. The National Western Center's first two construction phases completed in the fourth quarter of 2025. Open now: the Stockyards Event Center, a 46,000 square foot LEED Gold building; The Yards, fourteen acres of hardscaped event space; six acres of riverfront open space along the South Platte; the Livestock Center, completed December 2025; CSU Spur; and the Stock Show's own Legacy Building.",
        body: [
          "The 51st Avenue Bridge is open to cars, pedestrians and bikes, carrying the People's Bridge of the Sun installation by Denver artist David Ocelotl Garcia.",
          "What is not built is the planned equestrian center and hotel. That project sits outside the first two phases and is at the procurement stage with two shortlisted partners; the official completion date is listed as to be determined. If you read somewhere that a hotel is opening on the campus, no date for one exists.",
        ],
      },
      {
        h2: "How far ahead should you book?",
        answer:
          "Early. The Stock Show runs an official Marriott room-block program, and for 2027 the twelve participating hotels listed rates from $109 to $169 a night with booking cutoffs falling between December 18 and 25, 2026. Those cutoffs are the honest deadline rather than a marketing one.",
        body: [
          "We are not going to tell you the city sells out, because no official source says that and plenty of guides assert it. What is verifiably true is that this is Denver's largest January event by a wide margin, that attendance has topped 700,000 in recent years, and that the official room block has a hard December cutoff. Book by early December and the question does not arise.",
          "The block spans downtown Denver, Broomfield, Golden, Aurora and the airport area, so read the location before the rate — the $109 rate is the Marriott out in Golden, which is a long drive each way in January weather.",
        ],
      },
    ],
    faqs: [
      {
        q: "When is the National Western Stock Show 2027?",
        a: "January 9 to 24, 2027 — sixteen days, as it runs every year. The kick-off parade is Thursday January 7 at noon, starting at Union Station and running twelve blocks down 17th Street to Glenarm, with more than thirty Longhorn cattle walking through downtown.",
      },
      {
        q: "Where should you stay for the Stock Show?",
        a: "RiNo and Five Points are the closest neighborhoods with real hotels — routed on foot the nearest is 0.83 miles from the complex, so seventeen to twenty-five minutes walking or a few minutes by car. Downtown and LoDo are two and a half to three and a half miles out but have far more rooms, better evenings, and the N Line running directly to a station at the complex.",
      },
      {
        q: "Is parking free at the National Western Stock Show?",
        a: "Yes, in two ways. There is free on-site parking at the Denver Coliseum and Lot F on a first-come basis, and a free park-and-ride from Coors Field Lot A with complimentary shuttles every ten to fifteen minutes from 8am until an hour after the last rodeo. Separately, every ticketed event includes free parking and grounds admission, so a rodeo ticket already covers both.",
      },
      {
        q: "Can you take the train to the Stock Show?",
        a: "Yes. RTD's N Line runs from Union Station to a station at the complex itself — 48th Ave/Brighton Blvd at National Western Center. There is no RTD parking at that station, so it works for arriving from a downtown hotel rather than as a park-and-ride.",
      },
      {
        q: "How many people go to the Stock Show?",
        a: "750,039 attended the 2026 show across its sixteen days, an all-time record that beat the previous mark of 726,972 from 2006. Attendance has regularly topped 700,000 in recent years.",
      },
      {
        q: "Do you need a rodeo ticket to visit the Stock Show?",
        a: "No — grounds admission is its own ticket and covers the trade show, the yards, mutton bustin' and the kids' shows. Rodeos, horse shows and special competitions need separate tickets, and those tickets include grounds admission and parking, so buying both separately wastes money.",
      },
    ],
    event: {
      // YEAR-SPECIFIC: officially announced 2027 dates. Update each fall.
      name: "National Western Stock Show 2027",
      startDate: "2027-01-09",
      endDate: "2027-01-24",
      locationName: "National Western Complex",
      locationAddress: "4655 Humboldt Street, Denver, CO 80216",
      officialUrl: "https://nationalwestern.com/",
    },
    links: [
      { href: "/hotels/near-national-western", label: "Routed walk times to the National Western Complex" },
      { href: "/denver/where-to-stay#rino", label: "The RiNo write-up" },
      { href: "/denver/hotel-parking", label: "What Denver hotel parking costs" },
      { href: "/denver/where-to-stay", label: "Where to stay in Denver: the full guide" },
      { href: "/denver/altitude", label: "The altitude, honestly" },
    ],
    updated: "2026-08-29",
  },
  {
    slug: "colfax-marathon",
    h1: "Where to Stay for the Colfax Marathon",
    metaTitle: "Colfax Marathon: Where to Stay Near the City Park Start",
    metaDescription:
      "A 6am start in City Park and rolling road closures from 5am. Why Uptown beats downtown for this one race, and which streets stay open on marathon morning.",
    ogTitle: "Where to Stay for the Colfax Marathon",
    ogDescription:
      "The start is City Park at 6am and the closures begin at 5am. Book accordingly — here's how.",
    kicker: "Mid-May, every year · Start and finish in City Park",
    lede:
      "The Colfax Marathon starts and finishes in Denver's City Park, on the east side of Ferril Lake, at 6am. Road closures run from 5am to 1pm on a rolling basis. Those two facts should decide where you book: a hotel you can walk from beats a hotel you have to drive from, because at 5:15 on race morning the course is already closing around you. Uptown and Capitol Hill are the walk. The 2027 race weekend is May 15 and 16, with the 5K on the Saturday and everything else on the Sunday.",
    pubref: "event-colfax-marathon",
    lodging: [
      {
        neighborhood: "uptown",
        heading: "Uptown — the smart book for this race",
        blurb:
          "Closest to the City Park start with a real choice of hotels, and 17th Avenue's restaurants for the carb-loading dinner the night before. On race morning you walk to the start line instead of negotiating a course that is already closing.",
      },
      {
        neighborhood: "capitol-hill",
        heading: "Capitol Hill — value, and still walkable-ish",
        blurb:
          "The best value close in, with more character than anywhere downtown. A little further from City Park than Uptown but still on the right side of the closures, and the neighborhood is on the course anyway.",
      },
      {
        neighborhood: "downtown",
        heading: "Downtown — more rooms, but plan the morning",
        blurb:
          "The widest choice of hotels and the finish-line celebration is a short ride afterwards. The catch is race morning: the course runs through downtown, closures start at 5am, and a 5:30 drive to City Park is not the simple journey it looks like on a map.",
      },
    ],
    sections: [
      {
        h2: "When is the Colfax Marathon?",
        answer:
          "A weekend in mid-May every year. The 2027 race weekend is May 15 and 16 — the Colfax 5K on Saturday, and the marathon, half marathon, Urban 10 Miler and marathon relay on Sunday. The 2026 race Sunday was May 17. 2027 is the event's twenty-first year.",
        body: [
          "The Health and Fitness Expo runs on the Friday and Saturday before, which is where bib pick-up happens. If you are flying in, that pushes your arrival to Friday rather than Saturday evening — a detail that catches out-of-town runners who booked two nights and needed three.",
        ],
      },
      {
        h2: "What time does everything start?",
        answer:
          "The marathon and the first leg of the relay go at 6am from City Park, east side of Ferril Lake. The half marathon follows at 6:30am from the same place. The Urban 10 Miler starts in waves between 7:45 and 8:45am from the Rocky Mountain College of Art and Design. The Saturday 5K is at 9am.",
        table: {
          head: ["Race", "Start", "From"],
          rows: [
            ["Marathon", "6:00am Sunday", "City Park, east side of Ferril Lake"],
            ["Marathon Relay, leg 1", "6:00am Sunday", "City Park, east side of Ferril Lake"],
            ["Half Marathon", "6:30am Sunday", "City Park, east side of Ferril Lake"],
            ["Urban 10 Miler", "7:45–8:45am Sunday, by wave", "Rocky Mountain College of Art and Design"],
            ["Colfax 5K", "9:00am Saturday", "City Park, behind the museum"],
          ],
        },
        body: [
          "Every race finishes in City Park, in the Finish Line Festival area between the Denver Museum of Nature and Science and Ferril Lake. The Urban 10 Miler covers the last ten miles of the marathon course and has a two-and-a-half-hour limit.",
        ],
      },
      {
        h2: "Which roads close, and which stay open?",
        answer:
          "Closures run 5am to 1pm on a rolling basis — each street reopens once the runners are past. The organizers publish the open corridors, and they are the most useful thing on the whole website: I-25 stays open north-south, as does Colorado Boulevard and everything east of it — with the exception of Colorado southbound between 29th and 17th — plus Kipling and everything west of it. Traveling east-west, stay south of Colfax on 14th or lower, or north of 29th on 30th or higher.",
        body: [
          "This is why the hotel choice matters more here than for any other Denver event. A car trip that looks like ten minutes on a map becomes a detour through the open corridors, at five in the morning, with a start time you cannot move. Booking somewhere you can walk from removes the entire problem.",
          "It also means spectators need a plan. Pick one or two points on the course, get there before 5am or walk, and stay put — hopping between mile markers by car does not work on this course.",
        ],
      },
      {
        h2: "What is the course actually like?",
        answer:
          "It runs through Denver and Lakewood along Colfax Avenue, which the organizers describe as the longest main street in America and which is the whole reason the race exists — by their account it was created by the cities of Denver, Lakewood and Aurora to mark it. The marathon passes through Empower Field at Mile High twice and runs through Denver Fire Station Number 1.",
        body: [
          "Beyond those, the route takes in the State Capitol, Civic Center Park, 16th Street, the Cherry Creek bike path, Confluence Park, Sloan's Lake, the Denver Zoo and Elitch Gardens, with roughly seven miles alongside rivers, lakes and bridges. The half marathon is billed as the only half in the country that runs through a fire station.",
          "One thing worth taking seriously as a visiting runner: Denver sits at 5,280 feet. That is below the threshold at which altitude illness becomes a concern, but it is high enough to matter over 26.2 miles if you arrived from sea level two days earlier. Adjust your target, not your training.",
        ],
      },
      {
        h2: "How big is the field?",
        answer:
          "More than 28,000 runners across the weekend, including over 1,100 relay teams — the organizers describe it as the largest marathon weekend in the Rockies and the second largest marathon relay in the United States. Nearly 6,000 of those runners are in the corporate and government relay divisions.",
        body: [
          "The relay is a five-person, five-leg format with corporate, government, public school and open divisions, and it is what gives the event its atmosphere: a large share of the field is running as a team from a Denver employer rather than chasing a time.",
        ],
      },
      {
        h2: "The charity thing is real",
        answer:
          "The race is run by a 501(c)(3) nonprofit, and its charity partner program works with more than two hundred nonprofits — the organizers describe it as the second largest in the country. Partner charities have collectively raised over $5 million through runner fundraising.",
        body: [
          "The marathon itself donates more than $175,000 a year, including $150,000 distributed through the relay team competitions, where corporate, government and open teams compete for prizes of up to $2,500 that they designate to a nonprofit. If you are picking a spring marathon on grounds other than the course, that is a fair reason to pick this one.",
        ],
      },
    ],
    faqs: [
      {
        q: "When is the Colfax Marathon 2027?",
        a: "Race weekend is May 15 and 16, 2027. The Colfax 5K runs on Saturday May 15, and the marathon, half marathon, Urban 10 Miler and marathon relay all run on Sunday May 16. The Health and Fitness Expo, where you collect your bib, runs the Friday and Saturday beforehand.",
      },
      {
        q: "Where does the Colfax Marathon start and finish?",
        a: "Both in Denver's City Park — the start line is on the east side of Ferril Lake and the Finish Line Festival sits between the Denver Museum of Nature and Science and the lake. The one exception is the Urban 10 Miler, which starts at the Rocky Mountain College of Art and Design and finishes in City Park with everyone else.",
      },
      {
        q: "Where should you stay for the Colfax Marathon?",
        a: "Somewhere you can walk from. Uptown is the closest neighborhood to the City Park start with a real choice of hotels, and Capitol Hill is the value version. Road closures begin at 5am against a 6am start, so a hotel that requires a drive turns race morning into a navigation problem you do not need.",
      },
      {
        q: "What roads close for the Colfax Marathon?",
        a: "Closures run from 5am to 1pm and reopen on a rolling basis as runners pass. The organizers publish the corridors that stay open: I-25 north-south, Colorado Boulevard and everything east of it apart from the southbound stretch between 29th and 17th, Kipling and everything west of it, and east-west travel south of Colfax on 14th or lower or north of 29th on 30th or higher.",
      },
      {
        q: "Is the Colfax Marathon hard because of the altitude?",
        a: "Denver is at 5,280 feet, which is below the CDC's threshold for altitude illness but high enough to show up over a marathon distance if you flew in from sea level. The course itself is not brutal — it is a city marathon through Denver and Lakewood, with about seven miles alongside rivers and lakes. Most visiting runners adjust their target rather than their training.",
      },
      {
        q: "How many people run the Colfax Marathon?",
        a: "More than 28,000 across the weekend, including over 1,100 relay teams. The organizers call it the largest marathon weekend in the Rockies, and the five-person relay the second largest in the United States.",
      },
    ],
    event: {
      // YEAR-SPECIFIC: officially announced 2027 dates. Update each fall.
      name: "Colfax Marathon 2027",
      startDate: "2027-05-15",
      endDate: "2027-05-16",
      locationName: "Denver City Park",
      locationAddress: "2001 Colorado Blvd, Denver, CO 80205",
      officialUrl: "https://www.runcolfax.org/",
    },
    links: [
      { href: "/denver/where-to-stay#uptown", label: "The Uptown write-up" },
      { href: "/denver/where-to-stay#capitol-hill", label: "The Capitol Hill write-up" },
      { href: "/denver/altitude", label: "What's actually true about Denver's altitude" },
      { href: "/hotels/near-city-park", label: "Hotels near City Park" },
      { href: "/denver/where-to-stay", label: "Where to stay in Denver: the full guide" },
    ],
    updated: "2026-08-29",
  },
  {
    slug: "denver-march-powwow",
    h1: "Where to Stay for the Denver March Powwow",
    metaTitle: "Denver March Powwow: Where to Stay Near the Coliseum",
    metaDescription:
      "The Coliseum shares a campus with the National Western Complex, so the lodging answer is the same one — and nothing is a real walk. What the organizer has actually published for 2027, and what it hasn't.",
    ogTitle: "Where to Stay for the Denver March Powwow",
    ogDescription:
      "Same Humboldt Street campus as the Stock Show, same lodging maths. Plus: the 2027 details are not out yet, whatever the aggregators tell you.",
    kicker: "Three days each March · Denver Coliseum",
    lede:
      "The Denver March Powwow runs three days each March at the Denver Coliseum, and it is one of the largest events of its kind anywhere — the organizer counts more than 1,600 dancers from close to 100 tribes, across 38 states and three Canadian provinces. The useful lodging fact is that the Coliseum sits on the same Humboldt Street campus as the National Western Complex, about two and a half miles northeast of downtown, which means the answer to where to stay is the one we already worked out for the Stock Show: nothing out there is a genuine walk, so choose your base on food and evenings and plan a short ride each morning. The thing to know before you book: as of late October 2026 the organizer has not published its 2027 dates, times or prices at all.",
    pubref: "event-march-powwow",
    lodging: [
      {
        neighborhood: "rino",
        heading: "RiNo — closest, and the best evening",
        blurb:
          "The nearest hotels to the Humboldt Street campus, and the densest food and brewery scene in Denver for afterwards. It is the same set we walk-timed for the National Western Complex next door, so the distances on that page are the right ballpark for the Coliseum too.",
      },
      {
        neighborhood: "downtown",
        heading: "Downtown — more rooms, a short ride",
        blurb:
          "Two and a half to three and a half miles out, which is a car, a rideshare or the N Line rather than a walk. What you get is the full range of brands and the whole city on your doorstep in the evening. In March you are also inside Denver's first-quarter trough for overnight visitors, which is the cheapest the downtown rate card gets.",
      },
    ],
    sections: [
      {
        h2: "When is the Denver March Powwow in 2027?",
        answer:
          "Not confirmed by the organizer. Its own website carries a notice that the site will update in the new year 2027, and no 2027 dates, hours or admission prices are posted. Third-party calendars list 19–21 March 2027, but that is not an organizer-published date and we would not book flights on it.",
        body: [
          "This matters more than it sounds, because the Powwow is a fixed-venue event on a three-day March weekend and hotel rates on the I-70 corridor move with the Humboldt Street campus calendar. If you are planning around it, the sequence is: wait for the organizer to post, then book. Denver's first quarter is its softest for overnight visitors, so you are not racing a citywide.",
          "For the 2026 edition, Denver Arts & Venues — the city agency that operates the Coliseum — published doors at 10am daily with the event starting at 11am. Treat that as the shape of the day rather than as a 2027 schedule.",
          "We have deliberately left admission prices off this page. The figures circulating on aggregator sites are not on the organizer's site or the venue's, and a wrong ticket price is exactly the kind of thing that gets copied around until everyone repeats it.",
        ],
      },
      {
        h2: "Where is the Denver Coliseum, and can you walk to it?",
        answer:
          "It is on the Humboldt Street campus northeast of downtown, immediately beside the National Western Complex, roughly two and a half miles from the central business district. Nothing there is a realistic walk from a hotel — the nearest property in our set is under a mile from the complex next door, and everything downtown is two and a half to three and a half miles.",
        body: [
          "Because the Coliseum and the National Western Complex share the same campus, the walk-timed hotel set we built for the Stock Show is the right reference for this event too. The distances were routed to the complex rather than to the Coliseum door, so read them as close rather than exact.",
          "The practical version for a March morning: stay in RiNo if you want the shortest hop and the best dinner, stay downtown if you want the range of rooms, and plan on driving or riding each morning either way.",
        ],
      },
      {
        h2: "What else is happening in Denver that week?",
        answer:
          "March is shoulder season in Denver and the first quarter is the trough for overnight visitation at 22%, against 28% in the third quarter. That is the narrowest spread most visitors assume exists, and it means a March weekend is one of the better times to get a downtown room at a sane rate.",
        body: [
          "It is also still ski season. The Winter Park Express runs from Union Station into late March in a typical year, so a Powwow weekend and a ski day are genuinely combinable if you base yourself at Union Station rather than out by the venue — though as of late October 2026 Amtrak had not announced the 2026-27 season.",
        ],
      },
    ],
    faqs: [
      {
        q: "When is the Denver March Powwow 2027?",
        a: "The organizer has not published 2027 dates. As of late October 2026 its website states that the site will update in the new year 2027, and no dates, hours or prices are posted. Third-party event calendars list 19–21 March 2027, but that is not an organizer-confirmed date — check denvermarchpowwow.com before booking travel around it.",
      },
      {
        q: "Where is the Denver March Powwow held?",
        a: "The Denver Coliseum, on the Humboldt Street campus northeast of downtown Denver, immediately beside the National Western Complex. The Coliseum is operated by Denver Arts & Venues, the city agency. It is about two and a half miles from the central business district, which is a short drive or rideshare rather than a walk.",
      },
      {
        q: "How big is the Denver March Powwow?",
        a: "The organizer counts more than 1,600 dancers from close to 100 tribes, drawn from 38 states and three Canadian provinces, which makes it one of the largest powwows in the country. It runs three days.",
      },
      {
        q: "Where should you stay for the Denver March Powwow?",
        a: "RiNo if you want the shortest trip to the Coliseum and the best food and breweries for the evening — it is the closest cluster to the Humboldt Street campus. Downtown if you want the full range of hotel brands and are happy with a two-and-a-half to three-and-a-half mile ride each morning. Nothing at the venue itself is walkable, so this is a trip where you pick your base on the evenings rather than the mornings.",
      },
      {
        q: "How much does the Denver March Powwow cost?",
        a: "We are not quoting a price, because the organizer has not published 2027 admission and the figures on aggregator sites are not sourced to the organizer or the venue. Denver Arts & Venues did note that student group rates are available for groups of 25 or more. Check denvermarchpowwow.com once its 2027 site goes live.",
      },
    ],
    // No `event` block: the organizer has not announced 2027 dates, and Event
    // schema with a date we cannot source from them is exactly the mistake
    // this page exists to point out.
    links: [
      { href: "/hotels/near-national-western", label: "Routed walk times to the Humboldt Street campus" },
      { href: "/hotels/national-western-stock-show", label: "The Stock Show — same campus, same lodging maths" },
      { href: "/denver/where-to-stay#rino", label: "The RiNo write-up" },
      { href: "/denver/hotel-costs", label: "What a Denver hotel actually costs" },
      { href: "/denver/where-to-stay", label: "Where to stay in Denver: the full guide" },
    ],
    updated: "2026-10-29",
  },
  {
    slug: "denver-st-patricks-day-parade",
    h1: "Where to Stay for the Denver St. Patrick's Day Parade",
    metaTitle: "Denver St. Patrick's Day Parade 2027: Where to Stay & Watch",
    metaDescription:
      "Step off is 9:30am on Saturday, March 13, 2027 at 19th and Wynkoop, and streets close at 9am. Routed walk times from LoDo hotels, plus the free Coors Field garage.",
    ogTitle: "Where to Stay for the Denver St. Patrick's Day Parade",
    ogDescription:
      "The one big Denver event where the lodging answer is: walk out of the hotel. Step-off is two blocks from Union Station.",
    kicker: "Saturday, March 13, 2027 · Step off 9:30am at 19th & Wynkoop",
    lede:
      "The Denver St. Patrick's Day Parade steps off at 9:30am on Saturday, March 13, 2027, at 19th and Wynkoop — two blocks up Wynkoop from Union Station. That is what makes this the rare big Denver event where the lodging answer is simply to walk out of your hotel, and the opposite of the Stock Show out on Humboldt Street. The parade starts and ends in the Coors Field parking lot, and the street everyone watches from is Blake, which gets renamed Tooley Street for the day. Routed on foot to 20th and Blake, The Rally at McGregor Square is two minutes, the Maven five, The Crawford inside Union Station seven. Streets in the area shut down from 9:00am, so if you plan to drive in you are driving into a closure with a parade already forming.",
    pubref: "event-st-patricks-parade",
    lodging: [
      {
        neighborhood: "lodo",
        heading: "LoDo and Union Station — you walk onto the route",
        blurb:
          "The step-off is at 19th and Wynkoop and the viewing stretch is Blake Street from 20th up to 27th, which means the LoDo hotels are not near the parade — they are on it. Routed on foot to 20th and Blake, the closest of them is two minutes and The Crawford, inside Union Station itself, is seven. It is the most expensive sleep in Denver and on this one weekend it is also the one that removes every logistics problem on the page.",
      },
      {
        neighborhood: "downtown",
        heading: "Downtown — more rooms, and the garage the organizer names",
        blurb:
          "A wider choice of brands at lower rates, and the one off-route parking option the committee actually recommends: the Colorado Convention Center's 1,000-space garage, which it describes as a little over half a mile and a fifteen-minute walk from the nearest point of the route. The convention-center hotel cluster routes about twenty-three minutes on foot to 20th and Blake, or two blocks to the 16th Street free shuttle that runs down to Blake.",
      },
    ],
    sections: [
      {
        h2: "When is the Denver St. Patrick's Day Parade?",
        answer:
          "Saturday, March 13, 2027, stepping off at 9:30am at 19th and Wynkoop in Denver. The committee publishes that date and time on its homepage and again on its parade route page, so unlike most March events in this city it is confirmed rather than inferred. It runs the Saturday before St. Patrick's Day, and the committee's own FAQ says to expect it to last about four hours.",
        body: [
          "The 2027 theme is \"Irish Spirit, Mile High Hearts\" and Bellco Credit Union is again the presenting sponsor, which the committee says it has been for over sixteen years. Parade registration is open and the entry deadline for 2027 is March 1.",
          "There is a second date worth knowing if you are already in town. The Changing of the Sign — the short ceremony where Blake Street becomes Tooley Street and the city paints a green stripe down it, weather permitting — is on Thursday, March 11, 2027 at 20th and Blake, with a reception at Jackson's LoDo afterwards. The committee lists the time as to be determined.",
          "Worth knowing who you are dealing with: the committee is a 501(c)(4) founded in 1962, incorporated in 1986, run by over 300 volunteers, and it states plainly that it is not affiliated with the City of Denver or any other government entity in Colorado. Denver's first St. Patrick's Day parade was in 1889; parades ran until 1921 and the modern one restarted in the early 1960s.",
        ],
      },
      {
        h2: "What is the route, and where do you watch?",
        answer:
          "The committee publishes the route only as an image — there is no street-by-street description anywhere on its site — so what follows is what it actually says in words. The parade starts and ends in the Coors Field parking lot: its FAQ describes it as \"a big snake that uncoils and returns from whence it came.\" The spectator street is Blake, renamed Tooley Street for the day.",
        list: [
          "South of 20th on Blake is where the committee says you see the entries' full performances — the dancing and the complete music sets. It also says this is the most crowded part of the parade, standing room only, and that people arrive as early as 6am to hold a spot.",
          "Blake Street from 23rd to 27th, at the end of the parade, is the spot the committee recommends for families.",
          "There is no public reserved or VIP seating at all. The committee's advice is to bring your own chairs and get there early.",
          "The route is a drone-free zone, and the committee asks that nothing be thrown to or from the floats — that restriction comes from the City of Denver.",
          "Parade Marshals wear green jackets with the committee logo and carry radios to medical and police. They are who you find if something goes wrong.",
        ],
        body: [
          "We are not going to transcribe a turn-by-turn route, because the only version the organizer publishes is a JPEG and the written descriptions circulating elsewhere are not sourced to it. The two facts you need to position yourself — it begins and ends at the Coors Field lot, and Blake between 20th and 27th is the viewing spine — are both from the committee directly.",
          "One practical warning buried in the FAQ: the committee provides portable toilets in the staging area, at the Grand Stand and in the Shamrock Row area, but not along the route for what it calls the 300,000-plus spectators, because it does not sell food or drink and so is not required to. Its own suggestion is the LoDo bars and restaurants, which is another argument for basing yourself inside those blocks.",
          "If you cannot be there, the parade is streamed on Fox31+, with Fox31 and CW2 as media sponsors.",
        ],
      },
      {
        h2: "Which hotels actually put you on the route?",
        answer:
          "The ones in LoDo, and by a wide margin. Below are routed walk times — real sidewalks, not straight lines — from our hotel set to 20th and Blake, which is the Coors Field corner and sits in the middle of the viewing stretch. Read them as distances to the parade rather than to the 9:30am step-off two blocks away at 19th and Wynkoop.",
        table: {
          head: ["Hotel", "Routed distance", "Walk"],
          rows: [
            ["The Rally Hotel at McGregor Square", "0.12 mi", "2 min"],
            ["The Maven at Dairy Block", "0.26 mi", "5 min"],
            ["The Crawford Hotel (inside Union Station)", "0.36 mi", "7 min"],
            ["Hilton Garden Inn Denver Union Station", "0.46 mi", "9 min"],
            ["Thompson Denver", "0.51 mi", "10 min"],
            ["Limelight Denver", "0.51 mi", "10 min"],
            ["Hotel Indigo Denver Downtown Union Station", "0.53 mi", "11 min"],
            ["The Westin Denver Downtown", "0.60 mi", "12 min"],
            ["Hyatt Regency Denver at Colorado Convention Center", "1.14 mi", "23 min"],
          ],
        },
        body: [
          "The gap between the top of that list and the bottom is the whole decision. A two-minute walk means you can leave your room at 9:20. Twenty-three minutes means you are leaving at 8:45 on a March morning, and you are doing it on foot anyway because the streets close at 9:00am.",
          "This is the inverse of the National Western Stock Show, where nothing is a genuine walk and everybody rides. For this parade the premium LoDo rate buys something concrete, and the committee's own advice — arrive early, hold your spot, use public transport — is advice you can mostly ignore if your hotel is four blocks away.",
        ],
      },
      {
        h2: "Where do you park, and what closes?",
        answer:
          "Streets in the area shut down beginning at 9:00am, per the committee, and reopen immediately after the parade finishes once street sweeping is done. The free option is the Coors Field parking structure: the gate at 27th and Blake opens at 7:30am and closes at 9:00am, it is the only access point, and there is no fee and no reservation.",
        list: [
          "Coors Field structure — free, first come first served, open to spectators as well as parade participants. In at 27th and Blake between 7:30 and 9:00am only; no entry before or after. You exit afterwards from lot B via the 33rd Street exit.",
          "Colorado Convention Center garage — 1,000 covered spaces, open 24 hours. The committee puts it a little over half a mile, or a fifteen-minute walk, from the closest part of the route, or two blocks from the 16th Street free shuttle down to Blake.",
          "The committee recommends booking ahead through SpotHero and says close-in spaces often fill an hour before the 9:30am step-off.",
          "The I-25 exit onto 20th Street is not closed for the parade and should stay open, though the committee notes traffic there builds as step-off approaches.",
          "If you live or are staying on the route itself and need to get a car in or out of a garage, the committee says to check with the Denver Police Department — it is a private nonprofit and does not control the closures.",
        ],
        body: [
          "The committee's blanket recommendation is to use public transport, which from a downtown or LoDo hotel means not using anything: the route is inside walking distance of most of the central hotel stock, and Union Station is two blocks from the step-off.",
          "March in Denver is the part nobody plans for. The committee's own parade-day checklist says the weather is wildly variable, to dress in layers and to bring water — this is a city at 5,280 feet where a March Saturday can be 65 degrees or snowing, and you will be standing still outdoors for a while either way.",
        ],
      },
    ],
    faqs: [
      {
        q: "When is the Denver St. Patrick's Day Parade 2027?",
        a: "Saturday, March 13, 2027, with step-off at 9:30am at 19th and Wynkoop in Denver. The date and time are published by the Denver St. Patrick's Day Parade Committee on both its homepage and its parade route page. The committee's FAQ says to expect the parade to last about four hours.",
      },
      {
        q: "Where does the Denver St. Patrick's Day Parade start?",
        a: "At 19th and Wynkoop, two blocks up Wynkoop from Union Station, at 9:30am. The parade stages in the Coors Field parking lot and, per the committee's FAQ, starts and ends there — it describes the route as a snake that uncoils and returns to where it began.",
      },
      {
        q: "What is the route of the Denver St. Patrick's Day Parade?",
        a: "The committee publishes the route only as a map image, with no street-by-street description on its site, so we do not quote one. What it does state in words: the parade starts and ends in the Coors Field parking lot, and the spectator street is Blake — renamed Tooley Street for the day — with the viewing stretch running from around 20th up to 27th.",
      },
      {
        q: "Where is the best place to watch the Denver St. Patrick's Day Parade?",
        a: "The committee gives two answers. For the full performances — complete dance routines and music sets — it points to Blake Street south of 20th, while warning that this is the most crowded part of the parade, standing room only, with people arriving as early as 6am. For families it recommends the end of the parade, on Blake Street between 23rd and 27th. There is no public reserved seating, so bring a chair and get there early.",
      },
      {
        q: "Where do you park for the Denver St. Patrick's Day Parade?",
        a: "The Coors Field parking structure is free and open to spectators, but only through the gate at 27th and Blake, and only between 7:30am and 9:00am — no entry before or after, first come first served, no reservations. You exit from lot B via 33rd Street. The alternative the committee names is the Colorado Convention Center garage, 1,000 covered spaces, about a fifteen-minute walk or two blocks from the 16th Street free shuttle. It also recommends reserving through SpotHero, and notes close-in spaces fill an hour before step-off.",
      },
      {
        q: "What streets close for the Denver St. Patrick's Day Parade?",
        a: "The committee says streets in the area shut down beginning at 9:00am and reopen immediately once the parade finishes and street sweeping is complete. It does not publish a closure list, and it states that it is not affiliated with the City of Denver, so the Denver Police Department is the authority for specifics — including getting a car out of a garage on the route. One thing the committee does confirm: the I-25 exit onto 20th Street is not closed for the parade.",
      },
      {
        q: "Where should you stay for the Denver St. Patrick's Day Parade?",
        a: "LoDo, if the rate works. The step-off is at 19th and Wynkoop and the viewing stretch is Blake Street, which puts the LoDo hotels on the route rather than near it — routed on foot to 20th and Blake, The Rally at McGregor Square is two minutes, the Maven five and The Crawford, inside Union Station, seven. Downtown is the value version with far more rooms, at roughly twenty-three minutes on foot from the convention-center cluster, or two blocks to the 16th Street free shuttle.",
      },
      {
        q: "How many people go to the Denver St. Patrick's Day Parade?",
        a: "The committee's parking page says it averages around 300,000 to 400,000 people a year, and its FAQ refers to 300,000-plus spectators. Its history page states that the 2026 parade drew over 400,000 spectators and participants and was the third largest in the United States that year. Those are the organizer's own figures; no independent count is published.",
      },
    ],
    event: {
      // YEAR-SPECIFIC: officially announced by the committee on its homepage and
      // its ParadeRoute page — "Saturday, March 13, 2027 - 9:30 AM Step Off at
      // 19th & Wynkoop". Single-day event. Update each autumn.
      name: "Denver St. Patrick's Day Parade 2027",
      startDate: "2027-03-13",
      endDate: "2027-03-13",
      locationName: "Denver St. Patrick's Day Parade step-off, 19th & Wynkoop",
      locationAddress: "19th St & Wynkoop St, Denver, CO 80202",
      officialUrl: "https://www.denverstpatricksdayparade.com/",
    },
    links: [
      { href: "/hotels/near-coors-field", label: "Routed walk times to 20th and Blake" },
      { href: "/denver/where-to-stay#lodo", label: "The LoDo write-up" },
      { href: "/denver/coors-field-parking", label: "The Coors Field parking guide" },
      { href: "/denver/hotels-near-light-rail", label: "Hotels near light rail" },
      { href: "/denver/hotel-costs", label: "What a Denver hotel actually costs" },
      { href: "/denver/where-to-stay", label: "Where to stay in Denver: the full guide" },
    ],
    updated: "2026-10-29",
  },
  {
    slug: "denver-pridefest",
    h1: "Where to Stay for Denver PrideFest",
    metaTitle: "Denver PrideFest: Where to Stay (It Left Civic Center Park)",
    metaDescription:
      "PrideFest moved onto 16th Street and dropped from two days to one. The parade runs 17th Avenue. Which hotels sit inside the footprint, and what the organizer has not announced for 2027.",
    ogTitle: "Where to Stay for Denver PrideFest",
    ogDescription:
      "The festival is on 16th Street and the parade is on 17th Avenue, which means two different neighborhoods are the right answer. Civic Center Park is not one of them any more.",
    kicker: "Pride month every June · Festival on 16th Street, parade on 17th Avenue",
    lede:
      "Denver PrideFest is not at Civic Center Park any more. The Center on Colfax moved the free festival downtown onto 16th Street — Broadway to Arapahoe — and cut it from two days to one, Sunday 10am to 6pm. The Vizzy Denver Pride Parade runs the same morning along 17th Avenue from Franklin Street to Lincoln Street, 9:30am to 12:30pm, finishing two blocks from where the festival starts. That geography is the entire lodging answer: a downtown hotel on 16th Street is inside the festival footprint rather than near it, and an Uptown hotel on 17th Avenue is on the parade route. One thing to know before you book flights: as of late October 2026 the organizer has published no dates for the next PrideFest at all.",
    pubref: "event-pridefest",
    lodging: [
      {
        neighborhood: "downtown",
        heading: "Downtown — the festival is on your street",
        blurb:
          "The free festival runs 16th Street from Broadway to Arapahoe, which is most of the downtown core, so a 16th Street hotel is not close to PrideFest — it is in it. The one catch is that the 16th Street FreeRide gets detoured off 16th Street while the festival is operating, so the shuttle you would normally use to move around downtown is the thing that does not work that day. If you were going to walk anyway, it costs you nothing.",
      },
      {
        neighborhood: "uptown",
        heading: "Uptown — 17th Avenue is the parade route",
        blurb:
          "The parade runs 17th Avenue from Franklin to Lincoln, which is the Restaurant Row strip essentially end to end — about a mile of it. Downtown and the festival are a ten to fifteen minute walk west, so one room covers the 9:30am parade and the 10am festival with no car and no transit. Rates here do not spike the way LoDo does, and Cheesman Park, where the Saturday 5K starts, is a short walk south.",
      },
    ],
    sections: [
      {
        h2: "When is Denver PrideFest?",
        answer:
          "The final weekend of June, but the next edition is not confirmed. The Center on Colfax publishes no dates for the coming year as of late October 2026, and its own sponsorship page says 2027 package information \"will be available in the new year.\" What the organizer does commit to is the shape: Pride begins June 1st, runs as a month-long, city-wide program, and the final weekend carries the three main events — the 5K, the parade and the free festival.",
        body: [
          "Those three events are worth seeing laid out, because they are not all on the same day and two of them overlap. This is the 2026 edition exactly as the organizer published it — treat it as the shape of the weekend, not as next year's schedule.",
        ],
        table: {
          head: ["Event", "Day", "Time", "Where", "Cost"],
          rows: [
            ["Pride 5K", "Saturday", "9:00am", "The Pavilion at Cheesman Park", "$40–$50"],
            ["Vizzy Denver Pride Parade", "Sunday", "9:30am–12:30pm", "17th Ave, Franklin St to Lincoln St", "Free"],
            ["Denver PrideFest", "Sunday", "10:00am–6:00pm", "16th St, Broadway to Arapahoe", "Free"],
          ],
        },
      },
      {
        h2: "Where is Denver PrideFest held — and why isn't it at Civic Center Park?",
        answer:
          "On 16th Street between Broadway and Arapahoe, in the downtown core. Almost every guide to this event still puts it in Civic Center Park, and that is now out of date: the organizer's own festival page says \"Same Pride, new place! This year, we're taking over downtown and bringing the party to 16th Street,\" and lists the location as 16th Street & Arapahoe. The parade moved too — it runs 17th Avenue now, not Colfax.",
        body: [
          "The old format, in the organizer's words, was a two-day festival at Civic Center Park with the parade covering \"14 blocks of Colfax Avenue from Cheesman Park to Civic Center,\" where the festival's second day continued. The current format is one festival day on a reopened downtown street and a parade that runs a different avenue a block north of it. The parade page is blunt about why it stayed there: \"We had so much fun on 17th Ave that we decided to run it back.\"",
          "If you are booking a room, that change matters more than it sounds. The old setup pointed you at the Golden Triangle and the Capitol end of Broadway, because that is where Civic Center Park is. The new one points at 16th Street and 17th Avenue, which are different hotels. The organizer also describes the wider shift as Denver Pride \"transitioning to a month-long, city-wide model\" — so the weekend is the anchor, but June is the event.",
          "The classics the organizer says survived the move downtown: the Latin Stage, The Gayborhood, and the youth and family area.",
        ],
      },
      {
        h2: "Which hotels actually put you on the festival and the parade?",
        answer:
          "Two neighborhoods, one for each event, and they are a fifteen-minute walk apart. Downtown puts you on 16th Street, where the festival is. Uptown puts you on 17th Avenue, where the parade is. Because the parade finishes at 17th and Lincoln at lunchtime and the festival opens at 16th and Broadway at 10am — two blocks away — you do not have to choose between them from either base.",
        list: [
          "Downtown is the festival. 16th Street from Broadway to Arapahoe is the full length of the pedestrian corridor through the central business district, so the hotels on and immediately off it are inside the closure rather than driving to it. This is also the most forgiving base in the city for a day when you will be on foot from mid-morning to evening.",
          "Uptown is the parade. 17th Avenue is Uptown's spine and it is walkable end to end, about a mile — which is almost exactly the Franklin-to-Lincoln parade route. Downtown is ten to fifteen minutes west on foot from most of it.",
          "Capitol Hill is the value version and still works, but it is now the second-best fit rather than the first. It is the cheapest central sleep in Denver and The Center on Colfax itself is in the neighborhood, at 1301 E Colfax — but Colfax is no longer the parade route, so the walk is to the route rather than out onto it.",
          "The Golden Triangle used to be the smart pick for this event and no longer is. It is the Civic Center Park neighborhood, and the festival left.",
        ],
        body: [
          "We are not publishing routed walk times to the festival for this one, because there is no single door to route to — the footprint is twelve-odd blocks of street, and a distance to one end of it is misleading about the other. The honest version is that essentially the whole downtown and LoDo hotel stock is within a walk of some part of 16th Street, and that is unusual enough among Denver's big events to be the point of the page.",
        ],
      },
      {
        h2: "Street closures, the FreeRide detour, and the trains you can't use",
        answer:
          "The organizer publishes an access-impacts document for the festival, and the single most useful thing in it is counter-intuitive: the free 16th Street FreeRide is detoured off 16th Street while PrideFest is running. Eastbound service diverts from Lawrence Street to 17th Street, crosses Broadway, and returns westbound via 15th Street before rejoining its normal route at Lawrence and 16th. The Free MetroRide is unaffected.",
        list: [
          "Closed both days of the weekend, per the organizer: Cleveland Place, Welton Street and Champa Street, each between 15th and 17th Streets. Glenarm Place between 15th and 17th stays closed anyway as part of ongoing downtown work.",
          "Closed on parade Sunday: 17th Avenue between Franklin Street and Lincoln Street, plus portions of Lincoln Street and Broadway along the route. Restrictions begin before the 9:30am step-off and streets reopen progressively through the early afternoon.",
          "Downtown light rail is not an option. The D, H and L lines do not run the full Downtown Loop during the Downtown Rail Reconstruction Project, which the organizer flagged in its own transport notes and which is in force through at least the first quarter of 2027.",
          "The route in is Union Station: mainline rail to Union Station, then buses, the FreeRide, a bike or a fifteen-minute walk. That is the organizer's own recommendation, and it is also what we would tell you for any downtown Denver weekend right now.",
          "RTD increased service frequency on several downtown routes for the 2026 festival weekend. Whether it repeats that is RTD's call, not the organizer's.",
        ],
        body: [
          "On parking, we have nothing sourced to give you, and that is worth saying plainly: the organizer publishes no parking guidance for the festival at all. It recommends public transport, rideshare, biking or walking, and that is the whole of it. There is no official lot, no shuttle lot and no named garage, which is a real change from the Civic Center Park years. If you are driving in, you are solving that problem yourself inside a weekend of rolling closures — which is the strongest argument on this page for booking a room you can walk from.",
          "The organizer's site is also thinner than it was. Its current events pages link to a safety page that returns a 404, and there is no published bag policy, prohibited-items list or accessibility page for the street format. The rules that circulate online — no coolers, no outside alcohol, no glass, free water fountains at Colfax and Bannock — were written for a fenced park the festival no longer uses. Do not plan around them.",
        ],
      },
    ],
    faqs: [
      {
        q: "When is Denver PrideFest 2027?",
        a: "The Center on Colfax has not announced it. As of late October 2026 denverpride.org lists no upcoming events and its sponsorship page states that 2027 package information \"will be available in the new year.\" What the organizer does publish is the pattern: Pride begins June 1st and the final weekend of the month carries the 5K, the parade and the free festival. The 2026 weekend was June 27 and 28, 2025 was June 28 and 29, and 2023 was June 24 and 25 — all the last weekend of June. That is a pattern, not a date, so do not book flights on it.",
      },
      {
        q: "Where is Denver PrideFest held?",
        a: "On 16th Street between Broadway and Arapahoe, in downtown Denver. It is no longer at Civic Center Park. The organizer moved the festival downtown and describes it as \"taking over downtown and bringing the party to 16th Street,\" listing the location as 16th Street & Arapahoe. Festival hours were 10:00am to 6:00pm, on the Sunday only — the two-day Civic Center Park format is gone.",
      },
      {
        q: "Is Denver PrideFest free?",
        a: "Yes. The organizer labels both Denver PrideFest and the Vizzy Denver Pride Parade free, and it has described the festival as free and open to the public for years. The Pride 5K is the only ticketed main event: $40 early bird, $50 general registration for 2026. There is no general-admission VIP ticket to buy — VIP access appears in the organizer's sponsorship packages as a sponsor benefit, and its older FAQ stated plainly that it can no longer sell VIP tickets due to city regulations.",
      },
      {
        q: "What is the Denver Pride Parade route?",
        a: "17th Avenue from Franklin Street to Lincoln Street, running 9:30am to 12:30pm, per the organizer. That is roughly a mile westbound through Uptown, ending at the downtown edge near the Capitol. It is not the Colfax route any more: the old parade covered 14 blocks of Colfax Avenue from Cheesman Park to Civic Center Park, and the organizer moved it to 17th Avenue and kept it there — \"we had so much fun on 17th Ave that we decided to run it back.\" The parade finishes about two blocks from the festival's Broadway end.",
      },
      {
        q: "Where do you park for Denver PrideFest?",
        a: "The organizer publishes no parking guidance, no official lot and no recommended garage. Its advice is to use public transport, rideshare, biking or walking, and to allow extra travel time. We are not going to invent a lot for it. Practically: the festival closes a long stretch of 16th Street, the parade closes 17th Avenue plus portions of Lincoln and Broadway on the Sunday, and downtown light rail is partly suspended for reconstruction — so the realistic plan is a hotel you can walk from, or rail to Union Station and walk in from there.",
      },
      {
        q: "Where should you stay for Denver PrideFest?",
        a: "Downtown or Uptown, and they answer different halves of the weekend. Downtown puts you on 16th Street, which is the festival footprint itself. Uptown puts you on 17th Avenue, which is the parade route, with downtown ten to fifteen minutes west on foot. Capitol Hill is the cheapest central fallback and is still close to both. The Golden Triangle was the right answer when the festival was in Civic Center Park and is no longer — that is the single most common out-of-date booking advice for this event.",
      },
      {
        q: "How big is Denver PrideFest?",
        a: "The organizer currently says only that it is \"one of the country's largest Pride festivals, and the only one of our size produced by your local LGBTQ+ community center\" — it publishes no attendance number for the new downtown format, and neither do we. Its older figures, for the two-day Civic Center Park festival, were over 500,000 visitors annually and an estimated 535,000-plus in 2023, with over 100,000 lining the Colfax parade route. Those describe a different event in a different place across two days, so we would not carry them forward.",
      },
      {
        q: "When is the Denver Pride 5K and where does it start?",
        a: "The Saturday of Pride weekend, at 9:00am, from The Pavilion at Cheesman Park. The organizer put 2026 registration at $40 early bird and $50 general, and described the field as 4,000 participants. It is the one main-weekend event that is not downtown, which matters if you are booking a single room for the whole weekend — Cheesman Park is a short walk south of Uptown and about a mile and a half east of the festival.",
      },
      {
        q: "Who organizes Denver Pride?",
        a: "The Center on Colfax, the LGBTQ+ community center at 1301 E Colfax Avenue, which produces Denver Pride as its largest annual fundraiser. Per the organizer, Denver's first LGBTQ+ pride celebration was in 1974, that first parade led to The Center being founded in 1976, and a full festival was added in 1990. Denver Pride and Denver PrideFest are registered trademarks of The Center on Colfax.",
      },
    ],
    // No `event` block. As of 29 October 2026 The Center on Colfax has
    // published no dates for the next PrideFest — denverpride.org lists no
    // upcoming events and its sponsorship page says 2027 information arrives
    // "in the new year". Every date on this page is historical and labelled as
    // such. The last-weekend-of-June pattern is a pattern, not an announcement,
    // and Event schema built on it would be a guess.
    links: [
      { href: "/denver/where-to-stay#downtown", label: "The downtown write-up" },
      { href: "/denver/where-to-stay#uptown", label: "The Uptown write-up" },
      { href: "/denver/hotels-near-light-rail", label: "Hotels near light rail — and what's suspended" },
      { href: "/denver/hotel-parking", label: "What downtown hotel parking costs" },
      { href: "/denver/hotel-costs", label: "What a Denver hotel actually costs" },
      { href: "/denver/where-to-stay", label: "Where to stay in Denver: the full guide" },
    ],
    updated: "2026-10-29",
  },
];

export function getEventGuide(slug: string): EventGuide | undefined {
  return EVENT_GUIDES.find((e) => e.slug === slug);
}

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
];

export function getEventGuide(slug: string): EventGuide | undefined {
  return EVENT_GUIDES.find((e) => e.slug === slug);
}

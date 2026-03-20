-- Dave Loves Denver — All Denver Neighborhoods
-- Run this in the Supabase SQL Editor

-- Create the neighborhoods table
create table if not exists neighborhoods (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  lat numeric not null,
  lng numeric not null,
  description text,
  is_featured boolean not null default false,
  created_at timestamptz not null default now()
);

alter table neighborhoods enable row level security;

create policy if not exists "Public read" on neighborhoods for select using (true);
create policy if not exists "Service write" on neighborhoods for insert with check (true);

-- Insert all neighborhoods
insert into neighborhoods (slug, name, lat, lng, description, is_featured) values
  ('rino', 'RiNo', 39.7621, -104.9719, 'Murals around every corner, world-class breweries, and some of the city''s best restaurants. RiNo is where Denver''s art scene lives.', true),
  ('lodo', 'LoDo', 39.7508, -104.9965, 'Historic cobblestone streets, Union Station, rooftop bars, and Coors Field. The beating heart of downtown Denver.', true),
  ('capitol-hill', 'Capitol Hill', 39.7391, -104.9811, 'Dive bars, live music venues, vintage shops, and incredible street art. Cap Hill has a personality unlike anywhere else in the city.', true),
  ('highlands', 'Highlands', 39.7677, -105.0122, 'Stunning views of the skyline, the best brunch spots in Denver, and a neighborhood that somehow stays cool without trying.', true),
  ('cherry-creek', 'Cherry Creek', 39.7153, -104.9525, 'Denver''s upscale shopping and dining district. Local boutiques, excellent restaurants, and a farmers market worth the trip.', true),
  ('washington-park', 'Washington Park', 39.7006, -104.9617, 'Built around one of Denver''s most beautiful parks. Wash Park is the go-to for morning runs, coffee hangs, and underrated brunch spots.', true),
  ('five-points', 'Five Points', 39.7558, -104.9778, 'Once called the Harlem of the West, Five Points is rich with jazz history, soul food, and a creative energy that''s coming back strong.', true),
  ('cole', 'Cole', 39.7648, -104.9669, 'One of Denver''s most underrated neighborhoods. Cole is quietly becoming one of the most interesting places to eat and drink in the city.', true),
  ('curtis-park', 'Curtis Park', 39.7598, -104.9694, 'One of Denver''s oldest neighborhoods, Curtis Park blends Victorian architecture with a laid-back, community-driven energy.', false),
  ('baker', 'Baker', 39.7218, -104.9872, 'South Broadway''s creative hub — antique shops, indie restaurants, craft cocktail bars, and some of the best people-watching in Denver.', false),
  ('south-broadway', 'South Broadway', 39.7100, -104.9872, 'SoBo is Denver''s eclectic strip of vintage shops, dive bars, tattoo parlors, and surprisingly great restaurants.', false),
  ('golden-triangle', 'Golden Triangle', 39.7320, -104.9889, 'Home to Denver''s major art museums and galleries, the Golden Triangle is the cultural center of the city.', false),
  ('whittier', 'Whittier', 39.7548, -104.9619, 'A quiet residential neighborhood with a strong community identity, great coffee shops, and easy access to City Park.', false),
  ('city-park', 'City Park', 39.7447, -104.9494, 'Denver''s largest park neighborhood, home to the zoo, the natural history museum, and some of the city''s best jogging paths.', false),
  ('city-park-west', 'City Park West', 39.7447, -104.9619, 'A walkable, hip stretch just west of City Park with strong cafe culture, neighborhood bars, and beautiful old homes.', false),
  ('congress-park', 'Congress Park', 39.7317, -104.9494, 'A charming residential neighborhood known for its tree-lined streets, excellent brunch spots, and proximity to the botanic gardens.', false),
  ('cheesman-park', 'Cheesman Park', 39.7347, -104.9619, 'Built around one of Denver''s most historic parks, Cheesman is a laid-back neighborhood with great coffee and weekend vibes.', false),
  ('uptown', 'Uptown', 39.7447, -104.9756, 'Denver''s restaurant row — Uptown is packed with some of the city''s most celebrated dining, from brunch institutions to upscale bistros.', false),
  ('alamo-placita', 'Alamo Placita', 39.7247, -104.9756, 'A small, peaceful neighborhood with a beautiful park at its center and a strong sense of community.', false),
  ('platt-park', 'Platt Park', 39.6900, -104.9872, 'South Pearl Street runs through the heart of Platt Park — one of Denver''s best walkable strips for brunch, coffee, and local shopping.', false),
  ('overland', 'Overland', 39.6803, -104.9872, 'A quiet south Denver neighborhood undergoing gradual revitalization, with easy light rail access and growing dining options.', false),
  ('globeville', 'Globeville', 39.7838, -104.9794, 'One of Denver''s oldest working-class neighborhoods, Globeville has deep roots and is seeing new investment and community development.', false),
  ('elyria-swansea', 'Elyria-Swansea', 39.7749, -104.9669, 'A tight-knit community north of downtown with authentic taquerias, local bakeries, and a strong Latino cultural identity.', false),
  ('clayton', 'Clayton', 39.7448, -104.9494, 'A residential neighborhood east of City Park with quiet streets, good schools, and a growing restaurant scene.', false),
  ('north-capitol-hill', 'North Capitol Hill', 39.7447, -104.9811, 'A dense urban neighborhood connecting downtown to Capitol Hill, with great walkability and access to Uptown dining.', false),
  ('sloan-lake', 'Sloan Lake', 39.7448, -105.0333, 'Built around a beautiful lake, Sloan Lake has become one of Denver''s most desirable neighborhoods for outdoor living and craft beer.', false),
  ('edgewater', 'Edgewater', 39.7448, -105.0583, 'A small city bordering Denver with a surprisingly great restaurant and bar scene anchored by the Edgewater Public Market.', false),
  ('berkeley', 'Berkeley', 39.7678, -105.0333, 'Tennyson Street is the main attraction — a walkable strip of independent restaurants, boutiques, and bars with a strong neighborhood feel.', false),
  ('sunnyside', 'Sunnyside', 39.7748, -105.0122, 'A residential neighborhood north of Highland with a growing food and drink scene and some of the best views of downtown.', false),
  ('virginia-village', 'Virginia Village', 39.6900, -104.9494, 'A quiet, family-friendly neighborhood in southeast Denver with good schools and easy access to Cherry Creek.', false),
  ('stapleton', 'Stapleton (Central Park)', 39.7648, -104.8794, 'Built on the old Stapleton Airport site, Central Park is a planned community with great parks, trails, and a walkable town center.', false),
  ('lowry', 'Lowry', 39.7153, -104.8794, 'Another former Air Force base turned neighborhood, Lowry has excellent parks, a town center, and a strong community identity.', false),
  ('hilltop', 'Hilltop', 39.7153, -104.9344, 'One of Denver''s most affluent residential neighborhoods, known for beautiful homes, quiet streets, and proximity to Cherry Creek.', false),
  ('mayfair', 'Mayfair', 39.7247, -104.9344, 'A comfortable, established neighborhood in east Denver with tree-lined streets and easy access to City Park and Mayfair Park.', false),
  ('park-hill', 'Park Hill', 39.7447, -104.9119, 'A large, diverse, historic neighborhood with beautiful architecture, a strong community, and great neighborhood restaurants.', false),
  ('north-park-hill', 'North Park Hill', 39.7548, -104.9119, 'The northern stretch of Park Hill, with the same beautiful homes and strong community fabric as its southern counterpart.', false),
  ('south-park-hill', 'South Park Hill', 39.7347, -104.9119, 'A tree-lined residential neighborhood with excellent schools, a tight community, and walkable access to great dining.', false),
  ('montclair', 'Montclair', 39.7247, -104.8919, 'A quiet east Denver neighborhood with a small-town feel, good local restaurants, and proximity to the Lowry development.', false),
  ('university-hills', 'University Hills', 39.6700, -104.9494, 'A suburban south Denver neighborhood anchored by the University Hills shopping center and close to DU.', false),
  ('harvey-park', 'Harvey Park', 39.6600, -104.9872, 'A working-class southwest Denver neighborhood with authentic Mexican restaurants and a strong Latino community.', false),
  ('bear-valley', 'Bear Valley', 39.6500, -105.0122, 'A quiet southwest Denver neighborhood with good access to the mountains and Bear Creek trail system.', false),
  ('westwood', 'Westwood', 39.6900, -105.0333, 'A largely Latino neighborhood in southwest Denver with authentic taquerias, panaderias, and a strong community identity.', false),
  ('villa-park', 'Villa Park', 39.7100, -105.0333, 'A diverse west Denver neighborhood with deep community roots, undergoing gradual revitalization.', false),
  ('sun-valley', 'Sun Valley', 39.7218, -105.0122, 'A small west Denver neighborhood adjacent to Mile High Stadium, currently undergoing major redevelopment.', false),
  ('lincoln-park', 'Lincoln Park', 39.7218, -104.9994, 'Home to the Santa Fe Arts District, Lincoln Park has a strong creative identity and some of Denver''s most interesting galleries.', false),
  ('jefferson-park', 'Jefferson Park', 39.7448, -105.0122, 'A rapidly growing neighborhood just northwest of downtown with great skyline views, breweries, and new restaurants.', false),
  ('west-colfax', 'West Colfax', 39.7400, -105.0333, 'An evolving stretch of Colfax Avenue with an eclectic mix of old-school Denver businesses and new development.', false),
  ('barnum', 'Barnum', 39.7100, -105.0122, 'A west Denver neighborhood with a quiet residential character and improving walkability along West Colfax.', false),
  ('valverde', 'Valverde', 39.7006, -105.0122, 'A small west Denver neighborhood with authentic Latin American restaurants and easy access to downtown.', false)
on conflict (slug) do nothing;

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const DENVER_KEYWORDS = ['denver', 'colorado', 'mile high', 'front range', 'blucifer', 'red rocks', 'coors field', 'union station', 'lodo', 'rino', 'river north', 'capitol hill', 'highlands', 'cherry creek', 'wash park', 'washington park', 'five points', 'baker', 'golden triangle', 'uptown', 'sloan lake', 'berkeley', 'platt park', 'jefferson park', 'aurora', 'lakewood', 'littleton', 'englewood', 'arvada', 'westminster', 'thornton', 'centennial', 'parker', 'castle rock', 'boulder', 'fort collins', 'gaylord rockies', 'dmns', 'denver museum', 'denver airport', 'dia', 'denver international', 'nuggets', 'broncos', 'rockies', 'avalanche', 'ball arena', 'empower field', 'havana', 'federal', 'colfax', '16th street', 'larimer', 'tennyson', 'south pearl', 'santa fe'];

const NEIGHBORHOOD_KEYWORDS = {
  rino: ['rino', 'river north', 'art district', 'larimer street', 'walnut street'],
  lodo: ['lodo', 'lower downtown', 'union station', 'coors field', '16th street mall', 'larimer square', 'dairy block'],
  'capitol-hill': ['capitol hill', 'cap hill', 'colfax', 'cheesman park', 'congress park'],
  highlands: ['highlands', 'lohi', 'lo-hi', 'tennyson', '32nd avenue'],
  'cherry-creek': ['cherry creek', 'fillmore', 'steele street'],
  'washington-park': ['washington park', 'wash park', 'south gaylord', 'old south pearl'],
  'five-points': ['five points', 'welton'],
  baker: ['baker', 'south broadway', 'sobo', 'antique row'],
  'golden-triangle': ['golden triangle', 'santa fe', 'art museum'],
  uptown: ['uptown denver', '17th avenue', 'restaurant row'],
  'sloan-lake': ['sloan lake', 'edgewater', 'sheridan'],
  berkeley: ['tennyson street', 'berkeley denver', '44th avenue'],
  'platt-park': ['platt park', 'south pearl', 'pearl street'],
  'jefferson-park': ['jefferson park', 'jeff park', '29th avenue'],
  airport: ['denver airport', 'dia', 'denver international', 'blucifer', 'united club', 'concourse'],
  downtown: ['downtown denver', '16th street', 'civic center', 'union station'],
  suburbs: ['aurora', 'lakewood', 'littleton', 'englewood', 'arvada', 'westminster', 'thornton', 'centennial', 'parker', 'castle rock', 'gaylord rockies', 'broomfield'],
};

const CATEGORY_KEYWORDS = {
  restaurants: ['restaurant', 'food', 'eat', 'dining', 'brunch', 'lunch', 'dinner', 'taco', 'burger', 'pizza', 'sushi', 'chef', 'menu', 'foodie', 'noodle', 'ramen', 'bbq', 'barbecue', 'dim sum', 'omakase', 'chicken', 'donuts', 'ice cream', 'cone', 'korean', 'japanese', 'chinese', 'mexican', 'italian', 'thai', 'vietnamese', 'green chile', 'hand-pulled', 'crispy', 'kimchi', 'robot', 'shark tank', 'classic', 'hidden', 'secret', 'best', 'new restaurant', 'worth trying', 'favorite', 'newcomer'],
  hotels: ['hotel', 'stay', 'where to stay', 'accommodation', 'resort', 'gaylord', 'lounge', 'club lounge', 'castle hotel', 'full tour'],
  bars: ['bar', 'drink', 'cocktail', 'beer', 'brewery', 'nightlife', 'happy hour', 'whiskey', 'wine'],
  'things-to-do': ['things to do', 'activity', 'attraction', 'visit', 'explore', 'hike', 'park', 'museum', 'concert', 'event', 'experience', 'immersive', 'lego', 'bricks', 'dinos', 'dinosaur', 'titanic', 'ice castle', 'ice slide', 'mini golf', 'pickleball', 'basketball', 'nuggets', 'broncos', 'rockies', 'night market', 'festival', 'holiday market', 'christmas', 'holiday', 'railroad', 'vr', 'virtual reality', 'tunnels', 'underground', 'airport tour', 'opening night', 'worth the drive', 'fun or flop'],
  coffee: ['coffee', 'cafe', 'espresso', 'latte', 'cappuccino', 'roaster'],
};

function scoreText(text, keywords) {
  const lower = text.toLowerCase();
  return keywords.reduce((score, kw) => score + (lower.includes(kw) ? 1 : 0), 0);
}

function isDenverContent(text) {
  const lower = text.toLowerCase();
  return DENVER_KEYWORDS.some(kw => lower.includes(kw));
}

async function run() {
  const { data: videos } = await supabase
    .from('youtube_videos')
    .select('video_id, title, description, tags');

  let total = 0;
  for (const video of videos) {
    const searchText = [video.title, video.description ?? '', ...(video.tags ?? [])].join(' ');
    if (!isDenverContent(searchText)) continue;

    const neighborhoodMatches = [];
    for (const [slug, keywords] of Object.entries(NEIGHBORHOOD_KEYWORDS)) {
      const score = scoreText(searchText, keywords);
      if (score > 0) neighborhoodMatches.push({ slug, score });
    }

    const categoryMatches = [];
    for (const [slug, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
      const score = scoreText(searchText, keywords);
      if (score > 0) categoryMatches.push({ slug, score });
    }

    const associations = [];
    if (neighborhoodMatches.length > 0 && categoryMatches.length > 0) {
      for (const n of neighborhoodMatches) {
        for (const c of categoryMatches) {
          associations.push({ video_id: video.video_id, neighborhood_slug: n.slug, category_slug: c.slug, relevance_score: n.score + c.score });
        }
      }
    } else if (neighborhoodMatches.length > 0) {
      for (const n of neighborhoodMatches) {
        associations.push({ video_id: video.video_id, neighborhood_slug: n.slug, category_slug: null, relevance_score: n.score });
      }
    } else if (categoryMatches.length > 0) {
      for (const c of categoryMatches) {
        associations.push({ video_id: video.video_id, neighborhood_slug: 'downtown', category_slug: c.slug, relevance_score: c.score });
      }
    } else {
      associations.push({ video_id: video.video_id, neighborhood_slug: 'downtown', category_slug: 'things-to-do', relevance_score: 0.5 });
    }

    if (associations.length > 0) {
      await supabase.from('video_page_associations').upsert(associations, { onConflict: 'video_id,neighborhood_slug,category_slug' });
      total += associations.length;
    }
  }
  console.log('Total associations created:', total);
}
run();

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function run() {
  const { data } = await supabase
    .from('articles')
    .select('slug, title, content_type, places_mentioned, youtube_videos(thumbnail_url)')
    .order('generated_at', { ascending: false })
    .limit(4);
  data?.forEach(a => {
    console.log(a.title.slice(0, 40));
    console.log('  youtube thumb:', !!a.youtube_videos?.thumbnail_url);
    console.log('  places_mentioned:', a.places_mentioned?.length ?? 0);
    console.log('  photo_url:', a.places_mentioned?.[0]?.photo_url?.slice(0, 30) ?? 'none');
  });
}
run();

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function run() {
  const { data } = await supabase
    .from('articles')
    .select('content_type, places_mentioned')
    .eq('content_type', 'roundup')
    .single();
  console.log('content_type:', data.content_type);
  console.log('places_mentioned type:', typeof data.places_mentioned);
  console.log('places_mentioned:', JSON.stringify(data.places_mentioned));
  console.log('photo_url:', data.places_mentioned?.[0]?.photo_url?.slice(0, 30));
}
run();

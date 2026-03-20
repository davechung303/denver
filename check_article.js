const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function run() {
  const { data } = await supabase.from('articles').select('content, places_mentioned').eq('content_type', 'roundup').single();
  console.log('Photo exists:', !!data.places_mentioned?.[0]?.photo_url);
  console.log(data.content.slice(0, 1500));
}
run();

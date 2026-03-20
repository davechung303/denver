const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function run() {
  const { data } = await supabase
    .from('articles')
    .select('places_mentioned')
    .eq('content_type', 'roundup')
    .single();
  console.log('Count:', data.places_mentioned?.length);
  console.log(JSON.stringify(data.places_mentioned, null, 2));
}
run();

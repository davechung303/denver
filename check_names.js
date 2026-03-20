const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function run() {
  const { data } = await supabase
    .from('articles')
    .select('content')
    .eq('content_type', 'roundup')
    .single();
  const names = [...data.content.matchAll(/^## ([^\u2014\n]+)/gm)]
    .map(m => m[1].trim())
    .filter(n => !n.toLowerCase().includes("worth keeping") && !n.toLowerCase().includes("pick of") && !n.toLowerCase().includes("opening in denver"));
  console.log('Restaurant names extracted:', names);
}
run();

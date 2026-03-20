const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function run() {
  try {
    const { generateArticle } = await import('./src/lib/articles.ts');
    const result = await generateArticle('-kzuYPaY1bk');
    console.log('Result:', JSON.stringify(result, null, 2));
  } catch (err) {
    console.error('Error:', err.message);
    console.error(err.stack);
  }
}
run();

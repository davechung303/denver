const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function fetchArticle(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; DaveLovesDenver/1.0)', 'Accept': 'text/html' }
  });
  const html = await res.text();
  // Strip tags
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
  console.log('---ARTICLE TEXT SAMPLE---');
  console.log(text.slice(0, 3000));
}

fetchArticle('https://www.westword.com/food-drink/colfax-mediterranean-bar-restaurant-debuts-in-former-rockbar-40858211/');

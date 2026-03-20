async function run() {
  const res = await fetch('https://www.westword.com/food-drink/colfax-dim-sim-spot-expands-and-more-new-denver-restaurants-40856391/', {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; DaveLovesDenver/1.0)' }
  });
  const html = await res.text();

  const pattern = /class="article-content"[^>]*>([\s\S]*?)<div class="article-related/i;
  const match = html.match(pattern);
  if (!match) { console.log('No match'); return; }

  const text = match[1].replace(/<[^>]+>/g, ' ').replace(/\s{2,}/g, ' ').trim();
  console.log('Full length:', text.length);
  console.log('\nLAST 1000 CHARS:');
  console.log(text.slice(-1000));
}
run();

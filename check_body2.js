async function run() {
  const res = await fetch('https://www.westword.com/food-drink/colfax-dim-sim-spot-expands-and-more-new-denver-restaurants-40856391/', {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; DaveLovesDenver/1.0)' }
  });
  const html = await res.text();

  const bodyPatterns = [
    /class="article-content"[^>]*>([\s\S]*?)<div class="article-related/i,
    /class="article-content "[^>]*>([\s\S]*?)<div class="article-related/i,
    /class="article-content"[^>]*>([\s\S]*?)<div class="article-author/i,
  ];

  let bodyHtml = "";
  for (const pattern of bodyPatterns) {
    const match = html.match(pattern);
    if (match) { bodyHtml = match[1]; console.log('Pattern matched!'); break; }
  }

  if (!bodyHtml) { console.log('No match'); return; }

  const text = bodyHtml.replace(/<[^>]+>/g, ' ').replace(/\s{2,}/g, ' ').trim();
  console.log(text.slice(0, 5000));
}
run();

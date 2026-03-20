async function run() {
  const res = await fetch('https://www.westword.com/food-drink/colfax-dim-sim-spot-expands-and-more-new-denver-restaurants-40856391/', {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; DaveLovesDenver/1.0)' }
  });
  const html = await res.text();
  // Find article-related then look for the address list after it
  const idx = html.indexOf('article-related');
  if (idx > -1) {
    const after = html.slice(idx, idx + 5000);
    const text = after.replace(/<[^>]+>/g, ' ').replace(/\s{2,}/g, ' ').trim();
    console.log(text.slice(0, 2000));
  }
}
run();

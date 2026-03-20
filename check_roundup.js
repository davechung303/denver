async function run() {
  const res = await fetch('https://www.westword.com/food-drink/colfax-dim-sim-spot-expands-and-more-new-denver-restaurants-40856391/', {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; DaveLovesDenver/1.0)' }
  });
  const html = await res.text();
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s{2,}/g, ' ');
  // Find the openings section
  const idx = text.indexOf('Opening');
  if (idx > -1) console.log(text.slice(idx, idx + 1000));
}
run();

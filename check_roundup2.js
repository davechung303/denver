async function run() {
  const res = await fetch('https://www.westword.com/food-drink/colfax-dim-sim-spot-expands-and-more-new-denver-restaurants-40856391/', {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; DaveLovesDenver/1.0)' }
  });
  const html = await res.text();
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s{2,}/g, ' ');
  // Search for the structured list
  const patterns = ['Openings\n', 'Openings ', 'New openings', 'opened this week'];
  for (const p of patterns) {
    const idx = text.indexOf(p);
    if (idx > -1) {
      console.log('Found:', p, 'at index', idx);
      console.log(text.slice(idx, idx + 800));
      break;
    }
  }
  // Also search for street addresses
  const addrIdx = text.search(/\d{3,5}\s+[A-Z]/);
  if (addrIdx > -1) console.log('\nFirst address found:', text.slice(addrIdx - 20, addrIdx + 100));
}
run();

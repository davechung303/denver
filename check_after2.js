async function run() {
  const res = await fetch('https://www.westword.com/food-drink/colfax-dim-sim-spot-expands-and-more-new-denver-restaurants-40856391/', {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; DaveLovesDenver/1.0)' }
  });
  const html = await res.text();
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s{2,}/g, ' ');
  // Find "Openings" followed by restaurant names and addresses
  const idx = text.search(/\bOpenings\b[^&]/);
  if (idx > -1) {
    console.log('Found Openings at:', idx);
    console.log(text.slice(idx, idx + 1500));
  } else {
    console.log('Not found, trying Fat Sullys...');
    const idx2 = text.indexOf("Fat Sully");
    if (idx2 > -1) console.log(text.slice(idx2, idx2 + 1500));
  }
}
run();

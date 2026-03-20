async function run() {
  const res = await fetch('https://www.westword.com/food-drink/colfax-dim-sim-spot-expands-and-more-new-denver-restaurants-40856391/', {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; DaveLovesDenver/1.0)' }
  });
  const html = await res.text();
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s{2,}/g, ' ');
  console.log('Total text length:', text.length);
  // Search from the end of the text where the list usually is
  const last5000 = text.slice(-5000);
  console.log('\nLAST 5000 CHARS:');
  console.log(last5000);
}
run();

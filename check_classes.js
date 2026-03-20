async function run() {
  const res = await fetch('https://www.westword.com/food-drink/colfax-dim-sim-spot-expands-and-more-new-denver-restaurants-40856391/', {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; DaveLovesDenver/1.0)' }
  });
  const html = await res.text();
  // Find all div classes that might be article body
  const matches = html.match(/class="[^"]*(?:content|body|article|post|entry)[^"]*"/gi);
  const unique = [...new Set(matches)];
  unique.slice(0, 20).forEach(m => console.log(m));
}
run();

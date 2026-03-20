require('dotenv').config({ path: '.env.local' });
async function run() {
  const names = ['FiNO', 'Chicken Riot', 'The Capital Grille'];
  for (const name of names) {
    const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': process.env.GOOGLE_PLACES_API_KEY,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.rating',
      },
      body: JSON.stringify({ textQuery: name + ' Denver Colorado', maxResultCount: 1 }),
    });
    const data = await res.json();
    const place = data.places?.[0];
    console.log(name, '->', place ? place.displayName?.text + ' | ' + place.id : 'NOT FOUND');
  }
}
run();

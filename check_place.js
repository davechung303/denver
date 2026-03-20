require('dotenv').config({ path: '.env.local' });
async function run() {
  const res = await fetch('https://places.googleapis.com/v1/places/ChIJR1G1bHF_bIcR_XjqR-LlVuk', {
    headers: {
      'X-Goog-Api-Key': process.env.GOOGLE_PLACES_API_KEY,
      'X-Goog-FieldMask': 'displayName,photos'
    }
  });
  const data = await res.json();
  console.log('Place name:', data.displayName?.text);
  console.log('Number of photos:', data.photos?.length);
}
run();

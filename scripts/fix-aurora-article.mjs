import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

// Load env
const env = readFileSync(".env.local", "utf8");
for (const line of env.split("\n")) {
  const [k, ...v] = line.split("=");
  if (k && v.length) process.env[k.trim()] = v.join("=").trim();
}

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const videoContent = `
VIDEO TITLE: Best Hidden Gem Restaurants in Aurora, Colorado
VIDEO DESCRIPTION: Aurora has some of the most underrated ethnic restaurants in the Denver metro. In this video Dave visits 8 hidden gems most Denverites have never heard of. Sponsored by Havana Street Night Market.

PLACES IN THIS VIDEO (these are the ONLY places to mention):

1. Royal Taw Win Thai & Burmese Restaurant
   Located just outside Lowry on Yosemite Street. Low-key Thai and Burmese spot. Best papaya salads in the area, incredibly flavorful noodle dishes with heavy heat. Rating: 4.8 stars.

2. Woo Ri Korean Restaurant
   Hidden far back in a strip mall on South Parker Road, sharing a parking lot with Golden Banh Mi. Tiny, authentic Korean spot with limited seating. Excellent house-made kimchi. Staples: kimchi jjigae, sundubu jjigae, bibimbap. Rating: 4.8 stars. $10-$20.

3. Havana Street Night Market (video sponsor)
   An outdoor community market event hosted by the On Havana Street Business Improvement District and Bonfire Event Co. Takes place in the parking lot of Tokoyo (formerly Izakaya Tokoyo) at the corner of Havana and Yale. 6 PM to 10 PM on the last Saturday of the month, May through September.

4. Cafe Paprika
   Family-run Moroccan and Mediterranean restaurant on East Mississippi Avenue, open for roughly 30 years. Featured dishes: Bastilla (sweet and savory meat pie in flaky pastry topped with cinnamon and sugar), massive plates of Tajine over couscous. Rating: 4.6 stars. $10-$20.

5. Bajeko Sekuwa Nepalese & Indian Cuisine
   Located on East Iliff Avenue in a large, currently signless building. Nepal-based chain. Featured dishes: Chicken Dal Bhat, Nepali chicken chow mein, traditional goat dishes. Rating: 4.6 stars.

6. ALPACA CHASQUI Charbroiled Chicken & coffee
   Located on East Iliff Avenue. Looks like a boba or coffee shop from the outside. Specializes in Peruvian-style rotisserie chicken, ceviche, lomo saltado, and Inca Kola. Rating: 4.6 stars. $10-$50.

7. Il Forno di Tutti
   Cozy 25-seat Italian restaurant on South Havana Street. Chef previously worked at Parisi on Tennyson. Focus on fresh handmade Northern Italian pasta and fresh bread. Rating: 4.8 stars. $20-$30.

8. Urban Burma
   Burmese food stall inside Mango House on East Colfax Avenue — a community space and food hall for refugees and immigrants. Featured dishes: Shan Noodles (spiced chicken broth noodle soup), paratha. Rating: 4.8 stars. $10-$20.
`;

const prompt = `You are writing a local Denver article for DaveLovesDenver.com, written in the first person as Dave Chung — a Denver local and YouTube creator with 6.5 million views across YouTube and TikTok.

=== DAVE'S VOICE ===

TONE: Conversational and direct. Like texting a knowledgeable friend. Measured enthusiasm — "pretty cool", "worth the drive", "legitimately good". Never "absolutely incredible" or "must-visit". Specific — real streets, real dishes, real context. Mentions downsides naturally.

BANNED PHRASES:
- "Look, I..." as opener, "I'll be honest", "though" as qualifier
- "calibrated", "elevated", "curated", "intentional", "offerings", "fare"
- "This is the kind of place where...", "you're gonna want to"
- "nestled", "boasts", "vibrant", "culinary journey", "gastronomic", "bustling", "gem"
- "truly", "absolutely" as generic intensifiers

=== CONTENT ===

${videoContent}

=== WRITING INSTRUCTIONS ===

Write a 1,000-1,300 word article about these 8 Aurora spots. ONLY mention the businesses listed above — do not add any other restaurants, businesses, or places.

- Open with Dave's take on why Aurora's food scene is underrated and worth the drive
- For each place: ## header with exact business name, 2-4 sentences on what makes it worth going and what to get
- For Havana Street Night Market: note it's the video sponsor, explain what it is (outdoor event, not a restaurant), give the logistics (location, dates, hours)
- Close with a short paragraph on the overall Aurora food landscape

CRITICAL RULES:
- First person as Dave throughout
- ONLY the 8 places above — exact name spellings
- Do not invent details not in the content above
- Use ## headers for each place
- No bullet points

Output format:
TITLE: {SEO title, 55-70 chars, plain language}

{article body}`;

const message = await anthropic.messages.create({
  model: "claude-sonnet-4-6",
  max_tokens: 2500,
  messages: [{ role: "user", content: prompt }],
});

const raw = message.content[0].text.trim();
const titleMatch = raw.match(/^TITLE:\s*(.+)/m);
const seoTitle = titleMatch ? titleMatch[1].trim() : "Best Hidden Gem Restaurants in Aurora, Colorado";
const articleText = raw.replace(/^TITLE:.*\n\n?/m, "").trim();

console.log("TITLE:", seoTitle);
console.log("LENGTH:", articleText.length);
console.log("PREVIEW:\n", articleText.slice(0, 400));

// Delete old hallucinated article
await db.from("articles").delete().eq("video_id", "Zp66Pfg-ZqM");

const { error } = await db.from("articles").insert({
  video_id: "Zp66Pfg-ZqM",
  slug: "best-hidden-gem-restaurants-in-aurora-colorado",
  title: seoTitle,
  content: articleText,
  content_type: "guide",
  neighborhood_slug: "denver-suburbs",
  category_slug: "restaurants",
  expedia_url: null,
  places_mentioned: [
    "Royal Taw Win Thai & Burmese Restaurant",
    "Woo Ri Korean Restaurant",
    "Havana Street Night Market",
    "Cafe Paprika",
    "Bajeko Sekuwa Nepalese & Indian Cuisine",
    "ALPACA CHASQUI Charbroiled Chicken & coffee",
    "Il Forno di Tutti",
    "Urban Burma",
  ],
  generated_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
});

if (error) console.error("Save error:", error.message);
else console.log("\nSAVED SUCCESSFULLY to slug: best-hidden-gem-restaurants-in-aurora-colorado");

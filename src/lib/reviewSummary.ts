import Anthropic from "@anthropic-ai/sdk";
import type { GoogleReview } from "./places";

export interface ReviewSummary {
  consensus: string;
  highlights: string[];
  lowlights: string[];
  popular_dishes?: string[];
}

const FOOD_CATEGORIES = new Set(["restaurants", "bars", "coffee"]);

export async function generateReviewSummary(
  placeName: string,
  reviews: GoogleReview[],
  categorySlug?: string
): Promise<ReviewSummary | null> {
  if (!reviews || reviews.length === 0) return null;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  const reviewText = reviews
    .filter((r) => r.text?.text && r.text.text.length > 20)
    .map((r) => `${r.rating}/5 — "${r.text!.text}"`)
    .join("\n\n");

  if (!reviewText) return null;

  const isFood = categorySlug ? FOOD_CATEGORIES.has(categorySlug) : false;
  const client = new Anthropic({ apiKey });

  const dishesField = isFood
    ? `\n  "popular_dishes": ["dish or drink name people mentioned", "another one"]`
    : "";

  const dishesRule = isFood
    ? `\n- popular_dishes: extract 2-4 specific food or drink items reviewers actually named (e.g. "green chile burger", "lavender latte") — not generic terms like "the food" or "the drinks"`
    : "";

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 500,
      messages: [
        {
          role: "user",
          content: `You're Dave — a Denver local and the voice behind Dave Loves Denver. You know this city inside out and give it to people straight. Based on these Google reviews for ${placeName}, write a quick summary in your voice. Honest, specific, like you're texting a friend who asked where to go.

Return ONLY valid JSON, no markdown, no explanation:
{
  "consensus": "One punchy sentence — your honest take on the place",
  "highlights": ["specific thing people love", "another concrete highlight"],
  "lowlights": ["honest caveat or criticism"]${dishesField}
}

Rules:
- consensus must be specific (not "great spot" — tell them WHY it's great, or what makes it worth the trip)
- highlights and lowlights should be pulled from what reviewers actually mentioned, not generic
- lowlights can be [] if reviews are overwhelmingly positive
- Keep each item to one sentence max
- Sound like a local who's been there, not a press release${dishesRule}

Reviews for ${placeName}:
${reviewText}`,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== "text") return null;

    const parsed = JSON.parse(content.text) as ReviewSummary;
    // Validate shape
    if (
      typeof parsed.consensus !== "string" ||
      !Array.isArray(parsed.highlights) ||
      !Array.isArray(parsed.lowlights)
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

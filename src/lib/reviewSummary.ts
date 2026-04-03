import Anthropic from "@anthropic-ai/sdk";
import type { GoogleReview } from "./places";

export interface ReviewSummary {
  consensus: string;
  highlights: string[];
  lowlights: string[];
  popular_dishes?: string[];
  tagline?: string; // 5-7 word descriptor shown on listing cards
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
          content: `Summarize the following Google reviews for ${placeName} into a helpful "Things to Know" section for travelers.

Return ONLY valid JSON, no markdown, no explanation:
{
  "tagline": "5-7 word hook specific to this place",
  "consensus": "One specific sentence capturing the overall vibe or standout quality of this place",
  "highlights": ["specific thing reviewers love", "another concrete positive"],
  "lowlights": ["honest caveat or criticism from reviews"]${dishesField}
}

Rules:
- tagline: exactly 5-7 words, lowercase, no period — a specific hook that makes someone want to click. Focus on what's unique: a signature dish, a view, a vibe, a standout feature. Examples: "wood-fired pizza with a perfect char", "rooftop views of the whole city", "best tonkotsu broth in Denver", "connected directly to the terminal"
- consensus should be specific and useful (not "great place" — say what makes it worth visiting)
- highlights and lowlights must come from what reviewers actually said, not generic observations
- lowlights can be [] if reviews are overwhelmingly positive
- Keep each item to one clear sentence
- Write in plain, helpful language — like a well-informed local tip${dishesRule}

Reviews for ${placeName}:
${reviewText}`,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== "text") return null;

    // Strip markdown code fences if Claude wraps the JSON
    let raw = content.text.trim();
    if (raw.startsWith("```")) {
      raw = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
    }

    const parsed = JSON.parse(raw) as ReviewSummary;
    // Validate shape
    if (
      typeof parsed.consensus !== "string" ||
      !Array.isArray(parsed.highlights) ||
      !Array.isArray(parsed.lowlights) ||
      (parsed.tagline !== undefined && typeof parsed.tagline !== "string")
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

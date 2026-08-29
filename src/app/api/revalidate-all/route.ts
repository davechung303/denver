import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { NEIGHBORHOODS, CATEGORIES } from "@/lib/neighborhoods";

// Static one-off routes. ISR cache survives a deploy, so anything whose copy
// changed has to be revalidated explicitly or it keeps serving the old build.
const HOTEL_PAGES = [
  "great-american-beer-festival", "best-value-denver", "near-anschutz", "near-ball-arena", "near-botanic-gardens",
  "near-cherry-creek", "near-city-park", "near-convention-center", "near-coors-field",
  "near-denver-airport", "near-denver-zoo", "near-elitch-gardens", "near-empower-field",
  "near-fiddlers-green", "near-mission-ballroom", "near-national-western", "near-red-rocks",
];
const EVENT_PAGES = [
  "ball-arena", "coors-field", "dicks-sporting-goods-park", "empower-field",
  "fiddlers-green", "mission-ballroom", "ogden-theatre", "paramount-theatre", "red-rocks",
];

export async function GET(req: Request) {
  const auth = req.headers.get("Authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  revalidatePath("/");
  revalidatePath("/denver");
  revalidatePath("/denver/hidden-gems");
  revalidatePath("/denver/experiences");
  revalidatePath("/denver/best-things-to-do");
  revalidatePath("/denver/where-to-stay");
  revalidatePath("/denver/best-steakhouses");
  revalidatePath("/denver/best-pizza");
  revalidatePath("/denver/best-sushi");
  revalidatePath("/denver/best-burgers");
  revalidatePath("/denver/best-bars");
  revalidatePath("/denver/best-coffee");
  revalidatePath("/denver/best-mexican-food");
  revalidatePath("/denver/for-foodies");
  revalidatePath("/denver/airport-train");
  revalidatePath("/denver/hotel-costs");
  revalidatePath("/denver/altitude");
  revalidatePath("/denver/denver-airport-shuttle");
  revalidatePath("/denver/red-rocks-shuttle");
  revalidatePath("/denver/coors-field-parking");
  revalidatePath("/denver/things-to-do");
  revalidatePath("/hotels");
  for (const slug of HOTEL_PAGES) revalidatePath(`/hotels/${slug}`);
  for (const slug of EVENT_PAGES) revalidatePath(`/events/${slug}`);
  revalidatePath("/articles");
  revalidatePath("/articles/[slug]", "page");
  revalidatePath("/videos");
  revalidatePath("/events");
  for (const n of NEIGHBORHOODS) {
    revalidatePath(`/denver/${n.slug}`);
    for (const c of CATEGORIES) {
      revalidatePath(`/denver/${n.slug}/${c.slug}`);
      // Revalidate all place detail pages under this neighborhood+category
      revalidatePath(`/denver/${n.slug}/${c.slug}/[slug]`, "page");
    }
  }

  return NextResponse.json({ ok: true });
}

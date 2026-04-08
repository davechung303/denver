import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { NEIGHBORHOODS, CATEGORIES } from "@/lib/neighborhoods";

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

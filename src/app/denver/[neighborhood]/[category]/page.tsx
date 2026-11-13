import type { Metadata } from "next";
import { NEIGHBORHOODS, CATEGORIES } from "@/lib/neighborhoods";
import { CategoryView, categoryMetadata } from "./categoryView";

export const revalidate = 86400; // ISR: revalidate daily — picks up fresh photo names after monthly refresh
export const dynamicParams = true; // still render unknown combinations on-demand

export function generateStaticParams() {
  return NEIGHBORHOODS.flatMap((n) =>
    CATEGORIES.map((c) => ({ neighborhood: n.slug, category: c.slug }))
  );
}

interface Props {
  params: Promise<{ neighborhood: string; category: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { neighborhood, category } = await params;
  return categoryMetadata(neighborhood, category, 1);
}

export default async function CategoryPage({ params }: Props) {
  const { neighborhood, category } = await params;
  return <CategoryView nSlug={neighborhood} cSlug={category} page={1} />;
}

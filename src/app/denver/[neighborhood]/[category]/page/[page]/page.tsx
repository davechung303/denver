import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { CategoryView, categoryMetadata } from "../../categoryView";

// Pages 2+ of a category list. Rendered on demand and cached like page 1;
// an out-of-range page 404s from inside the view.
export const revalidate = 86400;
export const dynamicParams = true;

interface Props {
  params: Promise<{ neighborhood: string; category: string; page: string }>;
}

function parsePage(raw: string, nSlug: string, cSlug: string): number {
  if (!/^\d+$/.test(raw)) notFound();
  const n = Number(raw);
  // /page/1 duplicates the main list; send it there.
  if (n <= 1) permanentRedirect(`/denver/${nSlug}/${cSlug}`);
  return n;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { neighborhood, category, page } = await params;
  return categoryMetadata(neighborhood, category, parsePage(page, neighborhood, category));
}

export default async function CategoryPageN({ params }: Props) {
  const { neighborhood, category, page } = await params;
  return <CategoryView nSlug={neighborhood} cSlug={category} page={parsePage(page, neighborhood, category)} />;
}

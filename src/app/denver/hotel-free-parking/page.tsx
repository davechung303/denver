import type { Metadata } from "next";
import GuideArticle from "@/components/GuideArticle";
import { GUIDES } from "@/lib/guides";
import { fitTitle, fitDescription } from "@/lib/seo";

const guide = GUIDES["hotel-free-parking"];

export const revalidate = 86400;

export const metadata: Metadata = {
  title: fitTitle(guide.metaTitle),
  description: fitDescription(guide.metaDescription),
  alternates: { canonical: "https://davelovesdenver.com/denver/hotel-free-parking" },
  openGraph: {
    title: guide.ogTitle,
    description: guide.ogDescription,
    url: "https://davelovesdenver.com/denver/hotel-free-parking",
    type: "article",
    publishedTime: guide.updated,
    modifiedTime: guide.updated,
  },
};

export default function Page() {
  return <GuideArticle guide={guide} />;
}

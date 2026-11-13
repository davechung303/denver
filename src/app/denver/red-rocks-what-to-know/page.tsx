import type { Metadata } from "next";
import GuideArticle from "@/components/GuideArticle";
import { GUIDES } from "@/lib/guides";
import { fitTitle, fitDescription } from "@/lib/seo";

const guide = GUIDES["red-rocks-what-to-know"];

export const revalidate = 86400;

export const metadata: Metadata = {
  title: fitTitle(guide.metaTitle),
  description: fitDescription(guide.metaDescription),
  alternates: { canonical: "https://davelovesdenver.com/denver/red-rocks-what-to-know" },
  openGraph: {
    title: guide.ogTitle,
    description: guide.ogDescription,
    url: "https://davelovesdenver.com/denver/red-rocks-what-to-know",
    type: "article",
    publishedTime: guide.updated,
    modifiedTime: guide.updated,
  },
};

export default function Page() {
  return <GuideArticle guide={guide} />;
}

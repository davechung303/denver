import type { Metadata } from "next";
import GuideArticle from "@/components/GuideArticle";
import { GUIDES } from "@/lib/guides";
import { fitTitle, fitDescription } from "@/lib/seo";

const guide = GUIDES["pet-friendly-hotels"];

export const revalidate = 86400;

export const metadata: Metadata = {
  title: fitTitle(guide.metaTitle),
  description: fitDescription(guide.metaDescription),
  alternates: { canonical: "https://davelovesdenver.com/denver/pet-friendly-hotels" },
  openGraph: {
    title: guide.ogTitle,
    description: guide.ogDescription,
    url: "https://davelovesdenver.com/denver/pet-friendly-hotels",
    type: "article",
    publishedTime: guide.updated,
    modifiedTime: guide.updated,
    authors: ["Dave Chung"],
  },
  twitter: { card: "summary_large_image", title: guide.ogTitle, description: guide.ogDescription },
};

export default function Page() {
  return <GuideArticle guide={guide} />;
}

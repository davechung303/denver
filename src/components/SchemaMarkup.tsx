interface BreadcrumbItem {
  name: string;
  url: string;
}

interface VideoItem {
  name: string;
  description: string | null;
  thumbnailUrl: string | null;
  uploadDate: string | null;
  videoId: string;
}

interface ArticleItem {
  title: string;
  slug: string;
  publishedAt: string | null;
  updatedAt: string;
  imageUrl?: string | null;
  description?: string;
}

interface ListItem {
  name: string;
  url: string;
}

interface Props {
  breadcrumbs?: BreadcrumbItem[];
  videos?: VideoItem[];
  websiteSearch?: boolean;
  article?: ArticleItem;
  itemLists?: { name: string; description?: string; items: ListItem[] }[];
}

const DAVE_PERSON = {
  "@type": "Person",
  name: "Dave Chung",
  url: "https://davelovesdenver.com/about",
  sameAs: [
    "https://www.youtube.com/@davechung",
    "https://davelovesdenver.com/about",
  ],
};

export default function SchemaMarkup({ breadcrumbs, videos, websiteSearch, article, itemLists }: Props) {
  const schemas: object[] = [];

  // WebSite schema with sitelinks searchbox
  if (websiteSearch) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Dave Loves Denver",
      url: "https://davelovesdenver.com",
      description: "A hyperlocal guide to Denver's best neighborhoods, restaurants, hotels, bars, and things to do.",
    });
  }

  // BreadcrumbList schema
  if (breadcrumbs && breadcrumbs.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    });
  }

  // Article + Person schema
  if (article) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title,
      url: `https://davelovesdenver.com/articles/${article.slug}`,
      datePublished: article.publishedAt ?? article.updatedAt,
      dateModified: article.updatedAt,
      author: DAVE_PERSON,
      publisher: {
        "@type": "Organization",
        name: "Dave Loves Denver",
        url: "https://davelovesdenver.com",
        logo: {
          "@type": "ImageObject",
          url: "https://davelovesdenver.com/icon.png",
        },
      },
      ...(article.imageUrl ? { image: article.imageUrl } : {}),
      ...(article.description ? { description: article.description } : {}),
    });
  }

  // ItemList schemas (curated place lists)
  if (itemLists && itemLists.length > 0) {
    for (const list of itemLists) {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: list.name,
        ...(list.description ? { description: list.description } : {}),
        itemListElement: list.items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          url: `https://davelovesdenver.com${item.url}`,
        })),
      });
    }
  }

  // VideoObject schema
  if (videos && videos.length > 0) {
    for (const video of videos) {
      if (!video.thumbnailUrl) continue;
      schemas.push({
        "@context": "https://schema.org",
        "@type": "VideoObject",
        name: video.name,
        description: video.description ?? video.name,
        thumbnailUrl: video.thumbnailUrl,
        uploadDate: video.uploadDate,
        embedUrl: `https://www.youtube.com/embed/${video.videoId}`,
        url: `https://www.youtube.com/watch?v=${video.videoId}`,
        publisher: {
          "@type": "Person",
          name: "Dave Chung",
          url: "https://davelovesdenver.com/about",
        },
      });
    }
  }

  if (schemas.length === 0) return null;

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}

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

interface Props {
  breadcrumbs?: BreadcrumbItem[];
  videos?: VideoItem[];
  websiteSearch?: boolean;
}

export default function SchemaMarkup({ breadcrumbs, videos, websiteSearch }: Props) {
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

"use client";

interface Props {
  src: string;
  rawSrc?: string;     // YouTube hqdefault fallback
  fallbackSrc?: string; // last-resort image (e.g. Unsplash Denver)
  alt: string;
  className?: string;
}

export default function ArticleThumb({ src, rawSrc, fallbackSrc, alt, className }: Props) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={(e) => {
        const img = e.target as HTMLImageElement;
        if (rawSrc && img.src !== rawSrc) {
          img.src = rawSrc;
        } else if (fallbackSrc && img.src !== fallbackSrc) {
          img.src = fallbackSrc;
        } else {
          img.style.display = "none";
        }
      }}
    />
  );
}

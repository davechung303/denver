"use client";

interface Props {
  src: string;
  rawSrc?: string; // optional fallback (YouTube hqdefault)
  alt: string;
  className?: string;
}

export default function ArticleThumb({ src, rawSrc, alt, className }: Props) {
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
        } else {
          // Hide the image and its container if everything fails
          img.style.display = "none";
        }
      }}
    />
  );
}

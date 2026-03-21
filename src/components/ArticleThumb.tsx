"use client";

interface Props {
  src: string;
  rawSrc: string; // original hqdefault to fall back to
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
        if ((e.target as HTMLImageElement).src !== rawSrc) {
          (e.target as HTMLImageElement).src = rawSrc;
        }
      }}
    />
  );
}

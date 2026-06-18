"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Prefetch internal routes on hover — same technique as instant.page / Flying Pages.
// Calls Next.js router.prefetch() so the JS bundle + RSC payload are already warm
// by the time the user clicks, making navigation feel instant.
export default function PrefetchOnHover() {
  const router = useRouter();

  useEffect(() => {
    const prefetched = new Set<string>();

    const handleMouseOver = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (
        !href ||
        prefetched.has(href) ||
        href.startsWith("http") ||
        href.startsWith("//") ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:")
      ) return;

      prefetched.add(href);
      router.prefetch(href);
    };

    document.addEventListener("mouseover", handleMouseOver);
    return () => document.removeEventListener("mouseover", handleMouseOver);
  }, [router]);

  return null;
}

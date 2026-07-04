"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function ProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [width, setWidth] = useState(0);
  const [visible, setVisible] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mountedRef = useRef(false); // skip completing on initial mount

  function start() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setVisible(true);
    setWidth(0);
    requestAnimationFrame(() => {
      setWidth(20);
      intervalRef.current = setInterval(() => {
        setWidth((w) => {
          if (w >= 85) {
            clearInterval(intervalRef.current!);
            return 85;
          }
          return w + (85 - w) * 0.1;
        });
      }, 150);
    });
  }

  function complete() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setWidth(100);
    setTimeout(() => {
      setVisible(false);
      setWidth(0);
    }, 350);
  }

  // Detect navigation start via click on internal links
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (
        !href ||
        href.startsWith("http") ||
        href.startsWith("//") ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:")
      ) return;
      start();
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  // Detect navigation complete via pathname change
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    complete();
  }, [pathname, searchParams]);

  if (!visible) return null;

  return (
    <div
      className="fixed top-0 left-0 z-[9999] h-[3px] bg-denver-amber shadow-[0_0_8px_rgba(245,158,11,0.6)]"
      style={{
        width: `${width}%`,
        transition: width === 100 ? "width 200ms ease-out" : "width 150ms ease-in-out",
      }}
    />
  );
}

"use client";

import { useEffect, useId, useRef, useState } from "react";

// Expedia Group "search" widget (stays + flights), rendered without the vendor
// eg-widgets.js loader. That script only scans the DOM inside a DOMContentLoaded
// handler and then latches window.eg.widgets.loaded, so on an App Router site it
// renders nothing after a client-side navigation. This builds the same iframe the
// vendor script builds and handles the same resize postMessage.
const WIDGET_ORIGIN = "https://creator.expediagroup.com";
const WIDGET_BASE = `${WIDGET_ORIGIN}/products/widgets`;
const CAMREF = "1101l5CLRx";

// The widget is designed for 375–575px and renders ~300px tall across that range,
// so reserve the height up front to avoid layout shift when the frame reports in.
const DEFAULT_HEIGHT = 300;

// How far outside the viewport the slot has to be before the frame is created.
const NEAR_VIEWPORT_PX = 400;

export default function ExpediaSearchWidget({
  pubref,
  className = "",
}: {
  /** Sub-ID reported to Expedia so revenue can be attributed to this placement. */
  pubref?: string;
  className?: string;
}) {
  // useId is stable across SSR and hydration, so the iframe src never mismatches.
  const instance = `dld${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const [height, setHeight] = useState(DEFAULT_HEIGHT);
  // The frame pulls in a full Expedia bundle, so hold it back until the slot is
  // close to the viewport — most of these bands sit well below the fold.
  const [visible, setVisible] = useState(false);
  const slotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!slotRef.current) return;
    let timer = 0;
    let done = false;
    // A plain rect check on a throttled timer, rather than IntersectionObserver or
    // rAF: both are suspended or throttled while the document is hidden, and a
    // booking unit that silently never mounts costs more than the bytes it saves.
    function check() {
      timer = 0;
      if (done || !slotRef.current) return;
      const rect = slotRef.current.getBoundingClientRect();
      // If the viewport can't be measured, show the unit rather than hide it.
      const viewportH = window.innerHeight || document.documentElement.clientHeight;
      if (!viewportH || (rect.top < viewportH + NEAR_VIEWPORT_PX && rect.bottom > -NEAR_VIEWPORT_PX)) {
        done = true;
        teardown();
        setVisible(true);
      }
    }
    function schedule() {
      if (!timer && !done) timer = window.setTimeout(check, 100);
    }
    function teardown() {
      if (timer) clearTimeout(timer);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    }
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    timer = window.setTimeout(check, 0);
    return teardown;
  }, []);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.origin !== WIDGET_ORIGIN) return;
      if (event.data?.type !== "eg-widget/resize") return;
      if (event.data?.meta?.instance !== instance) return;
      const next = parseInt(event.data?.payload?.frame?.style?.height ?? "", 10);
      if (Number.isFinite(next) && next > 0) setHeight(next);
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [instance]);

  const src =
    `${WIDGET_BASE}/search-widget?program=us-expedia&lobs=stays%2Cflights` +
    `&network=pz&camref=${CAMREF}` +
    (pubref ? `&pubref=${encodeURIComponent(pubref)}` : "") +
    `&instance=${instance}`;

  return (
    <div
      ref={slotRef}
      className={`w-full max-w-[575px] min-w-[300px] ${className}`}
      style={{ minHeight: DEFAULT_HEIGHT }}
    >
      {visible && (
        <iframe
          src={src}
          title="Search Denver hotels and flights on Expedia"
          loading="lazy"
          style={{ width: "100%", height: `${height}px`, border: "none", display: "block" }}
        />
      )}
    </div>
  );
}

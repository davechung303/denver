"use client";

import { useEffect } from "react";

interface Props {
  searchTerm: string;
}

const PARTNER_ID = "P00295470";
const WIDGET_REF = "W-b6df82c7-382c-458d-b12e-9eef0ec392c0";
const SCRIPT_SRC = "https://www.viator.com/orion/partner/widget.js";

// Module-level timer so multiple widgets on the same page share one debounced load
let reloadTimer: ReturnType<typeof setTimeout> | null = null;

function scheduleScriptReload() {
  if (reloadTimer) clearTimeout(reloadTimer);
  reloadTimer = setTimeout(() => {
    document.querySelectorAll(`script[data-viator]`).forEach((s) => s.remove());
    const script = document.createElement("script");
    script.src = `${SCRIPT_SRC}?t=${Date.now()}`;
    script.async = true;
    script.setAttribute("data-viator", "1");
    document.body.appendChild(script);
    reloadTimer = null;
  }, 150);
}

export default function ViatorWidget({ searchTerm }: Props) {
  useEffect(() => {
    scheduleScriptReload();
    return () => {
      if (reloadTimer) {
        clearTimeout(reloadTimer);
        reloadTimer = null;
      }
      document.querySelectorAll(`script[data-viator]`).forEach((s) => s.remove());
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      data-vi-partner-id={PARTNER_ID}
      data-vi-widget-ref={WIDGET_REF}
      data-vi-search-term={searchTerm}
    />
  );
}

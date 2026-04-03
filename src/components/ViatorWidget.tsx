"use client";

import { useEffect, useRef } from "react";

interface Props {
  searchTerm: string;
}

const PARTNER_ID = "P00295470";
const WIDGET_REF = "W-b6df82c7-382c-458d-b12e-9eef0ec392c0";
const SCRIPT_SRC = "https://www.viator.com/orion/partner/widget.js";

export default function ViatorWidget({ searchTerm }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear any previously rendered widget
    container.innerHTML = "";

    // Create a fresh div with the data attributes
    const widgetDiv = document.createElement("div");
    widgetDiv.setAttribute("data-vi-partner-id", PARTNER_ID);
    widgetDiv.setAttribute("data-vi-widget-ref", WIDGET_REF);
    widgetDiv.setAttribute("data-vi-search-term", searchTerm);
    container.appendChild(widgetDiv);

    // Remove any previously injected Viator script so it re-runs
    const existing = document.querySelector(`script[src="${SCRIPT_SRC}"]`);
    if (existing) existing.remove();

    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Clean up on unmount
      const s = document.querySelector(`script[src="${SCRIPT_SRC}"]`);
      if (s) s.remove();
    };
  }, [searchTerm]);

  return <div ref={containerRef} />;
}

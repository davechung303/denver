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

    // Clear any previously rendered widget content
    container.innerHTML = "";

    // Create a fresh div with the data attributes
    const widgetDiv = document.createElement("div");
    widgetDiv.setAttribute("data-vi-partner-id", PARTNER_ID);
    widgetDiv.setAttribute("data-vi-widget-ref", WIDGET_REF);
    widgetDiv.setAttribute("data-vi-search-term", searchTerm);
    container.appendChild(widgetDiv);

    // Remove any previously injected Viator script
    document.querySelectorAll(`script[data-viator]`).forEach((s) => s.remove());

    // Small delay ensures the widget div is fully in the DOM before the script scans
    const timer = setTimeout(() => {
      const script = document.createElement("script");
      script.src = `${SCRIPT_SRC}?t=${Date.now()}`;
      script.async = true;
      script.setAttribute("data-viator", "1");
      document.body.appendChild(script);
    }, 50);

    return () => {
      clearTimeout(timer);
      document.querySelectorAll(`script[data-viator]`).forEach((s) => s.remove());
    };
  }, [searchTerm]);

  return <div ref={containerRef} />;
}

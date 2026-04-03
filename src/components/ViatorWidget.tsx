"use client";

import { useEffect } from "react";

const PARTNER_ID = "P00295470";
const WIDGET_REF = "W-b6df82c7-382c-458d-b12e-9eef0ec392c0";
const SCRIPT_SRC = "https://www.viator.com/orion/partner/widget.js";

let reloadTimer: ReturnType<typeof setTimeout> | null = null;

function injectScript() {
  document.querySelectorAll(`script[data-viator]`).forEach((s) => s.remove());
  const script = document.createElement("script");
  script.src = `${SCRIPT_SRC}?t=${Date.now()}`;
  script.async = true;
  script.setAttribute("data-viator", "1");
  document.body.appendChild(script);
}

export default function ViatorWidget() {
  useEffect(() => {
    if (reloadTimer) clearTimeout(reloadTimer);

    const delay = document.readyState === "complete" ? 300 : 800;

    reloadTimer = setTimeout(() => {
      injectScript();
      reloadTimer = null;
    }, delay);

    return () => {
      if (reloadTimer) {
        clearTimeout(reloadTimer);
        reloadTimer = null;
      }
    };
  }, []);

  return (
    <div
      data-vi-partner-id={PARTNER_ID}
      data-vi-widget-ref={WIDGET_REF}
    />
  );
}

"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const PARTNER_ID = "P00295470";
const WIDGET_REF = "W-b6df82c7-382c-458d-b12e-9eef0ec392c0";

export default function ViatorWidget() {
  const pathname = usePathname();

  useEffect(() => {
    const existing = document.querySelector("script[data-viator]");
    if (existing) existing.remove();

    const script = document.createElement("script");
    script.src = "https://www.viator.com/orion/partner/widget.js";
    script.async = true;
    script.setAttribute("data-viator", "1");
    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, [pathname]);

  return (
    <div
      data-vi-partner-id={PARTNER_ID}
      data-vi-widget-ref={WIDGET_REF}
    />
  );
}

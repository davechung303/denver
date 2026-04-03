"use client";

import { useEffect } from "react";

const PARTNER_ID = "P00295470";
const WIDGET_REF = "W-b6df82c7-382c-458d-b12e-9eef0ec392c0";

export default function ViatorWidget() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.viator.com/orion/partner/widget.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return (
    <div
      data-vi-partner-id={PARTNER_ID}
      data-vi-widget-ref={WIDGET_REF}
    />
  );
}

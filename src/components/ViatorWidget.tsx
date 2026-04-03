"use client";

import { useEffect, useRef, useState } from "react";

const EMBED_HTML = `<!DOCTYPE html>
<html>
<head><style>body{margin:0;padding:0;}</style></head>
<body>
<div data-vi-partner-id="P00295470" data-vi-widget-ref="W-b6df82c7-382c-458d-b12e-9eef0ec392c0"></div>
<script async src="https://www.viator.com/orion/partner/widget.js"></script>
<script>
  var last = 0;
  function report() {
    var h = document.body.scrollHeight;
    if (h !== last) { last = h; parent.postMessage({ viatorHeight: h }, '*'); }
  }
  new MutationObserver(report).observe(document.body, { childList: true, subtree: true, attributes: true });
  window.addEventListener('load', report);
  setInterval(report, 500);
</script>
</body>
</html>`;

export default function ViatorWidget() {
  const [height, setHeight] = useState(480);
  const ref = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.data?.viatorHeight) {
        setHeight(e.data.viatorHeight);
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <iframe
      ref={ref}
      srcDoc={EMBED_HTML}
      style={{ width: "100%", height: `${height}px`, border: "none" }}
      title="Tours & Experiences"
    />
  );
}

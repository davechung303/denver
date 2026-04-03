"use client";

const EMBED_HTML = `<!DOCTYPE html>
<html>
<head><style>body{margin:0;padding:0;}</style></head>
<body>
<div data-vi-partner-id="P00295470" data-vi-widget-ref="W-b6df82c7-382c-458d-b12e-9eef0ec392c0"></div>
<script async src="https://www.viator.com/orion/partner/widget.js"></script>
</body>
</html>`;

export default function ViatorWidget() {
  return (
    <iframe
      srcDoc={EMBED_HTML}
      style={{ width: "100%", height: "480px", border: "none" }}
      title="Tours & Experiences"
    />
  );
}

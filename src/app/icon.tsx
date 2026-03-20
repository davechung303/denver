import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: "#0f1f3d",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 6,
        }}
      >
        <div
          style={{
            color: "#f59e0b",
            fontSize: 14,
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: "-0.5px",
          }}
        >
          52
        </div>
        <div
          style={{
            color: "#f59e0b",
            fontSize: 14,
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: "-0.5px",
          }}
        >
          80
        </div>
      </div>
    ),
    { ...size }
  );
}

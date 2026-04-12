import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Vaibhav Singh - Software Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0f1117",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px 100px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            width: 4,
            height: 80,
            background: "#58a6ff",
            borderRadius: 4,
            marginBottom: 32,
          }}
        />
        <div
          style={{
            fontSize: 20,
            color: "#8b8f96",
            letterSpacing: "0.08em",
            marginBottom: 16,
          }}
        >
          Software Engineer at SAP
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: "#e6edf3",
            letterSpacing: "-0.04em",
            lineHeight: 1,
            marginBottom: 24,
          }}
        >
          Vaibhav Singh
        </div>
        <div
          style={{
            fontSize: 24,
            color: "#9198a1",
            lineHeight: 1.5,
            maxWidth: 700,
          }}
        >
          Backend systems, APIs, and reliable enterprise product infrastructure.
        </div>
        <div style={{ fontSize: 18, color: "#58a6ff", marginTop: 40 }}>
          vaibhav-singh.in
        </div>
      </div>
    ),
    { ...size },
  );
}

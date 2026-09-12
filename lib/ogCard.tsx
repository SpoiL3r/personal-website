/**
 * Shared social-card artwork for the OpenGraph and Twitter image routes.
 * Colours are the Broadsheet ramp, hard-coded because ImageResponse renders
 * outside the document and cannot read CSS custom properties.
 */
export const OG_SIZE = { width: 1200, height: 630 };

export function OgCard() {
  return (
    <div
      style={{
        background: "#151310",
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
          fontSize: 20,
          color: "#8d8b88",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          marginBottom: 24,
        }}
      >
        Software Engineer at SAP
      </div>

      <div
        style={{
          fontSize: 80,
          fontWeight: 500,
          color: "#f3f1ee",
          letterSpacing: "-0.035em",
          lineHeight: 1,
          marginBottom: 32,
        }}
      >
        Vaibhav Singh
      </div>

      <div style={{ width: "100%", height: 1, background: "#4d4b48", marginBottom: 32 }} />

      <div style={{ fontSize: 24, color: "#b2b0ad", lineHeight: 1.5, maxWidth: 700 }}>
        Backend systems, APIs, and reliable enterprise product infrastructure.
      </div>

      <div style={{ fontSize: 18, color: "#8d8b88", marginTop: 40 }}>vaibhav-singh.in</div>
    </div>
  );
}

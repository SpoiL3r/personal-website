import React from "react";

/** Inline country-flag SVG prepended to a location string. Shared by experience
 * and education rows so location lines look consistent. */
export default function LocationFlag({ location }: { location: string }) {
  const loc = location.toLowerCase();
  let flag: React.ReactNode = null;

  if (loc.includes("german") || loc.includes("deutschland") || loc.includes(", de")) {
    flag = (
      <svg viewBox="0 0 60 40" width="16" height="11">
        <rect width="60" height="13.33" y="0"     fill="#000000" />
        <rect width="60" height="13.34" y="13.33" fill="#DD0000" />
        <rect width="60" height="13.33" y="26.67" fill="#FFCE00" />
      </svg>
    );
  } else if (
    loc.includes("india") ||
    loc.includes("bengaluru") ||
    loc.includes("bangalore") ||
    loc.includes("noida") ||
    loc.includes("delhi") ||
    loc.includes("mumbai")
  ) {
    flag = (
      <svg viewBox="0 0 60 40" width="16" height="11">
        <rect width="60" height="13.33" y="0"     fill="#FF9933" />
        <rect width="60" height="13.34" y="13.33" fill="#FFFFFF" />
        <rect width="60" height="13.33" y="26.67" fill="#138808" />
        <circle cx="30" cy="20" r="4" fill="none" stroke="#000080" strokeWidth="0.6" />
      </svg>
    );
  }

  if (!flag) return null;
  return (
    <span
      aria-hidden
      style={{
        display: "inline-flex",
        width: 16,
        height: 11,
        borderRadius: "2px",
        overflow: "hidden",
        border: "1px solid var(--border)",
        marginRight: "0.35rem",
        verticalAlign: "middle",
      }}
    >
      {flag}
    </span>
  );
}

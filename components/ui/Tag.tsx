import React from "react";

interface TagProps {
  label: string;
  color?: string;
  mono?: boolean;
}

export default function Tag({ label, color, mono = true }: TagProps) {
  return (
    <span
      style={{
        display: "inline-block",
        background: color
          ? `${color}18`
          : "var(--tag-bg)",
        color: color ?? "var(--tag-text)",
        border: `1px solid ${color ? `${color}30` : "var(--accent-dim)"}`,
        fontSize: "0.68rem",
        fontWeight: 500,
        padding: "0.15rem 0.55rem",
        borderRadius: "4px",
        fontFamily: mono ? "var(--font-mono, monospace)" : "inherit",
        letterSpacing: "0.02em",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

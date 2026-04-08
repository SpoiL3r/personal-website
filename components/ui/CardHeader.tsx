import React from "react";

interface CardHeaderProps {
  label: string;
  right?: React.ReactNode;
  Icon?: React.ElementType;
  iconColor?: string;
}

export default function CardHeader({ label, right, Icon, iconColor }: CardHeaderProps) {
  return (
    <div
      style={{
        padding: "0.7rem 1.25rem",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "0.75rem",
      }}
    >
      <span
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
          fontSize: "1rem",
          color: "var(--text)",
          letterSpacing: "-0.01em",
          fontWeight: 700,
        }}
      >
        <span style={{
          width: "4px",
          height: "18px",
          borderRadius: "2px",
          background: "var(--accent)",
          display: "inline-block",
          flexShrink: 0,
        }} />
        {Icon && (
          <Icon
            size={16}
            color={iconColor || "var(--accent)"}
            strokeWidth={2.2}
            style={{ flexShrink: 0 }}
          />
        )}
        {label}
      </span>
      {right}
    </div>
  );
}

import React from "react";

interface SectionLabelProps {
  label: string;
  style?: React.CSSProperties;
}

export default function SectionLabel({ label, style }: SectionLabelProps) {
  return (
    <p
      className="section-label"
      style={style}
    >
      {label}
    </p>
  );
}

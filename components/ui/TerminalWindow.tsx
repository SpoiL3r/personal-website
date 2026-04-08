import { ReactNode, CSSProperties } from "react";

interface Props {
  command: string;
  children: ReactNode;
  style?: CSSProperties;
  contentStyle?: CSSProperties;
}

export default function TerminalWindow({ command, children, style, contentStyle }: Props) {
  return (
    <div style={{
      background: "var(--bg-card)",
      border: "1px solid var(--border)",
      borderRadius: "10px",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      ...style,
    }}>
      {/* Title bar */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.55rem 0.9rem",
        borderBottom: "1px solid var(--border)",
        background: "var(--bg-terminal)",
        flexShrink: 0,
      }}>
        <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#f85149", display: "block" }} />
        <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#f0a818", display: "block" }} />
        <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#3fb950", display: "block" }} />
        <span style={{
          marginLeft: "0.4rem",
          fontSize: "0.7rem",
          fontFamily: "var(--font-mono, monospace)",
          color: "var(--text-dim)",
        }}>
          {command}
        </span>
      </div>

      {/* Content */}
      <div style={{ padding: "1.1rem 1.25rem", flex: 1, ...contentStyle }}>
        {children}
      </div>
    </div>
  );
}

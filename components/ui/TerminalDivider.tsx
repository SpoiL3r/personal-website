interface Props {
  label: string;
  meta?: string;
}

export default function TerminalDivider({ label, meta }: Props) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "0.6rem",
      padding: "2rem 0 1.25rem",
      fontFamily: "var(--font-mono, monospace)",
      fontSize: "0.7rem",
      color: "var(--text-dim)",
      userSelect: "none",
    }}>
      <span style={{ width: "16px", height: "1px", background: "var(--border)", flexShrink: 0 }} />
      <span style={{ color: "var(--accent)", whiteSpace: "nowrap" }}>{"// "}{label}</span>
      <span style={{ flex: 1, height: "1px", background: "var(--border)" }} />
      {meta && (
        <>
          <span style={{ whiteSpace: "nowrap", opacity: 0.6 }}>{meta}</span>
          <span style={{ width: "8px", height: "1px", background: "var(--border)", flexShrink: 0 }} />
        </>
      )}
    </div>
  );
}

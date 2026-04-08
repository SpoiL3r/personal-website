import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="site-wrap"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        textAlign: "center",
        gap: "1.5rem",
        padding: "4rem 1rem",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-geist-mono, monospace)",
          fontSize: "0.75rem",
          color: "var(--accent)",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          margin: 0,
        }}
      >
        404
      </p>
      <h1
        style={{
          fontSize: "clamp(1.5rem, 4vw, 2.25rem)",
          margin: 0,
          color: "var(--text)",
        }}
      >
        Page not found
      </h1>
      <p style={{ color: "var(--text-muted)", maxWidth: "360px", margin: 0 }}>
        The route you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <Link href="/" className="btn btn-outline" style={{ marginTop: "0.5rem" }}>
        ← Back home
      </Link>
    </div>
  );
}

import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="site-wrap"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        minHeight: "60vh",
        gap: "var(--s-24)",
        paddingBlock: "var(--s-96)",
      }}
    >
      <p className="meta">404</p>
      <h2>Page not found</h2>
      <p className="lead">
        The route you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <Link href="/" className="btn btn-outline" style={{ marginTop: "var(--s-16)" }}>
        Back home
      </Link>
    </div>
  );
}

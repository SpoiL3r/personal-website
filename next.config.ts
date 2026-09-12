import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Inlined at build into BOTH bundles, so the footer year is one string
  // rather than a server/client `new Date()` that disagrees across a
  // year boundary.
  env: { NEXT_PUBLIC_BUILD_DATE: new Date().toISOString().slice(0, 10) },
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      { hostname: "github.com" },
      { hostname: "upload.wikimedia.org" },
      { hostname: "www.google.com" },
    ],
  },
};

export default nextConfig;

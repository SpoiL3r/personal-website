import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      { hostname: "github.com" },
      { hostname: "upload.wikimedia.org" },
      { hostname: "www.google.com" },
      { hostname: "media.steampowered.com" },
      { hostname: "cdn.cloudflare.steamstatic.com" },
    ],
  },
};

export default nextConfig;

import type { MetadataRoute } from "next";

const BASE_URL = "https://vaibhav-singh.in";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE_URL,
      lastModified: "2026-04-12",
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}

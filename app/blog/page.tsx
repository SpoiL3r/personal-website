import type { Metadata } from "next";
import BlogPageClient from "./BlogPageClient";

export const metadata: Metadata = {
  title: "Blog · Vaibhav Singh",
};

export default function BlogPage() {
  return <BlogPageClient />;
}

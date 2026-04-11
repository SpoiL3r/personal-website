import type { Metadata } from "next";
import BlogPageClient from "./BlogPageClient";

export const metadata: Metadata = {
  title: "Blog - Vaibhav Singh",
  description: "Placeholder blog page for Vaibhav Singh. Posts are not published yet.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function BlogPage() {
  return <BlogPageClient />;
}

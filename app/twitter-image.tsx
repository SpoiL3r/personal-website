import { ImageResponse } from "next/og";
import { OG_SIZE, OgCard } from "@/lib/ogCard";

export const runtime = "edge";
export const alt = "Vaibhav Singh - Software Engineer";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(<OgCard />, { ...size });
}

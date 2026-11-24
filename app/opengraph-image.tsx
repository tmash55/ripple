import { ImageResponse } from "next/og";
import { OG_SIZE, PreviewCard } from "@/lib/og";

export const alt = "Ripple: a little kindness, passed from hand to hand";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <PreviewCard eyebrow="A little kindness, passed from hand to hand" message="You found a ripple." />,
    size,
  );
}

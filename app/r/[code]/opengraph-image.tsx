import { ImageResponse } from "next/og";
import { findCard, isCodeShaped, normalizeCode } from "@/lib/genesis";
import { OG_SIZE, PreviewCard } from "@/lib/og";
import { getStore } from "@/lib/store";

export const alt = "A Ripple found you";
export const size = OG_SIZE;
export const contentType = "image/png";

// The preview for a card or a passed-on link shows that ripple's own kind
// sentence. Rendering it does not count as a scan.
export default async function Image({ params }: { params: Promise<{ code: string }> }) {
  const { code: rawCode } = await params;
  let message = "Someone passed a little kindness forward. It found you.";

  if (isCodeShaped(rawCode)) {
    const code = normalizeCode(rawCode);
    const card = findCard(code);
    if (card) {
      message = card.message;
    } else {
      try {
        const journey = await getStore()?.getJourney(code);
        if (journey) message = journey.message;
      } catch {
        // Keep the general sentence.
      }
    }
  }

  return new ImageResponse(<PreviewCard eyebrow="This found you for a reason" message={message} />, size);
}

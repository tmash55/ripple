// Shared pieces for the link-preview images (what shows when a Ripple link is
// texted or posted). Rendered with next/og, which supports a small subset of
// CSS: every element with more than one child needs display:flex.
export const OG_SIZE = { width: 1200, height: 630 };

export function Mark({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M16 14.8C13 12.2 10.6 10.4 10.6 8.2C10.6 6.5 12 5.2 13.6 5.2C14.6 5.2 15.5 5.7 16 6.5C16.5 5.7 17.4 5.2 18.4 5.2C20 5.2 21.4 6.5 21.4 8.2C21.4 10.4 19 12.2 16 14.8Z"
        fill="#c2704a"
      />
      <ellipse cx="16" cy="20.5" rx="6.5" ry="2.4" fill="none" stroke="#5d7050" strokeWidth="1.8" />
      <ellipse cx="16" cy="21.8" rx="11.5" ry="4.2" fill="none" stroke="#5d7050" strokeWidth="1.4" opacity="0.5" />
    </svg>
  );
}

/** One layout for every preview: brand, a small line, the sentence, the address. */
export function PreviewCard({ eyebrow, message }: { eyebrow: string; message: string }) {
  // Long card messages step down in size so they never run off the image.
  const fontSize = message.length > 110 ? 50 : message.length > 70 ? 58 : 68;
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#ffffff",
        padding: "64px 80px",
        color: "#141414",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <Mark size={64} />
        <div style={{ display: "flex", fontSize: 40, letterSpacing: -0.5 }}>Ripple</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        <div style={{ display: "flex", fontSize: 24, letterSpacing: 5, color: "#c2704a" }}>
          {eyebrow.toUpperCase()}
        </div>
        <div style={{ display: "flex", fontSize, lineHeight: 1.14, letterSpacing: -1, maxWidth: 1000 }}>
          {message}
        </div>
      </div>

      <div style={{ display: "flex", fontSize: 26, color: "#717171" }}>ripple.cards</div>
    </div>
  );
}

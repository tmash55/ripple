"use client";

import { useState } from "react";
import { logShare } from "@/app/r/[code]/actions";

export default function PassItOn({ url, code }: { url: string; code: string }) {
  const [copied, setCopied] = useState(false);

  async function onClick() {
    const data = {
      title: "A Ripple found me",
      text: "Someone passed a little kindness forward, and it found me. Here’s where it’s been.",
      url,
    };
    if (typeof navigator.share === "function") {
      try {
        await navigator.share(data);
        void logShare(code);
        return;
      } catch (err) {
        // Closing the share sheet is not an error worth a fallback.
        if (err instanceof DOMException && err.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      void logShare(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      window.prompt("Copy this link to pass it on:", url);
    }
  }

  return (
    <div className="rp-pass">
      <button type="button" className="btn btn-secondary rp-pass-btn" onClick={onClick}>
        Pass it on
      </button>
      <p className="rp-hint" role="status" aria-live="polite">
        {copied ? "Link copied. Send it to someone who could use it." : "Or simply hand this card to someone else."}
      </p>
    </div>
  );
}

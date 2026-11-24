"use client";

import { useState } from "react";
import { createLink, logShare } from "@/app/r/[code]/actions";

type Cached = { code: string; momentId: string | null };

function readStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Storage unavailable: a new link is made next time instead.
  }
}

const SHARE_TEXT =
  "Someone passed a little kindness forward, and it found me. Now it’s yours.";

/**
 * "Pass it on" gives this person a link of their own. Whoever opens it is
 * the next generation of the same ripple. The link is made on the first tap
 * and remembered on this device, so tapping again reuses it.
 */
export default function PassItOn({
  code,
  baseUrl,
  fallbackHint,
}: {
  code: string;
  baseUrl: string;
  fallbackHint: string;
}) {
  const [link, setLink] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const canShare = typeof navigator !== "undefined" && typeof navigator.share === "function";

  async function share(url: string): Promise<boolean> {
    if (typeof navigator.share !== "function") return false;
    try {
      await navigator.share({ title: "A Ripple found me", text: SHARE_TEXT, url });
      void logShare(code);
      return true;
    } catch {
      // Closed the sheet, or the browser wanted a fresh tap. Either way the
      // link stays on screen with its own Share and Copy buttons.
      return false;
    }
  }

  async function copy(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      void logShare(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      window.prompt("Copy this link to pass it on:", url);
    }
  }

  async function prepare() {
    setBusy(true);
    const momentId = readStorage(`ripple:moment:${code}`);
    const cacheKey = `ripple:link:${code}`;

    let linkCode: string | null = null;
    try {
      const cached = JSON.parse(readStorage(cacheKey) ?? "null") as Cached | null;
      // Reuse the link unless a story has been written here since it was made.
      if (cached && cached.momentId === momentId) linkCode = cached.code;
    } catch {
      linkCode = null;
    }

    if (!linkCode) {
      linkCode = await createLink(code, momentId);
      if (linkCode) {
        writeStorage(cacheKey, JSON.stringify({ code: linkCode, momentId } satisfies Cached));
      }
    }

    // If a link couldn't be made, passing on this page still works.
    const url = `${baseUrl}/r/${linkCode ?? code}`;
    setLink(url);
    setBusy(false);
    await share(url);
  }

  if (!link) {
    return (
      <div className="rp-pass">
        <button
          type="button"
          className="btn btn-secondary rp-pass-btn"
          onClick={prepare}
          disabled={busy}
        >
          {busy ? "Making your link…" : "Pass it on"}
        </button>
        <p className="rp-hint">{fallbackHint}</p>
      </div>
    );
  }

  return (
    <div className="rp-pass">
      <p className="rp-pass-label">Your link to give away</p>
      <p className="rp-pass-link">{link.replace(/^https?:\/\//, "")}</p>
      <div className="rp-pass-row">
        {canShare ? (
          <button type="button" className="btn btn-primary rp-pass-btn" onClick={() => share(link)}>
            Share
          </button>
        ) : null}
        <button
          type="button"
          className={`btn ${canShare ? "btn-secondary" : "btn-primary"} rp-pass-btn`}
          onClick={() => copy(link)}
        >
          Copy link
        </button>
      </div>
      <p className="rp-hint" role="status" aria-live="polite">
        {copied
          ? "Link copied. Send it to someone who could use it."
          : "Whoever opens it becomes the next part of this story."}
      </p>
    </div>
  );
}

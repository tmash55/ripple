"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getReach, type Reach } from "@/app/r/[code]/actions";
import { forget, forgetEverything, readReached, type ReachedItem } from "@/lib/device";

function day(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

/** One calm sentence about what happened after this person. */
function afterYou(reach: Reach | undefined, item: ReachedItem): string | null {
  if (!item.story && !item.link) return null;
  if (!reach) return null;

  if (reach.storiesAfter > 0) {
    const places =
      reach.placesAfter > 1 ? `, across ${plural(reach.placesAfter, "place", "places")}` : "";
    const further =
      reach.generationsAfter > 1
        ? ` It has gone ${plural(reach.generationsAfter, "step", "steps")} beyond you.`
        : "";
    return `After you: ${plural(reach.storiesAfter, "more story", "more stories")}${places}.${further}`;
  }
  if (item.link && reach.linkOpens && reach.linkOpens > 0) {
    return `Your link has been opened about ${plural(reach.linkOpens, "time", "times")}. No one has added a story yet.`;
  }
  return "Nothing after you yet. These things take their time.";
}

function storyStatus(reach: Reach | undefined): string | null {
  switch (reach?.storyStatus) {
    case "approved":
      return "Part of the journey now.";
    case "pending":
      return "Waiting to be read before it appears.";
    case "hidden":
      return "Not shown on the public page.";
    default:
      return null;
  }
}

export default function ReachedList({ baseUrl }: { baseUrl: string }) {
  // null until the device's list has been read; it can't be known on the server.
  const [items, setItems] = useState<ReachedItem[] | null>(null);
  const [reach, setReach] = useState<Record<string, Reach>>({});
  // While counts are on their way, each entry holds a line open for them so
  // the buttons underneath don't jump when they arrive on a slow connection.
  const [reachPending, setReachPending] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const list = readReached();
    setItems(list);
    const ask = list
      .filter((i) => i.story?.id || i.link)
      .map((i) => ({ code: i.code, momentId: i.story?.id ?? null, linkCode: i.link?.code ?? null }));
    if (ask.length === 0) return;
    let cancelled = false;
    setReachPending(true);
    getReach(ask)
      .then((r) => {
        if (!cancelled) setReach(r);
      })
      .catch(() => {
        // The list still shows; only the "after you" lines are missing.
      })
      .finally(() => {
        if (!cancelled) setReachPending(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function copy(url: string, code: string) {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(code);
      window.setTimeout(() => setCopied(null), 2400);
    } catch {
      window.prompt("Copy this link:", url);
    }
  }

  if (items === null) {
    return <p className="rc-empty" aria-busy="true">Looking on this device…</p>;
  }

  if (items.length === 0) {
    return (
      <div className="rc-empty">
        <p>Nothing here yet.</p>
        <p>
          When a Ripple card or link finds you, it’s kept here so you can come
          back to it.
        </p>
      </div>
    );
  }

  return (
    <>
      <ul className="rc-list">
        {items.map((item) => {
          const r = reach[item.code];
          const after = afterYou(r, item);
          const status = item.story ? storyStatus(r) : null;
          const linkUrl = item.link ? `${baseUrl}/r/${item.link.code}` : null;
          return (
            <li className="rc-item" key={item.code}>
              <p className="rc-meta">
                {day(item.seenAt)}
                {item.rootNumber ? ` · Ripple #${item.rootNumber}` : ""}
                {item.place ? ` · began in ${item.place}` : ""}
              </p>
              <p className="rc-message">{item.message}</p>

              {item.story ? (
                <div className="rc-yours">
                  <p className="rc-label">What you added</p>
                  <p className="rc-story">{item.story.text}</p>
                  <p className="rc-note">
                    {[item.story.place, status].filter(Boolean).join(" · ")}
                  </p>
                </div>
              ) : null}

              {linkUrl ? (
                <div className="rc-yours">
                  <p className="rc-label">The link you passed on</p>
                  <p className="rc-link">{linkUrl.replace(/^https?:\/\//, "")}</p>
                  <button
                    type="button"
                    className="rc-text-btn"
                    onClick={() => copy(linkUrl, item.code)}
                  >
                    {copied === item.code ? "Copied" : "Copy link"}
                  </button>
                </div>
              ) : null}

              {reachPending && (item.story || item.link) ? (
                <p className="rc-after rc-after-wait">Looking for what came after…</p>
              ) : after ? (
                <p className="rc-after">{after}</p>
              ) : null}

              <div className="rc-actions">
                {/* No prefetch: loading a ripple page counts as a scan. */}
                <Link className="btn btn-secondary btn-sm" href={`/r/${item.code}`} prefetch={false}>
                  Open it
                </Link>
                <button
                  type="button"
                  className="rc-text-btn"
                  onClick={() => {
                    forget(item.code);
                    setItems(readReached());
                  }}
                >
                  Forget this one
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <p className="rc-foot">
        <button
          type="button"
          className="rc-text-btn"
          onClick={() => {
            if (window.confirm("Remove this whole list from this device? It can’t be brought back.")) {
              forgetEverything();
              setItems([]);
            }
          }}
        >
          Clear this list from this device
        </button>
      </p>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import ReachedList from "@/components/ReachedList";
import RippleMark from "@/components/RippleMark";
import { SITE_URL } from "@/lib/site";
import "../r/[code]/scan.css";
import "./reached.css";

export const metadata: Metadata = {
  title: "Things that reached me · Ripple",
  description: "The kindness that found you, kept on your own device.",
  robots: { index: false, follow: false },
};

// The page itself is the same for everyone. What fills it comes from the
// visitor's own device, in the browser, and is never sent to us as a list.
export default function ReachedPage() {
  return (
    <main className="rp-page">
      <div className="rp-col">
        <Link className="rp-brand" href="/" prefetch={false}>
          <RippleMark />
          Ripple
        </Link>

        <div className="rp-hero">
          <p className="rp-eyebrow">Only you can see this</p>
          <h1 className="rp-message">Things that reached me</h1>
          <p className="rp-lede">
            Every Ripple that has found you, kept on this device. There’s no
            account, so this list isn’t stored anywhere else.
          </p>
        </div>

        <div className="rp-block">
          <ReachedList baseUrl={SITE_URL} />
        </div>

        <p className="rp-foot">
          Kept in this browser only. Clearing your browser’s data, or opening
          Ripple on another device, starts a new list.
        </p>
      </div>
    </main>
  );
}

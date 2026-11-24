import Link from "next/link";
import RippleMark from "@/components/RippleMark";
import "./scan.css";

export default function RippleNotFound() {
  return (
    <main className="rp-page">
      <div className="rp-col">
        <Link className="rp-brand" href="/">
          <RippleMark />
          Ripple
        </Link>
        <div className="rp-hero">
          <p className="rp-eyebrow">Hmm</p>
          <h1 className="rp-message">We couldn’t find that card.</h1>
          <p className="rp-lede">
            The link may have been typed a little differently than it’s
            printed. If you’re holding a card, scanning its code with
            your camera is the surest way here.
          </p>
          <p className="rp-btn-row">
            <Link className="btn btn-primary" href="/">
              See what Ripple is
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

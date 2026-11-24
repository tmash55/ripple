import Link from "next/link";
import RippleMark from "@/components/RippleMark";

/** Shared frame for the plain-text pages: contact, privacy, terms. */
export default function DocPage({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <main className="rp-page">
      <div className="rp-col dc-col">
        <Link className="rp-brand" href="/" prefetch={false}>
          <RippleMark />
          Ripple
        </Link>

        <div className="rp-hero">
          <p className="rp-eyebrow">{eyebrow}</p>
          <h1 className="rp-message">{title}</h1>
        </div>

        <div className="dc-body">{children}</div>

        <p className="rp-foot dc-foot">
          <Link href="/contact" prefetch={false}>Contact</Link>
          <Link href="/privacy" prefetch={false}>Privacy</Link>
          <Link href="/terms" prefetch={false}>Terms</Link>
          <Link href="/reached" prefetch={false}>Things that reached me</Link>
        </p>
      </div>
    </main>
  );
}

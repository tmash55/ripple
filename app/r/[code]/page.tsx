import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import PassItOn from "@/components/PassItOn";
import RecordForm from "@/components/RecordForm";
import RippleMark from "@/components/RippleMark";
import { GENESIS_BATCH, findCard } from "@/lib/genesis";
import { rippleUrl } from "@/lib/site";
import { getStore, hashSession, type Moment } from "@/lib/store";
import "./scan.css";

type Props = { params: Promise<{ code: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  const card = findCard(code);
  return {
    title: card ? "A Ripple found you" : "Ripple",
    description: "Someone passed a little kindness forward. It found you.",
    // Card pages are for the people holding the card, not for search results.
    robots: { index: false, follow: false },
  };
}

function monthYear(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default async function RipplePage({ params }: Props) {
  const { code } = await params;
  const card = findCard(code);
  if (!card) notFound();

  const store = getStore();
  let moments: Moment[] = [];
  if (store) {
    const h = await headers();
    const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
    // Awaited (not fire-and-forget) so the scan is counted before the
    // serverless function is frozen. logEvent never throws.
    const [found] = await Promise.all([
      // The card's message and its starting point still render without the journey.
      store.listApprovedMoments(card.code).catch(() => [] as Moment[]),
      store.logEvent({
        code: card.code,
        type: "scan",
        sessionHash: hashSession(ip, h.get("user-agent")),
      }),
    ]);
    moments = found;
  }

  return (
    <main className="rp-page">
      <div className="rp-col">
        <Link className="rp-brand" href="/">
          <RippleMark />
          Ripple
        </Link>

        <div className="rp-hero">
          <p className="rp-eyebrow">This found you for a reason</p>
          <h1 className="rp-message">{card.message}</h1>
          <p className="rp-lede">
            Someone left this card where you would find it, hoping it would
            make your day a little lighter. It’s yours. Nothing is
            expected of you.
          </p>
        </div>

        <div className="rp-block">
          <h2 className="rp-h2">What is this?</h2>
          <p className="rp-about">
            Ripple is a way of making kindness visible. Each card carries one
            kind message and travels from person to person. This page belongs
            to your card, and it keeps the story of everywhere the card has
            been.
          </p>
        </div>

        <div className="rp-block">
          <h2 className="rp-h2">This card’s journey</h2>
          <ol className="rp-journey">
            <li className="rp-stop">
              <p className="rp-stop-where">
                Released in {GENESIS_BATCH.place} · {GENESIS_BATCH.released}
              </p>
              <p className="rp-stop-meta">
                Ripple #{card.number} · one of the first fifty
              </p>
            </li>
            {moments.map((m) => (
              <li className="rp-stop" key={m.id}>
                <p className="rp-stop-where">{m.place ?? "Somewhere along the way"}</p>
                <p className="rp-stop-meta">{monthYear(m.createdAt)}</p>
                <p className="rp-stop-text">{m.text}</p>
              </li>
            ))}
            <li className="rp-stop rp-stop-open">
              <p className="rp-stop-where">
                {moments.length === 0
                  ? "Nothing has been added yet. Yours can be the first, if you’d like."
                  : "The next part is yours, if you’d like."}
              </p>
            </li>
          </ol>
        </div>

        <div className="rp-block">
          <h2 className="rp-h2">Add your part</h2>
          <p className="rp-sub">
            Only if you want to. Tell us about a kindness that reached you
            — today, or any day.
          </p>
          <RecordForm code={card.code} storeReady={store !== null} />
        </div>

        <div className="rp-block">
          <h2 className="rp-h2">Whenever you’re ready</h2>
          <p className="rp-sub">
            If one day you want to pass this along: do something kind for
            someone, then leave the card where they’ll find it. Or send
            them this page.
          </p>
          <PassItOn code={card.code} url={rippleUrl(card.code)} />
        </div>

        <p className="rp-foot">
          No account. No name. No location unless you type one.
          <br />
          Ripple #{card.number} · {GENESIS_BATCH.name}
        </p>
      </div>
    </main>
  );
}

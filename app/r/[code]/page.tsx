import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import PassItOn from "@/components/PassItOn";
import RecordForm from "@/components/RecordForm";
import RippleMark from "@/components/RippleMark";
import { GENESIS_BATCH, findCard, isCodeShaped, normalizeCode } from "@/lib/genesis";
import { SITE_URL } from "@/lib/site";
import { getStore, hashSession, type Journey } from "@/lib/store";
import "./scan.css";

type Props = { params: Promise<{ code: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  return {
    title: isCodeShaped(code) ? "A Ripple found you" : "Ripple",
    description: "Someone passed a little kindness forward. It found you.",
    // These pages are for the people holding the card or the link, not for search results.
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

const pad = (n: number) => String(n).padStart(6, "0");

export default async function RipplePage({ params }: Props) {
  const { code: rawCode } = await params;
  if (!isCodeShaped(rawCode)) notFound();
  const code = normalizeCode(rawCode);

  // Printed cards are known to the site itself, so their page renders even
  // if the database is unreachable. Passed-on links exist only in the database.
  const card = findCard(code);
  const store = getStore();

  let journey: Journey | null = null;
  if (store) {
    const h = await headers();
    const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
    // Awaited (not fire-and-forget) so the scan is counted before the
    // serverless function is frozen. logEvent never throws.
    const [found] = await Promise.all([
      store.getJourney(code).catch(() => null),
      store.logEvent({
        code,
        type: "scan",
        sessionHash: hashSession(ip, h.get("user-agent")),
      }),
    ]);
    journey = found;
  }
  if (!card && !journey) notFound();

  const isLink = journey?.kind === "link";
  const message = card?.message ?? journey!.message;
  const place = journey?.place ?? GENESIS_BATCH.place;
  const released = journey?.releasedOn ? monthYear(journey.releasedOn) : GENESIS_BATCH.released;
  const batchName = journey?.batchName ?? GENESIS_BATCH.name;
  const rootNumber =
    card?.number ?? (journey?.rootNumber != null ? pad(journey.rootNumber) : null);
  const moments = journey?.moments ?? [];

  return (
    <main className="rp-page">
      <div className="rp-col">
        <Link className="rp-brand" href="/">
          <RippleMark />
          Ripple
        </Link>

        <div className="rp-hero">
          <p className="rp-eyebrow">This found you for a reason</p>
          <h1 className="rp-message">{message}</h1>
          <p className="rp-lede">
            {isLink
              ? "Someone sent this to you, hoping it would make your day a little lighter. It’s yours. Nothing is expected of you."
              : "Someone left this card where you would find it, hoping it would make your day a little lighter. It’s yours. Nothing is expected of you."}
          </p>
        </div>

        <div className="rp-block">
          <h2 className="rp-h2">What is this?</h2>
          <p className="rp-about">
            {isLink
              ? `Ripple is a way of making kindness visible. This one began as a card left for a stranger in ${place}, and it has been passed from person to person since. This page keeps the story of where it has been.`
              : "Ripple is a way of making kindness visible. Each card carries one kind message and travels from person to person. This page belongs to your card, and it keeps the story of everywhere the card has been."}
          </p>
        </div>

        <div className="rp-block">
          <h2 className="rp-h2">{isLink ? "How it reached you" : "This card’s journey"}</h2>
          <ol className="rp-journey">
            <li className="rp-stop">
              <p className="rp-stop-where">
                Released in {place} · {released}
              </p>
              <p className="rp-stop-meta">
                {rootNumber ? `Ripple #${rootNumber} · one of the first fifty` : "One of the first fifty"}
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
            Only if you want to. Tell us about a kindness that reached you — today, or any day.
          </p>
          <RecordForm code={code} storeReady={store !== null} />
        </div>

        <div className="rp-block">
          <h2 className="rp-h2">Whenever you’re ready</h2>
          <p className="rp-sub">
            {isLink
              ? "If one day you want to pass this along: do something kind for someone, then send them a link of their own."
              : "If one day you want to pass this along: do something kind for someone, then leave the card where they’ll find it. Or send them a link of their own."}
          </p>
          <PassItOn
            code={code}
            baseUrl={SITE_URL}
            fallbackHint={isLink ? "It makes a link that is yours to give." : "Or simply hand this card to someone else."}
          />
        </div>

        <p className="rp-foot">
          No account. No name. No location unless you type one.
          <br />
          {isLink
            ? `Began as Ripple #${rootNumber ?? "—"} · ${batchName}`
            : `Ripple #${rootNumber ?? "—"} · ${batchName}`}
        </p>
      </div>
    </main>
  );
}

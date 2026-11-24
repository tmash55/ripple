import type { Metadata } from "next";
import PrintButton from "@/components/PrintButton";
import QrCode from "@/components/QrCode";
import RippleMark from "@/components/RippleMark";
import { GENESIS_MESSAGES_STATUS } from "@/data/genesis-messages";
import { GENESIS_BATCH, GENESIS_CARDS, type GenesisCard } from "@/lib/genesis";
import {
  SITE_URL,
  SITE_URL_IS_PLACEHOLDER,
  rippleUrl,
  rippleUrlForPrint,
} from "@/lib/site";
import "./print.css";

export const metadata: Metadata = {
  title: "Ripple — Genesis print sheets",
  robots: { index: false, follow: false },
};

const PER_SHEET = 4;

function Card({ card }: { card: GenesisCard }) {
  const printed = rippleUrlForPrint(card.code);
  const slash = printed.lastIndexOf("/") + 1;
  return (
    <div className="gp-card" data-card={card.number} data-code={card.code}>
      <div className="gp-brand">
        <RippleMark />
        <span>RIPPLE</span>
      </div>
      <p className="gp-reason">This found you for a reason</p>
      <p className="gp-message">{card.message}</p>
      <p className="gp-forward">
        Someone wanted to pass a little kindness forward, and now you’re
        part of the story. This card is yours. No strings.
      </p>
      <span className="gp-rule" />
      <div className="gp-scan">
        <QrCode
          className="gp-qr"
          value={rippleUrl(card.code)}
          label={`QR code for Ripple card ${card.number}`}
        />
        <div className="gp-scan-copy">
          <p className="gp-pass">
            If one day you want to pass it along, scan here.
          </p>
          <p className="gp-nopress">
            See where this ripple has been, and add your part if you’d
            like.
          </p>
        </div>
      </div>
      <p className="gp-url">
        {printed.slice(0, slash)}
        <b>{printed.slice(slash)}</b>
      </p>
      <p className="gp-foot">
        Ripple #{card.number} · Genesis · {GENESIS_BATCH.place}
      </p>
    </div>
  );
}

export default function GenesisPrintPage() {
  const sheets: GenesisCard[][] = [];
  for (let i = 0; i < GENESIS_CARDS.length; i += PER_SHEET) {
    sheets.push(GENESIS_CARDS.slice(i, i + PER_SHEET));
  }

  return (
    <div className="gp-root">
      <div className="gp-toolbar">
        <p>
          <strong>{GENESIS_BATCH.title}</strong> · {GENESIS_CARDS.length}{" "}
          cards on {sheets.length} US Letter sheets. Print at 100% scale (not
          “fit to page”), then cut along the dashed lines. Messages:{" "}
          {GENESIS_MESSAGES_STATUS}.{" "}
          {SITE_URL_IS_PLACEHOLDER ? (
            <span className="gp-warn">
              QR codes point at the placeholder {SITE_URL} — set
              NEXT_PUBLIC_SITE_URL before printing.
            </span>
          ) : (
            <>
              QR codes point at <strong>{SITE_URL}</strong>.
            </>
          )}
        </p>
        <PrintButton className="gp-btn" />
      </div>

      {sheets.map((cards, i) => (
        <div className="gp-sheet" key={i}>
          {SITE_URL_IS_PLACEHOLDER && (
            <p className="gp-stamp">
              Placeholder domain — do not print — set
              NEXT_PUBLIC_SITE_URL
            </p>
          )}
          {cards.map((card) => (
            <Card card={card} key={card.code} />
          ))}
          <p className="gp-sheet-no">
            Genesis · sheet {i + 1} of {sheets.length}
          </p>
        </div>
      ))}
    </div>
  );
}

import codes from "@/data/genesis-codes.json";
import { GENESIS_MESSAGES } from "@/data/genesis-messages";

export const GENESIS_BATCH = {
  slug: "genesis",
  name: "GENESIS",
  title: "GENESIS — Ankeny, Iowa — November/December 2026",
  place: "Ankeny, Iowa",
  released: "November 2026",
} as const;

export type GenesisCard = {
  /** Zero-padded sequence, "000001" … "000050". Display as #000001. */
  number: string;
  /** Permanent 6-character code printed in the QR. Never changes. */
  code: string;
  message: string;
};

if (codes.cards.length !== GENESIS_MESSAGES.length) {
  throw new Error(
    `Genesis batch mismatch: ${codes.cards.length} codes vs ${GENESIS_MESSAGES.length} messages.`,
  );
}

export const GENESIS_CARDS: readonly GenesisCard[] = codes.cards.map((c, i) => ({
  number: c.number,
  code: c.code,
  message: GENESIS_MESSAGES[i],
}));

const BY_CODE = new Map(GENESIS_CARDS.map((c) => [c.code, c]));

/** Codes are printed uppercase, but people typing the link by hand won't bother. */
export function normalizeCode(raw: string): string {
  return raw.trim().toUpperCase();
}

/** Shape of every ripple code, printed card or passed-on link. */
export const CODE_PATTERN = /^[2-9BCDFGHJKMNPQRSTVWXYZ]{6}$/;

export function isCodeShaped(rawCode: string): boolean {
  return CODE_PATTERN.test(normalizeCode(rawCode));
}

export function findCard(rawCode: string): GenesisCard | undefined {
  return BY_CODE.get(normalizeCode(rawCode));
}

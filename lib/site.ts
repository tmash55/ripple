// The ONE place the public address of Ripple is defined.
//
// Every printed QR code encodes `${SITE_URL}/r/{code}`, and print is
// permanent — set NEXT_PUBLIC_SITE_URL to the real domain BEFORE printing.
// While the placeholder below is in effect, the print sheet stamps a
// "do not print" warning on every page.
export const PLACEHOLDER_SITE_URL = "https://YOUR-DOMAIN-HERE.example";

// ripple.cards was registered 2026-11-24 and is what the GENESIS batch was
// printed with. It is the default so a missing env var can never produce
// cards or links that point anywhere else.
export const DEFAULT_SITE_URL = "https://ripple.cards";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || DEFAULT_SITE_URL
).replace(/\/+$/, "");

export const SITE_URL_IS_PLACEHOLDER = SITE_URL === PLACEHOLDER_SITE_URL;

/** Full link a QR code encodes, e.g. https://example.org/r/NQH5PF */
export function rippleUrl(code: string): string {
  return `${SITE_URL}/r/${code}`;
}

/** Same link without the scheme — what gets printed under the QR as a typed fallback. */
export function rippleUrlForPrint(code: string): string {
  return rippleUrl(code).replace(/^https?:\/\//, "");
}

// Story review: who may open /review, and the three things a reviewer can do.
//
// Server-only. Two secrets, both environment variables:
//   RIPPLE_REVIEW_PASSWORD  what a human types on /review (set by the owner)
//   RIPPLE_REVIEW_TOKEN     what this server sends to the database; the
//                           database only knows its SHA-256 hash
// There is no database admin key in this app. See
// supabase/migrations/20261124200000_review_functions.sql.
import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export const REVIEW_COOKIE = "ripple_review";
export const REVIEW_SESSION_SECONDS = 60 * 60 * 24 * 30;
export const MIN_PASSWORD_LENGTH = 12;

export type ReviewStatus = "pending" | "approved" | "hidden";
export const REVIEW_STATUSES: readonly ReviewStatus[] = ["pending", "approved", "hidden"];

export type ReviewMoment = {
  id: string;
  ripple_code: string;
  ripple_number: number | null;
  ripple_message: string;
  generation: number;
  text: string;
  place: string | null;
  status: ReviewStatus;
  created_at: string;
  reviewed_at: string | null;
};

export type ReviewStats = {
  cards: number;
  scans: number;
  scan_sessions: number;
  cards_scanned: number;
  shares: number;
  pending: number;
  approved: number;
  hidden: number;
  cards_with_story: number;
  longest_chain: number;
  places: number;
};

function config() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL?.trim().replace(/\/+$/, "") ?? "",
    key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "",
    token: process.env.RIPPLE_REVIEW_TOKEN?.trim() ?? "",
    password: process.env.RIPPLE_REVIEW_PASSWORD ?? "",
  };
}

/** Why /review can or cannot be used right now. */
export function reviewSetup(): "ready" | "no_database" | "no_password" {
  const c = config();
  if (!c.url || !c.key || !c.token) return "no_database";
  if (c.password.length < MIN_PASSWORD_LENGTH) return "no_password";
  return "ready";
}

const sha256 = (value: string) => createHash("sha256").update(value).digest();

export function passwordMatches(attempt: string): boolean {
  const { password } = config();
  if (reviewSetup() !== "ready") return false;
  // Hash both sides so the comparison is constant-time and length-blind.
  return timingSafeEqual(sha256(attempt), sha256(password));
}

// The cookie is `${expiresAtMs}.${signature}`. The signature covers the
// expiry and the current password, so changing the password signs everyone out.
function sign(expiresAt: number): string {
  const { token, password } = config();
  return createHmac("sha256", token)
    .update(`${expiresAt}|${sha256(password).toString("hex")}`)
    .digest("hex");
}

export function createSession(): string {
  const expiresAt = Date.now() + REVIEW_SESSION_SECONDS * 1000;
  return `${expiresAt}.${sign(expiresAt)}`;
}

export function sessionIsValid(cookieValue: string | undefined): boolean {
  if (!cookieValue || reviewSetup() !== "ready") return false;
  const [rawExpiry, signature] = cookieValue.split(".");
  const expiresAt = Number(rawExpiry);
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now() || !signature) return false;
  const expected = Buffer.from(sign(expiresAt), "hex");
  const given = Buffer.from(signature, "hex");
  return given.length === expected.length && timingSafeEqual(given, expected);
}

async function rpc<T>(fn: string, body: Record<string, unknown>): Promise<T> {
  const { url, key, token } = config();
  const res = await fetch(`${url}/rest/v1/rpc/${fn}`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ p_token: token, ...body }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`${fn} failed: ${res.status}`);
  const text = await res.text();
  return (text ? JSON.parse(text) : null) as T;
}

export function listMoments(status: ReviewStatus): Promise<ReviewMoment[]> {
  return rpc<ReviewMoment[]>("review_list", { p_status: status });
}

export function getStats(): Promise<ReviewStats> {
  return rpc<ReviewStats>("review_stats", {});
}

export async function setMomentStatus(id: string, status: ReviewStatus): Promise<void> {
  await rpc<null>("review_set_status", { p_id: id, p_status: status });
}

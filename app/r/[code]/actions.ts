"use server";

import { headers } from "next/headers";
import { isCodeShaped, normalizeCode } from "@/lib/genesis";
import { getStore, hashSession } from "@/lib/store";

export type RecordState =
  | { status: "idle" }
  | { status: "saved"; momentId: string | null }
  | { status: "setting_up" }
  | { status: "invalid"; message: string }
  | { status: "error" };

const MAX_TEXT = 500;
const MAX_PLACE = 80;

export async function recordMoment(
  _prev: RecordState,
  formData: FormData,
): Promise<RecordState> {
  // Honeypot: real people never see or fill this field.
  if (String(formData.get("website") ?? "").trim() !== "") {
    return { status: "saved", momentId: null };
  }

  // Printed cards and passed-on links share one code shape; the database
  // is what knows whether a given code exists.
  const rawCode = String(formData.get("code") ?? "");
  if (!isCodeShaped(rawCode)) {
    return { status: "invalid", message: "We couldn’t find this card." };
  }
  const code = normalizeCode(rawCode);

  const text = String(formData.get("text") ?? "").trim();
  const place = String(formData.get("place") ?? "").trim();
  if (text.length === 0) {
    return { status: "invalid", message: "Add a few words first — even one sentence is plenty." };
  }
  if (text.length > MAX_TEXT) {
    return { status: "invalid", message: `Please keep it under ${MAX_TEXT} characters.` };
  }
  if (place.length > MAX_PLACE) {
    return { status: "invalid", message: "That place name is a little long — a city and state is enough." };
  }

  const store = getStore();
  // Nothing to save to yet. Say so plainly instead of pretending.
  if (!store) return { status: "setting_up" };

  try {
    const momentId = await store.recordMoment({ code, text, place: place || null });
    const h = await headers();
    const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
    await store.logEvent({
      code,
      type: "record",
      sessionHash: hashSession(ip, h.get("user-agent")),
    });
    return { status: "saved", momentId };
  } catch {
    return { status: "error" };
  }
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Makes a personal link that branches from this ripple, so whoever opens it
 * becomes the next generation. Returns null if it can't be made right now;
 * the button then falls back to sharing the page it is on.
 */
export async function createLink(code: string, momentId: string | null): Promise<string | null> {
  const store = getStore();
  if (!store || !isCodeShaped(String(code ?? ""))) return null;
  const fromMoment = typeof momentId === "string" && UUID.test(momentId) ? momentId : null;
  try {
    return await store.passItOn(normalizeCode(code), fromMoment);
  } catch {
    return null;
  }
}

/** Counts a completed "Pass it on" (share sheet sent, or link copied). Best-effort. */
export async function logShare(code: string): Promise<void> {
  const store = getStore();
  if (!store || !isCodeShaped(String(code ?? ""))) return;
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  await store.logEvent({
    code: normalizeCode(code),
    type: "share",
    sessionHash: hashSession(ip, h.get("user-agent")),
  });
}

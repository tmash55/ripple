"use server";

import { headers } from "next/headers";
import { findCard } from "@/lib/genesis";
import { getStore, hashSession } from "@/lib/store";

export type RecordState =
  | { status: "idle" }
  | { status: "saved" }
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
    return { status: "saved" };
  }

  const card = findCard(String(formData.get("code") ?? ""));
  if (!card) return { status: "invalid", message: "We couldn’t find this card." };

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
    await store.recordMoment({ code: card.code, text, place: place || null });
    const h = await headers();
    const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
    await store.logEvent({
      code: card.code,
      type: "record",
      sessionHash: hashSession(ip, h.get("user-agent")),
    });
    return { status: "saved" };
  } catch {
    return { status: "error" };
  }
}

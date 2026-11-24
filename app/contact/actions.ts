"use server";

import { isCodeShaped, normalizeCode } from "@/lib/genesis";
import { getStore } from "@/lib/store";

export type ContactState =
  | { status: "idle" }
  | { status: "sent" }
  | { status: "invalid"; message: string }
  | { status: "unavailable" }
  | { status: "error" };

const TOPICS = ["remove", "problem", "other"] as const;
type Topic = (typeof TOPICS)[number];

const MAX_TEXT = 2000;
const MAX_REPLY = 160;

export async function sendContactMessage(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // Honeypot: real people never see or fill this field.
  if (String(formData.get("website") ?? "").trim() !== "") return { status: "sent" };

  const topic = String(formData.get("topic") ?? "") as Topic;
  const text = String(formData.get("text") ?? "").trim();
  const replyTo = String(formData.get("reply_to") ?? "").trim();
  const rawCode = String(formData.get("code") ?? "").trim();

  if (!TOPICS.includes(topic)) {
    return { status: "invalid", message: "Choose what this is about." };
  }
  if (text.length === 0) {
    return { status: "invalid", message: "Write a few words so we know how to help." };
  }
  if (text.length > MAX_TEXT) {
    return { status: "invalid", message: `Please keep it under ${MAX_TEXT} characters.` };
  }
  if (replyTo.length > MAX_REPLY) {
    return { status: "invalid", message: "That contact detail is a little long." };
  }

  const store = getStore();
  if (!store) return { status: "unavailable" };

  try {
    await store.sendMessage({
      topic,
      text,
      replyTo: replyTo || null,
      // Kept only if it looks like a real code; otherwise it's in their words anyway.
      code: rawCode && isCodeShaped(rawCode) ? normalizeCode(rawCode) : null,
    });
    return { status: "sent" };
  } catch {
    return { status: "error" };
  }
}

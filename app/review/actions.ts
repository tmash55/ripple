"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  REVIEW_COOKIE,
  REVIEW_SESSION_SECONDS,
  REVIEW_STATUSES,
  createSession,
  passwordMatches,
  reviewSetup,
  sessionIsValid,
  setMomentStatus,
  type ReviewStatus,
} from "@/lib/review";

export type SignInState = { error: string | null };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function signIn(_prev: SignInState, formData: FormData): Promise<SignInState> {
  if (reviewSetup() !== "ready") {
    return { error: "Review isn’t set up yet." };
  }
  const attempt = String(formData.get("password") ?? "");
  if (!passwordMatches(attempt)) {
    // Slows down guessing without getting in a real person's way.
    await new Promise((resolve) => setTimeout(resolve, 900));
    return { error: "That password didn’t match." };
  }

  const jar = await cookies();
  jar.set(REVIEW_COOKIE, createSession(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/review",
    maxAge: REVIEW_SESSION_SECONDS,
  });
  redirect("/review");
}

export async function signOut(): Promise<void> {
  const jar = await cookies();
  jar.set(REVIEW_COOKIE, "", { path: "/review", maxAge: 0 });
  redirect("/review");
}

/** Approve, hide, or send a story back to pending. Re-checks the session every time. */
export async function setStatus(formData: FormData): Promise<void> {
  const jar = await cookies();
  if (!sessionIsValid(jar.get(REVIEW_COOKIE)?.value)) redirect("/review");

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as ReviewStatus;
  if (!UUID.test(id) || !REVIEW_STATUSES.includes(status)) return;

  await setMomentStatus(id, status);
  revalidatePath("/review");
}

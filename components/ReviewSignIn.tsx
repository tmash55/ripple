"use client";

import { useActionState } from "react";
import { signIn, type SignInState } from "@/app/review/actions";

const INITIAL: SignInState = { error: null };

export default function ReviewSignIn() {
  const [state, action, pending] = useActionState(signIn, INITIAL);

  return (
    <form action={action} className="rv-signin">
      <label className="rv-label" htmlFor="rv-password">
        Review password
      </label>
      <input
        id="rv-password"
        className="rv-input"
        type="password"
        name="password"
        autoComplete="current-password"
        required
        autoFocus
      />
      {state.error ? (
        <p className="rv-error" role="alert">
          {state.error}
        </p>
      ) : null}
      <button type="submit" className="btn btn-primary rv-signin-btn" disabled={pending}>
        {pending ? "Checking…" : "Open the review queue"}
      </button>
    </form>
  );
}

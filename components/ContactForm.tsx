"use client";

import { useActionState } from "react";
import { sendContactMessage, type ContactState } from "@/app/contact/actions";

const INITIAL: ContactState = { status: "idle" };

export default function ContactForm({
  defaultTopic,
  defaultCode,
}: {
  defaultTopic: "remove" | "problem" | "other";
  defaultCode: string;
}) {
  const [state, action, pending] = useActionState(sendContactMessage, INITIAL);

  if (state.status === "sent") {
    return (
      <div className="rp-note rp-note-ok" role="status">
        <p className="rp-note-title">Thank you. Your message is with us.</p>
        <p>
          A person reads every one. If you left a way to reach you, we’ll
          write back; if you asked for something to be removed, it will be.
        </p>
      </div>
    );
  }

  if (state.status === "unavailable") {
    return (
      <div className="rp-note" role="status">
        <p className="rp-note-title">Messages aren’t open right now.</p>
        <p>Nothing was sent. Please try again a little later.</p>
      </div>
    );
  }

  return (
    <form action={action} className="rp-form">
      {/* Honeypot — hidden from people, tempting to bots. */}
      <div className="rp-hp" aria-hidden="true">
        <label>
          Leave this empty
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <label className="rp-label" htmlFor="ct-topic">
        What is this about?
      </label>
      <select id="ct-topic" name="topic" className="rp-input dc-select" defaultValue={defaultTopic}>
        <option value="remove">Remove something I wrote</option>
        <option value="problem">Something on the site is wrong</option>
        <option value="other">Something else</option>
      </select>

      <label className="rp-label" htmlFor="ct-text">
        Your message
      </label>
      <textarea
        id="ct-text"
        name="text"
        className="rp-input rp-textarea"
        rows={5}
        maxLength={2000}
        required
        placeholder="For a removal, a few words from the story are enough for us to find it."
      />

      <label className="rp-label" htmlFor="ct-code">
        Card or link code <span className="rp-optional">Optional</span>
      </label>
      <input
        id="ct-code"
        name="code"
        type="text"
        className="rp-input"
        maxLength={12}
        autoComplete="off"
        autoCapitalize="characters"
        defaultValue={defaultCode}
        placeholder="The six characters after ripple.cards/r/"
      />

      <label className="rp-label" htmlFor="ct-reply">
        How can we reach you? <span className="rp-optional">Optional</span>
      </label>
      <input
        id="ct-reply"
        name="reply_to"
        type="text"
        className="rp-input"
        maxLength={160}
        autoComplete="email"
        placeholder="An email or phone number, only if you want a reply"
      />
      <p className="rp-hint">
        Leave this empty and we’ll still act on your message; we just can’t
        write back.
      </p>

      {state.status === "invalid" && (
        <p className="rp-error" role="alert">{state.message}</p>
      )}
      {state.status === "error" && (
        <p className="rp-error" role="alert">
          That didn’t send. Nothing was lost on your end — please try once more.
        </p>
      )}

      <button type="submit" className="btn btn-primary rp-submit" disabled={pending}>
        {pending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}

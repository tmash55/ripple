"use client";

import { useActionState } from "react";
import { recordMoment, type RecordState } from "@/app/r/[code]/actions";

const INITIAL: RecordState = { status: "idle" };

export default function RecordForm({
  code,
  storeReady,
}: {
  code: string;
  storeReady: boolean;
}) {
  const [state, action, pending] = useActionState(recordMoment, INITIAL);

  // Shown up front when storage isn't connected, so nobody writes a story
  // that has nowhere to go.
  if (!storeReady || state.status === "setting_up") {
    return (
      <div className="rp-note" role="status">
        <p className="rp-note-title">We’re still setting up.</p>
        <p>
          Recording isn’t open quite yet, so nothing you write here would
          be saved. Keep the card, and come back in a few days — this
          link will always work.
        </p>
      </div>
    );
  }

  if (state.status === "saved") {
    return (
      <div className="rp-note rp-note-ok" role="status">
        <p className="rp-note-title">Thank you. It’s part of the story now.</p>
        <p>
          A person reads every moment before it appears here, so yours will
          show up on this card’s journey a little later.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="rp-form">
      <input type="hidden" name="code" value={code} />
      {/* Honeypot — hidden from people, tempting to bots. */}
      <div className="rp-hp" aria-hidden="true">
        <label>
          Leave this empty
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <label className="rp-label" htmlFor="rp-text">
        What reached you today?
      </label>
      <textarea
        id="rp-text"
        name="text"
        className="rp-input rp-textarea"
        rows={4}
        maxLength={500}
        required
        placeholder="Something someone did, said, or left for you."
      />

      <label className="rp-label" htmlFor="rp-place">
        Where are you? <span className="rp-optional">Optional</span>
      </label>
      <input
        id="rp-place"
        name="place"
        type="text"
        className="rp-input"
        maxLength={80}
        autoComplete="off"
        placeholder="City, State"
      />
      <p className="rp-hint">
        Just a town is plenty. We never ask for your name, an account, or your
        phone’s location.
      </p>

      {state.status === "invalid" && (
        <p className="rp-error" role="alert">{state.message}</p>
      )}
      {state.status === "error" && (
        <p className="rp-error" role="alert">
          That didn’t save. Nothing was lost on your end — please
          try once more.
        </p>
      )}

      <button type="submit" className="btn btn-primary rp-submit" disabled={pending}>
        {pending ? "Adding…" : "Add it to the story"}
      </button>
    </form>
  );
}

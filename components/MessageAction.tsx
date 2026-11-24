"use client";

import { useFormStatus } from "react-dom";
import { setMessageDone } from "@/app/review/actions";

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-sm btn-primary" disabled={pending}>
      {pending ? "Saving…" : label}
    </button>
  );
}

/** Marks a contact message handled. */
export default function MessageAction({ id }: { id: string }) {
  return (
    <form action={setMessageDone}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="status" value="done" />
      <Submit label="Mark handled" />
    </form>
  );
}

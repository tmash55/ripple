"use client";

import { useFormStatus } from "react-dom";
import { setStatus } from "@/app/review/actions";

function Submit({ label, primary }: { label: string; primary?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className={`btn btn-sm ${primary ? "btn-primary" : "btn-secondary"}`}
      disabled={pending}
    >
      {pending ? "Saving…" : label}
    </button>
  );
}

/** One button that moves a story to a new status. */
export default function ReviewAction({
  id,
  status,
  label,
  primary,
}: {
  id: string;
  status: "pending" | "approved" | "hidden";
  label: string;
  primary?: boolean;
}) {
  return (
    <form action={setStatus}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="status" value={status} />
      <Submit label={label} primary={primary} />
    </form>
  );
}

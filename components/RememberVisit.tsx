"use client";

import { useEffect } from "react";
import { rememberVisit } from "@/lib/device";

/** Notes, on this device only, that this ripple reached the person looking at it. */
export default function RememberVisit(props: {
  code: string;
  kind: "card" | "link";
  message: string;
  rootNumber: string | null;
  place: string | null;
}) {
  const { code, kind, message, rootNumber, place } = props;
  useEffect(() => {
    rememberVisit({ code, kind, message, rootNumber, place });
  }, [code, kind, message, rootNumber, place]);
  return null;
}

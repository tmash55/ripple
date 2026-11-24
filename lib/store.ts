// Storage for recorded moments and funnel events.
//
// The pages only ever talk to the RippleStore interface. Today there is one
// real implementation (Supabase over its REST API, no SDK dependency) and it
// only switches on when both env vars below are present. With no env vars,
// getStore() returns null and the UI says "we're still setting up" instead
// of pretending to save.
//
// NOTE: the Supabase adapter has NOT been run against a live project yet —
// no project exists. It is written against docs/supabase-schema-draft.sql.
import { createHash } from "node:crypto";

export type Moment = {
  id: string;
  text: string;
  place: string | null;
  generation: number;
  createdAt: string;
};

export type NewMoment = {
  code: string;
  text: string;
  place: string | null;
};

export type FunnelEvent = {
  code: string;
  type: "scan" | "record" | "share";
  /** Already hashed — see hashSession(). Never a raw IP. */
  sessionHash: string | null;
};

export interface RippleStore {
  /** Approved moments for a card, oldest first. */
  listApprovedMoments(code: string): Promise<Moment[]>;
  /** Saves a moment as `pending`; it is not public until someone approves it. */
  recordMoment(input: NewMoment): Promise<void>;
  /** Best-effort; must never throw into the page. */
  logEvent(event: FunnelEvent): Promise<void>;
}

/**
 * One-way session fingerprint for funnel counting. The raw IP is never
 * stored: it is mixed with the user agent, the UTC date (so the hash
 * rotates daily and cannot be used to follow someone over time) and a
 * server-side salt, then truncated.
 */
export function hashSession(ip: string | null, userAgent: string | null): string | null {
  const salt = process.env.RIPPLE_SESSION_SALT;
  if (!salt || !ip) return null;
  const day = new Date().toISOString().slice(0, 10);
  return createHash("sha256")
    .update(`${salt}|${day}|${ip}|${userAgent ?? ""}`)
    .digest("hex")
    .slice(0, 32);
}

class SupabaseStore implements RippleStore {
  constructor(
    private readonly url: string,
    private readonly anonKey: string,
  ) {}

  private headers(extra?: Record<string, string>) {
    return {
      apikey: this.anonKey,
      Authorization: `Bearer ${this.anonKey}`,
      "Content-Type": "application/json",
      ...extra,
    };
  }

  async listApprovedMoments(code: string): Promise<Moment[]> {
    // RLS only exposes approved rows to the anon role; the status filter is
    // belt-and-braces.
    const qs = new URLSearchParams({
      select: "id,text,place,generation,created_at",
      ripple_code: `eq.${code}`,
      status: "eq.approved",
      order: "created_at.asc,id.asc",
    });
    const res = await fetch(`${this.url}/rest/v1/moments?${qs}`, {
      headers: this.headers(),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`moments read failed: ${res.status}`);
    const rows = (await res.json()) as Array<{
      id: string;
      text: string;
      place: string | null;
      generation: number;
      created_at: string;
    }>;
    return rows.map((r) => ({
      id: r.id,
      text: r.text,
      place: r.place,
      generation: r.generation,
      createdAt: r.created_at,
    }));
  }

  async recordMoment(input: NewMoment): Promise<void> {
    // The record_moment() function resolves the ripple, sets the parent and
    // generation, and forces status = 'pending' server-side.
    const res = await fetch(`${this.url}/rest/v1/rpc/record_moment`, {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify({
        p_code: input.code,
        p_text: input.text,
        p_place: input.place,
      }),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`moment write failed: ${res.status}`);
  }

  async logEvent(event: FunnelEvent): Promise<void> {
    try {
      await fetch(`${this.url}/rest/v1/events`, {
        method: "POST",
        headers: this.headers({ Prefer: "return=minimal" }),
        body: JSON.stringify({
          ripple_code: event.code,
          type: event.type,
          session_hash: event.sessionHash,
        }),
        cache: "no-store",
      });
    } catch {
      // Funnel logging is best-effort.
    }
  }
}

/** Returns null until Supabase is configured. Callers must handle null. */
export function getStore(): RippleStore | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim().replace(/\/+$/, "");
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !anonKey) return null;
  return new SupabaseStore(url, anonKey);
}

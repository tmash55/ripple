// Storage for recorded moments and funnel events.
//
// The pages only ever talk to the RippleStore interface. Today there is one
// real implementation (Supabase over its REST API, no SDK dependency) and it
// only switches on when both env vars below are present. With no env vars,
// getStore() returns null and the UI says "we're still setting up" instead
// of pretending to save.
//
// Schema: supabase/migrations/. The public (anon) role can read ripples and
// approved moments, log events, and otherwise only call three functions:
// ripple_journey(), add_moment() (always saves as pending) and pass_it_on().
import { createHash } from "node:crypto";

export type Moment = {
  id: string;
  text: string;
  place: string | null;
  generation: number;
  createdAt: string;
  /** false = an earlier stop inherited from the ripple this one branched from. */
  here: boolean;
};

/** Everything a ripple's page needs. `kind` is a printed card or a passed-on link. */
export type Journey = {
  code: string;
  kind: "card" | "link";
  message: string;
  /** Card number within its batch; null for links. */
  number: number | null;
  /** Number of the printed card this ripple traces back to. */
  rootNumber: number | null;
  batchName: string | null;
  place: string | null;
  releasedOn: string | null;
  /** Approved stories only, oldest generation first. */
  moments: Moment[];
};

export type ReachCounts = {
  storyStatus: "pending" | "approved" | "hidden" | null;
  storiesAfter: number;
  generationsAfter: number;
  placesAfter: number;
  linkOpens: number | null;
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
  /** The ripple and its approved stories, or null if the code doesn't exist. */
  getJourney(code: string): Promise<Journey | null>;
  /** Saves a story as `pending` and returns its id; it is not public until approved. */
  recordMoment(input: NewMoment): Promise<string | null>;
  /**
   * Makes a personal link that branches from `code`. `momentId` is the story
   * this device recorded there, if any. Returns the new link's code.
   */
  passItOn(code: string, momentId: string | null): Promise<string>;
  /** Counts of what came after a story and/or a passed-on link. Null if neither is known. */
  reach(momentId: string | null, linkCode: string | null): Promise<ReachCounts | null>;
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

  private async rpc<T>(fn: string, body: Record<string, unknown>): Promise<T> {
    const res = await fetch(`${this.url}/rest/v1/rpc/${fn}`, {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify(body),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`${fn} failed: ${res.status}`);
    const text = await res.text();
    return (text ? JSON.parse(text) : null) as T;
  }

  async getJourney(code: string): Promise<Journey | null> {
    // One call returns the ripple, the card it traces back to, and its
    // approved stories (including earlier stops inherited by a link).
    const j = await this.rpc<{
      code: string;
      kind: "card" | "link";
      message: string;
      number: number | null;
      root_number: number | null;
      batch_name: string | null;
      place: string | null;
      released_on: string | null;
      moments: Array<{
        id: string;
        text: string;
        place: string | null;
        generation: number;
        created_at: string;
        here: boolean;
      }>;
    } | null>("ripple_journey", { p_code: code });
    if (!j) return null;
    return {
      code: j.code,
      kind: j.kind,
      message: j.message,
      number: j.number,
      rootNumber: j.root_number,
      batchName: j.batch_name,
      place: j.place,
      releasedOn: j.released_on,
      moments: j.moments.map((m) => ({
        id: m.id,
        text: m.text,
        place: m.place,
        generation: m.generation,
        createdAt: m.created_at,
        here: m.here,
      })),
    };
  }

  async recordMoment(input: NewMoment): Promise<string | null> {
    // add_moment() resolves the ripple, sets the parent and generation (a
    // chain on cards, siblings on links), and forces status = 'pending'.
    const id = await this.rpc<string | null>("add_moment", {
      p_code: input.code,
      p_text: input.text,
      p_place: input.place,
    });
    return typeof id === "string" ? id : null;
  }

  async passItOn(code: string, momentId: string | null): Promise<string> {
    const linkCode = await this.rpc<string>("pass_it_on", {
      p_code: code,
      p_moment_id: momentId,
    });
    if (typeof linkCode !== "string") throw new Error("pass_it_on returned no code");
    return linkCode;
  }

  async reach(momentId: string | null, linkCode: string | null): Promise<ReachCounts | null> {
    const r = await this.rpc<{
      story_status: "pending" | "approved" | "hidden" | null;
      stories_after: number;
      generations_after: number;
      places_after: number;
      link_opens: number | null;
    } | null>("reach", { p_moment_id: momentId, p_link_code: linkCode });
    if (!r) return null;
    return {
      storyStatus: r.story_status,
      storiesAfter: r.stories_after,
      generationsAfter: r.generations_after,
      placesAfter: r.places_after,
      linkOpens: r.link_opens,
    };
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

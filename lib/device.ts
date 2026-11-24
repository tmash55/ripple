// What this device remembers about the ripples that reached it.
//
// Browser-only, and it never leaves the browser: this is plain localStorage.
// There is no account, so this list is the only thing that makes
// "Things that reached me" yours. Clearing site data erases it.
//
// Keys:
//   ripple:reached          the list shown on /reached
//   ripple:moment:{code}    id of the story written on that ripple
//   ripple:link:{code}      the link made from that ripple ("Pass it on")

export type ReachedItem = {
  code: string;
  kind: "card" | "link";
  message: string;
  /** Zero-padded number of the printed card this traces back to, if known. */
  rootNumber: string | null;
  place: string | null;
  /** ISO time this device first opened it. */
  seenAt: string;
  story?: { id: string | null; text: string; place: string | null; at: string };
  link?: { code: string; at: string };
};

const LIST_KEY = "ripple:reached";
const MAX_ITEMS = 200;

function read(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Private browsing or storage full: nothing is remembered, nothing breaks.
  }
}

function remove(key: string) {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Same as above.
  }
}

export function readReached(): ReachedItem[] {
  try {
    const parsed = JSON.parse(read(LIST_KEY) ?? "[]");
    return Array.isArray(parsed) ? (parsed as ReachedItem[]) : [];
  } catch {
    return [];
  }
}

function save(items: ReachedItem[]) {
  write(LIST_KEY, JSON.stringify(items.slice(0, MAX_ITEMS)));
}

/** Called when a ripple page opens. Keeps the first-seen time if already known. */
export function rememberVisit(item: Omit<ReachedItem, "seenAt" | "story" | "link">) {
  const items = readReached();
  // A link this device made itself didn't "reach" it; opening it to check
  // how it looks shouldn't add it to the list.
  if (items.some((i) => i.link?.code === item.code)) return;

  const existing = items.find((i) => i.code === item.code);
  if (existing) {
    Object.assign(existing, item);
    save(items);
    return;
  }
  save([{ ...item, seenAt: new Date().toISOString() }, ...items]);
}

export function rememberStory(
  code: string,
  story: { id: string | null; text: string; place: string | null },
) {
  if (story.id) write(`ripple:moment:${code}`, story.id);
  const items = readReached();
  const item = items.find((i) => i.code === code);
  if (!item) return;
  item.story = { ...story, at: new Date().toISOString() };
  save(items);
}

export function storyIdFor(code: string): string | null {
  return read(`ripple:moment:${code}`);
}

type CachedLink = { code: string; momentId: string | null };

/** The link already made from this ripple, if it was made after the current story (or lack of one). */
export function linkFor(code: string): string | null {
  try {
    const cached = JSON.parse(read(`ripple:link:${code}`) ?? "null") as CachedLink | null;
    return cached && cached.momentId === storyIdFor(code) ? cached.code : null;
  } catch {
    return null;
  }
}

export function rememberLink(code: string, linkCode: string) {
  write(
    `ripple:link:${code}`,
    JSON.stringify({ code: linkCode, momentId: storyIdFor(code) } satisfies CachedLink),
  );
  const items = readReached();
  const item = items.find((i) => i.code === code);
  if (!item) return;
  item.link = { code: linkCode, at: new Date().toISOString() };
  save(items);
}

export function forget(code: string) {
  save(readReached().filter((i) => i.code !== code));
  remove(`ripple:moment:${code}`);
  remove(`ripple:link:${code}`);
}

export function forgetEverything() {
  for (const item of readReached()) {
    remove(`ripple:moment:${item.code}`);
    remove(`ripple:link:${item.code}`);
  }
  remove(LIST_KEY);
}

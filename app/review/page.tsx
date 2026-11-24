import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import RippleMark from "@/components/RippleMark";
import ReviewSignIn from "@/components/ReviewSignIn";
import ReviewAction from "@/components/ReviewAction";
import { signOut } from "./actions";
import {
  MIN_PASSWORD_LENGTH,
  REVIEW_COOKIE,
  REVIEW_STATUSES,
  getStats,
  listMoments,
  reviewSetup,
  sessionIsValid,
  type ReviewMoment,
  type ReviewStats,
  type ReviewStatus,
} from "@/lib/review";
import "./review.css";

export const metadata: Metadata = {
  title: "Ripple · Review",
  robots: { index: false, follow: false },
};

// Always rendered per request: what it shows depends on the visitor's cookie
// and on environment settings, never on anything known at build time.
export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ tab?: string }> };

const TAB_LABEL: Record<ReviewStatus, string> = {
  pending: "Waiting",
  approved: "Approved",
  hidden: "Hidden",
};

const EMPTY: Record<ReviewStatus, string> = {
  pending: "Nothing is waiting. New stories will show up here as people add them.",
  approved: "No stories have been approved yet.",
  hidden: "Nothing has been hidden.",
};

function when(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Chicago",
  });
}

const cardNo = (n: number | null) => (n == null ? "an unknown card" : `Card #${String(n).padStart(6, "0")}`);

function cardLabel(m: ReviewMoment): string {
  return m.ripple_kind === "link" ? `Link from ${cardNo(m.root_number)}` : cardNo(m.ripple_number);
}

function Shell({ children, signedIn }: { children: React.ReactNode; signedIn?: boolean }) {
  return (
    <main className="rv-page">
      <div className="rv-col">
        <header className="rv-top">
          <Link className="rv-brand" href="/">
            <RippleMark />
            Ripple
            <span className="rv-brand-sub">Review</span>
          </Link>
          {signedIn ? (
            <form action={signOut}>
              <button type="submit" className="rv-link">
                Sign out
              </button>
            </form>
          ) : null}
        </header>
        {children}
      </div>
    </main>
  );
}

function Stats({ stats }: { stats: ReviewStats }) {
  const items: Array<[string, number, string]> = [
    ["Scans", stats.scans, `${stats.cards_scanned} of ${stats.cards} cards`],
    ["Stories shared with us", stats.pending + stats.approved + stats.hidden, `${stats.approved} approved`],
    ["Passed on", stats.links, `${stats.link_opens} link ${stats.link_opens === 1 ? "open" : "opens"}`],
    ["Longest chain", stats.longest_chain, stats.longest_chain === 1 ? "generation" : "generations"],
    ["Places reached", stats.places, "typed by people"],
  ];
  return (
    <dl className="rv-stats">
      {items.map(([label, value, note]) => (
        <div className="rv-stat" key={label}>
          <dt>{label}</dt>
          <dd>{value.toLocaleString("en-US")}</dd>
          <p>{note}</p>
        </div>
      ))}
    </dl>
  );
}

function Story({ moment }: { moment: ReviewMoment }) {
  return (
    <li className="rv-story">
      <p className="rv-meta">
        {/* No prefetch: loading a ripple page counts as a scan. */}
        <Link href={`/r/${moment.ripple_code}`} prefetch={false}>
          {cardLabel(moment)}
        </Link>
        <span>Generation {moment.generation}</span>
        <span>{when(moment.created_at)}</span>
      </p>
      <p className="rv-text">{moment.text}</p>
      <p className="rv-place">{moment.place ? moment.place : "No place given"}</p>
      <p className="rv-card-msg">On the card: “{moment.ripple_message}”</p>
      <div className="rv-actions">
        {moment.status !== "approved" ? (
          <ReviewAction id={moment.id} status="approved" label="Approve" primary />
        ) : null}
        {moment.status !== "hidden" ? (
          <ReviewAction id={moment.id} status="hidden" label="Hide" />
        ) : null}
        {moment.status !== "pending" ? (
          <ReviewAction id={moment.id} status="pending" label="Back to waiting" />
        ) : null}
      </div>
    </li>
  );
}

export default async function ReviewPage({ searchParams }: Props) {
  const jar = await cookies();
  const setup = reviewSetup();
  if (setup !== "ready") {
    return (
      <Shell>
        <div className="rv-notice" role="status">
          <h1 className="rv-h1">Review isn’t set up yet.</h1>
          <p>
            {setup === "no_password"
              ? `Set RIPPLE_REVIEW_PASSWORD (at least ${MIN_PASSWORD_LENGTH} characters) in the project’s environment settings, then redeploy.`
              : "The review connection to the database hasn’t been configured."}
          </p>
        </div>
      </Shell>
    );
  }

  if (!sessionIsValid(jar.get(REVIEW_COOKIE)?.value)) {
    return (
      <Shell>
        <h1 className="rv-h1">Stories waiting to be read</h1>
        <p className="rv-sub">
          Every story is read by a person before it appears on a card’s page.
        </p>
        <ReviewSignIn />
      </Shell>
    );
  }

  const { tab } = await searchParams;
  const status: ReviewStatus = REVIEW_STATUSES.includes(tab as ReviewStatus)
    ? (tab as ReviewStatus)
    : "pending";

  let stats: ReviewStats | null = null;
  let moments: ReviewMoment[] = [];
  let failed = false;
  try {
    [stats, moments] = await Promise.all([getStats(), listMoments(status)]);
  } catch {
    failed = true;
  }

  return (
    <Shell signedIn>
      {failed || !stats ? (
        <div className="rv-notice" role="alert">
          <h1 className="rv-h1">We couldn’t load the stories.</h1>
          <p>Nothing was changed. Refresh the page to try again.</p>
        </div>
      ) : (
        <>
          <Stats stats={stats} />

          <nav className="rv-tabs" aria-label="Stories by status">
            {REVIEW_STATUSES.map((s) => (
              <Link
                key={s}
                href={s === "pending" ? "/review" : `/review?tab=${s}`}
                className={s === status ? "rv-tab rv-tab-on" : "rv-tab"}
                aria-current={s === status ? "page" : undefined}
              >
                {TAB_LABEL[s]}
                <span>{stats[s]}</span>
              </Link>
            ))}
          </nav>

          {moments.length === 0 ? (
            <p className="rv-empty">{EMPTY[status]}</p>
          ) : (
            <ul className="rv-list">
              {moments.map((m) => (
                <Story key={m.id} moment={m} />
              ))}
            </ul>
          )}
        </>
      )}
    </Shell>
  );
}

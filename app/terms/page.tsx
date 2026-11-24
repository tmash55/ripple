import type { Metadata } from "next";
import Link from "next/link";
import DocPage from "@/components/DocPage";
import "../r/[code]/scan.css";
import "../doc.css";

export const metadata: Metadata = {
  title: "Terms · Ripple",
  description: "The ground rules for using Ripple.",
};

export default function TermsPage() {
  return (
    <DocPage eyebrow="The ground rules" title="Terms">
      <p className="dc-lede">
        Ripple is free and needs no account. Using it means agreeing to the
        few things on this page.
      </p>

      <h2>What you write</h2>
      <ul>
        <li>Write only what is yours to tell, and keep it kind.</li>
        <li>Leave out other people’s full names, addresses, phone numbers and anything else that identifies someone who hasn’t agreed to it.</li>
        <li>Nothing hateful, threatening, sexual, or illegal, and no advertising.</li>
      </ul>
      <p>
        A person reads every story before it appears. We may decline or remove
        anything, for any reason, and we don’t always explain why.
      </p>

      <h2>Permission to show it</h2>
      <p>
        When you add a story, you allow Ripple to show it on this site and to
        share it when telling people about Ripple. We don’t have your name, so
        it is never attached. You can{" "}
        <Link href="/contact?topic=remove" prefetch={false}>ask us to remove it</Link> at any time.
      </p>

      <h2>Cards and links</h2>
      <p>
        A card is a gift. If you pass yours on, leave it somewhere you’re
        allowed to leave things, and where it won’t be a nuisance. A link you
        make can be opened by anyone you give it to.
      </p>

      <h2>This is not an emergency service</h2>
      <p>
        Nobody is watching Ripple in real time. If you or someone else is in
        danger, call 911 or your local emergency number.
      </p>

      <h2>No promises</h2>
      <p>
        Ripple is offered as it is. It may change, pause, or stop, and stories
        may be lost. To the extent the law allows, the people who run Ripple
        aren’t responsible for losses that come from using it.
      </p>

      <h2>Changes and questions</h2>
      <p>
        If these terms change, the date below changes with them. Questions go
        through the <Link href="/contact" prefetch={false}>contact page</Link>. See also{" "}
        <Link href="/privacy" prefetch={false}>Privacy</Link>.
      </p>

      <p className="dc-updated">Last updated November 24, 2026</p>
    </DocPage>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import DocPage from "@/components/DocPage";
import "../r/[code]/scan.css";
import "../doc.css";

export const metadata: Metadata = {
  title: "Privacy · Ripple",
  description: "What Ripple keeps, what stays on your device, and how to have something removed.",
};

export default function PrivacyPage() {
  return (
    <DocPage eyebrow="Plain language" title="Privacy">
      <p className="dc-lede">
        Ripple has no accounts. We never ask for your name, your email, or your
        phone’s location. This page says exactly what is kept and what isn’t.
      </p>

      <h2>When you open a card or a link</h2>
      <p>
        We count the visit against that card or link. To avoid counting the
        same person twice in a day, we keep a scrambled fingerprint made from
        your network address and browser. It changes every day and cannot be
        turned back into your address. We do not store the address itself.
      </p>

      <h2>When you add a story</h2>
      <p>We keep what you wrote, the town if you typed one, the time, and which card or link it was added to.</p>
      <p>
        A person reads every story before it appears publicly. Please don’t
        include other people’s full names, addresses, phone numbers, or
        anything else that would identify someone who hasn’t agreed to it.
      </p>

      <h2>When you pass it on</h2>
      <p>
        “Pass it on” makes a link of your own. Anyone you give that link to
        can open it, and it shows the approved stories that came before it.
      </p>

      <h2>What stays on your device</h2>
      <p>
        “Things that reached me” lives in your browser’s storage, on your
        device: the cards and links you opened, a copy of what you wrote, and
        the link you made. That list is never sent to us.
      </p>
      <p>
        To show what happened after you, your browser asks us for counts
        using the id of your story or link. We answer with numbers only.
        Clearing your browser’s data erases the list.
      </p>

      <h2>When you send us a message</h2>
      <p>
        We keep your message and, if you gave one, the email or phone number
        you asked us to reply to. Only the people who review stories can see
        it, and it is used only to answer you.
      </p>

      <h2>Cookies and tracking</h2>
      <p>
        Visitors get no cookies from Ripple. There are no advertising or
        analytics trackers. The only cookie is a sign-in cookie for the people
        who review stories.
      </p>

      <h2>Who helps us run it</h2>
      <p>
        The site is hosted by Vercel and the stories are stored with Supabase,
        both in the United States. They handle your request in order to
        deliver the page and keep their own technical logs.
      </p>

      <h2>How long things are kept</h2>
      <p>
        Stories and visit counts are part of a ripple’s history and are kept
        until they are removed. We don’t currently delete them on a schedule.
      </p>

      <h2>Having something removed</h2>
      <p>
        <Link href="/contact?topic=remove" prefetch={false}>Send us a message</Link> with the
        card or link code, or a few words from the story. We’ll take it down
        from the public page, and delete it from our records if you ask.
      </p>

      <h2>Children</h2>
      <p>
        Ripple is meant for adults and is not directed at children under 13.
        If a child has added something, tell us and we’ll remove it.
      </p>

      <h2>Who we are</h2>
      <p>
        Ripple is a small project that began in Ankeny, Iowa. If this page
        changes, the date below changes with it.
      </p>

      <p className="dc-updated">Last updated November 24, 2026</p>
    </DocPage>
  );
}

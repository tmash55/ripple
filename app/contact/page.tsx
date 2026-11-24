import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import DocPage from "@/components/DocPage";
import { isCodeShaped, normalizeCode } from "@/lib/genesis";
import "../r/[code]/scan.css";
import "../doc.css";

export const metadata: Metadata = {
  title: "Contact · Ripple",
  description: "Ask for a story to be removed, report a problem, or say hello.",
};

type Props = { searchParams: Promise<{ topic?: string; about?: string }> };

export default async function ContactPage({ searchParams }: Props) {
  const { topic, about } = await searchParams;
  const defaultTopic = topic === "remove" || topic === "problem" ? topic : "other";
  const defaultCode = about && isCodeShaped(about) ? normalizeCode(about) : "";

  return (
    <DocPage eyebrow="We read every message" title="Contact Ripple">
      <p className="dc-lede">
        Want something you wrote taken down, or found something that isn’t
        working? Tell us here. You don’t need to say who you are.
      </p>
      <ContactForm defaultTopic={defaultTopic} defaultCode={defaultCode} />
    </DocPage>
  );
}

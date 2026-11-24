import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

// Inter Variable — the full weight axis is required: the design system runs
// on non-standard weights (652 display / 456 ui / 300 body). See DESIGN.md.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const DESCRIPTION =
  "Fifty kindness cards began in Ankeny, Iowa. Each one carries a kind sentence and passes from hand to hand. If one found you, this is its story.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Ripple — a little kindness, passed from hand to hand",
  description: DESCRIPTION,
  openGraph: {
    siteName: "Ripple",
    type: "website",
    title: "Ripple — a little kindness, passed from hand to hand",
    description: DESCRIPTION,
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="no-js" suppressHydrationWarning>
        <script
          dangerouslySetInnerHTML={{
            __html: "document.body.classList.remove('no-js')",
          }}
        />
        {children}
      </body>
    </html>
  );
}

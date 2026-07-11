import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Inter Variable — the full weight axis is required: the design system runs
// on non-standard weights (652 display / 456 ui / 300 body). See DESIGN.md.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ripple — a little kindness, every state, all connected",
  description:
    "Print a card, do something kind, leave it anywhere. Ripple is a kindness-card movement traveling state to state.",
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

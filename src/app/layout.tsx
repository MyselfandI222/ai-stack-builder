import type { Metadata } from "next";
import { Manrope, Outfit } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-display",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "AI Stack Builder — Build Your AI-Powered Business Stack",
  description:
    "Type your startup idea and instantly get a curated AI automation stack under your budget. Built for solopreneurs, founders, and agency owners.",
  openGraph: {
    title: "AI Stack Builder",
    description: "Type your startup idea → get a curated AI automation stack under your budget.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${manrope.variable} ${outfit.variable}`}>
        <div className="min-h-screen mesh-gradient">{children}</div>
      </body>
    </html>
  );
}

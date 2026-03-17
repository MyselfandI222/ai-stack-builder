import type { Metadata } from "next";
import { Manrope, Outfit } from "next/font/google";
import { AuthProvider } from "@/lib/auth-context";
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
  title: "AI Tool Planner — Your AI-Powered Business Stack, Built in One Conversation",
  description:
    "Talk to Elliot, our AI consultant. In five minutes get a custom business plan, budget-optimized AI tool stack, and 90-day action plan. Built for founders, agencies, and solopreneurs.",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "AI Tool Planner — Build Your AI Business Stack",
    description:
      "One voice conversation. A complete AI-powered business plan and tool stack, custom-fit to your goals and budget.",
    type: "website",
    siteName: "AI Tool Planner",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Tool Planner — Build Your AI Business Stack",
    description:
      "Talk to Elliot, our AI consultant. Get a custom business plan and optimized tool stack in five minutes.",
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
        <AuthProvider>
          <div className="min-h-screen mesh-gradient noise-overlay">{children}</div>
        </AuthProvider>
      </body>
    </html>
  );
}

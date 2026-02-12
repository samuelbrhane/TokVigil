import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UsageSentinel - AI Usage Control for Production Teams",
  description:
    "Application-layer AI usage control. Enforce budgets, limits, and policies inside your code with Python & TypeScript SDKs.",
  keywords: [
    "AI",
    "usage control",
    "rate limiting",
    "budget",
    "LLM",
    "SDK",
    "developer tools",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-surface-950 text-surface-300 antialiased">
        {children}
      </body>
    </html>
  );
}

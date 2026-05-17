// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "JIMS Software Inc. — AI Analytics & Modern Engineering",
  description:
    "Intelligent dashboards, AI-powered insights, and scalable cloud-native platforms. Built for founders and CTOs who need results.",
  keywords: ["AI", "software engineering", "dashboards", "cloud", "TypeScript", "Next.js"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      {/*
        IMPORTANT: Do NOT put overflow-hidden on body — it prevents vertical scroll.
        overflow-x:clip is set in globals.css on body instead.
      */}
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

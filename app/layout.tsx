import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
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
  title: "JIMS — AI Analytics and Modern Engineering",
  description:
    "Intelligent dashboards, AI-powered insights, and scalable cloud-native platforms. Built for founders and CTOs who need results.",
  keywords: [
    "AI",
    "software engineering",
    "dashboards",
    "cloud",
    "TypeScript",
    "Next.js",
  ],
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
      <head>
        {/* Modern Next.js Script Integration for VEKTORQ Ingestion Engine */}
        <Script
          src="/vektorq-tracker.js"
          strategy="afterInteractive"
          data-site-id="vektorq-main"
          data-debug="true"
          data-endpoint="https://vektorq.com/api/events"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

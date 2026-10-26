import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono, Borel } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme";
import { Pulse } from "@/components/Pulse";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const borel = Borel({
  variable: "--font-borel",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shiv Rajput — Full-stack Engineer",
  description:
    "Full-stack engineer building production systems end to end — APIs, cloud infrastructure, and interfaces that feel considered.",
  openGraph: {
    title: "Shiv Rajput — Full-stack Engineer",
    description: "Full-stack engineer building production systems end to end.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${borel.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>{children}</ThemeProvider>
        <Pulse />
        {/* umami: ~2KB, loads after hydration — zero impact on first paint */}
        {process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
          <Script
            src={
              process.env.NEXT_PUBLIC_UMAMI_SRC ||
              "https://cloud.umami.is/script.js"
            }
            data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
            strategy="lazyOnload"
          />
        )}
      </body>
    </html>
  );
}

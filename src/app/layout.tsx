import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PulseX — The Future of IPL Fan Engagement",
  description:
    "PulseX redefines how fans experience live cricket. Real-time predictions, live leaderboards, AI companion, mini-games and immersive match energy — all in one cinematic second-screen experience.",
  keywords: ["IPL", "cricket", "fan engagement", "live predictions", "PulseX", "second screen"],
  authors: [{ name: "PulseX Team" }],
  openGraph: {
    title: "PulseX — The Future of IPL Fan Engagement",
    description: "Join millions of fans on PulseX. Predict. Compete. Win.",
    type: "website",
  },
};

import AppWrapper from "@/components/AppWrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${geistMono.variable}`}>
      <body className="bg-deep-space text-white antialiased overflow-x-hidden">
        <AppWrapper>
          {children}
        </AppWrapper>
      </body>
    </html>
  );
}

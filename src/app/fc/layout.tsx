/**
 * @title Farcaster MiniApp Layout
 * @notice Dedicated layout for Farcaster miniApps (/fc/*)
 * @dev KISS principle: Minimal layout optimized for mobile Farcaster frames
 * @dev Inherits providers from root layout but with miniApp-specific optimizations
 */

import { BottomNav, FarcasterHeader } from "@/components/farcaster";
import type { Metadata } from "next";
import localFont from "next/font/local";

const spartanFont = localFont({
  src: [
    {
      path: "../../assets/LeagueSpartan-Bold.ttf",
      style: "bold",
    },
  ],
  display: "swap",
});

export const metadata: Metadata = {
  title: "GeoChallenge - Farcaster",
  description: "Trading card competitions on Base",
};

export default function FarcasterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-background">
      <FarcasterHeader />
      <main className="pb-16">{children}</main>
      <BottomNav />
    </div>
  );
}

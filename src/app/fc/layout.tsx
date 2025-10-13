/**
 * @title Farcaster MiniApp Layout
 * @notice Dedicated layout for Farcaster miniApps (/fc/*)
 * @dev KISS principle: Minimal layout optimized for mobile Farcaster frames
 * @dev Inherits providers from root layout but with miniApp-specific optimizations
 */

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
      {/* Minimal header for miniApps - no navigation, no wallet connect UI */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-12 items-center px-3">
          <div className={`flex items-center gap-2 ${spartanFont.className}`}>
            <span className="text-xl font-extrabold tracking-tighter">
              GEOCHALLENGE
            </span>
          </div>
        </div>
      </header>

      {/* Main content - no max-width constraints for full mobile width */}
      <main className="pb-16">{children}</main>

      {/* Minimal footer for miniApps */}
      <footer className="border-t py-4">
        <div className="container px-3 text-center text-[10px] text-muted-foreground italic">
          powered by GeoChallenge
        </div>
      </footer>
    </div>
  );
}

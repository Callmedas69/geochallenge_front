/**
 * @title Farcaster MiniApp Layout
 * @notice Dedicated layout for Farcaster miniApps (/miniapps/*)
 * @dev KISS principle: Minimal layout optimized for mobile Farcaster frames
 * @dev Inherits providers from root layout but with miniApp-specific optimizations
 */

import { BottomNav, FarcasterHeader } from "@/components/farcaster";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { FARCASTER_SHARING, createFarcasterEmbed } from "@/lib/farcaster/sharing-config";

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
  title: "GeoChallenge - Compete, Collect, Conquer",
  description: "Complete your VibeMarket trading card sets, earn prizes, and prove your grind on Base.",
  openGraph: {
    title: "GeoChallenge",
    description: "Complete your VibeMarket trading card sets and win prizes",
    images: [FARCASTER_SHARING.platformOgUrl],
  },
  other: {
    // Primary metadata for Farcaster MiniApps (modern)
    "fc:miniapp": JSON.stringify(
      createFarcasterEmbed({
        imageUrl: FARCASTER_SHARING.platformOgUrl,
        buttonTitle: FARCASTER_SHARING.platformButtonText,
        actionUrl: FARCASTER_SHARING.homeUrl,
        legacy: false, // Use 'launch_miniapp' for modern clients
      })
    ),
    // Backward compatibility with older Farcaster clients
    "fc:frame": JSON.stringify(
      createFarcasterEmbed({
        imageUrl: FARCASTER_SHARING.platformOgUrl,
        buttonTitle: FARCASTER_SHARING.platformButtonText,
        actionUrl: FARCASTER_SHARING.homeUrl,
        legacy: true, // Use 'launch_frame' for old clients
      })
    ),
  },
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

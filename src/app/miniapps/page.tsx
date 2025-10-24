/**
 * @title Farcaster MiniApp Homepage
 * @notice Minimal homepage optimized for Farcaster frames
 * @dev KISS principle: No hero section, just active competitions
 * @dev Route: /miniapps (Farcaster-specific route)
 */

"use client";

import { CompetitionList } from "@/components/farcaster";
import { EventNotifications } from "@/components/EventNotifications";
import { useAutoConnect } from "@/lib/farcaster";
import { ShareButton } from "@/components/farcaster/ShareButton";
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

export default function FarcasterHomePage() {
  // Auto-connect Farcaster wallet
  useAutoConnect();

  return (
    <>
      <div className="container mx-auto px-3 py-4 pb-20 space-y-4">
        {/* Global event notifications - compact */}
        <EventNotifications />

        {/* Header - Minimal */}
        <div className="space-y-1 min-h-[calc(100vh-60px)] flex items-center justify-center px-12">
          <div>
            <h1
              className={`text-6xl font-bold tracking-tighter uppercase flex flex-col leading-none ${spartanFont.className}`}
            >
              <span>Compete</span>
              <span>Collect</span>
              <span>Conquer</span>
            </h1>
            <p className="text-xs text-muted-foreground mb-6">
              Complete your VibeMarket trading card sets, earn prize prizes, and
              prove your grind on Base.
            </p>
            <ShareButton
              type="platform"
              className="mt-4"
            />
          </div>
        </div>

        {/* Main Content: Active Competitions Only - No Hero */}
        <section>
          <h1 className="font-bold text-sm mb-3">ACTIVE COMPETITION</h1>
          <CompetitionList />
        </section>
      </div>
    </>
  );
}

/**
 * @title Farcaster MiniApp Homepage
 * @notice Minimal homepage optimized for Farcaster frames
 * @dev KISS principle: No hero section, just active competitions
 * @dev Route: /fc (Farcaster-specific route)
 */

"use client";

import { CompetitionList } from "@/components/farcaster";
import { EventNotifications } from "@/components/EventNotifications";
import { useEffect } from "react";
import { initFarcasterSDK } from "@/lib/farcaster";
import { useAccount, useConnect } from "wagmi";
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
  const { isConnected } = useAccount();
  const { connect, connectors } = useConnect();

  // Initialize SDK and auto-connect wallet
  useEffect(() => {
    // Initialize Farcaster SDK
    initFarcasterSDK();

    // Auto-connect wallet if not already connected
    if (!isConnected && connectors.length > 0) {
      // Find Farcaster connector
      const farcasterConnector = connectors.find(
        (c) => c.name === "Farcaster Mini App"
      );

      if (farcasterConnector) {
        connect({ connector: farcasterConnector });
      }
    }
  }, [isConnected, connect, connectors]);

  return (
    <div className="container mx-auto px-3 py-4 space-y-4">
      {/* Global event notifications - compact */}
      <EventNotifications />

      {/* Header - Minimal */}
      <div className="space-y-1 min-h-screen flex items-center justify-center px-12">
        <div>
          <h1
            className={`text-6xl font-bold tracking-tighter uppercase flex flex-col leading-none ${spartanFont.className}`}
          >
            <span>Compete</span>
            <span>Collect</span>
            <span>Conquer</span>
          </h1>
          <p className="text-xs text-muted-foreground">
            Complete VibeMarket trading card sets, earn ETH prizes, and prove
            your grind on Base.
          </p>
        </div>
      </div>

      {/* Main Content: Active Competitions Only - No Hero */}
      <section>
        <CompetitionList />
      </section>
    </div>
  );
}

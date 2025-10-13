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
      <div className="space-y-1">
        <h1 className="text-lg font-bold tracking-tight">
          Active Competitions
        </h1>
        <p className="text-xs text-muted-foreground">
          Complete the sets, win prizes
        </p>
      </div>

      {/* Main Content: Active Competitions Only - No Hero */}
      <section>
        <CompetitionList />
      </section>
    </div>
  );
}

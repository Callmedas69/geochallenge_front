/**
 * @title Farcaster MiniApp Homepage
 * @notice Minimal homepage optimized for Farcaster frames
 * @dev KISS principle: No hero section, just active competitions
 * @dev Route: /fc (Farcaster-specific route)
 */

"use client";

import { FarcasterCompetitionList } from "@/components/FarcasterCompetitionList";
import { EventNotifications } from "@/components/EventNotifications";
import { useEffect, useState } from "react";
import { sdk } from "@farcaster/miniapp-sdk";

export default function FarcasterHomePage() {
  const [isReady, setIsReady] = useState(false);

  // Call ready() once page content is loaded
  useEffect(() => {
    // Small delay to ensure DOM is fully painted
    const timer = setTimeout(async () => {
      try {
        await sdk.actions.ready();
        setIsReady(true);
        console.log("✅ Farcaster SDK: Ready call successful from /fc page");
      } catch (error) {
        console.warn("⚠️ Farcaster SDK: Not in miniApp context", error);
        setIsReady(true); // Still show content if not in Farcaster
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

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
        <FarcasterCompetitionList />
      </section>
    </div>
  );
}

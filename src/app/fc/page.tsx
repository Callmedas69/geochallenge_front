/**
 * @title Farcaster MiniApp Homepage
 * @notice Minimal homepage optimized for Farcaster frames
 * @dev KISS principle: No hero section, just active competitions
 * @dev Route: /fc (Farcaster-specific route)
 * @dev SDK ready() is already called in root layout via MiniAppInit
 */

"use client";

import { FarcasterCompetitionList } from "@/components/FarcasterCompetitionList";
import { EventNotifications } from "@/components/EventNotifications";

export default function FarcasterHomePage() {
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

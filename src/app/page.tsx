/**
 * @title Homepage
 * @notice Main landing page with platform stats and competitions
 * @dev KISS principle: Simple layout with competitions list
 */

"use client";

import { PlatformStats } from "@/components/PlatformStats";
import { CompetitionList } from "@/components/CompetitionList";
import { EventNotifications } from "@/components/EventNotifications";
import { Separator } from "@/components/ui/separator";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Global event notifications (Phase 4) */}
      <EventNotifications />

      {/* Hero Section */}
      <div className="text-center space-y-4 py-8 min-h-screen flex items-center justify-center">
        <p className="text-2xl font-bold italic max-w-2xl mx-auto">
          "Complete the sets, win prizes."
        </p>
      </div>

      <Separator />

      {/* Main Content: Competitions */}
      <section className="space-y-4 mb-8">
        <h2 className="text-2xl font-bold tracking-tight">Competitions</h2>
        <CompetitionList />
      </section>
    </div>
  );
}

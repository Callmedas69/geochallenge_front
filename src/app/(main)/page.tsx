/**
 * @title Homepage
 * @notice Main landing page showing active competitions only
 * @dev KISS principle: Simple layout with active competitions
 */

"use client";

import { ActiveCompetitionList } from "@/components/ActiveCompetitionList";
import { EventNotifications } from "@/components/EventNotifications";
import { ShareIcons } from "@/components/web/ShareIcons";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Global event notifications */}
      <EventNotifications />

      {/* Hero Section */}
      <div className="text-center space-y-4 py-8 min-h-[calc(100vh-8rem)] md:min-h-[calc(100vh-6rem)] flex flex-col items-center justify-center">
        <p className="text-lg sm:text-xl md:text-2xl font-bold italic max-w-2xl mx-auto px-4">
          "Complete the sets, win prizes."
        </p>
        <ShareIcons type="platform" />
      </div>

      <Separator />

      {/* Main Content: Active Competitions Only */}
      <section className="space-y-4 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Active Competitions
          </h2>
          <Link href="/browse">
            <Button variant="outline" className="w-full sm:w-auto">
              View All Competitions
            </Button>
          </Link>
        </div>
        <ActiveCompetitionList />
      </section>
    </div>
  );
}

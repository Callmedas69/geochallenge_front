/**
 * @title Homepage
 * @notice Main landing page showing active competitions only
 * @dev KISS principle: Simple layout with active competitions
 */

"use client";

import { ActiveCompetitionList } from "@/components/ActiveCompetitionList";
import { EventNotifications } from "@/components/EventNotifications";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Global event notifications */}
      <EventNotifications />

      {/* Hero Section */}
      <div className="text-center space-y-4 py-8 min-h-screen flex items-center justify-center">
        <p className="text-2xl font-bold italic max-w-2xl mx-auto">
          "Complete the sets, win prizes."
        </p>
      </div>

      <Separator />

      {/* Main Content: Active Competitions Only */}
      <section className="space-y-4 mb-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">
            Active Competitions
          </h2>
          <Link href="/browse">
            <Button variant="outline">View All Competitions</Button>
          </Link>
        </div>
        <ActiveCompetitionList />
      </section>
    </div>
  );
}

/**
 * @title Browse Page
 * @notice Browse all competitions with filtering (All/Active tabs)
 * @dev KISS principle: Simple tabbed interface for competition browsing
 */

"use client";

import { CompetitionList } from "@/components/CompetitionList";
import { Separator } from "@/components/ui/separator";

export default function BrowsePage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Browse Competitions
        </h1>
        <p className="text-muted-foreground">
          Explore all competitions - active, completed, and upcoming
        </p>
      </div>

      <Separator />

      {/* Competition List with Tabs */}
      <section>
        <CompetitionList />
      </section>
    </div>
  );
}

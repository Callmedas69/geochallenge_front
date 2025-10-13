/**
 * @title CompetitionList Component
 * @notice Active competitions list optimized for Farcaster miniApps
 * @dev KISS principle: Single column, tight spacing, fast loading
 * @dev Shows only active competitions (no tabs, no "all" view)
 */

"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useCompetitionCount,
  useActiveCompetitions,
} from "@/hooks/usePublicCompetitions";
import { CompetitionCard } from "@/components/farcaster/CompetitionCard";

/**
 * Active competitions list for Farcaster miniApps
 * Single column, compact spacing, prioritized image loading
 */
export function CompetitionList() {
  const { data: totalComps, isLoading: loadingTotal } = useCompetitionCount();
  const { data: activeIds, isLoading: loadingActive } = useActiveCompetitions();

  const activeCompetitionIds = activeIds?.[0] || [];

  if (loadingTotal || loadingActive) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <div className="flex gap-3 p-3">
              <Skeleton className="w-[100px] aspect-[5/7] flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (activeCompetitionIds.length === 0) {
    return (
      <Card>
        <CardHeader className="p-4">
          <CardTitle className="text-base">No Active Competitions</CardTitle>
          <CardDescription className="text-sm">
            There are no active competitions at the moment. Check back soon!
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {activeCompetitionIds.map((id, index) => (
        <CompetitionCard
          key={id.toString()}
          competitionId={id}
          priority={index < 3} // Prioritize first 3 images for faster LCP
        />
      ))}
    </div>
  );
}

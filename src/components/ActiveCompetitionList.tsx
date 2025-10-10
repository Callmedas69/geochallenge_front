/**
 * @title ActiveCompetitionList Component
 * @notice Displays only active competitions - simple and clean
 * @dev KISS principle: No tabs, just active competitions
 */

"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useCompetitionCount,
  useActiveCompetitions,
} from "@/hooks/usePublicCompetitions";
import { CompetitionCard } from "@/components/CompetitionCard";

/**
 * Active competitions list - simple display without tabs
 */
export function ActiveCompetitionList() {
  const { data: totalComps, isLoading: loadingTotal } = useCompetitionCount();
  const { data: activeIds, isLoading: loadingActive } = useActiveCompetitions();

  const activeCompetitionIds = activeIds?.[0] || [];

  if (loadingTotal || loadingActive) {
    return (
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <div className="flex gap-4">
                <div className="w-32 flex-shrink-0">
                  <Skeleton className="aspect-[5/7] rounded-l-lg" />
                </div>
                <div className="flex-1 py-6 pr-6">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2 mt-2" />
                  <Skeleton className="h-20 w-full mt-4" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (activeCompetitionIds.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Active Competitions</CardTitle>
          <CardDescription>
            There are no active competitions at the moment. Check back soon!
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {activeCompetitionIds.map((id) => (
        <CompetitionCard key={id.toString()} competitionId={id} />
      ))}
    </div>
  );
}

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
      <div className="space-y-4 sm:space-y-6">
        <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-44 flex-shrink-0 p-6">
                  <Skeleton className="aspect-[5/7] max-w-[200px] mx-auto sm:max-w-none" />
                </div>
                <div className="flex-1 p-6 pt-4 sm:pt-6">
                  <Skeleton className="h-5 sm:h-6 w-3/4" />
                  <Skeleton className="h-3 sm:h-4 w-1/2 mt-2" />
                  <Skeleton className="h-16 sm:h-20 w-full mt-4" />
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
        <CardHeader className="p-6">
          <CardTitle className="text-lg">No Active Competitions</CardTitle>
          <CardDescription className="text-sm">
            There are no active competitions at the moment. Check back soon!
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
      {activeCompetitionIds.map((id) => (
        <CompetitionCard key={id.toString()} competitionId={id} />
      ))}
    </div>
  );
}

/**
 * @title CompetitionList Component
 * @notice Displays list of all competitions with tabs (All/Active)
 * @dev Public component - no wallet required
 * @dev Uses smart caching from usePublicCompetitions hooks
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useCompetitionCount,
  useActiveCompetitions,
} from "@/hooks/usePublicCompetitions";
import { CompetitionCard } from "@/components/CompetitionCard";

/**
 * Main competition list component with tabs
 */
export function CompetitionList() {
  const { data: totalComps, isLoading: loadingTotal } = useCompetitionCount();
  const { data: activeIds, isLoading: loadingActive } = useActiveCompetitions();

  const totalCount =
    totalComps && totalComps > BigInt(0) ? Number(totalComps - BigInt(1)) : 0;
  const activeCompetitionIds = activeIds?.[0] || [];

  // Generate array of all competition IDs
  const allCompetitionIds = Array.from({ length: totalCount }, (_, i) =>
    BigInt(i + 1)
  );

  if (loadingTotal || loadingActive) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-full max-w-md" />
        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (totalCount === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Competitions Yet</CardTitle>
          <CardDescription>
            No competitions have been created yet. Check back soon!
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="all">All ({totalCount})</TabsTrigger>
          <TabsTrigger value="active">
            Active ({activeCompetitionIds.length})
          </TabsTrigger>
        </TabsList>

        {/* All Competitions Tab */}
        <TabsContent value="all" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {allCompetitionIds.map((id) => (
              <CompetitionCard key={id.toString()} competitionId={id} />
            ))}
          </div>
        </TabsContent>

        {/* Active Competitions Tab */}
        <TabsContent value="active" className="space-y-6">
          {activeCompetitionIds.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No Active Competitions</CardTitle>
                <CardDescription>
                  There are no active competitions at the moment.
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {activeCompetitionIds.map((id) => (
                <CompetitionCard key={id.toString()} competitionId={id} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
  
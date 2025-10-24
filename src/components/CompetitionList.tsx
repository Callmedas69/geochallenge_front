/**
 * @title CompetitionList Component
 * @notice Displays list of all competitions with tabs (All/Active) and sorting
 * @dev Public component - no wallet required
 * @dev Uses smart caching from usePublicCompetitions hooks
 */

"use client";

import { useState } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCompetitionCount,
  useActiveCompetitions,
} from "@/hooks/usePublicCompetitions";
import { CompetitionCard } from "@/components/CompetitionCard";
import { useSortedCompetitions, type SortOption, SORT_OPTIONS } from "@/hooks/useSortedCompetitions";
import { ArrowUpDown } from "lucide-react";

/**
 * Main competition list component with tabs and sorting
 */
export function CompetitionList() {
  const { data: totalComps, isLoading: loadingTotal } = useCompetitionCount();
  const { data: activeIds, isLoading: loadingActive } = useActiveCompetitions();
  const [sortBy, setSortBy] = useState<SortOption>("tickets");

  const totalCount =
    totalComps && totalComps > BigInt(0) ? Number(totalComps - BigInt(1)) : 0;
  const activeCompetitionIds = activeIds?.[0] || [];

  // Generate array of all competition IDs
  const allCompetitionIds = Array.from({ length: totalCount }, (_, i) =>
    BigInt(i + 1)
  );

  // Apply sorting to both all and active competitions
  const { sortedIds: sortedAllIds, isLoading: loadingSortAll } = useSortedCompetitions(
    allCompetitionIds,
    sortBy
  );
  const { sortedIds: sortedActiveIds, isLoading: loadingSortActive } = useSortedCompetitions(
    activeCompetitionIds,
    sortBy
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
        {/* Tabs + Sort Dropdown */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="all">All ({totalCount})</TabsTrigger>
            <TabsTrigger value="active">
              Active ({activeCompetitionIds.length})
            </TabsTrigger>
          </TabsList>

          {/* Sort Dropdown */}
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <ArrowUpDown className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tickets">{SORT_OPTIONS.tickets}</SelectItem>
              <SelectItem value="deadline">{SORT_OPTIONS.deadline}</SelectItem>
              <SelectItem value="id">{SORT_OPTIONS.id}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* All Competitions Tab */}
        <TabsContent value="all" className="space-y-6">
          {loadingSortAll ? (
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
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {sortedAllIds.map((id) => (
                <CompetitionCard key={id.toString()} competitionId={id} />
              ))}
            </div>
          )}
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
          ) : loadingSortActive ? (
            <div className="grid gap-6 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
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
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {sortedActiveIds.map((id) => (
                <CompetitionCard key={id.toString()} competitionId={id} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
  
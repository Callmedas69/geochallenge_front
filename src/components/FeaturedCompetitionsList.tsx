/**
 * @title FeaturedCompetitionsList Component
 * @notice Displays featured competitions from Supabase, falls back to active
 * @dev KISS principle: Simple display with featured badge
 */

"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useFeaturedCompetitions } from "@/hooks/supabase/useFeaturedCompetitions";
import { useActiveCompetitions } from "@/hooks/usePublicCompetitions";
import { CompetitionCard } from "@/components/CompetitionCard";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

/**
 * Featured competitions list with fallback to active
 */
export function FeaturedCompetitionsList() {
  const { data: featuredIds, isLoading: loadingFeatured } =
    useFeaturedCompetitions();
  const { data: activeIds, isLoading: loadingActive } = useActiveCompetitions();

  const activeCompetitionIds = activeIds?.[0] || [];
  const hasFeatured = featuredIds && featuredIds.length > 0;

  // Show what we're displaying
  const displayIds = hasFeatured
    ? featuredIds.map((id) => BigInt(id))
    : activeCompetitionIds;

  const isFeaturedMode = hasFeatured;
  const isLoading = loadingFeatured || (loadingActive && !hasFeatured);

  if (isLoading) {
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

  if (displayIds.length === 0) {
    return (
      <Card>
        <CardHeader className="p-6">
          <CardTitle className="text-lg">No Competitions Available</CardTitle>
          <CardDescription className="text-sm">
            There are no competitions at the moment. Check back soon!
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Featured Badge (only show when displaying featured) */}
      {isFeaturedMode && (
        <div className="flex items-center gap-2 justify-between">
          <Badge
            variant="default"
            className="gap-1.5 font-bold text-3xl bg-black rounded-none"
          >
            <Sparkles className="h-3 w-3" />
            Featured Competitions
          </Badge>
          <Link href="/browse">
            <span className="text-xs hover:underline">
              View All Competitions
            </span>
          </Link>
        </div>
      )}

      {/* Competition Grid */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
        {displayIds.map((id) => (
          <CompetitionCard key={id.toString()} competitionId={id} />
        ))}
      </div>
    </div>
  );
}

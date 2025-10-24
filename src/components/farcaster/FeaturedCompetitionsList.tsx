/**
 * @title FeaturedCompetitionsList Component (Farcaster)
 * @notice Featured competitions list optimized for Farcaster miniApps
 * @dev KISS principle: Single column, tight spacing, with fallback to active
 */

"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useFeaturedCompetitions } from "@/hooks/supabase/useFeaturedCompetitions";
import { useActiveCompetitions } from "@/hooks/usePublicCompetitions";
import { CompetitionCard } from "@/components/farcaster/CompetitionCard";
import { Sparkles } from "lucide-react";

/**
 * Featured competitions list for Farcaster miniApps
 * Single column, compact spacing, with fallback to active
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

  if (displayIds.length === 0) {
    return (
      <Card>
        <CardHeader className="p-4">
          <CardTitle className="text-base">No Competitions Available</CardTitle>
          <CardDescription className="text-sm">
            There are no competitions at the moment. Check back soon!
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {/* Featured Badge (only show when displaying featured) */}
      {isFeaturedMode && (
        <Badge
          variant="default"
          className="gap-1 bg-black text-lg rounded-none"
        >
          <Sparkles className="h-3 w-3" />
          Featured
        </Badge>
      )}

      {/* Competition List */}
      {displayIds.map((id, index) => (
        <CompetitionCard
          key={id.toString()}
          competitionId={id}
          priority={index < 3} // Prioritize first 3 images for faster LCP
        />
      ))}
    </div>
  );
}

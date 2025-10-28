/**
 * @title CompetitionProgress Component (Farcaster)
 * @notice Compact progress display for Farcaster miniApps
 * @dev KISS principle: Mobile-optimized, all-in-one progress display
 * @dev Shows overall progress with completion alert
 */

"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, RefreshCw } from "lucide-react";

interface ProgressData {
  totalRequired: number;
  totalOwned: number;
  percentage: number;
  rarityBreakdown: Record<number, { required: number; owned: number }>;
  isComplete: boolean;
}

interface CompetitionProgressProps {
  /** Progress data from useProgressCalculator hook */
  progress: ProgressData | null;
  /** Loading state */
  loading: boolean;
  /** User wallet address */
  address: string | undefined;
  /** Whether user owns a ticket */
  hasTicket: boolean;
  /** Optional: Manual refetch callback */
  onRefetch?: () => void;
  /** Optional: Refetching state */
  isRefetching?: boolean;
  /** Optional: Competition ID for fetching stats */
  competitionId?: bigint;
}

/**
 * Competition Progress Component (Farcaster)
 * Compact progress display for mobile
 */
export function CompetitionProgress({
  progress,
  loading,
  address,
  hasTicket,
  onRefetch,
  isRefetching = false,
  competitionId,
}: CompetitionProgressProps) {
  const [stats, setStats] = useState<{ highestProgress: number } | null>(null);

  // Fetch competition stats if competitionId provided
  useEffect(() => {
    if (competitionId) {
      fetch(`/api/stats/user-progress?competitionId=${competitionId}&limit=1`)
        .then((res) => res.json())
        .then((result) => {
          if (result.success && result.data && result.data.length > 0) {
            setStats({ highestProgress: result.data[0].percentage });
          }
        })
        .catch(() => {})
    }
  }, [competitionId]);

  // Don't show if user doesn't have ticket or isn't connected
  if (!address || !hasTicket) {
    return null;
  }

  const bestProgress = stats?.highestProgress ?? 0;

  return (
    <Card>
      <CardContent className="p-3 space-y-2">
        {loading ? (
          <Skeleton className="h-16 w-full" />
        ) : progress ? (
          <>
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Overall Progress</span>
                  {onRefetch && (
                    <button
                      onClick={onRefetch}
                      disabled={isRefetching}
                      className="flex items-center gap-1 text-xs px-2 py-1 rounded-md hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <RefreshCw className={`h-3 w-3 ${isRefetching ? 'animate-spin' : ''}`} />
                      <span>Update</span>
                    </button>
                  )}
                </div>

                {/* Competition Stats Inline */}
                <div className="font-bold text-sm">
                  {bestProgress > 0 && progress.percentage >= bestProgress ? (
                    // User is leading
                    <>
                      <span className="text-blue-600">
                        Your: {progress.percentage.toFixed(1)}%
                      </span>{" "}
                      <span className="text-green-600">(Leading!)</span>
                    </>
                  ) : bestProgress > 0 ? (
                    // Normal case: show comparison
                    <>
                      <span className="text-blue-600">
                        Your: {progress.percentage.toFixed(1)}%
                      </span>
                      <span className="text-muted-foreground"> | </span>
                      <span className="text-amber-600">
                        Best: {bestProgress.toFixed(1)}%
                      </span>
                    </>
                  ) : (
                    // No other competitors yet
                    <span className="text-blue-600">
                      Your: {progress.percentage.toFixed(1)}%
                    </span>
                  )}
                </div>
              </div>
              <Progress value={progress.percentage} className="h-4" />
              <p className="text-xs text-muted-foreground">
                {progress.totalOwned}/{progress.totalRequired} cards owned
              </p>
            </div>

            {/* Complete Alert */}
            {progress.isComplete && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-xs text-green-800">
                  Complete! Submit proof to win.
                </AlertDescription>
              </Alert>
            )}
          </>
        ) : (
          <div className="text-center text-xs text-muted-foreground py-2">
            Connect wallet to see progress
          </div>
        )}
      </CardContent>
    </Card>
  );
}

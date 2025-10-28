/**
 * @title OverallProgress Component (Main Website)
 * @notice Displays overall collection progress with progress bar
 * @dev KISS principle: Simple progress visualization
 * @dev Shows percentage completion and total cards owned/required
 */

"use client";

import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw } from "lucide-react";

interface ProgressData {
  totalRequired: number;
  totalOwned: number;
  percentage: number;
  rarityBreakdown: Record<number, { required: number; owned: number }>;
  isComplete: boolean;
}

interface OverallProgressProps {
  /** Progress data from useProgressCalculator hook */
  progress: ProgressData | null;
  /** Loading state */
  loading: boolean;
  /** Optional: Manual refetch callback */
  onRefetch?: () => void;
  /** Optional: Refetching state */
  isRefetching?: boolean;
  /** Optional: Highest progress from leaderboard */
  highestProgress?: number;
  /** Optional: Competition ID for stats */
  competitionId?: bigint;
}

/**
 * Overall Progress Component
 * Shows completion percentage and progress bar
 */
export function OverallProgress({
  progress,
  loading,
  onRefetch,
  isRefetching = false,
  highestProgress,
  competitionId,
}: OverallProgressProps) {
  const [stats, setStats] = useState<{ highestProgress: number } | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  // Fetch competition stats if competitionId provided
  useEffect(() => {
    if (competitionId) {
      setLoadingStats(true);
      fetch(`/api/stats/user-progress?competitionId=${competitionId}&limit=1`)
        .then(res => res.json())
        .then(result => {
          if (result.success && result.data && result.data.length > 0) {
            setStats({ highestProgress: result.data[0].percentage });
          }
        })
        .catch(() => {})
        .finally(() => setLoadingStats(false));
    }
  }, [competitionId]);

  if (loading) {
    return <Skeleton className="h-20 w-full" />;
  }

  if (!progress) {
    return null;
  }

  const bestProgress = highestProgress ?? stats?.highestProgress ?? 0;

  return (
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
              <span className="text-blue-600">Your: {progress.percentage.toFixed(1)}%</span>{" "}
              <span className="text-green-600">(Leading!)</span>
            </>
          ) : bestProgress > 0 ? (
            // Normal case: show comparison
            <>
              <span className="text-blue-600">Your: {progress.percentage.toFixed(1)}%</span>
              <span className="text-muted-foreground"> | </span>
              <span className="text-amber-600">Best: {bestProgress.toFixed(1)}%</span>
            </>
          ) : (
            // No other competitors yet
            <span className="text-blue-600">Your: {progress.percentage.toFixed(1)}%</span>
          )}
        </div>
      </div>
      <Progress
        value={progress.percentage}
        className={`h-6 ${
          progress.percentage === 100
            ? "[&>div]:bg-green-600"
            : progress.percentage >= 67
              ? "[&>div]:bg-blue-600"
              : progress.percentage >= 34
                ? "[&>div]:bg-orange-500"
                : "[&>div]:bg-red-500"
        }`}
      />
      <p className="text-xs text-muted-foreground">
        {progress.totalOwned}/{progress.totalRequired} unique cards owned
      </p>
    </div>
  );
}

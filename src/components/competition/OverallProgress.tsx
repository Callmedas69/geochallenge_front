/**
 * @title OverallProgress Component (Main Website)
 * @notice Displays overall collection progress with progress bar
 * @dev KISS principle: Simple progress visualization
 * @dev Shows percentage completion and total cards owned/required
 */

"use client";

import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

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
}

/**
 * Overall Progress Component
 * Shows completion percentage and progress bar
 */
export function OverallProgress({ progress, loading }: OverallProgressProps) {
  if (loading) {
    return <Skeleton className="h-20 w-full" />;
  }

  if (!progress) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium">Overall Progress</span>
        <span
          className={`font-bold ${
            progress.percentage === 100
              ? "text-green-600"
              : progress.percentage >= 67
                ? "text-blue-600"
                : progress.percentage >= 34
                  ? "text-orange-600"
                  : "text-red-600"
          }`}
        >
          {progress.percentage.toFixed(0)}%
        </span>
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

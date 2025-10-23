/**
 * @title CompetitionProgress Component (Farcaster)
 * @notice Compact progress display for Farcaster miniApps
 * @dev KISS principle: Mobile-optimized, all-in-one progress display
 * @dev Shows overall progress with completion alert
 */

"use client";

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
}: CompetitionProgressProps) {
  // Don't show if user doesn't have ticket or isn't connected
  if (!address || !hasTicket) {
    return null;
  }

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
                <span
                  className={`font-bold ${
                    progress.percentage === 100
                      ? "text-green-600"
                      : "text-muted-foreground"
                  }`}
                >
                  {progress.percentage.toFixed(0)}%
                </span>
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

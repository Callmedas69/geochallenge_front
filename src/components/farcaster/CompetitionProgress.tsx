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
import { CheckCircle2 } from "lucide-react";

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
              <div className="flex justify-between text-sm">
                <span className="font-medium">Overall Progress</span>
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

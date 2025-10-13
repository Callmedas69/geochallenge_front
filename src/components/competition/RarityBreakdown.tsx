/**
 * @title RarityBreakdown Component (Main Website)
 * @notice Displays per-rarity collection progress breakdown
 * @dev KISS principle: Clean breakdown with badges and completion indicators
 * @dev Shows owned/required for each rarity tier with visual feedback
 */

"use client";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, ExternalLink } from "lucide-react";
import { getRarityName, getRarityColor } from "@/lib/types";

interface ProgressData {
  totalRequired: number;
  totalOwned: number;
  percentage: number;
  rarityBreakdown: Record<number, { required: number; owned: number }>;
  isComplete: boolean;
}

interface RarityBreakdownProps {
  /** Progress data from useProgressCalculator hook */
  progress: ProgressData | null;
  /** Loading state */
  loading: boolean;
  /** Collection address for "Find Missing Cards" link */
  collectionAddress?: string;
  /** Show "Find Missing Cards" CTA */
  showCTA?: boolean;
}

/**
 * Rarity Breakdown Component
 * Shows detailed progress per rarity tier with completion status
 */
export function RarityBreakdown({
  progress,
  loading,
  collectionAddress,
  showCTA = true,
}: RarityBreakdownProps) {
  if (loading) {
    return <Skeleton className="h-32 w-full" />;
  }

  if (!progress) {
    return (
      <div className="text-center text-sm text-muted-foreground py-4">
        Connect wallet to see progress
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Per-Rarity Breakdown */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">
          Rarity Breakdown:
        </p>
        {Object.entries(progress.rarityBreakdown).map(([rarity, stats]) => {
          const rarityNum = Number(rarity);
          const isComplete = stats.owned >= stats.required;

          return (
            <div
              key={rarity}
              className="flex items-center justify-between p-2 bg-muted/50 rounded"
            >
              <Badge
                className={`${getRarityColor(rarityNum)} text-white text-xs`}
              >
                {getRarityName(rarityNum)}
              </Badge>
              <span
                className={`text-sm font-semibold ${
                  isComplete ? "text-green-600" : "text-muted-foreground"
                }`}
              >
                {stats.owned}/{stats.required}
                {isComplete && " ✓"}
              </span>
            </div>
          );
        })}
      </div>

      {/* Complete Set Alert */}
      {progress.isComplete && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800 font-medium">
            🎉 Complete set! You can submit proof to win.
          </AlertDescription>
        </Alert>
      )}

      {/* Find Missing Cards CTA */}
      {!progress.isComplete && showCTA && collectionAddress && (
        <a
          href={`https://vibechain.com/market/${collectionAddress}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <div className="p-3 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors group cursor-pointer">
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm">Find Missing Cards</span>
              <ExternalLink className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </a>
      )}
    </div>
  );
}

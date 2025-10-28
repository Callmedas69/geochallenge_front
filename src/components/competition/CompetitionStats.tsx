/**
 * @title Competition Stats Component
 * @notice Displays participant count and progress comparison
 * @dev Shows: Total participants, progress comparison (Your: X% | Best: Y%)
 * @security Fetches from public API with proper error handling
 */

"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Users, Target, Loader2, AlertTriangle } from "lucide-react";

// ============================================================================
// Types
// ============================================================================

interface CompetitionStatsProps {
  competitionId: bigint;
  userProgress?: number; // User's card collection progress %
  hasTicket: boolean;
}

interface StatsData {
  totalParticipants: number;
  highestProgress: number;
  lastUpdated: string;
  cacheStatus: "fresh" | "stale" | "refreshed";
}

// ============================================================================
// Component
// ============================================================================

export function CompetitionStats({
  competitionId,
  userProgress,
  hasTicket,
}: CompetitionStatsProps) {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ==========================================================================
  // Fetch stats from API
  // ==========================================================================
  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/stats/participants?competitionId=${competitionId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch stats");
        }

        const result = await response.json();
        setStats(result.data);
        setError(null);
      } catch (err) {
        console.error("Stats fetch error:", err);
        setError("Unable to load stats");
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [competitionId]);

  // ==========================================================================
  // Generate encouraging message based on progress
  // ==========================================================================
  // CLAUDE.md: No emojis unless user explicitly requests
  const getMessage = () => {
    if (!hasTicket) {
      if (!stats || stats.totalParticipants === 0) {
        return "Be the first to join this competition!";
      }
      const plural = stats.totalParticipants === 1 ? "" : "s";
      return `Join ${stats.totalParticipants} other competitor${plural}!`;
    }

    if (userProgress === undefined) return "Loading your progress...";

    // Professional messaging without emojis
    if (userProgress >= 90) return "Almost there! You're so close!";
    if (userProgress >= 75) return "Excellent progress! Keep going!";
    if (userProgress >= 50) return "You're ahead! Keep collecting!";
    if (userProgress >= 25) return "Good start! Don't give up!";
    return "Just getting started!";
  };

  // ==========================================================================
  // Loading State
  // ==========================================================================
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Competition Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </CardContent>
      </Card>
    );
  }

  // ==========================================================================
  // Error State
  // ==========================================================================
  // UX: Show error message instead of hiding component
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="text-sm">
          Unable to load competition stats. Please refresh the page.
        </AlertDescription>
      </Alert>
    );
  }

  // ==========================================================================
  // No Data State
  // ==========================================================================
  if (!stats) {
    return null; // OK - no data yet, hide component
  }

  // ==========================================================================
  // Render Stats
  // ==========================================================================
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-500" />
            Competition Stats
          </div>
          {/* UX: Show indicator when background refresh in progress */}
          {stats.cacheStatus === "stale" && (
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>Updating...</span>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* ================================================================== */}
        {/* Total Participants (Unique Users) */}
        {/* ================================================================== */}
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-500" />
            <span className="text-sm font-medium">Total Participants</span>
          </div>
          <Badge variant="secondary" className="text-lg font-bold">
            {stats.totalParticipants}
          </Badge>
        </div>
        {/* Note: Shows unique participants, not total tickets sold */}

        {/* ================================================================== */}
        {/* User Progress (if has ticket) */}
        {/* ================================================================== */}
        {hasTicket && userProgress !== undefined && (
          <>
            <Separator />

            <div className="space-y-3">
              {/* Collection Progress - Combined Display */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Target className="h-4 w-4" />
                  <span>Collection Progress</span>
                </div>

                {/* Progress Comparison */}
                <div className="text-center py-2">
                  {/* Check if user is leading */}
                  {stats.highestProgress > 0 &&
                  userProgress >= stats.highestProgress ? (
                    // User is leading!
                    <p className="text-lg font-bold">
                      <span className="text-blue-600">
                        Your: {userProgress.toFixed(1)}%
                      </span>{" "}
                      <span className="text-green-600">(Leading!)</span>
                    </p>
                  ) : stats.highestProgress > 0 ? (
                    // Normal case: show comparison
                    <p className="text-lg font-bold">
                      <span className="text-blue-600">
                        Your: {userProgress.toFixed(1)}%
                      </span>
                      <span className="text-muted-foreground"> | </span>
                      <span className="text-amber-600">
                        Best: {stats.highestProgress.toFixed(1)}%
                      </span>
                    </p>
                  ) : (
                    // No other competitors yet
                    <p className="text-lg font-bold text-blue-600">
                      Your: {userProgress.toFixed(1)}%
                    </p>
                  )}
                </div>

                {/* Progress Bar */}
                <Progress value={userProgress} className="h-2" />
              </div>

              {/* Encouraging Message */}
              <Alert className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                <AlertDescription className="text-sm text-center font-medium text-blue-900">
                  {getMessage()}
                </AlertDescription>
              </Alert>
            </div>
          </>
        )}

        {/* ================================================================== */}
        {/* No Ticket CTA */}
        {/* ================================================================== */}
        {!hasTicket && stats.totalParticipants > 0 && (
          <Alert className="bg-blue-50 border-blue-200">
            <AlertDescription className="text-sm text-blue-900">
              {getMessage()}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

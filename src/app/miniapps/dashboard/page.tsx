/**
 * @title Farcaster Dashboard Page
 * @notice User dashboard for Farcaster miniApp
 * @dev KISS principle: Mobile-optimized, shows only user's competitions
 * @dev Route: /miniapps/dashboard (Farcaster-specific dashboard route)
 */

"use client";

import { useMemo } from "react";
import { useAccount } from "wagmi";
import { useAutoConnect } from "@/lib/farcaster";
import {
  DashboardQuickStats,
  UserCompetitionCard,
  UnclaimedPrizesMobile,
} from "@/components/farcaster";
import { WithdrawBalance } from "@/components/WithdrawBalance";
import {
  useUserDashboardData,
  useUserCompetitionIds,
} from "@/hooks/useUserDashboard";
import {
  useClaimableBalance,
  useCompetitionCount,
} from "@/hooks/usePublicCompetitions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Wallet, List, RefreshCw, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function FarcasterDashboardPage() {
  // Auto-connect Farcaster wallet
  useAutoConnect();

  const { address, isConnected } = useAccount();

  // Fetch dashboard data (auto-refresh on mount)
  const {
    data: dashboardData,
    isLoading,
    refetch: refetchDashboard,
    error: dashboardError,
  } = useUserDashboardData(address);

  const {
    data: balance,
    error: balanceError,
    refetch: refetchBalance,
  } = useClaimableBalance(address);

  // Get all competition IDs for permanent history record
  const { data: allCompetitionIds } = useUserCompetitionIds(address);

  // Extract competition IDs from QueryManager
  const activeCompIds = useMemo(
    () => dashboardData?.activeCompIds || [],
    [dashboardData]
  );

  // Calculate completed competitions (permanent record, not just claimable)
  const completedCompIds = useMemo(() => {
    if (!allCompetitionIds || !dashboardData?.activeCompIds) return [];

    // Filter out active competitions to get completed ones
    const activeSet = new Set(
      dashboardData.activeCompIds.map((id) => id.toString())
    );
    return allCompetitionIds.filter((id) => !activeSet.has(id.toString()));
  }, [allCompetitionIds, dashboardData?.activeCompIds]);

  // Merge all competitions and sort by latest (descending ID)
  const allCompetitionsSorted = useMemo(() => {
    const active = activeCompIds || [];
    const completed = completedCompIds || [];
    const allIds = [...active, ...completed];

    // Remove duplicates and sort by competition ID descending (latest first)
    const uniqueIds = Array.from(
      new Set(allIds.map((id) => id.toString()))
    ).map((id) => BigInt(id));
    return uniqueIds.sort((a, b) => Number(b - a));
  }, [activeCompIds, completedCompIds]);

  // Create lookup sets for quick status checks
  const activeSet = useMemo(
    () => new Set(activeCompIds.map((id) => id.toString())),
    [activeCompIds]
  );
  const claimableSet = useMemo(
    () =>
      new Set(
        (dashboardData?.claimableCompIds || []).map((id) => id.toString())
      ),
    [dashboardData?.claimableCompIds]
  );

  // Not connected state
  if (!isConnected || !address) {
    return (
      <>
        <div className="container mx-auto px-3 py-4 pb-20">
          <Card>
            <CardHeader className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="h-5 w-5" />
                <CardTitle className="text-base">My Dashboard</CardTitle>
              </div>
              <CardDescription className="text-sm">
                Connect your wallet to view your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <Alert>
                <Wallet className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  Please connect your wallet to access your dashboard
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <>
        <div className="container mx-auto px-3 py-4 pb-20 space-y-4">
          <Skeleton className="h-8 w-1/2" />
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-20" />
            ))}
          </div>
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </>
    );
  }

  // Error state
  if (dashboardError) {
    return (
      <>
        <div className="container mx-auto px-3 py-4 pb-20 space-y-4">
          <div className="space-y-1">
            <h1 className="text-lg font-bold">My Dashboard</h1>
            <p className="text-xs text-muted-foreground">
              {address.slice(0, 10)}...{address.slice(-8)}
            </p>
          </div>

          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              <strong>Failed to load dashboard data</strong>
              <p className="mt-1">
                {dashboardError.message || "Network error. Please try again."}
              </p>
            </AlertDescription>
          </Alert>

          <Button
            onClick={() => {
              refetchDashboard();
              refetchBalance();
            }}
            variant="outline"
            className="w-full"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </>
    );
  }

  // Empty state - no tickets
  if (allCompetitionsSorted.length === 0) {
    return (
      <>
        <div className="container mx-auto px-3 py-4 pb-20 space-y-4">
          {/* Header */}
          <div className="space-y-1">
            <h1 className="text-lg font-bold">My Dashboard</h1>
            <p className="text-xs text-muted-foreground">
              {address.slice(0, 10)}...{address.slice(-8)}
            </p>
          </div>

          {/* Stats */}
          <DashboardQuickStats stats={dashboardData?.stats} />

          {/* Withdraw Balance - Mobile Optimized */}
          <WithdrawBalance />

          {/* Empty State */}
          <Card className="mt-4">
            <CardContent className="p-8 text-center space-y-4">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                  <List className="h-8 w-8 text-muted-foreground" />
                </div>
              </div>
              <h3 className="font-semibold text-base mb-2">No Tickets Yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                You haven't joined any competitions yet
              </p>

              {/* Debug info for troubleshooting */}
              <details className="text-left bg-muted p-3 rounded text-xs">
                <summary className="cursor-pointer font-semibold mb-2">
                  🔍 Debug Info (click to expand)
                </summary>
                <div className="space-y-2">
                  <p>
                    <strong>Wallet:</strong> {address}
                  </p>
                  <p>
                    <strong>Active Competitions:</strong>{" "}
                    {dashboardData?.activeCompIds?.length || 0}
                  </p>
                  <p>
                    <strong>Claimable Competitions:</strong>{" "}
                    {dashboardData?.claimableCompIds?.length || 0}
                  </p>
                  <p>
                    <strong>Total Joined:</strong>{" "}
                    {dashboardData?.stats?.totalCompetitionsJoined?.toString() ||
                      "0"}
                  </p>
                  <pre className="whitespace-pre-wrap overflow-auto max-h-48 bg-background p-2 rounded mt-2">
                    {JSON.stringify(
                      {
                        activeCompIds: activeCompIds.map((id) => id.toString()),
                        completedCompIds: completedCompIds.map((id) =>
                          id.toString()
                        ),
                        stats: dashboardData?.stats
                          ? {
                              totalJoined:
                                dashboardData.stats.totalCompetitionsJoined?.toString(),
                              totalWon:
                                dashboardData.stats.competitionsWon?.toString(),
                              prizesWon:
                                dashboardData.stats.totalPrizesWon?.toString(),
                            }
                          : null,
                      },
                      null,
                      2
                    )}
                  </pre>
                </div>
              </details>

              <Button asChild>
                <Link href="/miniapps/browse">Browse Competitions</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  // Dashboard with competitions
  return (
    <>
      <div className="container mx-auto px-3 py-4 pb-20 space-y-4">
        {/* Header with Refresh */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-lg font-bold">My Dashboard</h1>
            <p className="text-xs text-muted-foreground">
              {address.slice(0, 10)}...{address.slice(-8)}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              refetchDashboard();
              refetchBalance();
            }}
            disabled={isLoading}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        {/* Stats */}
        <DashboardQuickStats stats={dashboardData?.stats} />

        {/* Withdraw Balance - Mobile Optimized */}
        <WithdrawBalance />

        {/* Unclaimed Prizes */}
        <UnclaimedPrizesMobile
          claimableCompIds={dashboardData?.claimableCompIds}
          isLoading={isLoading}
          refetchDashboard={refetchDashboard}
          refetchBalance={refetchBalance}
        />

        {/* All Competitions - Sorted by Latest */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground">
            My Competitions ({allCompetitionsSorted.length})
          </h2>
          {allCompetitionsSorted.map((id) => (
            <UserCompetitionCard
              key={id.toString()}
              competitionId={id}
              isActive={activeSet.has(id.toString())}
            />
          ))}
        </div>
      </div>
    </>
  );
}

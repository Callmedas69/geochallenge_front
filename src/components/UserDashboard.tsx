/**
 * @title UserDashboard Component
 * @notice User profile showing tickets, balance, and participation
 * @dev KISS principle: Simple overview of user's activity (Phase 3 - Real Data)
 */

"use client";

import { useMemo } from "react";
import { useAccount } from "wagmi";
import { useClaimableBalance } from "@/hooks/usePublicCompetitions";
import {
  useUserDashboardData,
  useUserCompetitionIds,
} from "@/hooks/useUserDashboard";
import { WithdrawBalance } from "@/components/WithdrawBalance";
import { UserStatsCards } from "@/components/dashboard/UserStatsCards";
import { ParticipationHistoryTable } from "@/components/dashboard/ParticipationHistoryTable";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Wallet, User, RefreshCw, AlertCircle } from "lucide-react";

export function UserDashboard() {
  const { address, isConnected } = useAccount();

  // Single RPC call for all dashboard data (60x faster!)
  const {
    data: dashboardData,
    isLoading: isDashboardLoading,
    error: dashboardError,
    refetch: refetchDashboard,
  } = useUserDashboardData(address);
  const {
    data: balance,
    error: balanceError,
    refetch: refetchBalance,
  } = useClaimableBalance(address);

  // Get all competition IDs for participation history (permanent record)
  const { data: allCompetitionIds } = useUserCompetitionIds(address);

  // Calculate completed competitions (exclude active ones)
  const completedCompIds = useMemo(() => {
    if (!allCompetitionIds || !dashboardData?.activeCompIds) return [];

    // Filter out active competitions to get completed ones
    const activeSet = new Set(
      dashboardData.activeCompIds.map((id) => id.toString())
    );
    return allCompetitionIds.filter((id) => !activeSet.has(id.toString()));
  }, [allCompetitionIds, dashboardData?.activeCompIds]);

  if (!isConnected || !address) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              User Dashboard
            </CardTitle>
            <CardDescription>
              Connect your wallet to view your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Wallet className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p>Please connect your wallet to access your dashboard</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading state
  if (isDashboardLoading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-8">
        <Skeleton className="h-12 w-1/2" />
        <Separator />
        <div className="grid gap-6 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  // Error state
  if (dashboardError) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header with Refresh */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <User className="h-8 w-8" />
              My Dashboard
            </h1>
            <p className="text-muted-foreground">
              Address: {address.slice(0, 10)}...{address.slice(-8)}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              refetchDashboard();
              refetchBalance();
            }}
            disabled={isDashboardLoading}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        <Separator />

        {/* Error Alert */}
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Failed to load dashboard data</AlertTitle>
          <AlertDescription>
            {dashboardError.message || "Network error. Please try again."}
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

        {/* Debug Panel */}
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-sm">🔍 Debug Information</CardTitle>
            <CardDescription className="text-xs">
              Technical details for troubleshooting
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div>
              <strong>Wallet:</strong> {address}
            </div>
            <div>
              <strong>Error:</strong> {dashboardError.message}
            </div>
            <div>
              <strong>Contract Call:</strong>{" "}
              QueryManager.getUserDashboardData()
            </div>
            <details className="mt-2">
              <summary className="cursor-pointer font-semibold">
                Full Error Details
              </summary>
              <pre className="mt-2 p-2 bg-white rounded overflow-auto text-xs">
                {JSON.stringify(dashboardError, null, 2)}
              </pre>
            </details>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header with Refresh */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <User className="h-8 w-8" />
            My Dashboard
          </h1>
          <p className="text-muted-foreground">
            Address: {address.slice(0, 10)}...{address.slice(-8)}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            refetchDashboard();
            refetchBalance();
          }}
          disabled={isDashboardLoading}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      <Separator />

      {/* Balance Error Alert */}
      {balanceError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Failed to load balance</AlertTitle>
          <AlertDescription>{balanceError.message}</AlertDescription>
        </Alert>
      )}

      {/* Stats Overview - 4 column grid with Withdraw Balance first */}
      <div className="grid gap-6 md:grid-cols-4">
        {/* Withdraw Balance - First position (leftmost) */}
        <WithdrawBalance />

        {/* Stats Cards - Remaining 3 columns */}
        <UserStatsCards
          stats={dashboardData?.stats}
          isLoading={isDashboardLoading}
        />
      </div>

      {/* My Competitions - includes claim functionality */}
      <ParticipationHistoryTable
        completedCompIds={completedCompIds}
        activeCompIds={dashboardData?.activeCompIds}
        claimableCompIds={dashboardData?.claimableCompIds}
        isLoading={isDashboardLoading}
        refetchDashboard={refetchDashboard}
        refetchBalance={refetchBalance}
      />
    </div>
  );
}

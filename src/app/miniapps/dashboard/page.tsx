/**
 * @title Farcaster Dashboard Page
 * @notice User dashboard for Farcaster miniApp
 * @dev KISS principle: Mobile-optimized, shows only user's competitions
 * @dev Route: /miniapps/dashboard (Farcaster-specific dashboard route)
 */

"use client";

import { useState, useMemo } from "react";
import { useAccount } from "wagmi";
import { useAutoConnect } from "@/lib/farcaster";
import {
  DashboardQuickStats,
  UserCompetitionCard,
  ClaimablePrizesAlertMobile,
} from "@/components/farcaster";
import { useUserDashboardData } from "@/hooks/useUserDashboard";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Wallet, List, RefreshCw, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function FarcasterDashboardPage() {
  // Auto-connect Farcaster wallet
  useAutoConnect();

  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<"active" | "completed">("active");

  // Fetch dashboard data (auto-refresh on mount)
  const {
    data: dashboardData,
    isLoading,
    refetch,
    error: dashboardError,
  } = useUserDashboardData(address);

  const { data: balance, error: balanceError } = useClaimableBalance(address);

  // DEBUG: Log dashboard data
  console.log("🔍 Dashboard Debug:", {
    address,
    dashboardData,
    isLoading,
    error: dashboardError,
    balanceError,
  });

  // Extract competition IDs from QueryManager
  const activeCompIds = useMemo(
    () => dashboardData?.activeCompIds || [],
    [dashboardData]
  );

  const completedCompIds = useMemo(
    () => dashboardData?.claimableCompIds || [],
    [dashboardData]
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

          <Button onClick={() => refetch()} variant="outline" className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </>
    );
  }

  // Empty state - no tickets
  if (activeCompIds.length === 0 && completedCompIds.length === 0) {
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
          <DashboardQuickStats
            stats={dashboardData?.stats}
            claimableBalance={balance}
          />

          {/* Empty State */}
          <Card className="mt-8">
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
                    {dashboardData?.stats?.totalCompetitionsJoined?.toString() || "0"}
                  </p>
                  <pre className="whitespace-pre-wrap overflow-auto max-h-48 bg-background p-2 rounded mt-2">
                    {JSON.stringify(
                      {
                        activeCompIds: activeCompIds.map(id => id.toString()),
                        completedCompIds: completedCompIds.map(id => id.toString()),
                        stats: dashboardData?.stats ? {
                          totalJoined: dashboardData.stats.totalCompetitionsJoined?.toString(),
                          totalWon: dashboardData.stats.competitionsWon?.toString(),
                          prizesWon: dashboardData.stats.totalPrizesWon?.toString(),
                        } : null,
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
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        {/* Stats */}
        <DashboardQuickStats
          stats={dashboardData?.stats}
          claimableBalance={balance}
        />

        {/* Balance Error Alert */}
        {balanceError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Failed to load balance: {balanceError.message}
            </AlertDescription>
          </Alert>
        )}

        {/* Claimable Balance Alert */}
        {!balanceError && balance && balance > BigInt(0) && (
          <Alert className="border-green-500 bg-green-50">
            <Wallet className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-xs text-green-800">
              You have ETH ready to withdraw! Go to the main website to withdraw
              your balance.
            </AlertDescription>
          </Alert>
        )}

        {/* Claimable Prizes Alert */}
        <ClaimablePrizesAlertMobile
          claimableCompIds={completedCompIds}
          isLoading={isLoading}
        />

        {/* Competition Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "active" | "completed")}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active" className="text-sm">
              Active
              {activeCompIds.length > 0 && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {activeCompIds.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="completed" className="text-sm">
              Completed
              {completedCompIds.length > 0 && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {completedCompIds.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Active Tab */}
          <TabsContent value="active" className="space-y-3 mt-4">
            {activeCompIds.length === 0 ? (
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-base">
                    No Active Competitions
                  </CardTitle>
                  <CardDescription className="text-sm">
                    You don't have any active competitions
                  </CardDescription>
                </CardHeader>
              </Card>
            ) : (
              activeCompIds.map((id) => (
                <UserCompetitionCard
                  key={id.toString()}
                  competitionId={id}
                  isActive={true}
                />
              ))
            )}
          </TabsContent>

          {/* Completed Tab */}
          <TabsContent value="completed" className="space-y-3 mt-4">
            {completedCompIds.length === 0 ? (
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-base">
                    No Completed Competitions
                  </CardTitle>
                  <CardDescription className="text-sm">
                    You don't have any completed competitions yet
                  </CardDescription>
                </CardHeader>
              </Card>
            ) : (
              completedCompIds.map((id) => (
                <UserCompetitionCard
                  key={id.toString()}
                  competitionId={id}
                  isActive={false}
                />
              ))
            )}
          </TabsContent>
        </Tabs>

        {/* Debug Panel - Shows raw contract data for troubleshooting */}
        <details className="bg-orange-50 border border-orange-200 rounded-lg p-3">
          <summary className="cursor-pointer font-semibold text-sm text-orange-900 mb-2">
            🔍 Debug Information (click to expand)
          </summary>
          <div className="space-y-2 text-xs mt-2">
            <div>
              <strong>Wallet:</strong> {address}
            </div>
            <div>
              <strong>Stats from Contract:</strong>
            </div>
            <div className="pl-4 space-y-1">
              <div>
                • Total Joined: {dashboardData?.stats?.totalCompetitionsJoined?.toString() || "0"}
              </div>
              <div>
                • Competitions Won: {dashboardData?.stats?.competitionsWon?.toString() || "0"}
              </div>
              <div>
                • Total Prizes: {dashboardData?.stats?.totalPrizesWon?.toString() || "0"}
              </div>
            </div>
            <div>
              <strong>Active Competitions:</strong> {activeCompIds?.length || 0} competitions
            </div>
            <div className="pl-4">
              {activeCompIds?.length ? (
                activeCompIds.map((id) => (
                  <div key={id.toString()}>• Competition #{id.toString()}</div>
                ))
              ) : (
                <div className="text-muted-foreground">None</div>
              )}
            </div>
            <div>
              <strong>Claimable Competitions:</strong> {completedCompIds?.length || 0} competitions
            </div>
            <div className="pl-4">
              {completedCompIds?.length ? (
                completedCompIds.map((id) => (
                  <div key={id.toString()}>• Competition #{id.toString()}</div>
                ))
              ) : (
                <div className="text-muted-foreground">None</div>
              )}
            </div>
            <div className="mt-2">
              <strong>Full Contract Response:</strong>
            </div>
            <pre className="mt-1 p-2 bg-white rounded overflow-auto text-xs max-h-48 border border-orange-100">
              {JSON.stringify(
                {
                  stats: dashboardData?.stats ? {
                    totalCompetitionsJoined: dashboardData.stats.totalCompetitionsJoined?.toString(),
                    competitionsWon: dashboardData.stats.competitionsWon?.toString(),
                    totalPrizesWon: dashboardData.stats.totalPrizesWon?.toString(),
                  } : null,
                  activeCompIds: activeCompIds?.map(id => id.toString()),
                  claimableCompIds: completedCompIds?.map(id => id.toString()),
                  totalCompetitions: dashboardData?.totalCompetitions?.toString(),
                },
                null,
                2
              )}
            </pre>
          </div>
        </details>
      </div>
    </>
  );
}

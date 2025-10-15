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
  FarcasterHeader,
  BottomNav,
  DashboardQuickStats,
  UserCompetitionCard,
} from "@/components/farcaster";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Wallet, List } from "lucide-react";
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

  const { data: balance } = useClaimableBalance(address);

  // FALLBACK: Try getting competition IDs from UserTracking directly
  const { data: userCompIds } = useUserCompetitionIds(address);

  // DEBUG: Log dashboard data
  console.log("🔍 Dashboard Debug:", {
    address,
    dashboardData,
    userCompIds,
    isLoading,
    error: dashboardError,
  });

  // Separate active and completed competition IDs
  // FALLBACK: If QueryManager returns empty but UserTracking has data, use that
  const activeCompIds = useMemo(() => {
    if (
      dashboardData?.activeCompIds &&
      dashboardData.activeCompIds.length > 0
    ) {
      return dashboardData.activeCompIds;
    }
    // Fallback: return all user competition IDs (will filter by state in card)
    return userCompIds || [];
  }, [dashboardData, userCompIds]);

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

          {/* Debug Info */}
          {dashboardError && (
            <Alert variant="destructive">
              <AlertDescription className="text-xs">
                Error loading dashboard: {dashboardError.message}
              </AlertDescription>
            </Alert>
          )}

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
                    <strong>QueryManager activeCompIds:</strong>{" "}
                    {dashboardData?.activeCompIds?.length || 0}
                  </p>
                  <p>
                    <strong>QueryManager claimableCompIds:</strong>{" "}
                    {dashboardData?.claimableCompIds?.length || 0}
                  </p>
                  <p>
                    <strong>UserTracking compIds:</strong>{" "}
                    {userCompIds?.length || 0}
                  </p>
                  <p>
                    <strong>Using fallback:</strong>{" "}
                    {(dashboardData?.activeCompIds?.length || 0) === 0 &&
                    (userCompIds?.length || 0) > 0
                      ? "YES"
                      : "NO"}
                  </p>
                  <pre className="whitespace-pre-wrap overflow-auto max-h-48 bg-background p-2 rounded mt-2">
                    {JSON.stringify(
                      {
                        dashboardData,
                        userCompIds,
                        activeCompIds,
                        completedCompIds,
                      },
                      (key, value) =>
                        typeof value === "bigint" ? value.toString() : value,
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

        {/* Claimable Balance Alert */}
        {balance && balance > BigInt(0) && (
          <Alert className="border-green-500 bg-green-50">
            <Wallet className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-xs text-green-800">
              You have ETH ready to withdraw! Go to the main website to withdraw
              your balance.
            </AlertDescription>
          </Alert>
        )}

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
      </div>
    </>
  );
}

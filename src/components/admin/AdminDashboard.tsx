/**
 * @title AdminDashboard Component
 * @notice Overview of all competitions with admin actions
 * @dev Real-time statistics from QueryManager
 */

"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateCompetitionForm } from "./CreateCompetitionForm";
import { CompetitionActions } from "./CompetitionActions";
import { EmergencyControls } from "./EmergencyControls";
import { AdvancedSettings } from "./AdvancedSettings";
import { FeaturedManagement } from "./FeaturedManagement";
import {
  useCompetitionCount,
  useActiveCompetitions,
  useTotalValueLocked,
  useCompetitionStats,
  useContractHealth,
  useExpiredCompetitions,
} from "@/hooks/usePublicCompetitions";
import { useCardCompetitionOwner, useClaimableBalance } from "@/hooks/useContracts";
import { formatEther } from "viem";
import {
  Trophy,
  TrendingUp,
  DollarSign,
  Loader2,
  Plus,
  Settings,
  AlertTriangle,
  Clock,
  ShieldAlert,
  Wallet,
} from "lucide-react";

export function AdminDashboard() {
  const { data: totalComps, isLoading: loadingTotal } = useCompetitionCount();
  const { data: activeComps, isLoading: loadingActive } =
    useActiveCompetitions();
  const { data: tvl, isLoading: loadingTVL } = useTotalValueLocked();
  const { data: stats, isLoading: loadingStats } = useCompetitionStats();
  const { data: health, isLoading: loadingHealth } = useContractHealth();
  const { data: expiredIds, isLoading: loadingExpired } =
    useExpiredCompetitions();

  // Owner balance (for stats display only)
  const { data: ownerAddress, isLoading: loadingOwnerAddress } = useCardCompetitionOwner();
  const { data: ownerBalance, isLoading: loadingOwnerBalance } = useClaimableBalance(ownerAddress);
  const ownerBalanceETH = ownerBalance ? parseFloat(formatEther(ownerBalance)).toFixed(4) : "0.0000";
  const hasBalance = ownerBalance && ownerBalance > BigInt(0);

  // Calculate total competitions (currentCompetitionId is next ID, so -1 for created count)
  const totalCount =
    totalComps && totalComps > BigInt(0) ? Number(totalComps - BigInt(1)) : 0;
  const activeCount = activeComps && activeComps[0] ? activeComps[0].length : 0;
  const tvlETH = tvl ? parseFloat(formatEther(tvl)).toFixed(4) : "0.0000";
  const expiredCount = expiredIds ? expiredIds.length : 0;
  const pendingRefundsETH = health
    ? parseFloat(formatEther(health[3])).toFixed(4)
    : "0.0000";
  const endedCount = stats ? Number(stats[2]) : 0; // ended competitions needing finalization

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Trophy className="w-8 h-8 text-yellow-500" />
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage competitions, prizes, and platform settings
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
        {/* Total Competitions */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription>Total Competitions</CardDescription>
              <Trophy className="w-4 h-4 text-blue-500" />
            </div>
            <CardTitle className="text-3xl">
              {loadingTotal ? (
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              ) : (
                totalCount
              )}
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Active Competitions */}
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription>Active Now</CardDescription>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <CardTitle className="text-3xl">
              {loadingActive ? (
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              ) : (
                activeCount
              )}
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Total Value Locked */}
        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription>Total Value Locked</CardDescription>
              <DollarSign className="w-4 h-4 text-yellow-500" />
            </div>
            <CardTitle className="text-2xl">
              {loadingTVL ? (
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              ) : (
                `${tvlETH} ETH`
              )}
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Expired Competitions */}
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription>Expired</CardDescription>
              <Clock className="w-4 h-4 text-orange-500" />
            </div>
            <CardTitle className="text-3xl flex items-center gap-2">
              {loadingExpired ? (
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              ) : (
                <>
                  {expiredCount}
                  {expiredCount > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      Need Action
                    </Badge>
                  )}
                </>
              )}
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Ended (Need Finalization) */}
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription>Ended</CardDescription>
              <AlertTriangle className="w-4 h-4 text-purple-500" />
            </div>
            <CardTitle className="text-3xl flex items-center gap-2">
              {loadingStats ? (
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              ) : (
                <>
                  {endedCount}
                  {endedCount > 0 && (
                    <Badge variant="outline" className="text-xs">
                      Awaiting Winner
                    </Badge>
                  )}
                </>
              )}
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Pending Refunds */}
        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription>Pending Refunds</CardDescription>
              <DollarSign className="w-4 h-4 text-red-500" />
            </div>
            <CardTitle className="text-2xl">
              {loadingHealth ? (
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              ) : (
                `${pendingRefundsETH} ETH`
              )}
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Owner Claimable Balance */}
        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription>Owner Balance</CardDescription>
              <Wallet className="w-4 h-4 text-emerald-500" />
            </div>
            <CardTitle className="text-2xl flex items-center gap-2">
              {loadingOwnerAddress || loadingOwnerBalance ? (
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              ) : (
                <>
                  {ownerBalanceETH} ETH
                  {hasBalance && (
                    <Badge variant="default" className="text-xs bg-emerald-500">
                      Available
                    </Badge>
                  )}
                </>
              )}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Main Tabs: Create vs Manage vs Emergency vs Advanced */}
      <Tabs defaultValue="manage" className="space-y-6">
        <TabsList className="grid w-full max-w-3xl grid-cols-4">
          <TabsTrigger value="create" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create
          </TabsTrigger>
          <TabsTrigger value="manage" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Manage
          </TabsTrigger>
          <TabsTrigger value="emergency" className="flex items-center gap-2 text-red-600 data-[state=active]:text-red-700">
            <ShieldAlert className="w-4 h-4" />
            🚨 Emergency
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Advanced
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Create Competition */}
        <TabsContent value="create">
          <CreateCompetitionForm />
        </TabsContent>

        {/* Tab 2: Manage Competitions */}
        <TabsContent value="manage" className="space-y-6">
          {/* Featured Competitions Management */}
          <FeaturedManagement />

          {/* Competition Lifecycle Management */}
          <Card>
            <CardHeader>
              <CardTitle>Manage Competitions</CardTitle>
              <CardDescription>
                Manage lifecycle, prizes, and booster boxes for existing competitions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CompetitionActions />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Emergency Controls */}
        <TabsContent value="emergency">
          <EmergencyControls />
        </TabsContent>

        {/* Tab 4: Advanced Settings */}
        <TabsContent value="advanced">
          <AdvancedSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}

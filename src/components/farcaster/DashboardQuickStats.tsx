/**
 * @title DashboardQuickStats Component (Farcaster)
 * @notice Mobile-optimized quick stats for user dashboard
 * @dev KISS principle: 2-column compact grid, essential stats only
 */

"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Ticket, Trophy, TrendingUp } from "lucide-react";
import { formatEther } from "viem";
import type { ContractUserStats } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { DECIMALS } from "@/lib/displayConfig";

interface DashboardQuickStatsProps {
  stats: ContractUserStats | undefined;
  isLoading?: boolean;
}

export function DashboardQuickStats({
  stats,
  isLoading,
}: DashboardQuickStatsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>
              <Skeleton className="h-7 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const totalPrizesETH = stats?.totalPrizesWon
    ? parseFloat(formatEther(stats.totalPrizesWon)).toFixed(DECIMALS.FARCASTER)
    : "0.000";
  const totalJoined = stats?.totalCompetitionsJoined
    ? Number(stats.totalCompetitionsJoined)
    : 0;
  const totalWon = stats?.competitionsWon ? Number(stats.competitionsWon) : 0;

  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Total Joined */}
      <Card className="border-l-4 border-l-blue-500">
        <CardContent className="p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Participated</span>
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Ticket className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div className="text-2xl font-bold">{totalJoined}</div>
        </CardContent>
      </Card>

      {/* Wins */}
      <Card className="border-l-4 border-l-purple-500">
        <CardContent className="p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Wins</span>
            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
              <Trophy className="h-5 w-5 text-purple-600" />
            </div>
          </div>
          <div className="text-2xl font-bold">{totalWon}</div>
        </CardContent>
      </Card>

      {/* Total Prizes */}
      <Card className="border-l-4 border-l-yellow-500">
        <CardContent className="p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Total Prizes</span>
            <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-yellow-600" />
            </div>
          </div>
          <div className="text-2xl font-bold">{totalPrizesETH} Ξ</div>
        </CardContent>
      </Card>
    </div>
  );
}

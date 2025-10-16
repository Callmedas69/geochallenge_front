/**
 * @title DashboardQuickStats Component (Farcaster)
 * @notice Mobile-optimized quick stats for user dashboard
 * @dev KISS principle: 2-column compact grid, essential stats only
 */

"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Wallet, Ticket, Trophy } from "lucide-react";
import { formatEther } from "viem";
import type { ContractUserStats } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { DECIMALS } from "@/lib/displayConfig";

interface DashboardQuickStatsProps {
  stats: ContractUserStats | undefined;
  claimableBalance: bigint | undefined;
  isLoading?: boolean;
}

export function DashboardQuickStats({
  stats,
  claimableBalance,
  isLoading,
}: DashboardQuickStatsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-3">
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-6 w-12" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const balanceETH = claimableBalance
    ? parseFloat(formatEther(claimableBalance)).toFixed(DECIMALS.FARCASTER)
    : "0.000";
  const totalPrizesETH = stats?.totalPrizesWon
    ? parseFloat(formatEther(stats.totalPrizesWon)).toFixed(DECIMALS.FARCASTER)
    : "0.000";
  const totalJoined = stats?.totalCompetitionsJoined
    ? Number(stats.totalCompetitionsJoined)
    : 0;
  const totalWon = stats?.competitionsWon ? Number(stats.competitionsWon) : 0;

  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Claimable Balance */}
      <Card className="border-l-4 border-l-green-500">
        <CardContent className="p-3">
          <div className="flex items-center gap-2 mb-1">
            <Wallet className="h-4 w-4 text-green-500" />
            <span className="text-xs text-muted-foreground">Claimable Balance</span>
          </div>
          <div className="text-lg font-bold">{balanceETH} Ξ</div>
        </CardContent>
      </Card>

      {/* Total Joined */}
      <Card className="border-l-4 border-l-blue-500">
        <CardContent className="p-3">
          <div className="flex items-center gap-2 mb-1">
            <Ticket className="h-4 w-4 text-blue-500" />
            <span className="text-xs text-muted-foreground">Participated</span>
          </div>
          <div className="text-lg font-bold">{totalJoined}</div>
        </CardContent>
      </Card>

      {/* Wins */}
      <Card className="border-l-4 border-l-purple-500">
        <CardContent className="p-3">
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="h-4 w-4 text-purple-500" />
            <span className="text-xs text-muted-foreground">Wins</span>
          </div>
          <div className="text-lg font-bold">{totalWon}</div>
        </CardContent>
      </Card>

      {/* Total Prizes */}
      <Card className="border-l-4 border-l-yellow-500">
        <CardContent className="p-3">
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="h-4 w-4 text-yellow-500" />
            <span className="text-xs text-muted-foreground">Total Prizes</span>
          </div>
          <div className="text-lg font-bold">{totalPrizesETH} Ξ</div>
        </CardContent>
      </Card>
    </div>
  );
}

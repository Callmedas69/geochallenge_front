/**
 * @title User Stats Cards Component
 * @notice Displays user statistics in card format
 * @dev KISS principle - simple stats display with shadcn/ui
 */

'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Wallet, Ticket, Trophy, TrendingUp } from 'lucide-react'
import { formatEther } from 'viem'
import type { ContractUserStats } from '@/lib/types'

interface UserStatsCardsProps {
  stats: ContractUserStats | undefined
  claimableBalance: bigint | undefined
  isLoading?: boolean
}

export function UserStatsCards({ stats, claimableBalance, isLoading }: UserStatsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <div className="h-4 w-24 bg-gray-200 rounded" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-gray-200 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const balanceETH = claimableBalance ? parseFloat(formatEther(claimableBalance)).toFixed(4) : '0.0000'
  const totalPrizesETH = stats?.totalPrizesWon ? parseFloat(formatEther(stats.totalPrizesWon)).toFixed(4) : '0.0000'
  const totalJoined = stats?.totalCompetitionsJoined ? Number(stats.totalCompetitionsJoined) : 0
  const totalWon = stats?.competitionsWon ? Number(stats.competitionsWon) : 0

  return (
    <div className="grid gap-6 md:grid-cols-4">
      {/* Claimable Balance */}
      <Card className="border-l-4 border-l-green-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Claimable Balance</CardTitle>
          <Wallet className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{balanceETH} ETH</div>
          <p className="text-xs text-muted-foreground">Available to withdraw</p>
        </CardContent>
      </Card>

      {/* Total Competitions */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Participated</CardTitle>
          <Ticket className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalJoined}</div>
          <p className="text-xs text-muted-foreground">Total competitions</p>
        </CardContent>
      </Card>

      {/* Competitions Won */}
      <Card className="border-l-4 border-l-purple-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Wins</CardTitle>
          <Trophy className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalWon}</div>
          <p className="text-xs text-muted-foreground">
            {totalJoined > 0 ? `${((totalWon / totalJoined) * 100).toFixed(1)}% win rate` : 'No competitions yet'}
          </p>
        </CardContent>
      </Card>

      {/* Total Prizes Won */}
      <Card className="border-l-4 border-l-yellow-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Prizes</CardTitle>
          <TrendingUp className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalPrizesETH} ETH</div>
          <p className="text-xs text-muted-foreground">Lifetime earnings</p>
        </CardContent>
      </Card>
    </div>
  )
}

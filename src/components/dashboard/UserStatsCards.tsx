/**
 * @title User Stats Cards Component
 * @notice Displays user statistics in card format
 * @dev KISS principle - simple stats display with shadcn/ui
 */

'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Ticket, Trophy, TrendingUp } from 'lucide-react'
import { formatEther } from 'viem'
import type { ContractUserStats } from '@/lib/types'

interface UserStatsCardsProps {
  stats: ContractUserStats | undefined
  isLoading?: boolean
}

export function UserStatsCards({ stats, isLoading }: UserStatsCardsProps) {
  if (isLoading) {
    return (
      <>
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
              <div className="h-4 w-24 bg-gray-200 rounded" />
              <div className="h-10 w-10 rounded-full bg-gray-200" />
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="h-6 w-16 bg-gray-200 rounded mb-2" />
              <div className="h-3 w-28 bg-gray-200 rounded" />
            </CardContent>
          </Card>
        ))}
      </>
    )
  }

  const totalPrizesETH = stats?.totalPrizesWon ? parseFloat(formatEther(stats.totalPrizesWon)).toFixed(4) : '0.0000'
  const totalJoined = stats?.totalCompetitionsJoined ? Number(stats.totalCompetitionsJoined) : 0
  const totalWon = stats?.competitionsWon ? Number(stats.competitionsWon) : 0

  return (
    <>
      {/* Total Competitions */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
          <CardTitle className="text-sm font-medium">Participated</CardTitle>
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
            <Ticket className="h-5 w-5 text-blue-600" />
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="text-2xl font-bold">{totalJoined}</div>
          <p className="text-xs text-muted-foreground">Total competitions</p>
        </CardContent>
      </Card>

      {/* Competitions Won */}
      <Card className="border-l-4 border-l-purple-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
          <CardTitle className="text-sm font-medium">Wins</CardTitle>
          <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
            <Trophy className="h-5 w-5 text-purple-600" />
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="text-2xl font-bold">{totalWon}</div>
          <p className="text-xs text-muted-foreground">
            {totalJoined > 0 ? `${((totalWon / totalJoined) * 100).toFixed(1)}% win rate` : 'No competitions yet'}
          </p>
        </CardContent>
      </Card>

      {/* Total Prizes Won */}
      <Card className="border-l-4 border-l-yellow-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
          <CardTitle className="text-sm font-medium">Total Prizes</CardTitle>
          <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-yellow-600" />
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="text-2xl font-bold">{totalPrizesETH} ETH</div>
          <p className="text-xs text-muted-foreground">Lifetime earnings</p>
        </CardContent>
      </Card>
    </>
  )
}

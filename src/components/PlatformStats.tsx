/**
 * @title PlatformStats Component
 * @notice Displays platform-wide statistics
 * @dev Public component - no wallet required
 * @dev Uses smart caching from usePublicCompetitions hooks
 */

'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import {
  useCompetitionCount,
  useActiveCompetitions,
  useTotalValueLocked,
  useCompetitionStats,
  useContractHealth,
  useExpiredCompetitions,
} from '@/hooks/usePublicCompetitions'
import { formatEther } from 'viem'
import {
  Trophy,
  TrendingUp,
  DollarSign,
  Users,
  AlertTriangle,
  Clock,
} from 'lucide-react'

export function PlatformStats() {
  const { data: totalComps, isLoading: loadingTotal } = useCompetitionCount()
  const { data: activeIds, isLoading: loadingActive } = useActiveCompetitions()
  const { data: tvl, isLoading: loadingTVL } = useTotalValueLocked()
  const { data: stats, isLoading: loadingStats } = useCompetitionStats()
  const { data: health, isLoading: loadingHealth } = useContractHealth()
  const { data: expiredIds, isLoading: loadingExpired } = useExpiredCompetitions()

  const isLoading =
    loadingTotal ||
    loadingActive ||
    loadingTVL ||
    loadingStats ||
    loadingHealth ||
    loadingExpired

  // Calculate stats from hooks
  const totalCount = totalComps && totalComps > BigInt(0) ? Number(totalComps - BigInt(1)) : 0
  const activeCount = activeIds?.[0]?.length || 0
  const tvlETH = tvl ? parseFloat(formatEther(tvl)).toFixed(4) : '0.0000'
  const endedCount = stats ? Number(stats[2]) : 0
  const expiredCount = expiredIds ? expiredIds.length : 0
  const pendingRefundsETH = health ? parseFloat(formatEther(health[3])).toFixed(4) : '0.0000'

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
      {/* Total Competitions */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total</CardTitle>
          <Trophy className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCount}</div>
          <p className="text-xs text-muted-foreground">Competitions</p>
        </CardContent>
      </Card>

      {/* Active Competitions */}
      <Card className="border-l-4 border-l-green-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeCount}</div>
          <p className="text-xs text-muted-foreground">Live now</p>
        </CardContent>
      </Card>

      {/* Total Value Locked */}
      <Card className="border-l-4 border-l-purple-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">TVL</CardTitle>
          <DollarSign className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{tvlETH} ETH</div>
          <p className="text-xs text-muted-foreground">Total locked</p>
        </CardContent>
      </Card>

      {/* Expired Competitions */}
      <Card className="border-l-4 border-l-orange-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Expired</CardTitle>
          <AlertTriangle className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold flex items-center gap-2">
            {expiredCount}
            {expiredCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                Need Action
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">Need finalization</p>
        </CardContent>
      </Card>

      {/* Ended Competitions */}
      <Card className="border-l-4 border-l-yellow-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ended</CardTitle>
          <Clock className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold flex items-center gap-2">
            {endedCount}
            {endedCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                Awaiting Winner
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">Awaiting winner</p>
        </CardContent>
      </Card>

      {/* Pending Refunds */}
      <Card className="border-l-4 border-l-red-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Refunds</CardTitle>
          <Users className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingRefundsETH} ETH</div>
          <p className="text-xs text-muted-foreground">Unclaimed refunds</p>
        </CardContent>
      </Card>
    </div>
  )
}

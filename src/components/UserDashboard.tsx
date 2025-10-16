/**
 * @title UserDashboard Component
 * @notice User profile showing tickets, balance, and participation
 * @dev KISS principle: Simple overview of user's activity (Phase 3 - Real Data)
 */

'use client'

import { useAccount } from 'wagmi'
import { useClaimableBalance } from '@/hooks/usePublicCompetitions'
import { useUserDashboardData } from '@/hooks/useUserDashboard'
import { WithdrawBalance } from '@/components/WithdrawBalance'
import { UserStatsCards } from '@/components/dashboard/UserStatsCards'
import { ClaimablePrizesAlert } from '@/components/dashboard/ClaimablePrizesAlert'
import { ActiveCompetitionsSection } from '@/components/dashboard/ActiveCompetitionsSection'
import { ParticipationHistoryTable } from '@/components/dashboard/ParticipationHistoryTable'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { formatEther } from 'viem'
import { Trophy, Ticket, Wallet, User, Bell, RefreshCw, AlertCircle } from 'lucide-react'

export function UserDashboard() {
  const { address, isConnected } = useAccount()

  // Single RPC call for all dashboard data (60x faster!)
  const {
    data: dashboardData,
    isLoading: isDashboardLoading,
    error: dashboardError,
    refetch
  } = useUserDashboardData(address)
  const { data: balance, error: balanceError } = useClaimableBalance(address)

  if (!isConnected || !address) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              User Dashboard
            </CardTitle>
            <CardDescription>Connect your wallet to view your dashboard</CardDescription>
          </CardHeader>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Wallet className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p>Please connect your wallet to access your dashboard</p>
          </CardContent>
        </Card>
      </div>
    )
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
    )
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
            onClick={() => refetch()}
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

        <Button onClick={() => refetch()} variant="outline" className="w-full">
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
              <strong>Contract Call:</strong> QueryManager.getUserDashboardData()
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
    )
  }

  const balanceETH = balance ? parseFloat(formatEther(balance)).toFixed(4) : '0.0000'

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
          onClick={() => refetch()}
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
          <AlertDescription>
            {balanceError.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Claimable Balance Alert - Show when user has balance */}
      {balance && balance > BigInt(0) && (
        <Alert className="border-2 border-green-500 bg-green-50">
          <Bell className="h-5 w-5 text-green-600" />
          <AlertTitle className="text-green-800 font-bold text-lg">
            💰 You have {balanceETH} ETH ready to withdraw!
          </AlertTitle>
          <AlertDescription className="text-green-700">
            <p className="mb-2">
              Your prize has been claimed and is ready in your balance.
              <strong> Click "Withdraw to Wallet" below</strong> to transfer it to your wallet.
            </p>
            <p className="text-sm text-green-600">
              ℹ️ Note: Prize claiming is a 2-step process: (1) Claim Prize → Adds to balance, (2) Withdraw → Sends ETH to your wallet
            </p>
          </AlertDescription>
        </Alert>
      )}

      {/* Claimable Prizes Alert */}
      <ClaimablePrizesAlert
        claimableCompIds={dashboardData?.claimableCompIds}
        isLoading={isDashboardLoading}
      />

      {/* Stats Overview */}
      <UserStatsCards
        stats={dashboardData?.stats}
        claimableBalance={balance}
        isLoading={isDashboardLoading}
      />

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Withdraw Balance */}
        <div>
          <WithdrawBalance />
        </div>

        {/* Active Competitions */}
        <ActiveCompetitionsSection
          activeCompIds={dashboardData?.activeCompIds}
          isLoading={isDashboardLoading}
        />
      </div>

      {/* Participation History */}
      <ParticipationHistoryTable
        completedCompIds={dashboardData?.claimableCompIds}
        isLoading={isDashboardLoading}
      />

      {/* Debug Panel - Shows raw contract data for troubleshooting */}
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="text-sm">🔍 Debug Information</CardTitle>
          <CardDescription className="text-xs">
            Raw contract data - useful for troubleshooting display issues
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-xs">
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
            <strong>Active Competitions:</strong> {dashboardData?.activeCompIds?.length || 0} competitions
          </div>
          <div className="pl-4">
            {dashboardData?.activeCompIds?.length ? (
              dashboardData.activeCompIds.map((id) => (
                <div key={id.toString()}>• Competition #{id.toString()}</div>
              ))
            ) : (
              <div className="text-muted-foreground">None</div>
            )}
          </div>
          <div>
            <strong>Claimable Competitions:</strong> {dashboardData?.claimableCompIds?.length || 0} competitions
          </div>
          <div className="pl-4">
            {dashboardData?.claimableCompIds?.length ? (
              dashboardData.claimableCompIds.map((id) => (
                <div key={id.toString()}>• Competition #{id.toString()}</div>
              ))
            ) : (
              <div className="text-muted-foreground">None</div>
            )}
          </div>
          <details className="mt-2">
            <summary className="cursor-pointer font-semibold">
              Full Contract Response
            </summary>
            <pre className="mt-2 p-2 bg-white rounded overflow-auto text-xs max-h-96">
              {JSON.stringify(
                {
                  stats: dashboardData?.stats ? {
                    totalCompetitionsJoined: dashboardData.stats.totalCompetitionsJoined?.toString(),
                    competitionsWon: dashboardData.stats.competitionsWon?.toString(),
                    totalPrizesWon: dashboardData.stats.totalPrizesWon?.toString(),
                  } : null,
                  activeCompIds: dashboardData?.activeCompIds?.map(id => id.toString()),
                  claimableCompIds: dashboardData?.claimableCompIds?.map(id => id.toString()),
                  totalCompetitions: dashboardData?.totalCompetitions?.toString(),
                },
                null,
                2
              )}
            </pre>
          </details>
        </CardContent>
      </Card>
    </div>
  )
}

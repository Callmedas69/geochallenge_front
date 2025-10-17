/**
 * @title My Competitions Table
 * @notice Shows ALL user competitions with inline claim functionality
 * @dev KISS principle - one table for everything, no separate unclaimed section
 */

'use client'

import { useMemo, useEffect } from 'react'
import { useAccount, useReadContract } from 'wagmi'
import { formatEther } from 'viem'
import { useCompetitionById } from '@/hooks/usePublicCompetitions'
import { useClaimPrize, useClaimParticipantPrize, useClaimRefund } from '@/hooks/useUserActions'
import {
  calculateWinnerPrize,
  calculateParticipantPrizeWithWinner,
  calculateRefundAmount,
  calculateEmergencyRefund,
} from '@/lib/prizeCalculations'
import { CONTRACT_ADDRESSES } from '@/lib/contractList'
import { geoChallenge_implementation_ABI } from '@/abi/geoChallenge_implementation_ABI'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Trophy, ExternalLink, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { DECIMALS } from '@/lib/displayConfig'

interface ParticipationHistoryTableProps {
  completedCompIds: readonly bigint[] | undefined
  activeCompIds: readonly bigint[] | undefined
  claimableCompIds: readonly bigint[] | undefined
  isLoading?: boolean
  refetchDashboard?: () => void
  refetchBalance?: () => void
}

/**
 * Single competition row with claim functionality
 */
function CompetitionRow({
  competitionId,
  isActive,
  isClaimable,
  refetchDashboard,
  refetchBalance,
}: {
  competitionId: bigint
  isActive: boolean
  isClaimable: boolean
  refetchDashboard?: () => void
  refetchBalance?: () => void
}) {
  const { address } = useAccount()
  const { data: competition } = useCompetitionById(competitionId)

  // Fetch metadata for competition name
  const { data: metadata } = useReadContract({
    address: CONTRACT_ADDRESSES.GeoChallenge,
    abi: geoChallenge_implementation_ABI,
    functionName: 'getCompetitionMetadata',
    args: [competitionId],
    query: { staleTime: Infinity },
  })

  // Fetch participant prize per ticket (for claimable check)
  const { data: participantPrizePerTicket } = useReadContract({
    address: CONTRACT_ADDRESSES.GeoChallenge,
    abi: geoChallenge_implementation_ABI,
    functionName: 'participantPrizePerTicket',
    args: [competitionId],
    query: { staleTime: 30000, enabled: isClaimable },
  })

  // Claim hooks
  const winnerClaim = useClaimPrize()
  const participantClaim = useClaimParticipantPrize()
  const refundClaim = useClaimRefund()

  // Calculate prize details
  const prizeInfo = useMemo(() => {
    if (!competition || !address || !isClaimable || competition.state !== 3) {
      return null
    }

    const isWinner = address && competition.winner.toLowerCase() === address.toLowerCase()

    // Winner Prize
    if (isWinner && competition.winnerDeclared) {
      return {
        type: 'winner' as const,
        amount: calculateWinnerPrize(competition.prizePool),
      }
    }

    // Participant Prize
    const hasParticipant = participantPrizePerTicket !== undefined && participantPrizePerTicket > 0n
    if (hasParticipant) {
      const amount = competition.winnerDeclared
        ? calculateParticipantPrizeWithWinner(competition.prizePool, competition.totalTickets)
        : participantPrizePerTicket!
      return {
        type: 'participant' as const,
        amount,
      }
    }

    // Refund
    const isCancelled =
      !competition.winnerDeclared &&
      (participantPrizePerTicket === undefined || participantPrizePerTicket === BigInt(0))

    if (isCancelled) {
      const amount =
        competition.emergencyPaused && competition.prizePool > 0n
          ? calculateEmergencyRefund(competition.prizePool, competition.totalTickets)
          : calculateRefundAmount(competition.ticketPrice, competition.treasuryPercent)
      return { type: 'refund' as const, amount }
    }

    return null
  }, [competition, address, isClaimable, participantPrizePerTicket])

  // Handle claim
  const handleClaim = async () => {
    if (!prizeInfo) return
    try {
      if (prizeInfo.type === 'winner') await winnerClaim.claimPrize(competitionId)
      else if (prizeInfo.type === 'participant') await participantClaim.claimParticipantPrize(competitionId)
      else await refundClaim.claimRefund(competitionId)
    } catch (err) {
      console.error('Claim failed:', err)
    }
  }

  const isPending =
    winnerClaim.isPending ||
    winnerClaim.isConfirming ||
    participantClaim.isPending ||
    participantClaim.isConfirming ||
    refundClaim.isPending ||
    refundClaim.isConfirming

  const isSuccess = winnerClaim.isSuccess || participantClaim.isSuccess || refundClaim.isSuccess

  // Auto-refresh dashboard and balance after successful claim
  useEffect(() => {
    if (isSuccess) {
      // Refetch dashboard data to update claimableCompIds and stats
      refetchDashboard?.()
      // Refetch balance to show updated claimable balance
      refetchBalance?.()
    }
  }, [isSuccess, refetchDashboard, refetchBalance])

  const competitionName = metadata?.[0] || `Competition #${competitionId.toString()}`

  // Determine status
  const getStatus = () => {
    if (isActive) return { label: 'Active', color: 'bg-green-500' }
    if (competition?.state === 3) return { label: 'Finalized', color: 'bg-gray-500' }
    return { label: 'Ended', color: 'bg-blue-500' }
  }

  const status = getStatus()

  return (
    <TableRow>
      <TableCell className="font-medium">{competitionName}</TableCell>
      <TableCell>
        <Badge variant="secondary" className={`${status.color} text-white`}>
          {status.label}
        </Badge>
      </TableCell>
      <TableCell>
        {prizeInfo && !isSuccess ? (
          <div className="flex items-center gap-2">
            <span className="font-bold">
              {parseFloat(formatEther(prizeInfo.amount)).toFixed(DECIMALS.FARCASTER)} ETH
            </span>
            <Button onClick={handleClaim} disabled={isPending} size="sm">
              {isPending ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin mr-1" />
                  Claiming...
                </>
              ) : (
                'Claim'
              )}
            </Button>
          </div>
        ) : isSuccess ? (
          <span className="text-sm text-green-600">✓ Claimed</span>
        ) : (
          <span className="text-muted-foreground text-sm">-</span>
        )}
      </TableCell>
      <TableCell className="text-right">
        <Link href={`/competition/${competitionId}`}>
          <Button size="sm" variant="outline">
            View
            <ExternalLink className="h-3 w-3 ml-1" />
          </Button>
        </Link>
      </TableCell>
    </TableRow>
  )
}

export function ParticipationHistoryTable({
  completedCompIds,
  activeCompIds,
  claimableCompIds,
  isLoading,
  refetchDashboard,
  refetchBalance,
}: ParticipationHistoryTableProps) {
  // Merge all competition IDs
  const allCompIds = useMemo(() => {
    const active = activeCompIds || []
    const completed = completedCompIds || []
    const allIds = [...active, ...completed]
    // Remove duplicates
    return Array.from(new Set(allIds.map((id) => id.toString()))).map((id) => BigInt(id))
  }, [activeCompIds, completedCompIds])

  // Create lookup sets for quick checks
  const activeSet = useMemo(
    () => new Set((activeCompIds || []).map((id) => id.toString())),
    [activeCompIds]
  )
  const claimableSet = useMemo(
    () => new Set((claimableCompIds || []).map((id) => id.toString())),
    [claimableCompIds]
  )

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            My Competitions
          </CardTitle>
          <CardDescription>Loading your competitions...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Empty state
  if (!allCompIds || allCompIds.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            My Competitions
          </CardTitle>
          <CardDescription>Your competitions and unclaimed prizes</CardDescription>
        </CardHeader>
        <CardContent className="py-8 text-center text-muted-foreground">
          <Trophy className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>No competitions yet</p>
          <p className="text-xs mt-1">Join competitions to see them here</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          My Competitions ({allCompIds.length})
        </CardTitle>
        <CardDescription>
          {claimableSet.size > 0 && (
            <span className="text-yellow-600 font-semibold">
              You have {claimableSet.size} unclaimed prize{claimableSet.size !== 1 ? 's' : ''}
            </span>
          )}
          {claimableSet.size === 0 && 'All competitions and their statuses'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Competition</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Unclaimed Prize</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allCompIds.map((compId) => (
              <CompetitionRow
                key={compId.toString()}
                competitionId={compId}
                isActive={activeSet.has(compId.toString())}
                isClaimable={claimableSet.has(compId.toString())}
                refetchDashboard={refetchDashboard}
                refetchBalance={refetchBalance}
              />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

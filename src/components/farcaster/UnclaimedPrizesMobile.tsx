/**
 * @title Unclaimed Prizes Mobile
 * @notice Simple list for mobile - one line per prize
 * @dev KISS principle - competition name, amount, button
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Loader2, Gift } from 'lucide-react'
import Link from 'next/link'
import { geoChallenge_implementation_ABI } from '@/abi'
import { CONTRACT_ADDRESSES } from '@/lib/contractList'
import { DECIMALS } from '@/lib/displayConfig'

interface UnclaimedPrizesMobileProps {
  claimableCompIds: readonly bigint[] | undefined
  isLoading?: boolean
  refetchDashboard?: () => void
  refetchBalance?: () => void
}

/**
 * Single prize row - one line: name | amount | button
 */
function UnclaimedPrizeRowMobile({
  competitionId,
  refetchDashboard,
  refetchBalance,
}: {
  competitionId: bigint
  refetchDashboard?: () => void
  refetchBalance?: () => void
}) {
  const { address } = useAccount()
  const { data: competition, isLoading } = useCompetitionById(competitionId)

  // Fetch metadata
  const { data: metadata } = useReadContract({
    address: CONTRACT_ADDRESSES.GeoChallenge,
    abi: geoChallenge_implementation_ABI,
    functionName: 'getCompetitionMetadata',
    args: [competitionId],
    query: { staleTime: 30000 },
  })

  // Fetch participant prize per ticket
  const { data: participantPrizePerTicket } = useReadContract({
    address: CONTRACT_ADDRESSES.GeoChallenge,
    abi: geoChallenge_implementation_ABI,
    functionName: 'participantPrizePerTicket',
    args: [competitionId],
    query: { staleTime: 30000 },
  })

  // Claim hooks
  const winnerClaim = useClaimPrize()
  const participantClaim = useClaimParticipantPrize()
  const refundClaim = useClaimRefund()

  // Determine prize type and amount
  const prize = useMemo(() => {
    if (!competition || !address || competition.state !== 3) return null

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
        hasWinner: competition.winnerDeclared,
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
  }, [competition, address, participantPrizePerTicket])

  // Handle claim
  const handleClaim = async () => {
    if (!prize) return
    try {
      if (prize.type === 'winner') await winnerClaim.claimPrize(competitionId)
      else if (prize.type === 'participant') await participantClaim.claimParticipantPrize(competitionId)
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-between py-2 border-b gap-2">
        <Skeleton className="h-4 flex-1" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-8 w-16" />
      </div>
    )
  }

  if (!competition || !prize) return null

  const competitionName = metadata?.[0] || `Competition #${competitionId}`
  const amountETH = parseFloat(formatEther(prize.amount)).toFixed(DECIMALS.FARCASTER)

  if (isSuccess) {
    return (
      <div className="flex items-center justify-between py-2 border-b bg-green-50 gap-2">
        <Link
          href={`/miniapps/competition/${competitionId}`}
          className="text-xs font-medium hover:underline truncate flex-1"
        >
          {competitionName}
        </Link>
        <span className="text-xs font-bold text-green-600 whitespace-nowrap">{amountETH} Ξ</span>
        <span className="text-xs text-green-600 whitespace-nowrap">✓</span>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between py-2 border-b hover:bg-muted/50 gap-2">
      <Link
        href={`/miniapps/competition/${competitionId}`}
        className="text-xs font-medium hover:underline truncate flex-1"
      >
        {competitionName}
      </Link>
      <span className="text-xs font-bold whitespace-nowrap">{amountETH} Ξ</span>
      <Button onClick={handleClaim} disabled={isPending} size="sm" className="text-xs h-7 px-2">
        {isPending ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          'Claim'
        )}
      </Button>
    </div>
  )
}

/**
 * Main component - simple card with rows
 */
export function UnclaimedPrizesMobile({
  claimableCompIds,
  isLoading,
  refetchDashboard,
  refetchBalance,
}: UnclaimedPrizesMobileProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="p-3 pb-2">
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    )
  }

  if (!claimableCompIds || claimableCompIds.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader className="p-3 pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Gift className="h-4 w-4 text-yellow-600" />
          Unclaimed ({claimableCompIds.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y px-3 pb-2">
          {claimableCompIds.map((compId) => (
            <UnclaimedPrizeRowMobile
              key={compId.toString()}
              competitionId={compId}
              refetchDashboard={refetchDashboard}
              refetchBalance={refetchBalance}
            />
          ))}
        </div>
        <div className="px-3 pb-3 text-xs text-muted-foreground">
          💡 Claim, then withdraw
        </div>
      </CardContent>
    </Card>
  )
}

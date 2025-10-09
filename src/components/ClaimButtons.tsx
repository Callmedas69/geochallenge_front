/**
 * @title ClaimButtons Component
 * @notice Buttons for claiming prizes and refunds
 * @dev KISS principle: Simple, clear states, professional UX
 */

'use client'

import {
  useClaimPrize,
  useClaimParticipantPrize,
  useClaimRefund,
} from '@/hooks/useUserActions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { formatEther } from 'viem'
import { useAccount } from 'wagmi'
import { CheckCircle, Loader2, Trophy, Users, DollarSign } from 'lucide-react'

/**
 * Claim Winner Prize Button
 */
interface ClaimPrizeButtonProps {
  competitionId: bigint
  prizeAmount: bigint
  isWinner: boolean
  isFinalized: boolean
}

export function ClaimPrizeButton({
  competitionId,
  prizeAmount,
  isWinner,
  isFinalized,
}: ClaimPrizeButtonProps) {
  const { address } = useAccount()
  const { claimPrize, isPending, isConfirming, isSuccess, error } = useClaimPrize()

  const handleClaim = async () => {
    try {
      await claimPrize(competitionId)
    } catch (err) {
      console.error('Failed to claim prize:', err)
    }
  }

  if (!address) {
    return null
  }

  if (!isWinner) {
    return null
  }

  if (!isFinalized) {
    return (
      <Alert>
        <AlertDescription>
          Competition must be finalized before claiming prize
        </AlertDescription>
      </Alert>
    )
  }

  if (isSuccess) {
    return (
      <Alert className="border-green-500 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          <p className="font-semibold mb-1">🎉 Prize claimed successfully!</p>
          <p className="text-sm">
            ⚠️ <strong>Important:</strong> Go to <a href="/dashboard" className="underline font-bold">Your Dashboard</a> and click "Withdraw to Wallet" to receive your ETH.
          </p>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Card className="border-yellow-500 bg-yellow-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-600" />
          Winner Prize Available
        </CardTitle>
        <CardDescription>You are the winner! Claim your prize.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-white rounded-lg">
          <span className="text-sm font-medium">Prize Amount:</span>
          <span className="text-2xl font-bold text-yellow-600">
            {formatEther(prizeAmount)} ETH
          </span>
        </div>

        <Button
          onClick={handleClaim}
          disabled={isPending || isConfirming}
          className="w-full bg-yellow-600 hover:bg-yellow-700"
          size="lg"
        >
          {isPending && (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Waiting for approval...
            </>
          )}
          {isConfirming && (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Confirming claim...
            </>
          )}
          {!isPending && !isConfirming && (
            <>
              <Trophy className="mr-2 h-4 w-4" />
              Claim Winner Prize
            </>
          )}
        </Button>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>
              {error.message.includes('Already claimed')
                ? 'Prize already claimed'
                : 'Failed to claim prize. Please try again.'}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}

/**
 * Claim Participant Prize Button (when no winner)
 */
interface ClaimParticipantPrizeButtonProps {
  competitionId: bigint
  prizePerTicket: bigint
  hasTicket: boolean
  isFinalized: boolean
  hasWinner: boolean
}

export function ClaimParticipantPrizeButton({
  competitionId,
  prizePerTicket,
  hasTicket,
  isFinalized,
  hasWinner,
}: ClaimParticipantPrizeButtonProps) {
  const { address } = useAccount()
  const { claimParticipantPrize, isPending, isConfirming, isSuccess, error } =
    useClaimParticipantPrize()

  const handleClaim = async () => {
    try {
      await claimParticipantPrize(competitionId)
    } catch (err) {
      console.error('Failed to claim participant prize:', err)
    }
  }

  // Show for ALL ticket holders (both winner and no-winner scenarios)
  if (!address || !hasTicket) {
    return null
  }

  if (!isFinalized) {
    return (
      <Alert>
        <AlertDescription>
          Competition must be finalized before claiming participant prize
        </AlertDescription>
      </Alert>
    )
  }

  if (isSuccess) {
    return (
      <Alert className="border-green-500 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          <p className="font-semibold mb-1">✅ Participant prize claimed!</p>
          <p className="text-sm">
            ⚠️ <strong>Important:</strong> Go to <a href="/dashboard" className="underline font-bold">Your Dashboard</a> and click "Withdraw to Wallet" to receive your ETH.
          </p>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Card className="border-blue-500 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-600" />
          {hasWinner ? 'Consolation Prize' : 'Claim Your Share'}
        </CardTitle>
        <CardDescription>
          {hasWinner
            ? 'Thank you for participating! Claim your consolation prize.'
            : 'No winner was declared. Prize pool is split among all participants.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-white rounded-lg">
          <span className="text-sm font-medium">{hasWinner ? 'Consolation:' : 'Your Share:'}</span>
          <span className="text-2xl font-bold text-blue-600">
            {formatEther(prizePerTicket)} ETH
          </span>
        </div>

        <Button
          onClick={handleClaim}
          disabled={isPending || isConfirming}
          className="w-full bg-blue-600 hover:bg-blue-700"
          size="lg"
        >
          {isPending && (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Waiting for approval...
            </>
          )}
          {isConfirming && (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Confirming claim...
            </>
          )}
          {!isPending && !isConfirming && (
            <>
              <DollarSign className="mr-2 h-4 w-4" />
              {hasWinner ? 'Claim Consolation Prize' : 'Claim Participant Prize'}
            </>
          )}
        </Button>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>
              {error.message.includes('Already claimed')
                ? 'Prize already claimed'
                : 'Failed to claim prize. Please try again.'}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}

/**
 * Claim Refund Button (when competition cancelled)
 */
interface ClaimRefundButtonProps {
  competitionId: bigint
  refundAmount: bigint
  hasTicket: boolean
  isCancelled: boolean
}

export function ClaimRefundButton({
  competitionId,
  refundAmount,
  hasTicket,
  isCancelled,
}: ClaimRefundButtonProps) {
  const { address } = useAccount()
  const { claimRefund, isPending, isConfirming, isSuccess, error } = useClaimRefund()

  const handleClaim = async () => {
    try {
      await claimRefund(competitionId)
    } catch (err) {
      console.error('Failed to claim refund:', err)
    }
  }

  if (!address || !hasTicket || !isCancelled) {
    return null
  }

  if (isSuccess) {
    return (
      <Alert className="border-green-500 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800 font-semibold">
          ✅ Refund claimed successfully!
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Card className="border-red-500 bg-red-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-red-600" />
          Refund Available
        </CardTitle>
        <CardDescription>
          This competition was cancelled. Claim your refund.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-white rounded-lg">
          <span className="text-sm font-medium">Refund Amount:</span>
          <span className="text-2xl font-bold text-red-600">
            {formatEther(refundAmount)} ETH
          </span>
        </div>

        <Button
          onClick={handleClaim}
          disabled={isPending || isConfirming}
          className="w-full bg-red-600 hover:bg-red-700"
          size="lg"
        >
          {isPending && (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Waiting for approval...
            </>
          )}
          {isConfirming && (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Confirming claim...
            </>
          )}
          {!isPending && !isConfirming && 'Claim Refund'}
        </Button>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>
              {error.message.includes('Already claimed')
                ? 'Refund already claimed'
                : 'Failed to claim refund. Please try again.'}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}

/**
 * @title SubmitWinnerProof Component
 * @notice Submit winner proof with EIP-712 signature
 * @dev KISS principle: Simple button with clear states
 */

'use client'

import { useSubmitProof } from '@/hooks/useSubmitProof'
import { useUserTicketBalance } from '@/hooks/usePublicCompetitions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useAccount } from 'wagmi'
import { CheckCircle, Loader2, Trophy } from 'lucide-react'

interface SubmitWinnerProofProps {
  competitionId: bigint
  hasEnded: boolean
  hasWinner: boolean
}

export function SubmitWinnerProof({
  competitionId,
  hasEnded,
  hasWinner,
}: SubmitWinnerProofProps) {
  const { address } = useAccount()
  const { data: ticketBalance } = useUserTicketBalance(address, competitionId)
  const {
    submitProof,
    isGeneratingProof,
    isPending,
    isConfirming,
    isSuccess,
    error,
  } = useSubmitProof()

  const handleSubmit = async () => {
    try {
      await submitProof(competitionId)
    } catch (err) {
      console.error('Failed to submit proof:', err)
    }
  }

  // Only show if competition has ended and no winner yet
  if (!hasEnded || hasWinner) {
    return null
  }

  // Must own a ticket
  const hasTicket = ticketBalance && ticketBalance > BigInt(0)
  if (!hasTicket || !address) {
    return null
  }

  // Success state
  if (isSuccess) {
    return (
      <Card className="border-green-500 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <CheckCircle className="h-5 w-5" />
            Proof Submitted Successfully!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="border-green-500 bg-white">
            <Trophy className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Your winner proof has been submitted! The admin will review and declare the winner shortly.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  // Loading states
  const getButtonText = () => {
    if (isGeneratingProof) return 'Generating proof...'
    if (isPending) return 'Waiting for approval...'
    if (isConfirming) return 'Confirming submission...'
    return 'I am the Winner! Submit Proof'
  }

  const isLoading = isGeneratingProof || isPending || isConfirming

  return (
    <Card className="border-yellow-500 bg-yellow-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-yellow-800">
          <Trophy className="h-5 w-5" />
          Claim Victory
        </CardTitle>
        <CardDescription className="text-yellow-700">
          Submit proof that you completed the challenge
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Instructions */}
        <Alert>
          <Trophy className="h-4 w-4" />
          <AlertTitle>How it works</AlertTitle>
          <AlertDescription className="space-y-2 mt-2">
            <p>1. Click the button below to submit your proof</p>
            <p>2. We'll generate a cryptographic proof</p>
            <p>3. Submit proof to the contract</p>
            <p>4. Wait for admin to declare winner</p>
          </AlertDescription>
        </Alert>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full bg-yellow-600 hover:bg-yellow-700"
          size="lg"
        >
          {isGeneratingProof && (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating proof...
            </>
          )}
          {isPending && (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Waiting for approval...
            </>
          )}
          {isConfirming && (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Confirming submission...
            </>
          )}
          {!isLoading && (
            <>
              <Trophy className="mr-2 h-4 w-4" />
              I am the Winner! Submit Proof
            </>
          )}
        </Button>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>
              {`Error: ${error}`}
            </AlertDescription>
          </Alert>
        )}

        {/* Info */}
        <p className="text-xs text-muted-foreground text-center">
          A cryptographic proof will be generated and submitted to the blockchain.
        </p>
      </CardContent>
    </Card>
  )
}

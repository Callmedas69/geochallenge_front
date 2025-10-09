/**
 * @title WithdrawBalance Component
 * @notice Withdraw accumulated balance to user wallet
 * @dev KISS principle: Simple balance display and withdraw button
 */

'use client'

import { useWithdrawBalance } from '@/hooks/useUserActions'
import { useClaimableBalance } from '@/hooks/usePublicCompetitions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { formatEther } from 'viem'
import { useAccount } from 'wagmi'
import { CheckCircle, Loader2, DollarSign, Wallet } from 'lucide-react'

export function WithdrawBalance() {
  const { address } = useAccount()
  const { data: balance } = useClaimableBalance(address)
  const { withdrawBalance, isPending, isConfirming, isSuccess, error } = useWithdrawBalance()

  const handleWithdraw = async () => {
    try {
      await withdrawBalance()
    } catch (err) {
      console.error('Failed to withdraw balance:', err)
    }
  }

  // Not connected
  if (!address) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Withdraw Balance
          </CardTitle>
          <CardDescription>Connect your wallet to view your balance</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  // No balance
  if (!balance || balance === BigInt(0)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Withdraw Balance
          </CardTitle>
          <CardDescription>You have no balance to withdraw</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <DollarSign className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No balance available</p>
            <p className="text-xs mt-1">Win prizes or claim participant shares to earn balance</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Success state
  if (isSuccess) {
    return (
      <Card className="border-green-500 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <CheckCircle className="h-5 w-5" />
            Withdrawal Successful
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="border-green-500 bg-white">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 font-semibold">
              ✅ {formatEther(balance)} ETH withdrawn to your wallet!
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Withdraw Balance
        </CardTitle>
        <CardDescription>Withdraw your accumulated earnings to your wallet</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Balance Display */}
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-500 rounded-full">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Available Balance</p>
              <p className="text-3xl font-bold text-green-600">{formatEther(balance)} ETH</p>
            </div>
          </div>
        </div>

        {/* Withdraw Button */}
        <Button
          onClick={handleWithdraw}
          disabled={isPending || isConfirming}
          className="w-full bg-green-600 hover:bg-green-700"
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
              Confirming withdrawal...
            </>
          )}
          {!isPending && !isConfirming && (
            <>
              <Wallet className="mr-2 h-4 w-4" />
              Withdraw to Wallet
            </>
          )}
        </Button>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>
              {error.message.includes('Insufficient balance')
                ? 'Insufficient balance to withdraw'
                : 'Failed to withdraw. Please try again.'}
            </AlertDescription>
          </Alert>
        )}

        {/* Info */}
        <Alert variant="default" className="bg-blue-50 border-blue-200">
          <AlertDescription className="text-sm text-blue-800">
            <p className="font-semibold mb-1">ℹ️ How Prize Claims Work:</p>
            <ol className="list-decimal list-inside space-y-1 text-xs">
              <li><strong>Claim Prize:</strong> Adds ETH to your claimable balance (shown above)</li>
              <li><strong>Withdraw Balance:</strong> Transfers ETH from balance to your wallet</li>
            </ol>
            <p className="text-xs mt-2 text-blue-600">Gas fees apply to the withdrawal transaction.</p>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}

/**
 * @title Claimable Prizes Alert Component
 * @notice Shows competitions where user can claim prizes
 * @dev KISS principle - simple alert with list of claimable competitions
 */

'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Trophy, Gift } from 'lucide-react'
import Link from 'next/link'

interface ClaimablePrizesAlertProps {
  claimableCompIds: readonly bigint[] | undefined
  isLoading?: boolean
}

export function ClaimablePrizesAlert({ claimableCompIds, isLoading }: ClaimablePrizesAlertProps) {
  if (isLoading) {
    return (
      <Alert className="border-yellow-500 bg-yellow-50 animate-pulse">
        <Trophy className="h-5 w-5 text-yellow-600" />
        <AlertTitle className="text-yellow-800 font-bold text-lg">
          <div className="h-6 w-48 bg-yellow-200 rounded" />
        </AlertTitle>
        <AlertDescription>
          <div className="h-4 w-64 bg-yellow-200 rounded" />
        </AlertDescription>
      </Alert>
    )
  }

  // Don't show if no claimable prizes
  if (!claimableCompIds || claimableCompIds.length === 0) {
    return null
  }

  return (
    <Alert className="border-2 border-yellow-500 bg-yellow-50">
      <Gift className="h-5 w-5 text-yellow-600" />
      <AlertTitle className="text-yellow-800 font-bold text-lg">
        You have {claimableCompIds.length} prize{claimableCompIds.length !== 1 ? 's' : ''} to claim!
      </AlertTitle>
      <AlertDescription className="text-yellow-700 space-y-3">
        <p>
          Visit your competitions below to claim your prizes. Prizes must be claimed before you can withdraw
          them to your wallet.
        </p>

        <div className="flex flex-col gap-2 mt-3">
          {claimableCompIds.slice(0, 5).map((compId) => (
            <div
              key={compId.toString()}
              className="flex items-center justify-between bg-white rounded-lg p-3 border border-yellow-300"
            >
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-yellow-600" />
                <span className="font-medium">Competition #{compId.toString()}</span>
              </div>
              <Link href={`/competition/${compId}`}>
                <Button size="sm" variant="default" className="bg-yellow-600 hover:bg-yellow-700">
                  Claim Prize
                </Button>
              </Link>
            </div>
          ))}

          {claimableCompIds.length > 5 && (
            <p className="text-sm text-yellow-600 text-center">
              +{claimableCompIds.length - 5} more prize{claimableCompIds.length - 5 !== 1 ? 's' : ''} available
            </p>
          )}
        </div>

        <p className="text-sm text-yellow-600 mt-2">
          ℹ️ Prize claiming is a 2-step process: (1) Claim Prize → Adds to balance, (2) Withdraw → Sends ETH
          to your wallet
        </p>
      </AlertDescription>
    </Alert>
  )
}

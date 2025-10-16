/**
 * @title Claimable Prizes Alert Mobile Component (Farcaster)
 * @notice Mobile-optimized alert showing claimable prizes
 * @dev KISS principle - compact mobile design, shows up to 3 prizes
 */

'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Gift, Trophy } from 'lucide-react'
import Link from 'next/link'

interface ClaimablePrizesAlertMobileProps {
  claimableCompIds: readonly bigint[] | undefined
  isLoading?: boolean
}

export function ClaimablePrizesAlertMobile({
  claimableCompIds,
  isLoading,
}: ClaimablePrizesAlertMobileProps) {
  if (isLoading) {
    return (
      <Alert className="border-yellow-500 bg-yellow-50 animate-pulse">
        <Gift className="h-4 w-4 text-yellow-600" />
        <AlertTitle className="text-yellow-800 font-semibold text-sm">
          <div className="h-5 w-32 bg-yellow-200 rounded" />
        </AlertTitle>
        <AlertDescription>
          <div className="h-3 w-48 bg-yellow-200 rounded" />
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
      <Gift className="h-4 w-4 text-yellow-600" />
      <AlertTitle className="text-yellow-800 font-semibold text-sm">
        {claimableCompIds.length} Prize{claimableCompIds.length !== 1 ? 's' : ''} to Claim!
      </AlertTitle>
      <AlertDescription className="text-yellow-700 space-y-2">
        <p className="text-xs">
          Tap competitions below to claim your prizes.
        </p>

        <div className="flex flex-col gap-2">
          {claimableCompIds.slice(0, 3).map((compId) => (
            <div
              key={compId.toString()}
              className="flex items-center justify-between bg-white rounded-md p-2 border border-yellow-300"
            >
              <div className="flex items-center gap-2">
                <Trophy className="h-3 w-3 text-yellow-600 flex-shrink-0" />
                <span className="font-medium text-xs">Competition #{compId.toString()}</span>
              </div>
              <Link href={`/miniapps/competition/${compId}`}>
                <Button size="sm" variant="default" className="bg-yellow-600 hover:bg-yellow-700 h-7 px-3">
                  <span className="text-xs">Claim</span>
                </Button>
              </Link>
            </div>
          ))}

          {claimableCompIds.length > 3 && (
            <p className="text-xs text-yellow-600 text-center">
              +{claimableCompIds.length - 3} more in Completed tab
            </p>
          )}
        </div>

        <p className="text-xs text-yellow-600">
          ℹ️ Claim → adds to balance, then Withdraw on main site
        </p>
      </AlertDescription>
    </Alert>
  )
}

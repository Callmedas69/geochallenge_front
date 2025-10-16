/**
 * @title Network Switcher Component
 * @notice Alerts users when on unsupported network and provides switch button
 * @dev KISS principle: Simple alert with one-click network switching
 */

'use client'

import { useChainId, useSwitchChain } from 'wagmi'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'
import { isSupportedNetwork, SUPPORTED_NETWORKS } from '@/lib/networkConfig'

export function NetworkSwitcher() {
  const chainId = useChainId()
  const { switchChain, isPending } = useSwitchChain()

  // Hide if on correct network
  if (isSupportedNetwork(chainId)) {
    return null
  }

  // Prefer mainnet, fallback to testnet
  const defaultNetwork = SUPPORTED_NETWORKS.mainnet

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle className="text-sm font-semibold">Wrong Network</AlertTitle>
      <AlertDescription className="text-xs space-y-2">
        <p>
          You're connected to an unsupported network. Please switch to Base
          Mainnet or Base Sepolia.
        </p>
        <div className="flex gap-2 mt-2">
          <Button
            size="sm"
            onClick={() => switchChain({ chainId: SUPPORTED_NETWORKS.mainnet.id })}
            disabled={isPending}
            className="h-8 text-xs"
          >
            {isPending ? 'Switching...' : 'Switch to Base Mainnet'}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => switchChain({ chainId: SUPPORTED_NETWORKS.testnet.id })}
            disabled={isPending}
            className="h-8 text-xs"
          >
            {isPending ? 'Switching...' : 'Switch to Base Sepolia'}
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  )
}

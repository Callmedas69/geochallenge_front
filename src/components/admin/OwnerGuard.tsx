/**
 * @title OwnerGuard Component
 * @notice Protects admin routes - only contract owner can access
 * @dev KISS principle - simple address check with clear error states
 */

'use client'

import { useAccount } from 'wagmi'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { AlertCircle, Lock } from 'lucide-react'
import Link from 'next/link'

const OWNER_ADDRESS = '0x127E3d1c1ae474A688789Be39fab0da6371926A7' // From deployment

interface OwnerGuardProps {
  children: React.ReactNode
}

export function OwnerGuard({ children }: OwnerGuardProps) {
  const { address, isConnected, isConnecting } = useAccount()

  // Loading state
  if (isConnecting) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="text-muted-foreground">Checking wallet...</p>
        </div>
      </div>
    )
  }

  // Not connected
  if (!isConnected || !address) {
    return (
      <div className="mx-auto max-w-2xl p-8">
        <Alert variant="destructive">
          <Lock className="h-4 w-4" />
          <AlertTitle>Wallet Not Connected</AlertTitle>
          <AlertDescription className="mt-2">
            You must connect your wallet to access the admin dashboard.
          </AlertDescription>
        </Alert>
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">Please connect your wallet using the button in the header</p>
        </div>
      </div>
    )
  }

  // Not owner
  if (address.toLowerCase() !== OWNER_ADDRESS.toLowerCase()) {
    return (
      <div className="mx-auto max-w-2xl p-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription className="mt-2 space-y-2">
            <p>Only the contract owner can access the admin dashboard.</p>
            <p className="text-sm">
              <span className="font-semibold">Your address:</span>
              <br />
              <code className="text-xs">{address}</code>
            </p>
            <p className="text-sm">
              <span className="font-semibold">Owner address:</span>
              <br />
              <code className="text-xs">{OWNER_ADDRESS}</code>
            </p>
          </AlertDescription>
        </Alert>
        <div className="mt-6 text-center">
          <Link href="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Is owner - show admin content
  return <>{children}</>
}

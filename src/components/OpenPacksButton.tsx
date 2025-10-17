/**
 * @title Open Packs Button Component
 * @notice Standalone button for opening existing unopened booster packs
 * @dev Uses useOpenPacks hook for pack opening logic
 */

'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import type { Address } from 'viem'
import { useOpenPacks } from '@/hooks/useOpenPacks'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Package, CheckCircle2, Loader2, AlertCircle, PackageOpen } from 'lucide-react'

interface OpenPacksButtonProps {
  /** BoosterDrop contract address */
  collectionAddress: Address
  /** Optional: Custom button text */
  buttonText?: string
}

export function OpenPacksButton({
  collectionAddress,
  buttonText = 'Open Packs',
}: OpenPacksButtonProps) {
  const { address, isConnected } = useAccount()
  const [open, setOpen] = useState(false)
  const [quantityToOpen, setQuantityToOpen] = useState<string>('1')
  const [unopenedPacks, setUnopenedPacks] = useState<Array<{ tokenId: string }>>([])
  const [loadingPacks, setLoadingPacks] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)

  // Get token IDs to open (first N unopened packs)
  const quantity = parseInt(quantityToOpen) || 0
  const tokenIdsToOpen = unopenedPacks
    .slice(0, quantity)
    .map((pack) => BigInt(pack.tokenId))

  // Use pack opening hook
  const {
    open: openPacks,
    isOpening,
    isSuccess,
    error: openError,
  } = useOpenPacks({
    collectionAddress,
    tokenIds: tokenIdsToOpen,
  })

  // Fetch unopened packs from API
  useEffect(() => {
    if (!address || !open) return

    const fetchUnopenedPacks = async () => {
      try {
        setLoadingPacks(true)
        setFetchError(null)

        // Fetch all user holdings (no status filter to avoid conflicts)
        const response = await fetch(
          `/api/vibe/holdings/${address}?contractAddress=${collectionAddress}&chainId=8453`
        )

        if (!response.ok) throw new Error('Failed to fetch packs')

        const data = await response.json()
        const boxes = data.boxes || []

        // Filter for unopened packs (rarity = 0)
        const unopened = boxes.filter((box: any) => box.rarity === 0)
        setUnopenedPacks(unopened)
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Failed to fetch packs'
        console.error('Error fetching unopened packs:', error)
        setFetchError(errorMsg)
        setUnopenedPacks([])
      } finally {
        setLoadingPacks(false)
      }
    }

    fetchUnopenedPacks()
  }, [address, collectionAddress, open])

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setQuantityToOpen('1')
        setUnopenedPacks([])
        setFetchError(null)
      }, 300)
    }
  }, [open])

  const handleOpen = () => {
    openPacks()
  }

  const unopenedCount = unopenedPacks.length
  const canOpen = isConnected && quantity > 0 && quantity <= unopenedCount && !isOpening && tokenIdsToOpen.length > 0

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="p-3 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors group cursor-pointer">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PackageOpen className="h-4 w-4" />
              <span className="font-medium text-sm">{buttonText}</span>
            </div>
            <span className="text-xs text-muted-foreground group-hover:translate-x-1 transition-transform">
              →
            </span>
          </div>
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PackageOpen className="h-5 w-5" />
            Open Booster Packs
          </DialogTitle>
          <DialogDescription>
            Reveal your unopened packs with entropy-based randomness
          </DialogDescription>
        </DialogHeader>

        {!isConnected ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Please connect your wallet to open packs</AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            {/* Success State */}
            {isSuccess && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  <strong>Success!</strong> {quantity} pack(s) opened! Randomness is being processed...
                </AlertDescription>
              </Alert>
            )}

            {/* Error State */}
            {openError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {openError}
                </AlertDescription>
              </Alert>
            )}

            {/* Unopened packs count */}
            {!isSuccess && (
              <>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Unopened Packs:</span>
                    <div className="text-right">
                      {loadingPacks ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <div className="text-lg font-bold">{unopenedCount}</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quantity Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    How many to open? (max {unopenedCount})
                  </label>
                  <Input
                    type="number"
                    placeholder={`Enter 1-${unopenedCount}...`}
                    value={quantityToOpen}
                    onChange={(e) => setQuantityToOpen(e.target.value)}
                    min="1"
                    max={unopenedCount}
                    disabled={unopenedCount === 0}
                  />
                </div>

                {/* Open Button */}
                <Button
                  onClick={handleOpen}
                  disabled={!canOpen}
                  className="w-full"
                  size="lg"
                >
                  {isOpening ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Opening...
                    </>
                  ) : (
                    <>
                      <PackageOpen className="mr-2 h-4 w-4" />
                      Open {quantity} Pack{quantity !== 1 ? 's' : ''}
                    </>
                  )}
                </Button>
              </>
            )}

            {/* Close Button (after success) */}
            {isSuccess && (
              <Button onClick={() => setOpen(false)} className="w-full">
                Close
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

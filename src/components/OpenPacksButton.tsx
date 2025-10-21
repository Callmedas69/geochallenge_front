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
import { useOpenRarity } from '@/hooks/useVibeAPI'
import { RARITY_MAP } from '@/lib/validateCollection'
import { API_CHAIN_ID } from '@/lib/config'
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
  /** Optional: Callback when packs are successfully opened */
  onPacksOpened?: () => void
}

export function OpenPacksButton({
  collectionAddress,
  buttonText = 'Open Packs',
  onPacksOpened,
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
    hash,
  } = useOpenPacks({
    collectionAddress,
    tokenIds: tokenIdsToOpen,
  })

  // Fetch rarity breakdown after successful opening
  const { data: rarityData, loading: loadingRarity } = useOpenRarity(
    hash,
    collectionAddress
  )

  // Fetch unopened packs from API
  useEffect(() => {
    if (!address || !open) return

    const fetchUnopenedPacks = async () => {
      try {
        setLoadingPacks(true)
        setFetchError(null)

        // Fetch unopened packs (status=minted, rarity=0)
        const response = await fetch(
          `/api/vibe/unopened/${address}?contractAddress=${collectionAddress}&chainId=${API_CHAIN_ID}`
        )

        if (!response.ok) throw new Error('Failed to fetch packs')

        const data = await response.json()
        const boxes = data.boxes || []

        // API returns only unopened packs (status=minted, rarity=0)
        // No need to filter, but keep safety check for rarity=0
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

  // Call onPacksOpened callback when packs are successfully opened
  useEffect(() => {
    if (isSuccess) {
      onPacksOpened?.()
    }
  }, [isSuccess, onPacksOpened])

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
                  <strong>Success!</strong> {quantity} pack(s) opened!
                  {loadingRarity ? (
                    <div className="mt-2 flex items-center gap-2 text-sm">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span>Loading rarity data...</span>
                    </div>
                  ) : rarityData?.success && rarityData.rarities ? (
                    <div className="mt-2 text-sm font-medium">
                      {Object.entries(rarityData.rarities)
                        .filter(([_, count]) => count > 0)
                        .map(([rarity, count]) => (
                          <span key={rarity} className="mr-3">
                            • {count}x {RARITY_MAP[Number(rarity)]}
                          </span>
                        ))}
                    </div>
                  ) : (
                    <div className="mt-1 text-sm">
                      Randomness is being processed...
                    </div>
                  )}
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

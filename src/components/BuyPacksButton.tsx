/**
 * @title Buy Packs Button Component
 * @notice Inline purchase of VibeMarket booster packs
 * @dev KISS principle: Clean UI with predefined quantities and custom input
 */

'use client'

import { useState, useEffect } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { useQuery } from '@tanstack/react-query'
import type { Address } from 'viem'
import { formatEther, parseEther } from 'viem'
import { boosterDropV2_ABI } from '@/abi/boosterDropV2_ABI'
import { REFERRER_ADDRESS } from '@/lib/config'
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
import { Package, CheckCircle2, Loader2, AlertCircle } from 'lucide-react'

interface BuyPacksButtonProps {
  /** BoosterDrop contract address (collection address) */
  collectionAddress: Address
  /** Optional: Custom button text */
  buttonText?: string
}

const PREDEFINED_QUANTITIES = [1, 50, 500, 1000]

export function BuyPacksButton({
  collectionAddress,
  buttonText = 'Buy Packs',
}: BuyPacksButtonProps) {
  const { address, isConnected } = useAccount()
  const [open, setOpen] = useState(false)
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1)
  const [customQuantity, setCustomQuantity] = useState<string>('')
  const [isCustomMode, setIsCustomMode] = useState(false)

  // Calculate actual quantity to use
  const actualQuantity = isCustomMode
    ? parseInt(customQuantity) || 0
    : selectedQuantity

  // Fetch mint price for selected quantity
  const {
    data: mintPrice,
    isLoading: loadingPrice,
    error: priceError,
  } = useReadContract({
    address: collectionAddress,
    abi: boosterDropV2_ABI,
    functionName: 'getMintPrice',
    args: [BigInt(actualQuantity)],
    query: {
      enabled: actualQuantity > 0,
      staleTime: 30_000,
    },
  })

  // Fetch ETH price in USD from Vibe API
  const { data: ethPriceData } = useQuery({
    queryKey: ['ethPriceUSD'],
    queryFn: async () => {
      const response = await fetch('/api/vibe/ethPrice_USD')
      if (!response.ok) throw new Error('Failed to fetch ETH price')
      return response.json()
    },
    staleTime: 60_000, // Cache for 60 seconds
    refetchInterval: 60_000, // Refresh every minute
  })

  // Calculate USD value
  const ethPrice = ethPriceData?.price || 0
  const priceETH = mintPrice ? parseFloat(formatEther(mintPrice)).toFixed(6) : '...'
  const priceUSD = mintPrice && ethPrice > 0
    ? (parseFloat(formatEther(mintPrice)) * ethPrice).toFixed(2)
    : '...'

  // Mint transaction
  const {
    data: hash,
    writeContract,
    isPending: isMintPending,
    error: mintError,
    reset: resetMint,
  } = useWriteContract()

  // Wait for transaction confirmation
  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: confirmError,
  } = useWaitForTransactionReceipt({
    hash,
  })

  // Reset states when dialog closes
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setSelectedQuantity(1)
        setCustomQuantity('')
        setIsCustomMode(false)
        resetMint()
      }, 300)
    }
  }, [open, resetMint])

  const handleMint = async () => {
    if (!address || !mintPrice || actualQuantity <= 0) return

    try {
      writeContract({
        address: collectionAddress,
        abi: boosterDropV2_ABI,
        functionName: 'mint',
        args: [BigInt(actualQuantity), address, REFERRER_ADDRESS, REFERRER_ADDRESS],
        value: mintPrice,
      })
    } catch (error) {
      console.error('Mint error:', error)
    }
  }

  const handleQuantitySelect = (quantity: number) => {
    setSelectedQuantity(quantity)
    setIsCustomMode(false)
    setCustomQuantity('')
  }

  const handleCustomInput = (value: string) => {
    setCustomQuantity(value)
    setIsCustomMode(true)
  }

  const canMint = isConnected && actualQuantity > 0 && mintPrice && !isMintPending && !isConfirming

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="p-3 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors group cursor-pointer">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4" />
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
            <Package className="h-5 w-5" />
            Buy Booster Packs
          </DialogTitle>
          <DialogDescription>
            Select quantity and mint booster packs with ETH
          </DialogDescription>
        </DialogHeader>

        {!isConnected ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Please connect your wallet to buy packs</AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            {/* Success State */}
            {isConfirmed && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  <strong>Success!</strong> {actualQuantity} pack(s) minted successfully!
                </AlertDescription>
              </Alert>
            )}

            {/* Error State */}
            {(mintError || confirmError || priceError) && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {mintError?.message || confirmError?.message || priceError?.message || 'Transaction failed'}
                </AlertDescription>
              </Alert>
            )}

            {/* Predefined Quantities */}
            {!isConfirmed && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Quick Select</label>
                  <div className="grid grid-cols-4 gap-2">
                    {PREDEFINED_QUANTITIES.map((qty) => (
                      <Button
                        key={qty}
                        variant={selectedQuantity === qty && !isCustomMode ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleQuantitySelect(qty)}
                      >
                        {qty}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Custom Quantity Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Custom Amount</label>
                  <Input
                    type="number"
                    placeholder="Enter quantity..."
                    value={customQuantity}
                    onChange={(e) => handleCustomInput(e.target.value)}
                    min="1"
                    className={isCustomMode ? 'ring-2 ring-primary' : ''}
                  />
                </div>

                {/* Price Display */}
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Price:</span>
                    <div className="text-right">
                      {loadingPrice ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <div className="text-lg font-bold">{priceETH} ETH</div>
                          {ethPrice > 0 && priceUSD !== '...' && (
                            <div className="text-sm text-muted-foreground">
                              ~${priceUSD} USD
                            </div>
                          )}
                          {actualQuantity > 0 && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {actualQuantity} pack{actualQuantity !== 1 ? 's' : ''}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Mint Button */}
                <Button
                  onClick={handleMint}
                  disabled={!canMint}
                  className="w-full"
                  size="lg"
                >
                  {isMintPending || isConfirming ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isMintPending ? 'Waiting for approval...' : 'Confirming...'}
                    </>
                  ) : (
                    <>
                      <Package className="mr-2 h-4 w-4" />
                      Mint {actualQuantity} Pack{actualQuantity !== 1 ? 's' : ''}
                    </>
                  )}
                </Button>
              </>
            )}

            {/* Close Button (after success) */}
            {isConfirmed && (
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

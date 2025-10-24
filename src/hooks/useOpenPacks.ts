/**
 * @title useOpenPacks Hook
 * @notice Simple hook for opening booster packs with entropy-based randomness
 * @dev KISS principle: Just get fee and execute open. No API calls.
 */

'use client'

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import type { Address } from 'viem'
import { boosterDropV2_ABI } from '@/abi/boosterDropV2_ABI'

interface UseOpenPacksParams {
  /** BoosterDrop contract address */
  collectionAddress: Address
  /** Token IDs to open */
  tokenIds: bigint[]
}

interface OpenPacksState {
  /** Execute pack opening */
  open: () => void
  /** True if confirming or waiting for transaction */
  isOpening: boolean
  /** True if packs opened successfully */
  isSuccess: boolean
  /** Error object if opening failed */
  error: Error | null
  /** Transaction hash */
  hash: `0x${string}` | undefined
}

export function useOpenPacks({
  collectionAddress,
  tokenIds,
}: UseOpenPacksParams): OpenPacksState {
  // Read entropy fee from contract
  const {
    data: entropyFee,
    isLoading: loadingFee,
  } = useReadContract({
    address: collectionAddress,
    abi: boosterDropV2_ABI,
    functionName: 'getEntropyFee',
  })

  // Open transaction
  const {
    data: hash,
    writeContract,
    isPending: isConfirming,
    error: writeError,
  } = useWriteContract()

  // Wait for transaction confirmation
  const {
    isLoading: isWaitingConfirm,
    isSuccess,
    error: confirmError,
  } = useWaitForTransactionReceipt({
    hash,
  })

  // Execute pack opening
  const open = () => {
    if (!entropyFee || tokenIds.length === 0) return

    writeContract({
      address: collectionAddress,
      abi: boosterDropV2_ABI,
      functionName: 'open',
      args: [tokenIds],
      value: entropyFee,
    })
  }

  // Combine all loading states
  const isOpening = loadingFee || isConfirming || isWaitingConfirm

  // Combine all error states - return Error object, not message string
  const error = writeError || confirmError || null

  return {
    open,
    isOpening,
    isSuccess,
    error,
    hash,
  }
}

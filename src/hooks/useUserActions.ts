/**
 * @title useUserActions - User Interaction Hooks
 * @notice Write hooks for user actions (buy tickets, claim prizes)
 * @dev Uses wagmi's useWriteContract for transactions
 * @dev KISS principle: Simple hooks, clear error states, professional UX
 */

import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi'
import { useSendCalls, useCallsStatus } from 'wagmi/experimental'
import { geoChallenge_implementation_ABI } from '@/abi'
import { CONTRACT_ADDRESSES } from '@/lib/contractList'
import { sdk } from '@farcaster/miniapp-sdk'
import type { BatchCall } from '@/lib/farcaster'
import { useState, useEffect } from 'react'

/**
 * Ensure SDK is ready before transaction
 * Prevents issues in Farcaster miniApp context
 */
async function ensureSDKReady(): Promise<void> {
  try {
    await sdk.actions.ready()
  } catch {
    // Not in Farcaster context, continue normally
  }
}

/**
 * Buy ticket for a competition
 * @notice Most important user action - keep it SIMPLE
 */
export function useBuyTicket() {
  const { address } = useAccount()
  const { writeContract, data: hash, isPending, error: writeError, reset } = useWriteContract()
  const {
    isLoading: isConfirming,
    isSuccess,
    error: receiptError
  } = useWaitForTransactionReceipt({
    hash,
    query: {
      enabled: !!hash,
    }
  })

  // Timeout state management
  const [timeoutError, setTimeoutError] = useState<string | null>(null)

  // Timeout detection (60s)
  // NOTE: This shows UI error only - does NOT cancel the blockchain transaction
  // The transaction may still succeed after timeout
  useEffect(() => {
    if (!isPending && !isConfirming) return

    const timer = setTimeout(() => {
      setTimeoutError('Transaction timeout. Please try again.')
    }, 60000)

    return () => clearTimeout(timer)
  }, [isPending, isConfirming])

  // Reset timeout on success/error
  useEffect(() => {
    if (isSuccess || writeError || receiptError) {
      setTimeoutError(null)
    }
  }, [isSuccess, writeError, receiptError])

  const buyTicket = async (competitionId: bigint, ticketPrice: bigint) => {
    if (!address) {
      throw new Error('Please connect your wallet')
    }

    setTimeoutError(null) // Reset on new attempt

    // Ensure SDK is ready in Farcaster context
    await ensureSDKReady()

    return writeContract({
      address: CONTRACT_ADDRESSES.GeoChallenge,
      abi: geoChallenge_implementation_ABI,
      functionName: 'buyTicket',
      args: [competitionId],
      value: ticketPrice, // Send ETH with transaction
    })
  }

  return {
    buyTicket,
    isPending,
    isConfirming,
    isSuccess,
    error: writeError || receiptError || (timeoutError ? new Error(timeoutError) : null),
    retry: reset, // Use wagmi's built-in reset
    hash,
  }
}

/**
 * Claim winner prize
 * @notice Winner must be declared and competition finalized
 */
export function useClaimPrize() {
  const { address } = useAccount()
  const { writeContract, data: hash, isPending, error: writeError, reset } = useWriteContract()
  const {
    isLoading: isConfirming,
    isSuccess,
    error: receiptError
  } = useWaitForTransactionReceipt({
    hash,
    query: {
      enabled: !!hash,
    }
  })

  // Timeout state management
  const [timeoutError, setTimeoutError] = useState<string | null>(null)

  // Timeout detection (60s)
  // NOTE: This shows UI error only - does NOT cancel the blockchain transaction
  // The transaction may still succeed after timeout
  useEffect(() => {
    if (!isPending && !isConfirming) return

    const timer = setTimeout(() => {
      setTimeoutError('Transaction timeout. Please try again.')
    }, 60000)

    return () => clearTimeout(timer)
  }, [isPending, isConfirming])

  // Reset timeout on success/error
  useEffect(() => {
    if (isSuccess || writeError || receiptError) {
      setTimeoutError(null)
    }
  }, [isSuccess, writeError, receiptError])

  const claimPrize = async (competitionId: bigint) => {
    if (!address) {
      throw new Error('Please connect your wallet')
    }

    setTimeoutError(null) // Reset on new attempt

    // Ensure SDK is ready in Farcaster context
    await ensureSDKReady()

    return writeContract({
      address: CONTRACT_ADDRESSES.GeoChallenge,
      abi: geoChallenge_implementation_ABI,
      functionName: 'claimPrize',
      args: [competitionId],
    })
  }

  return {
    claimPrize,
    isPending,
    isConfirming,
    isSuccess,
    error: writeError || receiptError || (timeoutError ? new Error(timeoutError) : null),
    retry: reset, // Use wagmi's built-in reset
    hash,
  }
}

/**
 * Claim participant prize
 * @notice When no winner declared, prize pool split among participants
 */
export function useClaimParticipantPrize() {
  const { address } = useAccount()
  const { writeContract, data: hash, isPending, error: writeError, reset } = useWriteContract()
  const {
    isLoading: isConfirming,
    isSuccess,
    error: receiptError
  } = useWaitForTransactionReceipt({
    hash,
    query: {
      enabled: !!hash,
    }
  })

  // Timeout state management
  const [timeoutError, setTimeoutError] = useState<string | null>(null)

  // Timeout detection (60s)
  // NOTE: This shows UI error only - does NOT cancel the blockchain transaction
  // The transaction may still succeed after timeout
  useEffect(() => {
    if (!isPending && !isConfirming) return

    const timer = setTimeout(() => {
      setTimeoutError('Transaction timeout. Please try again.')
    }, 60000)

    return () => clearTimeout(timer)
  }, [isPending, isConfirming])

  // Reset timeout on success/error
  useEffect(() => {
    if (isSuccess || writeError || receiptError) {
      setTimeoutError(null)
    }
  }, [isSuccess, writeError, receiptError])

  const claimParticipantPrize = async (competitionId: bigint) => {
    if (!address) {
      throw new Error('Please connect your wallet')
    }

    setTimeoutError(null) // Reset on new attempt

    // Ensure SDK is ready in Farcaster context
    await ensureSDKReady()

    return writeContract({
      address: CONTRACT_ADDRESSES.GeoChallenge,
      abi: geoChallenge_implementation_ABI,
      functionName: 'claimParticipantPrize',
      args: [competitionId],
    })
  }

  return {
    claimParticipantPrize,
    isPending,
    isConfirming,
    isSuccess,
    error: writeError || receiptError || (timeoutError ? new Error(timeoutError) : null),
    retry: reset, // Use wagmi's built-in reset
    hash,
  }
}

/**
 * Claim refund
 * @notice Only when competition is cancelled
 */
export function useClaimRefund() {
  const { address } = useAccount()
  const { writeContract, data: hash, isPending, error: writeError, reset } = useWriteContract()
  const {
    isLoading: isConfirming,
    isSuccess,
    error: receiptError
  } = useWaitForTransactionReceipt({
    hash,
    query: {
      enabled: !!hash,
    }
  })

  // Timeout state management
  const [timeoutError, setTimeoutError] = useState<string | null>(null)

  // Timeout detection (60s)
  // NOTE: This shows UI error only - does NOT cancel the blockchain transaction
  // The transaction may still succeed after timeout
  useEffect(() => {
    if (!isPending && !isConfirming) return

    const timer = setTimeout(() => {
      setTimeoutError('Transaction timeout. Please try again.')
    }, 60000)

    return () => clearTimeout(timer)
  }, [isPending, isConfirming])

  // Reset timeout on success/error
  useEffect(() => {
    if (isSuccess || writeError || receiptError) {
      setTimeoutError(null)
    }
  }, [isSuccess, writeError, receiptError])

  const claimRefund = async (competitionId: bigint) => {
    if (!address) {
      throw new Error('Please connect your wallet')
    }

    setTimeoutError(null) // Reset on new attempt

    // Ensure SDK is ready in Farcaster context
    await ensureSDKReady()

    return writeContract({
      address: CONTRACT_ADDRESSES.GeoChallenge,
      abi: geoChallenge_implementation_ABI,
      functionName: 'claimRefund',
      args: [competitionId],
    })
  }

  return {
    claimRefund,
    isPending,
    isConfirming,
    isSuccess,
    error: writeError || receiptError || (timeoutError ? new Error(timeoutError) : null),
    retry: reset, // Use wagmi's built-in reset
    hash,
  }
}

/**
 * Withdraw accumulated balance
 * @notice Withdraws user's total claimable balance to their wallet
 */
export function useWithdrawBalance() {
  const { address } = useAccount()
  const { writeContract, data: hash, isPending, error: writeError, reset } = useWriteContract()
  const {
    isLoading: isConfirming,
    isSuccess,
    error: receiptError
  } = useWaitForTransactionReceipt({
    hash,
    query: {
      enabled: !!hash,
    }
  })

  // Timeout state management
  const [timeoutError, setTimeoutError] = useState<string | null>(null)

  // Timeout detection (60s)
  // NOTE: This shows UI error only - does NOT cancel the blockchain transaction
  // The transaction may still succeed after timeout
  useEffect(() => {
    if (!isPending && !isConfirming) return

    const timer = setTimeout(() => {
      setTimeoutError('Transaction timeout. Please try again.')
    }, 60000)

    return () => clearTimeout(timer)
  }, [isPending, isConfirming])

  // Reset timeout on success/error
  useEffect(() => {
    if (isSuccess || writeError || receiptError) {
      setTimeoutError(null)
    }
  }, [isSuccess, writeError, receiptError])

  const withdrawBalance = async () => {
    if (!address) {
      throw new Error('Please connect your wallet')
    }

    setTimeoutError(null) // Reset on new attempt

    // Ensure SDK is ready in Farcaster context
    await ensureSDKReady()

    return writeContract({
      address: CONTRACT_ADDRESSES.GeoChallenge,
      abi: geoChallenge_implementation_ABI,
      functionName: 'withdrawBalance',
      args: [],
    })
  }

  return {
    withdrawBalance,
    isPending,
    isConfirming,
    isSuccess,
    error: writeError || receiptError || (timeoutError ? new Error(timeoutError) : null),
    retry: reset, // Use wagmi's built-in reset
    hash,
  }
}

/**
 * Batch multiple transactions into one confirmation (EIP-5792)
 * @notice Only works in Farcaster wallet (supporting wallet_sendCalls)
 * @dev Perfect for "approve + buy" or other multi-step operations
 *
 * @example
 * ```tsx
 * const { sendBatchCalls } = useBatchTransactions();
 *
 * // Approve token + Buy ticket in ONE confirmation
 * await sendBatchCalls([
 *   { to: tokenContract, data: approveData },
 *   { to: competitionContract, data: buyTicketData, value: ticketPrice }
 * ]);
 * ```
 */
export function useBatchTransactions() {
  const { address } = useAccount()
  const { sendCalls, data: callData, isPending, error: sendError } = useSendCalls()

  // Extract the actual ID from the call data
  const callId = callData?.id as `0x${string}` | undefined

  const {
    status,
    data: callsData,
    error: statusError
  } = useCallsStatus({
    id: callId!,
    query: {
      enabled: !!callId,
    }
  })

  const sendBatchCalls = async (calls: BatchCall[]) => {
    if (!address) {
      throw new Error('Please connect your wallet')
    }

    // Ensure SDK is ready in Farcaster context
    await ensureSDKReady()

    return sendCalls({ calls })
  }

  return {
    sendBatchCalls,
    isPending,
    isConfirming: status === 'pending',
    isSuccess: status === 'success',
    error: sendError || statusError,
    id: callId,
    callsData,
  }
}

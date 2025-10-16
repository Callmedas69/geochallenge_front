/**
 * @title useUserActions - User Interaction Hooks
 * @notice Write hooks for user actions (buy tickets, claim prizes)
 * @dev Uses wagmi's useWriteContract for transactions
 * @dev KISS principle: Simple hooks, clear error states, professional UX
 */

import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi'
import { useSendCalls, useCallsStatus } from 'wagmi/experimental'
import { geoChallenge_implementation_ABI } from '@/abi'
import { useContractAddresses } from '@/hooks/useNetworkConfig'
import { sdk } from '@farcaster/miniapp-sdk'
import type { BatchCall } from '@/lib/farcaster'

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
  const addresses = useContractAddresses()
  const { writeContract, data: hash, isPending, error: writeError } = useWriteContract()
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

  const buyTicket = async (competitionId: bigint, ticketPrice: bigint) => {
    if (!address) {
      throw new Error('Please connect your wallet')
    }

    // Ensure SDK is ready in Farcaster context
    await ensureSDKReady()

    return writeContract({
      address: addresses.GeoChallenge,
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
    error: writeError || receiptError,
    hash,
  }
}

/**
 * Claim winner prize
 * @notice Winner must be declared and competition finalized
 */
export function useClaimPrize() {
  const { address } = useAccount()
  const addresses = useContractAddresses()
  const { writeContract, data: hash, isPending, error: writeError } = useWriteContract()
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

  const claimPrize = async (competitionId: bigint) => {
    if (!address) {
      throw new Error('Please connect your wallet')
    }

    // Ensure SDK is ready in Farcaster context
    await ensureSDKReady()

    return writeContract({
      address: addresses.GeoChallenge,
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
    error: writeError || receiptError,
    hash,
  }
}

/**
 * Claim participant prize
 * @notice When no winner declared, prize pool split among participants
 */
export function useClaimParticipantPrize() {
  const { address } = useAccount()
  const addresses = useContractAddresses()
  const { writeContract, data: hash, isPending, error: writeError } = useWriteContract()
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

  const claimParticipantPrize = async (competitionId: bigint) => {
    if (!address) {
      throw new Error('Please connect your wallet')
    }

    // Ensure SDK is ready in Farcaster context
    await ensureSDKReady()

    return writeContract({
      address: addresses.GeoChallenge,
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
    error: writeError || receiptError,
    hash,
  }
}

/**
 * Claim refund
 * @notice Only when competition is cancelled
 */
export function useClaimRefund() {
  const { address } = useAccount()
  const addresses = useContractAddresses()
  const { writeContract, data: hash, isPending, error: writeError } = useWriteContract()
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

  const claimRefund = async (competitionId: bigint) => {
    if (!address) {
      throw new Error('Please connect your wallet')
    }

    // Ensure SDK is ready in Farcaster context
    await ensureSDKReady()

    return writeContract({
      address: addresses.GeoChallenge,
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
    error: writeError || receiptError,
    hash,
  }
}

/**
 * Withdraw accumulated balance
 * @notice Withdraws user's total claimable balance to their wallet
 */
export function useWithdrawBalance() {
  const { address } = useAccount()
  const addresses = useContractAddresses()
  const { writeContract, data: hash, isPending, error: writeError } = useWriteContract()
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

  const withdrawBalance = async () => {
    if (!address) {
      throw new Error('Please connect your wallet')
    }

    // Ensure SDK is ready in Farcaster context
    await ensureSDKReady()

    return writeContract({
      address: addresses.GeoChallenge,
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
    error: writeError || receiptError,
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

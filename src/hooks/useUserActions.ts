/**
 * @title useUserActions - User Interaction Hooks
 * @notice Write hooks for user actions (buy tickets, claim prizes)
 * @dev Uses wagmi's useWriteContract for transactions
 * @dev KISS principle: Simple hooks, clear error states, professional UX
 */

import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi'
import { geoChallenge_implementation_ABI } from '@/abi'
import { CONTRACT_ADDRESSES } from '@/lib/contractList'

/**
 * Buy ticket for a competition
 * @notice Most important user action - keep it SIMPLE
 */
export function useBuyTicket() {
  const { address } = useAccount()
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash
  })

  const buyTicket = async (competitionId: bigint, ticketPrice: bigint) => {
    if (!address) {
      throw new Error('Please connect your wallet')
    }

    return writeContract({
      address: CONTRACT_ADDRESSES.baseSepolia.GeoChallenge,
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
    error,
    hash,
  }
}

/**
 * Claim winner prize
 * @notice Winner must be declared and competition finalized
 */
export function useClaimPrize() {
  const { address } = useAccount()
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash
  })

  const claimPrize = async (competitionId: bigint) => {
    if (!address) {
      throw new Error('Please connect your wallet')
    }

    return writeContract({
      address: CONTRACT_ADDRESSES.baseSepolia.GeoChallenge,
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
    error,
    hash,
  }
}

/**
 * Claim participant prize
 * @notice When no winner declared, prize pool split among participants
 */
export function useClaimParticipantPrize() {
  const { address } = useAccount()
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash
  })

  const claimParticipantPrize = async (competitionId: bigint) => {
    if (!address) {
      throw new Error('Please connect your wallet')
    }

    return writeContract({
      address: CONTRACT_ADDRESSES.baseSepolia.GeoChallenge,
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
    error,
    hash,
  }
}

/**
 * Claim refund
 * @notice Only when competition is cancelled
 */
export function useClaimRefund() {
  const { address } = useAccount()
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash
  })

  const claimRefund = async (competitionId: bigint) => {
    if (!address) {
      throw new Error('Please connect your wallet')
    }

    return writeContract({
      address: CONTRACT_ADDRESSES.baseSepolia.GeoChallenge,
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
    error,
    hash,
  }
}

/**
 * Withdraw accumulated balance
 * @notice Withdraws user's total claimable balance to their wallet
 */
export function useWithdrawBalance() {
  const { address } = useAccount()
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash
  })

  const withdrawBalance = async () => {
    if (!address) {
      throw new Error('Please connect your wallet')
    }

    return writeContract({
      address: CONTRACT_ADDRESSES.baseSepolia.GeoChallenge,
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
    error,
    hash,
  }
}

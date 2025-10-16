/**
 * @title usePublicCompetitions - Public Read Hooks
 * @notice Query hooks for public-facing competition data
 * @dev Uses smart caching (staleTime/gcTime) following KISS principle
 * @dev No wallet connection required - pure read functions
 */

import { useReadContract } from 'wagmi'
import { geoChallenge_implementation_ABI, queryManager_ABI } from '@/abi'
import { CONTRACT_ADDRESSES } from '@/lib/contractList'

/**
 * Get a specific competition by ID
 * @param competitionId - Competition ID to fetch (undefined to skip query)
 * @returns Competition data
 */
export function useCompetitionById(competitionId: bigint | undefined) {
  return useReadContract({
    address: CONTRACT_ADDRESSES.GeoChallenge,
    abi: geoChallenge_implementation_ABI,
    functionName: 'getCompetition',
    args: competitionId !== undefined ? [competitionId] : undefined,
    query: {
      enabled: competitionId !== undefined,
      staleTime: 30000, // Fresh for 30s
      gcTime: 300000, // Cache for 5min
    },
  })
}

/**
 * Get total number of competitions
 * @returns Current competition count
 */
export function useCompetitionCount() {
  return useReadContract({
    address: CONTRACT_ADDRESSES.GeoChallenge,
    abi: geoChallenge_implementation_ABI,
    functionName: 'getCurrentCompetitionId',
    query: {
      staleTime: 30000,
      gcTime: 300000,
    },
  })
}

/**
 * Get all active competition IDs
 * @returns Array of active competition IDs
 */
export function useActiveCompetitions() {
  return useReadContract({
    address: CONTRACT_ADDRESSES.QueryManager,
    abi: queryManager_ABI,
    functionName: 'getActiveCompetitions',
    query: {
      staleTime: 30000,
      gcTime: 300000,
    },
  })
}

/**
 * Get total value locked (TVL) across all competitions
 * @returns Total ETH locked in platform
 */
export function useTotalValueLocked() {
  return useReadContract({
    address: CONTRACT_ADDRESSES.QueryManager,
    abi: queryManager_ABI,
    functionName: 'getTotalValueLocked',
    query: {
      staleTime: 30000,
      gcTime: 300000,
    },
  })
}

/**
 * Check if user owns a ticket for a specific competition
 * @param userAddress - User wallet address
 * @param competitionId - Competition ID
 * @returns Ticket balance (0 = no ticket, >0 = has ticket(s))
 */
export function useUserTicketBalance(
  userAddress: `0x${string}` | undefined,
  competitionId: bigint | undefined
) {
  return useReadContract({
    address: CONTRACT_ADDRESSES.GeoChallenge,
    abi: geoChallenge_implementation_ABI,
    functionName: 'balanceOf',
    args:
      userAddress && competitionId !== undefined
        ? [userAddress, competitionId]
        : undefined,
    query: {
      enabled: !!userAddress && competitionId !== undefined,
      staleTime: 10000, // Shorter cache for user-specific data
      gcTime: 60000,
    },
  })
}

/**
 * Get platform-wide competition statistics
 * @returns Platform stats (notStarted, active, ended, finalized, emergencyPaused counts)
 */
export function useCompetitionStats() {
  return useReadContract({
    address: CONTRACT_ADDRESSES.QueryManager,
    abi: queryManager_ABI,
    functionName: 'getCompetitionStats',
    query: {
      staleTime: 30000,
      gcTime: 300000,
    },
  })
}

/**
 * Get all expired competition IDs
 * @returns Array of expired competition IDs needing action
 */
export function useExpiredCompetitions() {
  return useReadContract({
    address: CONTRACT_ADDRESSES.QueryManager,
    abi: queryManager_ABI,
    functionName: 'getExpiredCompetitions',
    query: {
      staleTime: 60000, // 1 minute - changes less frequently
      gcTime: 300000,
    },
  })
}

/**
 * Check health status of a competition
 * @param competitionId - Competition ID
 * @returns Health metrics (exists, active, hasParticipants, isPaused, isExpired, timeRemaining)
 */
export function useCompetitionHealth(competitionId: bigint | undefined) {
  return useReadContract({
    address: CONTRACT_ADDRESSES.QueryManager,
    abi: queryManager_ABI,
    functionName: 'checkCompetitionHealth',
    args: competitionId !== undefined ? [competitionId] : undefined,
    query: {
      enabled: competitionId !== undefined,
      staleTime: 30000,
      gcTime: 300000,
    },
  })
}

/**
 * Get platform-wide contract health
 * @returns Contract health metrics
 */
export function useContractHealth() {
  return useReadContract({
    address: CONTRACT_ADDRESSES.QueryManager,
    abi: queryManager_ABI,
    functionName: 'getContractHealth',
    query: {
      staleTime: 60000,
      gcTime: 300000,
    },
  })
}

/**
 * Get user's claimable balance
 * @param userAddress - User wallet address
 * @returns User's total claimable balance
 */
export function useClaimableBalance(userAddress: `0x${string}` | undefined) {
  return useReadContract({
    address: CONTRACT_ADDRESSES.GeoChallenge,
    abi: geoChallenge_implementation_ABI,
    functionName: 'getClaimableBalance',
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!userAddress,
      staleTime: 10000, // 10s for user-specific data
      gcTime: 60000,
    },
  })
}

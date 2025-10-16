/**
 * @title User Dashboard Hooks
 * @notice React hooks for user dashboard data (Phase 3)
 * @dev Uses QueryManager and UserTracking contracts for efficient querying
 */

import { useReadContract } from 'wagmi'
import type { Address } from 'viem'
import { useContractAddresses } from '@/hooks/useNetworkConfig'
import { queryManager_ABI } from '@/abi/queryManager_ABI'
import { userTracking_ABI } from '@/abi/userTracking_ABI'
import { geoChallenge_implementation_ABI } from '@/abi/geoChallenge_implementation_ABI'
import type {
  ContractUserStats,
  UserDashboardDataResult,
  UserCompetitionsResult,
  UserActiveCompetitionsResult,
  UserCompletedCompetitionsResult,
} from '@/lib/types'

// ============================================================================
// QueryManager Hooks (User Dashboard Queries)
// ============================================================================

/**
 * Get complete dashboard data in a single RPC call (60x faster!)
 * @dev This is the RECOMMENDED way to load dashboard data
 * Returns: { stats, activeCompIds, claimableCompIds, totalCompetitions }
 */
export function useUserDashboardData(userAddress: Address | undefined) {
  const addresses = useContractAddresses()
  const result = useReadContract({
    address: addresses.QueryManager,
    abi: queryManager_ABI,
    functionName: 'getUserDashboardData',
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!userAddress,
      staleTime: 30_000, // 30 seconds
      refetchInterval: 60_000, // Refresh every minute
    },
  })

  // CRITICAL FIX: Viem returns array [stats, activeIds, claimableIds, total]
  // But frontend expects object { stats, activeCompIds, claimableCompIds, totalCompetitions }
  // Transform the array into the expected object structure
  const transformedData = result.data ? {
    stats: (result.data as any)[0] as ContractUserStats,
    activeCompIds: (result.data as any)[1] as readonly bigint[],
    claimableCompIds: (result.data as any)[2] as readonly bigint[],
    totalCompetitions: (result.data as any)[3] as bigint,
  } : undefined

  return {
    ...result,
    data: transformedData,
  } as ReturnType<typeof useReadContract> & {
    data?: UserDashboardDataResult
  }
}

/**
 * Get all competitions user has participated in
 * Returns: { competitionIds, competitions }
 */
export function useUserCompetitions(userAddress: Address | undefined) {
  const addresses = useContractAddresses()
  const result = useReadContract({
    address: addresses.QueryManager,
    abi: queryManager_ABI,
    functionName: 'getUserCompetitions',
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!userAddress,
      staleTime: 30_000,
    },
  })

  // Transform array [competitionIds, competitions] to object
  const transformedData = result.data ? {
    competitionIds: (result.data as any)[0] as readonly bigint[],
    competitions: (result.data as any)[1] as readonly any[],
  } : undefined

  return {
    ...result,
    data: transformedData,
  } as ReturnType<typeof useReadContract> & {
    data?: UserCompetitionsResult
  }
}

/**
 * Get user's active competitions only
 * Returns: { activeIds, activeComps }
 */
export function useUserActiveCompetitions(userAddress: Address | undefined) {
  const addresses = useContractAddresses()
  const result = useReadContract({
    address: addresses.QueryManager,
    abi: queryManager_ABI,
    functionName: 'getUserActiveCompetitions',
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!userAddress,
      staleTime: 20_000,
      refetchInterval: 30_000, // Refresh more frequently for active comps
    },
  })

  // Transform array [activeIds, activeComps] to object
  const transformedData = result.data ? {
    activeIds: (result.data as any)[0] as readonly bigint[],
    activeComps: (result.data as any)[1] as readonly any[],
  } : undefined

  return {
    ...result,
    data: transformedData,
  } as ReturnType<typeof useReadContract> & {
    data?: UserActiveCompetitionsResult
  }
}

/**
 * Get user's completed competitions only
 * Returns: { completedIds, completedComps }
 */
export function useUserCompletedCompetitions(userAddress: Address | undefined) {
  const addresses = useContractAddresses()
  const result = useReadContract({
    address: addresses.QueryManager,
    abi: queryManager_ABI,
    functionName: 'getUserCompletedCompetitions',
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!userAddress,
      staleTime: 60_000, // Completed comps don't change often
    },
  })

  // Transform array [completedIds, completedComps] to object
  const transformedData = result.data ? {
    completedIds: (result.data as any)[0] as readonly bigint[],
    completedComps: (result.data as any)[1] as readonly any[],
  } : undefined

  return {
    ...result,
    data: transformedData,
  } as ReturnType<typeof useReadContract> & {
    data?: UserCompletedCompetitionsResult
  }
}

// ============================================================================
// UserTracking Hooks
// ============================================================================

/**
 * Get user statistics from UserTracking contract
 * Returns: { totalCompetitionsJoined, totalPrizesWon, competitionsWon }
 */
export function useUserStats(userAddress: Address | undefined) {
  const addresses = useContractAddresses()
  return useReadContract({
    address: addresses.UserTracking,
    abi: userTracking_ABI,
    functionName: 'getUserStats',
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!userAddress,
      staleTime: 30_000,
    },
  }) as ReturnType<typeof useReadContract> & {
    data?: ContractUserStats
  }
}

/**
 * Get array of competition IDs user has participated in
 * Returns: uint256[]
 */
export function useUserCompetitionIds(userAddress: Address | undefined) {
  const addresses = useContractAddresses()
  return useReadContract({
    address: addresses.UserTracking,
    abi: userTracking_ABI,
    functionName: 'getUserCompetitionIds',
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!userAddress,
      staleTime: 30_000,
    },
  }) as ReturnType<typeof useReadContract> & {
    data?: readonly bigint[]
  }
}

// ============================================================================
// GeoChallenge Hooks (Prize Claim Status)
// ============================================================================

/**
 * Check if user has claimed participant prize for a competition
 * Returns: boolean
 */
export function useHasClaimedParticipantPrize(
  competitionId: bigint | undefined,
  userAddress: Address | undefined
) {
  const addresses = useContractAddresses()
  return useReadContract({
    address: addresses.GeoChallenge,
    abi: geoChallenge_implementation_ABI,
    functionName: 'participantPrizeClaimed',
    args: competitionId && userAddress ? [competitionId, userAddress] : undefined,
    query: {
      enabled: !!competitionId && !!userAddress,
      staleTime: 10_000,
    },
  })
}

/**
 * Check if winner prize has been claimed for a competition
 * Returns: boolean
 */
export function useHasClaimedWinnerPrize(competitionId: bigint | undefined) {
  const addresses = useContractAddresses()
  return useReadContract({
    address: addresses.GeoChallenge,
    abi: geoChallenge_implementation_ABI,
    functionName: 'winnerPrizeClaimed',
    args: competitionId ? [competitionId] : undefined,
    query: {
      enabled: !!competitionId,
      staleTime: 10_000,
    },
  })
}

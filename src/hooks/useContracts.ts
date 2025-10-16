/**
 * @title useContracts - Legacy Hook Compatibility
 * @notice Provides contract read hooks for backwards compatibility
 * @dev Phase 3 will expand this with all query hooks
 */

import { useReadContract, useReadContracts } from 'wagmi'
import { geoChallenge_implementation_ABI } from '@/abi'
import { CONTRACT_ADDRESSES } from '@/lib/contractList'
import type { Address } from 'viem'

/**
 * Get the contract owner address
 */
export function useCardCompetitionOwner() {
  return useReadContract({
    address: CONTRACT_ADDRESSES.GeoChallenge,
    abi: geoChallenge_implementation_ABI,
    functionName: 'owner',
  })
}

/**
 * Get the claimable balance for an address
 */
export function useClaimableBalance(userAddress?: Address) {
  return useReadContract({
    address: CONTRACT_ADDRESSES.GeoChallenge,
    abi: geoChallenge_implementation_ABI,
    functionName: 'getClaimableBalance',
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!userAddress,
    },
  })
}

/**
 * Get all module addresses (for Advanced Settings)
 */
export function useModuleAddresses() {
  const contractConfig = {
    address: CONTRACT_ADDRESSES.GeoChallenge,
    abi: geoChallenge_implementation_ABI,
  }

  return useReadContracts({
    contracts: [
      { ...contractConfig, functionName: 'adminValidationManager' },
      { ...contractConfig, functionName: 'boosterBoxManager' },
      { ...contractConfig, functionName: 'competitionLifecycleManager' },
      { ...contractConfig, functionName: 'competitionManager' },
      { ...contractConfig, functionName: 'metadataManager' },
      { ...contractConfig, functionName: 'prizeCalculationManager' },
      { ...contractConfig, functionName: 'prizeManager' },
      { ...contractConfig, functionName: 'proofValidator' },
      { ...contractConfig, functionName: 'queryManager' },
      { ...contractConfig, functionName: 'ticketRenderer' },
    ],
  })
}

/**
 * @title Admin Action Hooks
 * @notice All admin-only competition management hooks
 * @dev KISS principle - one hook per admin action
 */

import { useWriteContract, useWaitForTransactionReceipt, useChainId } from 'wagmi'
import { useQueryClient } from '@tanstack/react-query'
import type { Address } from 'viem'
import { geoChallenge_implementation_ABI } from '@/abi'
import { CONTRACT_ADDRESSES } from '@/lib/contractList'
import { parseAndLogError } from '@/lib/errors'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { getBlockExplorerTxUrl, getBlockExplorerName } from '@/lib/blockExplorer'

// ============================================================================
// Base Hook Factory
// ============================================================================

function useAdminAction(functionName: string, successMessage?: string) {
  const queryClient = useQueryClient()
  const chainId = useChainId()

  const {
    data: hash,
    writeContract,
    isPending,
    error: writeError,
  } = useWriteContract()

  const {
    isLoading: isConfirming,
    isSuccess,
    error: confirmError,
  } = useWaitForTransactionReceipt({ hash })

  // Auto-refresh competition data after successful transaction
  useEffect(() => {
    if (isSuccess && hash) {
      // Invalidate all competition-related queries to trigger refetch
      queryClient.invalidateQueries({ queryKey: ['readContract'] })

      // Show success toast with clickable tx link
      const explorerUrl = getBlockExplorerTxUrl(chainId, hash)
      const explorerName = getBlockExplorerName(chainId)

      toast.success(successMessage || `${functionName} successful!`, {
        description: `Transaction: ${hash.slice(0, 10)}...${hash.slice(-8)}`,
        duration: 5000,
        action: {
          label: `View on ${explorerName}`,
          onClick: () => window.open(explorerUrl, '_blank'),
        },
      })
    }
  }, [isSuccess, hash, queryClient, functionName, successMessage, chainId])

  // Show error toast
  useEffect(() => {
    if (writeError) {
      const errorMsg = parseAndLogError(writeError, functionName)
      toast.error('Transaction Failed', {
        description: errorMsg,
        duration: 7000,
      })
    } else if (confirmError) {
      const errorMsg = parseAndLogError(confirmError, 'Transaction Confirmation')
      toast.error('Transaction Confirmation Failed', {
        description: errorMsg,
        duration: 7000,
      })
    }
  }, [writeError, confirmError, functionName])

  return {
    writeContract,
    isPending,
    isConfirming,
    isSuccess,
    hash,
    error: writeError || confirmError,
    errorMessage: writeError
      ? parseAndLogError(writeError, functionName)
      : confirmError
        ? parseAndLogError(confirmError, 'Transaction Confirmation')
        : undefined,
  }
}

// ============================================================================
// Competition Lifecycle Hooks
// ============================================================================

/**
 * Start a competition (move from NOT_STARTED to ACTIVE)
 */
export function useStartCompetition() {
  const hook = useAdminAction('Start Competition', 'Competition started successfully')

  const startCompetition = (competitionId: bigint) => {
    hook.writeContract({
      address: CONTRACT_ADDRESSES.baseSepolia.GeoChallenge,
      abi: geoChallenge_implementation_ABI,
      functionName: 'startCompetition',
      args: [competitionId],
    })
  }

  return { startCompetition, ...hook }
}

/**
 * End a competition manually (before deadline if needed)
 */
export function useEndCompetition() {
  const hook = useAdminAction('End Competition', 'Competition ended successfully')

  const endCompetition = (competitionId: bigint) => {
    hook.writeContract({
      address: CONTRACT_ADDRESSES.baseSepolia.GeoChallenge,
      abi: geoChallenge_implementation_ABI,
      functionName: 'endCompetition',
      args: [competitionId],
    })
  }

  return { endCompetition, ...hook }
}

/**
 * Finalize a competition (after winner declared or deadline passed)
 */
export function useFinalizeCompetition() {
  const hook = useAdminAction('Finalize Competition', 'Competition finalized and prizes distributed')

  const finalizeCompetition = (competitionId: bigint) => {
    hook.writeContract({
      address: CONTRACT_ADDRESSES.baseSepolia.GeoChallenge,
      abi: geoChallenge_implementation_ABI,
      functionName: 'finalizeCompetition',
      args: [competitionId],
    })
  }

  return { finalizeCompetition, ...hook }
}

/**
 * Cancel a competition (refunds all participants)
 */
export function useCancelCompetition() {
  const hook = useAdminAction('Cancel Competition', 'Competition cancelled and participants refunded')

  const cancelCompetition = (competitionId: bigint) => {
    hook.writeContract({
      address: CONTRACT_ADDRESSES.baseSepolia.GeoChallenge,
      abi: geoChallenge_implementation_ABI,
      functionName: 'cancelCompetition',
      args: [competitionId],
    })
  }

  return { cancelCompetition, ...hook }
}

/**
 * Extend competition deadline
 */
export function useExtendDeadline() {
  const hook = useAdminAction('Extend Deadline', 'Deadline extended successfully')

  const extendDeadline = (competitionId: bigint, newDeadline: bigint) => {
    hook.writeContract({
      address: CONTRACT_ADDRESSES.baseSepolia.GeoChallenge,
      abi: geoChallenge_implementation_ABI,
      functionName: 'extendDeadline',
      args: [competitionId, newDeadline],
    })
  }

  return { extendDeadline, ...hook }
}

// ============================================================================
// Emergency Functions
// ============================================================================

/**
 * Emergency pause a specific competition
 */
export function useEmergencyPauseCompetition() {
  const hook = useAdminAction('Emergency Pause Competition', 'Competition paused successfully')

  const emergencyPause = (competitionId: bigint) => {
    hook.writeContract({
      address: CONTRACT_ADDRESSES.baseSepolia.GeoChallenge,
      abi: geoChallenge_implementation_ABI,
      functionName: 'emergencyPauseCompetition',
      args: [competitionId],
    })
  }

  return { emergencyPause, ...hook }
}

/**
 * Emergency unpause a specific competition
 */
export function useEmergencyUnpauseCompetition() {
  const hook = useAdminAction('Emergency Unpause Competition', 'Competition unpaused successfully')

  const emergencyUnpause = (competitionId: bigint) => {
    hook.writeContract({
      address: CONTRACT_ADDRESSES.baseSepolia.GeoChallenge,
      abi: geoChallenge_implementation_ABI,
      functionName: 'emergencyUnpauseCompetition',
      args: [competitionId],
    })
  }

  return { emergencyUnpause, ...hook }
}

/**
 * Global pause (all operations)
 */
export function useGlobalPause() {
  const hook = useAdminAction('Global Pause')

  const globalPause = () => {
    hook.writeContract({
      address: CONTRACT_ADDRESSES.baseSepolia.GeoChallenge,
      abi: geoChallenge_implementation_ABI,
      functionName: 'pause',
    })
  }

  return { globalPause, ...hook }
}

/**
 * Global unpause
 */
export function useGlobalUnpause() {
  const hook = useAdminAction('Global Unpause')

  const globalUnpause = () => {
    hook.writeContract({
      address: CONTRACT_ADDRESSES.baseSepolia.GeoChallenge,
      abi: geoChallenge_implementation_ABI,
      functionName: 'unpause',
    })
  }

  return { globalUnpause, ...hook }
}

// ============================================================================
// Prize & Booster Management
// ============================================================================

/**
 * Add additional prize ETH to competition
 */
export function useAddPrizeETH() {
  const hook = useAdminAction('Add Prize ETH', 'Prize added to pool successfully')

  const addPrize = (competitionId: bigint, amount: bigint) => {
    hook.writeContract({
      address: CONTRACT_ADDRESSES.baseSepolia.GeoChallenge,
      abi: geoChallenge_implementation_ABI,
      functionName: 'addPrizeETH',
      args: [competitionId],
      value: amount, // payable
    })
  }

  return { addPrize, ...hook }
}

/**
 * Add booster boxes to competition
 */
export function useAddBoosterBoxes() {
  const hook = useAdminAction('Add Booster Boxes', 'Booster boxes added successfully')

  const addBoosterBoxes = (competitionId: bigint, quantity: bigint) => {
    hook.writeContract({
      address: CONTRACT_ADDRESSES.baseSepolia.GeoChallenge,
      abi: geoChallenge_implementation_ABI,
      functionName: 'addBoosterBoxes',
      args: [competitionId, quantity],
    })
  }

  return { addBoosterBoxes, ...hook }
}

/**
 * Set booster box quantity
 */
export function useSetBoosterBoxQuantity() {
  const hook = useAdminAction('Set Booster Box Quantity', 'Booster box quantity updated successfully')

  const setBoosterBoxQuantity = (competitionId: bigint, quantity: bigint) => {
    hook.writeContract({
      address: CONTRACT_ADDRESSES.baseSepolia.GeoChallenge,
      abi: geoChallenge_implementation_ABI,
      functionName: 'setBoosterBoxQuantity',
      args: [competitionId, quantity],
    })
  }

  return { setBoosterBoxQuantity, ...hook }
}

// ============================================================================
// Configuration
// ============================================================================

/**
 * Update verifier address for competition
 */
export function useUpdateVerifier() {
  const hook = useAdminAction('Update Verifier', 'Verifier address updated successfully')

  const updateVerifier = (competitionId: bigint, newVerifier: Address) => {
    hook.writeContract({
      address: CONTRACT_ADDRESSES.baseSepolia.GeoChallenge,
      abi: geoChallenge_implementation_ABI,
      functionName: 'updateVerifier',
      args: [competitionId, newVerifier],
    })
  }

  return { updateVerifier, ...hook }
}

// ============================================================================
// Ownership
// ============================================================================

/**
 * Transfer ownership (DANGEROUS - use with caution)
 */
export function useTransferOwnership() {
  const hook = useAdminAction('Transfer Ownership')

  const transferOwnership = (newOwner: Address) => {
    hook.writeContract({
      address: CONTRACT_ADDRESSES.baseSepolia.GeoChallenge,
      abi: geoChallenge_implementation_ABI,
      functionName: 'transferOwnership',
      args: [newOwner],
    })
  }

  return { transferOwnership, ...hook }
}

/**
 * Withdraw owner's claimable balance
 */
export function useWithdrawBalance() {
  const hook = useAdminAction('Withdraw Balance', 'Balance withdrawn successfully')

  const withdrawBalance = () => {
    hook.writeContract({
      address: CONTRACT_ADDRESSES.baseSepolia.GeoChallenge,
      abi: geoChallenge_implementation_ABI,
      functionName: 'withdrawBalance',
    })
  }

  return { withdrawBalance, ...hook }
}

// ============================================================================
// Module Management (Advanced Settings)
// ============================================================================

/**
 * Generic module setter hook - KISS principle
 */
function useSetModule(moduleName: string, functionName: string): {
  setModule: (address: Address) => void;
  isPending: boolean;
  isConfirming: boolean;
  isSuccess: boolean;
} {
  const hook = useAdminAction(`Update ${moduleName}`, `${moduleName} updated successfully`)

  const setModule = (newAddress: Address) => {
    hook.writeContract({
      address: CONTRACT_ADDRESSES.baseSepolia.GeoChallenge,
      abi: geoChallenge_implementation_ABI,
      functionName: functionName as any,
      args: [newAddress],
    })
  }

  return {
    setModule,
    isPending: hook.isPending,
    isConfirming: hook.isConfirming,
    isSuccess: hook.isSuccess,
  }
}

export const useSetAdminValidationManager = () => useSetModule('Admin Validation Manager', 'setAdminValidationManager')
export const useSetBoosterBoxManager = () => useSetModule('Booster Box Manager', 'setBoosterBoxManager')
export const useSetCompetitionLifecycleManager = () => useSetModule('Competition Lifecycle Manager', 'setCompetitionLifecycleManager')
export const useSetCompetitionManager = () => useSetModule('Competition Manager', 'setCompetitionManager')
export const useSetMetadataManager = () => useSetModule('Metadata Manager', 'setMetadataManager')
export const useSetPrizeCalculationManager = () => useSetModule('Prize Calculation Manager', 'setPrizeCalculationManager')
export const useSetPrizeManagerModule = () => useSetModule('Prize Manager', 'setPrizeManager')
export const useSetProofValidator = () => useSetModule('Proof Validator', 'setProofValidator')
export const useSetQueryManager = () => useSetModule('Query Manager', 'setQueryManager')
export const useSetTicketRenderer = () => useSetModule('Ticket Renderer', 'setTicketRenderer')

// ============================================================================
// Contract Upgrade (UUPS Proxy)
// ============================================================================

/**
 * Upgrade contract implementation (EXTREMELY DANGEROUS)
 * UUPS proxy upgrade - only use if you know exactly what you're doing
 */
export function useUpgradeContract() {
  const hook = useAdminAction('Upgrade Contract Implementation', 'Contract upgraded successfully')

  const upgradeContract = (newImplementationAddress: Address) => {
    hook.writeContract({
      address: CONTRACT_ADDRESSES.baseSepolia.GeoChallenge,
      abi: geoChallenge_implementation_ABI,
      functionName: 'upgradeToAndCall',
      args: [newImplementationAddress, '0x' as `0x${string}`], // Empty data - no initialization call
    })
  }

  return { upgradeContract, ...hook }
}

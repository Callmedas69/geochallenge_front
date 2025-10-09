/**
 * @title useCreateCompetition Hook
 * @notice Hook for creating new competitions (Owner only)
 * @dev KISS principle - simple, type-safe competition creation
 */

import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseGwei, decodeEventLog } from 'viem'
import { geoChallenge_implementation_ABI } from '@/abi'
import { CONTRACT_ADDRESSES } from '@/lib/contractList'
import type { CreateCompetitionParams } from '@/lib/types'
import { parseAndLogError } from '@/lib/errors'
import { useMemo } from 'react'

export function useCreateCompetition() {
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
    data: receipt,
  } = useWaitForTransactionReceipt({
    hash,
  })

  // Extract competition ID from transaction receipt logs
  const competitionId = useMemo(() => {
    if (!receipt?.logs) return undefined

    for (const log of receipt.logs) {
      try {
        const decoded = decodeEventLog({
          abi: geoChallenge_implementation_ABI,
          data: log.data,
          topics: log.topics,
        })

        if (decoded.eventName === 'CompetitionCreated') {
          return decoded.args.competitionId as bigint
        }
      } catch {
        // Skip logs that don't match our ABI
        continue
      }
    }
    return undefined
  }, [receipt])

  const createCompetition = async (params: CreateCompetitionParams) => {
    try {
      // Convert CreateCompetitionParams to the exact tuple structure expected by the ABI
      const tuple = {
        name: params.name,
        description: params.description,
        collectionAddress: params.collectionAddress,
        rarityTiers: params.rarityTiers, // uint8[] in Solidity
        ticketPrice: params.ticketPrice,
        treasuryWallet: params.treasuryWallet,
        treasuryPercent: params.treasuryPercent,
        deadline: params.deadline,
        boosterBoxEnabled: params.boosterBoxEnabled,
        boosterBoxAddress: params.boosterBoxAddress,
        verifierAddress: params.verifierAddress,
      }

      writeContract({
        address: CONTRACT_ADDRESSES.baseSepolia.GeoChallenge,
        abi: geoChallenge_implementation_ABI,
        functionName: 'createCompetition',
        args: [tuple] as const,
        gas: BigInt(500000), // Estimated gas
      })
    } catch (err) {
      throw new Error(parseAndLogError(err, 'Create Competition'))
    }
  }

  return {
    createCompetition,
    isPending,
    isConfirming,
    isSuccess,
    hash,
    competitionId,
    error: writeError || confirmError,
    errorMessage: writeError
      ? parseAndLogError(writeError, 'Create Competition')
      : confirmError
        ? parseAndLogError(confirmError, 'Transaction Confirmation')
        : undefined,
  }
}

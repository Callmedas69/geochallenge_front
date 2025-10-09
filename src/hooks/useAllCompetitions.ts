/**
 * @title useAllCompetitions Hook
 * @notice Fetches all competitions with metadata for admin dashboard
 * @dev KISS principle - simple parallel fetching with caching
 */

import { useCompetitionCount } from './usePublicCompetitions'
import { useReadContracts } from 'wagmi'
import { geoChallenge_implementation_ABI } from '@/abi'
import { CONTRACT_ADDRESSES } from '@/lib/contractList'
import { useMemo } from 'react'

export interface CompetitionWithMetadata {
  id: bigint
  name: string
  description: string
  collectionAddress: `0x${string}`
  rarityTiers: readonly number[]
  ticketPrice: bigint
  treasuryWallet: `0x${string}`
  treasuryPercent: bigint
  deadline: bigint
  boosterBoxEnabled: boolean
  boosterBoxAddress: `0x${string}`
  verifierAddress: `0x${string}`
  state: number
  winner: `0x${string}`
  prizePool: bigint
  totalTickets: bigint
  winnerDeclared: boolean
  winnerDeclaredAt: bigint
  emergencyPaused: boolean
}

export function useAllCompetitions() {
  const { data: totalCount, isLoading: loadingCount } = useCompetitionCount()

  // Generate array of competition IDs to fetch
  const competitionIds = useMemo(() => {
    if (!totalCount || totalCount === BigInt(0)) return []
    // currentCompetitionId is next ID, so competitions are 1 to (count - 1)
    const count = Number(totalCount - BigInt(1))
    return Array.from({ length: count }, (_, i) => BigInt(i + 1))
  }, [totalCount])

  // Fetch all competitions + metadata in parallel
  const { data: rawData, isLoading: loadingData } = useReadContracts({
    contracts: competitionIds.flatMap((id) => [
      {
        address: CONTRACT_ADDRESSES.baseSepolia.GeoChallenge,
        abi: geoChallenge_implementation_ABI,
        functionName: 'getCompetition',
        args: [id],
      },
      {
        address: CONTRACT_ADDRESSES.baseSepolia.GeoChallenge,
        abi: geoChallenge_implementation_ABI,
        functionName: 'getCompetitionMetadata',
        args: [id],
      },
    ]),
    query: {
      enabled: competitionIds.length > 0,
      staleTime: 30000, // 30s
      gcTime: 300000, // 5min
    },
  }) as { data: any; isLoading: boolean }

  // Parse and combine data
  const competitions = useMemo(() => {
    if (!rawData) return []

    const result: CompetitionWithMetadata[] = []

    for (let i = 0; i < competitionIds.length; i++) {
      const compIndex = i * 2
      const metaIndex = i * 2 + 1

      const compResult = rawData[compIndex]
      const metaResult = rawData[metaIndex]

      if (compResult.status === 'success' && metaResult.status === 'success') {
        const comp = compResult.result as any
        const meta = metaResult.result as [string, string]

        result.push({
          id: competitionIds[i],
          name: meta[0] || `Competition #${competitionIds[i]}`,
          description: meta[1] || '',
          collectionAddress: comp.collectionAddress,
          rarityTiers: comp.rarityTiers,
          ticketPrice: comp.ticketPrice,
          treasuryWallet: comp.treasuryWallet,
          treasuryPercent: comp.treasuryPercent,
          deadline: comp.deadline,
          boosterBoxEnabled: comp.boosterBoxEnabled,
          boosterBoxAddress: comp.boosterBoxAddress,
          verifierAddress: comp.verifierAddress,
          state: comp.state,
          winner: comp.winner,
          prizePool: comp.prizePool,
          totalTickets: comp.totalTickets,
          winnerDeclared: comp.winnerDeclared,
          winnerDeclaredAt: comp.winnerDeclaredAt,
          emergencyPaused: comp.emergencyPaused,
        })
      }
    }

    return result
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawData])

  return {
    competitions,
    isLoading: loadingCount || loadingData,
    totalCount: competitionIds.length,
  }
}

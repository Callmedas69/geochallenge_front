/**
 * @title useCompetitionEvents - Event Listener Hooks
 * @notice Real-time event listeners for competition contract
 * @dev Uses wagmi's useWatchContractEvent for WebSocket-based listening
 * @dev KISS principle: Simple event hooks, no complex state management
 */

import { useWatchContractEvent } from 'wagmi'
import { geoChallenge_implementation_ABI } from '@/abi'
import { CONTRACT_ADDRESSES } from '@/lib/contractList'

/**
 * Listen for CompetitionCreated events
 * @param onCreated - Callback when competition is created
 */
export function useWatchCompetitionCreated(
  onCreated?: (competitionId: bigint, collectionAddress: string) => void
) {
  useWatchContractEvent({
    address: CONTRACT_ADDRESSES.GeoChallenge,
    abi: geoChallenge_implementation_ABI,
    eventName: 'CompetitionCreated',
    poll: true,
    pollingInterval: 4_000, // Poll every 4 seconds
    onLogs(logs) {
      logs.forEach((log) => {
        if (log.args.competitionId && log.args.collectionAddress) {
          onCreated?.(log.args.competitionId, log.args.collectionAddress)
        }
      })
    },
  })
}

/**
 * Listen for CompetitionStarted events
 * @param onStarted - Callback when competition starts
 */
export function useWatchCompetitionStarted(
  onStarted?: (competitionId: bigint, deadline: bigint) => void
) {
  useWatchContractEvent({
    address: CONTRACT_ADDRESSES.GeoChallenge,
    abi: geoChallenge_implementation_ABI,
    eventName: 'CompetitionStarted',
    poll: true,
    pollingInterval: 4_000, // Poll every 4 seconds
    onLogs(logs) {
      logs.forEach((log) => {
        if (log.args.competitionId && log.args.deadline) {
          onStarted?.(log.args.competitionId, log.args.deadline)
        }
      })
    },
  })
}

/**
 * Listen for CompetitionEnded events
 * @param onEnded - Callback when competition ends
 */
export function useWatchCompetitionEnded(
  onEnded?: (competitionId: bigint, hasWinner: boolean) => void
) {
  useWatchContractEvent({
    address: CONTRACT_ADDRESSES.GeoChallenge,
    abi: geoChallenge_implementation_ABI,
    eventName: 'CompetitionEnded',
    onLogs(logs) {
      logs.forEach((log) => {
        if (log.args.competitionId !== undefined && log.args.hasWinner !== undefined) {
          onEnded?.(log.args.competitionId, log.args.hasWinner)
        }
      })
    },
  })
}

/**
 * Listen for CompetitionCancelled events
 * @param onCancelled - Callback when competition is cancelled
 */
export function useWatchCompetitionCancelled(
  onCancelled?: (competitionId: bigint) => void
) {
  useWatchContractEvent({
    address: CONTRACT_ADDRESSES.GeoChallenge,
    abi: geoChallenge_implementation_ABI,
    eventName: 'CompetitionCancelled',
    onLogs(logs) {
      logs.forEach((log) => {
        if (log.args.competitionId) {
          onCancelled?.(log.args.competitionId)
        }
      })
    },
  })
}

/**
 * Listen for TicketPurchased events
 * @param onPurchased - Callback when ticket is purchased
 * @param competitionId - Optional: filter by specific competition
 */
export function useWatchTicketPurchased(
  onPurchased?: (buyer: string, competitionId: bigint, price: bigint) => void,
  competitionId?: bigint
) {
  useWatchContractEvent({
    address: CONTRACT_ADDRESSES.GeoChallenge,
    abi: geoChallenge_implementation_ABI,
    eventName: 'TicketPurchased',
    args: competitionId !== undefined ? { competitionId } : undefined,
    poll: true,
    pollingInterval: 4_000, // Poll every 4 seconds
    onLogs(logs) {
      logs.forEach((log) => {
        if (log.args.buyer && log.args.competitionId && log.args.price !== undefined) {
          onPurchased?.(log.args.buyer, log.args.competitionId, log.args.price)
        }
      })
    },
  })
}

/**
 * Listen for WinnerDeclared events
 * @param onDeclared - Callback when winner is declared
 * @param competitionId - Optional: filter by specific competition
 */
export function useWatchWinnerDeclared(
  onDeclared?: (competitionId: bigint, winner: string) => void,
  competitionId?: bigint
) {
  useWatchContractEvent({
    address: CONTRACT_ADDRESSES.GeoChallenge,
    abi: geoChallenge_implementation_ABI,
    eventName: 'WinnerDeclared',
    args: competitionId !== undefined ? { competitionId } : undefined,
    poll: true,
    pollingInterval: 4_000, // Poll every 4 seconds
    onLogs(logs) {
      logs.forEach((log) => {
        if (log.args.competitionId && log.args.winner) {
          onDeclared?.(log.args.competitionId, log.args.winner)
        }
      })
    },
  })
}

/**
 * Listen for WinnerClaimed events
 * @param onClaimed - Callback when winner claims prize
 * @param competitionId - Optional: filter by specific competition
 */
export function useWatchWinnerClaimed(
  onClaimed?: (competitionId: bigint, user: string, proofHash: string) => void,
  competitionId?: bigint
) {
  useWatchContractEvent({
    address: CONTRACT_ADDRESSES.GeoChallenge,
    abi: geoChallenge_implementation_ABI,
    eventName: 'WinnerClaimed',
    args: competitionId !== undefined ? { competitionId } : undefined,
    onLogs(logs) {
      logs.forEach((log) => {
        if (log.args.competitionId && log.args.user && log.args.proofHash) {
          onClaimed?.(log.args.competitionId, log.args.user, log.args.proofHash)
        }
      })
    },
  })
}

/**
 * Listen for CompetitionFinalized events
 * @param onFinalized - Callback when competition is finalized
 */
export function useWatchCompetitionFinalized(
  onFinalized?: (competitionId: bigint) => void
) {
  useWatchContractEvent({
    address: CONTRACT_ADDRESSES.GeoChallenge,
    abi: geoChallenge_implementation_ABI,
    eventName: 'CompetitionFinalized',
    onLogs(logs) {
      logs.forEach((log) => {
        if (log.args.competitionId) {
          onFinalized?.(log.args.competitionId)
        }
      })
    },
  })
}

/**
 * Listen for Emergency Pause/Unpause events
 * @param onEmergency - Callback when emergency state changes
 */
export function useWatchEmergencyEvents(
  onEmergency?: (competitionId: bigint, isPaused: boolean) => void
) {
  // Watch pause events
  useWatchContractEvent({
    address: CONTRACT_ADDRESSES.GeoChallenge,
    abi: geoChallenge_implementation_ABI,
    eventName: 'CompetitionEmergencyPaused',
    onLogs(logs) {
      logs.forEach((log) => {
        if (log.args.competitionId) {
          onEmergency?.(log.args.competitionId, true)
        }
      })
    },
  })

  // Watch unpause events
  useWatchContractEvent({
    address: CONTRACT_ADDRESSES.GeoChallenge,
    abi: geoChallenge_implementation_ABI,
    eventName: 'CompetitionEmergencyUnpaused',
    onLogs(logs) {
      logs.forEach((log) => {
        if (log.args.competitionId) {
          onEmergency?.(log.args.competitionId, false)
        }
      })
    },
  })
}

/**
 * Listen for AdditionalPrizeAdded events
 * @param onPrizeAdded - Callback when additional prize is added
 * @param competitionId - Optional: filter by specific competition
 */
export function useWatchAdditionalPrizeAdded(
  onPrizeAdded?: (competitionId: bigint, amount: bigint, addedBy: string) => void,
  competitionId?: bigint
) {
  useWatchContractEvent({
    address: CONTRACT_ADDRESSES.GeoChallenge,
    abi: geoChallenge_implementation_ABI,
    eventName: 'AdditionalPrizeAdded',
    args: competitionId !== undefined ? { competitionId } : undefined,
    onLogs(logs) {
      logs.forEach((log) => {
        if (log.args.competitionId && log.args.amount !== undefined && log.args.addedBy) {
          onPrizeAdded?.(log.args.competitionId, log.args.amount, log.args.addedBy)
        }
      })
    },
  })
}

/**
 * Listen for ParticipantPrizeClaimed events
 * @param onClaimed - Callback when participant claims their prize
 * @param competitionId - Optional: filter by specific competition
 */
export function useWatchParticipantPrizeClaimed(
  onClaimed?: (competitionId: bigint, participant: string, amount: bigint) => void,
  competitionId?: bigint
) {
  useWatchContractEvent({
    address: CONTRACT_ADDRESSES.GeoChallenge,
    abi: geoChallenge_implementation_ABI,
    eventName: 'ParticipantPrizeClaimed',
    args: competitionId !== undefined ? { competitionId } : undefined,
    onLogs(logs) {
      logs.forEach((log) => {
        if (log.args.competitionId && log.args.participant && log.args.amount !== undefined) {
          onClaimed?.(log.args.competitionId, log.args.participant, log.args.amount)
        }
      })
    },
  })
}

/**
 * Listen for RefundIssued events
 * @param onRefund - Callback when refund is issued
 * @param competitionId - Optional: filter by specific competition
 */
export function useWatchRefundIssued(
  onRefund?: (competitionId: bigint, user: string, amount: bigint) => void,
  competitionId?: bigint
) {
  useWatchContractEvent({
    address: CONTRACT_ADDRESSES.GeoChallenge,
    abi: geoChallenge_implementation_ABI,
    eventName: 'RefundIssued',
    args: competitionId !== undefined ? { competitionId } : undefined,
    onLogs(logs) {
      logs.forEach((log) => {
        if (log.args.competitionId && log.args.participant && log.args.amount !== undefined) {
          onRefund?.(log.args.competitionId, log.args.participant, log.args.amount)
        }
      })
    },
  })
}

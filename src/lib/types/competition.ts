/**
 * @title Competition Domain Types
 * @notice Business logic types for Competition management
 * @dev These are domain/UI types, not direct contract mappings
 */

import type { Address } from 'viem'

// ============================================================================
// Constants (mirroring smart contract)
// ============================================================================

/**
 * Wait period constants from GeoChallenge contract
 * @dev These must match the smart contract values exactly
 */
export const GRACE_PERIOD = 24 * 60 * 60 // 24 hours in seconds (after winner declared)
export const NO_WINNER_WAIT_PERIOD = 1 * 24 * 60 * 60 // 1 day in seconds (after deadline, no winner)

// ============================================================================
// Enums
// ============================================================================

/**
 * Competition State Enum
 * Maps to contract enum ICompetitionStorage.CompetitionState
 */
export enum CompetitionState {
  NOT_STARTED = 0,
  ACTIVE = 1,
  ENDED = 2,
  FINALIZED = 3,
  CANCELLED = 4,
}

export const CompetitionStateLabel: Record<CompetitionState, string> = {
  [CompetitionState.NOT_STARTED]: 'Not Started',
  [CompetitionState.ACTIVE]: 'Active',
  [CompetitionState.ENDED]: 'Ended',
  [CompetitionState.FINALIZED]: 'Finalized',
  [CompetitionState.CANCELLED]: 'Cancelled',
}

// ============================================================================
// Core Competition Types
// ============================================================================

/**
 * Competition (Read from contract)
 * Matches struct ICompetitionStorage.Competition
 */
export interface Competition {
  collectionAddress: Address
  rarityTiers: readonly number[] // uint8[]
  ticketPrice: bigint
  treasuryWallet: Address
  treasuryPercent: bigint
  deadline: bigint // Unix timestamp
  boosterBoxEnabled: boolean
  boosterBoxAddress: Address
  verifierAddress: Address
  state: CompetitionState
  winner: Address
  prizePool: bigint
  totalTickets: bigint
  winnerDeclared: boolean
  winnerDeclaredAt: bigint // Unix timestamp
  emergencyPaused: boolean
}

/**
 * Create Competition Parameters (Write to contract)
 * Matches struct ICompetitionStorage.CreateCompetitionParams
 */
export interface CreateCompetitionParams {
  name: string
  description: string
  collectionAddress: Address
  rarityTiers: number[] // uint8[]
  ticketPrice: bigint
  treasuryWallet: Address
  treasuryPercent: bigint
  deadline: bigint // Unix timestamp
  boosterBoxEnabled: boolean
  boosterBoxAddress: Address
  verifierAddress: Address
}

// ============================================================================
// UI-Specific Competition Types
// ============================================================================

/**
 * Competition with metadata (for UI display)
 * Combines on-chain data + metadata
 */
export interface CompetitionWithMetadata extends Competition {
  id: bigint
  name: string
  description: string
}

/**
 * Competition Card Data (optimized for list views)
 */
export interface CompetitionCardData {
  id: bigint
  name: string
  description: string
  collectionAddress: Address
  ticketPrice: bigint
  prizePool: bigint
  totalTickets: bigint
  deadline: bigint
  state: CompetitionState
  hasWinner: boolean
  emergencyPaused: boolean
}

/**
 * Competition Filter Options
 */
export interface CompetitionFilters {
  state?: CompetitionState | CompetitionState[]
  minPrizePool?: bigint
  maxTicketPrice?: bigint
  hasWinner?: boolean
  isPaused?: boolean
  searchQuery?: string
}

/**
 * Competition Sort Options
 */
export type CompetitionSortField =
  | 'deadline'
  | 'prizePool'
  | 'totalTickets'
  | 'ticketPrice'
  | 'createdAt'

export type CompetitionSortOrder = 'asc' | 'desc'

export interface CompetitionSortOptions {
  field: CompetitionSortField
  order: CompetitionSortOrder
}

// ============================================================================
// Competition Stats
// ============================================================================

/**
 * Competition Statistics
 * From QueryManager.getCompetitionStats()
 */
export interface CompetitionStats {
  notStarted: bigint
  active: bigint
  ended: bigint
  finalized: bigint
  emergencyPaused: bigint
}

/**
 * Individual Competition Health
 * From QueryManager.checkCompetitionHealth()
 */
export interface CompetitionHealth {
  exists: boolean
  isActive: boolean
  hasParticipants: boolean
  isPaused: boolean
  isExpired: boolean
  timeRemaining: bigint
}

// ============================================================================
// Helper Types
// ============================================================================

/**
 * Paginated Competition Response
 */
export interface PaginatedCompetitions {
  competitions: CompetitionWithMetadata[]
  total: bigint
  hasMore: boolean
  offset: bigint
  limit: bigint
}

/**
 * Competition Time Status
 */
export interface CompetitionTimeStatus {
  hasStarted: boolean
  hasEnded: boolean
  isActive: boolean
  timeRemaining: bigint
  timeRemainingFormatted: string
  deadlineDate: Date
}

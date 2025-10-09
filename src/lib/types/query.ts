/**
 * @title Query & Health Types
 * @notice Types for platform health monitoring and queries
 * @dev From QueryManager module
 */

import type { Address } from 'viem'
import type { Competition } from './competition'
import type { ContractUserStats } from './user'

// ============================================================================
// Platform Health
// ============================================================================

/**
 * Contract Health (Platform-wide)
 * From QueryManager.getContractHealth()
 */
export interface ContractHealth {
  totalCompetitions: bigint
  activeCompetitions: bigint
  totalEthLocked: bigint
  pendingRefunds: bigint
}

/**
 * Platform Statistics (UI-friendly)
 */
export interface PlatformStats {
  totalCompetitions: number
  activeCompetitions: number
  totalValueLocked: string // Formatted ETH
  totalValueLockedUSD: number
  pendingRefunds: string // Formatted ETH
  totalParticipants: number
  totalPrizesDistributed: string // Formatted ETH
}

// ============================================================================
// Query Options
// ============================================================================

/**
 * Pagination Options
 */
export interface PaginationOptions {
  offset: bigint
  limit: bigint
}

/**
 * Bulk Query Options
 */
export interface BulkQueryOptions {
  competitionIds: bigint[]
  includeMetadata?: boolean
  includeHealth?: boolean
}

// ============================================================================
// Query Results
// ============================================================================

/**
 * Multiple Competitions Query Result
 */
export interface MultipleCompetitionsResult {
  competitions: Competition[]
  totalQueried: number
  successCount: number
  failedIds: bigint[]
}

// ============================================================================
// User Query Results (from QueryManager)
// ============================================================================

/**
 * User Competitions Query Result
 * From QueryManager.getUserCompetitions(user)
 */
export interface UserCompetitionsResult {
  competitionIds: readonly bigint[]
  competitions: readonly Competition[]
}

/**
 * User Active Competitions Query Result
 * From QueryManager.getUserActiveCompetitions(user)
 */
export interface UserActiveCompetitionsResult {
  activeIds: readonly bigint[]
  activeComps: readonly Competition[]
}

/**
 * User Completed Competitions Query Result
 * From QueryManager.getUserCompletedCompetitions(user)
 */
export interface UserCompletedCompetitionsResult {
  completedIds: readonly bigint[]
  completedComps: readonly Competition[]
}

/**
 * User Dashboard Data (Single RPC Call)
 * From QueryManager.getUserDashboardData(user)
 * @dev This is the MOST IMPORTANT function - gets all dashboard data in one call (60x faster!)
 */
export interface UserDashboardDataResult {
  stats: ContractUserStats
  activeCompIds: readonly bigint[]
  claimableCompIds: readonly bigint[]
  totalCompetitions: bigint
}

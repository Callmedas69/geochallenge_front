/**
 * @title Prize Types
 * @notice Types for prize distribution and calculations
 * @dev From PrizeManager and PrizeCalculationManager modules
 */

import type { Address } from 'viem'

// ============================================================================
// Prize Calculation
// ============================================================================

/**
 * Prize Calculation Result
 * From PrizeManager.calculatePotentialPrizes()
 */
export interface PrizeCalculation {
  winnerPrize: bigint
  prizePerTicket: bigint
}

/**
 * Prize Distribution (UI-friendly)
 */
export interface PrizeDistribution {
  winnerPrizeETH: string // Formatted
  participantPrizePerTicketETH: string // Formatted
  totalPrizePool: string // Formatted
  winnerPercentage: number // e.g., 70
  participantPercentage: number // e.g., 30
}

// ============================================================================
// Claimable Balance
// ============================================================================

/**
 * User Claimable Balance
 * From PrizeManager.getClaimableBalance()
 */
export interface ClaimableBalance {
  address: Address
  balance: bigint
  balanceETH: string // Formatted
}

/**
 * Prize Claim Status
 */
export interface PrizeClaimStatus {
  competitionId: bigint
  hasClaimed: boolean
  claimAmount: bigint
  claimAmountETH: string
  canClaim: boolean
  reason?: string // Why can't claim (if canClaim = false)
}

// ============================================================================
// Booster Box
// ============================================================================

/**
 * Booster Box Info
 * From GeoChallenge.getBoosterBoxInfo()
 */
export interface BoosterBoxInfo {
  enabled: boolean
  contractAddress: Address
  quantity: bigint
  claimed: boolean
}

/**
 * Booster Box Claim Status (UI)
 */
export interface BoosterBoxClaimStatus {
  competitionId: bigint
  isEnabled: boolean
  quantity: number
  hasClaimed: boolean
  canClaim: boolean
  collectionAddress: Address
  collectionName?: string
}

// ============================================================================
// Treasury Split
// ============================================================================

/**
 * Treasury Split Calculation
 * From PrizeCalculationManager.calculateTreasurySplit()
 */
export interface TreasurySplit {
  treasuryAmount: bigint
  prizePoolAmount: bigint
}

/**
 * Treasury Split (UI-friendly)
 */
export interface TreasurySplitDisplay {
  treasuryAmountETH: string
  prizePoolAmountETH: string
  treasuryPercentage: number
  prizePoolPercentage: number
}

// ============================================================================
// Prize Constants
// ============================================================================

/**
 * Prize Distribution Constants
 * From PrizeManager & PrizeCalculationManager
 */
export const PRIZE_CONSTANTS = {
  GRACE_PERIOD: BigInt(3600), // 1 hour in seconds
  WINNER_PERCENT: BigInt(70), // 70% to winner
  PARTICIPANT_PERCENT: BigInt(30), // 30% to participants
} as const

// ============================================================================
// Refund
// ============================================================================

/**
 * Refund Calculation
 * From CompetitionLifecycleManager.calculateRefund()
 */
export interface RefundCalculation {
  refundAmount: bigint
  refundAmountETH: string
}

/**
 * Refund Claim Status
 */
export interface RefundClaimStatus {
  competitionId: bigint
  isEligible: boolean
  hasClaimed: boolean
  refundAmount: bigint
  refundAmountETH: string
  canClaim: boolean
  reason?: string
}

// ============================================================================
// Prize Summary (for Competition Detail Page)
// ============================================================================

/**
 * Complete Prize Summary
 */
export interface PrizeSummary {
  totalPrizePool: bigint
  totalPrizePoolETH: string
  totalPrizePoolUSD: number
  winnerPrize: bigint
  winnerPrizeETH: string
  participantPrizePerTicket: bigint
  participantPrizePerTicketETH: string
  treasuryAmount: bigint
  treasuryAmountETH: string
  hasWinner: boolean
  winnerAddress?: Address
  boosterBox?: BoosterBoxInfo
  isPrizeCalculated: boolean
}

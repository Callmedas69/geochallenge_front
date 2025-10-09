/**
 * @title GeoChallenge Types Central Export
 * @notice All domain types exported from a single location
 * @dev KISS principle - simple, centralized type management
 */

// ============================================================================
// Rarity Constants & Mapping
// ============================================================================

/**
 * Centralized rarity tier mapping
 * Maps tier numbers to human-readable names
 */
export const RARITY_TIERS = {
  1: 'Common',
  2: 'Rare',
  3: 'Epic',
  4: 'Legendary',
  5: 'Mythic',
} as const

/**
 * Rarity tier colors for UI display
 */
export const RARITY_COLORS = {
  1: 'bg-gray-500',     // Common
  2: 'bg-blue-500',     // Rare
  3: 'bg-purple-500',   // Epic
  4: 'bg-orange-500',   // Legendary
  5: 'bg-pink-500',     // Mythic
} as const

/**
 * Get rarity name from tier number
 */
export function getRarityName(tier: number): string {
  return RARITY_TIERS[tier as keyof typeof RARITY_TIERS] || `Tier ${tier}`
}

/**
 * Get rarity color from tier number
 */
export function getRarityColor(tier: number): string {
  return RARITY_COLORS[tier as keyof typeof RARITY_COLORS] || 'bg-gray-500'
}

// ============================================================================
// Competition Types
// ============================================================================

export {
  GRACE_PERIOD,
  NO_WINNER_WAIT_PERIOD,
  CompetitionState,
  CompetitionStateLabel,
  type Competition,
  type CreateCompetitionParams,
  type CompetitionWithMetadata,
  type CompetitionCardData,
  type CompetitionFilters,
  type CompetitionSortField,
  type CompetitionSortOrder,
  type CompetitionSortOptions,
  type CompetitionStats,
  type CompetitionHealth,
  type PaginatedCompetitions,
  type CompetitionTimeStatus,
} from './competition'

// ============================================================================
// Query & Health Types
// ============================================================================

export {
  type ContractHealth,
  type PlatformStats,
  type PaginationOptions,
  type BulkQueryOptions,
  type MultipleCompetitionsResult,
  type UserCompetitionsResult,
  type UserActiveCompetitionsResult,
  type UserCompletedCompetitionsResult,
  type UserDashboardDataResult,
} from './query'

// ============================================================================
// Metadata Types
// ============================================================================

export {
  type CompetitionMetadata,
  type MultipleMetadataResult,
  type CompetitionMetadataWithId,
  METADATA_CONSTRAINTS,
  type MetadataValidationResult,
} from './metadata'

// ============================================================================
// Proof Types
// ============================================================================

export {
  type EIP712Domain,
  type CompletionProof,
  type GPSCoordinates,
  type ProofGenerationRequest,
  type ProofGenerationResponse,
  type ProofValidationResult,
  type ProofValidationView,
  type ProofUsageStatus,
  type TargetLocation,
  type LocationVerificationResult,
  ProofSubmissionStatus,
  type ProofSubmissionState,
} from './proof'

// ============================================================================
// Prize Types
// ============================================================================

export {
  type PrizeCalculation,
  type PrizeDistribution,
  type ClaimableBalance,
  type PrizeClaimStatus,
  type BoosterBoxInfo,
  type BoosterBoxClaimStatus,
  type TreasurySplit,
  type TreasurySplitDisplay,
  PRIZE_CONSTANTS,
  type RefundCalculation,
  type RefundClaimStatus,
  type PrizeSummary,
} from './prize'

// ============================================================================
// User Types
// ============================================================================

export {
  type UserProfile,
  type UserTicket,
  type TicketMetadata,
  type TicketAttribute,
  type UserActivity,
  UserActivityType,
  type UserActivityData,
  type TicketPurchasedData,
  type WinnerClaimedData,
  type PrizeClaimedData,
  type ParticipantPrizeClaimedData,
  type RefundClaimedData,
  type BalanceWithdrawnData,
  type BoosterBoxesClaimedData,
  type UserCompetitionStatus,
  type ContractUserStats,
  type UserStats,
  type UserDashboardData,
  type ClaimableAction,
} from './user'

// ============================================================================
// Validators & Type Guards
// ============================================================================

export {
  isValidAddress,
  isValidHex,
  isValidBigInt,
  isPositiveBigInt,
  isValidCompetitionId,
  isValidCompetitionState,
  isCompetitionActive,
  canBuyTicket,
  hasCompetitionEnded,
  type ValidationResult,
  validateCreateCompetitionParams,
  validateCompetitionMetadata,
  validateGPSCoordinates,
  isInRange,
  isValidPercentage,
  isFutureTimestamp,
  isPastTimestamp,
  canClaimWinnerPrize,
  canClaimParticipantPrize,
  canClaimRefund,
  safeBigInt,
  isEmpty,
} from './validators'

// ============================================================================
// Re-export commonly used viem types
// ============================================================================

export type { Address, Hex, Hash } from 'viem'

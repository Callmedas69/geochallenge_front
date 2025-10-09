/**
 * @title Type Validators & Guards
 * @notice Runtime type validation and type guards
 * @dev KISS principle - essential validation only
 */

import { isAddress, isHex } from 'viem'
import type { Address, Hex } from 'viem'
import { CompetitionState } from './competition'
import type { Competition, CreateCompetitionParams } from './competition'
import type { CompetitionMetadata } from './metadata'
import type { GPSCoordinates } from './proof'

// ============================================================================
// Basic Type Guards
// ============================================================================

/**
 * Check if value is a valid Ethereum address
 */
export function isValidAddress(value: unknown): value is Address {
  return typeof value === 'string' && isAddress(value)
}

/**
 * Check if value is a valid hex string
 */
export function isValidHex(value: unknown): value is Hex {
  return typeof value === 'string' && isHex(value)
}

/**
 * Check if value is a valid bigint
 */
export function isValidBigInt(value: unknown): value is bigint {
  return typeof value === 'bigint'
}

/**
 * Check if value is a positive bigint
 */
export function isPositiveBigInt(value: unknown): value is bigint {
  return typeof value === 'bigint' && value > BigInt(0)
}

// ============================================================================
// Competition Validators
// ============================================================================

/**
 * Validate Competition ID
 */
export function isValidCompetitionId(id: unknown): id is bigint {
  return typeof id === 'bigint' && id >= BigInt(1)
}

/**
 * Validate Competition State
 */
export function isValidCompetitionState(state: unknown): state is CompetitionState {
  return (
    typeof state === 'number' &&
    state >= CompetitionState.NOT_STARTED &&
    state <= CompetitionState.CANCELLED
  )
}

/**
 * Check if competition is active
 */
export function isCompetitionActive(competition: Competition): boolean {
  return (
    competition.state === CompetitionState.ACTIVE &&
    !competition.emergencyPaused &&
    BigInt(Math.floor(Date.now() / 1000)) < competition.deadline
  )
}

/**
 * Check if competition can accept tickets
 */
export function canBuyTicket(competition: Competition): boolean {
  return (
    competition.state === CompetitionState.ACTIVE &&
    !competition.emergencyPaused &&
    BigInt(Math.floor(Date.now() / 1000)) < competition.deadline
  )
}

/**
 * Check if competition has ended
 */
export function hasCompetitionEnded(competition: Competition): boolean {
  return (
    competition.state === CompetitionState.ENDED ||
    competition.state === CompetitionState.FINALIZED ||
    BigInt(Math.floor(Date.now() / 1000)) >= competition.deadline
  )
}

// ============================================================================
// Create Competition Params Validation
// ============================================================================

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

/**
 * Validate CreateCompetitionParams
 */
export function validateCreateCompetitionParams(
  params: CreateCompetitionParams
): ValidationResult {
  const errors: string[] = []

  // Name validation
  if (!params.name || params.name.trim().length < 3) {
    errors.push('Competition name must be at least 3 characters')
  }
  if (params.name && params.name.length > 100) {
    errors.push('Competition name must be less than 100 characters')
  }

  // Description validation
  if (!params.description || params.description.trim().length < 10) {
    errors.push('Competition description must be at least 10 characters')
  }
  if (params.description && params.description.length > 1000) {
    errors.push('Competition description must be less than 1000 characters')
  }

  // Collection address
  if (!isValidAddress(params.collectionAddress)) {
    errors.push('Invalid collection address')
  }

  // Rarity tiers
  if (!params.rarityTiers || params.rarityTiers.length === 0) {
    errors.push('At least one rarity tier is required')
  }
  if (params.rarityTiers && params.rarityTiers.some((tier) => tier < 0 || tier > 255)) {
    errors.push('Rarity tiers must be between 0 and 255')
  }

  // Ticket price
  if (!isPositiveBigInt(params.ticketPrice)) {
    errors.push('Ticket price must be greater than 0')
  }

  // Treasury wallet
  if (!isValidAddress(params.treasuryWallet)) {
    errors.push('Invalid treasury wallet address')
  }

  // Treasury percent (should be between 0-100, but contract may have different limits)
  if (params.treasuryPercent < BigInt(0) || params.treasuryPercent > BigInt(100)) {
    errors.push('Treasury percent must be between 0 and 100')
  }

  // Deadline
  const now = BigInt(Math.floor(Date.now() / 1000))
  if (params.deadline <= now) {
    errors.push('Deadline must be in the future')
  }

  // Booster box validation
  if (params.boosterBoxEnabled && !isValidAddress(params.boosterBoxAddress)) {
    errors.push('Invalid booster box address')
  }

  // Verifier address
  if (!isValidAddress(params.verifierAddress)) {
    errors.push('Invalid verifier address')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// ============================================================================
// Metadata Validation
// ============================================================================

/**
 * Validate Competition Metadata
 */
export function validateCompetitionMetadata(metadata: CompetitionMetadata): ValidationResult {
  const errors: string[] = []

  if (!metadata.name || metadata.name.trim().length < 3) {
    errors.push('Name must be at least 3 characters')
  }
  if (metadata.name && metadata.name.length > 100) {
    errors.push('Name must be less than 100 characters')
  }

  if (!metadata.description || metadata.description.trim().length < 10) {
    errors.push('Description must be at least 10 characters')
  }
  if (metadata.description && metadata.description.length > 1000) {
    errors.push('Description must be less than 1000 characters')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// ============================================================================
// GPS Coordinates Validation
// ============================================================================

/**
 * Validate GPS Coordinates
 */
export function validateGPSCoordinates(coords: GPSCoordinates): ValidationResult {
  const errors: string[] = []

  if (coords.latitude < -90 || coords.latitude > 90) {
    errors.push('Latitude must be between -90 and 90')
  }

  if (coords.longitude < -180 || coords.longitude > 180) {
    errors.push('Longitude must be between -180 and 180')
  }

  if (coords.accuracy < 0) {
    errors.push('Accuracy must be a positive number')
  }

  if (coords.accuracy > 100) {
    errors.push('GPS accuracy is too low (>100m). Please try again with better signal.')
  }

  const now = Date.now()
  const fiveMinutesAgo = now - 5 * 60 * 1000
  if (coords.timestamp < fiveMinutesAgo) {
    errors.push('GPS coordinates are too old. Please refresh location.')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// ============================================================================
// Numeric Validation
// ============================================================================

/**
 * Check if bigint is within range
 */
export function isInRange(value: bigint, min: bigint, max: bigint): boolean {
  return value >= min && value <= max
}

/**
 * Check if value is a valid percentage (0-100)
 */
export function isValidPercentage(value: bigint): boolean {
  return value >= BigInt(0) && value <= BigInt(100)
}

/**
 * Check if timestamp is in the future
 */
export function isFutureTimestamp(timestamp: bigint): boolean {
  const now = BigInt(Math.floor(Date.now() / 1000))
  return timestamp > now
}

/**
 * Check if timestamp is in the past
 */
export function isPastTimestamp(timestamp: bigint): boolean {
  const now = BigInt(Math.floor(Date.now() / 1000))
  return timestamp <= now
}

// ============================================================================
// Prize Validation
// ============================================================================

/**
 * Check if user can claim winner prize
 */
export function canClaimWinnerPrize(competition: Competition, userAddress: Address): boolean {
  return (
    competition.winnerDeclared &&
    competition.winner.toLowerCase() === userAddress.toLowerCase() &&
    (competition.state === CompetitionState.ENDED ||
      competition.state === CompetitionState.FINALIZED)
  )
}

/**
 * Check if user can claim participant prize
 */
export function canClaimParticipantPrize(
  competition: Competition,
  hasTicket: boolean
): boolean {
  return (
    hasTicket &&
    (competition.state === CompetitionState.ENDED ||
      competition.state === CompetitionState.FINALIZED) &&
    competition.totalTickets > BigInt(0)
  )
}

/**
 * Check if user can claim refund
 */
export function canClaimRefund(competition: Competition, hasTicket: boolean): boolean {
  return hasTicket && competition.state === CompetitionState.CANCELLED
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Safe string to bigint conversion
 */
export function safeBigInt(value: string | number | bigint): bigint | null {
  try {
    return BigInt(value)
  } catch {
    return null
  }
}

/**
 * Check if value is empty (null, undefined, empty string, 0, 0n)
 */
export function isEmpty(value: unknown): boolean {
  return (
    value === null ||
    value === undefined ||
    value === '' ||
    value === 0 ||
    value === BigInt(0) ||
    (Array.isArray(value) && value.length === 0)
  )
}

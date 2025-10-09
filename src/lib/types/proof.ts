/**
 * @title Proof Types
 * @notice EIP-712 proof types for winner verification
 * @dev From ProofValidator module
 */

import type { Address, Hex } from 'viem'

// ============================================================================
// EIP-712 Domain
// ============================================================================

/**
 * EIP-712 Domain Data
 * From ProofValidator.eip712Domain()
 */
export interface EIP712Domain {
  fields: Hex // bytes1
  name: string
  version: string
  chainId: bigint
  verifyingContract: Address
  salt: Hex // bytes32
  extensions: bigint[]
}

// ============================================================================
// Completion Proof
// ============================================================================

/**
 * Completion Proof (for backend signing)
 * Used in iamtheWinner() function
 */
export interface CompletionProof {
  competitionId: bigint
  participant: Address
  proofHash: Hex // bytes32 - hash of GPS coordinates + timestamp
  signature: Hex // bytes - EIP-712 signature from backend
}

/**
 * GPS Coordinates (for proof generation)
 */
export interface GPSCoordinates {
  latitude: number
  longitude: number
  accuracy: number // meters
  timestamp: number // Unix timestamp
}

/**
 * Proof Generation Request (frontend → backend)
 */
export interface ProofGenerationRequest {
  competitionId: bigint
  participantAddress: Address
  gpsCoordinates: GPSCoordinates
}

/**
 * Proof Generation Response (backend → frontend)
 */
export interface ProofGenerationResponse {
  success: boolean
  proof?: CompletionProof
  error?: string
  isValidLocation: boolean
  distanceFromTarget?: number // meters
}

// ============================================================================
// Proof Validation
// ============================================================================

/**
 * Proof Validation Result
 * From ProofValidator.validateProof()
 */
export interface ProofValidationResult {
  success: boolean
  isWinner: boolean
}

/**
 * Proof Validation (View)
 * From ProofValidator.validateProofView()
 */
export interface ProofValidationView {
  isValid: boolean
  reason: string
}

/**
 * Proof Usage Status
 */
export interface ProofUsageStatus {
  competitionId: bigint
  proofHash: Hex
  isUsed: boolean
  usedBy?: Address
  usedAt?: bigint
}

// ============================================================================
// Location Verification
// ============================================================================

/**
 * Target Location (Competition location)
 */
export interface TargetLocation {
  latitude: number
  longitude: number
  radiusMeters: number // Acceptance radius
  name: string
  description?: string
}

/**
 * Location Verification Result
 */
export interface LocationVerificationResult {
  isWithinRadius: boolean
  distance: number // meters from target
  targetLocation: TargetLocation
  userLocation: GPSCoordinates
}

// ============================================================================
// Proof Submission Flow
// ============================================================================

/**
 * Proof Submission Status
 */
export enum ProofSubmissionStatus {
  IDLE = 'idle',
  REQUESTING_LOCATION = 'requesting_location',
  VALIDATING_LOCATION = 'validating_location',
  GENERATING_PROOF = 'generating_proof',
  SUBMITTING = 'submitting',
  SUCCESS = 'success',
  ERROR = 'error',
}

/**
 * Proof Submission State (for UI)
 */
export interface ProofSubmissionState {
  status: ProofSubmissionStatus
  progress: number // 0-100
  currentStep: string
  error?: string
  proof?: CompletionProof
}

/**
 * @title Metadata Types
 * @notice Types for competition metadata (name, description)
 * @dev From MetadataManager module
 */

// ============================================================================
// Competition Metadata
// ============================================================================

/**
 * Competition Metadata
 * From MetadataManager.getCompetitionMetadata()
 */
export interface CompetitionMetadata {
  name: string
  description: string
}

/**
 * Multiple Metadata Result
 * From MetadataManager.getMultipleMetadata()
 */
export interface MultipleMetadataResult {
  names: string[]
  descriptions: string[]
}

/**
 * Metadata with ID (for mapping)
 */
export interface CompetitionMetadataWithId extends CompetitionMetadata {
  competitionId: bigint
}

// ============================================================================
// Metadata Validation
// ============================================================================

/**
 * Metadata Validation Rules
 */
export const METADATA_CONSTRAINTS = {
  NAME_MIN_LENGTH: 3,
  NAME_MAX_LENGTH: 100,
  DESCRIPTION_MIN_LENGTH: 10,
  DESCRIPTION_MAX_LENGTH: 1000,
} as const

/**
 * Metadata Validation Result
 */
export interface MetadataValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

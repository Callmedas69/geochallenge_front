/**
 * @title GeoChallenge ABIs Central Export
 * @notice All contract ABIs exported from a single location
 * @dev Following KISS principles - simple, centralized ABI management
 */

// ============================================================================
// Main Contract ABIs
// ============================================================================

export { geoChallenge_proxy_ABI } from './geoChallenge_proxy_ABI'
export { geoChallenge_implementation_ABI } from './geoChallenge_implementation_ABI'

// ============================================================================
// Module ABIs
// ============================================================================

export { adminValidationManager_ABI } from './adminValidationManager_ABI'
export { boosterBoxManager_ABI } from './boosterBoxManager_ABI'
export { competitionLifecycleManager_ABI } from './competitionLifecycleManager_ABI'
export { competitionManager_ABI } from './competitionManager_ABI'
export { metadataManager_ABI } from './metadataManager_ABI'
export { prizeCalculationManager_ABI } from './prizeCalculationManager_ABI'
export { prizeManager_ABI } from './prizeManager_ABI'
export { proofValidator_ABI } from './proofValidator_ABI'
export { queryManager_ABI } from './queryManager_ABI'
export { ticketRenderer_ABI } from './ticketRenderer_ABI'

// ============================================================================
// ABI List for Wagmi Config
// ============================================================================

import { geoChallenge_proxy_ABI } from './geoChallenge_proxy_ABI'
import { geoChallenge_implementation_ABI } from './geoChallenge_implementation_ABI'
import { adminValidationManager_ABI } from './adminValidationManager_ABI'
import { boosterBoxManager_ABI } from './boosterBoxManager_ABI'
import { competitionLifecycleManager_ABI } from './competitionLifecycleManager_ABI'
import { competitionManager_ABI } from './competitionManager_ABI'
import { metadataManager_ABI } from './metadataManager_ABI'
import { prizeCalculationManager_ABI } from './prizeCalculationManager_ABI'
import { prizeManager_ABI } from './prizeManager_ABI'
import { proofValidator_ABI } from './proofValidator_ABI'
import { queryManager_ABI } from './queryManager_ABI'
import { ticketRenderer_ABI } from './ticketRenderer_ABI'

export const ALL_ABIS = [
  geoChallenge_proxy_ABI,
  geoChallenge_implementation_ABI,
  adminValidationManager_ABI,
  boosterBoxManager_ABI,
  competitionLifecycleManager_ABI,
  competitionManager_ABI,
  metadataManager_ABI,
  prizeCalculationManager_ABI,
  prizeManager_ABI,
  proofValidator_ABI,
  queryManager_ABI,
  ticketRenderer_ABI,
] as const

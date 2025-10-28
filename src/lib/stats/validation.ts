/**
 * @title Input Validation Utilities
 * @notice Security validators for API inputs
 * @dev KISS principle: Simple, effective validation without over-engineering
 * @security Prevents injection attacks, invalid inputs, and malformed requests
 */

/**
 * Validation result type
 */
interface ValidationResult {
  valid: boolean;
  value?: number;
  error?: string;
}

/**
 * Validate competition ID from query parameters
 * @param competitionId - Raw competition ID from request
 * @returns Validation result with parsed value or error message
 *
 * @security
 * - Checks for null/undefined
 * - Validates numeric format (prevents injection)
 * - Checks safe integer range (prevents BigInt overflow)
 */
export function validateCompetitionId(
  competitionId: string | null
): ValidationResult {
  // Check if provided
  if (!competitionId) {
    return {
      valid: false,
      error: 'competitionId is required'
    };
  }

  // Validate numeric format (only digits allowed)
  // This prevents SQL injection and other attacks
  if (!/^\d+$/.test(competitionId)) {
    return {
      valid: false,
      error: 'Invalid competitionId format'
    };
  }

  // Validate range (must be safe integer)
  const compIdNum = Number(competitionId);
  if (compIdNum < 0 || compIdNum > Number.MAX_SAFE_INTEGER) {
    return {
      valid: false,
      error: 'competitionId out of valid range'
    };
  }

  // Valid!
  return {
    valid: true,
    value: compIdNum
  };
}

/**
 * Validate pagination parameters (for future leaderboard feature)
 * @param limit - Number of items per page
 * @param offset - Starting position
 * @returns Validation result
 */
export function validatePagination(
  limit: string | null,
  offset: string | null
): ValidationResult {
  const defaultLimit = 10;
  const maxLimit = 100;
  const defaultOffset = 0;

  // Validate limit
  if (limit !== null) {
    if (!/^\d+$/.test(limit)) {
      return { valid: false, error: 'Invalid limit format' };
    }
    const limitNum = Number(limit);
    if (limitNum < 1 || limitNum > maxLimit) {
      return { valid: false, error: `Limit must be between 1 and ${maxLimit}` };
    }
  }

  // Validate offset
  if (offset !== null) {
    if (!/^\d+$/.test(offset)) {
      return { valid: false, error: 'Invalid offset format' };
    }
    const offsetNum = Number(offset);
    if (offsetNum < 0) {
      return { valid: false, error: 'Offset must be non-negative' };
    }
  }

  return {
    valid: true,
    value: Number(limit || defaultLimit) // For limit
    // Note: For full implementation, return both limit and offset
  };
}

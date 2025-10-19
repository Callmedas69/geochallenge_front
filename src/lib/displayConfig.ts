/**
 * @title Display Configuration
 * @notice Centralized configuration for UI display formatting
 * @dev KISS principle: Single source of truth for all display settings
 */

// ============================================================================
// Decimal Precision
// ============================================================================

/**
 * Number of decimal places to display for ETH amounts
 */
export const DECIMALS = {
  // Farcaster miniApps (mobile) - fewer decimals for compact display
  FARCASTER: 5,

  // Main website (desktop) - more precision available
  MAIN: 5,

  // Admin dashboard - highest precision for accounting
  ADMIN: 5,

  // Percentages
  PERCENTAGE: 2,
} as const

/**
 * Get decimal precision based on context
 */
export function getDecimalPrecision(context: 'farcaster' | 'main' | 'admin' = 'main'): number {
  switch (context) {
    case 'farcaster':
      return DECIMALS.FARCASTER
    case 'admin':
      return DECIMALS.ADMIN
    case 'main':
    default:
      return DECIMALS.MAIN
  }
}

// ============================================================================
// Other Display Settings (Future)
// ============================================================================

/**
 * Card height settings
 */
export const CARD_HEIGHT = {
  FARCASTER: 'min-h-[140px]',
  MAIN: 'min-h-[200px]',
} as const

/**
 * Spacing settings
 */
export const SPACING = {
  FARCASTER: 'space-y-3',
  MAIN: 'space-y-4',
} as const

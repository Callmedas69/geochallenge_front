/**
 * @title Application Configuration
 * @notice Centralized configuration for environment variables
 * @dev Type-safe exports for client-side environment variables
 */

/**
 * Referrer Address for VibeMarket booster pack purchases
 * Used to earn referral fees on all pack mints
 */
export const REFERRER_ADDRESS = (
  process.env.NEXT_PUBLIC_REFERRER_ADDRESS ||
  '0x0000000000000000000000000000000000000000'
) as `0x${string}`

/**
 * Validate referrer address is set
 */
if (REFERRER_ADDRESS === '0x0000000000000000000000000000000000000000') {
  console.warn('⚠️ NEXT_PUBLIC_REFERRER_ADDRESS not set - using zero address (no referral fees)')
}

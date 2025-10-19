/**
 * @title Application Configuration
 * @notice Centralized configuration for environment variables
 * @dev Type-safe exports for client-side environment variables
 */

import { base } from 'viem/chains'

/**
 * Network Configuration
 * @notice Shared constants for both server-side API routes and client-side components
 * @dev Currently configured for Base Mainnet
 */

/**
 * Chain ID for all API operations and client interactions
 * 8453 = Base Mainnet
 * 84532 = Base Sepolia (testnet)
 */
export const API_CHAIN_ID = 8453

/**
 * RPC URL for viem clients
 * Uses Alchemy RPC to avoid Cloudflare rate limiting on public endpoints
 */
export const API_RPC_URL = process.env.NEXT_PUBLIC_BASE_MAINNET_RPC || 'https://mainnet.base.org'

/**
 * Chain object for viem operations (server and client)
 */
export const API_CHAIN = base

/**
 * Network name for display and logging
 */
export const API_NETWORK_NAME = 'Base'

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

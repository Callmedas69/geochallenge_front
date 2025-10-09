/**
 * @title Data Formatters
 * @dev Utility functions to format blockchain data for user display
 * @notice Following KISS principles - simple, clear, user-friendly
 */

import { formatEther, formatUnits, parseEther } from 'viem'
import type { Address } from 'viem'
import { CompetitionState } from '@/lib/types'

// ============================================================================
// BigInt / ETH Formatters
// ============================================================================

/**
 * Format wei to ETH with specified decimal places
 * @example formatWeiToEth(1000000000000000000n) => "1.00"
 * @example formatWeiToEth(1500000000000000000n, 4) => "1.5000"
 */
export function formatWeiToEth(wei: bigint, decimals: number = 2): string {
  const eth = formatEther(wei)
  const num = parseFloat(eth)
  return num.toFixed(decimals)
}

/**
 * Format wei to ETH with "ETH" suffix
 * @example formatEthWithSuffix(1000000000000000000n) => "1.00 ETH"
 */
export function formatEthWithSuffix(wei: bigint, decimals: number = 2): string {
  return `${formatWeiToEth(wei, decimals)} ETH`
}

/**
 * Format wei to compact display (K, M notation)
 * @example formatCompactEth(1500000000000000000n) => "1.5 ETH"
 * @example formatCompactEth(1500000000000000000000n) => "1.5K ETH"
 */
export function formatCompactEth(wei: bigint): string {
  const eth = parseFloat(formatEther(wei))

  if (eth >= 1000000) {
    return `${(eth / 1000000).toFixed(2)}M ETH`
  }
  if (eth >= 1000) {
    return `${(eth / 1000).toFixed(2)}K ETH`
  }
  return `${eth.toFixed(2)} ETH`
}

/**
 * Parse ETH string to wei
 * @example parseEthToWei("1.5") => 1500000000000000000n
 */
export function parseEthToWei(eth: string): bigint {
  try {
    return parseEther(eth)
  } catch {
    return 0n
  }
}

// ============================================================================
// Address Formatters
// ============================================================================

/**
 * Truncate Ethereum address for display
 * @example formatAddress("0x1234567890123456789012345678901234567890") => "0x1234...7890"
 */
export function formatAddress(
  address: Address | string | undefined,
  startLength: number = 6,
  endLength: number = 4
): string {
  if (!address) return '0x0000...0000'

  if (address.length < startLength + endLength) {
    return address
  }

  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`
}

/**
 * Check if address is zero address
 */
export function isZeroAddress(address: Address | string | undefined): boolean {
  return !address || address === '0x0000000000000000000000000000000000000000'
}

/**
 * Format address with ENS support (placeholder for future ENS integration)
 */
export function formatAddressWithENS(address: Address | string | undefined): string {
  // TODO: Add ENS resolution in the future
  return formatAddress(address)
}

// ============================================================================
// Date / Time Formatters
// ============================================================================

/**
 * Format Unix timestamp (bigint) to readable date string
 * @example formatTimestamp(1735603200n) => "Dec 31, 2024"
 */
export function formatTimestamp(timestamp: bigint, includeTime: boolean = false): string {
  const date = new Date(Number(timestamp) * 1000)

  if (includeTime) {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

/**
 * Format deadline as time remaining
 * @example formatDeadline(futureTimestamp) => "2 days 5 hours"
 * @example formatDeadline(pastTimestamp) => "Ended"
 */
export function formatDeadline(deadline: bigint): string {
  const now = Math.floor(Date.now() / 1000)
  const deadlineSeconds = Number(deadline)
  const diff = deadlineSeconds - now

  if (diff <= 0) {
    return 'Ended'
  }

  const days = Math.floor(diff / 86400)
  const hours = Math.floor((diff % 86400) / 3600)
  const minutes = Math.floor((diff % 3600) / 60)

  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ${hours} hour${hours !== 1 ? 's' : ''}`
  }
  if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} min${minutes !== 1 ? 's' : ''}`
  }
  return `${minutes} minute${minutes > 1 ? 's' : ''}`
}

/**
 * Format time remaining with emoji indicator
 * @example formatTimeRemaining(deadline) => "⏰ 2 days 5 hours left"
 */
export function formatTimeRemaining(deadline: bigint): string {
  const remaining = formatDeadline(deadline)

  if (remaining === 'Ended') {
    return '⏱️ Ended'
  }

  return `⏰ ${remaining} left`
}

/**
 * Check if deadline has passed
 */
export function isDeadlinePassed(deadline: bigint): boolean {
  const now = Math.floor(Date.now() / 1000)
  return Number(deadline) <= now
}

/**
 * Get time until deadline in seconds
 */
export function getTimeUntilDeadline(deadline: bigint): number {
  const now = Math.floor(Date.now() / 1000)
  const diff = Number(deadline) - now
  return Math.max(0, diff)
}

// ============================================================================
// Competition State Formatters
// ============================================================================

/**
 * Format CompetitionState enum to readable text
 */
export function formatCompetitionState(state: CompetitionState): string {
  switch (state) {
    case CompetitionState.NOT_STARTED:
      return 'Not Started'
    case CompetitionState.ACTIVE:
      return 'Active'
    case CompetitionState.ENDED:
      return 'Ended'
    case CompetitionState.FINALIZED:
      return 'Finalized'
    case CompetitionState.CANCELLED:
      return 'Cancelled'
    default:
      return 'Unknown'
  }
}

/**
 * Get badge color class for competition state
 */
export function getStateColor(state: CompetitionState): string {
  switch (state) {
    case CompetitionState.NOT_STARTED:
      return 'bg-gray-500'
    case CompetitionState.ACTIVE:
      return 'bg-green-500'
    case CompetitionState.ENDED:
      return 'bg-blue-500'
    case CompetitionState.FINALIZED:
      return 'bg-purple-500'
    case CompetitionState.CANCELLED:
      return 'bg-red-500'
    default:
      return 'bg-gray-500'
  }
}

/**
 * Get emoji for competition state
 */
export function getStateEmoji(state: CompetitionState): string {
  switch (state) {
    case CompetitionState.NOT_STARTED:
      return '⏳'
    case CompetitionState.ACTIVE:
      return '🎮'
    case CompetitionState.ENDED:
      return '🏁'
    case CompetitionState.FINALIZED:
      return '✅'
    case CompetitionState.CANCELLED:
      return '❌'
    default:
      return '❓'
  }
}

// ============================================================================
// Number Formatters
// ============================================================================

/**
 * Format large numbers with comma separators
 * @example formatNumber(1234567) => "1,234,567"
 */
export function formatNumber(num: number | bigint): string {
  return Number(num).toLocaleString('en-US')
}

/**
 * Format number as percentage
 * @example formatPercentage(2500n) => "25.00%"
 * @param bps - Basis points (100 = 1%)
 */
export function formatPercentage(bps: bigint, decimals: number = 2): string {
  const percentage = Number(bps) / 100
  return `${percentage.toFixed(decimals)}%`
}

/**
 * Format compact number (K, M notation)
 * @example formatCompactNumber(1500) => "1.5K"
 */
export function formatCompactNumber(num: number | bigint): string {
  const value = Number(num)

  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`
  }
  return value.toString()
}

// ============================================================================
// Prize / Ticket Formatters
// ============================================================================

/**
 * Format ticket count with label
 * @example formatTicketCount(5) => "5 tickets"
 * @example formatTicketCount(1) => "1 ticket"
 */
export function formatTicketCount(count: number | bigint): string {
  const num = Number(count)
  return `${formatNumber(num)} ticket${num === 1 ? '' : 's'}`
}

/**
 * Format prize pool with indicator
 * @example formatPrizePool(1000000000000000000n) => "🏆 1.00 ETH"
 */
export function formatPrizePool(prizePool: bigint): string {
  return `🏆 ${formatEthWithSuffix(prizePool)}`
}

/**
 * Calculate and format percentage of prize pool
 * @example formatPrizeShare(500000000000000000n, 1000000000000000000n) => "50.00%"
 */
export function formatPrizeShare(amount: bigint, total: bigint): string {
  if (total === 0n) return '0.00%'
  const percentage = (Number(amount) / Number(total)) * 100
  return `${percentage.toFixed(2)}%`
}

// ============================================================================
// Validation Helpers
// ============================================================================

/**
 * Check if value is a valid ETH amount
 */
export function isValidEthAmount(value: string): boolean {
  try {
    const amount = parseEther(value)
    return amount >= 0n
  } catch {
    return false
  }
}

/**
 * Check if value is a valid address
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

// ============================================================================
// Export All
// ============================================================================

export default {
  // ETH formatters
  formatWeiToEth,
  formatEthWithSuffix,
  formatCompactEth,
  parseEthToWei,

  // Address formatters
  formatAddress,
  isZeroAddress,
  formatAddressWithENS,

  // Date/Time formatters
  formatTimestamp,
  formatDeadline,
  formatTimeRemaining,
  isDeadlinePassed,
  getTimeUntilDeadline,

  // State formatters
  formatCompetitionState,
  getStateColor,
  getStateEmoji,

  // Number formatters
  formatNumber,
  formatPercentage,
  formatCompactNumber,

  // Prize/Ticket formatters
  formatTicketCount,
  formatPrizePool,
  formatPrizeShare,

  // Validation
  isValidEthAmount,
  isValidAddress,
}
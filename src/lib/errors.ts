/**
 * @title Contract Error Parser
 * @dev Parse contract revert errors into user-friendly messages
 * @notice Following KISS principles - clear, helpful error messages
 */

// ============================================================================
// Error Message Maps
// ============================================================================

/**
 * CardCompetition contract error messages
 */
const CARD_COMPETITION_ERRORS: Record<string, string> = {
  // Competition state errors
  CompetitionNotActive: 'This competition is not active.',
  CompetitionEnded: 'This competition has ended.',
  CompetitionNotStarted: 'This competition has not started yet.',
  CompetitionCancelled: 'This competition has been cancelled.',
  EmergencyPaused: 'This competition is paused due to an emergency.',
  CompetitionNotEnded: 'This competition has not ended yet.',

  // Ticket purchase errors
  AlreadyHasTicket: 'You already own a ticket for this competition.',
  InsufficientPayment: 'You must send the exact ticket price.',
  InvalidCompetitionId: 'Invalid competition ID.',
  NoTickets: 'No tickets available.',

  // Winner declaration errors
  NoTicket: 'You need a ticket to declare yourself as winner.',
  NotWinner: 'You are not the winner of this competition.',
  WinnerAlreadyDeclared: 'Winner has already been declared for this competition.',
  ProofAlreadyUsed: 'This proof has already been used.',
  InvalidProof: 'Invalid proof. Please check your signature.',
  InvalidSignature: 'Invalid signature. Please try again.',
  DeadlineNotReached: 'Competition deadline has not been reached yet.',

  // Prize claim errors
  NoPrizeAvailable: 'No prize available to claim.',
  PrizeNotCalculated: 'Prize has not been calculated yet. Please wait.',
  NotInGracePeriod: 'Grace period has not ended yet.',
  AlreadyClaimed: 'You have already claimed your prize.',
  NoBalance: 'No balance available to withdraw.',

  // Refund errors
  RefundNotAvailable: 'Refund is not available for this competition.',
  RefundAlreadyClaimed: 'You have already claimed your refund.',
  CompetitionNotCancelled: 'Competition must be cancelled to claim refund.',

  // Admin/Owner errors
  OwnableUnauthorizedAccount: 'Only the contract owner can perform this action.',
  InvalidTreasuryPercent: 'Treasury percentage must be between min and max.',
  InvalidDeadline: 'Invalid deadline. Must be in the future.',
  InvalidTicketPrice: 'Invalid ticket price. Must be greater than zero.',
  InvalidVerifier: 'Invalid verifier address.',

  // Booster box errors
  BoosterBoxNotEnabled: 'Booster boxes are not enabled for this competition.',
  BoosterBoxAlreadyClaimed: 'Booster boxes have already been claimed.',
  NoBoosterBoxes: 'No booster boxes available.',

  // Metadata errors
  MetadataNotSet: 'Metadata has not been set for this competition.',
  EmptyName: 'Competition name cannot be empty.',
  EmptyDescription: 'Competition description cannot be empty.',
}

/**
 * Common Web3 errors
 */
const WEB3_ERRORS: Record<string, string> = {
  // User actions
  'user rejected': 'You rejected the transaction in your wallet.',
  'user denied': 'You rejected the transaction in your wallet.',
  'user cancelled': 'You cancelled the transaction.',

  // Balance/Gas errors
  'insufficient funds': 'Insufficient balance to complete this transaction.',
  'insufficient balance': 'Insufficient balance to complete this transaction.',
  'gas required exceeds allowance': 'Transaction would cost too much gas. Please try again.',
  'max fee per gas less than block base fee':
    'Gas price too low. Please increase gas price and try again.',

  // Network errors
  'network error': 'Network error. Please check your connection and try again.',
  'timeout': 'Transaction timed out. Please try again.',
  'nonce too low': 'Transaction nonce error. Please try again.',
  'replacement transaction underpriced': 'Gas price too low to replace transaction.',

  // Contract errors
  'execution reverted': 'Transaction reverted. Please check the requirements and try again.',
  'invalid opcode': 'Contract execution error. Please contact support.',
  'out of gas': 'Transaction ran out of gas. Please increase gas limit.',
}

// ============================================================================
// Error Parser Functions
// ============================================================================

/**
 * Parse contract error into user-friendly message
 */
export function parseContractError(error: unknown): string {
  // Handle null/undefined
  if (!error) {
    return 'An unknown error occurred. Please try again.'
  }

  // Convert to string for parsing
  const errorString = error instanceof Error ? error.message : String(error)
  const errorLower = errorString.toLowerCase()

  // 1. Check for specific contract errors
  for (const [key, message] of Object.entries(CARD_COMPETITION_ERRORS)) {
    if (errorString.includes(key) || errorLower.includes(key.toLowerCase())) {
      return message
    }
  }

  // 2. Check for common Web3 errors
  for (const [key, message] of Object.entries(WEB3_ERRORS)) {
    if (errorLower.includes(key)) {
      return message
    }
  }

  // 3. Try to extract revert reason
  const revertReason = extractRevertReason(errorString)
  if (revertReason) {
    // Check if revert reason matches our known errors
    for (const [key, message] of Object.entries(CARD_COMPETITION_ERRORS)) {
      if (revertReason.includes(key)) {
        return message
      }
    }
    // Return the revert reason if it's readable
    if (revertReason.length < 100 && !revertReason.includes('0x')) {
      return `Transaction failed: ${revertReason}`
    }
  }

  // 4. Default fallback message
  return 'Transaction failed. Please try again or contact support if the issue persists.'
}

/**
 * Extract revert reason from error message
 */
function extractRevertReason(error: string): string | null {
  // Try various revert reason patterns
  const patterns = [
    /reverted with reason string '([^']+)'/,
    /reverted with reason "([^"]+)"/,
    /reverted: ([^\n]+)/,
    /execution reverted: ([^\n]+)/,
    /Error: ([^\n]+)/,
  ]

  for (const pattern of patterns) {
    const match = error.match(pattern)
    if (match && match[1]) {
      return match[1].trim()
    }
  }

  return null
}

// ============================================================================
// Error Type Checkers
// ============================================================================

/**
 * Check if error is user rejection
 */
export function isUserRejection(error: unknown): boolean {
  const errorString = String(error).toLowerCase()
  return (
    errorString.includes('user rejected') ||
    errorString.includes('user denied') ||
    errorString.includes('user cancelled')
  )
}

/**
 * Check if error is insufficient balance
 */
export function isInsufficientBalance(error: unknown): boolean {
  const errorString = String(error).toLowerCase()
  return errorString.includes('insufficient funds') || errorString.includes('insufficient balance')
}

/**
 * Check if error is network related
 */
export function isNetworkError(error: unknown): boolean {
  const errorString = String(error).toLowerCase()
  return errorString.includes('network error') || errorString.includes('timeout')
}

/**
 * Check if error is contract revert
 */
export function isContractRevert(error: unknown): boolean {
  const errorString = String(error).toLowerCase()
  return errorString.includes('execution reverted') || errorString.includes('reverted with reason')
}

// ============================================================================
// Error Severity
// ============================================================================

export enum ErrorSeverity {
  INFO = 'info', // User action (e.g., rejection)
  WARNING = 'warning', // Recoverable error
  ERROR = 'error', // Contract error
  CRITICAL = 'critical', // System error
}

/**
 * Get error severity level
 */
export function getErrorSeverity(error: unknown): ErrorSeverity {
  if (isUserRejection(error)) {
    return ErrorSeverity.INFO
  }

  if (isInsufficientBalance(error)) {
    return ErrorSeverity.WARNING
  }

  if (isContractRevert(error)) {
    return ErrorSeverity.ERROR
  }

  if (isNetworkError(error)) {
    return ErrorSeverity.CRITICAL
  }

  return ErrorSeverity.ERROR
}

// ============================================================================
// Error Logging
// ============================================================================

/**
 * Log error for debugging (console only in development)
 */
export function logError(error: unknown, context?: string): void {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[Error${context ? ` - ${context}` : ''}]:`, error)
  }
}

/**
 * Parse and log error
 */
export function parseAndLogError(error: unknown, context?: string): string {
  logError(error, context)
  return parseContractError(error)
}

// ============================================================================
// Export All
// ============================================================================

export default {
  parseContractError,
  isUserRejection,
  isInsufficientBalance,
  isNetworkError,
  isContractRevert,
  getErrorSeverity,
  logError,
  parseAndLogError,
  ErrorSeverity,
}
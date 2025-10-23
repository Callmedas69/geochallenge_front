/**
 * @title Transaction Error Parser
 * @notice Converts technical blockchain/wallet errors into user-friendly messages
 * @dev KISS principle: Simple string matching, no complex parsing
 * @dev Professional best practice: Industry-standard error handling patterns
 */

/**
 * Parses blockchain/wallet errors and returns user-friendly messages
 * @param error - Error object from transaction or undefined/null
 * @returns User-friendly error message string
 */
export function parseTransactionError(
  error: Error | null | undefined
): string {
  if (!error) return "Transaction failed";

  const message = error.message.toLowerCase();

  // User rejection (most common - check first)
  // Handles: MetaMask, Coinbase Wallet, WalletConnect, Rainbow
  if (
    message.includes("user rejected") ||
    message.includes("user denied") ||
    message.includes("user cancelled") ||
    message.includes("user canceled") ||
    message.includes("rejected the request") ||
    message.includes("user disapproved") ||
    message.includes("request rejected")
  ) {
    return "You cancelled the transaction";
  }

  // Insufficient funds
  if (
    message.includes("insufficient funds") ||
    message.includes("insufficient balance") ||
    message.includes("insufficient eth")
  ) {
    return "Insufficient ETH balance for this transaction";
  }

  // Gas estimation failed
  if (
    message.includes("gas required exceeds") ||
    message.includes("execution reverted") ||
    message.includes("transaction may fail") ||
    message.includes("cannot estimate gas")
  ) {
    return "Transaction may fail. Check your balance and try again.";
  }

  // Network/RPC errors
  if (
    message.includes("network") ||
    message.includes("rpc") ||
    message.includes("timeout") ||
    message.includes("fetch failed") ||
    message.includes("failed to fetch")
  ) {
    return "Network error. Please check your connection and try again.";
  }

  // Contract-specific errors - Competition related
  if (message.includes("already owns ticket")) {
    return "You already own a ticket for this competition";
  }

  if (message.includes("not eligible")) {
    return "You are not eligible for this action";
  }

  if (message.includes("competition not active")) {
    return "This competition is not currently active";
  }

  if (message.includes("already claimed")) {
    return "You have already claimed this prize";
  }

  // Nonce errors (transaction ordering issues)
  if (message.includes("nonce") || message.includes("replacement")) {
    return "Transaction conflict. Please try again.";
  }

  // Generic revert without specific message
  if (message.includes("revert")) {
    return "Transaction rejected by contract. Please check requirements.";
  }

  // Default fallback - generic message
  // Avoid showing technical details to end users
  return "Transaction failed. Please try again.";
}

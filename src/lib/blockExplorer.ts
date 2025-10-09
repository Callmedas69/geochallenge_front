/**
 * @title Block Explorer Utilities
 * @notice KISS principle - simple block explorer URL helpers
 * @dev Returns correct block explorer URL based on chain ID
 */

/**
 * Get block explorer URL for transaction
 */
export function getBlockExplorerTxUrl(chainId: number, txHash: string): string {
  const explorers: Record<number, string> = {
    1: "https://etherscan.io/tx/",
    8453: "https://basescan.org/tx/", // Base Mainnet
    84532: "https://sepolia.basescan.org/tx/", // Base Sepolia
  };

  const baseUrl = explorers[chainId] || explorers[84532]; // Default to Base Sepolia
  return `${baseUrl}${txHash}`;
}

/**
 * Get block explorer name
 */
export function getBlockExplorerName(chainId: number): string {
  const names: Record<number, string> = {
    1: "Etherscan",
    8453: "BaseScan",
    84532: "BaseScan",
  };

  return names[chainId] || "BaseScan";
}

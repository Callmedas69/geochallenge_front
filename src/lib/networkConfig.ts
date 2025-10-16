/**
 * @title Network Configuration
 * @notice Dynamic network switching between Base Mainnet and Base Sepolia
 * @dev KISS principle: Simple config, easy to understand and maintain
 */

import { base, baseSepolia } from 'wagmi/chains'
import { CONTRACT_ADDRESSES } from './contractList'

// ============================================================================
// Network Configuration
// ============================================================================

export const SUPPORTED_NETWORKS = {
  mainnet: {
    id: 8453,
    chain: base,
    name: 'Base Mainnet',
    shortName: 'Base',
    rpcUrl: 'https://mainnet.base.org',
    explorerUrl: 'https://basescan.org',
    addresses: CONTRACT_ADDRESSES.baseMainnet,
  },
  testnet: {
    id: 84532,
    chain: baseSepolia,
    name: 'Base Sepolia',
    shortName: 'Base Sepolia',
    rpcUrl: 'https://sepolia.base.org',
    explorerUrl: 'https://sepolia.basescan.org',
    addresses: CONTRACT_ADDRESSES.baseSepolia,
  },
} as const

export type NetworkType = keyof typeof SUPPORTED_NETWORKS
export type NetworkConfig = typeof SUPPORTED_NETWORKS[NetworkType]

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get network config by chain ID
 */
export function getNetworkByChainId(chainId: number | undefined): NetworkConfig {
  if (chainId === 8453) {
    return SUPPORTED_NETWORKS.mainnet
  }
  // Default to testnet
  return SUPPORTED_NETWORKS.testnet
}

/**
 * Check if chain ID is supported
 */
export function isSupportedNetwork(chainId: number | undefined): boolean {
  return chainId === 8453 || chainId === 84532
}

/**
 * Get all supported chains for Wagmi config
 */
export function getSupportedChains() {
  return [SUPPORTED_NETWORKS.mainnet.chain, SUPPORTED_NETWORKS.testnet.chain] as const
}

/**
 * Get block explorer URL for transaction
 */
export function getExplorerTxUrl(chainId: number | undefined, txHash: string): string {
  const network = getNetworkByChainId(chainId)
  return `${network.explorerUrl}/tx/${txHash}`
}

/**
 * Get block explorer URL for address
 */
export function getExplorerAddressUrl(chainId: number | undefined, address: string): string {
  const network = getNetworkByChainId(chainId)
  return `${network.explorerUrl}/address/${address}`
}

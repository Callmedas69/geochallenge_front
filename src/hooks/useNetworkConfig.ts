/**
 * @title Network Configuration Hooks
 * @notice React hooks for dynamic network and contract address selection
 * @dev KISS principle: Simple hooks, auto-detect network from wallet
 */

'use client'

import { useChainId } from 'wagmi'
import { getNetworkByChainId, type NetworkConfig } from '@/lib/networkConfig'
import type { ContractName } from '@/lib/contractList'

/**
 * Get current network configuration based on connected wallet
 * Automatically detects chain and returns correct config
 */
export function useNetworkConfig(): NetworkConfig {
  const chainId = useChainId()
  return getNetworkByChainId(chainId)
}

/**
 * Get contract addresses for current network
 * This is the main hook to use throughout the app
 *
 * @example
 * const addresses = useContractAddresses()
 * const { data } = useReadContract({
 *   address: addresses.GeoChallenge,
 *   abi: geoChallenge_implementation_ABI,
 *   functionName: 'getCompetition',
 * })
 */
export function useContractAddresses() {
  const network = useNetworkConfig()
  return network.addresses
}

/**
 * Get a specific contract address for current network
 *
 * @example
 * const geoChallengeAddress = useContractAddress('GeoChallenge')
 */
export function useContractAddress(contractName: ContractName) {
  const addresses = useContractAddresses()
  return addresses[contractName]
}

/**
 * Check if user is on the correct network
 * Useful for showing "switch network" warnings
 */
export function useIsCorrectNetwork(): boolean {
  const chainId = useChainId()
  // Both networks are valid
  return chainId === 8453 || chainId === 84532
}

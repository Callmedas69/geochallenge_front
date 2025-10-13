/**
 * Farcaster Wallet Integration
 * Uses EIP-1193 Ethereum Provider from Farcaster SDK
 *
 * NOTE: Farcaster connector is added directly in wagmi.ts
 * This file contains utility functions for working with Farcaster wallets
 */
import { type Config } from 'wagmi';

/**
 * Check if wallet is connected via Farcaster
 * @param config - Wagmi configuration
 * @returns true if connected via Farcaster Mini App
 *
 * @example
 * ```tsx
 * import { useConfig } from 'wagmi';
 * import { isFarcasterWallet } from '@/lib/farcaster';
 *
 * const config = useConfig();
 * if (isFarcasterWallet(config)) {
 *   console.log('User is in Farcaster miniApp');
 * }
 * ```
 */
export function isFarcasterWallet(config: Config): boolean {
  return config.connectors.some(c => c.name === 'Farcaster Mini App');
}

/**
 * Type definition for batch transaction calls (EIP-5792)
 * Allows multiple transactions in one confirmation
 *
 * @example
 * ```tsx
 * import { useSendCalls } from 'wagmi';
 * import type { BatchCall } from '@/lib/farcaster';
 *
 * const calls: BatchCall[] = [
 *   { to: tokenContract, data: approveData },
 *   { to: competitionContract, data: buyTicketData, value: ticketPrice }
 * ];
 *
 * await sendCalls({ calls });
 * ```
 */
export interface BatchCall {
  to: `0x${string}`;
  data?: `0x${string}`;
  value?: bigint;
}

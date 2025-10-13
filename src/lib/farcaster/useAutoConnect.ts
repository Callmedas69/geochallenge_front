/**
 * @title useAutoConnect Hook
 * @notice Reusable hook for Farcaster wallet auto-connect
 * @dev Use this in any Farcaster page that needs wallet connection
 */

import { useEffect } from 'react';
import { useAccount, useConnect } from 'wagmi';
import { initFarcasterSDK } from './sdk';

/**
 * Auto-connect Farcaster wallet
 * Initializes SDK and connects wallet if in Farcaster context
 *
 * @example
 * ```tsx
 * export default function FarcasterPage() {
 *   useAutoConnect(); // Just add this line!
 *   const { address } = useAccount();
 *   // ... rest of component
 * }
 * ```
 */
export function useAutoConnect() {
  const { isConnected } = useAccount();
  const { connect, connectors } = useConnect();

  useEffect(() => {
    // Initialize Farcaster SDK
    initFarcasterSDK();

    // Auto-connect wallet if not already connected
    if (!isConnected && connectors.length > 0) {
      // Find Farcaster connector
      const farcasterConnector = connectors.find(
        (c) => c.name === "Farcaster Mini App"
      );

      if (farcasterConnector) {
        connect({ connector: farcasterConnector });
      }
    }
  }, [isConnected, connect, connectors]);
}

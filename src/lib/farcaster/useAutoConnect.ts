/**
 * @title useAutoConnect Hook
 * @notice Reusable hook for Farcaster wallet auto-connect
 * @dev Use this in any Farcaster page that needs wallet connection
 */

import { useEffect, useState } from 'react';
import { useAccount, useConnect } from 'wagmi';
import { initFarcasterSDK } from './sdk';

/**
 * Clear manual disconnect flag
 * Call this when user wants to manually reconnect
 * @example clearDisconnectFlag();
 */
export function clearDisconnectFlag() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('fc_manual_disconnect');
  }
}

/**
 * Auto-connect Farcaster wallet
 * Initializes SDK and connects wallet if in Farcaster context
 * Respects user's manual disconnect choice
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
  const { isConnected, connector } = useAccount();
  const { connect, connectors } = useConnect();
  const [hasAttemptedConnect, setHasAttemptedConnect] = useState(false);

  useEffect(() => {
    // Initialize Farcaster SDK
    initFarcasterSDK();

    // Check if user manually disconnected (from CompactWalletButton)
    // Respect user's logout choice - don't auto-reconnect
    const hasManuallyDisconnected =
      typeof window !== 'undefined' &&
      localStorage.getItem('fc_manual_disconnect') === 'true';

    if (hasManuallyDisconnected) {
      return; // Skip auto-connect if user logged out
    }

    // Find Farcaster connector
    const farcasterConnector = connectors.find(
      (c) => c.name === "Farcaster Mini App"
    );

    if (!farcasterConnector || hasAttemptedConnect) {
      return;
    }

    // Connect to Farcaster if:
    // 1. Not connected at all
    // 2. OR connected but not via Farcaster (e.g. web session)
    const shouldConnect = !isConnected || connector?.name !== "Farcaster Mini App";

    if (shouldConnect) {
      connect({ connector: farcasterConnector });
      setHasAttemptedConnect(true);
    }
  }, [isConnected, connector, connect, connectors, hasAttemptedConnect]);
}

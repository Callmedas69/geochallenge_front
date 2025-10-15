/**
 * Farcaster SDK initialization and utilities
 */
import { sdk } from '@farcaster/miniapp-sdk';

/**
 * CRITICAL: SDK ready delay
 * User experienced "Not Ready" status when this was too low
 * DO NOT reduce below 100ms - ensures DOM is fully painted
 */
export const SDK_READY_DELAY = 100; // ms

/**
 * Initialize Farcaster SDK with proper timing
 * IMPORTANT: Must be called AFTER content renders to avoid "Not Ready" status
 */
export async function initFarcasterSDK(): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(async () => {
      try {
        await sdk.actions.ready();
        console.log('✅ Farcaster SDK: Ready');
        resolve(true);
      } catch (error) {
        console.warn('⚠️ Farcaster SDK: Not in miniApp context', error);
        resolve(false);
      }
    }, SDK_READY_DELAY);
  });
}

export function isFarcasterContext(): boolean {
  // Check if running in Farcaster miniApp
  return typeof window !== 'undefined' && window.location.pathname.startsWith('/miniapps');
}

// Additional SDK helper functions...

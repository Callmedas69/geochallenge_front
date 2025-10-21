/**
 * @title Farcaster Quick Auth Helper
 * @notice Simple wrapper for Farcaster authentication using Quick Auth
 * @dev KISS principle: One simple function, wraps any async action
 * @dev Professional best practice: Defense-in-depth security layer
 *
 * Security: Quick Auth uses Sign-in with Farcaster (SIWF) to generate
 * cryptographically signed JWT that proves user identity. Backend can
 * verify this JWT to ensure requests come from real Farcaster users.
 *
 * @see https://miniapps.farcaster.xyz/docs/sdk/quick-auth
 */

import { sdk } from '@farcaster/miniapp-sdk';

/**
 * Quick Auth Result
 * Returned by Farcaster SDK after successful authentication
 */
export interface QuickAuthResult {
  token: string;      // JWT signed by Farcaster (verify server-side)
  fid: number;        // User's Farcaster ID
  custody: string;    // User's custody wallet address
  username?: string;  // User's Farcaster username
}

/**
 * Wrapper options for Quick Auth
 */
interface QuickAuthOptions {
  /**
   * Is authentication required?
   * - true: Throw error if Quick Auth fails
   * - false: Continue even if auth fails (backward compatible)
   */
  required?: boolean;

  /**
   * Silent mode - suppress console logs
   */
  silent?: boolean;
}

/**
 * Get Quick Auth token from Farcaster SDK
 * Internal helper - use withQuickAuth() wrapper instead
 */
async function getQuickAuthToken(): Promise<QuickAuthResult | null> {
  try {
    // Only works in Farcaster miniApp context
    if (typeof window === 'undefined') {
      return null;
    }

    // Get authenticated token from Farcaster
    const authResult = await sdk.quickAuth.getToken();

    return {
      token: authResult.token,
      fid: authResult.fid,
      custody: authResult.custody,
      username: authResult.username,
    };
  } catch (error) {
    console.warn('⚠️ Quick Auth failed:', error);
    return null;
  }
}

/**
 * Wrap any async action with Farcaster Quick Auth
 * Adds authentication layer without changing existing code
 *
 * @example
 * ```typescript
 * // Before (no auth):
 * await claimPrize(competitionId);
 *
 * // After (with auth):
 * await withQuickAuth(() => claimPrize(competitionId));
 *
 * // Required auth (throws if fails):
 * await withQuickAuth(
 *   () => submitProof(data),
 *   { required: true }
 * );
 * ```
 *
 * @param action - Async function to execute
 * @param options - Auth options
 * @returns Result of the action
 * @throws Error if required=true and auth fails
 */
export async function withQuickAuth<T>(
  action: () => Promise<T>,
  options: QuickAuthOptions = {}
): Promise<T> {
  const { required = false, silent = false } = options;

  // Attempt Quick Auth
  const authResult = await getQuickAuthToken();

  if (authResult) {
    // Auth successful - store token for API calls
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('fc_auth_token', authResult.token);
      sessionStorage.setItem('fc_auth_fid', authResult.fid.toString());
      sessionStorage.setItem('fc_auth_custody', authResult.custody);
    }

    if (!silent) {
      console.log('✅ Authenticated as FID:', authResult.fid);
    }
  } else if (required) {
    // Auth failed and it's required
    throw new Error('Farcaster authentication required but failed');
  } else {
    // Auth failed but not required - continue anyway
    if (!silent) {
      console.warn('⚠️ Quick Auth not available, continuing without auth');
    }
  }

  // Execute the wrapped action
  return action();
}

/**
 * Get stored auth token from sessionStorage
 * Use this in API calls to send auth token to backend
 *
 * @example
 * ```typescript
 * const token = getAuthToken();
 * await fetch('/api/claim-prize', {
 *   headers: {
 *     'Authorization': `Bearer ${token}`
 *   }
 * });
 * ```
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem('fc_auth_token');
}

/**
 * Get stored user FID from sessionStorage
 */
export function getAuthFid(): number | null {
  if (typeof window === 'undefined') return null;
  const fid = sessionStorage.getItem('fc_auth_fid');
  return fid ? parseInt(fid, 10) : null;
}

/**
 * Get stored custody wallet from sessionStorage
 */
export function getAuthCustody(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem('fc_auth_custody');
}

/**
 * Clear stored auth data
 * Call this on logout or when auth expires
 */
export function clearAuthData(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem('fc_auth_token');
  sessionStorage.removeItem('fc_auth_fid');
  sessionStorage.removeItem('fc_auth_custody');
}

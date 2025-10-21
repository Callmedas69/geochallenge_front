/**
 * @title Farcaster Quick Auth Verification (Backend)
 * @notice Server-side JWT verification for Farcaster Quick Auth tokens
 * @dev KISS principle: Simple verification using official Farcaster SDK
 * @dev Professional best practice: Cryptographic verification of user identity
 *
 * Security: Verifies JWT signed by Farcaster's Quick Auth server
 * Prevents context spoofing and ensures requests come from real Farcaster users
 *
 * @see https://miniapps.farcaster.xyz/docs/sdk/quick-auth
 *
 * IMPORTANT: Uses official @farcaster/quick-auth package
 * Run: npm install @farcaster/quick-auth
 */

import { createClient, Errors } from '@farcaster/quick-auth';

/**
 * Verified Quick Auth payload
 * Extracted from JWT after successful verification
 */
export interface VerifiedAuth {
  fid: number;          // User's Farcaster ID (from JWT 'sub' field)
  custody: string;      // User's custody wallet address
  username?: string;    // User's Farcaster username (optional)
  isValid: boolean;     // Whether verification succeeded
}

/**
 * Extract domain from URL or return domain as-is
 * Handles both full URLs (https://example.com) and domains (example.com)
 *
 * @param urlOrDomain - Full URL or domain string
 * @returns Domain string without protocol/port/path, or undefined
 */
function extractDomain(urlOrDomain?: string): string | undefined {
  if (!urlOrDomain) return undefined;

  try {
    // Try parsing as URL
    const url = new URL(urlOrDomain);
    return url.hostname;
  } catch {
    // Already a domain (no protocol), return as-is
    return urlOrDomain;
  }
}

/**
 * SECURE: Verify Quick Auth JWT token using official Farcaster SDK
 * ✅ Cryptographically verifies token is signed by Farcaster
 * ✅ Checks expiration
 * ✅ Validates issuer and audience
 *
 * @param token - JWT token from Quick Auth
 * @param domain - Your app's domain (for audience verification)
 * @returns Verified auth data, or null if verification fails
 *
 * @example
 * ```typescript
 * // In API route:
 * const token = request.headers.get('Authorization')?.replace('Bearer ', '');
 * const auth = await verifyQuickAuthToken(token, 'yourapp.com');
 *
 * if (!auth || !auth.isValid) {
 *   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
 * }
 *
 * // Now you KNOW this is really FID {auth.fid}
 * console.log('Verified user FID:', auth.fid);
 * ```
 */
export async function verifyQuickAuthToken(
  token: string | null,
  domain?: string
): Promise<VerifiedAuth | null> {
  if (!token) return null;

  try {
    // Create official Farcaster Quick Auth client
    const client = createClient();

    // Extract and validate domain if provided, use empty string as default
    // (Quick Auth SDK requires domain parameter, but accepts empty string when not validating audience)
    const validatedDomain = extractDomain(domain) || '';

    // Verify JWT using official SDK
    // This cryptographically verifies the token against Farcaster's JWKS
    const payload = await client.verifyJwt({
      token,
      domain: validatedDomain
    });

    // Extract verified data from payload
    // Note: custody and username are custom claims added by Farcaster Quick Auth
    return {
      fid: payload.sub,
      custody: (payload as any).custody || '',
      username: (payload as any).username,
      isValid: true,
    };
  } catch (error: any) {
    // Handle invalid token errors (expired, malformed, wrong signature, etc.)
    if (error instanceof Errors.InvalidTokenError) {
      console.error('[SECURITY] Invalid Quick Auth token:', error.message);
      return null;
    }

    // Re-throw unexpected errors (network issues, etc.)
    console.error('[QUICK_AUTH] Unexpected verification error:', error);
    throw error;
  }
}

/**
 * Helper: Get auth token from request headers
 * Extracts Bearer token from Authorization header
 *
 * @param request - Next.js request object
 * @returns Auth token or null
 */
export function getAuthTokenFromRequest(request: { headers: { get: (name: string) => string | null } }): string | null {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) return null;

  const match = authHeader.match(/^Bearer (.+)$/);
  return match ? match[1] : null;
}

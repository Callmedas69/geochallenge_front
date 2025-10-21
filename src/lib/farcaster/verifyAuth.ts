/**
 * @title Farcaster Quick Auth Verification (Backend)
 * @notice Server-side JWT verification for Farcaster Quick Auth tokens
 * @dev KISS principle: Simple verification, secure by default
 * @dev Professional best practice: Cryptographic verification of user identity
 *
 * Security: Verifies JWT signed by Farcaster's Quick Auth server
 * Prevents context spoofing and ensures requests come from real Farcaster users
 *
 * @see https://miniapps.farcaster.xyz/docs/sdk/quick-auth
 *
 * IMPORTANT: Requires `jose` package for JWT verification
 * Run: npm install jose
 */

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
 * SIMPLE VERSION: Extract auth data from token (WITHOUT verification)
 * ⚠️ WARNING: This trusts the client! Only use for logging/audit trail
 * ⚠️ For production security, use verifyQuickAuthToken() instead
 *
 * @param token - JWT token from Quick Auth
 * @returns Auth data (unverified)
 */
export function extractAuthData(token: string | null): VerifiedAuth | null {
  if (!token) return null;

  try {
    // Decode JWT (without verification - NOT SECURE!)
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = JSON.parse(
      Buffer.from(parts[1], 'base64url').toString('utf-8')
    );

    return {
      fid: parseInt(payload.sub || '0', 10),
      custody: payload.custody || '',
      username: payload.username,
      isValid: false, // Mark as unverified
    };
  } catch (error) {
    console.error('Failed to extract auth data:', error);
    return null;
  }
}

/**
 * SECURE VERSION: Verify Quick Auth JWT token (RECOMMENDED)
 * ✅ Cryptographically verifies token is signed by Farcaster
 * ✅ Checks expiration
 * ✅ Validates issuer and audience
 *
 * NOTE: Requires `jose` package
 * Install with: npm install jose
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
    // Try to import jose (might not be installed yet)
    const { jwtVerify, createRemoteJWKSet } = await import('jose');

    // Farcaster's Quick Auth JWKS endpoint
    const JWKS_URL = 'https://auth.farcaster.xyz/.well-known/jwks.json';

    // Create JWKS fetcher
    const JWKS = createRemoteJWKSet(new URL(JWKS_URL));

    // Verify JWT
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: 'https://auth.farcaster.xyz',
      audience: domain || undefined,
    });

    // Extract verified data
    return {
      fid: parseInt(payload.sub || '0', 10),
      custody: (payload as any).custody || '',
      username: (payload as any).username,
      isValid: true,
    };
  } catch (error: any) {
    // If jose is not installed, fallback to extraction (with warning)
    if (error.code === 'MODULE_NOT_FOUND' || error.message?.includes('jose')) {
      console.warn('⚠️ jose package not installed - using unverified extraction');
      console.warn('⚠️ Install with: npm install jose');
      return extractAuthData(token);
    }

    // JWT verification failed
    console.error('JWT verification failed:', error);
    return null;
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

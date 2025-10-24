/**
 * @title Supabase API Security Utilities
 * @notice Reusable security functions for admin routes
 * @dev Follows existing API security patterns (KISS principle)
 * @security Based on api/vibe/holdings and api/proof/submit-completion patterns
 */

import { verifyMessage, type Address, createPublicClient, http } from 'viem';
import { base, baseSepolia } from 'viem/chains';
import { geoChallenge_implementation_ABI } from '@/abi';
import { CONTRACT_ADDRESSES, CURRENT_NETWORK } from '@/lib/contractList';

// ============================================================================
// Rate Limiting (In-Memory Map - KISS Principle)
// ============================================================================

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

/**
 * Checks if request has exceeded rate limit
 * @param ip - Client IP address
 * @param maxRequests - Maximum requests allowed
 * @param windowMs - Time window in milliseconds
 * @returns True if within limit, false if exceeded
 */
export function checkRateLimit(
  ip: string,
  maxRequests: number,
  windowMs: number
): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  // Clean up expired entries
  if (entry && entry.resetAt < now) {
    rateLimitMap.delete(ip);
  }

  const current = rateLimitMap.get(ip);

  if (!current) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (current.count >= maxRequests) {
    return false; // Rate limit exceeded
  }

  current.count++;
  return true;
}

// ============================================================================
// Input Validation
// ============================================================================

/**
 * Validates Ethereum address format (0x + 40 hex chars)
 * @param address - Address to validate
 * @returns True if valid Ethereum address
 */
export function isValidEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validates competition ID
 * @param id - Competition ID to validate
 * @returns Validated BigInt or null if invalid
 */
export function validateCompetitionId(id: any): bigint | null {
  try {
    const parsed = BigInt(id);
    if (parsed <= BigInt(0)) return null;
    return parsed;
  } catch {
    return null;
  }
}

/**
 * Validates priority value (0-999)
 * @param priority - Priority value to validate
 * @returns Clamped priority value
 */
export function validatePriority(priority: number): number {
  return Math.max(0, Math.min(999, priority));
}

// ============================================================================
// Admin Verification (Following proof API pattern)
// ============================================================================

/**
 * Verifies admin wallet signature and ownership
 * @param walletAddress - Wallet address claiming admin rights
 * @param signature - Signed message
 * @param message - Original message that was signed
 * @returns Verification result with reason
 */
export async function verifyAdmin(
  walletAddress: string,
  signature: string,
  message: string
): Promise<{ isValid: boolean; reason: string }> {
  // Step 1: Validate address format
  if (!isValidEthereumAddress(walletAddress)) {
    return { isValid: false, reason: 'Invalid wallet address format' };
  }

  // Step 2: Verify signature
  try {
    const isValidSignature = await verifyMessage({
      address: walletAddress as Address,
      message,
      signature: signature as `0x${string}`,
    });

    if (!isValidSignature) {
      return { isValid: false, reason: 'Invalid wallet signature' };
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    return { isValid: false, reason: `Signature verification failed: ${errorMsg}` };
  }

  // Step 3: Verify is contract owner (on-chain check)
  try {
    const chain = CURRENT_NETWORK.chainId === 8453 ? base : baseSepolia;
    const publicClient = createPublicClient({
      chain,
      transport: http(CURRENT_NETWORK.rpcUrl),
    });

    const ownerAddress = await publicClient.readContract({
      address: CONTRACT_ADDRESSES.GeoChallenge,
      abi: geoChallenge_implementation_ABI,
      functionName: 'owner',
    }) as Address;

    if (walletAddress.toLowerCase() !== ownerAddress.toLowerCase()) {
      return {
        isValid: false,
        reason: `Not contract owner (owner: ${ownerAddress})`
      };
    }

    return { isValid: true, reason: 'Admin verified' };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    return { isValid: false, reason: `Owner verification failed: ${errorMsg}` };
  }
}

/**
 * Verifies competition exists on-chain
 * @param competitionId - Competition ID to verify
 * @returns True if exists, false otherwise
 */
export async function verifyCompetitionExists(
  competitionId: bigint
): Promise<{ exists: boolean; reason: string }> {
  try {
    const chain = CURRENT_NETWORK.chainId === 8453 ? base : baseSepolia;
    const publicClient = createPublicClient({
      chain,
      transport: http(CURRENT_NETWORK.rpcUrl),
    });

    const competition = await publicClient.readContract({
      address: CONTRACT_ADDRESSES.GeoChallenge,
      abi: geoChallenge_implementation_ABI,
      functionName: 'getCompetition',
      args: [competitionId],
    });

    if (!competition) {
      return { exists: false, reason: 'Competition not found' };
    }

    return { exists: true, reason: 'Competition exists' };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    return { exists: false, reason: `Verification failed: ${errorMsg}` };
  }
}

// ============================================================================
// Audit Logging (Following existing API patterns)
// ============================================================================

/**
 * Logs security-relevant events
 * @param component - Component name (e.g., 'FEATURED_API')
 * @param action - Action performed
 * @param data - Relevant data (competition ID, wallet, etc.)
 * @param success - Whether action succeeded
 * @param reason - Event reason/error message
 */
export function auditLog(
  component: string,
  action: string,
  data: Record<string, any>,
  success: boolean,
  reason: string
) {
  const timestamp = new Date().toISOString();
  const status = success ? 'SUCCESS' : 'BLOCKED';

  // Format similar to existing APIs
  console.log(
    `[${component}] ${timestamp} | ${status} | ` +
    `Action: ${action} | ` +
    `Data: ${JSON.stringify(data)} | ` +
    `${reason}`
  );
}

// ============================================================================
// IP Extraction (Following existing API patterns)
// ============================================================================

/**
 * Extracts client IP from request headers
 * @param request - Next.js request object
 * @returns Client IP address or 'unknown'
 */
export function getClientIP(request: Request): string {
  const headers = new Headers(request.headers);

  // Try x-forwarded-for first (most common)
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  // Try x-real-ip
  const realIp = headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }

  return 'unknown';
}

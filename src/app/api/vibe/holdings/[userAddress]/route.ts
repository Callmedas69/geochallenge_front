/**
 * @title Vibe Holdings API - SECURE
 * @notice Proxies user NFT holdings from VibeMarket API with security validation
 * @dev KISS principle: Input validation, rate limiting, safe URL construction
 * @security Validates addresses, limits parameters, prevents injection attacks
 */

import { NextRequest, NextResponse } from 'next/server';

const VIBE_API_BASE = 'https://build.wield.xyz/vibe/boosterbox';
const API_KEY = process.env.VIBE_API_KEY || 'DEMO_REPLACE_WITH_FREE_API_KEY';

// --- Input Validation ---

/**
 * Validates Ethereum address format (0x + 40 hex chars)
 * @param address - Address to validate
 * @returns True if valid Ethereum address
 */
function isValidEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validates and clamps numeric parameter
 * @param value - String value from query param
 * @param defaultValue - Default if invalid
 * @param min - Minimum allowed value
 * @param max - Maximum allowed value
 * @returns Validated number
 */
function validateNumericParam(
  value: string | null,
  defaultValue: number,
  min: number,
  max: number
): number {
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) return defaultValue;
  return Math.max(min, Math.min(max, parsed));
}

/**
 * Validates status parameter (only allow known values)
 * @param status - Status value from query param
 * @returns Validated status or default
 */
function validateStatus(status: string | null): string {
  const allowedStatuses = ['rarity_assigned', 'pending', 'claimed', 'all'];
  if (!status) return 'rarity_assigned';
  return allowedStatuses.includes(status) ? status : 'rarity_assigned';
}

/**
 * Validates rarity parameter (1-5 only)
 * @param rarity - Rarity value from query param
 * @returns Validated rarity or null
 */
function validateRarity(rarity: string | null): number | null {
  if (!rarity) return null;
  const parsed = parseInt(rarity, 10);
  if (isNaN(parsed) || parsed < 1 || parsed > 5) return null;
  return parsed;
}

// --- Rate Limiting (KISS - In-memory Map) ---

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 30; // 30 requests per minute

/**
 * Checks if IP has exceeded rate limit
 * @param ip - Client IP address
 * @returns True if within limit, false if exceeded
 */
function checkRateLimit(ip: string): boolean {
  const now = Date.now();

  // Clean up expired entries
  const entry = rateLimitMap.get(ip);
  if (entry && entry.resetAt < now) {
    rateLimitMap.delete(ip);
  }

  const current = rateLimitMap.get(ip);
  if (!current) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (current.count >= RATE_LIMIT_MAX) {
    return false;
  }

  current.count++;
  return true;
}

// --- Audit Logging ---

/**
 * Logs security-relevant events
 * @param userAddress - User wallet address
 * @param ip - Client IP
 * @param success - Whether request succeeded
 * @param reason - Event reason/error
 */
function auditLog(
  userAddress: string,
  ip: string,
  success: boolean,
  reason: string
) {
  const timestamp = new Date().toISOString();
  const status = success ? 'SUCCESS' : 'BLOCKED';
  console.log(
    `[HOLDINGS_API_AUDIT] ${timestamp} | ${status} | IP: ${ip} | ` +
    `Address: ${userAddress} | ${reason}`
  );
}

// --- API Route Handler ---

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userAddress: string }> }
) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
             request.headers.get('x-real-ip') ||
             'unknown';

  try {
    // Step 1: Rate Limiting
    if (!checkRateLimit(ip)) {
      auditLog('N/A', ip, false, 'Rate limit exceeded (30 req/min)');
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    // Step 2: Parse and validate userAddress from route param
    const { userAddress } = await params;

    if (!isValidEthereumAddress(userAddress)) {
      auditLog(userAddress, ip, false, 'Invalid user address format');
      return NextResponse.json(
        { error: 'Invalid Ethereum address format' },
        { status: 400 }
      );
    }

    // Step 3: Parse and validate query parameters
    const { searchParams } = new URL(request.url);
    const contractAddress = searchParams.get('contractAddress');

    // Validate contractAddress (required)
    if (!contractAddress) {
      auditLog(userAddress, ip, false, 'Missing contractAddress parameter');
      return NextResponse.json(
        { error: 'contractAddress is required' },
        { status: 400 }
      );
    }

    if (!isValidEthereumAddress(contractAddress)) {
      auditLog(userAddress, ip, false, 'Invalid contract address format');
      return NextResponse.json(
        { error: 'Invalid contract address format' },
        { status: 400 }
      );
    }

    // Validate and limit numeric parameters
    const page = validateNumericParam(searchParams.get('page'), 1, 1, 100);
    const limit = validateNumericParam(searchParams.get('limit'), 50, 1, 200);
    const chainId = validateNumericParam(searchParams.get('chainId'), 8453, 1, 999999);

    // Validate status and rarity
    const status = validateStatus(searchParams.get('status'));
    const rarity = validateRarity(searchParams.get('rarity'));

    // Step 4: Build safe URL using URLSearchParams (prevents injection)
    const vibeParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      includeMetadata: 'true',
      contractAddress,
      chainId: chainId.toString(),
      status,
    });

    // Add optional rarity parameter
    if (rarity !== null) {
      vibeParams.append('rarity', rarity.toString());
    }

    const url = `${VIBE_API_BASE}/owner/${userAddress}?${vibeParams.toString()}`;

    // Step 5: Fetch from VibeMarket API
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'API-KEY': API_KEY,
      },
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      auditLog(
        userAddress,
        ip,
        false,
        `Vibe API error: ${response.status} - ${errorText.slice(0, 100)}`
      );
      throw new Error(`Vibe API error: ${response.status}`);
    }

    const data = await response.json();

    // Step 6: Success - return data
    auditLog(
      userAddress,
      ip,
      true,
      `Holdings fetched: ${data.boxes?.length || 0} items`
    );

    return NextResponse.json(data);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Holdings API] Error:', errorMessage);

    auditLog('unknown', ip, false, `Unhandled error: ${errorMessage}`);

    return NextResponse.json(
      {
        error: 'Failed to fetch user holdings',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}

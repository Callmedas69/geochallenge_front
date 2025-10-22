/**
 * @title Vibe Range API - SECURE
 * @notice Proxies boosterbox range data from VibeMarket API with security validation
 * @dev KISS principle: Fetches multiple tokenIds in one request
 * @security Validates tokenIds, address format, prevents injection attacks
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
 * Validates tokenIds format (comma-separated numbers)
 * @param tokenIds - Token IDs string
 * @returns Array of valid token IDs or null if invalid
 */
function validateTokenIds(tokenIds: string | null): string[] | null {
  if (!tokenIds) return null;

  const ids = tokenIds.split(',').map(id => id.trim());

  // Limit to 100 tokenIds max (prevent abuse)
  if (ids.length > 100) return null;

  // Validate each ID is a number
  for (const id of ids) {
    if (!/^\d+$/.test(id)) return null;
  }

  return ids;
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
 * @param tokenIds - Token IDs requested
 * @param ip - Client IP
 * @param success - Whether request succeeded
 * @param reason - Event reason/error
 */
function auditLog(
  tokenIds: string,
  ip: string,
  success: boolean,
  reason: string
) {
  const timestamp = new Date().toISOString();
  const status = success ? 'SUCCESS' : 'BLOCKED';
  console.log(
    `[RANGE_API_AUDIT] ${timestamp} | ${status} | IP: ${ip} | ` +
    `TokenIds: ${tokenIds} | ${reason}`
  );
}

// --- API Route Handler ---

export async function GET(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
             request.headers.get('x-real-ip') ||
             'unknown';

  try {
    // Step 0: Validate API key is configured
    if (!process.env.VIBE_API_KEY || API_KEY.includes('DEMO')) {
      console.error('[SECURITY] VIBE_API_KEY not configured - using demo key');
      auditLog('N/A', ip, false, 'API key not configured');
      return NextResponse.json(
        { error: 'API configuration error. Please set VIBE_API_KEY environment variable.' },
        { status: 503 }
      );
    }

    // Step 1: Rate Limiting
    if (!checkRateLimit(ip)) {
      auditLog('N/A', ip, false, 'Rate limit exceeded (30 req/min)');
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    // Step 2: Parse and validate query parameters
    const { searchParams } = new URL(request.url);
    const tokenIdsParam = searchParams.get('tokenIds');
    const contractAddress = searchParams.get('contractAddress');

    // Validate required parameters exist
    if (!tokenIdsParam || !contractAddress) {
      auditLog('N/A', ip, false, 'Missing required parameters');
      return NextResponse.json(
        { error: 'Missing required parameters: tokenIds and contractAddress' },
        { status: 400 }
      );
    }

    // Validate tokenIds format
    const tokenIds = validateTokenIds(tokenIdsParam);
    if (!tokenIds) {
      auditLog(tokenIdsParam, ip, false, 'Invalid tokenIds format');
      return NextResponse.json(
        { error: 'Invalid tokenIds format (comma-separated numbers, max 100)' },
        { status: 400 }
      );
    }

    // Validate contract address format
    if (!isValidEthereumAddress(contractAddress)) {
      auditLog(tokenIdsParam, ip, false, 'Invalid contract address format');
      return NextResponse.json(
        { error: 'Invalid contract address format' },
        { status: 400 }
      );
    }

    // Step 3: Build safe URL using URLSearchParams (prevents injection)
    const vibeParams = new URLSearchParams({
      tokenIds: tokenIds.join(','),
      contractAddress,
      page: '1',
      limit: '100',
    });

    const url = `${VIBE_API_BASE}/range?${vibeParams.toString()}`;

    // Step 4: Fetch from VibeMarket API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'API-KEY': API_KEY,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      auditLog(
        tokenIdsParam,
        ip,
        false,
        `Vibe API error: ${response.status} - ${errorText.slice(0, 100)}`
      );
      throw new Error('Failed to fetch range data from Vibe API');
    }

    const data = await response.json();

    // Step 5: Success - return data
    auditLog(
      tokenIdsParam,
      ip,
      true,
      `Range data fetched successfully (${data.boxes?.length || 0} boxes)`
    );

    return NextResponse.json(data);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Range API] Error:', errorMessage);

    auditLog('unknown', ip, false, `Unhandled error: ${errorMessage}`);

    return NextResponse.json(
      {
        error: 'Failed to fetch range data',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}

/**
 * @title New Competition Notification Trigger API
 * @notice API endpoint to send push notifications when new competition is created
 * @dev KISS principle: Simple trigger, fetches data from contract (source of truth)
 * @security Public endpoint but validates competition exists on-chain
 */

import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient, http } from 'viem';
import { base, baseSepolia } from 'viem/chains';
import { geoChallenge_implementation_ABI } from '@/abi';
import { CONTRACT_ADDRESSES, CURRENT_NETWORK } from '@/lib/contractList';
import { notifyNewCompetition } from '@/lib/farcaster/notification/triggers/newCompetition';

// ============================================================================
// Configuration
// ============================================================================

const chain = CURRENT_NETWORK.chainId === 8453 ? base : baseSepolia;

// Simple in-memory rate limiting (KISS - no Redis needed)
interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 10; // 10 requests per minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  // Clean up old entries
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

function getClientIP(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

// ============================================================================
// POST /api/farcaster/notification/trigger/new-competition
// ============================================================================

export async function POST(request: NextRequest) {
  const ip = getClientIP(request);

  try {
    // ========================================================================
    // Rate Limiting
    // ========================================================================
    if (!checkRateLimit(ip)) {
      console.warn(`[NewCompetitionTrigger] Rate limit exceeded for IP: ${ip}`);
      return NextResponse.json(
        { error: 'Rate limit exceeded. Max 10 requests per minute.' },
        { status: 429 }
      );
    }

    // ========================================================================
    // Parse Request
    // ========================================================================
    const body = await request.json();
    const { competitionId } = body;

    if (!competitionId) {
      return NextResponse.json(
        { error: 'Missing competitionId' },
        { status: 400 }
      );
    }

    // Validate competition ID format
    const compIdBigInt = BigInt(competitionId);
    if (compIdBigInt <= 0) {
      return NextResponse.json(
        { error: 'Invalid competition ID (must be positive number)' },
        { status: 400 }
      );
    }

    // ========================================================================
    // Fetch Competition Name from Contract (On-Chain = Source of Truth)
    // ========================================================================
    const publicClient = createPublicClient({
      chain,
      transport: http(),
    });

    let competitionName: string;
    try {
      competitionName = (await publicClient.readContract({
        address: CONTRACT_ADDRESSES.GeoChallenge,
        abi: geoChallenge_implementation_ABI,
        functionName: 'getCompetitionName',
        args: [compIdBigInt],
      })) as string;

      // Verify competition exists (empty name = doesn't exist)
      if (!competitionName || competitionName.trim() === '') {
        console.warn(`[NewCompetitionTrigger] Competition #${competitionId} not found on-chain`);
        return NextResponse.json(
          { error: 'Competition does not exist on-chain' },
          { status: 404 }
        );
      }
    } catch (error) {
      console.error(`[NewCompetitionTrigger] Failed to fetch competition name:`, error);
      return NextResponse.json(
        { error: 'Failed to fetch competition data from contract' },
        { status: 500 }
      );
    }

    // ========================================================================
    // Send Notification
    // ========================================================================
    console.log(`[NewCompetitionTrigger] Sending notification for: ${competitionName} (#${competitionId})`);

    const result = await notifyNewCompetition({
      id: competitionId.toString(),
      name: competitionName,
    });

    if (!result.success) {
      console.error(`[NewCompetitionTrigger] Notification failed:`, result);
      return NextResponse.json(
        {
          error: 'Failed to send notifications',
          details: result
        },
        { status: 500 }
      );
    }

    console.log(`[NewCompetitionTrigger] ✅ Notification sent to ${result.sent} users`);

    return NextResponse.json({
      success: true,
      competitionId,
      competitionName,
      notificationsSent: result.sent,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[NewCompetitionTrigger] Unhandled error:', errorMessage);

    return NextResponse.json(
      {
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      },
      { status: 500 }
    );
  }
}

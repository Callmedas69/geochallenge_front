/**
 * @title GET Featured Competitions API (PUBLIC)
 * @notice Returns list of featured competition IDs for homepage display
 * @dev KISS principle: Simple read operation with caching
 * @security Public route with rate limiting and input validation
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { checkRateLimit, auditLog, getClientIP } from '@/lib/supabase/security';

// Rate limiting configuration (public route)
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 100; // 100 requests per minute per IP

// ============================================================================
// GET /api/supabase/featured
// ============================================================================

export async function GET(request: NextRequest) {
  const ip = getClientIP(request);

  try {
    // Step 1: Rate Limiting
    if (!checkRateLimit(ip, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW)) {
      auditLog(
        'FEATURED_API',
        'GET',
        { ip },
        false,
        'Rate limit exceeded (100 req/min)'
      );

      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        {
          status: 429,
          headers: {
            'Retry-After': '60'
          }
        }
      );
    }

    // Step 2: Query featured competitions from Supabase
    const { data, error } = await supabase
      .from('featured_competitions')
      .select('competition_id, priority, featured_at')
      .order('priority', { ascending: true })
      .limit(10); // Max 10 featured competitions

    if (error) {
      auditLog(
        'FEATURED_API',
        'GET',
        { ip },
        false,
        `Supabase query error: ${error.message}`
      );

      return NextResponse.json(
        { error: 'Failed to fetch featured competitions' },
        { status: 500 }
      );
    }

    // Step 3: Extract competition IDs (frontend will fetch full data from on-chain)
    // @ts-ignore - Supabase client type inference issue
    const competitionIds = (data || []).map(item => item.competition_id);

    // Step 4: Success - return IDs
    auditLog(
      'FEATURED_API',
      'GET',
      { ip, count: competitionIds.length },
      true,
      `Featured competitions fetched: ${competitionIds.length} items`
    );

    return NextResponse.json(
      {
        success: true,
        data: competitionIds,
        count: competitionIds.length,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
        },
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    auditLog(
      'FEATURED_API',
      'GET',
      { ip },
      false,
      `Unhandled error: ${errorMessage}`
    );

    return NextResponse.json(
      {
        error: 'Failed to fetch featured competitions',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}

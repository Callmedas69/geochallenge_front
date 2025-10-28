/**
 * @title GET Competition Participant Stats (The Graph Protocol)
 * @notice Returns participant count from The Graph subgraph with caching
 * @dev Replaced RPC chunking with fast GraphQL queries
 * @security Rate limiting, input validation, audit logging
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { checkRateLimit, auditLog, getClientIP } from '@/lib/supabase/security';
import { validateCompetitionId } from '@/lib/stats/validation';
import { queryGraph } from '@/lib/graphql/client';
import {
  GET_COMPETITION_STATS,
  GetCompetitionStatsResponse,
} from '@/lib/graphql/queries';
import type { Database } from '@/lib/supabase/types';

type StatsCache = Database['public']['Tables']['competition_stats_cache']['Row'];

// ============================================================================
// Configuration
// ============================================================================

// Cache freshness thresholds
const FRESH_THRESHOLD = 10 * 60 * 1000; // 10 minutes
const STALE_THRESHOLD = 60 * 60 * 1000; // 60 minutes

// Rate limiting (public route)
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 30; // 30 requests per minute per IP

// ============================================================================
// GET /api/stats/participants?competitionId=X
// ============================================================================

export async function GET(request: NextRequest) {
  // SECURITY: Get client IP for rate limiting
  const ip = getClientIP(request);

  // ==========================================================================
  // Step 1: Rate Limiting
  // ==========================================================================
  if (!checkRateLimit(ip, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW)) {
    auditLog('STATS_API', 'GET', { ip }, false, 'Rate limit exceeded');
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please try again later.' },
      { status: 429, headers: { 'Retry-After': '60' } }
    );
  }

  // ==========================================================================
  // Step 2: Input Validation
  // ==========================================================================
  const competitionIdParam = request.nextUrl.searchParams.get('competitionId');
  const validation = validateCompetitionId(competitionIdParam);

  if (!validation.valid) {
    auditLog(
      'STATS_API',
      'GET',
      { ip, competitionId: competitionIdParam },
      false,
      validation.error!
    );
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const competitionId = validation.value!;

  try {
    // ========================================================================
    // Step 3: Check cache
    // ========================================================================
    const { data: cached, error: cacheError } = await supabaseAdmin
      .from('competition_stats_cache')
      .select('*')
      .eq('competition_id', competitionId)
      .single() as { data: StatsCache | null; error: any };

    // ========================================================================
    // Step 4: Determine cache freshness
    // ========================================================================
    const now = Date.now();
    const cacheAge = cached
      ? now - new Date(cached.last_updated).getTime()
      : Infinity;

    const isFresh = cacheAge < FRESH_THRESHOLD;
    const isStale = cacheAge >= FRESH_THRESHOLD && cacheAge < STALE_THRESHOLD;
    const isExpired = cacheAge >= STALE_THRESHOLD;

    // ========================================================================
    // Step 5: Return fresh cache immediately
    // ========================================================================
    if (isFresh && cached) {
      auditLog(
        'STATS_API',
        'GET',
        { ip, competitionId, cacheAge: Math.round(cacheAge / 1000) },
        true,
        'Fresh cache hit'
      );

      return NextResponse.json({
        success: true,
        data: {
          competitionId: cached.competition_id,
          totalParticipants: cached.total_participants,
          lastUpdated: cached.last_updated,
          cacheStatus: 'fresh',
          source: 'cache',
        },
      });
    }

    // ========================================================================
    // Step 6: Stale cache - return + refresh in background
    // ========================================================================
    if (isStale && cached) {
      auditLog(
        'STATS_API',
        'GET',
        { ip, competitionId, cacheAge: Math.round(cacheAge / 1000) },
        true,
        'Stale cache - triggering background refresh'
      );

      // SECURITY: Trigger background refresh with internal auth
      fetch(
        `${request.nextUrl.origin}/api/stats/refresh?competitionId=${competitionId}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.INTERNAL_API_SECRET}`,
          },
        }
      ).catch(() => {
        // Silent fail - background refresh is non-critical
        console.error(`[Stats API] Background refresh trigger failed for competition ${competitionId}`);
      });

      return NextResponse.json({
        success: true,
        data: {
          competitionId: cached.competition_id,
          totalParticipants: cached.total_participants,
          lastUpdated: cached.last_updated,
          cacheStatus: 'stale',
          source: 'cache',
        },
      });
    }

    // ========================================================================
    // Step 7: Expired or missing cache - query The Graph
    // ========================================================================
    auditLog(
      'STATS_API',
      'GET',
      { ip, competitionId },
      true,
      'Cache expired or missing - querying The Graph'
    );

    console.log(`[Stats API] Querying The Graph for competition ${competitionId}`);

    // Query The Graph subgraph
    const graphData = await queryGraph<GetCompetitionStatsResponse>(
      GET_COMPETITION_STATS,
      { competitionId: competitionId.toString() }
    );

    // Handle case where competition doesn't exist in subgraph yet
    if (!graphData.competition) {
      console.log(`[Stats API] Competition ${competitionId} not found in subgraph (no purchases yet or still syncing)`);

      // Return empty stats but cache it to prevent repeated queries
      const emptyStats = {
        competition_id: competitionId,
        total_participants: 0,
        last_updated: new Date().toISOString(),
        last_refreshed_by: 'the_graph',
      };

      // Cache the empty result
      await (supabaseAdmin.from('competition_stats_cache') as any)
        .upsert(emptyStats)
        .select()
        .single();

      return NextResponse.json({
        success: true,
        data: {
          competitionId,
          totalParticipants: 0,
          highestProgress: 0,
          lastUpdated: emptyStats.last_updated,
          cacheStatus: 'refreshed',
          source: 'the_graph',
        },
      });
    }

    // Parse The Graph response
    const participantCount = parseInt(graphData.competition.participantCount, 10);

    console.log(`[Stats API] The Graph returned ${participantCount} participants for competition ${competitionId}`);

    // ========================================================================
    // Step 8: Update cache with The Graph data
    // ========================================================================
    const { data: updated, error: upsertError } = await (supabaseAdmin
      .from('competition_stats_cache') as any)
      .upsert({
        competition_id: competitionId,
        total_participants: participantCount,
        last_updated: new Date().toISOString(),
        last_refreshed_by: 'the_graph',
      })
      .select()
      .single() as { data: StatsCache | null; error: any };

    if (upsertError || !updated) {
      console.error(`[Stats API] Cache update failed:`, upsertError);
      // Don't throw - return The Graph data even if cache fails
    }

    return NextResponse.json({
      success: true,
      data: {
        competitionId,
        totalParticipants: participantCount,
        highestProgress: 0,
        lastUpdated: updated?.last_updated || new Date().toISOString(),
        cacheStatus: 'refreshed',
        source: 'the_graph',
      },
    });
  } catch (error) {
    console.error('[Stats API] Error:', error);
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    auditLog('STATS_API', 'GET', { ip, competitionId }, false, errorMsg);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch competition stats',
        // SECURITY: Don't expose error details in production
        details: process.env.NODE_ENV === 'development' ? errorMsg : undefined,
      },
      { status: 500 }
    );
  }
}

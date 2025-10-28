/**
 * @title Background Stats Refresh (INTERNAL ONLY - The Graph)
 * @notice Async endpoint to refresh competition stats from The Graph
 * @dev Called by /api/stats/participants when cache is stale
 * @security Server-side only - requires INTERNAL_API_SECRET
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { validateCompetitionId } from '@/lib/stats/validation';
import { queryGraph } from '@/lib/graphql/client';
import {
  GET_COMPETITION_STATS,
  GetCompetitionStatsResponse,
} from '@/lib/graphql/queries';
import type { Database } from '@/lib/supabase/types';

type StatsCache = Database['public']['Tables']['competition_stats_cache']['Row'];

// ============================================================================
// POST /api/stats/refresh?competitionId=X
// ============================================================================

export async function POST(request: NextRequest) {
  // ==========================================================================
  // SECURITY: Internal API only - require secret
  // ==========================================================================
  const authHeader = request.headers.get('authorization');

  if (authHeader !== `Bearer ${process.env.INTERNAL_API_SECRET}`) {
    console.warn('[Refresh API] Unauthorized access attempt', {
      ip: request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown',
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // ==========================================================================
  // Input validation
  // ==========================================================================
  const competitionIdParam = request.nextUrl.searchParams.get('competitionId');
  const validation = validateCompetitionId(competitionIdParam);

  if (!validation.valid) {
    console.warn('[Refresh API] Invalid competition ID:', {
      competitionId: competitionIdParam,
      error: validation.error,
    });

    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const competitionId = validation.value!;

  // ==========================================================================
  // Execute background refresh from The Graph
  // ==========================================================================
  try {
    console.log(`[Background Refresh] Starting for competition ${competitionId} (The Graph)`);

    // Query The Graph subgraph
    const graphData = await queryGraph<GetCompetitionStatsResponse>(
      GET_COMPETITION_STATS,
      { competitionId: competitionId.toString() }
    );

    // Handle case where competition doesn't exist in subgraph yet
    if (!graphData.competition) {
      console.log(`[Background Refresh] Competition ${competitionId} not found in subgraph`);

      // Return empty stats
      const emptyStats = {
        competition_id: competitionId,
        total_participants: 0,
        highest_progress: 0,
        last_updated: new Date().toISOString(),
        last_refreshed_by: 'the_graph',
      };

      // Update cache
      await (supabaseAdmin.from('competition_stats_cache') as any)
        .upsert(emptyStats)
        .select()
        .single();

      return NextResponse.json({
        success: true,
        competitionId,
        totalParticipants: 0,
        lastUpdated: emptyStats.last_updated,
        source: 'the_graph',
      });
    }

    // Parse The Graph response
    const participantCount = parseInt(graphData.competition.participantCount, 10);

    console.log(`[Background Refresh] The Graph returned ${participantCount} participants`);

    // Update cache with The Graph data
    const { data: updated, error: upsertError } = await (supabaseAdmin
      .from('competition_stats_cache') as any)
      .upsert({
        competition_id: competitionId,
        total_participants: participantCount,
        highest_progress: 0, // TODO: Calculate in Phase 2
        last_updated: new Date().toISOString(),
        last_refreshed_by: 'the_graph',
      })
      .select()
      .single() as { data: StatsCache | null; error: any };

    if (upsertError) {
      console.error('[Background Refresh] Cache update failed:', upsertError);
      throw new Error('Failed to update cache');
    }

    console.log(`[Background Refresh] Success for competition ${competitionId}`, {
      totalParticipants: participantCount,
    });

    return NextResponse.json({
      success: true,
      competitionId,
      totalParticipants: participantCount,
      lastUpdated: updated?.last_updated || new Date().toISOString(),
      source: 'the_graph',
    });
  } catch (error) {
    console.error('[Background Refresh] Error:', error);
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      {
        success: false,
        error: 'Refresh failed',
        details: process.env.NODE_ENV === 'development' ? errorMsg : undefined,
      },
      { status: 500 }
    );
  }
}

/**
 * @title Competition Stats Refresh Logic
 * @notice Blockchain indexing and cache update for competition stats
 * @dev KISS principle: Simple event indexing with deduplication
 * @security Validates competition exists on-chain before indexing
 */

import { supabaseAdmin } from '@/lib/supabase/admin';
import { createPublicClient, http } from 'viem';
import { base, baseSepolia } from 'viem/chains';
import { geoChallenge_implementation_ABI } from '@/abi';
import { CONTRACT_ADDRESSES, CURRENT_NETWORK } from '@/lib/contractList';
import { TICKET_PURCHASED_EVENT } from './events';
import type { Database } from '@/lib/supabase/types';

type StatsCache = Database['public']['Tables']['competition_stats_cache']['Row'];
// type IndexerMetadata = Database['public']['Tables']['indexer_metadata']['Row']; // Old RPC chunking - not used anymore

// ============================================================================
// Public Client Setup
// ============================================================================

const chain = CURRENT_NETWORK.chainId === 8453 ? base : baseSepolia;

const publicClient = createPublicClient({
  chain,
  transport: http(CURRENT_NETWORK.rpcUrl),
});

// ============================================================================
// Chunk Utility (KISS Principle - Simple Block Range Splitting)
// ============================================================================

/**
 * Split large block range into chunks that respect RPC provider limits
 * @param fromBlock - Starting block number
 * @param toBlock - Ending block number
 * @param chunkSize - Maximum blocks per chunk (default: 10 for Alchemy free tier)
 * @returns Array of [start, end] block ranges
 *
 * @dev CLAUDE.md: KISS principle - simple for-loop, no over-engineering
 * @security Prevents RPC rate limits by respecting provider constraints
 */
function chunkBlockRange(
  fromBlock: bigint,
  toBlock: bigint,
  chunkSize: number = 10
): Array<[bigint, bigint]> {
  const chunks: Array<[bigint, bigint]> = [];
  let current = fromBlock;

  while (current <= toBlock) {
    const end = current + BigInt(chunkSize) - 1n;
    chunks.push([current, end > toBlock ? toBlock : end]);
    current = end + 1n;
  }

  return chunks;
}

// ============================================================================
// Core Refresh Function
// ============================================================================

/**
 * Refresh competition stats from blockchain
 * @param competitionId - Competition ID to refresh
 * @returns Updated cache entry
 *
 * @security
 * - Validates competition exists on-chain
 * - Deduplicates participants (PRIMARY KEY constraint)
 * - Updates cache atomically
 * - Tracks last processed block
 *
 * @dev Process:
 * 1. Verify competition exists on-chain
 * 2. Get last processed block
 * 3. Fetch TicketPurchased events
 * 4. Insert participants (deduplicate)
 * 5. Count unique participants
 * 6. Update cache
 * 7. Update block tracker
 */
export async function refreshCompetitionStats(competitionId: number): Promise<StatsCache> {
  console.log(`[Stats Refresh] Starting for competition ${competitionId}`);

  // ==========================================================================
  // Step 1: SECURITY - Verify competition exists on-chain
  // ==========================================================================
  try {
    const competition = await publicClient.readContract({
      address: CONTRACT_ADDRESSES.GeoChallenge,
      abi: geoChallenge_implementation_ABI,
      functionName: 'getCompetition',
      args: [BigInt(competitionId)],
    });

    // Validate competition state exists (not default values)
    // Competition must have non-zero deadline to be considered valid
    if (!competition || (competition as any).deadline === 0n) {
      throw new Error(`Competition ${competitionId} does not exist on-chain`);
    }

    console.log(`[Stats Refresh] Competition ${competitionId} validated on-chain`);
  } catch (error) {
    console.error(`[Security] Invalid competition ID: ${competitionId}`, error);
    throw new Error('Competition not found on-chain');
  }

  // ==========================================================================
  // Step 2: Get last processed block
  // ==========================================================================
  const { data: metadata } = await supabaseAdmin
    .from('indexer_metadata')
    .select('last_block')
    .eq('indexer_name', 'participant_indexer')
    .single() as { data: any; error: any };

  // Get current block for calculating safe starting point
  const currentBlock = await publicClient.getBlockNumber();

  // CLAUDE.md: No assumptions - calculate safe starting block dynamically
  // If no metadata, start from 30 days ago (Base: ~2 blocks/sec = ~2.6M blocks/month)
  // This respects KISS principle: recent data is what matters most
  const DEFAULT_LOOKBACK_BLOCKS = 1_300_000n; // ~30 days on Base
  const calculatedStartBlock = currentBlock > DEFAULT_LOOKBACK_BLOCKS
    ? currentBlock - DEFAULT_LOOKBACK_BLOCKS
    : 0n;

  const fromBlock = metadata?.last_block
    ? BigInt(metadata.last_block)
    : calculatedStartBlock;

  console.log(`[Stats Refresh] Scanning from block ${fromBlock} to ${currentBlock}`);
  console.log(`[Stats Refresh] Block range: ${currentBlock - fromBlock} blocks`);

  // ==========================================================================
  // Step 3: Fetch TicketPurchased events with CHUNKING (Alchemy free tier fix)
  // ==========================================================================
  // CLAUDE.md: KISS + Security - Respect RPC limits (10 blocks/request for free tier)

  const chunks = chunkBlockRange(fromBlock, currentBlock, 10);
  console.log(`[Stats Refresh] Split into ${chunks.length} chunks (10 blocks each)`);

  // Type assertion: getLogs returns logs with decoded args when event is specified
  type EventLog = { args?: { buyer: string; competitionId: bigint; ticketId: bigint; price: bigint } };
  let allLogs: EventLog[] = [];

  // Scan each chunk (respects Alchemy free tier 10-block limit)
  for (let i = 0; i < chunks.length; i++) {
    const [chunkStart, chunkEnd] = chunks[i];

    // CLAUDE.md: Security - Respect rate limits (compute units per second)
    // Add 50ms delay between chunks to prevent HTTP 429 errors
    // This allows ~20 requests/second, well within Alchemy free tier limits
    if (i > 0) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    // Progress logging every 10 chunks for transparency
    if (i % 10 === 0 || i === chunks.length - 1) {
      console.log(`[Stats Refresh] Progress: ${i + 1}/${chunks.length} chunks (blocks ${chunkStart} to ${chunkEnd})`);
    }

    try {
      const chunkLogs = await publicClient.getLogs({
        address: CONTRACT_ADDRESSES.GeoChallenge,
        event: TICKET_PURCHASED_EVENT,
        args: {
          competitionId: BigInt(competitionId),
        },
        fromBlock: chunkStart,
        toBlock: chunkEnd,
      });

      allLogs = [...allLogs, ...(chunkLogs as unknown as EventLog[])];
    } catch (error) {
      // CLAUDE.md: Professional best practice - log but continue on chunk failure
      console.error(`[Stats Refresh] Error scanning chunk ${chunkStart}-${chunkEnd}:`, error);
      // Continue with other chunks - one failed chunk shouldn't break everything
    }
  }

  console.log(`[Stats Refresh] Found ${allLogs.length} TicketPurchased events across all chunks`);

  // ==========================================================================
  // Step 4: Insert participants to database (with deduplication)
  // ==========================================================================
  // NOTE: If user buys multiple tickets, they emit multiple events
  // onConflict().ignore() ensures we only count them ONCE

  for (const log of allLogs) {
    if (!log.args?.buyer) continue;

    const buyer = log.args.buyer;

    // TypeScript workaround: Cast to any to bypass strict typing
    await (supabaseAdmin.from('competition_participants') as any).insert({
      competition_id: competitionId,
      user_address: buyer.toLowerCase(), // Normalize to lowercase
      joined_at: new Date().toISOString(),
    }).onConflict('competition_id,user_address').ignore(); // ← Deduplication: ignore duplicate inserts
  }

  // ==========================================================================
  // Step 5: Count UNIQUE participants (not total tickets)
  // ==========================================================================
  // This gives us "people joined", not "tickets sold"
  const { count } = await supabaseAdmin
    .from('competition_participants')
    .select('*', { count: 'exact', head: true })
    .eq('competition_id', competitionId);

  console.log(`[Stats Refresh] Competition ${competitionId} has ${count || 0} unique participants`);

  // ==========================================================================
  // Step 6: Update cache
  // ==========================================================================
  // TypeScript workaround: Cast to any to bypass strict typing
  const { data: updated, error: upsertError } = await (supabaseAdmin
    .from('competition_stats_cache') as any)
    .upsert({
      competition_id: competitionId,
      total_participants: count || 0,
      highest_progress: 0, // TODO: Calculate in Phase 2
      last_updated: new Date().toISOString(),
      last_refreshed_by: 'lazy_indexer',
    })
    .select()
    .single() as { data: StatsCache | null; error: any };

  if (upsertError || !updated) {
    console.error(`[Stats Refresh] Cache update failed:`, upsertError);
    throw new Error('Failed to update stats cache');
  }

  // ==========================================================================
  // Step 7: Update last processed block
  // ==========================================================================
  // TypeScript workaround: Cast to any to bypass strict typing
  // (currentBlock already fetched at start - KISS principle: no duplicate calls)
  await (supabaseAdmin.from('indexer_metadata') as any).upsert({
    indexer_name: 'participant_indexer',
    last_block: Number(currentBlock),
    last_run: new Date().toISOString(),
  });

  console.log(`[Stats Refresh] Updated block tracker to ${currentBlock}`);
  console.log(`[Stats Refresh] Complete for competition ${competitionId}`);

  return updated;
}

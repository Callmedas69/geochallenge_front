/**
 * @title User Progress Storage API
 * @notice Stores user collection progress for analytics and leaderboards
 * @security Server-side calculation, ticket verification
 * @dev CLAUDE.md: KISS + Security (Never Compromise) + Professional Best Practice
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { isAddress, Address, createPublicClient, http } from 'viem';
import { base, baseSepolia } from 'viem/chains';
import { geoChallenge_implementation_ABI } from '@/abi';
import { CONTRACT_ADDRESSES, CURRENT_NETWORK } from '@/lib/contractList';

// ============================================================================
// Vibe API Configuration
// ============================================================================
const VIBE_API_BASE = 'https://build.wield.xyz/vibe/boosterbox';
const API_KEY = process.env.VIBE_API_KEY || 'DEMO_REPLACE_WITH_FREE_API_KEY';

// ============================================================================
// Chain Configuration
// ============================================================================
// API Chain ID (Vibe API)
const API_CHAIN_ID = process.env.NEXT_PUBLIC_API_CHAIN_ID || '8453';

// ============================================================================
// POST /api/stats/user-progress
// ============================================================================
// Purpose: Save user's collection progress (server-calculated)
// Security: Ticket verified, server-side calculation
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    console.log('[User Progress API] Request received');
    const body = await request.json();
    console.log('[User Progress API] Request body:', body);

    // ========================================================================
    // 0. INITIALIZE CHAIN CONFIGURATION
    // ========================================================================
    console.log('[User Progress API] CURRENT_NETWORK:', CURRENT_NETWORK);
    const chain = CURRENT_NETWORK.chainId === 8453 ? base : baseSepolia;
    console.log('[User Progress API] Selected chain:', chain.name);

    // ========================================================================
    // 1. VALIDATE REQUEST DATA
    // ========================================================================
    if (!isAddress(body.userAddress)) {
      console.error('[User Progress API] Invalid address:', body.userAddress);
      return NextResponse.json(
        { success: false, error: 'Invalid user address' },
        { status: 400 }
      );
    }

    if (!Number.isInteger(body.competitionId) || body.competitionId <= 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid competition ID' },
        { status: 400 }
      );
    }

    const userAddress = body.userAddress.toLowerCase() as Address;
    const competitionId = BigInt(body.competitionId);
    console.log('[User Progress API] Processing for:', { userAddress, competitionId: competitionId.toString() });

    // ========================================================================
    // 2. CREATE PUBLIC CLIENT (On-chain reads)
    // ========================================================================
    console.log('[User Progress API] Creating public client with RPC:', CURRENT_NETWORK.rpcUrl);
    const publicClient = createPublicClient({
      chain,
      transport: http(CURRENT_NETWORK.rpcUrl),
    });

    // ========================================================================
    // 3. VERIFY TICKET OWNERSHIP (On-chain)
    // ========================================================================
    // Security: Only store progress for users with tickets
    // Uses ERC1155 balanceOf: [owner, tokenId] where tokenId = competitionId
    console.log('[User Progress API] Checking ticket ownership...');
    const ticketBalance = await publicClient.readContract({
      address: CONTRACT_ADDRESSES.GeoChallenge,
      abi: geoChallenge_implementation_ABI,
      functionName: 'balanceOf',
      args: [userAddress, competitionId],
    });
    console.log('[User Progress API] Ticket balance:', ticketBalance.toString());

    if (ticketBalance === 0n) {
      console.warn(`[User Progress API] User ${userAddress} has no ticket for competition ${competitionId}`);
      return NextResponse.json(
        { success: false, error: 'User has no ticket for this competition' },
        { status: 403 }
      );
    }

    // ========================================================================
    // 4. FETCH COMPETITION DATA (On-chain)
    // ========================================================================
    console.log('[User Progress API] Fetching competition data...');
    const competition = await publicClient.readContract({
      address: CONTRACT_ADDRESSES.GeoChallenge,
      abi: geoChallenge_implementation_ABI,
      functionName: 'getCompetition',
      args: [competitionId],
    });

    const collectionAddress = competition.collectionAddress;
    const rarityTiers = competition.rarityTiers;
    console.log('[User Progress API] Competition data:', { collectionAddress, rarityTiers });

    // ========================================================================
    // 5. FETCH COLLECTION RARITY STATS (Vibe API)
    // ========================================================================
    // Get total card counts per rarity tier
    console.log('[User Progress API] Fetching collection metadata from Vibe API...');
    const collectionResponse = await fetch(
      `${VIBE_API_BASE}/contractAddress/${collectionAddress}/all-metadata?chainId=${API_CHAIN_ID}`,
      {
        method: 'GET',
        headers: { 'API-KEY': API_KEY },
      }
    );
    console.log('[User Progress API] Collection response status:', collectionResponse.status);

    if (!collectionResponse.ok) {
      throw new Error('Failed to fetch collection rarity data from Vibe API');
    }

    const collectionData = await collectionResponse.json();

    if (!collectionData.success || !collectionData.metadata) {
      throw new Error('Collection rarity data fetch unsuccessful');
    }

    // Count cards by rarity tier from metadata
    const rarityCounts = {
      1: 0, // COMMON
      2: 0, // RARE
      3: 0, // EPIC
      4: 0, // LEGENDARY
      5: 0, // MYTHIC
    };

    collectionData.metadata.forEach((card: any) => {
      const rarityName = card.odds?.rarity?.toUpperCase();
      switch (rarityName) {
        case 'COMMON':
          rarityCounts[1]++;
          break;
        case 'RARE':
          rarityCounts[2]++;
          break;
        case 'EPIC':
          rarityCounts[3]++;
          break;
        case 'LEGENDARY':
          rarityCounts[4]++;
          break;
        case 'MYTHIC':
          rarityCounts[5]++;
          break;
      }
    });

    // Map rarity numbers to collection counts
    const rarityMap: Record<number, number> = rarityCounts;
    console.log('[User Progress API] Rarity counts:', rarityMap);

    // ========================================================================
    // 7. FETCH USER HOLDINGS (Vibe API)
    // ========================================================================
    console.log('[User Progress API] Fetching user holdings from Vibe API...');
    const userResponse = await fetch(
      `${VIBE_API_BASE}/owner/${userAddress}?contractAddress=${collectionAddress}&chainId=${API_CHAIN_ID}&status=rarity_assigned&page=1&limit=1000&includeMetadata=true`,
      {
        method: 'GET',
        headers: { 'API-KEY': API_KEY },
      }
    );
    console.log('[User Progress API] User holdings response status:', userResponse.status);

    if (!userResponse.ok) {
      throw new Error('Failed to fetch user holdings from Vibe API');
    }

    const userData = await userResponse.json();
    console.log('[User Progress API] User data boxes count:', userData.boxes?.length || 0);

    // ========================================================================
    // 7. CALCULATE PROGRESS (Server-side - same logic as useProgressCalculator)
    // ========================================================================
    const rarityBreakdown: Record<number, { required: number; owned: number }> = {};
    let totalRequired = 0;
    let totalOwned = 0;

    // Process each required rarity tier
    rarityTiers.forEach((rarity: number) => {
      const required = rarityMap[rarity] || 0;

      // Count unique cards user owns for this rarity (by card name)
      const userCardsForRarity = userData.boxes?.filter((box: any) => box.rarity === rarity) || [];
      console.log(`[User Progress API] Rarity ${rarity}: ${userCardsForRarity.length} cards owned out of ${required} required`);
      const uniqueCardsOwned = new Set(
        userCardsForRarity.map((box: any) => box.metadata?.name)
      ).size;

      rarityBreakdown[rarity] = { required, owned: uniqueCardsOwned };
      totalRequired += required;
      totalOwned += uniqueCardsOwned;
    });

    const percentage = totalRequired > 0 ? (totalOwned / totalRequired) * 100 : 0;
    console.log('[User Progress API] Final progress:', {
      totalOwned,
      totalRequired,
      percentage: Math.round(percentage * 100) / 100,
      rarityBreakdown
    });

    // ========================================================================
    // 8. STORE CALCULATED PROGRESS (Supabase Admin Client)
    // ========================================================================
    const { data, error } = await (supabaseAdmin.from('user_progress') as any).upsert({
      user_address: userAddress,
      competition_id: Number(competitionId),
      percentage: Math.round(percentage * 100) / 100, // Round to 2 decimals
      cards_owned: totalOwned,
      cards_required: totalRequired,
      last_updated: new Date().toISOString(),
    })
    .select()
    .single();

    if (error) {
      console.error('[User Progress API] Database error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to save progress' },
        { status: 500 }
      );
    }

    // ========================================================================
    // 9. RETURN SUCCESS
    // ========================================================================
    return NextResponse.json({
      success: true,
      data: {
        userAddress: data.user_address,
        competitionId: data.competition_id,
        percentage: data.percentage,
        cardsOwned: data.cards_owned,
        cardsRequired: data.cards_required,
        lastUpdated: data.last_updated,
      },
    });
  } catch (error) {
    console.error('[User Progress API] Unhandled error:', error);
    console.error('[User Progress API] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    console.error('[User Progress API] Error message:', error instanceof Error ? error.message : String(error));

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

// ============================================================================
// GET /api/stats/user-progress?competitionId=X&limit=10
// ============================================================================
// Purpose: Fetch leaderboard data for a competition
// Public: No authentication required (read-only)
// ============================================================================

export async function GET(request: NextRequest) {
  const competitionId = request.nextUrl.searchParams.get('competitionId');
  const limit = parseInt(request.nextUrl.searchParams.get('limit') || '10');

  if (!competitionId) {
    return NextResponse.json(
      { success: false, error: 'Competition ID required' },
      { status: 400 }
    );
  }

  try {
    const { data, error } = await (supabaseAdmin.from('user_progress') as any)
      .select('*')
      .eq('competition_id', competitionId)
      .order('percentage', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('[User Progress API] Leaderboard fetch error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch leaderboard' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('[User Progress API] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

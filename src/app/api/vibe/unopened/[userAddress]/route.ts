import { NextRequest, NextResponse } from 'next/server';
import { API_CHAIN_ID } from '@/lib/config';

const VIBE_API_BASE = 'https://build.wield.xyz/vibe/boosterbox';
const API_KEY = process.env.VIBE_API_KEY || 'DEMO_REPLACE_WITH_FREE_API_KEY';

/**
 * @title Unopened Packs API Route
 * @notice Fetches unopened booster packs (status=minted, rarity=0) for a user
 * @dev Dedicated endpoint for OpenPacksButton component
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userAddress: string }> }
) {
  try {
    const { userAddress } = await params;
    const { searchParams } = new URL(request.url);

    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '50';
    const contractAddress = searchParams.get('contractAddress');
    const chainId = searchParams.get('chainId') || String(API_CHAIN_ID);

    if (!contractAddress) {
      return NextResponse.json(
        { error: 'contractAddress is required' },
        { status: 400 }
      );
    }

    // Hardcode status=minted to fetch ONLY unopened packs (rarity not assigned yet)
    const url = `${VIBE_API_BASE}/owner/${userAddress}?page=${page}&limit=${limit}&includeMetadata=true&contractAddress=${contractAddress}&chainId=${chainId}&status=minted`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'API-KEY': API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`Vibe API error: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Unopened packs API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch unopened packs' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';

const VIBE_API_BASE = 'https://build.wield.xyz/vibe/boosterbox';
const API_KEY = process.env.VIBE_API_KEY || 'DEMO_REPLACE_WITH_FREE_API_KEY';

export async function GET(request: NextRequest) {
  try {
    // Validate API key is configured (security: prevent demo key usage)
    if (!process.env.VIBE_API_KEY || API_KEY.includes('DEMO')) {
      console.error('[SECURITY] VIBE_API_KEY not configured - using demo key');
      return NextResponse.json(
        { success: false, error: 'API configuration error. Please set VIBE_API_KEY environment variable.' },
        { status: 503 }
      );
    }

    const { searchParams } = new URL(request.url);
    const contractAddress = searchParams.get('contractAddress');
    const chainId = searchParams.get('chainId') || '8453';

    if (!contractAddress) {
      return NextResponse.json(
        { success: false, error: 'contractAddress is required' },
        { status: 400 }
      );
    }

    // Fetch collection metadata from VibeMarket API
    const url = `${VIBE_API_BASE}/contractAddress/${contractAddress}/all-metadata?chainId=${chainId}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'API-KEY': API_KEY },
    });

    if (!response.ok) {
      throw new Error(`Vibe API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success || !data.metadata) {
      throw new Error('Invalid collection metadata structure');
    }

    const rarityStats = {
      total: 0,
      common: 0,
      rare: 0,
      epic: 0,
      legendary: 0,
      mythic: 0,
      byRarity: {} as Record<string, { count: number; rarity: number }>
    };

    data.metadata.forEach((card: any) => {
      rarityStats.total++;

      const rarityName = card.odds?.rarity?.toUpperCase();

      if (!rarityName) return;

      if (!rarityStats.byRarity[rarityName]) {
        rarityStats.byRarity[rarityName] = { count: 0, rarity: 0 };
      }
      rarityStats.byRarity[rarityName].count++;

      // Map based on rarityName from odds
      switch (rarityName) {
        case 'COMMON':
          rarityStats.common++;
          break;
        case 'RARE':
          rarityStats.rare++;
          break;
        case 'EPIC':
          rarityStats.epic++;
          break;
        case 'LEGENDARY':
          rarityStats.legendary++;
          break;
        case 'MYTHIC':
          rarityStats.mythic++;
          break;
      }
    });

    return NextResponse.json({
      success: true,
      data: rarityStats
    });
  } catch (error) {
    console.error('Error analyzing collection rarity:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to analyze collection rarity' },
      { status: 500 }
    );
  }
}
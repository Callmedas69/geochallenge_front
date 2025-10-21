import { NextRequest, NextResponse } from 'next/server';

const VIBE_API_BASE = 'https://build.wield.xyz/vibe/boosterbox';
const API_KEY = process.env.VIBE_API_KEY || 'DEMO_REPLACE_WITH_FREE_API_KEY';

// Input validation helpers
function isValidEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

function validateChainId(chainId: string | null): number {
  const parsed = parseInt(chainId || '8453', 10);
  if (isNaN(parsed) || parsed < 1 || parsed > 999999) {
    return 8453; // Default to Base
  }
  return parsed;
}

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
    const chainIdParam = searchParams.get('chainId');
    const rarityTiersParam = searchParams.get('rarityTiers');

    // Validate contractAddress
    if (!contractAddress) {
      return NextResponse.json(
        { success: false, error: 'contractAddress is required' },
        { status: 400 }
      );
    }

    if (!isValidEthereumAddress(contractAddress)) {
      return NextResponse.json(
        { success: false, error: 'Invalid Ethereum address format' },
        { status: 400 }
      );
    }

    // Validate chainId
    const chainId = validateChainId(chainIdParam);

    // Validate rarityTiers
    if (!rarityTiersParam) {
      return NextResponse.json(
        { success: false, error: 'rarityTiers is required' },
        { status: 400 }
      );
    }

    // Parse and validate rarityTiers
    const rarityTiers = rarityTiersParam
      .split(',')
      .map(tier => parseInt(tier.trim(), 10))
      .filter(tier => !isNaN(tier) && tier >= 1 && tier <= 5); // Only allow valid rarity range

    // Limit array length to prevent abuse
    if (rarityTiers.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one valid rarityTier (1-5) is required' },
        { status: 400 }
      );
    }

    if (rarityTiers.length > 5) {
      return NextResponse.json(
        { success: false, error: 'Maximum 5 rarityTiers allowed' },
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

    // Map rarity names to numbers
    const rarityNameToNumber: Record<string, number> = {
      'COMMON': 1,
      'RARE': 2,
      'EPIC': 3,
      'LEGENDARY': 4,
      'MYTHIC': 5,
    };

    // Filter cards matching the contested rarityTiers
    const contestedCards: Array<{ name: string; rarity: number; imageUrl: string }> = [];

    data.metadata.forEach((card: any) => {
      const rarityName = card.odds?.rarity?.toUpperCase();
      const imageUrl = card.imageUrl;
      const name = card.name;

      if (!rarityName || !imageUrl || !name || typeof imageUrl !== 'string' || typeof name !== 'string') {
        return;
      }

      // Get rarity number from name
      const rarityNumber = rarityNameToNumber[rarityName];

      // Check if this rarity is in the contested tiers
      if (rarityNumber && rarityTiers.includes(rarityNumber)) {
        const trimmedUrl = imageUrl.trim();

        // Basic URL validation
        if (trimmedUrl.length > 0 && (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://'))) {
          contestedCards.push({
            name: name.trim(),
            rarity: rarityNumber,
            imageUrl: trimmedUrl,
          });
        }
      }
    });

    return NextResponse.json({
      success: true,
      cards: contestedCards,
      count: contestedCards.length
    });
  } catch (error) {
    console.error('Error fetching collection art:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch collection art' },
      { status: 500 }
    );
  }
}

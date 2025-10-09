import { NextRequest, NextResponse } from 'next/server';

const VIBE_API_BASE = 'https://build.wield.xyz/vibe/boosterbox';
const API_KEY = process.env.VIBE_API_KEY || 'DEMO_REPLACE_WITH_FREE_API_KEY';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const contractAddress = searchParams.get('contractAddress');
    const chainId = searchParams.get('chainId') || '8453';
    const rarityTiersParam = searchParams.get('rarityTiers');

    if (!contractAddress) {
      return NextResponse.json(
        { success: false, error: 'contractAddress is required' },
        { status: 400 }
      );
    }

    if (!rarityTiersParam) {
      return NextResponse.json(
        { success: false, error: 'rarityTiers is required' },
        { status: 400 }
      );
    }

    // Parse rarityTiers from comma-separated string to number array
    const rarityTiers = rarityTiersParam.split(',').map(tier => parseInt(tier.trim())).filter(tier => !isNaN(tier));

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

    console.log(`[Collection Art] Found ${contestedCards.length} cards from contested tiers [${rarityTiers.join(', ')}] for ${contractAddress}`);

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

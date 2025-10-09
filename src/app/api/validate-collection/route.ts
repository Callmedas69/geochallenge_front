import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';

const VIBE_API_BASE = 'https://build.wield.xyz/vibe/boosterbox';
const API_KEY = process.env.VIBE_API_KEY || 'DEMO_REPLACE_WITH_FREE_API_KEY';

// Rarity tier mapping
const RARITY_MAP: Record<number, string> = {
  1: 'Common',
  2: 'Rare',
  3: 'Epic',
  4: 'Legendary',
  5: 'Mythic',
};

/**
 * Fetch collection metadata and count unique cards per tier
 */
async function getCollectionMetadata(contractAddress: string, chainId: number = 8453) {
  const url = `${VIBE_API_BASE}/contractAddress/${contractAddress}/all-metadata?chainId=${chainId}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: { 'API-KEY': API_KEY },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch collection metadata');
  }

  const data = await response.json();

  // Group unique card names by rarity tier
  const cardsByTier: Record<string, Set<string>> = {
    'Common': new Set(),
    'Rare': new Set(),
    'Epic': new Set(),
    'Legendary': new Set(),
    'Mythic': new Set(),
  };

  data.metadata?.forEach((card: any) => {
    const rarity = card.odds?.rarity;
    const name = card.name;
    if (rarity && name && cardsByTier[rarity]) {
      cardsByTier[rarity].add(name);
    }
  });

  return cardsByTier;
}

export async function POST(request: NextRequest) {
  try {
    const { userAddress, contractAddress, competitionId, requiredRarities } = await request.json();

    if (!userAddress || !contractAddress || !competitionId || !requiredRarities) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Fetch collection metadata to get total unique cards per tier
    const collectionMetadata = await getCollectionMetadata(contractAddress);

    // Check user's holdings for each required rarity
    const validationPromises = requiredRarities.map(async (rarityTier: number) => {
      const rarityName = RARITY_MAP[rarityTier];
      const totalUniqueCards = collectionMetadata[rarityName]?.size || 0;

      const url = `${VIBE_API_BASE}/owner/${userAddress}?page=1&limit=200&includeMetadata=true&contractAddress=${contractAddress}&chainId=8453&status=rarity_assigned&rarity=${rarityTier}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: { 'API-KEY': API_KEY },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch rarity ${rarityTier} holdings`);
      }

      const data = await response.json();

      // Extract unique card names owned by user
      const ownedUniqueNames = new Set<string>();
      data.boxes?.forEach((box: any) => {
        if (box.metadata?.name) {
          ownedUniqueNames.add(box.metadata.name);
        }
      });

      return {
        rarity: rarityTier,
        rarityName,
        totalUniqueCards,
        ownedUniqueCards: ownedUniqueNames.size,
        ownedNames: Array.from(ownedUniqueNames),
        isComplete: ownedUniqueNames.size === totalUniqueCards,
      };
    });

    const rarityResults = await Promise.all(validationPromises);

    // Check if collection is complete (ALL unique cards in EACH required tier)
    const isComplete = rarityResults.every(result => result.isComplete);

    if (!isComplete) {
      const missing = rarityResults
        .filter(result => !result.isComplete)
        .map(result => `${result.rarityName} (${result.ownedUniqueCards}/${result.totalUniqueCards})`)
        .join(', ');

      return NextResponse.json({
        success: false,
        complete: false,
        message: `Collection incomplete. Progress: ${missing}`,
        holdings: rarityResults
      });
    }

    // Generate proof data (simplified for demo)
    const proofData = {
      userAddress,
      contractAddress,
      competitionId,
      timestamp: Date.now(),
      holdings: rarityResults
    };

    // Create proof hash
    const proofHash = createHash('sha256')
      .update(JSON.stringify(proofData))
      .digest('hex');

    // TODO: In production, this should be signed by a verifier service with a private key
    // For now, we'll create a mock signature
    const mockSignature = createHash('sha256')
      .update(proofHash + process.env.VERIFIER_PRIVATE_KEY_MOCK)
      .digest('hex');

    return NextResponse.json({
      success: true,
      complete: true,
      message: '🎉 Collection complete! Ready to submit proof.',
      proofHash: `0x${proofHash}`,
      signature: `0x${mockSignature}`,
      holdings: rarityResults
    });

  } catch (error) {
    console.error('Collection validation error:', error);
    return NextResponse.json(
      { error: 'Failed to validate collection' },
      { status: 500 }
    );
  }
}
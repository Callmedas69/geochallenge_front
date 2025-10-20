/**
 * @title Collection Validation Utilities
 * @notice Shared NFT collection validation logic
 * @dev KISS principle: Reusable validation for proof generation
 */

import { API_CHAIN_ID } from './config';

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

export interface ValidationResult {
  isComplete: boolean;
  totalRequired: number;
  totalOwned: number;
  percentage: number;
  rarityBreakdown: Record<number, { required: number; owned: number }>;
  message: string;
}

/**
 * Validate if user owns all required NFTs for a competition
 * @param userAddress - User's wallet address
 * @param contractAddress - NFT collection contract address
 * @param requiredRarities - Array of required rarity tiers (e.g., [1, 2, 3])
 * @returns Validation result with completion status
 */
export async function validateCollectionCompletion(
  userAddress: string,
  contractAddress: string,
  requiredRarities: readonly number[]
): Promise<ValidationResult> {
  try {
    // Step 1: Get collection rarity stats (total unique cards per tier)
    const collectionResponse = await fetch(
      `/api/collection/rarity?contractAddress=${contractAddress}&chainId=${API_CHAIN_ID}`,
      { next: { revalidate: 0 } } // No caching for validation
    );

    if (!collectionResponse.ok) {
      throw new Error('Failed to fetch collection rarity data');
    }

    const collectionData = await collectionResponse.json();

    if (!collectionData.success) {
      throw new Error('Collection rarity data unavailable');
    }

    // Map rarity numbers to collection counts
    const rarityMap: Record<number, number> = {
      1: collectionData.data.common || 0,
      2: collectionData.data.rare || 0,
      3: collectionData.data.epic || 0,
      4: collectionData.data.legendary || 0,
      5: collectionData.data.mythic || 0,
    };

    // Step 2: Fetch user's NFT holdings
    const holdingsUrl = `${VIBE_API_BASE}/owner/${userAddress}?page=1&limit=500&includeMetadata=true&contractAddress=${contractAddress}&chainId=${API_CHAIN_ID}&status=rarity_assigned`;

    const userResponse = await fetch(holdingsUrl, {
      method: 'GET',
      headers: { 'API-KEY': API_KEY },
    });

    if (!userResponse.ok) {
      throw new Error('Failed to fetch user holdings');
    }

    const userData = await userResponse.json();

    // Step 3: Calculate progress per rarity tier
    const rarityBreakdown: Record<number, { required: number; owned: number }> = {};
    let totalRequired = 0;
    let totalOwned = 0;

    requiredRarities.forEach((rarity) => {
      const required = rarityMap[rarity] || 0;

      // Count UNIQUE card names owned by user for this rarity
      const userCardsForRarity = userData.boxes?.filter((box: any) => box.rarity === rarity) || [];
      const uniqueCardsOwned = new Set(
        userCardsForRarity.map((box: any) => box.metadata?.name)
      ).size;

      rarityBreakdown[rarity] = { required, owned: uniqueCardsOwned };
      totalRequired += required;
      totalOwned += uniqueCardsOwned;
    });

    // Step 4: Check if collection is complete
    const percentage = totalRequired > 0 ? (totalOwned / totalRequired) * 100 : 0;
    const isComplete = requiredRarities.every(
      (rarity) => rarityBreakdown[rarity].owned >= rarityBreakdown[rarity].required
    );

    // Generate status message
    let message: string;
    if (isComplete) {
      message = '✅ Collection complete! All required NFTs owned.';
    } else {
      const missing = requiredRarities
        .filter((rarity) => rarityBreakdown[rarity].owned < rarityBreakdown[rarity].required)
        .map(
          (rarity) =>
            `${RARITY_MAP[rarity]}: ${rarityBreakdown[rarity].owned}/${rarityBreakdown[rarity].required}`
        )
        .join(', ');
      message = `❌ Collection incomplete. Missing: ${missing}`;
    }

    return {
      isComplete,
      totalRequired,
      totalOwned,
      percentage,
      rarityBreakdown,
      message,
    };
  } catch (error) {
    console.error('[validateCollectionCompletion] Error:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Failed to validate collection'
    );
  }
}

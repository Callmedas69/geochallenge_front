import { useState, useEffect, useMemo } from 'react';
import { CONTRACT_ADDRESSES } from '@/lib/contractList';
import { API_CHAIN_ID } from '@/lib/config';
import type { Competition, TicketMetadata as GlobalTicketMetadata } from '@/lib/types';

interface ContractInfo {
  success: boolean;
  contractInfo: {
    gameId: string;
    tokenAddress: string;
    tokenName: string;
    tokenSymbol: string;
    nftName: string;
    nftSymbol: string;
    description: string;
    imageUrl: string;
    dropContractAddress: string;
    chainId: number;
    ownerAddress: string;
    pricePerPack: string;
    pricePerPackUsd: string;
    isActive: boolean;
    isVerified: boolean;
    isGraduated: boolean;
    marketCap: string;
    marketCapUsd: string;
    preorderProgress: number;
    bgColor: string;
    featuredImageUrl: string;
    slug: string;
    disableFoil: boolean;
    disableWear: boolean;
    packImage: string;
    links: {
      twitter: string;
      website: string;
    };
    isNSFW: boolean;
    isVerifiedArtist: boolean;
    version: string;
    createdAt: string;
    updatedAt: string;
  };
}

interface UserHoldings {
  success: boolean;
  boxes: Array<{
    tokenId: number;
    contractAddress: string;
    owner: string;
    rarity: number;
    rarityName: string;
    chainId: number;
    metadata: {
      name: string;
      description: string;
      imageUrl: string;
    };
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export function useContractInfo(contractAddress: string) {
  const [data, setData] = useState<ContractInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContractInfo = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/vibe/contract/${contractAddress}?chainId=${API_CHAIN_ID}`);

        if (!response.ok) {
          throw new Error('Failed to fetch contract info');
        }

        const result = await response.json();
        setData(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    if (contractAddress) {
      fetchContractInfo();
    }
  }, [contractAddress]);

  return { data, loading, error };
}

export function useUserHoldings(
  userAddress: string,
  contractAddress: string,
  rarity?: number
) {
  const [data, setData] = useState<UserHoldings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserHoldings = async () => {
    try {
      setLoading(true);

      let url = `/api/vibe/holdings/${userAddress}?contractAddress=${contractAddress}&chainId=${API_CHAIN_ID}&status=rarity_assigned`;

      if (rarity !== undefined) {
        url += `&rarity=${rarity}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to fetch user holdings');
      }

      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userAddress && contractAddress) {
      fetchUserHoldings();
    }
  }, [userAddress, contractAddress, rarity]);

  return { data, loading, error, refetch: fetchUserHoldings };
}

export function useProgressCalculator(
  userAddress: string,
  contractAddress: string,
  requiredRarities: readonly number[]
) {
  const [progress, setProgress] = useState<{
    totalRequired: number;
    totalOwned: number;
    percentage: number;
    rarityBreakdown: Record<number, { required: number; owned: number }>;
    isComplete: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const calculateProgress = async () => {
    try {
      setLoading(true);

      // Get collection rarity stats for target counts
      const collectionResponse = await fetch(`/api/collection/rarity?contractAddress=${contractAddress}&chainId=${API_CHAIN_ID}`);
      const collectionData = await collectionResponse.json();

      if (!collectionData.success) {
        throw new Error('Failed to fetch collection rarity data');
      }

      // Map rarity numbers to collection counts
      const rarityMap: Record<number, number> = {
        1: collectionData.data.common || 0,
        2: collectionData.data.rare || 0,
        3: collectionData.data.epic || 0,
        4: collectionData.data.legendary || 0,
        5: collectionData.data.mythic || 0,
      };

      // Fetch user holdings for all rarities at once
      const userResponse = await fetch(
        `/api/vibe/holdings/${userAddress}?contractAddress=${contractAddress}&chainId=${API_CHAIN_ID}&status=rarity_assigned`
      );
      const userData = await userResponse.json();

      const rarityBreakdown: Record<number, { required: number; owned: number }> = {};
      let totalRequired = 0;
      let totalOwned = 0;

      requiredRarities.forEach((rarity) => {
        const required = rarityMap[rarity] || 0;

        // Count unique cards user owns for this rarity
        const userCardsForRarity = userData.boxes?.filter((box: any) => box.rarity === rarity) || [];
        const uniqueCardsOwned = new Set(userCardsForRarity.map((box: any) => box.metadata?.name)).size;

        rarityBreakdown[rarity] = { required, owned: uniqueCardsOwned };
        totalRequired += required;
        totalOwned += uniqueCardsOwned;
      });

      const percentage = totalRequired > 0 ? (totalOwned / totalRequired) * 100 : 0;
      const isComplete = requiredRarities.every(rarity =>
        rarityBreakdown[rarity].owned >= rarityBreakdown[rarity].required
      );

      setProgress({
        totalRequired,
        totalOwned,
        percentage,
        rarityBreakdown,
        isComplete,
      });
    } catch (err) {
      console.error('Progress calculation error:', err);
      setProgress(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userAddress && contractAddress && requiredRarities.length > 0) {
      calculateProgress();
    }
  }, [userAddress, contractAddress, requiredRarities]);

  return { progress, loading, refetch: calculateProgress };
}

export function useCollectionRarityStats(contractAddress: string) {
  const [data, setData] = useState<{
    success: boolean;
    data: {
      total: number;
      common: number;
      rare: number;
      epic: number;
      legendary: number;
      mythic: number;
    };
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRarityStats = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/collection/rarity?contractAddress=${contractAddress}&chainId=${API_CHAIN_ID}`);

        if (!response.ok) {
          throw new Error('Failed to fetch rarity stats');
        }

        const result = await response.json();
        setData(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    if (contractAddress) {
      fetchRarityStats();
    }
  }, [contractAddress]);

  return { data, loading, error };
}

/**
 * Main web hook to fetch ticket metadata from GeoChallenge ERC1155 contract
 * Reads the actual token metadata URI and fetches the JSON
 *
 * @param competitionId - The competition ID (token ID)
 * @param userAddress - The connected wallet address (to verify ownership)
 * @returns Ticket metadata with loading/error states
 */
export function useTicketMetadata(
  competitionId: bigint | undefined,
  userAddress: string | undefined
) {
  const [metadata, setMetadata] = useState<GlobalTicketMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetadata = async () => {
      if (!competitionId || !userAddress) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Fetch from API that calls GeoChallenge.uri(tokenId)
        const response = await fetch(
          `/api/ticket/metadata?competitionId=${competitionId}&userAddress=${userAddress}`
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error('[useTicketMetadata] API error:', response.status, errorText);
          throw new Error(`Failed to fetch ticket metadata: ${response.status}`);
        }

        const data = await response.json();
        setMetadata(data);
        setError(null);
      } catch (err) {
        console.error('[useTicketMetadata] Error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setMetadata(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMetadata();
  }, [competitionId, userAddress]);

  return {
    data: metadata,
    loading,
    error,
  };
}

interface CollectionCard {
  name: string;
  rarity: number;
  imageUrl: string;
  ownedCount: number;
}

export function useCollectionArt(
  contractAddress: string,
  rarityTiers: readonly number[],
  userAddress?: string
) {
  const [data, setData] = useState<{
    success: boolean;
    cards: CollectionCard[];
    count: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCollectionArt = async () => {
    try {
      setLoading(true);
      const rarityTiersParam = rarityTiers.join(',');

      // Fetch collection cards
      const cardsResponse = await fetch(
        `/api/collection/collection-art?contractAddress=${contractAddress}&chainId=${API_CHAIN_ID}&rarityTiers=${rarityTiersParam}`
      );

      if (!cardsResponse.ok) {
        throw new Error('Failed to fetch collection art');
      }

      const cardsResult = await cardsResponse.json();

      // If user address provided, fetch holdings and match
      let cardsWithOwnership: CollectionCard[] = [];

      if (userAddress && cardsResult.success && cardsResult.cards) {
        // Fetch user holdings
        const holdingsResponse = await fetch(
          `/api/vibe/holdings/${userAddress}?contractAddress=${contractAddress}&chainId=${API_CHAIN_ID}&status=rarity_assigned`
        );

        if (holdingsResponse.ok) {
          const holdingsResult = await holdingsResponse.json();
          const holdings = holdingsResult.boxes || [];

          // Count ownership for each card by rarity + name
          cardsWithOwnership = cardsResult.cards.map((card: any) => {
            const ownedCount = holdings.filter(
              (box: any) =>
                box.rarity === card.rarity &&
                box.metadata?.name === card.name
            ).length;

            return {
              name: card.name,
              rarity: card.rarity,
              imageUrl: card.imageUrl,
              ownedCount,
            };
          });
        } else {
          // Holdings fetch failed, show all as unowned
          cardsWithOwnership = cardsResult.cards.map((card: any) => ({
            name: card.name,
            rarity: card.rarity,
            imageUrl: card.imageUrl,
            ownedCount: 0,
          }));
        }
      } else {
        // No user address, show all as unowned
        cardsWithOwnership = (cardsResult.cards || []).map((card: any) => ({
          name: card.name,
          rarity: card.rarity,
          imageUrl: card.imageUrl,
          ownedCount: 0,
        }));
      }

      setData({
        success: true,
        cards: cardsWithOwnership,
        count: cardsWithOwnership.length,
      });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!contractAddress || !rarityTiers || rarityTiers.length === 0) {
      setLoading(false);
      return;
    }

    const abortController = new AbortController();

    const fetchWithAbort = async () => {
      try {
        setLoading(true);
        const rarityTiersParam = rarityTiers.join(',');

        // Fetch collection cards
        const cardsResponse = await fetch(
          `/api/collection/collection-art?contractAddress=${contractAddress}&chainId=${API_CHAIN_ID}&rarityTiers=${rarityTiersParam}`,
          { signal: abortController.signal }
        );

        if (!cardsResponse.ok) {
          throw new Error('Failed to fetch collection art');
        }

        const cardsResult = await cardsResponse.json();

        // If user address provided, fetch holdings and match
        let cardsWithOwnership: CollectionCard[] = [];

        if (userAddress && cardsResult.success && cardsResult.cards) {
          // Fetch user holdings
          const holdingsResponse = await fetch(
            `/api/vibe/holdings/${userAddress}?contractAddress=${contractAddress}&chainId=${API_CHAIN_ID}&status=rarity_assigned`,
            { signal: abortController.signal }
          );

          if (holdingsResponse.ok) {
            const holdingsResult = await holdingsResponse.json();
            const holdings = holdingsResult.boxes || [];

            // Count ownership for each card by rarity + name
            cardsWithOwnership = cardsResult.cards.map((card: any) => {
              const ownedCount = holdings.filter(
                (box: any) =>
                  box.rarity === card.rarity &&
                  box.metadata?.name === card.name
              ).length;

              return {
                name: card.name,
                rarity: card.rarity,
                imageUrl: card.imageUrl,
                ownedCount,
              };
            });
          } else {
            // Holdings fetch failed, show all as unowned
            cardsWithOwnership = cardsResult.cards.map((card: any) => ({
              name: card.name,
              rarity: card.rarity,
              imageUrl: card.imageUrl,
              ownedCount: 0,
            }));
          }
        } else {
          // No user address, show all as unowned
          cardsWithOwnership = (cardsResult.cards || []).map((card: any) => ({
            name: card.name,
            rarity: card.rarity,
            imageUrl: card.imageUrl,
            ownedCount: 0,
          }));
        }

        // Prevent stale data update
        if (!abortController.signal.aborted) {
          setData({
            success: true,
            cards: cardsWithOwnership,
            count: cardsWithOwnership.length,
          });
          setError(null);
        }
      } catch (err) {
        // Ignore abort errors
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }

        if (!abortController.signal.aborted) {
          setError(err instanceof Error ? err.message : 'Unknown error');
          setData(null);
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchWithAbort();

    // Cleanup: abort fetch on unmount or params change
    return () => {
      abortController.abort();
    };
  }, [contractAddress, rarityTiers, userAddress]);

  return { data, loading, error, refetch: fetchCollectionArt };
}

/**
 * Hook to fetch rarity breakdown from transaction hash
 * @param transactionHash - The transaction hash from pack opening
 * @param contractAddress - The BoosterDrop contract address
 * @returns Rarity breakdown data with loading/error states
 */
export function useOpenRarity(
  transactionHash: `0x${string}` | undefined,
  contractAddress: string
) {
  const [data, setData] = useState<{
    success: boolean;
    rarities: Record<number, number>;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!transactionHash || !contractAddress) {
      setLoading(false);
      return;
    }

    const fetchRarity = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `/api/vibe/open-rarity?transactionHash=${transactionHash}&contractAddress=${contractAddress}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch rarity data');
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error('[useOpenRarity] Error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRarity();
  }, [transactionHash, contractAddress]);

  return { data, loading, error };
}
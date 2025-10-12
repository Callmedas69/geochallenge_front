import { useState, useEffect } from 'react';

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
        const response = await fetch(`/api/vibe/contract/${contractAddress}?chainId=8453`);

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

      let url = `/api/vibe/holdings/${userAddress}?contractAddress=${contractAddress}&chainId=8453&status=rarity_assigned`;

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

  useEffect(() => {
    const calculateProgress = async () => {
      try {
        setLoading(true);

        // Get collection rarity stats for target counts
        const collectionResponse = await fetch(`/api/collection/rarity?contractAddress=${contractAddress}&chainId=8453`);
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
          `/api/vibe/holdings/${userAddress}?contractAddress=${contractAddress}&chainId=8453&status=rarity_assigned`
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

    if (userAddress && contractAddress && requiredRarities.length > 0) {
      calculateProgress();
    }
  }, [userAddress, contractAddress, requiredRarities]);

  return { progress, loading };
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
        const response = await fetch(`/api/collection/rarity?contractAddress=${contractAddress}&chainId=8453`);

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

interface TicketMetadata {
  name: string;
  description: string;
  image: string;
  balance: number;
  tokenId: string;
}

export function useTicketMetadata(
  userAddress: string | undefined,
  contractAddress: string | undefined,
  tokenId: string | undefined
) {
  const [data, setData] = useState<TicketMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTicketFromWallet = async () => {
      if (!userAddress || !contractAddress || !tokenId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Call our API route instead of Alchemy directly
        const url = `/api/ticket/metadata?userAddress=${userAddress}&contractAddress=${contractAddress}&tokenId=${tokenId}`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error('Failed to fetch ticket metadata');
        }

        const metadata = await response.json();

        setData(metadata);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTicketFromWallet();
  }, [userAddress, contractAddress, tokenId]);

  return { data, loading, error };
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

  useEffect(() => {
    if (!contractAddress || !rarityTiers || rarityTiers.length === 0) {
      setLoading(false);
      return;
    }

    const abortController = new AbortController();

    const fetchCollectionArt = async () => {
      try {
        setLoading(true);
        const rarityTiersParam = rarityTiers.join(',');

        // Fetch collection cards
        const cardsResponse = await fetch(
          `/api/collection/collection-art?contractAddress=${contractAddress}&chainId=8453&rarityTiers=${rarityTiersParam}`,
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
            `/api/vibe/holdings/${userAddress}?contractAddress=${contractAddress}&chainId=8453&status=rarity_assigned`,
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

    fetchCollectionArt();

    // Cleanup: abort fetch on unmount or params change
    return () => {
      abortController.abort();
    };
  }, [contractAddress, rarityTiers, userAddress]);

  return { data, loading, error };
}
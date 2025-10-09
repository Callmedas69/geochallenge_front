/**
 * @title useCollectionImage Hook
 * @notice Fetches collection image from Vibe API
 * @dev KISS principle - simple image fetching for competition cards
 */

import { useState, useEffect } from 'react';
import type { Address } from 'viem';

interface CollectionData {
  success?: boolean;
  contractInfo?: {
    packImage?: string;
    imageUrl?: string;
    featuredImageUrl?: string;
    nftName?: string;
  };
}

export function useCollectionImage(collectionAddress?: Address) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!collectionAddress) {
      setIsLoading(false);
      return;
    }

    const fetchCollectionImage = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(
          `/api/vibe/contract/${collectionAddress}?chainId=8453`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch collection: ${response.status}`);
        }

        const data: CollectionData = await response.json();
        setImageUrl(data.contractInfo?.packImage || data.contractInfo?.featuredImageUrl || null);
      } catch (err) {
        console.error('Collection image fetch error:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setImageUrl(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollectionImage();
  }, [collectionAddress]);

  return { imageUrl, isLoading, error };
}

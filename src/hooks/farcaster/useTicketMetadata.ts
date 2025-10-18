import { useState, useEffect } from 'react';
import type { TicketMetadata } from '@/lib/types';

/**
 * Farcaster-specific hook to fetch ticket metadata from GeoChallenge ERC1155 contract
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
  const [metadata, setMetadata] = useState<TicketMetadata | null>(null);
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
          console.error('[Farcaster useTicketMetadata] API error:', response.status, errorText);
          throw new Error(`Failed to fetch ticket metadata: ${response.status}`);
        }

        const data = await response.json();
        setMetadata(data);
        setError(null);
      } catch (err) {
        console.error('[Farcaster useTicketMetadata] Error:', err);
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

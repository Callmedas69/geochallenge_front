/**
 * @title Featured Competitions Hook
 * @notice React Query hook for fetching featured competition IDs
 * @dev Fetches from public API, returns competition IDs sorted by priority
 */

import { useQuery } from '@tanstack/react-query';

interface FeaturedCompetitionsResponse {
  success: boolean;
  data: number[];
  count: number;
}

/**
 * Hook to fetch featured competition IDs
 * @returns Featured competition IDs (sorted by priority), loading state, and error
 */
export function useFeaturedCompetitions() {
  return useQuery({
    queryKey: ['featured-competitions'],
    queryFn: async (): Promise<number[]> => {
      const response = await fetch('/api/supabase/featured');

      if (!response.ok) {
        throw new Error('Failed to fetch featured competitions');
      }

      const data: FeaturedCompetitionsResponse = await response.json();

      if (!data.success) {
        throw new Error('API returned unsuccessful response');
      }

      return data.data;
    },
    // Cache for 30 seconds (matches API cache-control)
    staleTime: 30 * 1000,
    // Keep in cache for 5 minutes
    gcTime: 5 * 60 * 1000,
    // Retry once on failure
    retry: 1,
  });
}

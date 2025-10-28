/**
 * @title useSortedCompetitions Hook
 * @notice Client-side sorting hook for competition lists
 * @dev KISS principle: Simple in-memory sorting with React Query caching
 */

import { useMemo } from "react";
import { useReadContracts } from "wagmi";
import { geoChallenge_implementation_ABI } from "@/abi";
import { CONTRACT_ADDRESSES } from "@/lib/contractList";

export type SortOption = "tickets" | "deadline" | "id";

interface SortedCompetitionsResult {
  sortedIds: bigint[];
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook to sort competition IDs by various criteria
 * @param competitionIds - Array of competition IDs to sort
 * @param sortBy - Sort criteria: 'tickets' (default), 'deadline', or 'id'
 * @returns Sorted competition IDs, loading state, and error
 */
export function useSortedCompetitions(
  competitionIds: readonly bigint[],
  sortBy: SortOption = "tickets"
): SortedCompetitionsResult {
  // Fetch competition data for all IDs
  const { data: competitionsData, isLoading, error } = useReadContracts({
    contracts: competitionIds.map((id) => ({
      address: CONTRACT_ADDRESSES.GeoChallenge,
      abi: geoChallenge_implementation_ABI,
      functionName: "getCompetition",
      args: [id],
    })),
    query: {
      enabled: competitionIds.length > 0,
      // Cache for 30 seconds (matches other competition queries)
      staleTime: 30 * 1000,
      // Keep in cache for 5 minutes
      gcTime: 5 * 60 * 1000,
    },
  });

  // Sort competitions based on selected criteria
  const sortedIds = useMemo(() => {
    // Convert readonly array to regular array
    const ids = [...competitionIds];

    if (!competitionsData || competitionsData.length === 0) {
      return ids;
    }

    // Create array of [id, competition] pairs
    const competitionsWithIds = ids.map((id, index) => {
      const result = competitionsData[index];
      const competition = result?.result as any;
      return { id, competition };
    });

    // Filter out failed fetches
    const validCompetitions = competitionsWithIds.filter(
      (item) => item.competition !== undefined && item.competition !== null
    );

    // Sort based on selected option
    const sorted = [...validCompetitions].sort((a, b) => {
      switch (sortBy) {
        case "tickets":
          // Most tickets first (DESC)
          const ticketsA = a.competition?.totalTickets
            ? Number(a.competition.totalTickets)
            : 0;
          const ticketsB = b.competition?.totalTickets
            ? Number(b.competition.totalTickets)
            : 0;
          return ticketsB - ticketsA;

        case "deadline":
          // Soonest deadline first (ASC)
          const deadlineA = a.competition?.deadline
            ? Number(a.competition.deadline)
            : Number.MAX_SAFE_INTEGER;
          const deadlineB = b.competition?.deadline
            ? Number(b.competition.deadline)
            : Number.MAX_SAFE_INTEGER;
          return deadlineA - deadlineB;

        case "id":
          // Newest first (DESC)
          return Number(b.id) - Number(a.id);

        default:
          return 0;
      }
    });

    return sorted.map((item) => item.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // @ts-ignore - useMemo dependency array with readonly array causes deep type instantiation
  }, [competitionIds.map(id => id.toString()).join(','), competitionsData, sortBy]);

  return {
    sortedIds,
    isLoading,
    error: error as Error | null,
  };
}

/**
 * Sort option labels for UI display
 */
export const SORT_OPTIONS = {
  tickets: "🔥 Most Popular",
  deadline: "⏰ Ending Soon",
  id: "🆕 Newest First",
} as const;

/**
 * Compact sort option labels for mobile
 */
export const SORT_OPTIONS_COMPACT = {
  tickets: "Most Popular",
  deadline: "Ending Soon",
  id: "Newest",
} as const;

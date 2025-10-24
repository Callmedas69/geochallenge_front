/**
 * @title Featured Competitions Admin Mutations Hook
 * @notice React Query mutations for managing featured competitions (admin-only)
 * @dev Uses wallet signature for authentication, invalidates query cache on success
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAccount, useSignMessage } from 'wagmi';
import { toast } from 'sonner';

interface AddFeaturedParams {
  competitionId: number;
  priority?: number;
  notes?: string;
}

interface UpdatePriorityParams {
  updates: Array<{
    competitionId: number;
    priority: number;
  }>;
}

/**
 * Hook for admin mutations on featured competitions
 * @returns Mutation functions for add, remove, and reorder operations
 */
export function useFeaturedMutations() {
  const queryClient = useQueryClient();
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();

  // Add featured competition
  const addFeatured = useMutation({
    mutationFn: async ({ competitionId, priority = 0, notes }: AddFeaturedParams) => {
      if (!address) {
        throw new Error('Wallet not connected');
      }

      // Create message to sign
      const message = `Add featured competition #${competitionId} at ${Date.now()}`;

      // Sign message
      const signature = await signMessageAsync({ message });

      // Send request
      const response = await fetch('/api/supabase/admin/featured', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          competitionId,
          priority,
          walletAddress: address,
          signature,
          message,
          notes,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add featured competition');
      }

      return response.json();
    },
    onSuccess: (data) => {
      // Invalidate and refetch featured competitions
      queryClient.invalidateQueries({ queryKey: ['featured-competitions'] });
      toast.success('Competition featured successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add featured competition');
    },
  });

  // Remove featured competition
  const removeFeatured = useMutation({
    mutationFn: async (competitionId: number) => {
      if (!address) {
        throw new Error('Wallet not connected');
      }

      // Create message to sign
      const message = `Remove featured competition #${competitionId} at ${Date.now()}`;

      // Sign message
      const signature = await signMessageAsync({ message });

      // Send request
      const response = await fetch(`/api/supabase/admin/featured/${competitionId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: address,
          signature,
          message,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to remove featured competition');
      }

      return response.json();
    },
    onSuccess: (data) => {
      // Invalidate and refetch featured competitions
      queryClient.invalidateQueries({ queryKey: ['featured-competitions'] });
      toast.success('Competition removed from featured!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to remove featured competition');
    },
  });

  // Update priorities (reorder)
  const updatePriorities = useMutation({
    mutationFn: async ({ updates }: UpdatePriorityParams) => {
      if (!address) {
        throw new Error('Wallet not connected');
      }

      // Create message to sign
      const message = `Update featured priorities at ${Date.now()}`;

      // Sign message
      const signature = await signMessageAsync({ message });

      // Send request
      const response = await fetch('/api/supabase/admin/featured/priority', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          updates,
          walletAddress: address,
          signature,
          message,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update priorities');
      }

      return response.json();
    },
    onSuccess: (data) => {
      // Invalidate and refetch featured competitions
      queryClient.invalidateQueries({ queryKey: ['featured-competitions'] });
      toast.success('Priorities updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update priorities');
    },
  });

  return {
    addFeatured,
    removeFeatured,
    updatePriorities,
    // Helper flags
    isLoading: addFeatured.isPending || removeFeatured.isPending || updatePriorities.isPending,
  };
}

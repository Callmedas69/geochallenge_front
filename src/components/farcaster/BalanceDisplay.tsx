/**
 * @title BalanceDisplay Component
 * @notice Shows user's ETH balance in USD for Farcaster miniApp header
 * @dev KISS principle: wagmi useBalance + ETH/USD price conversion
 * @dev Professional best practice: Shows both USD (primary) and ETH (secondary)
 */

"use client";

import { useAccount, useBalance } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { formatEther } from "viem";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign } from "lucide-react";

/**
 * Balance Display Component
 * Shows wallet balance in USD with ETH amount
 */
export function BalanceDisplay() {
  const { address, isConnected } = useAccount();

  // Fetch ETH balance from blockchain using wagmi
  const { data: balance, isLoading: loadingBalance } = useBalance({
    address: address,
    query: {
      enabled: !!address,
      refetchInterval: 30_000, // Refresh every 30 seconds
    },
  });

  // Fetch ETH/USD price from Vibe API
  const { data: ethPriceData, isLoading: loadingPrice } = useQuery({
    queryKey: ["ethPriceUSD"],
    queryFn: async () => {
      const response = await fetch("/api/vibe/ethPrice_USD");
      if (!response.ok) throw new Error("Failed to fetch ETH price");
      return response.json();
    },
    staleTime: 60_000, // Cache for 60 seconds
    refetchInterval: 60_000, // Refresh every minute
  });

  // Don't show if not connected
  if (!isConnected || !address) {
    return null;
  }

  // Show skeleton while loading
  if (loadingBalance || loadingPrice) {
    return <Skeleton className="h-9 w-24" />;
  }

  // Calculate USD value
  const ethAmount = balance ? parseFloat(formatEther(balance.value)) : 0;
  const ethPrice = ethPriceData?.price || 0;
  const usdValue = ethAmount * ethPrice;

  return (
    <div className="flex items-center gap-1 px-2 py-1 text-xs">
      <div className="flex flex-col leading-tight">
        {/* USD Value - Primary (bold, green) */}
        <span className="font-bold text-black/80 text-right">
          ${usdValue.toFixed(2)}
        </span>
        {/* ETH Amount - Secondary (smaller, muted) */}
        <span className="text-[10px] text-muted-foreground">
          {ethAmount.toFixed(4)} ETH
        </span>
      </div>
    </div>
  );
}

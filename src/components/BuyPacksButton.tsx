/**
 * @title Buy Packs Button Component
 * @notice Inline purchase of VibeMarket booster packs
 * @dev KISS principle: Clean UI with predefined quantities and custom input
 */

"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { useQuery } from "@tanstack/react-query";
import type { Address } from "viem";
import { formatEther, parseEther } from "viem";
import { boosterDropV2_ABI } from "@/abi/boosterDropV2_ABI";
import { REFERRER_ADDRESS, API_CHAIN_ID } from "@/lib/config";
import { parseTransactionError } from "@/lib/parseTransactionError";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Package, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { PackSuccessModal } from "@/components/PackSuccessModal";

interface BuyPacksButtonProps {
  /** BoosterDrop contract address (collection address) */
  collectionAddress: Address;
  /** Optional: Custom button text */
  buttonText?: string;
  /** Optional: Callback when packs are opened (triggered on modal close) */
  onPacksOpened?: () => void;
}

const PREDEFINED_QUANTITIES = [1, 50, 500, 1000];
const MAX_QUANTITY = 2000;
const MIN_QUANTITY = 1;

export function BuyPacksButton({
  collectionAddress,
  buttonText = "Buy Packs",
  onPacksOpened,
}: BuyPacksButtonProps) {
  const { address, isConnected } = useAccount();
  const [open, setOpen] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
  const [customQuantity, setCustomQuantity] = useState<string>("");
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [validationError, setValidationError] = useState<string>("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [mintedTokenIds, setMintedTokenIds] = useState<bigint[]>([]);
  const [validatedCustomQuantity, setValidatedCustomQuantity] =
    useState<number>(0);
  const [snapshotQuantity, setSnapshotQuantity] = useState<number>(0); // Snapshot quantity when modal opens

  // Validate custom quantity input in useEffect to avoid state updates during render
  useEffect(() => {
    if (!isCustomMode || customQuantity.trim() === "") {
      setValidationError("");
      setValidatedCustomQuantity(0);
      return;
    }

    const parsed = parseInt(customQuantity, 10);

    if (isNaN(parsed)) {
      setValidationError("");
      setValidatedCustomQuantity(0);
      return;
    }

    if (parsed < MIN_QUANTITY) {
      setValidationError(`Minimum quantity is ${MIN_QUANTITY}`);
      setValidatedCustomQuantity(0);
      return;
    }

    if (parsed > MAX_QUANTITY) {
      setValidationError(`Maximum quantity is ${MAX_QUANTITY}`);
      setValidatedCustomQuantity(MAX_QUANTITY);
      return;
    }

    setValidationError("");
    setValidatedCustomQuantity(parsed);
  }, [customQuantity, isCustomMode]);

  // Calculate actual quantity using memoization
  const actualQuantity = useMemo(() => {
    return isCustomMode ? validatedCustomQuantity : selectedQuantity;
  }, [isCustomMode, validatedCustomQuantity, selectedQuantity]);

  // Debounce custom input for price queries
  const [debouncedQuantity, setDebouncedQuantity] =
    useState<number>(actualQuantity);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuantity(actualQuantity);
    }, 500);

    return () => clearTimeout(timer);
  }, [actualQuantity]);

  // Fetch mint price for selected quantity (debounced)
  const {
    data: mintPrice,
    isLoading: loadingPrice,
    error: priceError,
  } = useReadContract({
    address: collectionAddress,
    abi: boosterDropV2_ABI,
    functionName: "getMintPrice",
    args: [BigInt(debouncedQuantity)],
    query: {
      enabled: debouncedQuantity > 0 && !validationError,
      staleTime: 30_000,
    },
  });

  // Fetch ETH price in USD from Vibe API
  const { data: ethPriceData } = useQuery({
    queryKey: ["ethPriceUSD"],
    queryFn: async () => {
      const response = await fetch("/api/vibe/ethPrice_USD");
      if (!response.ok) throw new Error("Failed to fetch ETH price");
      return response.json();
    },
    staleTime: 60_000, // Cache for 60 seconds
    refetchInterval: 60_000, // Refresh every minute
  });

  // Calculate USD value
  const ethPrice = ethPriceData?.price || 0;
  const priceETH = mintPrice
    ? parseFloat(formatEther(mintPrice)).toFixed(6)
    : "...";
  const priceUSD =
    mintPrice && ethPrice > 0
      ? (parseFloat(formatEther(mintPrice)) * ethPrice).toFixed(2)
      : "...";

  // Mint transaction
  const {
    data: hash,
    writeContract,
    isPending: isMintPending,
    error: mintError,
    reset: resetMint,
  } = useWriteContract();

  // Wait for transaction confirmation
  const {
    data: receipt,
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: confirmError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  // Reset states when dialog closes
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setSelectedQuantity(1);
        setCustomQuantity("");
        setIsCustomMode(false);
        setValidationError("");
        setValidatedCustomQuantity(0);
        setMintedTokenIds([]);
        resetMint();
      }, 300);
    }
  }, [open, resetMint]);

  // Handle success: fetch real unopened packs and show success modal
  useEffect(() => {
    if (isConfirmed && receipt && address) {
      // Fetch unopened packs to get real token IDs
      const fetchUnopenedPacks = async () => {
        try {
          const response = await fetch(
            `/api/vibe/unopened/${address}?contractAddress=${collectionAddress}&chainId=${API_CHAIN_ID}`
          );

          if (!response.ok) {
            throw new Error("Failed to fetch unopened packs");
          }

          const data = await response.json();
          const unopenedPacks = data.boxes || [];

          // Extract the last N token IDs (most recently minted)
          const tokenIds = unopenedPacks
            .slice(-actualQuantity) // Get last N packs
            .map((pack: { tokenId: string }) => BigInt(pack.tokenId));

          setMintedTokenIds(tokenIds);
          setSnapshotQuantity(actualQuantity); // Snapshot quantity before opening modal
          setOpen(false);
          setShowSuccessModal(true);
        } catch (error) {
          console.error("Error fetching unopened packs:", error);
          // Fallback: still show success modal but with empty token IDs
          setMintedTokenIds([]);
          setSnapshotQuantity(actualQuantity); // Snapshot quantity before opening modal
          setOpen(false);
          setShowSuccessModal(true);
        }
      };

      fetchUnopenedPacks();
    }
  }, [isConfirmed, receipt, address, actualQuantity, collectionAddress]);

  const handleMint = async () => {
    if (!address || !mintPrice || actualQuantity <= 0) return;

    try {
      writeContract({
        address: collectionAddress,
        abi: boosterDropV2_ABI,
        functionName: "mint",
        args: [
          BigInt(actualQuantity),
          address,
          REFERRER_ADDRESS,
          REFERRER_ADDRESS,
        ],
        value: mintPrice,
      });
    } catch (error) {
      console.error("Mint error:", error);
    }
  };

  const handleQuantitySelect = (quantity: number) => {
    setSelectedQuantity(quantity);
    setIsCustomMode(false);
    setCustomQuantity("");
    setValidationError("");
  };

  const handleCustomInput = (value: string) => {
    setCustomQuantity(value);
    setIsCustomMode(value.trim() !== "");
  };

  const canMint =
    isConnected &&
    actualQuantity > 0 &&
    mintPrice &&
    !isMintPending &&
    !isConfirming &&
    !validationError;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="p-3 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors group cursor-pointer">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span className="font-medium text-sm">{buttonText}</span>
            </div>
            <span className="text-xs text-muted-foreground group-hover:translate-x-1 transition-transform">
              →
            </span>
          </div>
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md">
        {!isConfirmed && (
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Buy Booster Packs
            </DialogTitle>
            <DialogDescription>
              Select quantity and mint booster packs with ETH
            </DialogDescription>
          </DialogHeader>
        )}

        {!isConnected ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please connect your wallet to buy packs
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            {/* Error State */}
            {(mintError || confirmError || priceError) && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {parseTransactionError(
                    mintError || confirmError || priceError
                  )}
                </AlertDescription>
              </Alert>
            )}

            {/* Success Waiting State - Fun message while fetching packs */}
            {isConfirmed ? (
              <div className="text-center space-y-4 py-12 animate-in fade-in duration-500">
                <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
                <p className="text-lg font-medium animate-pulse">
                  Rolling for mythical glory drops...
                </p>
              </div>
            ) : (
              <>
                {/* Predefined Quantities */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Quick Select</label>
                  <div className="grid grid-cols-4 gap-2">
                    {PREDEFINED_QUANTITIES.map((qty) => (
                      <Button
                        key={qty}
                        variant={
                          selectedQuantity === qty && !isCustomMode
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => handleQuantitySelect(qty)}
                      >
                        {qty}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Custom Quantity Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Custom Amount (max {MAX_QUANTITY})
                  </label>
                  <Input
                    type="number"
                    placeholder={`Enter 1-${MAX_QUANTITY}...`}
                    value={customQuantity}
                    onChange={(e) => handleCustomInput(e.target.value)}
                    min={MIN_QUANTITY}
                    max={MAX_QUANTITY}
                    className={isCustomMode ? "ring-2 ring-primary" : ""}
                  />
                  {validationError && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {validationError}
                    </p>
                  )}
                </div>

                {/* Price Display */}
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Total Price:
                    </span>
                    <div className="text-right">
                      {loadingPrice ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <div className="text-lg font-bold">
                            {priceETH} ETH
                          </div>
                          {ethPrice > 0 && priceUSD !== "..." && (
                            <div className="text-sm text-muted-foreground">
                              ~${priceUSD} USD
                            </div>
                          )}
                          {actualQuantity > 0 && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {actualQuantity} pack
                              {actualQuantity !== 1 ? "s" : ""}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Mint Button */}
                <Button
                  onClick={handleMint}
                  disabled={!canMint}
                  className="w-full"
                  size="lg"
                >
                  {isMintPending || isConfirming ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isMintPending ? "Approval..." : "Confirming..."}
                    </>
                  ) : (
                    <>
                      <Package className="mr-2 h-4 w-4" />
                      Mint {actualQuantity} Pack
                      {actualQuantity !== 1 ? "s" : ""}
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        )}
      </DialogContent>

      {/* Success Modal */}
      <PackSuccessModal
        collectionAddress={collectionAddress}
        quantity={snapshotQuantity}
        tokenIds={mintedTokenIds}
        open={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        onPacksOpened={onPacksOpened}
      />
    </Dialog>
  );
}

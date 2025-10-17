"use client";

import { useState, useEffect } from "react";
import {
  getRarityName,
  getRarityColor,
  getRarityBgColor,
} from "@/utils/contracts";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
  useAccount,
} from "wagmi";
import { CONTRACTS } from "@/utils/contracts";
import { boosterDropV2Abi } from "@/abi/IBoosterDropV2ABI";
import { boosterTokenV2Abi } from "@/abi/IBoosterTokenV2ABI";
import { formatEther } from "viem";
import { fetchETHPrice } from "@/utils/api";
import { VibeMarketRedirectButton } from "./sell/VibeMarketRedirectButton";

interface NFTItem {
  id: string;
  name: string;
  image: string;
  description?: string;
  rarity?: number;
  status?: string;
  rarityName?: string;
  tokenId?: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
  metadata?: {
    foil?: string;
    rarityName?: string;
    imageUrl?: string;
    unopenedImageUrl?: string;
    [key: string]: any;
  };
}

interface NFTCardProps {
  nft: NFTItem;
  onTransactionSuccess?: () => void;
  showActions?: boolean; // Control visibility of SELL/UNPACK buttons
  batchMode?: boolean; // Show selection checkbox
  isSelected?: boolean; // Whether this NFT is selected
  onToggleSelection?: (nftId: string) => void; // Toggle selection callback
}

export function NFTCard({
  nft,
  onTransactionSuccess,
  showActions = false,
  batchMode = false,
  isSelected = false,
  onToggleSelection,
}: NFTCardProps) {
  const { address } = useAccount();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<"unpack" | null>(null);
  const [ethPrice, setEthPrice] = useState<number>(0);

  // Transaction handling for UNPACK only (SELL is handled by SellButton)
  const { writeContract, isPending, data: hash, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Get sell price based on rarity (only for revealed NFTs)
  const getRarityOfferFunctionName = (rarity: number): string => {
    switch (rarity) {
      case 1:
        return "COMMON_OFFER";
      case 2:
        return "RARE_OFFER";
      case 3:
        return "EPIC_OFFER";
      case 4:
        return "LEGENDARY_OFFER";
      case 5:
        return "MYTHIC_OFFER";
      default:
        return "COMMON_OFFER"; // fallback
    }
  };

  // Get token offer amount for this rarity
  const { data: tokenOfferAmount } = useReadContract({
    address: CONTRACTS.GEO_ART,
    abi: boosterDropV2Abi,
    functionName: getRarityOfferFunctionName(nft.rarity || 1) as any,
    query: { enabled: !!(showActions && nft.rarity && nft.rarity > 0) }, // Only fetch for revealed NFTs with actions
  });

  // Get token address to query sell price (needed for both revealed and unrevealed)
  const { data: tokenAddress } = useReadContract({
    address: CONTRACTS.GEO_ART,
    abi: boosterDropV2Abi,
    functionName: "boosterTokenAddress",
    query: { enabled: !!showActions },
  });

  // Get unopened pack token amount
  const { data: tokensPerMint } = useReadContract({
    address: CONTRACTS.GEO_ART,
    abi: boosterDropV2Abi,
    functionName: "tokensPerMint",
    query: { enabled: !!(showActions && nft.status === "minted") }, // Only for unrevealed NFTs
  });

  // Get actual ETH amount you'd receive by selling the tokens (revealed NFTs)
  const { data: sellPriceInETH } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: boosterTokenV2Abi,
    functionName: "getTokenSellQuote",
    args: tokenOfferAmount ? [tokenOfferAmount as bigint] : undefined,
    query: {
      enabled: !!(
        showActions &&
        nft.rarity &&
        nft.rarity > 0 &&
        tokenOfferAmount &&
        tokenAddress
      ),
    },
  });

  // Get ETH amount for unopened pack tokens
  const { data: unrevealedSellPriceInETH } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: boosterTokenV2Abi,
    functionName: "getTokenSellQuote",
    args: tokensPerMint ? [tokensPerMint as bigint] : undefined,
    query: {
      enabled: !!(
        showActions &&
        nft.status === "minted" &&
        tokensPerMint &&
        tokenAddress
      ),
    },
  });

  // Get entropy fee for unpacking
  const { data: entropyFee } = useReadContract({
    address: CONTRACTS.GEO_ART,
    abi: boosterDropV2Abi,
    functionName: "getEntropyFee",
    query: { enabled: !!(showActions && nft.status === "minted") },
  });

  // Handle UNPACK transaction
  const handleUnpack = () => {
    setPendingAction("unpack");
    setShowConfirmDialog(true);
  };

  // Confirm transaction (UNPACK only)
  const handleConfirm = () => {
    if (!nft.tokenId) return;

    if (pendingAction === "unpack") {
      setShowConfirmDialog(false);
      if (entropyFee && nft.tokenId) {
        writeContract({
          address: CONTRACTS.GEO_ART,
          abi: boosterDropV2Abi,
          functionName: "open",
          args: [[BigInt(nft.tokenId)]], // Single parameter: array of token IDs
          value: entropyFee as bigint, // Pay entropy fee
        });
      }
    }
    setPendingAction(null);
  };

  // Cancel transaction
  const handleCancel = () => {
    setShowConfirmDialog(false);
    setPendingAction(null);
  };

  // Fetch ETH price for USD conversion
  useEffect(() => {
    const loadEthPrice = async () => {
      const price = await fetchETHPrice();
      setEthPrice(price);
    };

    if (showActions) {
      loadEthPrice();
    }
  }, [showActions]);

  // Handle successful transaction (UNPACK only)
  useEffect(() => {
    if (isSuccess) {
      // Transaction completed
      setShowConfirmDialog(false);
      setPendingAction(null);
      if (onTransactionSuccess) {
        onTransactionSuccess();
      }
    }
  }, [isSuccess, onTransactionSuccess]);

  // Format sell price for display
  const formatSellPrice = () => {
    // Use revealed price for opened NFTs, unrevealed price for unopened NFTs
    const priceToUse =
      nft.rarity && nft.rarity > 0 ? sellPriceInETH : unrevealedSellPriceInETH;

    if (!priceToUse) return null;

    const priceInETH = parseFloat(formatEther(priceToUse as bigint));
    const priceInUSD = ethPrice > 0 ? priceInETH * ethPrice : 0;

    return {
      eth: priceInETH.toFixed(5),
      usd: priceInUSD > 0 ? priceInUSD.toFixed(2) : null,
    };
  };
  return (
    <Card
      className={`overflow-hidden hover:shadow-lg transition-shadow ${
        isSelected ? "ring-2 ring-blue-500" : ""}`}
    >
      <CardContent className="p-0">
        <div className="overflow-hidden relative w-full h-48 border-border">
          {nft.image ? (
            <img
              src={nft.image}
              alt={nft.name}
              className="object-contain w-full h-full"
            />
          ) : (
            <div className="flex justify-center items-center w-full h-full">
              <span className="font-body text-slate-700">PACK #{nft.id}</span>
            </div>
          )}

          {/* Batch Selection Checkbox */}
          {batchMode && (
            <div className="absolute top-2 right-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleSelection?.(nft.id);
                }}
                className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
                  isSelected
                    ? "text-white bg-blue-500 border-blue-500"
                    : "bg-white border-gray-300 hover:border-blue-400"
                }`}
              >
                {isSelected && (
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            </div>
          )}

          {/* TODO: Future enhancement - Image display logic based on revealed/unrevealed state
              - Revealed (status: "rarity_assigned"): Show nft.metadata.imageUrl 
              - Unrevealed (status: "minted"): Show nft.metadata.unopenedImageUrl or keep current logic
          */}
        </div>
      </CardContent>
      <CardFooter
        className={`${
          nft.rarity ? getRarityBgColor(nft.rarity) : "bg-secondary"
        }`}
      >
        <div className="p-4 w-full">
          {/* name & token id */}
          <div className="flex justify-between w-full">
            <h4 className="mb-1 font-medium font-heading text-slate-900">
              GEO ART
            </h4>
            <h4 className="mb-1 font-medium font-heading text-slate-900">
              {`#${nft.id}`}
            </h4>
          </div>

          <div className="w-full">
            <div className="flex justify-between">
              {/* rarity and foil */}
              <div className="flex flex-col">
                {/* rarity */}
                <div
                  className={`text-sm font-body font-medium ${
                    nft.rarity === 0
                      ? "text-orange-600"
                      : nft.rarity
                      ? getRarityColor(nft.rarity)
                      : "text-slate-400"
                  }`}
                >
                  {nft.rarity === 0
                    ? "Unpacked"
                    : nft.rarity
                    ? getRarityName(nft.rarity)
                    : "Unknown"}
                </div>

                {/* foil */}
                <div className="flex gap-2">
                  {nft.metadata?.foil && (
                    <div className="px-2 py-1 text-xs font-bold text-shadow-slate-300">
                      Foil : {nft.metadata.foil}
                    </div>
                  )}
                </div>
              </div>

              {/* price and button */}
              <div className="flex gap-2 justify-between items-center">
                {/* Transaction Buttons - Only show in user's collection */}
                {showActions && (
                  <div className="flex flex-col gap-2">
                    {/* Sell Price - Show for both revealed and unrevealed NFTs */}
                    <div className="text-right">
                      {formatSellPrice() ? (
                        <div className="text-xs">
                          <div className="font-semibold text-green-600">
                            {formatSellPrice()?.eth} ETH
                          </div>
                          {formatSellPrice()?.usd && (
                            <div className="text-gray-500">
                              ${formatSellPrice()?.usd}
                            </div>
                          )}
                        </div>
                      ) : (
                        <Skeleton className="ml-auto w-16 h-4" />
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      {/* SELL Button - Redirects to VibeMarket */}
                      <VibeMarketRedirectButton
                        nft={nft}
                        className="px-2 py-1"
                      />

                      {/* UNPACK Button - Only for unrevealed NFTs */}
                      {nft.status === "minted" && (
                        <Button
                          size="sm"
                          onClick={handleUnpack}
                          disabled={
                            isPending ||
                            isConfirming ||
                            !nft.tokenId ||
                            !entropyFee
                          }
                          className="px-2 py-1 text-xs bg-orange-600 hover:bg-orange-700"
                        >
                          {isPending && pendingAction === "unpack"
                            ? "..."
                            : "UNPACK"}
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardFooter>

      {/* Confirmation Dialog (UNPACK only) */}
      {showConfirmDialog && (
        <div className="flex fixed inset-0 z-[1040] justify-center items-center duration-200 bg-black/50 animate-in fade-in">
          <div className="p-6 mx-6 max-w-md bg-white border border-gray-200 duration-200 animate-in zoom-in-95">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Confirm UNPACK
            </h3>

            <div className="mb-6 space-y-2 text-sm text-gray-600">
              <p>NFT: {nft.name || `#${nft.id}`}</p>
              <p>
                Rarity:{" "}
                {nft.rarity === 0 ? "Unpacked" : getRarityName(nft.rarity || 1)}
              </p>

              {entropyFee && (
                <div className="p-2 bg-blue-50 rounded border border-blue-200">
                  <p className="text-sm font-semibold text-blue-800">
                    Entropy Fee:{" "}
                    {parseFloat(formatEther(entropyFee as bigint)).toFixed(6)}{" "}
                    ETH
                  </p>
                  <p className="text-xs text-blue-600">
                    Required for Pyth Network randomness
                  </p>
                </div>
              )}
              <p className="font-medium text-orange-600">
                This will reveal your packs's rarity using secure randomness
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={isPending || isConfirming}
                className="flex-1 px-4 py-2 text-white bg-orange-600 border border-orange-600 disabled:opacity-50 hover:bg-orange-700"
              >
                {isPending || isConfirming ? "Processing..." : "Confirm UNPACK"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Status */}
      {error && (
        <div className="p-2 mt-2 text-xs text-red-700 bg-red-100 rounded border border-red-400">
          Transaction failed: {error.message}
        </div>
      )}

      {isSuccess && (
        <div className="p-2 mt-2 text-xs text-green-700 bg-green-100 rounded border border-green-400">
          Transaction successful!
          {hash && (
            <a
              href={`https://basescan.org/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 text-blue-600 underline"
            >
              View on BaseScan
            </a>
          )}
        </div>
      )}
    </Card>
  );
}

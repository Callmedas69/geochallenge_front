/**
 * @title Open Pack Success Modal Component
 * @notice Displays success state after opening booster packs
 * @dev Shows pack image with rarity breakdown and rotating wait messages
 */

"use client";

import React, { useEffect } from "react";
import type { Address } from "viem";
import { useContractInfo, useOpenRarity } from "@/hooks/useVibeAPI";
import { RARITY_MAP } from "@/lib/validateCollection";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Loader2, CheckCircle2, CircleX } from "lucide-react";
interface OpenPackSuccessModalProps {
  /** BoosterDrop contract address to fetch pack image */
  collectionAddress: Address;
  /** Number of packs opened */
  quantity: number;
  /** Transaction hash from opening packs */
  transactionHash: `0x${string}` | undefined;
  /** Modal open state */
  open: boolean;
  /** Callback when modal closes */
  onClose: () => void;
  /** Optional: Callback when user closes modal (triggered with delay for VRF) */
  onPacksOpened?: () => void;
}

export function OpenPackSuccessModal({
  collectionAddress,
  quantity,
  transactionHash,
  open,
  onClose,
  onPacksOpened,
}: OpenPackSuccessModalProps) {
  const { data: contractInfo, loading } = useContractInfo(collectionAddress);

  // Rotating playful messages for VRF wait state
  const messages = [
    "Summoning cards...",
    "Magic happening...",
    "Creating your cards...",
    "Brewing some magic...",
    "Crafting rarities...",
  ];

  const [messageIndex, setMessageIndex] = React.useState(0);
  const rotatingMessage = messages[messageIndex];

  // Rotate messages every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Fetch rarity breakdown after successful opening
  // Only trigger when transaction hash is available
  const { data: rarityData, loading: loadingRarity } = useOpenRarity(
    transactionHash,
    collectionAddress,
    !!transactionHash // Enable only when hash exists
  );

  // Debug logging
  useEffect(() => {
    if (rarityData) {
      console.log("[OpenPackSuccessModal] Rarity data received:", rarityData);
      console.log("[OpenPackSuccessModal] Loading state:", loadingRarity);
    }
  }, [rarityData, loadingRarity]);

  // Get pack image from contract info
  const packImage = contractInfo?.contractInfo?.packImage;

  // Handle modal close
  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="border-none bg-transparent shadow-none">
        <DialogTitle className="sr-only"></DialogTitle>

        {/* Close Icon - Top Right */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-50 rounded-full p-2 hover:bg-white/10 transition-colors"
          aria-label="Close"
        >
          <CircleX className="h-12 w-12 text-white/80 hover:text-white" />
        </button>

        {/* Content: Clean centered style */}
        <div className="flex flex-col items-center justify-center h-full py-6 px-4">
          {loadingRarity ? (
            // Loading State - Rotating messages while fetching rarity
            <div className="text-center space-y-4 py-12 animate-in fade-in duration-500">
              <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
              <p className="text-lg font-medium text-white">{rotatingMessage}</p>
            </div>
          ) : rarityData?.success && rarityData.rarities ? (
            // Success State - Show rarity breakdown
            <div className="text-center space-y-4 py-12 animate-in fade-in duration-500">
              <CheckCircle2 className="h-12 w-12 mx-auto text-green-500" />
              <div className="space-y-2">
                <p className="text-lg font-medium text-white">{quantity} pack(s) opened!</p>
                <div className="text-base text-white/90">
                  {Object.entries(rarityData.rarities)
                    .filter(([_, count]) => count > 0)
                    .map(([rarity, count]) => (
                      <div key={rarity}>
                        • {count}x {RARITY_MAP[Number(rarity)]}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ) : (
            // Fallback - Still waiting
            <div className="text-center space-y-4 py-12 animate-in fade-in duration-500">
              <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
              <p className="text-lg font-medium text-white">{rotatingMessage}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

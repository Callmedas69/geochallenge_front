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
import {
  Dialog,
  DialogTitle,
  DialogPortal,
  DialogOverlay,
} from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Loader2, CheckCircle2, CircleX, BadgeCheck } from "lucide-react";
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
      <DialogPortal>
        {/* Custom transparent overlay - no darkening effect */}
        <DialogOverlay className="bg-transparent" />

        <DialogPrimitive.Content className="shadow-2xl bg-white-500 backdrop-filter backdrop-blur-lg bg-opacity-40 border border-gray-100 fixed top-[50%] left-[50%] z-50 w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] duration-200 sm:max-w-lg rounded-lg p-6">
          <DialogTitle className="sr-only"></DialogTitle>

          {/* Close Icon - Top Right */}
          <button
            onClick={handleClose}
            className="absolute -top-1 -right-1 z-50 rounded-full p-2 transition-colors"
            aria-label="Close"
          >
            <CircleX className="h-12 w-12 text-black/80 hover:text-black" />
          </button>

          {/* Content: Clean centered style */}
          <div className="flex flex-col items-center justify-center h-full py-6 px-4">
            {loadingRarity ? (
              // Loading State - Rotating messages while fetching rarity
              <div className="text-center space-y-4 py-12 animate-in fade-in duration-500">
                <p className="text-xl font-medium text-black/80">
                  {rotatingMessage}
                </p>
              </div>
            ) : rarityData?.success && rarityData.rarities ? (
              // Success State - Show rarity breakdown
              <div className="text-center space-y-4 py-12 animate-in fade-in duration-500">
                <BadgeCheck className="h-12 w-12 mx-auto text-black/80 hover:text-black animate-bounce" />
                <div className="space-y-2">
                  <p className="text-2xl font-medium text-black uppercase">
                    {quantity} pack(s) opened!
                  </p>
                  <div className="text-xl text-black">
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
                <p className="text-lg font-medium text-black">
                  {rotatingMessage}
                </p>
              </div>
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}

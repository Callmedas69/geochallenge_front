/**
 * @title Open Pack Success Modal Component
 * @notice Displays success state after opening booster packs
 * @dev Shows pack image with rarity breakdown and rotating wait messages
 */

"use client";

import React, { useEffect, useRef } from "react";
import type { Address } from "viem";
import { useContractInfo, useOpenRarity } from "@/hooks/useVibeAPI";
import { useRotatingText } from "@/hooks/useRotatingText";
import { RARITY_MAP } from "@/lib/validateCollection";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle2, CircleX } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

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

// Bouncing text animation component
function BouncingText({ text }: { text: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (containerRef.current) {
      gsap.to(".char", {
        y: -8,
        duration: 0.5,
        stagger: {
          each: 0.05,
          repeat: -1,
          yoyo: true,
          ease: "bounce.out",
        },
      });
    }
  }, [text]);

  return (
    <div ref={containerRef} className="inline-flex">
      {text.split("").map((char, i) => (
        <span key={i} className="char inline-block">
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </div>
  );
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

  // Handle modal close - call callback with delay for VRF
  const handleClose = () => {
    if (onPacksOpened) {
      // Delay refetch to allow VRF to complete (30 seconds)
      // This prevents premature refetch before cards receive rarity_assigned status
      setTimeout(() => {
        onPacksOpened();
      }, 30000);
    }
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

        {/* Content: Pack image with overlaid text */}
        <div className="flex flex-col items-center justify-between h-full py-6 px-4">
          <div className="w-full max-w-sm space-y-3">
            {/* Success State with Rarity Breakdown */}
            <Alert className="bg-black/20 border-black/50 backdrop-blur-sm">
              <AlertDescription className="text-green-100 text-lg">
                <strong>Great!</strong> {quantity} pack(s) opened!
                {loadingRarity ? (
                  <div className="mt-2 flex items-center gap-2 text-xl">
                    <Loader2 className="h-3 w-3 animate-spin flex-shrink-0" />
                    <BouncingText text={rotatingMessage} />
                  </div>
                ) : rarityData?.success && rarityData.rarities ? (
                  <div className="mt-2 text-sm font-medium">
                    {Object.entries(rarityData.rarities)
                      .filter(([_, count]) => count > 0)
                      .map(([rarity, count]) => (
                        <span key={rarity} className="mr-3">
                          • {count}x {RARITY_MAP[Number(rarity)]}
                        </span>
                      ))}
                  </div>
                ) : (
                  <div className="mt-1 text-sm">
                    <BouncingText text={rotatingMessage} />
                  </div>
                )}
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

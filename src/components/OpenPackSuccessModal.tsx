/**
 * @title Open Pack Success Modal Component
 * @notice Displays success state after opening booster packs
 * @dev Shows pack image with rarity breakdown and rotating wait messages
 */

"use client";

import React, { useState, useEffect } from "react";
import type { Address } from "viem";
import { useContractInfo, useOpenRarity } from "@/hooks/useVibeAPI";
import { useRotatingText } from "@/hooks/useRotatingText";
import { RARITY_MAP } from "@/lib/validateCollection";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle2 } from "lucide-react";

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

  // Rotating text for VRF wait state
  const rotatingMessage = useRotatingText(3000);

  // Fetch rarity breakdown after successful opening
  const { data: rarityData, loading: loadingRarity } = useOpenRarity(
    transactionHash,
    collectionAddress
  );

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
        <DialogTitle className="sr-only">Booster Packs Opened Successfully</DialogTitle>
        {/* Content: Pack image with overlaid text */}
        <div className="flex flex-col items-center justify-between h-full py-6 px-4">
          {/* Pack image with OPENED text overlay */}
          <div className="relative w-full max-w-sm mb-4 flex-shrink">
            {loading ? (
              <div className="aspect-square flex items-center justify-center bg-white/10 rounded-lg backdrop-blur-sm">
                <Loader2 className="h-12 w-12 animate-spin text-white" />
              </div>
            ) : packImage ? (
              <>
                <img
                  src={packImage}
                  alt={`Pack x${quantity}`}
                  className="w-full h-auto rounded-lg shadow-2xl"
                />
                {/* OPENED text - bottom right, slightly outside */}
                <div className="absolute bottom-5 right-[-10px] pointer-events-none">
                  <h2 className="text-white text-9xl italic font-extrabold [text-shadow:0_0_10px_#00aaff,0_0_20px_#37f0e4,0_0_40px_#009fff] p-0 m-0">
                    x{quantity}
                  </h2>
                </div>
              </>
            ) : (
              <div className="aspect-square flex items-center justify-center bg-white/10 rounded-lg backdrop-blur-sm">
                <span className="text-white/70 text-sm">No pack image</span>
              </div>
            )}
          </div>

          {/* Bottom section: Rarity breakdown + Close button */}
          <div className="w-full max-w-sm space-y-3">
            {/* Success State with Rarity Breakdown */}
            <Alert className="bg-green-500/20 border-green-500/50 backdrop-blur-sm">
              <CheckCircle2 className="h-4 w-4 text-green-400" />
              <AlertDescription className="text-green-100">
                <strong>Success!</strong> {quantity} pack(s) opened!
                {loadingRarity ? (
                  <div className="mt-2 flex items-center gap-2 text-sm">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>{rotatingMessage}</span>
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
                  <div className="mt-1 text-sm">{rotatingMessage}</div>
                )}
              </AlertDescription>
            </Alert>

            {/* Close Button */}
            <div className="flex gap-3 w-full">
              <Button
                size="lg"
                className="flex-1 text-lg font-semibold shadow-xl"
                onClick={handleClose}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * @title Pack Success Modal Component
 * @notice Displays success state after purchasing booster packs
 * @dev Fully transparent modal with pack image and quantity display
 */

"use client";

import React from "react";
import type { Address } from "viem";
import { useContractInfo } from "@/hooks/useVibeAPI";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { CircleX, Loader2 } from "lucide-react";

interface PackSuccessModalProps {
  /** BoosterDrop contract address to fetch pack image */
  collectionAddress: Address;
  /** Number of packs purchased */
  quantity: number;
  /** Token IDs of minted packs */
  tokenIds: bigint[];
  /** Modal open state */
  open: boolean;
  /** Callback when modal closes */
  onClose: () => void;
  /** Optional: Callback when packs are opened (triggered on modal close) */
  onPacksOpened?: () => void;
}

export function PackSuccessModal({
  collectionAddress,
  quantity,
  tokenIds,
  open,
  onClose,
  onPacksOpened,
}: PackSuccessModalProps) {
  const { data: contractInfo, loading } = useContractInfo(collectionAddress);

  // Get pack image from contract info
  const packImage = contractInfo?.contractInfo?.packImage;

  // Handle modal close
  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="border-none bg-transparent shadow-none">
        <DialogTitle className="sr-only">Booster Packs Acquired</DialogTitle>

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
          {/* Pack image with ACQUIRED text overlay */}
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
                {/* ACQUIRED text - bottom right, slightly outside */}
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
        </div>
      </DialogContent>
    </Dialog>
  );
}

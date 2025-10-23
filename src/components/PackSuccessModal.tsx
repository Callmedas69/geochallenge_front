/**
 * @title Pack Success Modal Component
 * @notice Displays success state after purchasing booster packs
 * @dev Fully transparent modal with pack image and quantity display
 */

"use client";

import React, { useRef } from "react";
import type { Address } from "viem";
import { useContractInfo } from "@/hooks/useVibeAPI";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { CircleX, Loader2 } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

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
  const packImageRef = useRef<HTMLDivElement>(null);
  const quantityRef = useRef<HTMLDivElement>(null);

  // Get pack image from contract info
  const packImage = contractInfo?.contractInfo?.packImage;

  // GSAP pop animation - staggered elastic bounce
  useGSAP(() => {
    if (open && !loading && packImage && packImageRef.current && quantityRef.current) {
      // Set initial state (invisible and scaled down)
      gsap.set([packImageRef.current, quantityRef.current], {
        scale: 0,
        opacity: 0
      });

      // Animate pack image first with elastic bounce
      gsap.to(packImageRef.current, {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        ease: "elastic.out(1, 0.5)"
      });

      // Animate quantity text 0.2s later with same elastic bounce
      gsap.to(quantityRef.current, {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        delay: 0.2,
        ease: "elastic.out(1, 0.5)"
      });
    }
  }, [open, loading, packImage]);

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
                {/* Pack image with animation */}
                <div ref={packImageRef}>
                  <img
                    src={packImage}
                    alt={`Pack x${quantity}`}
                    className="w-full h-auto rounded-lg shadow-2xl"
                  />
                </div>
                {/* Quantity text with animation - bottom right, slightly outside */}
                <div ref={quantityRef} className="absolute bottom-5 right-[-10px] pointer-events-none">
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

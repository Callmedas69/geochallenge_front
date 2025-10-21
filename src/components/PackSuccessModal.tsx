/**
 * @title Pack Success Modal Component
 * @notice Displays success state after purchasing booster packs
 * @dev Fully transparent modal with pack image and quantity display
 */

"use client";

import React, { useState, useEffect } from "react";
import type { Address } from "viem";
import { useContractInfo } from "@/hooks/useVibeAPI";
import { useOpenPacks } from "@/hooks/useOpenPacks";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { X, Loader2, Package, CheckCircle2, AlertCircle } from "lucide-react";

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

  // Track if packs were opened in this session
  const [packsWereOpened, setPacksWereOpened] = useState(false);

  // Use pack opening hook with minted token IDs
  const {
    open: openPacks,
    isOpening,
    isSuccess: openSuccess,
    error: openError,
  } = useOpenPacks({
    collectionAddress,
    tokenIds, // Pass minted token IDs directly
  });

  // Get pack image from contract info
  const packImage = contractInfo?.contractInfo?.packImage;

  // Track when packs are successfully opened
  useEffect(() => {
    if (openSuccess) {
      setPacksWereOpened(true);
    }
  }, [openSuccess]);

  // Reset tracking when modal closes
  useEffect(() => {
    if (!open) {
      setPacksWereOpened(false);
    }
  }, [open]);

  // Handle opening packs
  const handleOpen = () => {
    openPacks();
  };

  // Handle modal close - call callback if packs were opened
  const handleClose = () => {
    if (packsWereOpened && onPacksOpened) {
      onPacksOpened();
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="border-none bg-transparent shadow-none max-w-md p-0 gap-0"
        style={{ backgroundColor: "transparent" }}
      >
        {/* Close button */}
        <DialogClose className="absolute right-4 top-4 z-50 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-6 w-6 text-white drop-shadow-lg" />
          <span className="sr-only">Close</span>
        </DialogClose>

        {/* Content: Pack image with overlaid text */}
        <div className="flex flex-col items-center justify-center py-8 px-4">
          {/* Pack image with ACQUIRED text overlay */}
          <div className="relative w-full max-w-sm mb-6">
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
                <div className="absolute bottom-[-20px] right-[-20px] pointer-events-none">
                  <h2 className="text-white text-3xl font-extrabold [text-shadow:0_0_10px_#00aaff,0_0_20px_#37f0e4,0_0_40px_#009fff]">
                    ACQUIRED x{quantity}
                  </h2>
                </div>
              </>
            ) : (
              <div className="aspect-square flex items-center justify-center bg-white/10 rounded-lg backdrop-blur-sm">
                <span className="text-white/70 text-sm">No pack image</span>
              </div>
            )}
          </div>

          {/* Success/Error States */}
          {openSuccess && (
            <Alert className="bg-green-500/20 border-green-500/50 backdrop-blur-sm">
              <CheckCircle2 className="h-4 w-4 text-green-400" />
              <AlertDescription className="text-green-100">
                <strong>Packs opened!</strong> Randomness is being processed...
              </AlertDescription>
            </Alert>
          )}

          {openError && (
            <Alert className="bg-red-500/20 border-red-500/50 backdrop-blur-sm">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-100">
                {openError}
              </AlertDescription>
            </Alert>
          )}

          {/* Action buttons: Close | Open xX */}
          <div className="flex gap-3 w-full max-w-xs">
            <Button
              size="lg"
              variant="outline"
              className="flex-1 text-lg font-semibold shadow-xl bg-white/10 hover:bg-white/20 text-white border-white/30"
              onClick={handleClose}
              disabled={isOpening}
            >
              Close
            </Button>
            <Button
              size="lg"
              className="flex-1 text-lg font-semibold shadow-xl"
              onClick={handleOpen}
              disabled={isOpening || openSuccess}
            >
              {isOpening ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Opening...
                </>
              ) : openSuccess ? (
                <>
                  <CheckCircle2 className="mr-2 h-5 w-5" />
                  Opened
                </>
              ) : (
                <>
                  <Package className="mr-2 h-5 w-5" />x{quantity}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

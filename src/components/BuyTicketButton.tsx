/**
 * @title BuyTicketButton Component
 * @notice Simple button to purchase competition tickets
 * @dev KISS principle: Clear states, professional UX, proper error handling
 */

"use client";

import { useEffect } from "react";
import { useBuyTicket } from "@/hooks/useUserActions";
import { useUserTicketBalance } from "@/hooks/usePublicCompetitions";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import { CheckCircle, Loader2, Ticket } from "lucide-react";
import { parseTransactionError } from "@/lib/parseTransactionError";

interface BuyTicketButtonProps {
  competitionId: bigint;
  ticketPrice: bigint;
  collectionAddress: string;
  disabled?: boolean;
}

export function BuyTicketButton({
  competitionId,
  ticketPrice,
  collectionAddress,
  disabled = false,
}: BuyTicketButtonProps) {
  const { address, isConnecting } = useAccount();
  const { buyTicket, isPending, isConfirming, isSuccess, error } =
    useBuyTicket();
  const {
    data: ticketBalance,
    isLoading: checkingBalance,
    refetch,
  } = useUserTicketBalance(address, competitionId);

  // Auto-refetch ticket balance when ticket purchase succeeds
  useEffect(() => {
    if (isSuccess) {
      refetch();
    }
  }, [isSuccess, refetch]);

  const handleBuyTicket = () => {
    buyTicket(competitionId, ticketPrice);
  };

  // Already owns ticket
  if (ticketBalance && ticketBalance > BigInt(0)) {
    return (
      <Alert className="border-green-500 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          You already own a ticket for this competition
        </AlertDescription>
      </Alert>
    );
  }

  // Success state
  if (isSuccess) {
    return (
      <Alert className="border-green-500 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800 font-semibold">
          ✅ Ticket purchased successfully!
        </AlertDescription>
      </Alert>
    );
  }

  // Checking ticket balance
  if (checkingBalance) {
    return (
      <Button disabled className="w-full" size="lg">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Checking ticket status...
      </Button>
    );
  }

  // Connecting wallet (auto-connect in progress)
  if (isConnecting) {
    return (
      <Button disabled className="w-full" size="lg">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Connecting Wallet...
      </Button>
    );
  }

  // Not connected and auto-connect failed
  if (!address) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Connect your wallet please</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-3">
      <Button
        onClick={handleBuyTicket}
        disabled={isPending || isConfirming || disabled}
        className="w-full"
        size="lg"
      >
        {isPending && (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Approval...
          </>
        )}
        {isConfirming && (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Confirming...
          </>
        )}
        {!isPending && !isConfirming && (
          <>
            <Ticket className="mr-2 h-4 w-4" />
            Buy Ticket - {formatEther(ticketPrice)} ETH
          </>
        )}
      </Button>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{parseTransactionError(error)}</AlertDescription>
        </Alert>
      )}

      {/* Info - Only show when button is ready */}
      {/* {!isPending && !isConfirming && !error && (
        <p className="text-xs text-muted-foreground text-center">
          Required: Own NFT from {collectionAddress.slice(0, 6)}...
          {collectionAddress.slice(-4)}
        </p>
      )} */}
    </div>
  );
}

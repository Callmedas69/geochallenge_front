/**
 * @title Unclaimed Prizes Section
 * @notice Simple list of unclaimed prizes - one line per prize
 * @dev KISS principle - competition name, amount, button. That's it.
 */

"use client";

import { useMemo } from "react";
import { useAccount, useReadContract } from "wagmi";
import { formatEther } from "viem";
import { useCompetitionById } from "@/hooks/usePublicCompetitions";
import {
  useClaimPrize,
  useClaimParticipantPrize,
  useClaimRefund,
} from "@/hooks/useUserActions";
import {
  calculateWinnerPrize,
  calculateParticipantPrizeWithWinner,
  calculateRefundAmount,
  calculateEmergencyRefund,
} from "@/lib/prizeCalculations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Gift } from "lucide-react";
import Link from "next/link";
import { geoChallenge_implementation_ABI } from "@/abi";
import { CONTRACT_ADDRESSES } from "@/lib/contractList";
import { DECIMALS } from "@/lib/displayConfig";

interface UnclaimedPrizesSectionProps {
  claimableCompIds: readonly bigint[] | undefined;
  isLoading?: boolean;
}

/**
 * Single prize row - one line: name | amount | button
 */
function UnclaimedPrizeRow({ competitionId }: { competitionId: bigint }) {
  const { address } = useAccount();
  const { data: competition, isLoading } = useCompetitionById(competitionId);

  // Fetch metadata
  const { data: metadata } = useReadContract({
    address: CONTRACT_ADDRESSES.GeoChallenge,
    abi: geoChallenge_implementation_ABI,
    functionName: "getCompetitionMetadata",
    args: [competitionId],
    query: { staleTime: 30000 },
  });

  // Fetch participant prize per ticket
  const { data: participantPrizePerTicket } = useReadContract({
    address: CONTRACT_ADDRESSES.GeoChallenge,
    abi: geoChallenge_implementation_ABI,
    functionName: "participantPrizePerTicket",
    args: [competitionId],
    query: { staleTime: 30000 },
  });

  // Claim hooks
  const winnerClaim = useClaimPrize();
  const participantClaim = useClaimParticipantPrize();
  const refundClaim = useClaimRefund();

  // Determine prize type and amount
  const prize = useMemo(() => {
    if (!competition || !address || competition.state !== 3) return null;

    const isWinner =
      address && competition.winner.toLowerCase() === address.toLowerCase();

    // Winner Prize
    if (isWinner && competition.winnerDeclared) {
      return {
        type: "winner" as const,
        amount: calculateWinnerPrize(competition.prizePool),
      };
    }

    // Participant Prize
    const hasParticipant =
      participantPrizePerTicket !== undefined && participantPrizePerTicket > 0n;
    if (hasParticipant) {
      const amount = competition.winnerDeclared
        ? calculateParticipantPrizeWithWinner(
            competition.prizePool,
            competition.totalTickets
          )
        : participantPrizePerTicket!;
      return {
        type: "participant" as const,
        amount,
        hasWinner: competition.winnerDeclared,
      };
    }

    // Refund
    const isCancelled =
      !competition.winnerDeclared &&
      (participantPrizePerTicket === undefined ||
        participantPrizePerTicket === BigInt(0));

    if (isCancelled) {
      const amount =
        competition.emergencyPaused && competition.prizePool > 0n
          ? calculateEmergencyRefund(
              competition.prizePool,
              competition.totalTickets
            )
          : calculateRefundAmount(
              competition.ticketPrice,
              competition.treasuryPercent
            );
      return { type: "refund" as const, amount };
    }

    return null;
  }, [competition, address, participantPrizePerTicket]);

  // Handle claim
  const handleClaim = async () => {
    if (!prize) return;
    try {
      if (prize.type === "winner") await winnerClaim.claimPrize(competitionId);
      else if (prize.type === "participant")
        await participantClaim.claimParticipantPrize(competitionId);
      else await refundClaim.claimRefund(competitionId);
    } catch (err) {
      console.error("Claim failed:", err);
    }
  };

  const isPending =
    winnerClaim.isPending ||
    winnerClaim.isConfirming ||
    participantClaim.isPending ||
    participantClaim.isConfirming ||
    refundClaim.isPending ||
    refundClaim.isConfirming;

  const isSuccess =
    winnerClaim.isSuccess ||
    participantClaim.isSuccess ||
    refundClaim.isSuccess;

  if (isLoading) {
    return (
      <div className="flex items-center justify-between py-2 border-b">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-9 w-24" />
      </div>
    );
  }

  if (!competition || !prize) return null;

  const competitionName = metadata?.[0] || `Competition #${competitionId}`;
  const amountETH = parseFloat(formatEther(prize.amount)).toFixed(
    DECIMALS.FARCASTER
  );

  if (isSuccess) {
    return (
      <div className="flex items-center justify-between py-2 border-b bg-green-50">
        <Link
          href={`/competition/${competitionId}`}
          className="text-sm font-medium hover:underline truncate flex-1"
        >
          {competitionName}
        </Link>
        <span className="text-sm font-bold text-green-600 mx-4">
          {amountETH} ETH
        </span>
        <span className="text-xs text-green-600">✓ Claimed</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between py-2 border-b hover:bg-muted/50">
      <Link
        href={`/competition/${competitionId}`}
        className="text-sm font-medium hover:underline truncate flex-1 !text-black"
      >
        {competitionName}
      </Link>
      <span className="text-sm font-bold mx-4 whitespace-nowrap">
        {amountETH} ETH
      </span>
      <Button
        onClick={handleClaim}
        disabled={isPending}
        size="sm"
        className="whitespace-nowrap"
      >
        {isPending ? (
          <>
            <Loader2 className="h-3 w-3 animate-spin mr-1" />
            Claiming...
          </>
        ) : (
          "Claim"
        )}
      </Button>
    </div>
  );
}

/**
 * Main component - simple card with rows
 */
export function UnclaimedPrizesSection({
  claimableCompIds,
  isLoading,
}: UnclaimedPrizesSectionProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!claimableCompIds || claimableCompIds.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Gift className="h-5 w-5 text-yellow-600" />
          Unclaimed Prizes ({claimableCompIds.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y px-6 pb-4">
          {claimableCompIds.map((compId) => (
            <UnclaimedPrizeRow key={compId.toString()} competitionId={compId} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

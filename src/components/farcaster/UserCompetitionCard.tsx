/**
 * @title UserCompetitionCard Component (Farcaster)
 * @notice Mobile-optimized card for user's competition participation
 * @dev KISS principle: Show name, progress (if active), and claim button inline
 * @dev Optimized: No ticket count, skip progress for completed competitions
 */

"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useCompetitionById } from "@/hooks/usePublicCompetitions";
import { useProgressCalculator } from "@/hooks/useVibeAPI";
import { useHasClaimedWinnerPrize, useHasClaimedParticipantPrize } from "@/hooks/useUserDashboard";
import { useAccount, useReadContract } from "wagmi";
import { CheckCircle, Gift, Trophy } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { formatEther } from "viem";
import { geoChallenge_implementation_ABI } from "@/abi";
import { CONTRACT_ADDRESSES } from "@/lib/contractList";
import { DECIMALS } from "@/lib/displayConfig";
import {
  calculateWinnerPrize,
  calculateParticipantPrizeWithWinner,
  calculateRefundAmount,
  calculateEmergencyRefund,
} from "@/lib/prizeCalculations";
import { ClaimButton } from "./ClaimButton";

interface UserCompetitionCardProps {
  competitionId: bigint;
  isActive?: boolean; // Hint to skip progress calc for completed
}

export function UserCompetitionCard({
  competitionId,
  isActive = true,
}: UserCompetitionCardProps) {
  const { address } = useAccount();
  const { data: competition, isLoading } = useCompetitionById(competitionId);

  // Fetch competition metadata
  const { data: metadata } = useReadContract({
    address: CONTRACT_ADDRESSES.GeoChallenge,
    abi: geoChallenge_implementation_ABI,
    functionName: "getCompetitionMetadata",
    args: [competitionId],
    query: {
      staleTime: 60000,
    },
  });

  // Fetch participant prize per ticket (for claim button)
  const { data: participantPrizePerTicket } = useReadContract({
    address: CONTRACT_ADDRESSES.GeoChallenge,
    abi: geoChallenge_implementation_ABI,
    functionName: "participantPrizePerTicket",
    args: [competitionId],
    query: {
      staleTime: 30000,
    },
  });

  // Check claim status
  const { data: hasClaimedWinner } = useHasClaimedWinnerPrize(competitionId);
  const { data: hasClaimedParticipant } = useHasClaimedParticipantPrize(
    competitionId,
    address
  );
  const { data: hasClaimedRefund } = useReadContract({
    address: CONTRACT_ADDRESSES.GeoChallenge,
    abi: geoChallenge_implementation_ABI,
    functionName: "refundsClaimed",
    args: address ? [competitionId, address] : undefined,
    query: {
      enabled: !!address,
      staleTime: 30000,
    },
  });

  // Only get progress for ACTIVE competitions (performance optimization)
  const shouldFetchProgress = competition?.state === 1 && isActive;
  const { progress, loading: loadingProgress } = useProgressCalculator(
    shouldFetchProgress ? address || "" : "",
    shouldFetchProgress ? competition?.collectionAddress || "" : "",
    shouldFetchProgress ? competition?.rarityTiers || [] : []
  );

  // Calculate progress percentage
  const progressPercent = useMemo(() => {
    if (!progress || !progress.totalRequired || progress.totalRequired === 0)
      return 0;
    return Math.round((progress.totalOwned / progress.totalRequired) * 100);
  }, [progress]);

  // State mapping
  const getStateInfo = (state: number) => {
    const stateMap = [
      { label: "Not Started", color: "bg-gray-500" },
      { label: "Active", color: "bg-green-500" },
      { label: "Ended", color: "bg-blue-500" },
      { label: "Finalized", color: "bg-purple-500" },
      { label: "Cancelled", color: "bg-red-500" },
    ];
    return stateMap[state] || { label: "Unknown", color: "bg-gray-500" };
  };

  // Calculate claimable prizes and refunds
  const calculatedPrizes = useMemo(() => {
    if (!competition) {
      return { winnerPrize: 0n, participantPrize: 0n, refundAmount: 0n };
    }

    let winnerPrize = 0n;
    let participantPrize = 0n;
    let refundAmount = 0n;

    if (competition.state === 3) {
      // Finalized state
      if (competition.winnerDeclared) {
        // Has winner
        winnerPrize = calculateWinnerPrize(competition.prizePool);
        participantPrize = participantPrizePerTicket || 0n;
      } else {
        // No winner - check for refund
        const hasParticipantPrize =
          participantPrizePerTicket && participantPrizePerTicket > 0n;

        if (!hasParticipantPrize) {
          // Cancelled - calculate refund
          if (competition.emergencyPaused && competition.prizePool > 0n) {
            refundAmount = calculateEmergencyRefund(
              competition.prizePool,
              competition.totalTickets
            );
          } else {
            refundAmount = calculateRefundAmount(
              competition.ticketPrice,
              competition.treasuryPercent
            );
          }
        }
      }
    }

    return { winnerPrize, participantPrize, refundAmount };
  }, [competition, participantPrizePerTicket]);

  if (isLoading || !competition) {
    return null;
  }

  const stateInfo = getStateInfo(competition.state);
  const isCompActive = competition.state === 1;
  const isFinalized = competition.state === 3;
  const isComplete = progress?.isComplete || false;
  const competitionName =
    metadata?.[0] || `Competition #${competitionId.toString()}`;

  // Check if user is winner
  const isWinner = Boolean(
    address && competition.winner.toLowerCase() === address.toLowerCase()
  );

  // Check claimable status (including already claimed check)
  const canClaimWinner = Boolean(
    isWinner &&
    isFinalized &&
    calculatedPrizes.winnerPrize > 0n &&
    !hasClaimedWinner
  );
  const canClaimParticipant = Boolean(
    !isWinner &&
      isFinalized &&
      calculatedPrizes.participantPrize > 0n &&
      competition.winnerDeclared &&
      !hasClaimedParticipant
  );
  const canClaimRefund = Boolean(
    isFinalized &&
    calculatedPrizes.refundAmount > 0n &&
    !hasClaimedRefund
  );

  // Check if prize exists but already claimed
  const winnerAlreadyClaimed = Boolean(
    isWinner && isFinalized && calculatedPrizes.winnerPrize > 0n && hasClaimedWinner
  );
  const participantAlreadyClaimed = Boolean(
    !isWinner &&
      isFinalized &&
      calculatedPrizes.participantPrize > 0n &&
      competition.winnerDeclared &&
      hasClaimedParticipant
  );
  const refundAlreadyClaimed = Boolean(
    isFinalized && calculatedPrizes.refundAmount > 0n && hasClaimedRefund
  );
  const isCancelled = Boolean(
    isFinalized &&
      !competition.winnerDeclared &&
      (participantPrizePerTicket === undefined ||
        participantPrizePerTicket === 0n)
  );

  const competitionUrl = `/miniapps/competition/${competitionId.toString()}`;

  return (
    <Link href={competitionUrl} className="block">
      <Card className="cursor-pointer transition-colors hover:bg-accent/50">
        <CardContent className="p-3 space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-sm truncate flex-1 uppercase">
              {competitionName}
            </h3>
            <Badge
              className={`${stateInfo.color} text-white text-xs flex-shrink-0`}
            >
              {stateInfo.label}
            </Badge>
          </div>

          {/* Prize Pool Display */}
          {competition.prizePool > 0n && (
            <div className="flex items-center gap-2 text-xs">
              <Trophy className="h-4 w-4 text-yellow-600" />
              <span className="text-muted-foreground">Prize Pool:</span>
              <span className="font-bold text-foreground">
                {parseFloat(formatEther(competition.prizePool)).toFixed(DECIMALS.FARCASTER)} ETH
              </span>
            </div>
          )}

          {/* Progress Bar - Only for Active Competitions */}
          {isCompActive && !loadingProgress && progress && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  {progress.totalOwned}/{progress.totalRequired} cards
                </span>
                <span className="font-semibold">{progressPercent}%</span>
              </div>
              <Progress value={progressPercent} className="h-2" />
              {isComplete && (
                <div className="flex items-center gap-1 text-green-600 text-xs mt-1">
                  <CheckCircle className="h-3 w-3" />
                  <span className="font-medium">Collection Complete!</span>
                </div>
              )}
            </div>
          )}

          {/* Winner Badge */}
          {isWinner && (
            <div className="flex items-center gap-1 text-yellow-600 text-xs bg-yellow-50 p-2 rounded">
              <Gift className="h-3 w-3" />
              <span className="font-medium">You won this competition!</span>
            </div>
          )}

          {/* Action Buttons - Smart visibility based on state */}
          <div className="space-y-2">
            {/* Finalized: Show relevant claim button */}
            {isFinalized && (
              <>
                {/* Winner Prize - Only show for winners */}
                {isWinner && (canClaimWinner || winnerAlreadyClaimed) && (
                  <ClaimButton
                    enabled={canClaimWinner}
                    href={`/miniapps/competition/${competitionId.toString()}`}
                    amount={calculatedPrizes.winnerPrize}
                    label="Claim Winner Prize"
                    disabledText={winnerAlreadyClaimed ? "Already Claimed" : "Winner Prize (Not finalized)"}
                    variant="winner"
                  />
                )}

                {/* Participant Prize - Only show for non-winners when winner exists */}
                {!isWinner && competition.winnerDeclared && (canClaimParticipant || participantAlreadyClaimed) && (
                  <ClaimButton
                    enabled={canClaimParticipant}
                    href={`/miniapps/competition/${competitionId.toString()}`}
                    amount={calculatedPrizes.participantPrize}
                    label="Claim Participant Prize"
                    disabledText={participantAlreadyClaimed ? "Already Claimed" : "Participant Prize (Not available)"}
                    variant="participant"
                  />
                )}

                {/* Refund - Only show when cancelled (no winner) */}
                {!competition.winnerDeclared && isCancelled && (canClaimRefund || refundAlreadyClaimed) && (
                  <ClaimButton
                    enabled={canClaimRefund}
                    href={`/miniapps/competition/${competitionId.toString()}`}
                    amount={calculatedPrizes.refundAmount}
                    label="Claim Refund"
                    disabledText={refundAlreadyClaimed ? "Already Claimed" : "Refund (Not available)"}
                    variant="refund"
                  />
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

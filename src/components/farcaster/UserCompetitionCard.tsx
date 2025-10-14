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
import { useAccount, useReadContract } from "wagmi";
import { CheckCircle, ExternalLink, Gift } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { geoChallenge_implementation_ABI } from "@/abi";
import { CONTRACT_ADDRESSES } from "@/lib/contractList";
import {
  calculateWinnerPrize,
  calculateParticipantPrizeWithWinner,
} from "@/lib/prizeCalculations";
import { formatEther } from "viem";
import { DECIMALS } from "@/lib/displayConfig";

interface UserCompetitionCardProps {
  competitionId: bigint;
  isActive?: boolean; // Hint to skip progress calc for completed
}

export function UserCompetitionCard({ competitionId, isActive = true }: UserCompetitionCardProps) {
  const { address } = useAccount();
  const { data: competition, isLoading } = useCompetitionById(competitionId);

  // Fetch competition metadata
  const { data: metadata } = useReadContract({
    address: CONTRACT_ADDRESSES.baseSepolia.GeoChallenge,
    abi: geoChallenge_implementation_ABI,
    functionName: "getCompetitionMetadata",
    args: [competitionId],
    query: {
      staleTime: 60000,
    },
  });

  // Fetch participant prize per ticket (for claim button)
  const { data: participantPrizePerTicket } = useReadContract({
    address: CONTRACT_ADDRESSES.baseSepolia.GeoChallenge,
    abi: geoChallenge_implementation_ABI,
    functionName: "participantPrizePerTicket",
    args: [competitionId],
    query: {
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
    if (!progress || !progress.totalRequired || progress.totalRequired === 0) return 0;
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

  // Calculate claimable prizes
  const calculatedPrizes = useMemo(() => {
    if (!competition || competition.state !== 3) {
      return { winnerPrize: 0n, participantPrize: 0n };
    }

    const winnerPrize = competition.winnerDeclared
      ? calculateWinnerPrize(competition.prizePool)
      : 0n;

    const participantPrize =
      competition.winnerDeclared && participantPrizePerTicket
        ? participantPrizePerTicket
        : 0n;

    return { winnerPrize, participantPrize };
  }, [competition, participantPrizePerTicket]);

  if (isLoading || !competition) {
    return null;
  }

  const stateInfo = getStateInfo(competition.state);
  const isCompActive = competition.state === 1;
  const isFinalized = competition.state === 3;
  const isComplete = progress?.isComplete || false;
  const competitionName = metadata?.[0] || `Competition #${competitionId.toString()}`;

  // Check if user is winner
  const isWinner = address && competition.winner.toLowerCase() === address.toLowerCase();

  // Check claimable status
  const canClaimWinner = isWinner && isFinalized && calculatedPrizes.winnerPrize > 0n;
  const canClaimParticipant =
    !isWinner && isFinalized && calculatedPrizes.participantPrize > 0n && competition.winnerDeclared;

  return (
    <Card>
      <CardContent className="p-3 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/fc/competition/${competitionId.toString()}`}
            className="font-semibold text-sm hover:underline truncate flex-1"
          >
            {competitionName}
          </Link>
          <Badge className={`${stateInfo.color} text-white text-xs flex-shrink-0`}>
            {stateInfo.label}
          </Badge>
        </div>

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

        {/* Action Buttons */}
        <div className="flex gap-2">
          {/* Claim Winner Prize - Link to detail page */}
          {canClaimWinner && (
            <Button asChild className="flex-1 bg-yellow-600 hover:bg-yellow-700" size="sm">
              <Link href={`/fc/competition/${competitionId.toString()}`}>
                <Gift className="h-3 w-3 mr-1" />
                <span className="text-xs">Claim {parseFloat(formatEther(calculatedPrizes.winnerPrize)).toFixed(DECIMALS.FARCASTER)}Ξ</span>
              </Link>
            </Button>
          )}

          {/* Claim Participant Prize - Link to detail page */}
          {canClaimParticipant && (
            <Button asChild className="flex-1 bg-blue-600 hover:bg-blue-700" size="sm">
              <Link href={`/fc/competition/${competitionId.toString()}`}>
                <Gift className="h-3 w-3 mr-1" />
                <span className="text-xs">Claim {parseFloat(formatEther(calculatedPrizes.participantPrize)).toFixed(DECIMALS.FARCASTER)}Ξ</span>
              </Link>
            </Button>
          )}

          {/* View Details - Always show if no claimable prizes */}
          {!canClaimWinner && !canClaimParticipant && (
            <Button variant="outline" size="sm" asChild className="flex-1">
              <Link href={`/fc/competition/${competitionId.toString()}`}>
                <span className="text-xs">View Details</span>
                <ExternalLink className="h-3 w-3 ml-1" />
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

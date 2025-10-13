/**
 * @title Farcaster Competition Detail Page
 * @notice Optimized competition detail for Farcaster miniApps
 * @dev KISS principle: Compact layout, readable fonts, essential info
 * @dev Key changes from standard: Single column stats, larger fonts, sticky actions
 */

"use client";

import { use, useState, useCallback, useEffect, useMemo } from "react";
import {
  useCompetitionById,
  useUserTicketBalance,
} from "@/hooks/usePublicCompetitions";
import { BuyTicketButton } from "@/components/BuyTicketButton";
import {
  ClaimPrizeButton,
  ClaimParticipantPrizeButton,
  ClaimRefundButton,
} from "@/components/ClaimButtons";
import { SubmitWinnerProof } from "@/components/SubmitWinnerProof";
import { CollectionArtGallery } from "@/components/CollectionArtGallery";
import { getRarityName, getRarityColor } from "@/lib/types";
import {
  calculateWinnerPrize,
  calculateParticipantPrizeWithWinner,
  calculateParticipantPrizeNoWinner,
  calculateRefundAmount,
  calculateEmergencyRefund,
} from "@/lib/prizeCalculations";
import { useWatchTicketPurchased } from "@/hooks/useCompetitionEvents";
import {
  useContractInfo,
  useCollectionRarityStats,
  useProgressCalculator,
  useTicketMetadata,
  useCollectionArt,
} from "@/hooks/useVibeAPI";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { formatEther } from "viem";
import { useAccount, useReadContract } from "wagmi";
import {
  Trophy,
  Calendar,
  DollarSign,
  Clock,
  AlertTriangle,
  ExternalLink,
  Package,
  Ticket,
  TrendingUp,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { geoChallenge_implementation_ABI } from "@/abi";
import { CONTRACT_ADDRESSES } from "@/lib/contractList";
import { useAutoConnect } from "@/lib/farcaster";

interface CompetitionDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function FarcasterCompetitionDetailPage({
  params,
}: CompetitionDetailPageProps) {
  // Auto-connect Farcaster wallet
  useAutoConnect();

  const { id } = use(params);
  const competitionId = BigInt(id);
  const { address } = useAccount();

  const {
    data: competition,
    isLoading,
    error,
    refetch: refetchCompetition,
  } = useCompetitionById(competitionId);
  const { data: userTicketBalance } = useUserTicketBalance(
    address,
    competitionId
  );

  // Fetch competition metadata
  const { data: metadata, isLoading: loadingMetadata } = useReadContract({
    address: CONTRACT_ADDRESSES.baseSepolia.GeoChallenge,
    abi: geoChallenge_implementation_ABI,
    functionName: "getCompetitionMetadata",
    args: [competitionId],
    query: {
      staleTime: 30000,
      gcTime: 300000,
    },
  });

  // Fetch participant prize per ticket
  const { data: participantPrizePerTicket } = useReadContract({
    address: CONTRACT_ADDRESSES.baseSepolia.GeoChallenge,
    abi: geoChallenge_implementation_ABI,
    functionName: "participantPrizePerTicket",
    args: [competitionId],
    query: {
      staleTime: 30000,
      gcTime: 300000,
    },
  });

  // Fetch collection info from VibeMarket API
  const {
    data: collectionInfo,
    loading: loadingCollectionInfo,
    error: collectionInfoError,
  } = useContractInfo(competition?.collectionAddress || "");

  // Fetch rarity distribution stats
  const {
    data: rarityStats,
    loading: loadingRarityStats,
    error: rarityStatsError,
  } = useCollectionRarityStats(competition?.collectionAddress || "");

  // Fetch collection art
  const { data: collectionArt, loading: loadingCollectionArt } =
    useCollectionArt(
      competition?.collectionAddress || "",
      competition?.rarityTiers || [],
      address
    );

  // Fetch user's collection progress
  const { progress, loading: loadingProgress } = useProgressCalculator(
    address || "",
    competition?.collectionAddress || "",
    competition?.rarityTiers || []
  );

  // Fetch ticket metadata (always fetch, not conditional on address)
  const { data: ticketMetadata, loading: loadingTicketMetadata } =
    useTicketMetadata(
      address || "0x0000000000000000000000000000000000000000", // Use zero address if not connected
      CONTRACT_ADDRESSES.baseSepolia.GeoChallenge,
      competitionId.toString()
    );

  // Live ticket counter state
  const [pulse, setPulse] = useState(false);

  // Countdown timer state
  const [timeRemaining, setTimeRemaining] = useState<string>("");

  // Calculate prize amounts
  const calculatedPrizes = useMemo(() => {
    if (!competition || competition.state !== 3) {
      return {
        winnerPrize: 0n,
        participantPrize: 0n,
        refundAmount: 0n,
      };
    }

    const winnerPrize = competition.winnerDeclared
      ? calculateWinnerPrize(competition.prizePool)
      : 0n;

    let participantPrize = 0n;
    if (competition.winnerDeclared) {
      participantPrize = calculateParticipantPrizeWithWinner(
        competition.prizePool,
        competition.totalTickets
      );
    } else if (participantPrizePerTicket && participantPrizePerTicket > 0n) {
      participantPrize = participantPrizePerTicket;
    }

    let refundAmount = 0n;
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

    return {
      winnerPrize,
      participantPrize,
      refundAmount,
    };
  }, [competition, participantPrizePerTicket]);

  // Listen for ticket purchases
  useWatchTicketPurchased(
    useCallback(
      (buyer: string, eventCompetitionId: bigint) => {
        if (eventCompetitionId === competitionId) {
          refetchCompetition();
          setPulse(true);
          setTimeout(() => setPulse(false), 500);
        }
      },
      [competitionId, refetchCompetition]
    ),
    competitionId
  );

  // Countdown timer effect
  useEffect(() => {
    if (!competition) return;

    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      const deadline = Number(competition.deadline) * 1000;
      const diff = deadline - now;

      if (diff <= 0) {
        setTimeRemaining("Expired");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (days > 0) {
        setTimeRemaining(`${days}d ${hours}h ${minutes}m`);
      } else if (hours > 0) {
        setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
      } else {
        setTimeRemaining(`${minutes}m ${seconds}s`);
      }
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [competition]);

  if (isLoading || loadingMetadata || loadingCollectionInfo) {
    return (
      <div className="container mx-auto px-3 py-4 space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (error || !competition) {
    return (
      <div className="container mx-auto px-3 py-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Competition Not Found</CardTitle>
            <CardDescription className="text-sm">
              The competition you're looking for doesn't exist.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/fc">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Competitions
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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

  const stateInfo = getStateInfo(competition.state);
  // Mobile-optimized: 3 decimals for better readability (consistent with cards)
  const prizePoolETH = parseFloat(formatEther(competition.prizePool)).toFixed(
    3
  );
  const ticketPriceETH = parseFloat(
    formatEther(competition.ticketPrice)
  ).toFixed(3);
  const deadlineDate = new Date(Number(competition.deadline) * 1000);
  const isExpired = deadlineDate < new Date();
  const hasTicket = !!(userTicketBalance && userTicketBalance > BigInt(0));
  const isWinner =
    address && competition.winner.toLowerCase() === address.toLowerCase();
  const isFinalized = competition.state === 3;
  const isActive = competition.state === 1;

  // Determine what actions are available
  const isCancelled =
    isFinalized &&
    !competition.winnerDeclared &&
    (participantPrizePerTicket === undefined ||
      participantPrizePerTicket === BigInt(0));

  const hasParticipantPrize =
    isFinalized &&
    hasTicket &&
    calculatedPrizes.participantPrize > 0n &&
    !isWinner;

  return (
    <div className="container mx-auto px-3 py-4 space-y-4">
      {/* Back Button */}
      <Button variant="ghost" size="sm" asChild>
        <Link href="/fc">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Link>
      </Button>

      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h1 className="text-lg font-bold flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500 flex-shrink-0" />
            <span className="break-words">
              {metadata?.[0] || `Competition #${id}`}
            </span>
          </h1>
          <Badge className={`${stateInfo.color} flex-shrink-0 text-xs`}>
            {stateInfo.label}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">#{id}</p>

        {competition.emergencyPaused && (
          <Alert className="bg-red-50 border-red-200">
            <AlertTriangle className="h-4 w-4 text-red-800" />
            <AlertDescription className="text-xs text-red-800">
              Emergency Paused
            </AlertDescription>
          </Alert>
        )}
      </div>

      <Separator />

      {/* Main Stats - SINGLE COLUMN for mobile */}
      <Card>
        <CardContent className="p-3 space-y-2">
          {/* Prize Pool */}
          <div className="flex items-center justify-between p-2 bg-muted rounded">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-yellow-500" />
              <span className="text-sm text-muted-foreground">Prize Pool</span>
            </div>
            <span className="text-base font-bold">{prizePoolETH} Ξ</span>
          </div>

          {/* Ticket Price */}
          <div className="flex items-center justify-between p-2 bg-muted rounded">
            <div className="flex items-center gap-2">
              <Ticket className="h-5 w-5 text-blue-500" />
              <span className="text-sm text-muted-foreground">
                Ticket Price
              </span>
            </div>
            <span className="text-base font-bold">{ticketPriceETH} Ξ</span>
          </div>

          {/* Tickets Sold */}
          <div
            className={`flex items-center justify-between p-2 bg-muted rounded transition-all ${
              pulse ? "ring-2 ring-green-500" : ""
            }`}
          >
            <div className="flex items-center gap-2">
              <Ticket className="h-5 w-5 text-blue-500" />
              <span className="text-sm text-muted-foreground">
                Tickets Sold
                {pulse && (
                  <Badge className="ml-2 animate-pulse bg-green-500 text-xs px-1 py-0">
                    <TrendingUp className="h-2 w-2" />
                  </Badge>
                )}
              </span>
            </div>
            <span
              className={`text-base font-bold ${
                pulse ? "scale-110 text-green-500" : ""
              }`}
            >
              {competition.totalTickets.toString()}
            </span>
          </div>

          {/* Booster Box */}
          <div className="flex items-center justify-between p-2 bg-muted rounded">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-purple-500" />
              <span className="text-sm text-muted-foreground">Booster Box</span>
            </div>
            {competition.boosterBoxEnabled ? (
              <Badge variant="default" className="bg-green-500 text-xs">
                Enabled
              </Badge>
            ) : (
              <Badge variant="secondary" className="text-xs">
                Not Enabled
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Competition Ticket - Always Display */}
      <Card>
        <CardContent className="p-3">
          {loadingTicketMetadata ? (
            // Loading state
            <Skeleton className="w-full aspect-[5/7] max-w-[200px] mx-auto" />
          ) : ticketMetadata?.image ? (
            // Ticket available
            <div className="relative w-full aspect-[5/7] max-w-[200px] mx-auto">
              <Image
                src={ticketMetadata.image}
                alt={ticketMetadata.name || "Competition Ticket"}
                fill
                sizes="200px"
                className="object-cover rounded-lg"
              />
              {hasTicket ? (
                // User owns ticket - show quantity badge
                <Badge className="absolute top-2 right-2 bg-blue-600 text-white">
                  x{userTicketBalance?.toString()}
                </Badge>
              ) : (
                // User doesn't own ticket - show overlay
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                  <div className="text-center text-white">
                    <Ticket className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-xs font-semibold">
                      Buy Ticket to Participate
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Ticket metadata unavailable
            <Alert>
              <AlertDescription className="text-xs">No ticket</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Actions - Fixed spacing at bottom */}
      <div className="space-y-3 pb-4">
        {/* Buy Ticket */}
        {isActive && !hasTicket && !isExpired && (
          <BuyTicketButton
            competitionId={competitionId}
            ticketPrice={competition.ticketPrice}
            collectionAddress={competition.collectionAddress}
            disabled={competition.emergencyPaused}
          />
        )}

        {/* Deadline Passed Message */}
        {isActive && !hasTicket && isExpired && (
          <Alert className="border-amber-500 bg-amber-50">
            <Clock className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              Competition deadline has passed. Tickets are no longer available.
            </AlertDescription>
          </Alert>
        )}

        {/* Submit Proof */}
        {address && hasTicket && progress?.isComplete && (
          <SubmitWinnerProof
            competitionId={competitionId}
            hasEnded={!isActive && !isFinalized}
            hasWinner={competition.winnerDeclared}
          />
        )}

        {/* Claim Prize */}
        {isWinner && (
          <ClaimPrizeButton
            competitionId={competitionId}
            prizeAmount={calculatedPrizes.winnerPrize}
            isWinner={isWinner}
            isFinalized={isFinalized}
          />
        )}

        {/* Claim Participant Prize */}
        {hasParticipantPrize && (
          <ClaimParticipantPrizeButton
            competitionId={competitionId}
            prizePerTicket={calculatedPrizes.participantPrize}
            hasTicket={hasTicket}
            isFinalized={isFinalized}
            hasWinner={competition.winnerDeclared}
          />
        )}

        {/* Claim Refund */}
        {hasTicket && isCancelled && (
          <ClaimRefundButton
            competitionId={competitionId}
            refundAmount={calculatedPrizes.refundAmount}
            hasTicket={hasTicket}
            isCancelled={isCancelled}
          />
        )}
      </div>

      {/* Countdown - Prominent */}
      {timeRemaining && (
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span className="text-sm font-medium">Time Remaining</span>
              </div>
              <span
                className={`text-lg font-bold ${
                  timeRemaining === "Expired"
                    ? "text-red-500"
                    : timeRemaining.includes("d")
                      ? "text-green-600"
                      : timeRemaining.includes("h")
                        ? "text-orange-500"
                        : "text-red-500"
                }`}
              >
                {timeRemaining}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {deadlineDate.toLocaleDateString()} at{" "}
              {deadlineDate.toLocaleTimeString(undefined, {
                hour: "numeric",
                minute: "2-digit",
              })}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Collection Info - Compact */}
      {collectionInfo?.contractInfo && (
        <Card>
          <CardContent className="p-3 space-y-3">
            <div className="flex gap-3">
              {collectionInfo.contractInfo.packImage && (
                <div className="relative w-24 h-32 flex-shrink-0">
                  <Image
                    src={collectionInfo.contractInfo.packImage}
                    alt={collectionInfo.contractInfo.nftName}
                    fill
                    sizes="96px"
                    className="object-cover rounded"
                  />
                </div>
              )}

              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <a
                    href={`https://vibechain.com/market/${competition.collectionAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 min-w-0"
                  >
                    <h3 className="font-bold text-base !text-black hover:text-primary truncate">
                      {collectionInfo.contractInfo.nftName}
                    </h3>
                    <ExternalLink className="h-3 w-3 !text-black flex-shrink-0" />
                  </a>
                  {collectionInfo.contractInfo.isVerified && (
                    <Badge className="bg-blue-500 text-xs">✓</Badge>
                  )}
                </div>

                <p className="text-xs text-muted-foreground line-clamp-2">
                  {collectionInfo.contractInfo.description}
                </p>

                {/* Rarity Badges */}
                {rarityStats?.data && (
                  <div className="flex flex-wrap gap-1">
                    {rarityStats.data.common > 0 && (
                      <Badge
                        className={`${getRarityColor(1)} text-white text-xs`}
                      >
                        {rarityStats.data.common} Common
                      </Badge>
                    )}
                    {rarityStats.data.rare > 0 && (
                      <Badge
                        className={`${getRarityColor(2)} text-white text-xs`}
                      >
                        {rarityStats.data.rare} Rare
                      </Badge>
                    )}
                    {rarityStats.data.epic > 0 && (
                      <Badge
                        className={`${getRarityColor(3)} text-white text-xs`}
                      >
                        {rarityStats.data.epic} Epic
                      </Badge>
                    )}
                    {rarityStats.data.legendary > 0 && (
                      <Badge
                        className={`${getRarityColor(4)} text-white text-xs`}
                      >
                        {rarityStats.data.legendary} Legendary
                      </Badge>
                    )}
                    {rarityStats.data.mythic > 0 && (
                      <Badge
                        className={`${getRarityColor(5)} text-white text-xs`}
                      >
                        {rarityStats.data.mythic} Mythic
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Collection Art Gallery */}
            {collectionArt?.cards && collectionArt.cards.length > 0 && (
              <div className="pt-3 border-t">
                <h4 className="text-sm font-semibold mb-2">
                  Collection Art ({collectionArt.count} Cards)
                </h4>
                <CollectionArtGallery
                  cards={collectionArt.cards}
                  loading={loadingCollectionArt}
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* How to Win - Compact */}
      <Card className="bg-gradient-to-r from-purple-50 to-amber-50 border-purple-200">
        <CardContent className="p-3 space-y-2">
          <h3 className="text-sm font-bold text-purple-900">How to Win</h3>
          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2">
              <span className="text-purple-900 font-semibold">1.</span>
              <span className="text-purple-800">
                Collect full set of required rarities
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {competition.rarityTiers.map((tier, index) => {
                const getCardCount = (tierNum: number) => {
                  if (!rarityStats?.data) return "?";
                  const tierMap: { [key: number]: number } = {
                    1: rarityStats.data.common,
                    2: rarityStats.data.rare,
                    3: rarityStats.data.epic,
                    4: rarityStats.data.legendary,
                    5: rarityStats.data.mythic,
                  };
                  return tierMap[tierNum] || "?";
                };

                return (
                  <Badge
                    key={index}
                    className={`${getRarityColor(tier)} text-white text-xs`}
                  >
                    {getCardCount(tier)} {getRarityName(tier)}
                  </Badge>
                );
              })}
            </div>
            <div className="flex items-start gap-2">
              <span className="text-amber-900 font-semibold">2.</span>
              <span className="text-amber-800">
                First to submit proof wins!
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress */}
      {address && hasTicket && progress && (
        <Card>
          <CardContent className="p-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Your Progress</span>
              <span
                className={`font-bold ${
                  progress.percentage === 100
                    ? "text-green-600"
                    : "text-muted-foreground"
                }`}
              >
                {progress.percentage.toFixed(0)}%
              </span>
            </div>
            <Progress value={progress.percentage} className="h-4" />
            <p className="text-xs text-muted-foreground">
              {progress.totalOwned}/{progress.totalRequired} cards owned
            </p>

            {progress.isComplete && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-xs text-green-800">
                  Complete! Submit proof to win.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Winner Info */}
      {competition.winnerDeclared && (
        <Card className="border-yellow-500 bg-yellow-50">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Winner:</span>
              <span className="text-sm font-mono font-bold">
                {competition.winner.slice(0, 6)}...
                {competition.winner.slice(-4)}
              </span>
            </div>
            {isWinner && (
              <p className="text-green-600 font-semibold text-sm text-center mt-2">
                🎉 Congratulations! You won!
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

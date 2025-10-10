/**
 * @title Competition Detail Page
 * @notice Individual competition page with buy ticket and claim actions
 * @dev KISS principle: Clean layout, clear actions, professional UX
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
  Shield,
  Ticket,
  TrendingUp,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { geoChallenge_implementation_ABI } from "@/abi";
import { CONTRACT_ADDRESSES } from "@/lib/contractList";

interface CompetitionDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function CompetitionDetailPage({
  params,
}: CompetitionDetailPageProps) {
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

  // Fetch competition metadata (name and description)
  const { data: metadata, isLoading: loadingMetadata } = useReadContract({
    address: CONTRACT_ADDRESSES.baseSepolia.GeoChallenge,
    abi: geoChallenge_implementation_ABI,
    functionName: "getCompetitionMetadata",
    args: [competitionId],
    query: {
      staleTime: 30000, // Fresh for 30s
      gcTime: 300000, // Cache for 5min
    },
  });

  // Fetch participant prize per ticket to distinguish cancelled vs finalized
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

  // Fetch collection art (contested rarity cards) with ownership data
  const { data: collectionArt, loading: loadingCollectionArt } =
    useCollectionArt(
      competition?.collectionAddress || "",
      competition?.rarityTiers || [],
      address // Pass user address for ownership matching
    );

  // Fetch user's collection progress (only if wallet connected)
  const { progress, loading: loadingProgress } = useProgressCalculator(
    address || "",
    competition?.collectionAddress || "",
    competition?.rarityTiers || []
  );

  // Fetch ticket metadata from user's wallet using Alchemy API
  const { data: ticketMetadata, loading: loadingTicketMetadata } =
    useTicketMetadata(
      address,
      CONTRACT_ADDRESSES.baseSepolia.GeoChallenge,
      competitionId.toString()
    );

  // Live ticket counter state
  const [pulse, setPulse] = useState(false);

  // Countdown timer state
  const [timeRemaining, setTimeRemaining] = useState<string>("");

  // Calculate prize amounts using frontend helpers (KISS principle)
  // IMPORTANT: This must be called before early returns to comply with Rules of Hooks
  const calculatedPrizes = useMemo(() => {
    if (!competition || competition.state !== 3) {
      return {
        winnerPrize: 0n,
        participantPrize: 0n,
        refundAmount: 0n,
      };
    }

    // Winner prize (80% of prize pool)
    const winnerPrize = competition.winnerDeclared
      ? calculateWinnerPrize(competition.prizePool)
      : 0n;

    // Participant prize calculation
    let participantPrize = 0n;
    if (competition.winnerDeclared) {
      // Winner exists: 20% split among non-winners
      participantPrize = calculateParticipantPrizeWithWinner(
        competition.prizePool,
        competition.totalTickets
      );
    } else if (participantPrizePerTicket && participantPrizePerTicket > 0n) {
      // No winner: Use contract value (equal split)
      participantPrize = participantPrizePerTicket;
    }

    // Refund amount calculation
    let refundAmount = 0n;
    if (competition.emergencyPaused && competition.prizePool > 0n) {
      // Emergency paused: Split prize pool equally
      refundAmount = calculateEmergencyRefund(
        competition.prizePool,
        competition.totalTickets
      );
    } else {
      // Normal cancel: Ticket price minus treasury fee
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

  // Listen for ticket purchases for this competition
  useWatchTicketPurchased(
    useCallback(
      (buyer: string, eventCompetitionId: bigint) => {
        if (eventCompetitionId === competitionId) {
          // Refetch competition data to get updated ticket count
          refetchCompetition();
          // Trigger pulse animation
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
      <div className="container mx-auto px-4 py-8 space-y-8">
        <Skeleton className="h-12 w-3/4" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !competition) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Competition Not Found</CardTitle>
            <CardDescription>
              The competition you're looking for doesn't exist or hasn't been
              created yet.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
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
  const prizePoolETH = parseFloat(formatEther(competition.prizePool)).toFixed(
    5
  );
  const ticketPriceETH = parseFloat(
    formatEther(competition.ticketPrice)
  ).toFixed(5);
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
    !isWinner; // Winner cannot claim participant prize

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Competitions
          </Link>
        </Button>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold flex items-center gap-2 sm:gap-3">
              <Trophy className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500 flex-shrink-0" />
              <span className="break-words">
                {metadata?.[0] || `Competition #${id}`} (#{id})
              </span>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-2">
              {metadata?.[1] ||
                `Collection: ${competition.collectionAddress.slice(0, 10)}...${competition.collectionAddress.slice(-8)}`}
            </p>
          </div>
          <Badge className={`${stateInfo.color} flex-shrink-0`}>
            {stateInfo.label}
          </Badge>
        </div>

        {competition.emergencyPaused && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-semibold">
                Competition Emergency Paused
              </span>
            </div>
          </div>
        )}
      </div>

      <Separator />

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Prize Pool & Details */}
          <Card>
            <CardContent className="space-y-6 p-6">
              {/* Main Stats Grid */}
              <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
                {/* Prize Pool */}
                <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-muted rounded-lg">
                  <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Prize Pool
                    </p>
                    <p className="text-lg sm:text-xl font-bold truncate">
                      {prizePoolETH} Ξ
                    </p>
                    {competition.prizePool === BigInt(0) ? (
                      <p className="text-xs text-muted-foreground mt-1">
                        Grows with ticket sales
                      </p>
                    ) : (
                      <p className="text-xs text-green-600 mt-1">
                        {competition.totalTickets.toString()} ticket
                        {competition.totalTickets > BigInt(1) ? "s" : ""} sold
                      </p>
                    )}
                  </div>
                </div>

                {/* Booster Box Prize */}
                <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-muted rounded-lg">
                  <Package className="h-6 w-6 sm:h-8 sm:w-8 text-purple-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Booster Box
                    </p>
                    {competition.boosterBoxEnabled ? (
                      <Badge variant="default" className="bg-green-500 mt-1">
                        Enabled
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="mt-1">
                        Not Enabled
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Ticket Price */}
                <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-muted rounded-lg">
                  <Trophy className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Ticket Price
                    </p>
                    <p className="text-lg sm:text-xl font-bold truncate">
                      {ticketPriceETH} Ξ
                    </p>
                  </div>
                </div>

                {/* Tickets Sold - Live Counter */}
                <div
                  className={`flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-muted rounded-lg transition-all ${
                    pulse ? "ring-2 ring-green-500 ring-offset-2" : ""
                  }`}
                >
                  <Ticket className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2">
                      Tickets Sold
                      {pulse && (
                        <Badge
                          variant="default"
                          className="animate-pulse bg-green-500 text-xs px-1 py-0"
                        >
                          <TrendingUp className="h-2 w-2" />
                        </Badge>
                      )}
                    </p>
                    <p
                      className={`text-lg sm:text-xl font-bold transition-transform truncate ${
                        pulse ? "scale-110 text-green-500" : ""
                      }`}
                    >
                      {competition.totalTickets.toString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* NFT Collection Info */}
              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Pack Info
                </h3>

                {loadingCollectionInfo ? (
                  <Skeleton className="h-56  w-full" />
                ) : collectionInfoError ? (
                  <div className="p-4 bg-muted rounded-lg text-sm text-muted-foreground">
                    Unable to load collection info
                  </div>
                ) : collectionInfo?.contractInfo ? (
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-4">
                      {/* Column 1: Collection Image */}
                      {collectionInfo.contractInfo.packImage && (
                        <div className="relative w-full sm:w-44 h-56 flex-shrink-0">
                          <Image
                            src={collectionInfo.contractInfo.packImage}
                            alt={collectionInfo.contractInfo.nftName}
                            fill
                            sizes="(max-width: 640px) 100vw, 176px"
                            className="object-cover rounded"
                          />
                        </div>
                      )}

                      {/* Column 2: Collection Information */}
                      <div className="space-y-3">
                        {/* Name + Verified Badge */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <a
                            href={`https://vibechain.com/market/${competition.collectionAddress}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/link"
                          >
                            <h4 className="font-bold text-xl sm:text-2xl hover:text-primary transition-colors flex items-center gap-2 !text-black">
                              {collectionInfo.contractInfo.nftName}
                              <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                            </h4>
                          </a>
                          {collectionInfo.contractInfo.isVerified && (
                            <Badge variant="default" className="bg-blue-500">
                              ✓ Verified
                            </Badge>
                          )}
                        </div>

                        {/* Description */}
                        <p className="text-sm sm:text-base text-muted-foreground italic leading-snug">
                          {collectionInfo.contractInfo.description}
                        </p>

                        {/* Price & Market Cap */}
                        <div className="flex flex-wrap gap-3 sm:gap-4 text-sm sm:text-base">
                          <div>
                            <span className="text-muted-foreground">
                              Price:{" "}
                            </span>
                            <span className="font-semibold">
                              {collectionInfo.contractInfo.pricePerPackUsd}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Market Cap:{" "}
                            </span>
                            <span className="font-semibold">
                              {collectionInfo.contractInfo.marketCapUsd}
                            </span>
                          </div>
                        </div>

                        {/* Rarity Distribution - Inline Badges */}
                        {loadingRarityStats ? (
                          <Skeleton className="h-8 w-full" />
                        ) : rarityStats?.data ? (
                          <div className="flex flex-wrap gap-2">
                            {rarityStats.data.common > 0 && (
                              <Badge
                                className={`${getRarityColor(1)} text-white`}
                              >
                                {rarityStats.data.common} Common
                              </Badge>
                            )}
                            {rarityStats.data.rare > 0 && (
                              <Badge
                                className={`${getRarityColor(2)} text-white`}
                              >
                                {rarityStats.data.rare} Rare
                              </Badge>
                            )}
                            {rarityStats.data.epic > 0 && (
                              <Badge
                                className={`${getRarityColor(3)} text-white`}
                              >
                                {rarityStats.data.epic} Epic
                              </Badge>
                            )}
                            {rarityStats.data.legendary > 0 && (
                              <Badge
                                className={`${getRarityColor(4)} text-white`}
                              >
                                {rarityStats.data.legendary} Legendary
                              </Badge>
                            )}
                            {rarityStats.data.mythic > 0 && (
                              <Badge
                                className={`${getRarityColor(5)} text-white`}
                              >
                                {rarityStats.data.mythic} Mythic
                              </Badge>
                            )}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    {/* Collection Art Gallery - Contested Tiers */}
                    {(loadingCollectionArt ||
                      (collectionArt?.cards &&
                        collectionArt.cards.length > 0)) && (
                      <div className="mt-4 pt-4 border-t">
                        <h4 className="text-sm font-semibold text-muted-foreground mb-3">
                          {loadingCollectionArt
                            ? "Loading Collection Art..."
                            : `Collection Art (${collectionArt?.count || 0} Cards)`}
                        </h4>
                        <CollectionArtGallery
                          cards={collectionArt?.cards || []}
                          loading={loadingCollectionArt}
                        />
                      </div>
                    )}
                  </div>
                ) : null}
              </div>

              {isExpired && isActive && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-orange-800">
                    <Clock className="h-5 w-5" />
                    <span className="font-semibold">
                      Competition Expired - Awaiting Finalization
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Winner Info */}
          {competition.winnerDeclared && (
            <Card className="border-yellow-500 bg-yellow-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-600" />
                  Winner Declared
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                  <span className="text-sm font-medium">Winner:</span>
                  <span className="text-lg font-mono font-bold">
                    {competition.winner.slice(0, 10)}...
                    {competition.winner.slice(-8)}
                  </span>
                </div>
                {isWinner && (
                  <div className="mt-4 text-center">
                    <p className="text-green-600 font-semibold text-lg">
                      🎉 Congratulations! You are the winner!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Actions & Live Feed */}
        <div className="space-y-6">
          {/* How to Win */}
          <div className="space-y-4 pt-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              How to Win
            </h3>

            <div className="p-4 bg-gradient-to-r from-purple-50 to-amber-50 rounded-lg border border-purple-200">
              <div className="space-y-3">
                {/* Rule 1: Complete Winning Deck */}
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                    1
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-purple-900 mb-2">
                      Complete your winning deck by collecting:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {competition.rarityTiers.map((tier, index) => {
                        // Get card count for this rarity tier from rarityStats
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
                            {getCardCount(tier)} {getRarityName(tier)} cards
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Rule 2: First Come First Serve */}
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                    2
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-amber-900">
                      First Come, First Serve!
                    </p>
                    <p className="text-xs text-amber-800 mt-1">
                      Race to submit your proof - first complete submission
                      wins!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Buy Ticket */}
          {isActive && !hasTicket && (
            <Card>
              <CardHeader>
                <CardTitle>Purchase Ticket</CardTitle>
                <CardDescription>Join this competition</CardDescription>
              </CardHeader>
              <CardContent>
                <BuyTicketButton
                  competitionId={competitionId}
                  ticketPrice={competition.ticketPrice}
                  collectionAddress={competition.collectionAddress}
                  disabled={competition.emergencyPaused}
                />
              </CardContent>
            </Card>
          )}

          {/* Your Ticket Status */}
          {hasTicket && (
            <div>
              {loadingTicketMetadata ? (
                <Skeleton className="h-48 w-full rounded-lg" />
              ) : ticketMetadata?.image ? (
                <div className="space-y-4">
                  {/* Ticket NFT Image */}
                  <div className="relative w-full aspect-[5/7]">
                    <Image
                      src={ticketMetadata.image}
                      alt={ticketMetadata.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover rounded-xl"
                    />
                    {/* Quantity Badge */}
                    <Badge className="absolute top-2 right-2 bg-blue-600 text-white text-sm sm:text-lg px-2 sm:px-3 py-1">
                      x{userTicketBalance?.toString()}
                    </Badge>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center p-4 bg-white rounded-lg">
                  <Trophy className="h-8 w-8 text-blue-600 mr-3" />
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">You own</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {userTicketBalance?.toString()} Ticket(s)
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Deadline Countdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Time's Ticking !!!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Countdown Timer */}
                {timeRemaining && (
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p
                      className={`text-3xl font-bold ${
                        timeRemaining === "Expired"
                          ? "text-red-500"
                          : timeRemaining.includes("d")
                            ? "text-green-600"
                            : timeRemaining.includes("h") &&
                                !timeRemaining.startsWith("0h")
                              ? "text-orange-500"
                              : "text-red-500 animate-pulse"
                      }`}
                    >
                      {timeRemaining === "Expired" ? "Expired" : timeRemaining}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Time remaining
                    </p>
                  </div>
                )}

                {/* Full Date */}
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {deadlineDate.toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}{" "}
                    at{" "}
                    {deadlineDate.toLocaleTimeString(undefined, {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Collection Progress - Only if user has wallet connected and has ticket */}
          {address && hasTicket && (
            <Card>
              <CardHeader>
                <CardTitle>Your Collection Progress</CardTitle>
                <CardDescription>
                  Track your NFT collection completion
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {loadingProgress ? (
                  <Skeleton className="h-32 w-full" />
                ) : progress ? (
                  <>
                    {/* Overall Progress Bar */}
                    <div>
                      <div className="flex justify-between mb-2 text-sm">
                        <span className="font-medium">Overall Progress</span>
                        <span
                          className={`font-bold ${
                            progress.percentage === 100
                              ? "text-green-600"
                              : progress.percentage >= 67
                                ? "text-blue-600"
                                : progress.percentage >= 34
                                  ? "text-orange-600"
                                  : "text-red-600"
                          }`}
                        >
                          {progress.percentage.toFixed(0)}%
                        </span>
                      </div>
                      <Progress
                        value={progress.percentage}
                        className={`h-6 ${
                          progress.percentage === 100
                            ? "[&>div]:bg-green-600"
                            : progress.percentage >= 67
                              ? "[&>div]:bg-blue-600"
                              : progress.percentage >= 34
                                ? "[&>div]:bg-orange-500"
                                : "[&>div]:bg-red-500"
                        }`}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {progress.totalOwned}/{progress.totalRequired} unique
                        cards owned
                      </p>
                    </div>

                    {/* Per-Rarity Breakdown */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        Rarity Breakdown:
                      </p>
                      {Object.entries(progress.rarityBreakdown).map(
                        ([rarity, stats]) => {
                          const rarityNum = Number(rarity);
                          const isComplete = stats.owned >= stats.required;

                          return (
                            <div
                              key={rarity}
                              className="flex items-center justify-between p-2 bg-muted/50 rounded"
                            >
                              <Badge
                                className={`${getRarityColor(rarityNum)} text-white text-xs`}
                              >
                                {getRarityName(rarityNum)}
                              </Badge>
                              <span
                                className={`text-sm font-semibold ${
                                  isComplete
                                    ? "text-green-600"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {stats.owned}/{stats.required}
                                {isComplete && " ✓"}
                              </span>
                            </div>
                          );
                        }
                      )}
                    </div>

                    {/* Complete Set Alert */}
                    {progress.isComplete && (
                      <Alert className="bg-green-50 border-green-200">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800 font-medium">
                          🎉 Complete set! You can submit proof to win.
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Find Missing Cards CTA */}
                    {!progress.isComplete && (
                      <a
                        href={`https://vibechain.com/market/${competition.collectionAddress}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <div className="p-3 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors group cursor-pointer">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm">
                              Find Missing Cards
                            </span>
                            <ExternalLink className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </a>
                    )}
                  </>
                ) : (
                  <div className="text-center text-sm text-muted-foreground py-4">
                    Connect wallet to see progress
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Submit Winner Proof - Only show if has ticket AND complete set */}
          {address && hasTicket && progress?.isComplete && (
            <SubmitWinnerProof
              competitionId={competitionId}
              hasEnded={!isActive && !isFinalized}
              hasWinner={competition.winnerDeclared}
            />
          )}

          {/* Claim Actions */}
          {isWinner && (
            <ClaimPrizeButton
              competitionId={competitionId}
              prizeAmount={calculatedPrizes.winnerPrize}
              isWinner={isWinner}
              isFinalized={isFinalized}
            />
          )}

          {hasParticipantPrize && (
            <ClaimParticipantPrizeButton
              competitionId={competitionId}
              prizePerTicket={calculatedPrizes.participantPrize}
              hasTicket={hasTicket}
              isFinalized={isFinalized}
              hasWinner={competition.winnerDeclared}
            />
          )}

          {hasTicket && isCancelled && (
            <ClaimRefundButton
              competitionId={competitionId}
              refundAmount={calculatedPrizes.refundAmount}
              hasTicket={hasTicket}
              isCancelled={isCancelled}
            />
          )}
        </div>
      </div>
    </div>
  );
}

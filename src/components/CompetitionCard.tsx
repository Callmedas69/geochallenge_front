/**
 * @title CompetitionCard Component
 * @notice Reusable competition card display
 * @dev KISS principle: Single responsibility - display one competition
 */

"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useCompetitionById } from "@/hooks/usePublicCompetitions";
import { useCollectionImage } from "@/hooks/useCollectionImage";
import { useCountdown, formatCountdown } from "@/hooks/useCountdown";
import { useReadContract } from "wagmi";
import { formatEther } from "viem";
import {
  Trophy,
  Users,
  Calendar,
  DollarSign,
  ImageIcon,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { geoChallenge_implementation_ABI } from "@/abi";
import { CONTRACT_ADDRESSES } from "@/lib/contractList";
import Image from "next/image";

/**
 * Single competition card display
 */
export function CompetitionCard({ competitionId }: { competitionId: bigint }) {
  const { data: competition, isLoading } = useCompetitionById(competitionId);

  // Fetch competition metadata (name and description)
  const { data: metadata, isLoading: loadingMetadata } = useReadContract({
    address: CONTRACT_ADDRESSES.GeoChallenge,
    abi: geoChallenge_implementation_ABI,
    functionName: "getCompetitionMetadata",
    args: [competitionId],
    query: {
      staleTime: 30000, // Fresh for 30s
      gcTime: 300000, // Cache for 5min
    },
  });

  // Fetch collection image from Vibe API
  const {
    imageUrl,
    isLoading: loadingImage,
    error: imageError,
  } = useCollectionImage(competition?.collectionAddress);

  // Live countdown timer - MUST be called before any conditional returns
  // Pass safe default (0n) when competition data not yet loaded
  const countdown = useCountdown(competition?.deadline ?? 0n);
  const countdownText = formatCountdown(countdown);

  if (isLoading || loadingMetadata) {
    return (
      <Card className="h-full">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-44 flex-shrink-0 p-6">
            <Skeleton className="aspect-[5/7] max-w-[200px] mx-auto sm:max-w-none" />
          </div>
          <div className="flex-1 p-6 pt-4 sm:pt-6">
            <Skeleton className="h-5 sm:h-6 w-3/4" />
            <Skeleton className="h-3 sm:h-4 w-1/2 mt-2" />
            <Skeleton className="h-16 sm:h-20 w-full mt-4" />
          </div>
        </div>
      </Card>
    );
  }

  if (!competition) {
    return null;
  }

  // Map state enum to label and color
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
    4
  );
  const ticketPriceETH = parseFloat(
    formatEther(competition.ticketPrice)
  ).toFixed(4);

  // Calculate deadline (convert from seconds to Date)
  const deadlineDate = new Date(Number(competition.deadline) * 1000);
  const isExpired = deadlineDate < new Date();

  return (
    <Link href={`/competition/${competitionId.toString()}`}>
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* LEFT: Collection Image Thumbnail - Trading Card Aspect Ratio (5:7) */}
          <div className="w-full sm:w-44 flex-shrink-0 p-6">
            <div className="aspect-[5/7] relative bg-muted overflow-hidden max-w-[200px] mx-auto sm:max-w-none">
              {loadingImage ? (
                <Skeleton className="w-full h-full" />
              ) : imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={metadata?.[0] || "Collection"}
                  fill
                  sizes="(max-width: 640px) 200px, 176px"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Competition Details */}
          <div className="flex-1 min-w-0">
            <CardHeader className="pb-4 pt-4 sm:pt-6">
              <div className="flex items-start sm:items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2 flex-wrap sm:whitespace-nowrap">
                  <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 flex-shrink-0" />
                  <span className="break-words">
                    {metadata?.[0] ||
                      `Competition #${competitionId.toString()}`}{" "}
                    <span className="text-muted-foreground text-sm">
                      (#{competitionId.toString()})
                    </span>
                  </span>
                </CardTitle>
                <Badge className={`${stateInfo.color} flex-shrink-0`}>
                  {stateInfo.label}
                </Badge>
              </div>
              <CardDescription className="line-clamp-2">
                {metadata?.[1] ||
                  `Collection: ${competition.collectionAddress.slice(0, 6)}...${competition.collectionAddress.slice(-4)}`}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pb-6">
              {/* Prize Pool */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    Prize Pool
                  </span>
                </div>
                <span className="font-semibold text-sm sm:text-base">
                  {prizePoolETH} ETH
                </span>
              </div>

              {/* Tickets Sold */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    Tickets Sold
                  </span>
                </div>
                <span className="font-semibold text-sm sm:text-base">
                  {competition.totalTickets.toString()}
                </span>
              </div>

              {/* Ticket Price */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    Ticket Price
                  </span>
                </div>
                <span className="font-semibold text-sm sm:text-base">
                  {ticketPriceETH} ETH
                </span>
              </div>

              {/* Deadline */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    Deadline
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-medium">
                    {deadlineDate.toLocaleDateString()}
                  </span>
                  {isExpired && competition.state === 1 && (
                    <Badge variant="destructive" className="text-xs">
                      Expired
                    </Badge>
                  )}
                </div>
              </div>

              {/* Countdown Timer - Only show for active competitions */}
              {competition.state === 1 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      Time Left
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {countdown.isExpired ? (
                      <Badge variant="destructive" className="text-xs">
                        Expired
                      </Badge>
                    ) : countdown.totalSeconds < 86400 ? (
                      // Less than 1 day - show in red
                      <Badge
                        variant="destructive"
                        className="text-[10px] sm:text-xs font-mono px-1.5 sm:px-2"
                      >
                        {countdownText}
                      </Badge>
                    ) : countdown.totalSeconds < 259200 ? (
                      // Less than 3 days - show in yellow/orange
                      <Badge className="bg-orange-500 text-[10px] sm:text-xs font-mono px-1.5 sm:px-2">
                        {countdownText}
                      </Badge>
                    ) : (
                      // More than 3 days - show in green
                      <Badge className="bg-green-500 text-[10px] sm:text-xs font-mono px-1.5 sm:px-2">
                        {countdownText}
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Winner */}
              {competition.winnerDeclared && (
                <div className="pt-2 sm:pt-3 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      Winner
                    </span>
                    <span className="text-xs sm:text-sm font-mono">
                      {competition.winner.slice(0, 6)}...
                      {competition.winner.slice(-4)}
                    </span>
                  </div>
                </div>
              )}

              {/* Emergency Paused */}
              {competition.emergencyPaused && (
                <Badge
                  variant="destructive"
                  className="w-full justify-center text-xs sm:text-sm"
                >
                  ⏸️ Emergency Paused
                </Badge>
              )}
            </CardContent>
          </div>
        </div>
      </Card>
    </Link>
  );
}

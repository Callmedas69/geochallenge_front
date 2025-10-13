/**
 * @title CompetitionCard Component (Farcaster)
 * @notice Minimal competition card optimized for Farcaster miniApps
 * @dev KISS principle: Compact layout, essential fields only, fast scanning
 * @dev Shows: thumbnail, title, prize, ticket price, tickets sold, countdown
 */

"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useCompetitionById } from "@/hooks/usePublicCompetitions";
import { useCollectionImage } from "@/hooks/useCollectionImage";
import { useCountdown, formatCountdown } from "@/hooks/useCountdown";
import { useReadContract } from "wagmi";
import { formatEther } from "viem";
import { Trophy, ImageIcon } from "lucide-react";
import Link from "next/link";
import { geoChallenge_implementation_ABI } from "@/abi";
import { CONTRACT_ADDRESSES } from "@/lib/contractList";
import Image from "next/image";

interface CompetitionCardProps {
  competitionId: bigint;
  priority?: boolean; // For image loading optimization
}

/**
 * Compact competition card for Farcaster miniApps
 * Height: ~140-150px (vs standard ~280px)
 * Width: Optimized for 375px viewport
 */
export function CompetitionCard({
  competitionId,
  priority = false,
}: CompetitionCardProps) {
  const { data: competition, isLoading } = useCompetitionById(competitionId);

  // Fetch competition metadata (name only, no description)
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

  // Fetch collection image from Vibe API
  const {
    imageUrl,
    isLoading: loadingImage,
    error: imageError,
  } = useCollectionImage(competition?.collectionAddress);

  // Live countdown timer - MUST be called before any conditional returns
  const countdown = useCountdown(competition?.deadline ?? 0n);
  const countdownText = formatCountdown(countdown);

  if (isLoading || loadingMetadata) {
    return (
      <Card className="h-full">
        <div className="flex gap-3 p-3">
          <Skeleton className="w-[100px] aspect-[5/7] flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-10 w-full" />
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
  // Mobile-optimized: 3 decimals for better readability on small screens
  const prizePoolETH = parseFloat(formatEther(competition.prizePool)).toFixed(
    3
  );
  const ticketPriceETH = parseFloat(
    formatEther(competition.ticketPrice)
  ).toFixed(3);

  return (
    <Link href={`/fc/competition/${competitionId.toString()}`} className="block">
      <Card className="min-h-[140px] hover:shadow-lg transition-shadow cursor-pointer">
        <div className="flex gap-3 p-3">
          {/* LEFT: Compact Thumbnail - 100×140px */}
          <div className="w-[100px] flex-shrink-0">
            <div className="aspect-[5/7] relative bg-muted overflow-hidden rounded">
              {loadingImage ? (
                <Skeleton className="w-full h-full" />
              ) : imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={metadata?.[0] || "Collection"}
                  fill
                  sizes="100px"
                  className="object-cover"
                  priority={priority}
                  loading={priority ? undefined : "lazy"}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Competition Details */}
          <div className="flex-1 min-w-0 space-y-1.5">
            {/* Title + Badge */}
            <div className="space-y-1">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold leading-tight flex items-center gap-1.5 flex-1 min-w-0">
                  <Trophy className="w-3.5 h-3.5 text-yellow-500 flex-shrink-0" />
                  <span className="truncate">
                    {metadata?.[0] ||
                      `Competition #${competitionId.toString()}`}
                  </span>
                </h3>
                <Badge className={`${stateInfo.color} text-xs flex-shrink-0`}>
                  {stateInfo.label}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                #{competitionId.toString()}
              </p>
            </div>

            {/* Stats - Emoji Icons Only (No Labels) */}
            <div className="space-y-1 text-sm">
              {/* Prize Pool */}
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">💰 Prize</span>
                <span className="font-semibold">{prizePoolETH} ETH</span>
              </div>

              {/* Ticket Price */}
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">🎫 Ticket</span>
                <span className="font-semibold">{ticketPriceETH} ETH</span>
              </div>

              {/* Tickets Sold - Social Proof */}
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">👥 Sold</span>
                <span className="font-semibold">
                  {competition.totalTickets.toString()}
                </span>
              </div>

              {/* Countdown Timer - Only for active competitions */}
              {competition.state === 1 && (
                <div className="flex items-center justify-between pt-1">
                  <span className="text-muted-foreground">⏱️</span>
                  <div>
                    {countdown.isExpired ? (
                      <Badge variant="destructive" className="text-xs">
                        Expired
                      </Badge>
                    ) : countdown.totalSeconds < 86400 ? (
                      // Less than 1 day - red
                      <Badge
                        variant="destructive"
                        className="text-xs font-mono px-2"
                      >
                        {countdownText}
                      </Badge>
                    ) : countdown.totalSeconds < 259200 ? (
                      // Less than 3 days - orange
                      <Badge className="bg-orange-500 text-xs font-mono px-2">
                        {countdownText}
                      </Badge>
                    ) : (
                      // More than 3 days - green
                      <Badge className="bg-green-500 text-xs font-mono px-2">
                        {countdownText}
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Winner Badge - Compact */}
              {competition.winnerDeclared && (
                <div className="pt-1">
                  <Badge className="bg-yellow-500 text-xs w-full justify-center">
                    🏆 Winner Declared
                  </Badge>
                </div>
              )}

              {/* Emergency Paused */}
              {competition.emergencyPaused && (
                <Badge
                  variant="destructive"
                  className="w-full justify-center text-xs"
                >
                  ⏸️ Paused
                </Badge>
              )}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

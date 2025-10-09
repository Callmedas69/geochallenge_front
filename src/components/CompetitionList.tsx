/**
 * @title CompetitionList Component
 * @notice Displays list of all competitions
 * @dev Public component - no wallet required
 * @dev Uses smart caching from usePublicCompetitions hooks
 */

"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useCompetitionCount,
  useActiveCompetitions,
  useCompetitionById,
} from "@/hooks/usePublicCompetitions";
import { useCollectionImage } from "@/hooks/useCollectionImage";
import { useReadContract } from "wagmi";
import { formatEther } from "viem";
import { Trophy, Users, Calendar, DollarSign, ImageIcon } from "lucide-react";
import Link from "next/link";
import { geoChallenge_implementation_ABI } from "@/abi";
import { CONTRACT_ADDRESSES } from "@/lib/contractList";
import Image from "next/image";

/**
 * Single competition card display
 */
function CompetitionCard({ competitionId }: { competitionId: bigint }) {
  const { data: competition, isLoading } = useCompetitionById(competitionId);

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

  // Fetch collection image from Vibe API
  const {
    imageUrl,
    isLoading: loadingImage,
    error: imageError,
  } = useCollectionImage(competition?.collectionAddress);

  if (isLoading || loadingMetadata) {
    return (
      <Card className="h-full">
        <div className="flex gap-4">
          <div className="w-32 flex-shrink-0">
            <Skeleton className="aspect-[5/7] rounded-l-lg" />
          </div>
          <div className="flex-1 py-6 pr-6">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2 mt-2" />
            <Skeleton className="h-20 w-full mt-4" />
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
        <div className="flex gap-4">
          {/* LEFT: Collection Image Thumbnail - Trading Card Aspect Ratio (5:7) */}
          <div className="w-44 flex-shrink-0 items-center justify-center pl-8">
            <div className="aspect-[5/7] relative bg-muted overflow-hidden">
              {loadingImage ? (
                <Skeleton className="w-full h-full" />
              ) : imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={metadata?.[0] || "Collection"}
                  fill
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
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2 whitespace-nowrap">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  {metadata?.[0] ||
                    `Competition #${competitionId.toString()}`}{" "}
                  (#{competitionId.toString()})
                </CardTitle>
                <Badge className={stateInfo.color}>{stateInfo.label}</Badge>
              </div>
              <CardDescription className="line-clamp-2">
                {metadata?.[1] ||
                  `Collection: ${competition.collectionAddress.slice(0, 6)}...${competition.collectionAddress.slice(-4)}`}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Prize Pool */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Prize Pool
                  </span>
                </div>
                <span className="font-semibold">{prizePoolETH} ETH</span>
              </div>

              {/* Tickets Sold */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Tickets Sold
                  </span>
                </div>
                <span className="font-semibold">
                  {competition.totalTickets.toString()}
                </span>
              </div>

              {/* Ticket Price */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Ticket Price
                  </span>
                </div>
                <span className="font-semibold">{ticketPriceETH} ETH</span>
              </div>

              {/* Deadline */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Deadline
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {deadlineDate.toLocaleDateString()}
                  </span>
                  {isExpired && competition.state === 1 && (
                    <Badge variant="destructive" className="text-xs">
                      Expired
                    </Badge>
                  )}
                </div>
              </div>

              {/* Winner */}
              {competition.winnerDeclared && (
                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Winner
                    </span>
                    <span className="text-sm font-mono">
                      {competition.winner.slice(0, 6)}...
                      {competition.winner.slice(-4)}
                    </span>
                  </div>
                </div>
              )}

              {/* Emergency Paused */}
              {competition.emergencyPaused && (
                <Badge variant="destructive" className="w-full justify-center">
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

/**
 * Main competition list component with tabs
 */
export function CompetitionList() {
  const { data: totalComps, isLoading: loadingTotal } = useCompetitionCount();
  const { data: activeIds, isLoading: loadingActive } = useActiveCompetitions();

  const totalCount =
    totalComps && totalComps > BigInt(0) ? Number(totalComps - BigInt(1)) : 0;
  const activeCompetitionIds = activeIds?.[0] || [];

  // Generate array of all competition IDs
  const allCompetitionIds = Array.from({ length: totalCount }, (_, i) =>
    BigInt(i + 1)
  );

  if (loadingTotal || loadingActive) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-full max-w-md" />
        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (totalCount === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Competitions Yet</CardTitle>
          <CardDescription>
            No competitions have been created yet. Check back soon!
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="all">All ({totalCount})</TabsTrigger>
          <TabsTrigger value="active">
            Active ({activeCompetitionIds.length})
          </TabsTrigger>
        </TabsList>

        {/* All Competitions Tab */}
        <TabsContent value="all" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {allCompetitionIds.map((id) => (
              <CompetitionCard key={id.toString()} competitionId={id} />
            ))}
          </div>
        </TabsContent>

        {/* Active Competitions Tab */}
        <TabsContent value="active" className="space-y-6">
          {activeCompetitionIds.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No Active Competitions</CardTitle>
                <CardDescription>
                  There are no active competitions at the moment.
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {activeCompetitionIds.map((id) => (
                <CompetitionCard key={id.toString()} competitionId={id} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

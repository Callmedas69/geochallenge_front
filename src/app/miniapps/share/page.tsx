/**
 * @title Farcaster Share Extension Page
 * @notice Receives shared casts from Farcaster share sheet
 * @dev Handles cast sharing via URL params and SDK context
 */

"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAutoConnect } from "@/lib/farcaster";
import { sdk } from "@/lib/farcaster/sdk";
import { CompetitionList } from "@/components/farcaster";
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
import { Share2, Trophy, ArrowRight, User } from "lucide-react";
import Link from "next/link";

// Type definition from Farcaster docs
type MiniAppCast = {
  author: {
    fid: number;
    username?: string;
    displayName?: string;
    pfpUrl?: string;
  };
  hash: string;
  parentHash?: string;
  parentFid?: number;
  timestamp?: number;
  mentions?: Array<{
    fid: number;
    username?: string;
    displayName?: string;
  }>;
  text: string;
  embeds?: string[];
  channelKey?: string;
};

function SharePageContent() {
  // Auto-connect Farcaster wallet
  useAutoConnect();

  const searchParams = useSearchParams();
  const [sharedCast, setSharedCast] = useState<MiniAppCast | null>(null);
  const [isShareContext, setIsShareContext] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // URL parameters (available immediately)
  const castHash = searchParams.get("castHash");
  const castFid = searchParams.get("castFid");
  const viewerFid = searchParams.get("viewerFid");

  useEffect(() => {
    const initializeShare = async () => {
      try {
        // Wait for SDK to be ready
        await sdk.actions.ready();

        // Get SDK context
        const context = await sdk.context;

        // Check if we're in a share context via SDK
        if (context.location?.type === "cast_share") {
          setIsShareContext(true);
          setSharedCast(context.location.cast);
        }
      } catch (error) {
        console.error("Error initializing share context:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeShare();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-3 py-4 space-y-4">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Share context with enriched data
  if (isShareContext && sharedCast) {
    return (
      <div className="container mx-auto px-3 py-4 space-y-4">
        {/* Shared Cast Card */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Share2 className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-base">Shared Cast</CardTitle>
            </div>
            <CardDescription className="text-sm">
              Analyzing cast from{" "}
              <span className="font-semibold text-blue-900">
                @{sharedCast.author.username || `FID ${sharedCast.author.fid}`}
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Author Info */}
            <div className="flex items-center gap-3">
              {sharedCast.author.pfpUrl ? (
                <img
                  src={sharedCast.author.pfpUrl}
                  alt={sharedCast.author.username || "User"}
                  className="w-12 h-12 rounded-full"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
              )}
              <div className="flex-1">
                <div className="font-bold text-sm">
                  {sharedCast.author.displayName ||
                    sharedCast.author.username ||
                    `FID ${sharedCast.author.fid}`}
                </div>
                {sharedCast.author.username && (
                  <div className="text-xs text-muted-foreground">
                    @{sharedCast.author.username}
                  </div>
                )}
              </div>
              {sharedCast.channelKey && (
                <Badge variant="secondary" className="text-xs">
                  /{sharedCast.channelKey}
                </Badge>
              )}
            </div>

            {/* Cast Text */}
            <div className="bg-white p-3 rounded-lg border border-blue-100">
              <p className="text-sm whitespace-pre-wrap">{sharedCast.text}</p>
            </div>

            {/* Cast Metadata */}
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span>Cast: {sharedCast.hash.slice(0, 10)}...</span>
              {sharedCast.timestamp && (
                <span>
                  • {new Date(sharedCast.timestamp * 1000).toLocaleString()}
                </span>
              )}
              {sharedCast.mentions && sharedCast.mentions.length > 0 && (
                <span>• {sharedCast.mentions.length} mentions</span>
              )}
              {sharedCast.embeds && sharedCast.embeds.length > 0 && (
                <span>• {sharedCast.embeds.length} embeds</span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Prompt */}
        <Card className="bg-gradient-to-r from-purple-50 to-amber-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Trophy className="h-6 w-6 text-purple-600 flex-shrink-0 mt-1" />
              <div className="flex-1 space-y-2">
                <h3 className="font-bold text-sm text-purple-900">
                  Join Trading Card Competitions
                </h3>
                <p className="text-xs text-purple-800">
                  Complete collections, compete for prizes, and share your
                  achievements in Farcaster!
                </p>
                <Button size="sm" className="mt-2" asChild>
                  <Link href="/miniapps">
                    Browse Competitions
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Competitions */}
        <section>
          <h2 className="font-bold text-sm mb-3">ACTIVE COMPETITIONS</h2>
          <CompetitionList />
        </section>
      </div>
    );
  }

  // Fallback: No SDK context but have URL parameters
  if (castHash && castFid) {
    return (
      <div className="container mx-auto px-3 py-4 space-y-4">
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Share2 className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-base">Shared Cast</CardTitle>
            </div>
            <CardDescription className="text-sm">
              Cast from FID {castFid}
              {viewerFid && ` • Shared by FID ${viewerFid}`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-white p-3 rounded-lg border border-blue-100">
              <p className="text-sm text-muted-foreground">
                Cast Hash: {castHash}
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              Loading enriched cast data...
            </p>
          </CardContent>
        </Card>

        {/* Active Competitions */}
        <section>
          <h2 className="font-bold text-sm mb-3">ACTIVE COMPETITIONS</h2>
          <CompetitionList />
        </section>
      </div>
    );
  }

  // Default: No share data
  return (
    <div className="container mx-auto px-3 py-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Share to GeoChallenge</CardTitle>
          <CardDescription className="text-sm">
            Share casts from Farcaster to discover trading card competitions!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            To use this feature, share a cast from any Farcaster client and
            select GeoChallenge from the share sheet.
          </p>
          <Button size="sm" asChild>
            <Link href="/miniapps">
              Browse Competitions
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Active Competitions */}
      <section>
        <h2 className="font-bold text-sm mb-3">ACTIVE COMPETITIONS</h2>
        <CompetitionList />
      </section>
    </div>
  );
}

// Wrap with Suspense boundary (Next.js 15 requirement for useSearchParams)
export default function SharePage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-3 py-4 space-y-4">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        </div>
      }
    >
      <SharePageContent />
    </Suspense>
  );
}

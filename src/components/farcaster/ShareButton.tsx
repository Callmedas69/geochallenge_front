/**
 * @title ShareButton Component
 * @notice Flexible share button for Farcaster sharing (competition or platform)
 * @dev Uses native share API on mobile, Warpcast composer fallback on desktop
 */

"use client";

import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FARCASTER_SHARING } from "@/lib/farcaster/sharing-config";

interface ShareButtonProps {
  type: "competition" | "platform";
  competitionId?: string;
  collectionName?: string;
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function ShareButton({
  type,
  competitionId,
  collectionName,
  variant = "outline",
  size = "default",
  className,
}: ShareButtonProps) {
  const handleShare = async () => {
    // Determine share content based on type
    let shareUrl: string;
    let shareText: string;
    let shareTitle: string;

    if (type === "competition") {
      if (!competitionId) {
        console.error("Competition ID required for competition share");
        return;
      }
      shareUrl = FARCASTER_SHARING.competitionUrl(competitionId);
      shareText = collectionName
        ? `Check out the ${collectionName} competition on GeoChallenge! 🎴`
        : `Join this competition on GeoChallenge! 🎴`;
      shareTitle = collectionName
        ? `${collectionName} - GeoChallenge`
        : `Competition #${competitionId} - GeoChallenge`;
    } else {
      // Platform share
      shareUrl = FARCASTER_SHARING.homeUrl;
      shareText =
        "Join me on GeoChallenge! Complete trading card sets and win prizes on Base 🎴";
      shareTitle = "GeoChallenge - Trading Card Competitions";
    }

    // Try native share first (mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch (err) {
        // User cancelled or share failed, fall through to Warpcast
        console.log("Native share cancelled or unavailable");
      }
    }

    // Fallback: Open Warpcast composer with pre-filled content
    const warpcastUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(
      shareText
    )}&embeds[]=${encodeURIComponent(shareUrl)}`;
    window.open(warpcastUrl, "_blank", "noopener,noreferrer");
  };

  // Button text based on type and size
  const getButtonText = () => {
    if (size === "icon") return null;
    return type === "platform" ? "Invite Friends" : "Share";
  };

  return (
    <Button
      onClick={handleShare}
      variant={variant}
      size={size}
      className={className}
    >
      <Share2 className="h-4 w-4" />
      {getButtonText() && <span className="ml-2">{getButtonText()}</span>}
    </Button>
  );
}

/**
 * @title ShareButton Component
 * @notice Flexible share button for Farcaster sharing (competition or platform)
 * @dev Uses SDK composeCast in miniApp, native share on mobile, browser fallback
 */

"use client";

import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FARCASTER_SHARING } from "@/lib/farcaster/sharing-config";
import { sdk, isFarcasterContext } from "@/lib/farcaster/sdk";

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
        ? `Check out the ${collectionName} competition on GeoChallenge! 🎴\n\n${shareUrl}`
        : `Join this competition on GeoChallenge! 🎴\n\n${shareUrl}`;
      shareTitle = collectionName
        ? `${collectionName} - GeoChallenge`
        : `Competition #${competitionId} - GeoChallenge`;
    } else {
      // Platform share
      shareUrl = FARCASTER_SHARING.homeUrl;
      shareText = `Join me on GeoChallenge! Complete trading card sets and win prizes on Base 🎴\n\n${shareUrl}`;
      shareTitle = "GeoChallenge - Trading Card Competitions";
    }

    // Priority 1: Use Farcaster SDK composeCast if in MiniApp (direct, no browser)
    if (isFarcasterContext()) {
      try {
        const result = await sdk.actions.composeCast({
          text: shareText,
          embeds: [shareUrl],
        });

        if (result?.cast) {
          console.log("✅ Cast created:", result.cast.hash);
        }
        return;
      } catch (err) {
        console.log("SDK composeCast unavailable, falling back...");
        // Fall through to next method
      }
    }

    // Priority 2: Try native share (mobile)
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

    // Priority 3: Fallback to browser (only for non-Farcaster contexts)
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

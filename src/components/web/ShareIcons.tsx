/**
 * @title ShareIcons Component (Web)
 * @notice Simple share icons for Twitter and Farcaster
 * @dev KISS principle: Two clickable icons, reuses miniapp share text
 */

"use client";

import { Twitter } from "lucide-react";
import { FARCASTER_SHARING } from "@/lib/farcaster/sharing-config";

interface ShareIconsProps {
  type: "competition" | "platform";
  competitionId?: string;
  collectionName?: string;
}

export function ShareIcons({
  type,
  competitionId,
  collectionName,
}: ShareIconsProps) {
  const handleShare = (platform: "twitter" | "farcaster") => {
    // Determine share content based on type (same logic as miniapp)
    let shareUrl: string;
    let shareText: string;

    if (type === "competition") {
      if (!competitionId) {
        console.error("Competition ID required for competition share");
        return;
      }
      shareUrl = FARCASTER_SHARING.webCompetitionUrl(competitionId);
      shareText = collectionName
        ? `Check out the ${collectionName} competition on GeoChallenge! 🎴\n\n${shareUrl}`
        : `Join this competition on GeoChallenge! 🎴\n\n${shareUrl}`;
    } else {
      // Platform share
      shareUrl = FARCASTER_SHARING.webHomeUrl;
      shareText = `Join me on GeoChallenge! Complete trading card sets and win prizes on Base 🎴\n\n${shareUrl}`;
    }

    // Open share URL based on platform
    let url: string;
    if (platform === "twitter") {
      url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    } else {
      // Farcaster/Warpcast
      url = `https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}&embeds[]=${encodeURIComponent(shareUrl)}`;
    }

    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        {/* Twitter Icon */}
        <button
          onClick={() => handleShare("twitter")}
          className="p-2 rounded-full hover:bg-muted transition-colors group"
          aria-label="Share on Twitter"
          title="Share on Twitter"
        >
          <Twitter className="h-5 w-5 text-muted-foreground group-hover:text-blue-500 transition-colors" />
        </button>

        {/* Farcaster Icon */}
        <button
          onClick={() => handleShare("farcaster")}
          className="p-2 rounded-full hover:bg-muted transition-colors group"
          aria-label="Share on Farcaster"
          title="Share on Farcaster"
        >
          <svg
            className="h-5 w-5 text-muted-foreground group-hover:text-purple-600 transition-colors"
            viewBox="0 0 1000 1000"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M257.778 155.556H742.222V844.445H671.111V528.889H670.414C662.554 441.677 589.258 373.333 500 373.333C410.742 373.333 337.446 441.677 329.586 528.889H328.889V844.445H257.778V155.556Z" />
            <path d="M128.889 253.333L157.778 351.111H182.222V746.667C169.949 746.667 160 756.616 160 768.889V795.556H155.556C143.283 795.556 133.333 805.505 133.333 817.778V844.445H382.222V817.778C382.222 805.505 372.273 795.556 360 795.556H355.556V768.889C355.556 756.616 345.606 746.667 333.333 746.667H306.667V253.333H128.889Z" />
            <path d="M871.111 253.333L842.222 351.111H817.778V746.667C830.051 746.667 840 756.616 840 768.889V795.556H844.444C856.717 795.556 866.667 805.505 866.667 817.778V844.445H617.778V817.778C617.778 805.505 627.727 795.556 640 795.556H644.444V768.889C644.444 756.616 654.394 746.667 666.667 746.667H693.333V253.333H871.111Z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

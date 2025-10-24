/**
 * @title ShareButton Component (Farcaster MiniApp)
 * @notice Share icons for Twitter and Farcaster with platform-specific mentions
 * @dev Twitter: Simple browser intent | Farcaster: SDK → Native Share → Browser fallback (KISS)
 */

"use client";

import { Twitter } from "lucide-react";
import { FARCASTER_SHARING } from "@/lib/farcaster/sharing-config";
import { sdk, isFarcasterContext } from "@/lib/farcaster/sdk";

interface ShareButtonProps {
  type: "competition" | "platform";
  competitionId?: string;
  collectionName?: string;
  className?: string;
}

export function ShareButton({
  type,
  competitionId,
  collectionName,
  className,
}: ShareButtonProps) {
  const handleShare = async (platform: "twitter" | "farcaster") => {
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
      shareText =
        platform === "twitter"
          ? collectionName
            ? `The ${collectionName} competition is live on GeoChallenge 🎴\n\nBuilt for @vibedotmarket on @base powered by @geoart_studio ⚡\n\n${shareUrl}`
            : `A new competition is live on GeoChallenge 🎴\n\nBuilt for @vibedotmarket on @base powered by @geoart_studio ⚡\n\n${shareUrl}`
          : collectionName
            ? `The ${collectionName} competition is live on GeoChallenge 🎴\n\nBuilt for @vibemarket on @base.base.eth \n\n`
            : `A new competition is live on GeoChallenge 🎴\n\nBuilt for @vibemarket on @base.base.eth \n\n`;
      shareTitle = collectionName
        ? `${collectionName} - GeoChallenge`
        : `Competition #${competitionId} - GeoChallenge`;
    } else {
      // Platform share
      shareUrl = FARCASTER_SHARING.homeUrl;
      shareText =
        platform === "twitter"
          ? `I'm joining GeoChallenge — the trading card competition built for @vibedotmarket 🎴\n\nComplete your set. Win prizes. On @base powered by @geoart_studio ⚡\n\n${shareUrl}`
          : `I'm joining GeoChallenge — the trading card competition built for @vibemarket 🎴\n\nComplete your set. Win prizes. On @base.base.eth ⚡\n\n${shareUrl}`;
      shareTitle = "GeoChallenge - Trading Card Competitions";
    }

    // Twitter: Simple browser intent
    if (platform === "twitter") {
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
      window.open(twitterUrl, "_blank", "noopener,noreferrer");
      return;
    }

    // Farcaster: Sophisticated fallback chain
    // Priority 1: Use Farcaster SDK composeCast if in MiniApp (direct, no browser)
    if (isFarcasterContext()) {
      try {
        const result = await sdk.actions.composeCast({
          text: shareText,
          embeds: [shareUrl],
        });

        if (result?.cast) {
          return;
        }
      } catch (err) {
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
      }
    }

    // Priority 3: Fallback to browser (only for non-Farcaster contexts)
    const warpcastUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(
      shareText
    )}&embeds[]=${encodeURIComponent(shareUrl)}`;
    window.open(warpcastUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className={`flex items-center gap-3 ${className || ""}`}>
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

/**
 * @title Collection Art Gallery
 * @notice Displays cards from contested rarity tiers in the competition
 * @dev KISS principle: Simple responsive grid with hover effects, error handling
 */

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ImageOff } from "lucide-react";

// Import rarity star assets
import commonStar from "@/assets/star/star - common.png";
import rareStar from "@/assets/star/star - rare.png";
import epicStar from "@/assets/star/star - epic.png";
import legendaryStar from "@/assets/star/star - legendary.png";
import mythicStar from "@/assets/star/star - mythic.png";

// Rarity star mapping
const RARITY_STARS = {
  1: commonStar,
  2: rareStar,
  3: epicStar,
  4: legendaryStar,
  5: mythicStar,
} as const;

// Pagination constant
const CARDS_PER_PAGE = 25;

interface CollectionCard {
  name: string;
  rarity: number;
  imageUrl: string;
  ownedCount: number;
}

interface CollectionArtGalleryProps {
  cards: CollectionCard[];
  loading?: boolean;
}

function GalleryImage({
  imageUrl,
  isOwned,
}: {
  imageUrl: string;
  isOwned: boolean;
}) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted">
        <ImageOff className="h-8 w-8 text-muted-foreground" />
      </div>
    );
  }

  return (
    <Image
      src={imageUrl}
      alt="Collection art"
      fill
      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
      className={`object-cover transition-all ${isOwned ? "" : "grayscale opacity-60"}`}
      onError={() => setHasError(true)}
    />
  );
}

export function CollectionArtGallery({
  cards,
  loading,
}: CollectionArtGalleryProps) {
  const [displayCount, setDisplayCount] = useState(CARDS_PER_PAGE);

  // Reset pagination when cards change
  useEffect(() => {
    setDisplayCount(CARDS_PER_PAGE);
  }, [cards]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 min-[480px]:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="aspect-[5/7] rounded-lg" />
        ))}
      </div>
    );
  }

  if (!cards || cards.length === 0) {
    return null;
  }

  const displayedCards = cards.slice(0, displayCount);
  const hasMore = displayCount < cards.length;

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + CARDS_PER_PAGE);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 min-[480px]:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
        {displayedCards.map((card) => {
          const isOwned = card.ownedCount > 0;
          const starImage =
            RARITY_STARS[card.rarity as keyof typeof RARITY_STARS];

          return (
            <button
              key={card.imageUrl}
              type="button"
              className="relative aspect-[5/7] rounded-lg overflow-hidden bg-muted hover:scale-105 active:scale-95 transition-transform duration-200 cursor-pointer shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 w-full"
              aria-label={`View ${card.name} (${isOwned ? `owned x${card.ownedCount}` : 'not owned'})`}
            >
              <GalleryImage imageUrl={card.imageUrl} isOwned={isOwned} />

              {/* Rarity Star Overlay */}
              {starImage && (
                <div className="absolute top-1 right-1 flex gap-0.5">
                  {Array.from({ length: card.rarity }).map((_, index) => (
                    <div key={index} className="w-5 h-5 sm:w-4 sm:h-4 relative">
                      <Image
                        src={starImage}
                        alt={`Rarity ${card.rarity}`}
                        fill
                        className={`object-contain drop-shadow-md ${isOwned ? "" : "grayscale opacity-60"}`}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Ownership Badge */}
              {isOwned && (
                <Badge className="absolute top-10 right-2 bg-green-600 text-white font-bold text-sm px-2 py-1.5">
                  x{card.ownedCount}
                </Badge>
              )}
            </button>
          );
        })}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center">
          <Button onClick={handleLoadMore} variant="outline" size="lg">
            Load More
          </Button>
        </div>
      )}
    </div>
  );
}

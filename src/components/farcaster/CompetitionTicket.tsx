/**
 * @title CompetitionTicket Component (Farcaster) - SECURE
 * @notice Displays user's competition ticket with validated image URLs
 * @dev KISS principle: Isolated ticket logic, easy to debug and maintain
 * @dev Reads ticket metadata from GeoChallenge ERC1155 contract
 * @security Image URLs validated against whitelist in API route
 */

"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTicketMetadata } from "@/hooks/farcaster";
import Image from "next/image";
import { Ticket } from "lucide-react";

interface CompetitionTicketProps {
  /** User wallet address */
  address: string | undefined;
  /** Whether user owns a ticket (from contract balanceOf) */
  hasTicket: boolean;
  /** User's ticket balance from contract */
  userTicketBalance: bigint | undefined;
  /** Competition ID */
  competitionId: bigint;
  /** Enable debug mode to show diagnostic information */
  debugMode?: boolean;
}

/**
 * Competition Ticket Display Component
 * Shows ticket NFT image when user owns it
 * With image error handling and fallback
 */
export function CompetitionTicket({
  address,
  hasTicket,
  competitionId,
}: CompetitionTicketProps) {
  // Image error state for fallback handling
  const [imageError, setImageError] = useState(false);

  // Fetch ticket metadata from GeoChallenge contract (ERC1155 uri)
  const {
    data: ticketMetadata,
    loading: loadingTicketMetadata,
    error: ticketMetadataError,
  } = useTicketMetadata(competitionId, address);

  // Reset error state when ticket metadata image URL changes
  // This ensures new images are displayed even if previous ones failed
  useEffect(() => {
    setImageError(false);
  }, [ticketMetadata?.image]);

  // Handle image load errors
  const handleImageError = () => {
    console.warn('[CompetitionTicket] Failed to load ticket image');
    setImageError(true);
  };

  return (
    <div>
      {/* Ticket Display Logic */}
      {address && hasTicket ? (
        loadingTicketMetadata ? (
          // Loading state
          <Skeleton className="w-full aspect-video max-w-[200px] mx-auto" />
        ) : ticketMetadata?.image && !imageError ? (
          // Ticket found - display image with error handling
          <div className="relative w-full aspect-video flex items-center px-3 overflow-hidden justify-center">
            <Image
              src={ticketMetadata.image}
              alt={ticketMetadata.name || "Competition Ticket"}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-contain"
              onError={handleImageError}
              priority
            />
          </div>
        ) : (
          // Image failed to load or metadata not found - show fallback
          <div className="relative w-full aspect-video flex flex-col items-center justify-center px-3 py-6 bg-slate-900 rounded-lg border border-slate-700">
            <Ticket className="h-12 w-12 text-slate-400 mb-2" />
            <p className="text-xs text-slate-400 text-center">
              {ticketMetadataError
                ? "Failed to load ticket metadata"
                : imageError
                ? "Ticket image unavailable"
                : "Competition Ticket"}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Competition #{competitionId.toString()}
            </p>
          </div>
        )
      ) : (
        // User doesn't have ticket or not connected
        <Alert>
          <AlertDescription className="text-xs">
            {!address
              ? "Connect wallet to view your ticket"
              : "Purchase a ticket to participate"}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

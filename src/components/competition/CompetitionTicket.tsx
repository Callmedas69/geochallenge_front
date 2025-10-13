/**
 * @title CompetitionTicket Component (Main Website)
 * @notice Displays user's competition ticket NFT
 * @dev KISS principle: Isolated ticket logic, easy to maintain
 * @dev Reads ticket metadata from GeoChallenge ERC1155 contract
 */

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTicketMetadata } from "@/hooks/useVibeAPI";
import Image from "next/image";

interface CompetitionTicketProps {
  /** Competition ID (ERC1155 token ID) */
  competitionId: bigint;
  /** User wallet address */
  address: string | undefined;
  /** Whether user owns a ticket */
  hasTicket: boolean;
  /** User's ticket balance */
  userTicketBalance: bigint | undefined;
}

/**
 * Competition Ticket Display Component
 * Shows the ticket NFT image when user owns it
 * Handles loading and error states
 */
export function CompetitionTicket({
  competitionId,
  address,
  hasTicket,
  userTicketBalance,
}: CompetitionTicketProps) {
  // Fetch ticket metadata from GeoChallenge contract (ERC1155 uri)
  const { data: ticketMetadata, loading: loadingTicketMetadata } =
    useTicketMetadata(competitionId, address);

  // Don't render if user doesn't have a ticket
  if (!hasTicket) {
    return null;
  }

  return (
    <div>
      {loadingTicketMetadata ? (
        <Skeleton className="h-48 w-full rounded-lg" />
      ) : ticketMetadata?.image ? (
        <div className="relative w-full aspect-video">
          <Image
            src={ticketMetadata.image}
            alt={ticketMetadata.name}
            fill
            sizes="(max-width: 1024px) 100vw, 33vw"
            className="object-contain rounded-xl"
          />
        </div>
      ) : (
        <Alert variant="destructive">
          <AlertDescription className="text-xs">
            Failed to load ticket image. Please refresh the page.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

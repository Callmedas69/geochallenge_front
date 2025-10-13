/**
 * @title CompetitionTicket Component (Farcaster)
 * @notice Displays user's competition ticket with debug mode
 * @dev KISS principle: Isolated ticket logic, easy to debug and maintain
 * @dev Reads ticket metadata from GeoChallenge ERC1155 contract
 */

"use client";

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
 * Optional debug mode for troubleshooting
 */
export function CompetitionTicket({
  address,
  hasTicket,
  userTicketBalance,
  competitionId,
  debugMode = false,
}: CompetitionTicketProps) {
  // Fetch ticket metadata from GeoChallenge contract (ERC1155 uri)
  const {
    data: ticketMetadata,
    loading: loadingTicketMetadata,
    error: ticketMetadataError,
  } = useTicketMetadata(competitionId, address);

  return (
    <Card>
      <CardHeader className="p-3 pb-2">
        <CardTitle className="text-sm">
          {debugMode ? "Ticket Debug Info" : "Your Ticket"}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 space-y-2">
        {/* Debug Panel - Only show when debugMode is true */}
        {debugMode && (
          <div className="text-xs space-y-1 font-mono bg-muted p-2 rounded">
            <div>
              address:{" "}
              {address
                ? `${address.slice(0, 6)}...${address.slice(-4)}`
                : "NOT CONNECTED"}
            </div>
            <div>hasTicket: {hasTicket ? "TRUE" : "FALSE"}</div>
            <div>
              userTicketBalance: {userTicketBalance?.toString() || "NONE"}
            </div>
            <div>
              loadingTicketMetadata: {loadingTicketMetadata ? "TRUE" : "FALSE"}
            </div>
            <div>
              ticketMetadata exists: {ticketMetadata ? "TRUE" : "FALSE"}
            </div>
            <div>
              ticketMetadata.image: {ticketMetadata?.image ? "EXISTS" : "NONE"}
            </div>
            <div>ticketMetadataError: {ticketMetadataError || "NONE"}</div>
            <div>competitionId: {competitionId.toString()}</div>
            <div>
              userAddress:{" "}
              {address
                ? `${address.slice(0, 6)}...${address.slice(-4)}`
                : "NOT CONNECTED"}
            </div>
          </div>
        )}

        {/* Ticket Display Logic */}
        {address && hasTicket ? (
          loadingTicketMetadata ? (
            // Loading state
            <Skeleton className="w-full aspect-[5/7] max-w-[200px] mx-auto" />
          ) : ticketMetadata?.image ? (
            // Ticket found - display image with quantity badge
            <div className="relative w-full aspect-[5/7] max-w-[200px] mx-auto">
              <Image
                src={ticketMetadata.image}
                alt={ticketMetadata.name || "Competition Ticket"}
                fill
                sizes="200px"
                className="object-cover rounded-lg"
              />
            </div>
          ) : (
            // Ticket metadata not found from TicketRenderer
            <Alert variant="destructive">
              <AlertDescription className="text-xs">
                Failed to load ticket metadata from contract.
                {ticketMetadataError && ` Error: ${ticketMetadataError}`}
              </AlertDescription>
            </Alert>
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
      </CardContent>
    </Card>
  );
}

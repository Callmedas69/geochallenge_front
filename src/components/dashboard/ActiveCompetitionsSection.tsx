/**
 * @title Active Competitions Section Component
 * @notice Shows user's active competitions
 * @dev KISS principle - simple list of active competitions with links
 */

"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Ticket, Clock, TrendingUp, ExternalLink } from "lucide-react";
import { formatEther } from "viem";
import Link from "next/link";
import type { Competition } from "@/lib/types";

interface ActiveCompetitionsSectionProps {
  activeCompIds: readonly bigint[] | undefined;
  isLoading?: boolean;
}

export function ActiveCompetitionsSection({
  activeCompIds,
  isLoading,
}: ActiveCompetitionsSectionProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ticket className="h-5 w-5" />
            Active Competitions
          </CardTitle>
          <CardDescription>Loading your active competitions...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg p-4 animate-pulse">
              <div className="h-6 w-48 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-32 bg-gray-200 rounded" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  // Show empty state if no active competitions
  if (!activeCompIds || activeCompIds.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ticket className="h-5 w-5" />
            Active Competitions
          </CardTitle>
          <CardDescription>
            You are not participating in any active competitions
          </CardDescription>
        </CardHeader>
        <CardContent className="py-8 text-center text-muted-foreground">
          <Ticket className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>No active competitions</p>
          <p className="text-xs mt-1">
            Buy tickets for competitions to participate and win prizes
          </p>
          <Link href="/competition">
            <Button variant="outline" className="mt-4">
              Browse Competitions
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Ticket className="h-5 w-5" />
          Active Competitions
        </CardTitle>
        <CardDescription>
          You are participating in {activeCompIds.length} active competition
          {activeCompIds.length !== 1 ? "s" : ""}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {activeCompIds.map((compId) => (
          <div
            key={compId.toString()}
            className="border rounded-lg p-4 hover:border-blue-500 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-lg">
                    Competition #{compId.toString()}
                  </h3>
                  <Badge variant="default" className="bg-blue-500">
                    Active
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Ticket className="h-4 w-4" />
                    <span>Ticket Purchased</span>
                  </div>
                </div>
              </div>
              <Link href={`/competition/${compId}`}>
                <span className="flex !text-black underline">
                  View Details
                  <ExternalLink className="h-3 w-3 ml-1" />
                </span>
              </Link>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

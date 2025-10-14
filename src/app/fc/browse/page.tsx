/**
 * @title Farcaster Browse Page
 * @notice Browse all competitions with filtering (Active/All tabs) for Farcaster miniApps
 * @dev KISS principle: Mobile-optimized tabbed interface for competition browsing
 * @dev Route: /fc/browse (Farcaster-specific browse route)
 */

"use client";

import { useState, useMemo } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAllCompetitions } from "@/hooks/useAllCompetitions";
import { CompetitionCard, BottomNav, FarcasterHeader } from "@/components/farcaster";
import { useAutoConnect } from "@/lib/farcaster";
import { ArrowLeft, List } from "lucide-react";
import Link from "next/link";

export default function FarcasterBrowsePage() {
  // Auto-connect Farcaster wallet
  useAutoConnect();

  const [activeTab, setActiveTab] = useState<"active" | "all">("active");
  const { competitions, isLoading } = useAllCompetitions();

  // Filter active competitions (state = 1)
  const activeCompetitions = useMemo(
    () => competitions.filter((comp) => comp.state === 1),
    [competitions]
  );

  // Loading state
  if (isLoading) {
    return (
      <>
        <FarcasterHeader />
        <div className="container mx-auto px-3 py-4 pb-20 space-y-4">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-10 w-full" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <div className="flex gap-3 p-3">
                  <Skeleton className="w-[100px] aspect-[5/7] flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
        <BottomNav />
      </>
    );
  }

  return (
    <>
      {/* Sticky Header with Info Icon */}
      <FarcasterHeader />

      <div className="container mx-auto px-3 py-4 pb-20 space-y-4">
        {/* Back Button */}
        <Button variant="ghost" size="sm" asChild>
          <Link href="/fc">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Home
          </Link>
        </Button>

        {/* Page Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <List className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-bold">Browse Competitions</h1>
          </div>
          <p className="text-xs text-muted-foreground">
            Explore active and completed competitions
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "active" | "all")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active" className="text-sm">
              Active
              {activeCompetitions.length > 0 && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {activeCompetitions.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="all" className="text-sm">
              All
              {competitions.length > 0 && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {competitions.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Active Tab */}
          <TabsContent value="active" className="space-y-3 mt-4">
            {activeCompetitions.length === 0 ? (
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-base">No Active Competitions</CardTitle>
                  <CardDescription className="text-sm">
                    There are no active competitions at the moment. Check back soon!
                  </CardDescription>
                </CardHeader>
              </Card>
            ) : (
              activeCompetitions.map((comp, index) => (
                <CompetitionCard
                  key={comp.id.toString()}
                  competitionId={comp.id}
                  priority={index < 3} // Prioritize first 3 images
                />
              ))
            )}
          </TabsContent>

          {/* All Tab */}
          <TabsContent value="all" className="space-y-3 mt-4">
            {competitions.length === 0 ? (
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-base">No Competitions</CardTitle>
                  <CardDescription className="text-sm">
                    No competitions have been created yet.
                  </CardDescription>
                </CardHeader>
              </Card>
            ) : (
              competitions.map((comp, index) => (
                <CompetitionCard
                  key={comp.id.toString()}
                  competitionId={comp.id}
                  priority={index < 3} // Prioritize first 3 images
                />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Fixed Bottom Navigation */}
      <BottomNav />
    </>
  );
}

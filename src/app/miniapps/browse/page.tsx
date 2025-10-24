/**
 * @title Farcaster Browse Page
 * @notice Browse all competitions with filtering (Active/All tabs) and sorting for Farcaster miniApps
 * @dev KISS principle: Mobile-optimized tabbed interface for competition browsing
 * @dev Route: /miniapps/browse (Farcaster-specific browse route)
 */

"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAllCompetitions } from "@/hooks/useAllCompetitions";
import {
  CompetitionCard,
  BottomNav,
  FarcasterHeader,
} from "@/components/farcaster";
import { useAutoConnect } from "@/lib/farcaster";
import { ArrowLeft, List, ArrowUpDown } from "lucide-react";
import Link from "next/link";
import { type SortOption, SORT_OPTIONS_COMPACT } from "@/hooks/useSortedCompetitions";

export default function FarcasterBrowsePage() {
  // Auto-connect Farcaster wallet
  useAutoConnect();

  const [activeTab, setActiveTab] = useState<"active" | "all">("active");
  const [sortBy, setSortBy] = useState<SortOption>("tickets");
  const { competitions, isLoading } = useAllCompetitions();

  // Filter active competitions (state = 1)
  const activeCompetitions = useMemo(
    () => competitions.filter((comp) => comp.state === 1),
    [competitions]
  );

  // Sort competitions based on selected criteria
  const sortedAllCompetitions = useMemo(() => {
    const sorted = [...competitions].sort((a, b) => {
      switch (sortBy) {
        case "tickets":
          return Number(b.totalTickets) - Number(a.totalTickets);
        case "deadline":
          return Number(a.deadline) - Number(b.deadline);
        case "id":
          return Number(b.id) - Number(a.id);
        default:
          return 0;
      }
    });
    return sorted;
  }, [competitions, sortBy]);

  const sortedActiveCompetitions = useMemo(() => {
    const sorted = [...activeCompetitions].sort((a, b) => {
      switch (sortBy) {
        case "tickets":
          return Number(b.totalTickets) - Number(a.totalTickets);
        case "deadline":
          return Number(a.deadline) - Number(b.deadline);
        case "id":
          return Number(b.id) - Number(a.id);
        default:
          return 0;
      }
    });
    return sorted;
  }, [activeCompetitions, sortBy]);

  // Loading state
  if (isLoading) {
    return (
      <>
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
      </>
    );
  }

  return (
    <>
      <div className="container mx-auto px-3 py-4 pb-20 space-y-4">
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

        {/* Sort Dropdown */}
        <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
          <SelectTrigger className="w-full">
            <ArrowUpDown className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tickets">{SORT_OPTIONS_COMPACT.tickets}</SelectItem>
            <SelectItem value="deadline">{SORT_OPTIONS_COMPACT.deadline}</SelectItem>
            <SelectItem value="id">{SORT_OPTIONS_COMPACT.id}</SelectItem>
          </SelectContent>
        </Select>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "active" | "all")}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active" className="text-sm">
              Active
              {sortedActiveCompetitions.length > 0 && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {sortedActiveCompetitions.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="all" className="text-sm">
              All
              {sortedAllCompetitions.length > 0 && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {sortedAllCompetitions.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Active Tab */}
          <TabsContent value="active" className="space-y-3 mt-4">
            {sortedActiveCompetitions.length === 0 ? (
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-base">
                    No Active Competitions
                  </CardTitle>
                  <CardDescription className="text-sm">
                    There are no active competitions at the moment. Check back
                    soon!
                  </CardDescription>
                </CardHeader>
              </Card>
            ) : (
              sortedActiveCompetitions.map((comp, index) => (
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
            {sortedAllCompetitions.length === 0 ? (
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-base">No Competitions</CardTitle>
                  <CardDescription className="text-sm">
                    No competitions have been created yet.
                  </CardDescription>
                </CardHeader>
              </Card>
            ) : (
              sortedAllCompetitions.map((comp, index) => (
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
    </>
  );
}

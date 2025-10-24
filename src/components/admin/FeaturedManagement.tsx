/**
 * @title Featured Management Component
 * @notice Admin UI for managing featured competitions
 * @dev KISS principle - simple list with add/remove/reorder actions
 */

"use client";

import { useState, useMemo } from "react";
import { useFeaturedCompetitions } from "@/hooks/supabase/useFeaturedCompetitions";
import { useFeaturedMutations } from "@/hooks/supabase/useFeaturedMutations";
import { useReadContracts } from "wagmi";
import { geoChallenge_implementation_ABI } from "@/abi";
import { CONTRACT_ADDRESSES } from "@/lib/contractList";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Star,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Loader2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

const MAX_FEATURED = 10; // Maximum featured competitions

export function FeaturedManagement() {
  const { data: featuredIds, isLoading: loadingFeatured } = useFeaturedCompetitions();
  const { addFeatured, removeFeatured, updatePriorities, isLoading: mutationLoading } =
    useFeaturedMutations();

  // Add competition dialog state
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newCompetitionId, setNewCompetitionId] = useState("");
  const [notes, setNotes] = useState("");

  // Fetch competition details for all featured IDs
  const { data: competitionsData, isLoading: loadingDetails } = useReadContracts({
    contracts:
      featuredIds?.map((id) => ({
        address: CONTRACT_ADDRESSES.GeoChallenge,
        abi: geoChallenge_implementation_ABI,
        functionName: "getCompetition",
        args: [BigInt(id)],
      })) || [],
    query: {
      enabled: !!featuredIds && featuredIds.length > 0,
    },
  });

  // Process competition data
  const featuredCompetitions = useMemo(() => {
    if (!featuredIds || !competitionsData) return [];

    return featuredIds.map((id, index) => {
      const competitionResult = competitionsData[index];
      const competition = competitionResult?.result as any;

      return {
        id,
        priority: index, // Sorted by API, so index = priority
        name: competition?.name || `Competition #${id}`,
        state: competition?.state || 0,
        totalTickets: competition?.totalTickets || BigInt(0),
      };
    });
  }, [featuredIds, competitionsData]);

  // Handle add featured competition
  const handleAdd = async () => {
    const compId = parseInt(newCompetitionId);

    if (isNaN(compId) || compId <= 0) {
      toast.error("Please enter a valid competition ID");
      return;
    }

    try {
      await addFeatured.mutateAsync({
        competitionId: compId,
        priority: featuredIds?.length || 0, // Add at the end
        notes: notes.trim() || undefined,
      });

      // Reset form and close dialog
      setNewCompetitionId("");
      setNotes("");
      setAddDialogOpen(false);
    } catch (error) {
      // Error handled by mutation
    }
  };

  // Handle remove featured competition
  const handleRemove = async (competitionId: number) => {
    try {
      await removeFeatured.mutateAsync(competitionId);
    } catch (error) {
      // Error handled by mutation
    }
  };

  // Handle move up (decrease priority number)
  const handleMoveUp = async (index: number) => {
    if (index === 0 || !featuredIds) return;

    const updates = [
      { competitionId: featuredIds[index], priority: index - 1 },
      { competitionId: featuredIds[index - 1], priority: index },
    ];

    try {
      await updatePriorities.mutateAsync({ updates });
    } catch (error) {
      // Error handled by mutation
    }
  };

  // Handle move down (increase priority number)
  const handleMoveDown = async (index: number) => {
    if (!featuredIds || index === featuredIds.length - 1) return;

    const updates = [
      { competitionId: featuredIds[index], priority: index + 1 },
      { competitionId: featuredIds[index + 1], priority: index },
    ];

    try {
      await updatePriorities.mutateAsync({ updates });
    } catch (error) {
      // Error handled by mutation
    }
  };

  const isLoading = loadingFeatured || loadingDetails || mutationLoading;
  const atMaxCapacity = (featuredIds?.length || 0) >= MAX_FEATURED;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-yellow-500" />
          Featured Competitions
        </CardTitle>
        <CardDescription>
          Manage which competitions appear in the featured section on the homepage
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Info Alert */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Featured competitions will be displayed at the top of the homepage in priority order.
            Maximum {MAX_FEATURED} featured competitions allowed.
          </AlertDescription>
        </Alert>

        {/* Current Featured List */}
        {loadingFeatured ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : featuredCompetitions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Star className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No featured competitions yet</p>
            <p className="text-sm">Click "Add Featured" to get started</p>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground mb-3">
              Current Featured ({featuredCompetitions.length}/{MAX_FEATURED})
            </p>

            {featuredCompetitions.map((comp, index) => (
              <div
                key={comp.id}
                className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                {/* Priority Number */}
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                  {index + 1}
                </div>

                {/* Competition Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{comp.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Competition #{comp.id} • {comp.totalTickets.toString()} tickets sold
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  {/* Move Up */}
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={index === 0 || isLoading}
                    onClick={() => handleMoveUp(index)}
                    title="Move up"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>

                  {/* Move Down */}
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={index === featuredCompetitions.length - 1 || isLoading}
                    onClick={() => handleMoveDown(index)}
                    title="Move down"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>

                  {/* Remove */}
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={isLoading}
                    onClick={() => handleRemove(comp.id)}
                    className="text-destructive hover:text-destructive"
                    title="Remove from featured"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Featured Button + Dialog */}
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="w-full"
              disabled={isLoading || atMaxCapacity}
              variant={atMaxCapacity ? "secondary" : "default"}
            >
              <Plus className="h-4 w-4 mr-2" />
              {atMaxCapacity ? "Maximum Reached" : "Add Featured Competition"}
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Featured Competition</DialogTitle>
              <DialogDescription>
                Enter the competition ID you want to feature on the homepage
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Competition ID */}
              <div className="space-y-2">
                <Label htmlFor="competition-id">Competition ID *</Label>
                <Input
                  id="competition-id"
                  type="number"
                  placeholder="e.g., 5"
                  value={newCompetitionId}
                  onChange={(e) => setNewCompetitionId(e.target.value)}
                  min="1"
                />
                <p className="text-xs text-muted-foreground">
                  The competition must exist on-chain
                </p>
              </div>

              {/* Notes (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Reason for featuring this competition..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setAddDialogOpen(false)}
                disabled={addFeatured.isPending}
              >
                Cancel
              </Button>
              <Button onClick={handleAdd} disabled={addFeatured.isPending || !newCompetitionId}>
                {addFeatured.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Star className="h-4 w-4 mr-2" />
                    Add Featured
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

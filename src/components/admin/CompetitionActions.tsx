/**
 * @title CompetitionActions Component
 * @notice Card-based competition management interface
 * @dev KISS principle - visual cards with context-aware actions
 */

"use client";

import { useState, useMemo, useEffect } from "react";
import {
  useStartCompetition,
  useEndCompetition,
  useFinalizeCompetition,
  useCancelCompetition,
  useEmergencyPauseCompetition,
  useEmergencyUnpauseCompetition,
  useExtendDeadline,
  useAddPrizeETH,
  useAddBoosterBoxes,
  useSetBoosterBoxQuantity,
  useUpdateVerifier,
} from "@/hooks/useAdminActions";
import { useAllCompetitions } from "@/hooks/useAllCompetitions";
import { CompetitionCard } from "./CompetitionCard";
import { ManageCompetitionDialog } from "./ManageCompetitionDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CompetitionState } from "@/lib/types";
import {
  Loader2,
  AlertCircle,
  Trophy,
  Play,
  Square,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

export function CompetitionActions() {
  const { competitions, isLoading, totalCount } = useAllCompetitions();
  const [activeTab, setActiveTab] = useState("all");
  const [manageDialogOpen, setManageDialogOpen] = useState(false);
  const [selectedCompetition, setSelectedCompetition] = useState<{
    id: bigint;
    name: string;
  } | null>(null);

  // Track which competition is currently processing
  const [processingCompetitionId, setProcessingCompetitionId] = useState<bigint | null>(null);

  // Lifecycle hooks
  const startHook = useStartCompetition();
  const endHook = useEndCompetition();
  const finalizeHook = useFinalizeCompetition();
  const cancelHook = useCancelCompetition();
  const pauseHook = useEmergencyPauseCompetition();
  const unpauseHook = useEmergencyUnpauseCompetition();

  // Management hooks
  const extendHook = useExtendDeadline();
  const addPrizeHook = useAddPrizeETH();
  const addBoosterHook = useAddBoosterBoxes();
  const setBoosterHook = useSetBoosterBoxQuantity();
  const updateVerifierHook = useUpdateVerifier();

  // Clear processing ID when any transaction completes
  useEffect(() => {
    const anyPending =
      startHook.isPending ||
      startHook.isConfirming ||
      endHook.isPending ||
      endHook.isConfirming ||
      finalizeHook.isPending ||
      finalizeHook.isConfirming ||
      cancelHook.isPending ||
      cancelHook.isConfirming ||
      pauseHook.isPending ||
      pauseHook.isConfirming ||
      unpauseHook.isPending ||
      unpauseHook.isConfirming ||
      extendHook.isPending ||
      extendHook.isConfirming ||
      addPrizeHook.isPending ||
      addPrizeHook.isConfirming ||
      addBoosterHook.isPending ||
      addBoosterHook.isConfirming ||
      setBoosterHook.isPending ||
      setBoosterHook.isConfirming ||
      updateVerifierHook.isPending ||
      updateVerifierHook.isConfirming;

    if (!anyPending && processingCompetitionId !== null) {
      setProcessingCompetitionId(null);
    }
  }, [
    startHook.isPending,
    startHook.isConfirming,
    endHook.isPending,
    endHook.isConfirming,
    finalizeHook.isPending,
    finalizeHook.isConfirming,
    cancelHook.isPending,
    cancelHook.isConfirming,
    pauseHook.isPending,
    pauseHook.isConfirming,
    unpauseHook.isPending,
    unpauseHook.isConfirming,
    extendHook.isPending,
    extendHook.isConfirming,
    addPrizeHook.isPending,
    addPrizeHook.isConfirming,
    addBoosterHook.isPending,
    addBoosterHook.isConfirming,
    setBoosterHook.isPending,
    setBoosterHook.isConfirming,
    updateVerifierHook.isPending,
    updateVerifierHook.isConfirming,
    processingCompetitionId,
  ]);

  // Filter competitions by state
  const filteredCompetitions = useMemo(() => {
    if (activeTab === "all") return competitions;

    const stateMap: Record<string, number> = {
      "not-started": CompetitionState.NOT_STARTED,
      active: CompetitionState.ACTIVE,
      ended: CompetitionState.ENDED,
      finalized: CompetitionState.FINALIZED,
      cancelled: CompetitionState.CANCELLED,
    };

    return competitions.filter((c) => c.state === stateMap[activeTab]);
  }, [competitions, activeTab]);

  // Count by status
  const counts = useMemo(() => {
    return {
      all: competitions.length,
      notStarted: competitions.filter((c) => c.state === CompetitionState.NOT_STARTED).length,
      active: competitions.filter((c) => c.state === CompetitionState.ACTIVE).length,
      ended: competitions.filter((c) => c.state === CompetitionState.ENDED).length,
      finalized: competitions.filter((c) => c.state === CompetitionState.FINALIZED).length,
      cancelled: competitions.filter((c) => c.state === CompetitionState.CANCELLED).length,
    };
  }, [competitions]);

  // Handle manage dialog
  const handleManage = (id: bigint, name: string) => {
    setSelectedCompetition({ id, name });
    setManageDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          <span className="text-muted-foreground">Loading competitions...</span>
        </div>
      </div>
    );
  }

  if (totalCount === 0) {
    return (
      <Alert>
        <Trophy className="h-4 w-4" />
        <AlertDescription>
          No competitions created yet. Use the "Create Competition" tab to get started.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status Filter Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">
            All ({counts.all})
          </TabsTrigger>
          <TabsTrigger value="not-started" className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Not Started ({counts.notStarted})
          </TabsTrigger>
          <TabsTrigger value="active" className="flex items-center gap-1">
            <Play className="w-3 h-3" />
            Active ({counts.active})
          </TabsTrigger>
          <TabsTrigger value="ended" className="flex items-center gap-1">
            <Square className="w-3 h-3" />
            Ended ({counts.ended})
          </TabsTrigger>
          <TabsTrigger value="finalized" className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Finalized ({counts.finalized})
          </TabsTrigger>
          <TabsTrigger value="cancelled" className="flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            Cancelled ({counts.cancelled})
          </TabsTrigger>
        </TabsList>

        {/* All Tabs Content - Same Cards, Different Filter */}
        {["all", "not-started", "active", "ended", "finalized", "cancelled"].map((tab) => (
          <TabsContent key={tab} value={tab} className="space-y-4 mt-6">
            {filteredCompetitions.length === 0 ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  No competitions in this category.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredCompetitions.map((comp) => (
                  <CompetitionCard
                    key={comp.id.toString()}
                    id={comp.id}
                    name={comp.name}
                    description={comp.description}
                    state={comp.state}
                    prizePool={comp.prizePool}
                    totalTickets={comp.totalTickets}
                    deadline={comp.deadline}
                    emergencyPaused={comp.emergencyPaused}
                    winnerDeclared={comp.winnerDeclared}
                    winnerDeclaredAt={comp.winnerDeclaredAt}
                    onStart={() => {
                      setProcessingCompetitionId(comp.id);
                      startHook.startCompetition(comp.id);
                    }}
                    onEnd={() => {
                      setProcessingCompetitionId(comp.id);
                      endHook.endCompetition(comp.id);
                    }}
                    onFinalize={() => {
                      setProcessingCompetitionId(comp.id);
                      finalizeHook.finalizeCompetition(comp.id);
                    }}
                    onCancel={() => {
                      setProcessingCompetitionId(comp.id);
                      cancelHook.cancelCompetition(comp.id);
                    }}
                    onPause={() => {
                      setProcessingCompetitionId(comp.id);
                      pauseHook.emergencyPause(comp.id);
                    }}
                    onUnpause={() => {
                      setProcessingCompetitionId(comp.id);
                      unpauseHook.emergencyUnpause(comp.id);
                    }}
                    onManage={() => handleManage(comp.id, comp.name)}
                    isLoading={processingCompetitionId === comp.id}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>


      {/* Manage Competition Dialog */}
      {selectedCompetition && (() => {
        const comp = competitions.find((c) => c.id === selectedCompetition.id);
        return comp ? (
          <ManageCompetitionDialog
            open={manageDialogOpen}
            onOpenChange={setManageDialogOpen}
            competitionId={selectedCompetition.id}
            competitionName={selectedCompetition.name}
            currentDeadline={comp.deadline}
            onAddPrize={(amount) => addPrizeHook.addPrize(selectedCompetition.id, amount)}
            onExtendDeadline={(newDeadline) =>
              extendHook.extendDeadline(selectedCompetition.id, newDeadline)
            }
            onAddBoosterBoxes={(quantity) =>
              addBoosterHook.addBoosterBoxes(selectedCompetition.id, quantity)
            }
            onSetBoosterBoxQuantity={(quantity) =>
              setBoosterHook.setBoosterBoxQuantity(selectedCompetition.id, quantity)
            }
            onUpdateVerifier={(address) =>
              updateVerifierHook.updateVerifier(selectedCompetition.id, address)
            }
            isAddPrizeLoading={addPrizeHook.isPending}
            isExtendDeadlineLoading={extendHook.isPending}
            isAddBoosterLoading={addBoosterHook.isPending}
            isSetBoosterLoading={setBoosterHook.isPending}
            isUpdateVerifierLoading={updateVerifierHook.isPending}
          />
        ) : null;
      })()}
    </div>
  );
}

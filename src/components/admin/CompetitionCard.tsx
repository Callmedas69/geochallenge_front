/**
 * @title CompetitionCard Component
 * @notice Single competition card with quick actions
 * @dev KISS principle - clean display with context-aware actions
 */

"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ConfirmInputDialog } from "@/components/ui/confirm-input-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Play,
  Square,
  CheckCircle,
  XCircle,
  Pause,
  Clock,
  Users,
  DollarSign,
  Loader2,
  MoreVertical,
  Settings,
} from "lucide-react";
import { formatEther } from "viem";
import { CompetitionState, GRACE_PERIOD, NO_WINNER_WAIT_PERIOD } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";

interface CompetitionCardProps {
  id: bigint;
  name: string;
  description: string;
  state: number;
  prizePool: bigint;
  totalTickets: bigint;
  deadline: bigint;
  emergencyPaused: boolean;
  winnerDeclared: boolean;
  winnerDeclaredAt: bigint;
  onStart?: () => void;
  onEnd?: () => void;
  onFinalize?: () => void;
  onCancel?: () => void;
  onPause?: () => void;
  onUnpause?: () => void;
  onManage?: () => void;
  isLoading?: boolean;
}

export function CompetitionCard({
  id,
  name,
  description,
  state,
  prizePool,
  totalTickets,
  deadline,
  emergencyPaused,
  winnerDeclared,
  winnerDeclaredAt,
  onStart,
  onEnd,
  onFinalize,
  onCancel,
  onPause,
  onUnpause,
  onManage,
  isLoading,
}: CompetitionCardProps) {
  // State badges
  const getStateBadge = () => {
    const badges = {
      0: { label: "Not Started", variant: "secondary" as const, color: "bg-gray-500" },
      1: { label: "Active", variant: "default" as const, color: "bg-green-500" },
      2: { label: "Ended", variant: "outline" as const, color: "bg-blue-500" },
      3: { label: "Finalized", variant: "outline" as const, color: "bg-purple-500" },
      4: { label: "Cancelled", variant: "destructive" as const, color: "bg-red-500" },
    };
    return badges[state as keyof typeof badges] || badges[0];
  };

  const badge = getStateBadge();
  const deadlineDate = new Date(Number(deadline) * 1000);
  const now = new Date();
  const isExpired = deadlineDate < now;
  const timeRemaining = isExpired
    ? "Expired"
    : formatDistanceToNow(deadlineDate, { addSuffix: true });

  // Tooltip message helpers (KISS principle - clear, simple messages)
  const getStartTooltip = () => {
    if (state !== CompetitionState.NOT_STARTED) return "Competition already started";
    return null;
  };

  const getEndTooltip = () => {
    if (state !== CompetitionState.ACTIVE) return "Competition must be active";
    if (!isExpired) return "Deadline not reached yet";
    return null;
  };

  const getFinalizeTooltip = () => {
    if (state === CompetitionState.NOT_STARTED) return "Must start competition first";
    if (state === CompetitionState.ACTIVE) return "Must end competition first";
    if (state === CompetitionState.FINALIZED) return "Already finalized";
    if (state === CompetitionState.CANCELLED) return "Competition was cancelled";

    // Check wait period for ENDED state
    if (state === CompetitionState.ENDED) {
      const now = Math.floor(Date.now() / 1000);
      let waitPeriodEnd: number;

      if (winnerDeclared) {
        // Winner declared: wait for grace period
        waitPeriodEnd = Number(winnerDeclaredAt) + GRACE_PERIOD;
        if (now < waitPeriodEnd) {
          const timeRemaining = waitPeriodEnd - now;
          const hours = Math.floor(timeRemaining / 3600);
          const minutes = Math.floor((timeRemaining % 3600) / 60);
          return `Grace period active. Finalize available in ${hours}h ${minutes}m`;
        }
      } else {
        // No winner: wait for no-winner period
        waitPeriodEnd = Number(deadline) + NO_WINNER_WAIT_PERIOD;
        if (now < waitPeriodEnd) {
          const timeRemaining = waitPeriodEnd - now;
          const hours = Math.floor(timeRemaining / 3600);
          const minutes = Math.floor((timeRemaining % 3600) / 60);
          return `Wait period active. Finalize available in ${hours}h ${minutes}m`;
        }
      }
    }

    return null;
  };

  const getCancelTooltip = () => {
    if (state === CompetitionState.ENDED) return "Cannot cancel after ending";
    if (state === CompetitionState.FINALIZED) return "Already finalized";
    if (state === CompetitionState.CANCELLED) return "Already cancelled";
    return null;
  };

  const getPauseTooltip = () => {
    if (state === CompetitionState.FINALIZED) return "Cannot pause finalized competition";
    if (state === CompetitionState.CANCELLED) return "Competition was cancelled";
    if (emergencyPaused) return "Competition already paused";
    return null;
  };

  const getUnpauseTooltip = () => {
    if (!emergencyPaused) return "Competition not paused";
    return null;
  };

  // Quick action buttons - Show all with disabled states (KISS principle)
  const renderActions = () => {
    if (isLoading) {
      return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Loading...</span>
        </div>
      );
    }

    // Show completion badges for final states
    if (state === CompetitionState.FINALIZED) {
      return (
        <Badge variant="outline" className="text-xs">
          Complete
        </Badge>
      );
    }

    if (state === CompetitionState.CANCELLED) {
      return (
        <Badge variant="destructive" className="text-xs">
          Cancelled
        </Badge>
      );
    }

    // Calculate disabled states
    const canStart = state === CompetitionState.NOT_STARTED;
    const canEnd = state === CompetitionState.ACTIVE && isExpired;

    // Calculate canFinalize with wait period validation
    const canFinalize = (() => {
      if (state !== CompetitionState.ENDED) return false;

      const now = Math.floor(Date.now() / 1000);
      let waitPeriodEnd: number;

      if (winnerDeclared) {
        // Winner declared: check grace period (24 hours)
        waitPeriodEnd = Number(winnerDeclaredAt) + GRACE_PERIOD;
        return now >= waitPeriodEnd;
      } else {
        // No winner: check no-winner wait period (1 day)
        waitPeriodEnd = Number(deadline) + NO_WINNER_WAIT_PERIOD;
        return now >= waitPeriodEnd;
      }
    })();

    const canCancel =
      state === CompetitionState.NOT_STARTED ||
      state === CompetitionState.ACTIVE;
    const canPause =
      (state === CompetitionState.NOT_STARTED ||
       state === CompetitionState.ACTIVE ||
       state === CompetitionState.ENDED) &&
      !emergencyPaused;
    const canUnpause = emergencyPaused;

    // Show all buttons with proper disabled states and tooltips
    return (
      <div className="flex flex-wrap gap-2">
        {/* START Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <Button
                size="sm"
                onClick={onStart}
                disabled={!canStart || isLoading}
                variant={canStart ? "default" : "outline"}
              >
                <Play className="w-4 h-4 mr-1" />
                Start
              </Button>
            </span>
          </TooltipTrigger>
          {getStartTooltip() && (
            <TooltipContent>
              <p>{getStartTooltip()}</p>
            </TooltipContent>
          )}
        </Tooltip>

        {/* END Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <Button
                size="sm"
                onClick={onEnd}
                disabled={!canEnd || isLoading}
                variant={canEnd ? "secondary" : "outline"}
              >
                <Square className="w-4 h-4 mr-1" />
                End
              </Button>
            </span>
          </TooltipTrigger>
          {getEndTooltip() && (
            <TooltipContent>
              <p>{getEndTooltip()}</p>
            </TooltipContent>
          )}
        </Tooltip>

        {/* FINALIZE Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <ConfirmInputDialog
                trigger={
                  <Button
                    size="sm"
                    disabled={!canFinalize || isLoading}
                    variant={canFinalize ? "default" : "outline"}
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Finalize
                  </Button>
                }
                title="Finalize Competition?"
                description={`This will declare the winner and distribute prizes for "${name}". Ensure the winner is correct before proceeding. This action cannot be undone.`}
                confirmText={name}
                actionLabel="Finalize Competition"
                variant="destructive"
                onConfirm={onFinalize!}
                disabled={!canFinalize || isLoading}
              />
            </span>
          </TooltipTrigger>
          {getFinalizeTooltip() && (
            <TooltipContent>
              <p>{getFinalizeTooltip()}</p>
            </TooltipContent>
          )}
        </Tooltip>

        {/* PAUSE/UNPAUSE Button */}
        {emergencyPaused ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <Button
                  size="sm"
                  onClick={onUnpause}
                  disabled={!canUnpause || isLoading}
                  variant={canUnpause ? "secondary" : "outline"}
                >
                  <Play className="w-4 h-4 mr-1" />
                  Unpause
                </Button>
              </span>
            </TooltipTrigger>
            {getUnpauseTooltip() && (
              <TooltipContent>
                <p>{getUnpauseTooltip()}</p>
              </TooltipContent>
            )}
          </Tooltip>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <ConfirmDialog
                  trigger={
                    <Button
                      size="sm"
                      disabled={!canPause || isLoading}
                      variant={canPause ? "destructive" : "outline"}
                    >
                      <Pause className="w-4 h-4 mr-1" />
                      Pause
                    </Button>
                  }
                  title="Emergency Pause Competition?"
                  description={`This will immediately pause "${name}" and stop all participation. Use only in emergency situations.`}
                  actionLabel="Pause Competition"
                  variant="destructive"
                  onConfirm={onPause!}
                  disabled={!canPause || isLoading}
                />
              </span>
            </TooltipTrigger>
            {getPauseTooltip() && (
              <TooltipContent>
                <p>{getPauseTooltip()}</p>
              </TooltipContent>
            )}
          </Tooltip>
        )}

        {/* CANCEL Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <ConfirmInputDialog
                trigger={
                  <Button
                    size="sm"
                    disabled={!canCancel || isLoading}
                    variant={canCancel ? "destructive" : "outline"}
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    Cancel
                  </Button>
                }
                title="Cancel Competition?"
                description={`This will permanently cancel "${name}" and refund all participants. This action cannot be undone.`}
                confirmText={name}
                actionLabel="Cancel Competition"
                variant="destructive"
                onConfirm={onCancel!}
                disabled={!canCancel || isLoading}
              />
            </span>
          </TooltipTrigger>
          {getCancelTooltip() && (
            <TooltipContent>
              <p>{getCancelTooltip()}</p>
            </TooltipContent>
          )}
        </Tooltip>
      </div>
    );
  };

  return (
    <Card className={`border-l-4 ${emergencyPaused ? "border-l-red-500" : `border-l-${badge.color.split('-')[1]}-500`}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge className={badge.color}>{badge.label}</Badge>
              {emergencyPaused && (
                <Badge variant="destructive" className="text-xs">
                  Paused
                </Badge>
              )}
            </div>
            <h3 className="font-bold text-lg truncate">
              {name} <span className="text-muted-foreground">#{id.toString()}</span>
            </h3>
            {description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {description}
              </p>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <div className="min-w-0">
              <div className="text-xs text-muted-foreground">Deadline</div>
              <div className="font-medium truncate text-xs">{timeRemaining}</div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4 text-muted-foreground" />
            <div className="min-w-0">
              <div className="text-xs text-muted-foreground">Participants</div>
              <div className="font-medium">{totalTickets.toString()}</div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="w-4 h-4 text-muted-foreground" />
            <div className="min-w-0">
              <div className="text-xs text-muted-foreground">Prize Pool</div>
              <div className="font-medium truncate text-xs">
                {parseFloat(formatEther(prizePool)).toFixed(4)} ETH
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-2 border-t flex items-center justify-between gap-2">
          <div className="flex-1">{renderActions()}</div>

          {/* More Actions Menu */}
          {state !== CompetitionState.CANCELLED && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onManage} disabled={isLoading}>
                  <Settings className="mr-2 h-4 w-4" />
                  Manage...
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

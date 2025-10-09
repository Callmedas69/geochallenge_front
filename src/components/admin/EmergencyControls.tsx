/**
 * @title EmergencyControls Component
 * @notice Global emergency actions for platform-wide control
 * @dev CRITICAL: These actions affect ALL competitions
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ConfirmInputDialog } from "@/components/ui/confirm-input-dialog";
import { useGlobalPause, useGlobalUnpause, useWithdrawBalance } from "@/hooks/useAdminActions";
import { useCardCompetitionOwner, useClaimableBalance } from "@/hooks/useContracts";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import {
  Loader2,
  ShieldAlert,
  Play,
  Pause,
  Wallet,
  AlertTriangle,
  Ban,
  Shield,
} from "lucide-react";

export function EmergencyControls() {
  // Global emergency controls
  const globalPauseHook = useGlobalPause();
  const globalUnpauseHook = useGlobalUnpause();
  const withdrawBalanceHook = useWithdrawBalance();

  // Owner balance
  const { address } = useAccount();
  const { data: ownerAddress, isLoading: loadingOwnerAddress } = useCardCompetitionOwner();
  const { data: ownerBalance, isLoading: loadingOwnerBalance } = useClaimableBalance(ownerAddress);
  const ownerBalanceETH = ownerBalance ? parseFloat(formatEther(ownerBalance)).toFixed(4) : "0.0000";
  const isOwner = address && ownerAddress && address.toLowerCase() === ownerAddress.toLowerCase();
  const hasBalance = ownerBalance && ownerBalance > BigInt(0);

  return (
    <div className="space-y-6">
      {/* WARNING Alert */}
      <Alert variant="destructive" className="border-2">
        <ShieldAlert className="h-5 w-5" />
        <AlertTitle className="text-lg font-bold">⚠️ CRITICAL SECTION</AlertTitle>
        <AlertDescription className="text-base">
          <p className="mb-2">
            These controls affect <strong>ALL COMPETITIONS</strong> on the platform.
          </p>
          <p>
            Use only in emergency situations. All actions require confirmation and are
            <strong> IRREVERSIBLE</strong>.
          </p>
        </AlertDescription>
      </Alert>

      {/* Global Pause/Unpause Section */}
      <Card className="border-2 border-red-500 bg-red-50/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Ban className="w-5 h-5 text-red-600" />
            <CardTitle className="text-red-900">Global Pause Controls</CardTitle>
          </div>
          <CardDescription className="text-red-700">
            Immediately halt or resume ALL platform activity
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            {/* Global Pause All */}
            <ConfirmInputDialog
              trigger={
                <Button
                  variant="destructive"
                  size="lg"
                  disabled={
                    globalPauseHook.isPending || globalPauseHook.isConfirming
                  }
                >
                  {globalPauseHook.isPending || globalPauseHook.isConfirming ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Pause className="w-4 h-4 mr-2" />
                  )}
                  Pause All Competitions
                </Button>
              }
              title="⚠️ PAUSE ALL COMPETITIONS?"
              description='This will immediately PAUSE EVERY competition on the platform. All user participation will be stopped. This is a CRITICAL action. Type "PAUSE ALL" to confirm.'
              confirmText="PAUSE ALL"
              actionLabel="Pause All Competitions"
              variant="destructive"
              onConfirm={() => globalPauseHook.globalPause()}
              disabled={
                globalPauseHook.isPending || globalPauseHook.isConfirming
              }
            />

            {/* Global Unpause All */}
            <Button
              variant="secondary"
              size="lg"
              onClick={() => globalUnpauseHook.globalUnpause()}
              disabled={
                globalUnpauseHook.isPending || globalUnpauseHook.isConfirming
              }
            >
              {globalUnpauseHook.isPending || globalUnpauseHook.isConfirming ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Play className="w-4 h-4 mr-2" />
              )}
              Unpause All Competitions
            </Button>
          </div>

          <Alert className="bg-white">
            <Shield className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>What happens when paused:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                <li>No new ticket purchases allowed</li>
                <li>No winner declarations accepted</li>
                <li>No competition lifecycle changes</li>
                <li>Refunds remain available for participants</li>
              </ul>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Owner Balance Withdrawal Section */}
      <Card className="border-2 border-blue-500">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-blue-600" />
            <CardTitle className="text-blue-900">Owner Balance Withdrawal</CardTitle>
          </div>
          <CardDescription className="text-blue-700">
            Withdraw accumulated treasury fees to owner wallet
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Balance Display */}
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div>
              <p className="text-sm text-muted-foreground">Owner Claimable Balance</p>
              <p className="text-2xl font-bold text-blue-900">
                {loadingOwnerAddress || loadingOwnerBalance ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  `${ownerBalanceETH} ETH`
                )}
              </p>
            </div>
            {hasBalance && (
              <Badge className="bg-emerald-500">
                Available
              </Badge>
            )}
          </div>

          {/* Withdraw Button */}
          <Button
            variant="default"
            size="lg"
            className="w-full"
            onClick={() => withdrawBalanceHook.withdrawBalance()}
            disabled={
              loadingOwnerAddress ||
              loadingOwnerBalance ||
              !isOwner ||
              !hasBalance ||
              withdrawBalanceHook.isPending ||
              withdrawBalanceHook.isConfirming
            }
          >
            {loadingOwnerAddress || loadingOwnerBalance ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading Balance...
              </>
            ) : withdrawBalanceHook.isPending || withdrawBalanceHook.isConfirming ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Withdrawing...
              </>
            ) : !isOwner ? (
              <>
                <Wallet className="w-4 h-4 mr-2" />
                Not Owner
              </>
            ) : !hasBalance ? (
              <>
                <Wallet className="w-4 h-4 mr-2" />
                No Balance Available
              </>
            ) : (
              <>
                <Wallet className="w-4 h-4 mr-2" />
                Withdraw {ownerBalanceETH} ETH
              </>
            )}
          </Button>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              Only the contract owner can withdraw treasury fees. Balance includes accumulated
              fees from all competitions.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Alert>
        <ShieldAlert className="h-4 w-4" />
        <AlertTitle>Security Notice</AlertTitle>
        <AlertDescription>
          All emergency actions are logged on-chain and can be viewed on the blockchain explorer.
          Ensure you understand the impact before executing any action.
        </AlertDescription>
      </Alert>
    </div>
  );
}

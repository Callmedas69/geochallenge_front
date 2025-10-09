/**
 * @title ManageCompetitionDialog Component
 * @notice Dialog for advanced competition management actions
 * @dev KISS principle - simple forms for prize, deadline, booster management
 */

"use client";

import { useState, useEffect } from "react";
import { useAccount, useBalance } from "wagmi";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  DollarSign,
  Clock,
  Package,
  Settings,
  Shield,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { parseEther } from "viem";
import { toast } from "sonner";
import {
  validatePrizeAmount,
  validateExtendDays,
  validateBoosterQuantity,
  PRIZE_VALIDATION,
  DEADLINE_VALIDATION,
  BOOSTER_VALIDATION,
} from "@/lib/validation";

interface ManageCompetitionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  competitionId: bigint;
  competitionName: string;
  currentDeadline: bigint;
  onAddPrize: (amount: bigint) => void;
  onExtendDeadline: (newDeadline: bigint) => void;
  onAddBoosterBoxes: (quantity: bigint) => void;
  onSetBoosterBoxQuantity: (quantity: bigint) => void;
  onUpdateVerifier: (address: `0x${string}`) => void;
  isAddPrizeLoading?: boolean;
  isExtendDeadlineLoading?: boolean;
  isAddBoosterLoading?: boolean;
  isSetBoosterLoading?: boolean;
  isUpdateVerifierLoading?: boolean;
}

export function ManageCompetitionDialog({
  open,
  onOpenChange,
  competitionId,
  competitionName,
  currentDeadline,
  onAddPrize,
  onExtendDeadline,
  onAddBoosterBoxes,
  onSetBoosterBoxQuantity,
  onUpdateVerifier,
  isAddPrizeLoading,
  isExtendDeadlineLoading,
  isAddBoosterLoading,
  isSetBoosterLoading,
  isUpdateVerifierLoading,
}: ManageCompetitionDialogProps) {
  const [prizeAmount, setPrizeAmount] = useState("0.1");
  const [extendDays, setExtendDays] = useState("7");
  const [addBoosterQty, setAddBoosterQty] = useState("10");
  const [setBoosterQty, setSetBoosterQty] = useState("10");
  const [verifierAddress, setVerifierAddress] = useState("");

  // Validation errors
  const [prizeError, setPrizeError] = useState("");
  const [verifierError, setVerifierError] = useState("");

  // Wallet balance check
  const { address } = useAccount();
  const { data: balanceData } = useBalance({ address });

  const handleAddPrize = () => {
    setPrizeError("");
    const validation = validatePrizeAmount(prizeAmount);

    if (!validation.valid) {
      setPrizeError(validation.error!);
      return;
    }

    // Check wallet balance
    if (balanceData && validation.value! > balanceData.value) {
      setPrizeError(
        `Insufficient balance. You have ${parseFloat(
          (Number(balanceData.value) / 1e18).toFixed(4)
        )} ETH`
      );
      return;
    }

    onAddPrize(validation.value!);
  };

  const handleExtendDeadline = () => {
    const validation = validateExtendDays(extendDays);

    if (!validation.valid) {
      toast.error("Invalid deadline extension", {
        description: validation.error,
      });
      return;
    }

    // Extend from CURRENT deadline, not from now
    const extensionSeconds = BigInt(validation.value! * 86400);
    const newDeadline = currentDeadline + extensionSeconds;
    onExtendDeadline(newDeadline);
  };

  const handleAddBoosterBoxes = () => {
    const validation = validateBoosterQuantity(addBoosterQty);

    if (!validation.valid) {
      toast.error("Invalid booster quantity", {
        description: validation.error,
      });
      return;
    }

    onAddBoosterBoxes(BigInt(validation.value!));
  };

  const handleSetBoosterQuantity = () => {
    const validation = validateBoosterQuantity(setBoosterQty, true); // Allow 0 for "set" operation

    if (!validation.valid) {
      toast.error("Invalid booster quantity", {
        description: validation.error,
      });
      return;
    }

    onSetBoosterBoxQuantity(BigInt(validation.value!));
  };

  const handleUpdateVerifier = () => {
    setVerifierError("");
    if (!verifierAddress.startsWith("0x") || verifierAddress.length !== 42) {
      setVerifierError("Invalid address format. Must be 42 characters starting with 0x.");
      return;
    }
    onUpdateVerifier(verifierAddress as `0x${string}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Manage: {competitionName} #{competitionId.toString()}
          </DialogTitle>
          <DialogDescription>
            Advanced management actions for this competition
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="prize" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="prize">
              <DollarSign className="w-4 h-4 mr-1" />
              Prize
            </TabsTrigger>
            <TabsTrigger value="deadline">
              <Clock className="w-4 h-4 mr-1" />
              Deadline
            </TabsTrigger>
            <TabsTrigger value="booster">
              <Package className="w-4 h-4 mr-1" />
              Booster
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Shield className="w-4 h-4 mr-1" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Add Prize Tab */}
          <TabsContent value="prize" className="space-y-4">
            <div className="space-y-3">
              <Label htmlFor="prizeAmount">Add Prize ETH</Label>
              <div className="flex gap-2">
                <Input
                  id="prizeAmount"
                  type="number"
                  step="0.01"
                  min={PRIZE_VALIDATION.MIN_ETH}
                  max={PRIZE_VALIDATION.MAX_ETH}
                  value={prizeAmount}
                  onChange={(e) => {
                    setPrizeAmount(e.target.value);
                    setPrizeError("");
                  }}
                  placeholder={`${PRIZE_VALIDATION.MIN_ETH} - ${PRIZE_VALIDATION.MAX_ETH} ETH`}
                  className={prizeError ? "border-destructive" : ""}
                />
                <Button onClick={handleAddPrize} disabled={isAddPrizeLoading}>
                  {isAddPrizeLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Add Prize"
                  )}
                </Button>
              </div>
              {prizeError && (
                <p className="text-sm text-destructive">{prizeError}</p>
              )}
              <p className="text-sm text-muted-foreground">
                Add additional ETH to the prize pool (payable transaction)
                {balanceData && (
                  <>
                    {" • "}
                    Your balance: {parseFloat((Number(balanceData.value) / 1e18).toFixed(4))} ETH
                  </>
                )}
              </p>
            </div>
          </TabsContent>

          {/* Extend Deadline Tab */}
          <TabsContent value="deadline" className="space-y-4">
            <div className="space-y-3">
              <Label htmlFor="extendDays">Extend Deadline</Label>
              <div className="flex gap-2">
                <Input
                  id="extendDays"
                  type="number"
                  min={DEADLINE_VALIDATION.MIN_DAYS}
                  max={DEADLINE_VALIDATION.MAX_DAYS}
                  value={extendDays}
                  onChange={(e) => setExtendDays(e.target.value)}
                  placeholder={`${DEADLINE_VALIDATION.MIN_DAYS}-${DEADLINE_VALIDATION.MAX_DAYS} days`}
                />
                <Button onClick={handleExtendDeadline} disabled={isExtendDeadlineLoading}>
                  {isExtendDeadlineLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Extend"
                  )}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Extend deadline by {extendDays} days from current deadline
              </p>
            </div>
          </TabsContent>

          {/* Booster Box Tab */}
          <TabsContent value="booster" className="space-y-6">
            {/* Add Booster Boxes */}
            <div className="space-y-3">
              <Label htmlFor="addBooster">Add Booster Boxes (Incremental)</Label>
              <div className="flex gap-2">
                <Input
                  id="addBooster"
                  type="number"
                  min={BOOSTER_VALIDATION.MIN_QUANTITY}
                  max={BOOSTER_VALIDATION.MAX_QUANTITY}
                  value={addBoosterQty}
                  onChange={(e) => setAddBoosterQty(e.target.value)}
                  placeholder={`${BOOSTER_VALIDATION.MIN_QUANTITY}-${BOOSTER_VALIDATION.MAX_QUANTITY}`}
                />
                <Button onClick={handleAddBoosterBoxes} disabled={isAddBoosterLoading}>
                  {isAddBoosterLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Add"
                  )}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Adds {addBoosterQty} booster boxes to existing quantity
              </p>
            </div>

            {/* Set Booster Box Quantity */}
            <div className="space-y-3">
              <Label htmlFor="setBooster">Set Booster Box Quantity (Absolute)</Label>
              <div className="flex gap-2">
                <Input
                  id="setBooster"
                  type="number"
                  min="0"
                  max={BOOSTER_VALIDATION.MAX_QUANTITY}
                  value={setBoosterQty}
                  onChange={(e) => setSetBoosterQty(e.target.value)}
                  placeholder={`0-${BOOSTER_VALIDATION.MAX_QUANTITY}`}
                />
                <Button onClick={handleSetBoosterQuantity} disabled={isSetBoosterLoading}>
                  {isSetBoosterLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Set"
                  )}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Sets total booster box quantity to {setBoosterQty} (replaces current value)
              </p>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <div className="space-y-3">
              <Label htmlFor="verifier">Update Verifier Address</Label>
              <div className="flex gap-2">
                <Input
                  id="verifier"
                  type="text"
                  value={verifierAddress}
                  onChange={(e) => {
                    setVerifierAddress(e.target.value);
                    setVerifierError("");
                  }}
                  placeholder="0x..."
                  className={verifierError ? "border-destructive" : ""}
                />
                <ConfirmDialog
                  trigger={
                    <Button disabled={isUpdateVerifierLoading || !verifierAddress}>
                      {isUpdateVerifierLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Update"
                      )}
                    </Button>
                  }
                  title="Update Verifier Address?"
                  description={`This will change the verifier address for "${competitionName}". The new address will be responsible for signing proofs. Ensure this address is correct.`}
                  actionLabel="Update Verifier"
                  variant="destructive"
                  onConfirm={handleUpdateVerifier}
                  disabled={isUpdateVerifierLoading || !verifierAddress}
                />
              </div>
              {verifierError && (
                <p className="text-sm text-destructive">{verifierError}</p>
              )}
              <p className="text-sm text-muted-foreground">
                Update the verifier address for proof signing
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

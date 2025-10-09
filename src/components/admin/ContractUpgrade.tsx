/**
 * @title ContractUpgrade Component
 * @notice UUPS proxy contract upgrade interface
 * @dev EXTREMELY DANGEROUS - Multiple confirmations required
 */

"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ConfirmInputDialog } from "@/components/ui/confirm-input-dialog";
import { useUpgradeContract } from "@/hooks/useAdminActions";
import { CONTRACT_ADDRESSES } from "@/lib/contractList";
import { isAddress } from "viem";
import type { Address } from "viem";
import { Loader2, Skull, ExternalLink, AlertTriangle } from "lucide-react";

export function ContractUpgrade() {
  const [newImplementation, setNewImplementation] = useState("");
  const [confirmations, setConfirmations] = useState({
    understand: false,
    tested: false,
    backup: false,
    irreversible: false,
  });

  const upgradeHook = useUpgradeContract();

  const isValidAddress = newImplementation && isAddress(newImplementation);
  const allConfirmed = Object.values(confirmations).every((v) => v);
  const canUpgrade = isValidAddress && allConfirmed;

  const proxyAddress = CONTRACT_ADDRESSES.baseSepolia.GeoChallenge;

  // Reset form only after successful upgrade
  useEffect(() => {
    if (upgradeHook.isSuccess) {
      setNewImplementation("");
      setConfirmations({
        understand: false,
        tested: false,
        backup: false,
        irreversible: false,
      });
    }
  }, [upgradeHook.isSuccess]);

  const handleUpgrade = () => {
    if (canUpgrade) {
      upgradeHook.upgradeContract(newImplementation as Address);
    }
  };

  const handleReset = () => {
    setNewImplementation("");
    setConfirmations({
      understand: false,
      tested: false,
      backup: false,
      irreversible: false,
    });
  };

  return (
    <div className="space-y-6">
      {/* EXTREME WARNING BANNER */}
      <Card className="border-4 border-red-600 bg-red-950/30">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Skull className="w-8 h-8 text-red-600 animate-pulse" />
            <div>
              <CardTitle className="text-2xl text-red-600">
                ☠️ EXTREME DANGER - CONTRACT UPGRADE ☠️
              </CardTitle>
              <CardDescription className="text-red-400 mt-2">
                Upgrading the contract implementation can PERMANENTLY BREAK the
                entire system. One mistake can make all funds UNRECOVERABLE.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="destructive" className="text-sm">
              IRREVERSIBLE
            </Badge>
            <Badge variant="destructive" className="text-sm">
              ALL FUNDS AT RISK
            </Badge>
            <Badge variant="destructive" className="text-sm">
              OWNER ONLY
            </Badge>
            <Badge variant="destructive" className="text-sm">
              REQUIRES TESTING
            </Badge>
          </div>

          <div className="p-4 bg-red-950/50 rounded-lg border-2 border-red-600">
            <p className="text-sm text-red-200 font-semibold mb-2">
              ⚠️ Before upgrading, you MUST:
            </p>
            <ul className="text-xs text-red-300 space-y-1 list-disc list-inside">
              <li>Deploy and verify new implementation on Base Sepolia</li>
              <li>Test new implementation thoroughly on testnet</li>
              <li>Verify storage layout compatibility</li>
              <li>Have rollback plan ready</li>
              <li>Notify all users of maintenance window</li>
              <li>Ensure new contract is UUPS compliant</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Current Proxy Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            Current Proxy Contract
          </CardTitle>
          <CardDescription>
            This is the proxy contract address (unchangeable)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">
              Proxy Address (Base Sepolia)
            </Label>
            <div className="flex items-center gap-2">
              <div className="flex-1 font-mono text-sm p-3 bg-muted rounded border break-all">
                {proxyAddress}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  window.open(
                    `https://sepolia.basescan.org/address/${proxyAddress}`,
                    "_blank"
                  )
                }
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              💡 View current implementation address on BaseScan (Read Contract
              → implementation)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Form */}
      <Card className="border-2 border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">
            Upgrade Implementation
          </CardTitle>
          <CardDescription>
            Enter the address of the NEW implementation contract
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* New Implementation Address */}
          <div>
            <Label htmlFor="new-implementation" className="text-sm font-semibold">
              New Implementation Address *
            </Label>
            <Input
              id="new-implementation"
              type="text"
              placeholder="0x..."
              value={newImplementation}
              onChange={(e) => setNewImplementation(e.target.value)}
              className="font-mono text-sm mt-2"
            />
            {newImplementation && !isValidAddress && (
              <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Invalid Ethereum address
              </p>
            )}
            {isValidAddress && (
              <p className="text-xs text-green-600 mt-1">✓ Valid address format</p>
            )}
          </div>

          {/* Safety Confirmations */}
          <div className="space-y-4 p-4 bg-destructive/10 rounded-lg border-2 border-destructive">
            <p className="text-sm font-semibold text-destructive">
              Required Safety Confirmations:
            </p>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="confirm-understand"
                  checked={confirmations.understand}
                  onCheckedChange={(checked) =>
                    setConfirmations((prev) => ({
                      ...prev,
                      understand: checked === true,
                    }))
                  }
                />
                <label
                  htmlFor="confirm-understand"
                  className="text-sm cursor-pointer leading-tight"
                >
                  I understand that an incorrect implementation address will
                  PERMANENTLY BREAK the contract and make all funds UNRECOVERABLE
                </label>
              </div>

              <div className="flex items-start gap-3">
                <Checkbox
                  id="confirm-tested"
                  checked={confirmations.tested}
                  onCheckedChange={(checked) =>
                    setConfirmations((prev) => ({
                      ...prev,
                      tested: checked === true,
                    }))
                  }
                />
                <label
                  htmlFor="confirm-tested"
                  className="text-sm cursor-pointer leading-tight"
                >
                  I have THOROUGHLY TESTED the new implementation on testnet
                  with the same storage layout
                </label>
              </div>

              <div className="flex items-start gap-3">
                <Checkbox
                  id="confirm-backup"
                  checked={confirmations.backup}
                  onCheckedChange={(checked) =>
                    setConfirmations((prev) => ({
                      ...prev,
                      backup: checked === true,
                    }))
                  }
                />
                <label
                  htmlFor="confirm-backup"
                  className="text-sm cursor-pointer leading-tight"
                >
                  I have verified the new implementation contract code on
                  BaseScan and confirmed it is correct
                </label>
              </div>

              <div className="flex items-start gap-3">
                <Checkbox
                  id="confirm-irreversible"
                  checked={confirmations.irreversible}
                  onCheckedChange={(checked) =>
                    setConfirmations((prev) => ({
                      ...prev,
                      irreversible: checked === true,
                    }))
                  }
                />
                <label
                  htmlFor="confirm-irreversible"
                  className="text-sm cursor-pointer leading-tight"
                >
                  I understand this action is IRREVERSIBLE and I am solely
                  responsible for any consequences
                </label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <ConfirmInputDialog
              trigger={
                <Button
                  variant="destructive"
                  size="lg"
                  className="flex-1"
                  disabled={
                    !canUpgrade ||
                    upgradeHook.isPending ||
                    upgradeHook.isConfirming
                  }
                >
                  {upgradeHook.isPending || upgradeHook.isConfirming ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Upgrading Contract...
                    </>
                  ) : (
                    <>
                      <Skull className="w-4 h-4 mr-2" />
                      Upgrade Contract Implementation
                    </>
                  )}
                </Button>
              }
              title="☠️ FINAL WARNING - UPGRADE CONTRACT?"
              description={`You are about to upgrade the contract implementation to:\n\n${newImplementation}\n\nThis is EXTREMELY DANGEROUS and IRREVERSIBLE. If the new implementation is incompatible or has bugs, ALL FUNDS MAY BE LOST PERMANENTLY.\n\nType "UPGRADE CONTRACT" to proceed.`}
              confirmText="UPGRADE CONTRACT"
              actionLabel="Upgrade Implementation"
              variant="destructive"
              onConfirm={handleUpgrade}
              disabled={!canUpgrade}
            />

            <Button
              variant="outline"
              size="lg"
              onClick={handleReset}
              disabled={upgradeHook.isPending || upgradeHook.isConfirming}
            >
              Reset Form
            </Button>
          </div>

          {/* Help Text */}
          <div className="text-xs text-muted-foreground space-y-1 p-3 bg-muted rounded">
            <p className="font-semibold">Need help?</p>
            <p>
              • Check UUPS proxy upgrade documentation
            </p>
            <p>
              • Verify storage slot compatibility between old and new
              implementation
            </p>
            <p>• Test on testnet first with identical data</p>
            <p>
              • Consider using a multisig wallet for extra security
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

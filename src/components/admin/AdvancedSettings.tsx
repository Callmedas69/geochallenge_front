/**
 * @title AdvancedSettings Component
 * @notice Module management and contract upgrades
 * @dev KISS principle - simple module address management
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
import { ConfirmInputDialog } from "@/components/ui/confirm-input-dialog";
import { useModuleAddresses } from "@/hooks/useContracts";
import {
  useSetAdminValidationManager,
  useSetBoosterBoxManager,
  useSetCompetitionLifecycleManager,
  useSetCompetitionManager,
  useSetMetadataManager,
  useSetPrizeCalculationManager,
  useSetPrizeManagerModule,
  useSetProofValidator,
  useSetQueryManager,
  useSetTicketRenderer,
} from "@/hooks/useAdminActions";
import { isAddress } from "viem";
import type { Address } from "viem";
import { Loader2, Settings2, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { ContractUpgrade } from "./ContractUpgrade";

interface ModuleConfig {
  name: string;
  description: string;
  useHook: () => {
    setModule: (address: Address) => void;
    isPending: boolean;
    isConfirming: boolean;
    isSuccess: boolean;
  };
  index: number;
}

const MODULES: ModuleConfig[] = [
  {
    name: "Admin Validation Manager",
    description: "Validates admin operations and permissions",
    useHook: useSetAdminValidationManager,
    index: 0,
  },
  {
    name: "Booster Box Manager",
    description: "Manages booster box distribution logic",
    useHook: useSetBoosterBoxManager,
    index: 1,
  },
  {
    name: "Competition Lifecycle Manager",
    description: "Handles competition state transitions and validations",
    useHook: useSetCompetitionLifecycleManager,
    index: 2,
  },
  {
    name: "Competition Manager",
    description: "Core competition creation and management",
    useHook: useSetCompetitionManager,
    index: 3,
  },
  {
    name: "Metadata Manager",
    description: "Manages competition metadata storage",
    useHook: useSetMetadataManager,
    index: 4,
  },
  {
    name: "Prize Calculation Manager",
    description: "Calculates prize distributions and splits",
    useHook: useSetPrizeCalculationManager,
    index: 5,
  },
  {
    name: "Prize Manager",
    description: "Handles prize claims and withdrawals",
    useHook: useSetPrizeManagerModule,
    index: 6,
  },
  {
    name: "Proof Validator",
    description: "Validates winner proofs and NFT ownership",
    useHook: useSetProofValidator,
    index: 7,
  },
  {
    name: "Query Manager",
    description: "Provides read-only query functions",
    useHook: useSetQueryManager,
    index: 8,
  },
  {
    name: "Ticket Renderer",
    description: "Renders ticket metadata and images",
    useHook: useSetTicketRenderer,
    index: 9,
  },
];

interface ModuleCardProps {
  module: ModuleConfig;
  currentAddress?: Address;
  isLoading: boolean;
}

function ModuleCard({ module, currentAddress, isLoading }: ModuleCardProps) {
  const [newAddress, setNewAddress] = useState("");
  const hook = module.useHook();

  const isValidAddress = newAddress && isAddress(newAddress);
  const isDifferent = isValidAddress && newAddress.toLowerCase() !== currentAddress?.toLowerCase();

  // Clear input after successful transaction
  useEffect(() => {
    if (hook.isSuccess && newAddress) {
      setNewAddress("");
    }
  }, [hook.isSuccess, newAddress]);

  const handleUpdate = () => {
    if (isValidAddress && isDifferent) {
      hook.setModule(newAddress as Address);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <Settings2 className="w-4 h-4" />
              {module.name}
            </CardTitle>
            <CardDescription className="mt-1">
              {module.description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Current Address */}
        <div>
          <Label className="text-xs text-muted-foreground">
            Current Address
          </Label>
          <div className="mt-1 font-mono text-sm p-2 bg-muted rounded border break-all">
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              currentAddress || "Not set"
            )}
          </div>
        </div>

        {/* New Address Input */}
        <div>
          <Label htmlFor={`module-${module.index}`} className="text-xs">
            New Module Address
          </Label>
          <Input
            id={`module-${module.index}`}
            type="text"
            placeholder="0x..."
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
            className="font-mono text-sm mt-1"
          />
          {newAddress && !isValidAddress && (
            <p className="text-xs text-destructive mt-1">Invalid address</p>
          )}
          {newAddress && isValidAddress && !isDifferent && (
            <p className="text-xs text-yellow-600 mt-1">
              Same as current address
            </p>
          )}
        </div>

        {/* Update Button */}
        <ConfirmInputDialog
          trigger={
            <Button
              className="w-full"
              disabled={
                !isValidAddress ||
                !isDifferent ||
                hook.isPending ||
                hook.isConfirming
              }
            >
              {hook.isPending || hook.isConfirming ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Module"
              )}
            </Button>
          }
          title={`Update ${module.name}?`}
          description={`You are about to update the ${module.name} module address. This is a CRITICAL operation that affects core contract functionality. Type "${module.name}" to confirm.`}
          confirmText={module.name}
          actionLabel="Update Module"
          variant="destructive"
          onConfirm={handleUpdate}
          disabled={!isValidAddress || !isDifferent}
        />
      </CardContent>
    </Card>
  );
}

export function AdvancedSettings() {
  const [showUpgrade, setShowUpgrade] = useState(false);
  const { data: moduleData, isLoading } = useModuleAddresses();

  return (
    <div className="space-y-6">
      {/* Contract Upgrade Section (Collapsible) */}
      <Card className="border-2 border-red-600 bg-red-950/20">
        <CardHeader>
          <Button
            variant="ghost"
            className="w-full justify-between p-0 h-auto hover:bg-transparent"
            onClick={() => setShowUpgrade(!showUpgrade)}
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <CardTitle className="text-red-600">
                ☠️ Contract Upgrade (UUPS Proxy)
              </CardTitle>
            </div>
            {showUpgrade ? (
              <ChevronUp className="w-5 h-5 text-red-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-red-600" />
            )}
          </Button>
          <CardDescription className="text-left">
            {showUpgrade
              ? "Upgrade the contract implementation (EXTREMELY DANGEROUS)"
              : "Click to expand upgrade interface (Owner only)"}
          </CardDescription>
        </CardHeader>
        {showUpgrade && (
          <CardContent>
            <ContractUpgrade />
          </CardContent>
        )}
      </Card>

      {/* Warning Banner */}
      <Card className="border-2 border-destructive bg-destructive/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            <CardTitle className="text-destructive">
              ⚠️ Advanced Settings - Owner Only
            </CardTitle>
          </div>
          <CardDescription>
            These settings control the core modules of the competition smart contract.
            Only update module addresses if you know exactly what you are doing.
            Incorrect addresses will break the entire system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Badge variant="destructive">DANGER ZONE</Badge>
            <Badge variant="outline">Contract Upgrade Required</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Module Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {MODULES.map((module) => {
          const address = moduleData?.[module.index]?.result as Address | undefined;
          return (
            <ModuleCard
              key={module.name}
              module={module}
              currentAddress={address}
              isLoading={isLoading}
            />
          );
        })}
      </div>
    </div>
  );
}

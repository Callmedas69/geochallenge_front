/**
 * @title CreateCompetitionForm Component
 * @notice Form for creating new competitions with validation
 * @dev KISS principle - all fields, clear validation, good UX
 */

"use client";

import { useState, useEffect, useRef } from "react";
import { useCreateCompetition } from "@/hooks/useCreateCompetition";
import { useStartCompetition } from "@/hooks/useAdminActions";
import type { CreateCompetitionParams } from "@/lib/types";
import { validateCreateCompetitionParams } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileText,
  Image,
  DollarSign,
  Clock,
  Package,
  Shield,
  Play,
  ExternalLink,
} from "lucide-react";
import { parseEther, isAddress } from "viem";
import { toast } from "sonner";

export function CreateCompetitionForm() {
  const {
    createCompetition,
    isPending,
    isConfirming,
    isSuccess,
    hash,
    competitionId,
    errorMessage,
  } = useCreateCompetition();

  const { startCompetition, isPending: isStarting } = useStartCompetition();

  // Track last shown toast to prevent duplicates
  const lastToastIdRef = useRef<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    collectionAddress: "",
    rarityTiers: "",
    ticketPrice: "",
    treasuryWallet: "0x127E3d1c1ae474A688789Be39fab0da6371926A7", // Default to owner
    treasuryPercent: "10",
    deadlineDays: "7",
    boosterBoxEnabled: false,
    boosterBoxAddress: "0x0000000000000000000000000000000000000000",
    verifierAddress: "",
  });

  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors([]);

    try {
      // Parse form data
      const rarityTiersArray = formData.rarityTiers
        .split(",")
        .map((t) => parseInt(t.trim()))
        .filter((t) => !isNaN(t));

      const deadlineTimestamp =
        BigInt(Math.floor(Date.now() / 1000)) +
        BigInt(parseInt(formData.deadlineDays) * 86400);

      // Validate and parse ticket price
      const ticketPriceStr = formData.ticketPrice.trim();
      if (!ticketPriceStr || isNaN(Number(ticketPriceStr))) {
        setValidationErrors(["Invalid ticket price format"]);
        return;
      }

      // Ensure no scientific notation
      const ticketPriceNum = Number(ticketPriceStr);
      if (ticketPriceNum <= 0) {
        setValidationErrors(["Ticket price must be greater than 0"]);
        return;
      }

      const params: CreateCompetitionParams = {
        name: formData.name,
        description: formData.description,
        collectionAddress: formData.collectionAddress as `0x${string}`,
        rarityTiers: rarityTiersArray,
        ticketPrice: parseEther(ticketPriceStr),
        treasuryWallet: formData.treasuryWallet as `0x${string}`,
        treasuryPercent: BigInt(formData.treasuryPercent),
        deadline: deadlineTimestamp,
        boosterBoxEnabled: formData.boosterBoxEnabled,
        boosterBoxAddress: formData.boosterBoxAddress as `0x${string}`,
        verifierAddress: formData.verifierAddress as `0x${string}`,
      };

      // Validate
      const validation = validateCreateCompetitionParams(params);
      if (!validation.isValid) {
        setValidationErrors(validation.errors);
        return;
      }

      // Submit
      await createCompetition(params);
    } catch (err) {
      console.error("Form submission error:", err);
      setValidationErrors([
        err instanceof Error ? err.message : "Failed to create competition",
      ]);
    }
  };

  // Show toast and reset form on success
  useEffect(() => {
    if (isSuccess && hash && competitionId) {
      // Prevent duplicate toasts for the same transaction
      const toastKey = hash;
      if (lastToastIdRef.current === toastKey) return;

      lastToastIdRef.current = toastKey;

      toast.success(`Competition #${competitionId} created successfully!`, {
        description: "The competition is ready to be started.",
        duration: 10000, // 10 seconds
        action: {
          label: "Start Now",
          onClick: () => startCompetition(competitionId),
        },
        cancel: {
          label: "View on BaseScan",
          onClick: () => window.open(`https://sepolia.basescan.org/tx/${hash}`, '_blank'),
        },
      });

      // Reset form after a short delay
      setTimeout(() => {
        setFormData({
          name: "",
          description: "",
          collectionAddress: "",
          rarityTiers: "",
          ticketPrice: "",
          treasuryWallet: "0x127E3d1c1ae474A688789Be39fab0da6371926A7",
          treasuryPercent: "10",
          deadlineDays: "7",
          boosterBoxEnabled: false,
          boosterBoxAddress: "0x0000000000000000000000000000000000000000",
          verifierAddress: "",
        });
      }, 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, hash, competitionId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Competition</CardTitle>
        <CardDescription>
          Fill in all fields to create a new competition. All fields are
          required.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Accordion type="multiple" className="w-full">
            {/* Competition Details */}
            <AccordionItem value="details">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-500" />
                  Competition Details
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div>
                  <Label htmlFor="name">Competition Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g. Golden Gate Bridge Challenge"
                    maxLength={100}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Describe the challenge location and requirements..."
                    rows={4}
                    maxLength={1000}
                    required
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* NFT Collection Settings */}
            <AccordionItem value="nft">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                <div className="flex items-center gap-2">
                  <Image className="w-5 h-5 text-purple-500" />
                  NFT Collection Settings
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div>
                  <Label htmlFor="collectionAddress">
                    Collection Address *
                  </Label>
                  <Input
                    id="collectionAddress"
                    value={formData.collectionAddress}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        collectionAddress: e.target.value,
                      })
                    }
                    placeholder="0x..."
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="rarityTiers">
                    Rarity Tiers (comma-separated) *
                  </Label>
                  <Input
                    id="rarityTiers"
                    value={formData.rarityTiers}
                    onChange={(e) =>
                      setFormData({ ...formData, rarityTiers: e.target.value })
                    }
                    placeholder="e.g. 1,2,3"
                    required
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Enter tier numbers separated by commas. 1=Common, 2=Rare, 3=Epic, 4=Legendary, 5=Mythic
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Pricing & Treasury */}
            <AccordionItem value="pricing">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-500" />
                  Pricing & Treasury
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div>
                  <Label htmlFor="ticketPrice">Ticket Price (ETH) *</Label>
                  <Input
                    id="ticketPrice"
                    type="text"
                    pattern="^[0-9]*\.?[0-9]+$"
                    value={formData.ticketPrice}
                    onChange={(e) =>
                      setFormData({ ...formData, ticketPrice: e.target.value })
                    }
                    placeholder="0.01"
                    required
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Must be greater than 0 (e.g., 0.0001)
                  </p>
                </div>

                <div>
                  <Label htmlFor="treasuryWallet">Treasury Wallet *</Label>
                  <Input
                    id="treasuryWallet"
                    value={formData.treasuryWallet}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        treasuryWallet: e.target.value,
                      })
                    }
                    placeholder="0x..."
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="treasuryPercent">
                    Treasury Percentage (0-100) *
                  </Label>
                  <Input
                    id="treasuryPercent"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.treasuryPercent}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        treasuryPercent: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Timing */}
            <AccordionItem value="timing">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-orange-500" />
                  Timing
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div>
                  <Label htmlFor="deadlineDays">Duration (days) *</Label>
                  <Input
                    id="deadlineDays"
                    type="number"
                    min="1"
                    value={formData.deadlineDays}
                    onChange={(e) =>
                      setFormData({ ...formData, deadlineDays: e.target.value })
                    }
                    required
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Competition will end in {formData.deadlineDays} days from
                    now
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Booster Box (Optional Prize) */}
            <AccordionItem value="booster">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-pink-500" />
                  Booster Box Prize (Optional)
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="boosterBoxEnabled"
                    checked={formData.boosterBoxEnabled}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        boosterBoxEnabled: e.target.checked,
                      })
                    }
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="boosterBoxEnabled" className="cursor-pointer">
                    Enable Booster Box Prize
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Winner can claim ERC1155 booster boxes as additional prize
                </p>

                {formData.boosterBoxEnabled && (
                  <div>
                    <Label htmlFor="boosterBoxAddress">
                      Booster Box Contract Address *
                    </Label>
                    <Input
                      id="boosterBoxAddress"
                      value={formData.boosterBoxAddress}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          boosterBoxAddress: e.target.value,
                        })
                      }
                      placeholder="0x... (ERC1155 contract address)"
                      required={formData.boosterBoxEnabled}
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      ERC1155 contract address for booster boxes. Use "Manage"
                      tab to set quantity after creation.
                    </p>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>

            {/* Verification */}
            <AccordionItem value="verification">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-red-500" />
                  Verification
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div>
                  <Label htmlFor="verifierAddress">Verifier Address *</Label>
                  <Input
                    id="verifierAddress"
                    value={formData.verifierAddress}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        verifierAddress: e.target.value,
                      })
                    }
                    placeholder="0x... (backend signer address)"
                    required
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Address that will sign completion proofs (backend wallet)
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1">
                  {validationErrors.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Transaction Error */}
          {errorMessage && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isPending || isConfirming}
            className="w-full"
          >
            {isPending || isConfirming ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isPending ? "Confirm in Wallet..." : "Creating Competition..."}
              </>
            ) : (
              "Create Competition"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

/**
 * @title HowItWorksDrawer Component (Farcaster)
 * @notice Bottom drawer explaining competition mechanics
 * @dev KISS principle: 5 bullet points, mobile-optimized, swipe-to-close
 */

"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Trophy, Ticket, Package, Award, CheckCircle } from "lucide-react";

interface HowItWorksDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Bottom drawer explaining how the competition works
 * Mobile-friendly with brief, actionable steps
 */
export function HowItWorksDrawer({
  open,
  onOpenChange,
}: HowItWorksDrawerProps) {
  const steps = [
    {
      icon: Ticket,
      title: "Buy a Ticket",
      description:
        "Purchase a competition ticket to participate and get access",
    },
    {
      icon: Package,
      title: "Collect Cards",
      description:
        "Collect a complete set of required rarity cards from VibeMarket",
    },
    {
      icon: CheckCircle,
      title: "Submit Proof",
      description:
        "First to collect all cards and submit proof wins the prize pool",
    },
    {
      icon: Award,
      title: "Win Prizes",
      description: "Winner gets 80% of prize pool, all participants share 20%",
    },
    {
      icon: Trophy,
      title: "Track Progress",
      description:
        "Monitor your collection progress in the competition detail page",
    },
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[80vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-xl">How It Works</SheetTitle>
          <SheetDescription className="text-sm">
            Complete trading card sets to win prizes on Base
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="flex gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">{step.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-3 bg-muted rounded-lg">
          <p className="text-xs text-muted-foreground">
            <strong>Note:</strong> Card collections are verified from{" "}
            <a
              href="https://vibechain.com/market"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              VibeMarket
            </a>
            . Make sure you hold all required cards in your wallet before
            submitting proof.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}

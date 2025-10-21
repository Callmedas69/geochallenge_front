/**
 * @title FarcasterHeader Component
 * @notice Sticky header with info icon for Farcaster miniApp
 * @dev KISS principle: Logo + info icon, triggers how-it-works drawer
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { HowItWorksDrawer } from "./HowItWorksDrawer";
import { CompactWalletButton } from "./CompactWalletButton";
import localFont from "next/font/local";

const spartanFont = localFont({
  src: [
    {
      path: "../../assets/LeagueSpartan-Bold.ttf",
      style: "bold",
    },
  ],
  display: "swap",
});

/**
 * Fixed header for Farcaster miniApp
 * Shows logo/title and info icon to open help drawer
 */
export function FarcasterHeader() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-3 py-3 flex items-center justify-between">
          {/* Logo/Title */}
          <div className="leading-none">
            <h1
              className={`text-xl font-bold tracking-tight uppercase ${spartanFont.className} leading-none m-0 p-0`}
            >
              GeoChallenge
            </h1>
            <span className="text-[10px] text-black/20 italic leading-none -mt-1 block">
              powered by GeoArt
            </span>
          </div>

          {/* Right side: Wallet + Info */}
          <div className="flex items-center gap-2">
            {/* Wallet Button - Shows connected wallet */}
            <CompactWalletButton />

            {/* Info Icon */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDrawerOpen(true)}
              aria-label="How it works"
            >
              <Info className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* How It Works Drawer */}
      <HowItWorksDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />
    </>
  );
}

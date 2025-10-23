/**
 * @title CompactWalletButton Component
 * @notice Mobile-optimized wallet display for Farcaster miniApp header
 * @dev KISS principle: Shows wallet address, dropdown for copy/disconnect
 * @dev Professional best practice: Follows industry patterns (Coinbase, MetaMask mobile)
 */

"use client";

import { useAccount, useDisconnect } from "wagmi";
import { Button } from "@/components/ui/button";
import { Wallet, Copy, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

/**
 * Compact wallet button for mobile header
 * - Auto-displays after AutoConnect completes
 * - Dropdown menu with Copy Address and Disconnect
 * - Handles logout state with localStorage
 */
export function CompactWalletButton() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [copied, setCopied] = useState(false);

  // Don't show if not connected or no address
  if (!isConnected || !address) {
    return null;
  }

  // Format address: 0x1a2b...3c4d
  const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

  /**
   * Copy wallet address to clipboard
   */
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      // Reset after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy address:", error);
    }
  };

  /**
   * Disconnect wallet and set flag to prevent auto-reconnect
   * Follows KISS principle: Simple localStorage flag
   */
  const handleDisconnect = () => {
    // Set flag to prevent auto-reconnect (useAutoConnect will check this)
    localStorage.setItem("fc_manual_disconnect", "true");
    disconnect();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs gap-1 h-10 hover:bg-accent"
          aria-label="Wallet menu"
        >
          <Wallet className="h-10 w-10" />
          {/* Hide address text on very small screens, show only icon */}
          <span className="hidden xs:inline">{shortAddress}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        {/* Copy Address */}
        <DropdownMenuItem onClick={handleCopy} className="cursor-pointer">
          <Copy className="h-4 w-4 mr-2" />
          {copied ? "Copied!" : "Copy Address"}
        </DropdownMenuItem>

        {/* Disconnect */}
        <DropdownMenuItem
          onClick={handleDisconnect}
          className="text-red-600 cursor-pointer focus:text-red-600"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

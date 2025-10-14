/**
 * @title ClaimButton Component
 * @notice Reusable claim button for prize/refund claims
 * @dev KISS principle: Single component handling Link/disabled pattern
 */

import { Button } from "@/components/ui/button";
import { Gift } from "lucide-react";
import Link from "next/link";
import { formatEther } from "viem";
import { DECIMALS } from "@/lib/displayConfig";

interface ClaimButtonProps {
  enabled: boolean;
  href: string;
  amount: bigint;
  label: string;
  disabledText: string;
  variant: "winner" | "participant" | "refund";
}

const VARIANT_STYLES = {
  winner: "bg-yellow-600 hover:bg-yellow-700",
  participant: "bg-blue-600 hover:bg-blue-700",
  refund: "bg-red-600 hover:bg-red-700",
} as const;

export function ClaimButton({
  enabled,
  href,
  amount,
  label,
  disabledText,
  variant,
}: ClaimButtonProps) {
  const baseClasses = `w-full disabled:bg-muted disabled:text-muted-foreground ${VARIANT_STYLES[variant]}`;

  // Prevent card navigation when clicking claim buttons
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Button
      asChild={enabled}
      disabled={!enabled}
      className={baseClasses}
      size="sm"
      onClick={handleClick}
    >
      {enabled ? (
        <Link href={href}>
          <Gift className="h-3 w-3 mr-1" />
          <span className="text-xs">
            {label} {parseFloat(formatEther(amount)).toFixed(DECIMALS.FARCASTER)}Ξ
          </span>
        </Link>
      ) : (
        <div className="flex items-center justify-center w-full">
          <Gift className="h-3 w-3 mr-1" />
          <span className="text-xs">{disabledText}</span>
        </div>
      )}
    </Button>
  );
}

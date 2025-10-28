/**
 * @title BottomNav Component
 * @notice Mobile-first bottom navigation bar
 * @dev KISS principle: Simple, accessible bottom tab bar following iOS/Android patterns
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, List, User2, Crown } from "lucide-react";
import { useAccount } from "wagmi";
import { useCardCompetitionOwner } from "@/hooks/useContracts";

// ============================================================================
// Navigation Items
// ============================================================================

const NAV_ITEMS = [
  {
    href: "/",
    label: "Home",
    icon: Home,
  },
  {
    href: "/browse",
    label: "Browse",
    icon: List,
  },
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: User2,
  },
];

// ============================================================================
// Component
// ============================================================================

export function BottomNav() {
  const pathname = usePathname();
  const { address, isConnected } = useAccount();
  const { data: owner } = useCardCompetitionOwner();

  // Check if user is owner
  const isOwner =
    isConnected && owner && address?.toLowerCase() === owner.toLowerCase();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t flex justify-around items-center h-16 safe-area-inset-bottom"
      role="navigation"
      aria-label="Mobile navigation"
    >
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`
              flex flex-col items-center justify-center gap-1 flex-1 h-full min-h-[44px] transition-colors
              ${isActive ? "text-primary !text-black" : "text-muted-foreground !text-black/50"}
            `}
            aria-label={item.label}
            aria-current={isActive ? "page" : undefined}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        );
      })}

      {/* Admin Link - Only for Owner */}
      {isOwner && (
        <Link
          href="/admin"
          className={`
            flex flex-col items-center justify-center gap-1 flex-1 h-full min-h-[44px] transition-colors
            ${pathname === "/admin" ? "text-yellow-600" : "text-muted-foreground !text-black/50"}
          `}
          aria-label="Admin"
          aria-current={pathname === "/admin" ? "page" : undefined}
        >
          <Crown className="w-5 h-5" />
          <span className="text-[10px] font-medium">Admin</span>
        </Link>
      )}
    </nav>
  );
}

export default BottomNav;

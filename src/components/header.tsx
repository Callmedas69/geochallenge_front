/**
 * @title Header Component
 * @dev Main navigation header with wallet connection
 * @notice Includes navigation links and responsive design
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CustomConnectButton } from "@/components/CustomConnectButton";
import { useAccount } from "wagmi";
import { Badge } from "@/components/ui/badge";
import { useCardCompetitionOwner } from "@/hooks/useContracts";
import { Crown, Home, List, User2 } from "lucide-react";
import { useState, useEffect } from "react";

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
    label: "My Dashboard",
    icon: User2,
  },
];

// ============================================================================
// Component
// ============================================================================

export function Header() {
  const pathname = usePathname();
  const { address, isConnected } = useAccount();
  const { data: owner } = useCardCompetitionOwner();

  // Scroll state
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Check if user is owner
  const isOwner =
    isConnected && owner && address?.toLowerCase() === owner.toLowerCase();

  // Handle scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 100) {
        // Always show header near top
        setShowHeader(true);
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down - hide header
        setShowHeader(false);
      } else {
        // Scrolling up - show header
        setShowHeader(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-transform duration-300 ${
        showHeader ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="container mx-auto px-3 sm:px-4 py-2.5 sm:py-4">
        <div className="flex justify-between items-center">
          {/* Logo & Title */}
          <Link
            href="/"
            className="flex items-center gap-2 sm:gap-4 hover:opacity-80 transition-opacity"
          >
            <div className="font-bold">
              <h1 className="text-2xl sm:text-3xl md:text-4xl tracking-tighter sm:tracking-tightest md:tracking-tightest font-heading font-bold !text-black">
                GEOCHALLENGE
              </h1>
            </div>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-6">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium transition-colors hover:text-primary
                    ${isActive ? "text-primary" : "text-muted-foreground"} !text-black/50
                  `}
                >
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  {item.label}
                </Link>
              );
            })}

            {/* Admin Link - Only for Owner */}
            {isOwner && (
              <>
                <div className="h-4 w-px bg-border" />
                <Link
                  href="/admin"
                  className={`
                    flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium transition-colors hover:text-yellow-600
                    ${pathname === "/admin" ? "text-yellow-600" : "!text-muted-foreground"}
                  `}
                >
                  <Crown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Admin
                  <Badge className="bg-yellow-500 text-white text-[10px] sm:text-xs">
                    Owner
                  </Badge>
                </Link>
              </>
            )}
          </nav>

          {/* Wallet Connect */}
          <div className="flex items-center gap-2 sm:gap-3">
            <CustomConnectButton />
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="flex md:hidden items-center gap-3 sm:gap-4 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium transition-colors hover:text-primary !text-black/50
                  ${isActive ? "text-primary" : "text-muted-foreground"}
                `}
              >
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                {item.label}
              </Link>
            );
          })}

          {/* Admin Link - Mobile */}
          {isOwner && (
            <Link
              href="/admin"
              className={`
                flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium transition-colors hover:text-yellow-600 !text-black/50
                ${pathname === "/admin" ? "text-yellow-600" : "text-muted-foreground"}
              `}
            >
              <Crown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Admin
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

// ============================================================================
// Export
// ============================================================================

export default Header;

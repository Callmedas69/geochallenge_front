/**
 * @title BottomNav Component (Farcaster)
 * @notice Fixed bottom navigation for Farcaster miniApp
 * @dev KISS principle: Icon-only, 3 items, thumb-friendly
 * @dev Routes: Home (/miniapps) | Browse (/miniapps/browse) | Dashboard (/miniapps/dashboard)
 */

"use client";

import { Home, List, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

/**
 * Bottom navigation bar for Farcaster miniApp
 * Shows Home, Browse, and Dashboard icons with active state highlighting
 */
export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/miniapps",
      icon: Home,
      label: "Home",
      isActive: pathname === "/miniapps",
    },
    {
      href: "/miniapps/browse",
      icon: List,
      label: "Browse",
      isActive: pathname === "/miniapps/browse",
    },
    {
      href: "/miniapps/dashboard",
      icon: User,
      label: "Dashboard",
      isActive: pathname === "/miniapps/dashboard",
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <div className="container mx-auto px-3">
        <div className="grid grid-cols-3 gap-2 h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-center transition-colors",
                  item.isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
                aria-label={item.label}
              >
                <Icon className="h-6 w-6" />
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

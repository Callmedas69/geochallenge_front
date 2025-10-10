"use client";

import { CustomConnectButton } from "@/components/CustomConnectButton";
import Link from "next/link";
import MenuBar from "./MenuBar";

export function Header() {
  return (
    <header className="w-full border-b border-border">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Desktop Layout */}
        <div className="hidden md:flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <h1 className="text-4xl font-bold tracking-tighter font-heading text-foreground">
                GEOART
              </h1>
            </Link>
          </div>

          {/* Navigation - Centered */}
          <div className="flex items-center justify-center flex-1">
            <MenuBar />
          </div>

          {/* Wallet Connect */}
          <div className="flex items-center">
            <CustomConnectButton />
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden">
          {/* Top Row: Logo and Wallet */}
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/">
                <h1 className="text-3xl font-bold tracking-tighter font-heading text-foreground">
                  GEOART
                </h1>
              </Link>
            </div>
            <div className="flex items-center">
              <CustomConnectButton />
            </div>
          </div>

          {/* Bottom Row: Navigation */}
          <div className="pb-3 border-t border-border/50">
            <div className="pt-3">
              <MenuBar />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

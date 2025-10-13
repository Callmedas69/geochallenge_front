/**
 * @title Admin Page (Phase 2)
 * @notice Owner-only page for creating and managing competitions
 * @dev KISS principle - uses new OwnerGuard + AdminDashboard components
 */

"use client";

import { OwnerGuard } from "@/components/admin/OwnerGuard";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export default function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <OwnerGuard>
        <AdminDashboard />
      </OwnerGuard>
    </div>
  );
}

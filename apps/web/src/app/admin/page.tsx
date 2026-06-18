"use client";

import { RequireAuth } from "@/features/auth/components/require-auth";
import { AdminDashboard } from "@/features/admin/components/admin-dashboard";

export default function AdminPage() {
  return (
    <RequireAuth adminOnly>
      <AdminDashboard />
    </RequireAuth>
  );
}

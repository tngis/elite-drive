"use client";

import { RequireAuth } from "@/features/auth/components/require-auth";
import { GarageView } from "@/features/cars/components/garage-view";

export default function DashboardCarsPage() {
  return (
    <RequireAuth>
      <GarageView />
    </RequireAuth>
  );
}

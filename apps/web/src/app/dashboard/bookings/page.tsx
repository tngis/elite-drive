"use client";

import { RequireAuth } from "@/features/auth/components/require-auth";
import { BookingsView } from "@/features/bookings/components/bookings-view";
import { DashboardTabs } from "@/features/dashboard/components/dashboard-tabs";

export default function OwnerBookingsPage() {
  return (
    <RequireAuth>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold tracking-tight">
          Ирсэн хүсэлтүүд
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Таны машинд ирсэн түрээсийн хүсэлтүүд
        </p>
        <DashboardTabs />
        <div className="mt-6">
          <BookingsView perspective="owner" />
        </div>
      </div>
    </RequireAuth>
  );
}

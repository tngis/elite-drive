"use client";

import { RequireAuth } from "@/features/auth/components/require-auth";
import { BookingsView } from "@/features/bookings/components/bookings-view";

export default function MyBookingsPage() {
  return (
    <RequireAuth>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold tracking-tight">
          Миний захиалга
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Таны түрээслэхээр илгээсэн хүсэлтүүд
        </p>
        <div className="mt-6">
          <BookingsView perspective="renter" />
        </div>
      </div>
    </RequireAuth>
  );
}

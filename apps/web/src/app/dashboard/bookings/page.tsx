"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { RequireAuth } from "@/features/auth/components/require-auth";
import { BookingsView } from "@/features/bookings/components/bookings-view";

export default function OwnerBookingsPage() {
  return (
    <RequireAuth>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/profile"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Профайл
        </Link>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">
          Ирсэн хүсэлтүүд
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Таны машинд ирсэн түрээсийн хүсэлтүүд
        </p>
        <div className="mt-6">
          <BookingsView perspective="owner" />
        </div>
      </div>
    </RequireAuth>
  );
}

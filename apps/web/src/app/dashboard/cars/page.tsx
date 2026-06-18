"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { RequireAuth } from "@/features/auth/components/require-auth";
import { Button } from "@/components/ui/button";
import { OwnerCars } from "@/features/cars/components/owner-cars";
import { DashboardTabs } from "@/features/dashboard/components/dashboard-tabs";

export default function DashboardCarsPage() {
  return (
    <RequireAuth>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Миний машинууд
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Машинаа нийтэлж, үнэ, боломжит огноогоо удирдаарай
            </p>
          </div>
          <Button asChild className="gap-1.5">
            <Link href="/dashboard/cars/new">
              <Plus className="size-4" />
              <span className="hidden sm:inline">Машин нэмэх</span>
            </Link>
          </Button>
        </div>
        <DashboardTabs />
        <div className="mt-6">
          <OwnerCars />
        </div>
      </div>
    </RequireAuth>
  );
}

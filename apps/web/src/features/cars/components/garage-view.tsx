"use client";

import Link from "next/link";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Pencil,
  Trash2,
  Car,
  Power,
  CalendarCheck,
  Wallet,
  Loader2,
} from "lucide-react";
import type { CarDto } from "@elite-drive/types";
import { formatPrice } from "../data";
import { carsApi } from "../api";
import { bookingsApi } from "@/features/bookings/api";
import { CarImage } from "./car-image";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { ApiError } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function GarageView() {
  const { data: cars, isLoading } = useQuery({
    queryKey: ["cars", "mine"],
    queryFn: () => carsApi.listMine(),
  });
  const { data: ownerBookings } = useQuery({
    queryKey: ["bookings", "owner"],
    queryFn: () => bookingsApi.listOwner(),
  });

  const total = cars?.length ?? 0;
  const active = cars?.filter((c) => c.isActive).length ?? 0;
  const bookingCount = ownerBookings?.length ?? 0;
  const earnings = (ownerBookings ?? [])
    .filter((b) => b.status === "completed")
    .reduce((s, b) => s + b.price.subtotal, 0);

  const stats = [
    { icon: Car, label: "Машин", value: String(total) },
    { icon: Power, label: "Идэвхтэй", value: String(active) },
    { icon: CalendarCheck, label: "Захиалга", value: String(bookingCount) },
    { icon: Wallet, label: "Орлого", value: formatPrice(earnings) },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight">Миний гараж</h1>
          </div>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Машинуудаа нийтэлж, удирдаарай
          </p>
        </div>
        {/* Desktop: pill */}
        <Link
          href="/dashboard/cars/new"
          className="items-center gap-1.5 rounded-full bg-brand px-5 h-10 text-sm font-semibold text-white transition-all hover:brightness-105 active:scale-[0.98] inline-flex"
        >
          <Plus className="size-4" />
          <span className="hidden sm:block">Машин нэмэх</span>
        </Link>
      </div>

      {/* Stats — card-гүй */}
      <div className="mt-6 grid grid-cols-2 gap-y-5 sm:grid-cols-4 sm:divide-x sm:divide-border">
        {stats.map((s) => (
          <div key={s.label} className="flex items-center gap-3 sm:px-4">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">
              <s.icon className="size-5" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-lg font-bold tracking-tight">
                {s.value}
              </p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Car grid */}
      {isLoading ? (
        <div className="grid place-items-center py-24 text-muted-foreground">
          <Loader2 className="size-6 animate-spin" />
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {cars?.map((car) => <GarageCar key={car.id} car={car} />)}
        </div>
      )}
    </div>
  );
}

function AddCarCard() {
  return (
    <Link
      href="/dashboard/cars/new"
      className="group grid min-h-[180px] place-items-center rounded-2xl border-2 border-dashed border-border bg-card/40 transition-colors hover:border-brand/50 hover:bg-brand/[0.03]"
    >
      <div className="text-center">
        <span className="mx-auto grid size-12 place-items-center rounded-full bg-brand/10 text-brand transition-transform group-hover:scale-110">
          <Plus className="size-6" />
        </span>
        <p className="mt-3 text-sm font-medium">Машин нэмэх</p>
      </div>
    </Link>
  );
}

function GarageCar({ car }: { car: CarDto }) {
  const qc = useQueryClient();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const toggle = useMutation({
    mutationFn: () => carsApi.update(car.id, { isActive: !car.isActive }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cars", "mine"] });
      toast.success(car.isActive ? "Идэвхгүй болголоо" : "Идэвхтэй болголоо");
    },
    onError: () => toast.error("Алдаа гарлаа"),
  });
  const remove = useMutation({
    mutationFn: () => carsApi.remove(car.id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cars", "mine"] });
      setConfirmOpen(false);
      toast.success("Машин устгагдлаа");
    },
    onError: (err) =>
      toast.error(err instanceof ApiError ? err.message : "Устгахад алдаа гарлаа"),
  });

  return (
    <div
      className={cn(
        "group overflow-hidden rounded-2xl border bg-card transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5",
        car.isActive ? "border-border" : "border-dashed border-border",
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        {/* Идэвхгүй бол зургийг бүдгэрүүлж ялгана */}
        <div
          className={cn(
            "h-full w-full transition",
            !car.isActive && "opacity-40 grayscale",
          )}
        >
          <CarImage car={car} />
        </div>
        <span
          className={cn(
            "absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium backdrop-blur",
            car.isActive ? "bg-emerald-500/90 text-white" : "bg-zinc-700/80 text-white",
          )}
        >
          <span
            className={cn(
              "size-1.5 rounded-full",
              car.isActive ? "bg-white" : "bg-white/60",
            )}
          />
          {car.isActive ? "Идэвхтэй" : "Идэвхгүй"}
        </span>
        {car.images.length === 0 && (
          <span className="absolute right-3 top-3 rounded-full bg-amber-500/90 px-2.5 py-1 text-xs font-medium text-white">
            Зураг алга
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate font-semibold">
              {car.brand} {car.name}
            </h3>
            <p className="mt-0.5 truncate text-sm text-muted-foreground">
              {car.year} · {car.location}
            </p>
          </div>
          <p className="shrink-0 text-sm font-semibold">
            {formatPrice(car.pricePerDay)}
            <span className="font-normal text-muted-foreground">/өдөр</span>
          </p>
        </div>

        <div className="mt-4 flex items-center gap-2 border-t border-border pt-3">
          <Link
            href={`/dashboard/cars/${car.id}/edit`}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-muted py-2 text-sm font-medium transition-colors hover:bg-accent"
          >
            <Pencil className="size-3.5" />
            Засах
          </Link>
          <button
            type="button"
            disabled={toggle.isPending}
            onClick={() => toggle.mutate()}
            title={car.isActive ? "Идэвхгүй болгох" : "Идэвхжүүлэх"}
            className={cn(
              "grid size-9 place-items-center rounded-lg transition-colors disabled:opacity-60",
              car.isActive
                ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
          >
            {toggle.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Power className="size-4" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            title="Устгах"
            className="grid size-9 place-items-center rounded-lg bg-muted text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Машиныг устгах уу?"
        description={`${car.brand} ${car.name}-г бүрмөсөн устгана. Энэ үйлдлийг буцаах боломжгүй.`}
        loading={remove.isPending}
        onConfirm={() => remove.mutate()}
        onClose={() => setConfirmOpen(false)}
      />
    </div>
  );
}

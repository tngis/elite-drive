"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Users,
  Fuel,
  Settings2,
  Calendar,
  MapPin,
  Star,
  Gauge,
  Palette,
  Check,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookingCard } from "./booking-card";
import { CarGallery } from "./car-gallery";
import { carsApi } from "../api";
import { cn } from "@/lib/utils";

export function CarDetail({ id }: { id: string }) {
  const { data: car, isLoading, isError } = useQuery({
    queryKey: ["cars", id],
    queryFn: () => carsApi.getById(id),
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="grid place-items-center py-32 text-muted-foreground">
        <Loader2 className="size-6 animate-spin" />
      </div>
    );
  }

  if (isError || !car) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="text-xl font-semibold">Машин олдсонгүй</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Энэ зар устсан эсвэл идэвхгүй болсон байж магадгүй.
        </p>
        <Link
          href="/cars"
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-brand-foreground hover:underline"
        >
          <ArrowLeft className="size-4" />
          Машин хайх руу буцах
        </Link>
      </div>
    );
  }

  const specs = [
    { icon: Users, label: "Суудал", value: `${car.seats}` },
    { icon: Settings2, label: "Хурд", value: car.transmission },
    { icon: Fuel, label: "Шатахуун", value: car.fuel },
    { icon: Calendar, label: "Үйлдвэрлэсэн", value: `${car.year}` },
    { icon: Gauge, label: "Ангилал", value: car.category },
    { icon: Palette, label: "Өнгө", value: car.color },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <Link
        href="/cars"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Машин хайх руу буцах
      </Link>

      <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="min-w-0">
          <CarGallery car={car} />

          <div className="mt-6">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                {car.brand} {car.name}
              </h1>
              <Badge variant="secondary">{car.year}</Badge>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="size-4" />
                {car.location}
              </span>
              {car.tripCount > 0 && (
                <span className="flex items-center gap-1">
                  <Star className="size-4 fill-brand text-brand" />
                  {car.rating.toFixed(1)} · {car.tripCount} аялал
                </span>
              )}
            </div>
          </div>

          {car.description && (
            <>
              <Separator className="my-6" />
              <p className="text-sm leading-relaxed text-muted-foreground">
                {car.description}
              </p>
            </>
          )}

          <Separator className="my-6" />

          <h2 className="text-lg font-semibold">Үзүүлэлт</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {specs.map((s) => (
              <div
                key={s.label}
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-muted">
                  <s.icon className="size-4.5 text-muted-foreground" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="truncate text-sm font-medium">{s.value}</p>
                </div>
              </div>
            ))}
          </div>

          {car.features.length > 0 && (
            <>
              <Separator className="my-6" />
              <h2 className="text-lg font-semibold">Тоноглол</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {car.features.map((f) => (
                  <span
                    key={f}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-sm",
                    )}
                  >
                    <Check className="size-3.5 text-brand" />
                    {f}
                  </span>
                ))}
              </div>
            </>
          )}

          <Separator className="my-6" />

          <h2 className="text-lg font-semibold">Машины эзэн</h2>
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-border bg-card p-4">
            <Avatar className="size-12">
              <AvatarImage
                src={car.owner.avatarUrl ?? undefined}
                alt={car.owner.name}
              />
              <AvatarFallback className="bg-gradient-to-br from-brand to-orange-600 font-semibold text-white">
                {car.owner.name.slice(0, 1)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{car.owner.name}</p>
              <p className="text-sm text-muted-foreground">
                {car.owner.carCount} машин
              </p>
            </div>
          </div>
        </div>

        <aside className="min-w-0">
          <div className="lg:sticky lg:top-20">
            <BookingCard car={car} />
          </div>
        </aside>
      </div>
    </div>
  );
}

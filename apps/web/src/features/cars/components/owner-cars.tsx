"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Pencil, Plus, Trash2, CarFront } from "lucide-react";
import type { CarDto } from "@elite-drive/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "../data";
import { carsApi } from "../api";
import { CarImage } from "./car-image";
import { ApiError } from "@/lib/api-client";

export function OwnerCars() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["cars", "mine"],
    queryFn: () => carsApi.listMine(),
  });

  const toggle = useMutation({
    mutationFn: (car: CarDto) =>
      carsApi.update(car.id, { isActive: !car.isActive }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cars", "mine"] }),
  });

  const remove = useMutation({
    mutationFn: (id: string) => carsApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cars", "mine"] }),
    onError: (err) =>
      alert(err instanceof ApiError ? err.message : "Устгахад алдаа гарлаа"),
  });

  if (isLoading) {
    return (
      <div className="grid place-items-center py-24 text-muted-foreground">
        <Loader2 className="size-6 animate-spin" />
      </div>
    );
  }

  const cars = data ?? [];

  if (cars.length === 0) {
    return (
      <div className="grid place-items-center rounded-xl border border-dashed border-border py-20 text-center">
        <CarFront className="size-8 text-muted-foreground" />
        <p className="mt-3 font-medium">Та машин нэмээгүй байна</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Машинаа нийтэлж орлого олж эхлээрэй
        </p>
        <Button asChild className="mt-4 gap-1.5">
          <Link href="/dashboard/cars/new">
            <Plus className="size-4" />
            Машин нэмэх
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {cars.map((car) => (
        <div
          key={car.id}
          className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center"
        >
          <div className="h-24 w-full shrink-0 overflow-hidden rounded-xl sm:w-36">
            <CarImage car={car} brandSize="text-lg" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">
                {car.brand} {car.name}
              </h3>
              {car.isActive ? (
                <Badge variant="secondary" className="text-xs">
                  Идэвхтэй
                </Badge>
              ) : (
                <Badge variant="outline" className="text-xs text-muted-foreground">
                  Идэвхгүй
                </Badge>
              )}
            </div>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {car.year} · {car.location}
            </p>
            <p className="mt-1 text-sm font-medium">
              {formatPrice(car.pricePerDay)}{" "}
              <span className="font-normal text-muted-foreground">/ өдөр</span>
              {car.images.length === 0 && (
                <span className="ml-2 text-xs text-amber-600">· Зураг алга</span>
              )}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={toggle.isPending}
              onClick={() => toggle.mutate(car)}
            >
              {car.isActive ? "Идэвхгүй болгох" : "Идэвхжүүлэх"}
            </Button>
            <Button size="sm" variant="outline" asChild className="gap-1.5">
              <Link href={`/dashboard/cars/${car.id}/edit`}>
                <Pencil className="size-3.5" />
                Засах
              </Link>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-destructive hover:text-destructive"
              disabled={remove.isPending}
              onClick={() => {
                if (confirm(`${car.brand} ${car.name}-г устгах уу?`))
                  remove.mutate(car.id);
              }}
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

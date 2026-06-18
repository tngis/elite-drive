"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Loader2 } from "lucide-react";
import type { CarInput } from "@elite-drive/types";
import { Separator } from "@/components/ui/separator";
import { carsApi } from "../api";
import { CarForm } from "./car-form";
import { CarImagesManager } from "./car-images-manager";
import { CarAvailabilityManager } from "./car-availability-manager";

export function EditCarView({ id }: { id: string }) {
  const router = useRouter();
  const qc = useQueryClient();
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
        <Link href="/dashboard/cars" className="mt-4 inline-block text-sm text-brand-foreground hover:underline">
          Миний машинууд руу буцах
        </Link>
      </div>
    );
  }

  async function handleUpdate(data: CarInput) {
    await carsApi.update(id, data);
    await qc.invalidateQueries({ queryKey: ["cars"] });
    router.push("/dashboard/cars");
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/dashboard/cars"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Миний машинууд
      </Link>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight">
        {car.brand} {car.name}
      </h1>

      <section className="mt-6">
        <h2 className="text-lg font-semibold">Зураг</h2>
        <p className="text-sm text-muted-foreground">Олон зураг оруулж болно</p>
        <div className="mt-4 rounded-2xl border border-border bg-card p-5">
          <CarImagesManager car={car} />
        </div>
      </section>

      <Separator className="my-8" />

      <section>
        <h2 className="text-lg font-semibold">Мэдээлэл</h2>
        <div className="mt-4 rounded-2xl border border-border bg-card p-5 sm:p-6">
          <CarForm initial={car} submitLabel="Хадгалах" onSubmit={handleUpdate} />
        </div>
      </section>

      <Separator className="my-8" />

      <section>
        <h2 className="text-lg font-semibold">Боломжгүй огноо</h2>
        <div className="mt-4 rounded-2xl border border-border bg-card p-5">
          <CarAvailabilityManager carId={car.id} />
        </div>
      </section>
    </div>
  );
}

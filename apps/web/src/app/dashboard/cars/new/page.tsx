"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import type { CarInput } from "@elite-drive/types";
import { RequireAuth } from "@/features/auth/components/require-auth";
import { CarForm } from "@/features/cars/components/car-form";
import { carsApi } from "@/features/cars/api";

export default function NewCarPage() {
  const router = useRouter();
  const qc = useQueryClient();

  async function handleCreate(data: CarInput, images: File[]) {
    const car = await carsApi.create(data);
    if (images.length > 0) {
      await carsApi.uploadImages(car.id, images);
    }
    qc.invalidateQueries({ queryKey: ["cars"] });
    router.push("/dashboard/cars");
  }

  return (
    <RequireAuth>
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/dashboard/cars"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Миний машинууд
        </Link>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">
          Шинэ машин нэмэх
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Зураг болон мэдээллээ оруулаад хадгална уу
        </p>
        <div className="mt-6 rounded-2xl border border-border bg-card p-5 sm:p-6">
          <CarForm submitLabel="Хадгалах" onSubmit={handleCreate} />
        </div>
      </div>
    </RequireAuth>
  );
}

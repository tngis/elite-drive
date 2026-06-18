"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CarCard } from "@/features/cars/components/car-card";
import { carsApi } from "@/features/cars/api";

export function FeaturedCars() {
  const { data, isLoading } = useQuery({
    queryKey: ["cars", "featured"],
    queryFn: () => carsApi.search({ sort: "recommended", pageSize: 6 }),
  });

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            Онцлох машинууд
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Хамгийн өндөр үнэлгээтэй, эрэлттэй машинууд
          </p>
        </div>
        <Button variant="ghost" asChild className="hidden shrink-0 sm:flex">
          <Link href="/cars">
            Бүгдийг үзэх
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="mt-10 grid place-items-center text-muted-foreground">
          <Loader2 className="size-6 animate-spin" />
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {(data?.items ?? []).map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      )}

      <div className="mt-8 flex justify-center sm:hidden">
        <Button variant="outline" asChild>
          <Link href="/cars">
            Бүх машиныг үзэх
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}

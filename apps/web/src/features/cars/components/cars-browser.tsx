"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { carsApi } from "../api";
import { priceBounds } from "../data";
import type { Car } from "../types";
import { CarCard } from "./car-card";
import {
  CarFilters,
  emptyFilters,
  type CarFilterState,
} from "./car-filters";

type SortKey = "recommended" | "price-asc" | "price-desc" | "rating";

// Олон сонголттой шүүлтүүрийг client талд хэрэгжүүлнэ (API нэг утга авдаг)
function applyClientFilters(cars: Car[], f: CarFilterState): Car[] {
  return cars.filter((c) => {
    if (f.categories.length && !f.categories.includes(c.category as never))
      return false;
    if (
      f.transmissions.length &&
      !f.transmissions.includes(c.transmission as never)
    )
      return false;
    if (f.fuels.length && !f.fuels.includes(c.fuel as never)) return false;
    if (c.pricePerDay > f.maxPrice) return false;
    return true;
  });
}

export function CarsBrowser({
  initialCategory,
}: {
  initialCategory?: string;
}) {
  const [filters, setFilters] = useState<CarFilterState>(() =>
    initialCategory
      ? {
          ...emptyFilters,
          categories: [initialCategory as CarFilterState["categories"][number]],
        }
      : emptyFilters,
  );
  const [sort, setSort] = useState<SortKey>("recommended");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["cars", "search", sort],
    queryFn: () => carsApi.search({ sort, pageSize: 60 }),
  });

  const results = useMemo(
    () => applyClientFilters(data?.items ?? [], filters),
    [data, filters],
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Машин хайх
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isLoading ? "Ачаалж байна…" : `${results.length} машин олдлоо`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="outline" size="sm" className="gap-2">
                <SlidersHorizontal className="size-4" />
                Шүүлтүүр
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Шүүлтүүр</SheetTitle>
              </SheetHeader>
              <div className="px-4 pb-8">
                <CarFilters value={filters} onChange={setFilters} />
              </div>
            </SheetContent>
          </Sheet>

          <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
            <SelectTrigger className="w-[180px]" size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recommended">Санал болгосон</SelectItem>
              <SelectItem value="price-asc">Үнэ: бага → их</SelectItem>
              <SelectItem value="price-desc">Үнэ: их → бага</SelectItem>
              <SelectItem value="rating">Үнэлгээ өндөр</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-20 rounded-xl border border-border bg-card p-5">
            <CarFilters value={filters} onChange={setFilters} />
          </div>
        </aside>

        <div>
          {isLoading ? (
            <div className="grid place-items-center py-24 text-muted-foreground">
              <Loader2 className="size-6 animate-spin" />
            </div>
          ) : isError ? (
            <div className="grid place-items-center rounded-xl border border-dashed border-destructive/40 py-24 text-center">
              <p className="font-medium">Серверт холбогдоход алдаа гарлаа</p>
              <p className="mt-1 text-sm text-muted-foreground">
                API ажиллаж байгаа эсэхийг шалгана уу
              </p>
            </div>
          ) : results.length ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          ) : (
            <div className="grid place-items-center rounded-xl border border-dashed border-border py-24 text-center">
              <p className="font-medium">Тохирох машин олдсонгүй</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Шүүлтүүрээ өөрчилж дахин оролдоно уу
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => setFilters(emptyFilters)}
              >
                Шүүлтүүр цэвэрлэх
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export { priceBounds };

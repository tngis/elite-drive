import Link from "next/link";
import { Star, Users, Fuel, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "../data";
import { CarImageCarousel } from "./car-image-carousel";
import type { Car } from "../types";

export function CarCard({ car }: { car: Car }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5">
      <div className="relative">
        <CarImageCarousel car={car} />
        {/* Badges — pointer-events-none тул доорх swipe/click саадгүй */}
        {car.instantBook && (
          <Badge className="pointer-events-none absolute left-3 top-3 z-10 gap-1 bg-brand text-brand-foreground hover:bg-brand">
            <Zap className="size-3" />
            Шуурхай захиалга
          </Badge>
        )}
        <Badge
          variant="secondary"
          className="pointer-events-none absolute right-3 top-3 z-10 bg-black/55 text-white backdrop-blur hover:bg-black/55"
        >
          {car.category}
        </Badge>
      </div>

      <Link href={`/cars/${car.id}`} className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold leading-tight">
              {car.brand} {car.name}
              <span className="ml-1 font-normal text-muted-foreground">
                {car.year}
              </span>
            </h3>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {car.location}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1 text-sm">
            {car.tripCount > 0 ? (
              <>
                <Star className="size-3.5 fill-brand text-brand" />
                <span className="font-medium">{car.rating.toFixed(1)}</span>
                <span className="text-muted-foreground">({car.tripCount})</span>
              </>
            ) : (
              <Badge variant="secondary" className="text-xs">
                Шинэ
              </Badge>
            )}
          </div>
        </div>

        <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="size-3.5" />
            {car.seats}
          </span>
          <span className="flex items-center gap-1">
            <Fuel className="size-3.5" />
            {car.fuel}
          </span>
          <span>{car.transmission}</span>
        </div>

        <div className="mt-4 flex items-end justify-between border-t border-border pt-3">
          <div>
            <span className="text-base font-semibold">
              {formatPrice(car.pricePerDay)}
            </span>
            <span className="text-sm text-muted-foreground"> / өдөр</span>
          </div>
          <span className="text-sm font-medium text-brand-foreground/80 group-hover:underline">
            Дэлгэрэнгүй →
          </span>
        </div>
      </Link>
    </div>
  );
}

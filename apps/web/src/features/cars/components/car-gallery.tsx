"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { CarImage } from "./car-image";
import type { CarDto } from "../types";

// Дэлгэрэнгүй хуудасны галерей: үндсэн зураг + доор нь thumbnail-ууд.
export function CarGallery({ car }: { car: CarDto }) {
  const [active, setActive] = useState(0);
  const images = car.images;

  return (
    <div>
      <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
        {images.length > 0 ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={images[active].url}
            alt={`${car.brand} ${car.name}`}
            className="h-full w-full object-cover"
          />
        ) : (
          <CarImage car={car} brandSize="text-4xl" />
        )}
        {car.instantBook && (
          <Badge className="absolute left-4 top-4 bg-brand text-brand-foreground hover:bg-brand">
            Шуурхай захиалга
          </Badge>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "aspect-[4/3] w-24 shrink-0 overflow-hidden rounded-lg border-2 transition",
                i === active
                  ? "border-foreground"
                  : "border-transparent opacity-70 hover:opacity-100",
              )}
              aria-label={`Зураг ${i + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

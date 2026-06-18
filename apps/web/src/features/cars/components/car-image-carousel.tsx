"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { CarImage } from "./car-image";
import type { CarDto } from "../types";

// Instagram-post шиг хэвтээ swipe карусель (карт дээр).
export function CarImageCarousel({
  car,
}: {
  car: Pick<CarDto, "id" | "brand" | "images">;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const images = car.images;
  const count = images.length;

  function onScroll() {
    const el = scroller.current;
    if (!el) return;
    setActive(Math.round(el.scrollLeft / el.clientWidth));
  }

  function go(dir: number, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const el = scroller.current;
    if (!el) return;
    el.scrollTo({ left: (active + dir) * el.clientWidth, behavior: "smooth" });
  }

  // 0–1 зурагтай бол энгийн зураг (gradient fallback)
  if (count <= 1) {
    return (
      <Link
        href={`/cars/${car.id}`}
        className="block aspect-[16/10] overflow-hidden"
      >
        <CarImage car={car} />
      </Link>
    );
  }

  return (
    <div className="relative">
      <div
        ref={scroller}
        onScroll={onScroll}
        className="flex aspect-[16/10] snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {images.map((img) => (
          <Link
            key={img.id}
            href={`/cars/${car.id}`}
            className="relative min-w-full snap-center"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.url}
              alt={car.brand}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </Link>
        ))}
      </div>

      {/* Сум (desktop hover) */}
      <button
        type="button"
        onClick={(e) => go(-1, e)}
        className={cn(
          "absolute left-2 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full bg-black/45 text-white opacity-0 transition group-hover:opacity-100",
          active === 0 && "pointer-events-none !opacity-0",
        )}
        aria-label="Өмнөх зураг"
      >
        <ChevronLeft className="size-4" />
      </button>
      <button
        type="button"
        onClick={(e) => go(1, e)}
        className={cn(
          "absolute right-2 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full bg-black/45 text-white opacity-0 transition group-hover:opacity-100",
          active === count - 1 && "pointer-events-none !opacity-0",
        )}
        aria-label="Дараах зураг"
      >
        <ChevronRight className="size-4" />
      </button>

      {/* Цэгүүд */}
      <div className="pointer-events-none absolute inset-x-0 bottom-2 flex justify-center gap-1.5">
        {images.map((img, i) => (
          <span
            key={img.id}
            className={cn(
              "size-1.5 rounded-full bg-white/60 shadow transition-all",
              i === active && "w-3 bg-white",
            )}
          />
        ))}
      </div>
    </div>
  );
}

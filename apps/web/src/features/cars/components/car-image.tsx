import { cn } from "@/lib/utils";
import { gradientFor } from "../data";
import type { CarDto } from "../types";

// Зураг байвал харуулна, эс бөгөөс брэнд бичсэн gradient placeholder.
export function CarImage({
  car,
  className,
  brandSize = "text-2xl",
}: {
  car: Pick<CarDto, "id" | "brand" | "images">;
  className?: string;
  brandSize?: string;
}) {
  const url = car.images?.[0]?.url;

  if (url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={url}
        alt={car.brand}
        className={cn("h-full w-full object-cover", className)}
        loading="lazy"
      />
    );
  }

  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center bg-gradient-to-br",
        gradientFor(car.id),
        className,
      )}
    >
      <span
        className={cn(
          "font-semibold tracking-tight text-white/90 drop-shadow-sm",
          brandSize,
        )}
      >
        {car.brand}
      </span>
    </div>
  );
}

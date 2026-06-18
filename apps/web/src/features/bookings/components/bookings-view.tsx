"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, MapPin, Phone, CarFront } from "lucide-react";
import {
  paymentMethodLabels,
  type BookingDto,
} from "@elite-drive/types";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/features/cars/data";
import { bookingsApi } from "../api";
import { StatusBadge } from "./status-badge";

type Perspective = "renter" | "owner";

export function BookingsView({ perspective }: { perspective: Perspective }) {
  const qc = useQueryClient();
  const queryKey = ["bookings", perspective];

  const { data, isLoading, isError } = useQuery({
    queryKey,
    queryFn: () =>
      perspective === "renter"
        ? bookingsApi.listMine()
        : bookingsApi.listOwner(),
  });

  const mutation = useMutation({
    mutationFn: ({
      action,
      id,
    }: {
      action: "approve" | "reject" | "cancel" | "start" | "complete" | "markPaid";
      id: string;
    }) => {
      switch (action) {
        case "approve":
          return bookingsApi.approve(id);
        case "reject":
          return bookingsApi.reject(id);
        case "cancel":
          return bookingsApi.cancel(id);
        case "start":
          return bookingsApi.start(id);
        case "complete":
          return bookingsApi.complete(id);
        case "markPaid":
          return bookingsApi.markPaid(id);
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey });
    },
  });

  if (isLoading) {
    return (
      <div className="grid place-items-center py-24 text-muted-foreground">
        <Loader2 className="size-6 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <p className="py-24 text-center text-sm text-muted-foreground">
        Захиалга ачаалахад алдаа гарлаа.
      </p>
    );
  }

  const bookings = data ?? [];

  if (bookings.length === 0) {
    return (
      <div className="grid place-items-center rounded-xl border border-dashed border-border py-20 text-center">
        <CarFront className="size-8 text-muted-foreground" />
        <p className="mt-3 font-medium">
          {perspective === "renter"
            ? "Танд захиалга алга байна"
            : "Ирсэн хүсэлт алга байна"}
        </p>
        {perspective === "renter" && (
          <Button asChild variant="outline" size="sm" className="mt-4">
            <Link href="/cars">Машин хайх</Link>
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((b) => (
        <BookingCardRow
          key={b.id}
          booking={b}
          perspective={perspective}
          pending={mutation.isPending}
          onAction={(action) => mutation.mutate({ action, id: b.id })}
        />
      ))}
    </div>
  );
}

function BookingCardRow({
  booking: b,
  perspective,
  onAction,
  pending,
}: {
  booking: BookingDto;
  perspective: Perspective;
  onAction: (
    action: "approve" | "reject" | "cancel" | "start" | "complete" | "markPaid",
  ) => void;
  pending: boolean;
}) {
  const other = perspective === "renter" ? b.owner : b.renter;

  return (
    <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row">
        <Link
          href={`/cars/${b.car.id}`}
          className="relative h-28 w-full shrink-0 overflow-hidden rounded-xl bg-muted sm:w-44"
        >
          {b.car.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={b.car.imageUrl}
              alt={b.car.brand}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="grid h-full place-items-center bg-gradient-to-br from-stone-700 to-stone-900 text-lg font-semibold text-white/90">
              {b.car.brand}
            </div>
          )}
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <Link
                href={`/cars/${b.car.id}`}
                className="font-semibold hover:underline"
              >
                {b.car.brand} {b.car.name}
              </Link>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {b.startDate} → {b.endDate} · {b.price.days} өдөр
              </p>
            </div>
            <StatusBadge status={b.status} />
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span>
              {perspective === "renter" ? "Эзэн" : "Түрээслэгч"}:{" "}
              <span className="font-medium text-foreground">{other.name}</span>
            </span>
            {other.phone && (
              <a
                href={`tel:${other.phone}`}
                className="flex items-center gap-1 hover:text-foreground"
              >
                <Phone className="size-3.5" />
                {other.phone}
              </a>
            )}
            {b.pickupLocation && (
              <span className="flex items-center gap-1">
                <MapPin className="size-3.5" />
                {b.pickupLocation}
              </span>
            )}
          </div>

          <div className="mt-3 flex flex-wrap items-end justify-between gap-3 border-t border-border pt-3">
            <div className="text-sm">
              <span className="font-semibold">{formatPrice(b.price.total)}</span>
              <span className="text-muted-foreground">
                {" "}
                · {paymentMethodLabels[b.payment.method]} ·{" "}
                {b.payment.status === "paid" ? "Төлсөн" : "Төлбөр хүлээгдэж буй"}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              <Actions
                booking={b}
                perspective={perspective}
                pending={pending}
                onAction={onAction}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Actions({
  booking: b,
  perspective,
  onAction,
  pending,
}: {
  booking: BookingDto;
  perspective: Perspective;
  onAction: (
    action: "approve" | "reject" | "cancel" | "start" | "complete" | "markPaid",
  ) => void;
  pending: boolean;
}) {
  if (perspective === "owner") {
    if (b.status === "pending")
      return (
        <>
          <Button size="sm" disabled={pending} onClick={() => onAction("approve")}>
            Зөвшөөрөх
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={pending}
            onClick={() => onAction("reject")}
          >
            Татгалзах
          </Button>
        </>
      );
    if (b.status === "approved")
      return (
        <>
          <Button size="sm" disabled={pending} onClick={() => onAction("start")}>
            Хүлээлгэн өгөх
          </Button>
          <Button
            size="sm"
            variant="ghost"
            disabled={pending}
            onClick={() => onAction("cancel")}
          >
            Цуцлах
          </Button>
        </>
      );
    if (b.status === "active")
      return (
        <Button size="sm" disabled={pending} onClick={() => onAction("complete")}>
          Дуусгах (буцаан авсан)
        </Button>
      );
    return null;
  }

  // renter
  if (b.status === "pending" || b.status === "approved")
    return (
      <Button
        size="sm"
        variant="outline"
        disabled={pending}
        onClick={() => onAction("cancel")}
      >
        Цуцлах
      </Button>
    );
  return null;
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Star, ShieldCheck, Zap, Loader2, CheckCircle2 } from "lucide-react";
import {
  calcPrice,
  daysBetween,
  paymentMethods,
  paymentMethodLabels,
  type PaymentMethod,
} from "@elite-drive/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatPrice } from "../data";
import type { Car } from "../types";
import { useAuth } from "@/features/auth/auth-context";
import { bookingsApi } from "@/features/bookings/api";
import { ApiError } from "@/lib/api-client";

export function BookingCard({ car }: { car: Car }) {
  const { user } = useAuth();
  const router = useRouter();

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [pickup, setPickup] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("qpay");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [doneId, setDoneId] = useState<string | null>(null);

  const isOwn = user?.id === car.owner.id;
  const days = daysBetween(from, to);
  const price = calcPrice(car.pricePerDay, car.deposit, days);
  const canBook = days > 0 && !isOwn;
  const today = new Date().toISOString().slice(0, 10);

  async function submit() {
    setError(null);
    if (!user) {
      router.push(`/login?redirect=/cars/${car.id}`);
      return;
    }
    setSubmitting(true);
    try {
      const booking = await bookingsApi.create({
        carId: car.id,
        startDate: from,
        endDate: to,
        pickupLocation: pickup,
        paymentMethod: method,
      });
      setDoneId(booking.id);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Алдаа гарлаа");
    } finally {
      setSubmitting(false);
    }
  }

  if (doneId) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
        <CheckCircle2 className="mx-auto size-10 text-brand" />
        <p className="mt-3 font-semibold">
          {car.instantBook ? "Захиалга баталгаажлаа!" : "Хүсэлт илгээгдлээ!"}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {car.instantBook
            ? "Эзэнтэй холбогдож машинаа авах цэгээ тохирно уу."
            : "Эзэн удахгүй хариу өгнө. Захиалгын төлөвөө хянана уу."}
        </p>
        <Button asChild className="mt-5 w-full" size="lg">
          <Link href="/bookings">Миний захиалга</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-end justify-between">
        <div>
          <span className="text-2xl font-semibold">
            {formatPrice(car.pricePerDay)}
          </span>
          <span className="text-muted-foreground"> / өдөр</span>
        </div>
        {car.tripCount > 0 && (
          <div className="flex items-center gap-1 text-sm">
            <Star className="size-4 fill-brand text-brand" />
            <span className="font-medium">{car.rating.toFixed(1)}</span>
            <span className="text-muted-foreground">({car.tripCount})</span>
          </div>
        )}
      </div>

      <Separator className="my-4" />

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-muted-foreground">Авах</Label>
          <Input
            type="date"
            min={today}
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Буцаах</Label>
          <Input
            type="date"
            min={from || today}
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-3">
        <Label className="text-xs text-muted-foreground">Авах байршил</Label>
        <Input
          placeholder="Жишээ: СБД, 1-р хороо"
          value={pickup}
          onChange={(e) => setPickup(e.target.value)}
        />
      </div>

      <div className="mt-3">
        <Label className="text-xs text-muted-foreground">Төлбөрийн арга</Label>
        <Select
          value={method}
          onValueChange={(v) => setMethod(v as PaymentMethod)}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {paymentMethods.map((m) => (
              <SelectItem key={m} value={m}>
                {paymentMethodLabels[m]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {canBook && (
        <div className="mt-4 space-y-2 text-sm">
          <Row
            label={`${formatPrice(car.pricePerDay)} × ${days} өдөр`}
            value={formatPrice(price.subtotal)}
          />
          <Row
            label="Үйлчилгээний шимтгэл"
            value={formatPrice(price.serviceFee)}
          />
          {car.deposit > 0 && (
            <Row label="Барьцаа" value={formatPrice(car.deposit)} />
          )}
          <Separator className="my-2" />
          <Row label="Нийт" value={formatPrice(price.total)} bold />
        </div>
      )}

      {error && (
        <p className="mt-3 rounded-lg bg-destructive/10 px-3 py-2 text-center text-sm font-medium text-destructive">
          {error}
        </p>
      )}

      <Button
        className="mt-5 w-full"
        size="lg"
        disabled={!canBook || submitting}
        onClick={submit}
      >
        {submitting && <Loader2 className="size-4 animate-spin" />}
        {!user
          ? "Нэвтэрч захиалах"
          : car.instantBook
            ? "Шуурхай захиалах"
            : "Түрээсийн хүсэлт илгээх"}
      </Button>

      {isOwn && (
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Энэ бол таны машин — өөрийнхийгөө захиалах боломжгүй.
        </p>
      )}
      {!canBook && !isOwn && (
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Үнийн дүнг харахын тулд огноогоо сонгоно уу
        </p>
      )}

      <div className="mt-4 flex flex-col gap-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-2">
          <ShieldCheck className="size-3.5 text-brand" />
          Захиалга баталгаажих хүртэл төлбөр суутгахгүй
        </span>
        {car.instantBook && (
          <span className="flex items-center gap-2">
            <Zap className="size-3.5 text-brand" />
            Эзний зөвшөөрөл хүлээхгүй, шуурхай баталгаажна
          </span>
        )}
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div className="flex justify-between">
      <span className={bold ? "font-semibold" : "text-muted-foreground"}>
        {label}
      </span>
      <span className={bold ? "font-semibold" : ""}>{value}</span>
    </div>
  );
}

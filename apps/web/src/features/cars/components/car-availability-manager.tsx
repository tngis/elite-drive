"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Trash2, CalendarOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { carsApi } from "../api";
import { ApiError } from "@/lib/api-client";

export function CarAvailabilityManager({ carId }: { carId: string }) {
  const qc = useQueryClient();
  const queryKey = ["cars", carId, "availability"];
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [error, setError] = useState<string | null>(null);
  const today = new Date().toISOString().slice(0, 10);

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: () => carsApi.availability(carId),
  });

  const add = useMutation({
    mutationFn: () =>
      carsApi.addBlock(carId, { startDate: from, endDate: to }),
    onSuccess: () => {
      setFrom("");
      setTo("");
      setError(null);
      qc.invalidateQueries({ queryKey });
    },
    onError: (err) =>
      setError(err instanceof ApiError ? err.message : "Алдаа гарлаа"),
  });

  const remove = useMutation({
    mutationFn: (id: string) => carsApi.removeBlock(carId, id),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });

  const blocks = data ?? [];

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Машин түрээслүүлэх боломжгүй өдрүүдээ блоклоорой. Блоклосон хугацаанд
        захиалга авах боломжгүй.
      </p>

      <div className="flex flex-wrap items-end gap-3">
        <div>
          <Label className="text-xs text-muted-foreground">Эхлэх</Label>
          <Input
            type="date"
            min={today}
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Дуусах</Label>
          <Input
            type="date"
            min={from || today}
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>
        <Button
          disabled={!from || !to || add.isPending}
          onClick={() => add.mutate()}
        >
          {add.isPending && <Loader2 className="size-4 animate-spin" />}
          Блоклох
        </Button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {isLoading ? (
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      ) : blocks.length === 0 ? (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarOff className="size-4" />
          Блоклосон огноо алга
        </p>
      ) : (
        <ul className="space-y-2">
          {blocks.map((b) => (
            <li
              key={b.id}
              className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2 text-sm"
            >
              <span>
                {b.startDate.slice(0, 10)} → {b.endDate.slice(0, 10)}
              </span>
              <button
                type="button"
                onClick={() => remove.mutate(b.id)}
                className="text-muted-foreground hover:text-destructive"
                aria-label="Устгах"
              >
                <Trash2 className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Users, Car, CalendarCheck, Activity } from "lucide-react";
import { bookingStatusLabels, type BookingStatus } from "@elite-drive/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/features/cars/data";
import { adminApi } from "../api";

type Tab = "users" | "cars" | "bookings";

export function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("users");
  const { data: stats } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: () => adminApi.stats(),
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold tracking-tight">Админ самбар</h1>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat icon={Users} label="Хэрэглэгч" value={stats?.users} />
        <Stat icon={Car} label="Машин" value={stats?.cars} />
        <Stat icon={CalendarCheck} label="Захиалга" value={stats?.bookings} />
        <Stat icon={Activity} label="Идэвхтэй" value={stats?.activeBookings} />
      </div>

      <div className="mt-6 flex gap-1 border-b border-border">
        {(["users", "cars", "bookings"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={
              "-mb-px border-b-2 px-4 py-2.5 text-sm font-medium transition-colors " +
              (tab === t
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground")
            }
          >
            {t === "users" ? "Хэрэглэгч" : t === "cars" ? "Машин" : "Захиалга"}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "users" && <UsersTab />}
        {tab === "cars" && <CarsTab />}
        {tab === "bookings" && <BookingsTab />}
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value?: number;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <Icon className="size-5 text-muted-foreground" />
      <p className="mt-2 text-2xl font-semibold">{value ?? "—"}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function Loading() {
  return (
    <div className="grid place-items-center py-16 text-muted-foreground">
      <Loader2 className="size-6 animate-spin" />
    </div>
  );
}

function UsersTab() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: () => adminApi.users(),
  });
  const m = useMutation({
    mutationFn: ({ id, blocked }: { id: string; blocked: boolean }) =>
      blocked ? adminApi.unblock(id) : adminApi.block(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin"] }),
  });

  if (isLoading) return <Loading />;
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 text-left text-muted-foreground">
          <tr>
            <th className="p-3">Нэр</th>
            <th className="p-3">Холбоо барих</th>
            <th className="p-3">Машин</th>
            <th className="p-3">Захиалга</th>
            <th className="p-3"></th>
          </tr>
        </thead>
        <tbody>
          {(data ?? []).map((u) => (
            <tr key={u.id} className="border-t border-border">
              <td className="p-3 font-medium">
                {u.name}
                {u.isAdmin && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    Админ
                  </Badge>
                )}
              </td>
              <td className="p-3 text-muted-foreground">
                {u.phone ?? u.email ?? "—"}
              </td>
              <td className="p-3">{u.carsCount}</td>
              <td className="p-3">{u.bookingsCount}</td>
              <td className="p-3 text-right">
                {!u.isAdmin && (
                  <Button
                    size="sm"
                    variant={u.isBlocked ? "outline" : "ghost"}
                    className={u.isBlocked ? "" : "text-destructive hover:text-destructive"}
                    disabled={m.isPending}
                    onClick={() => m.mutate({ id: u.id, blocked: u.isBlocked })}
                  >
                    {u.isBlocked ? "Тайлах" : "Блоклох"}
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CarsTab() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "cars"],
    queryFn: () => adminApi.cars(),
  });
  const m = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      active ? adminApi.deactivate(id) : adminApi.activate(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin"] }),
  });

  if (isLoading) return <Loading />;
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 text-left text-muted-foreground">
          <tr>
            <th className="p-3">Машин</th>
            <th className="p-3">Эзэн</th>
            <th className="p-3">Үнэ</th>
            <th className="p-3">Төлөв</th>
            <th className="p-3"></th>
          </tr>
        </thead>
        <tbody>
          {(data ?? []).map((c) => (
            <tr key={c.id} className="border-t border-border">
              <td className="p-3 font-medium">
                {c.brand} {c.name} <span className="text-muted-foreground">{c.year}</span>
              </td>
              <td className="p-3 text-muted-foreground">{c.owner.name}</td>
              <td className="p-3">{formatPrice(c.pricePerDay)}</td>
              <td className="p-3">
                {c.isActive ? (
                  <Badge variant="secondary" className="text-xs">Идэвхтэй</Badge>
                ) : (
                  <Badge variant="outline" className="text-xs">Идэвхгүй</Badge>
                )}
              </td>
              <td className="p-3 text-right">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={m.isPending}
                  onClick={() => m.mutate({ id: c.id, active: c.isActive })}
                >
                  {c.isActive ? "Идэвхгүй болгох" : "Идэвхжүүлэх"}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BookingsTab() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "bookings"],
    queryFn: () => adminApi.bookings(),
  });
  if (isLoading) return <Loading />;
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 text-left text-muted-foreground">
          <tr>
            <th className="p-3">Машин</th>
            <th className="p-3">Түрээслэгч</th>
            <th className="p-3">Огноо</th>
            <th className="p-3">Дүн</th>
            <th className="p-3">Төлөв</th>
          </tr>
        </thead>
        <tbody>
          {(data ?? []).map((b) => (
            <tr key={b.id} className="border-t border-border">
              <td className="p-3 font-medium">{b.car}</td>
              <td className="p-3 text-muted-foreground">{b.renter}</td>
              <td className="p-3 text-muted-foreground">
                {b.startDate} → {b.endDate}
              </td>
              <td className="p-3">{formatPrice(b.total)}</td>
              <td className="p-3">
                {bookingStatusLabels[b.status as BookingStatus] ?? b.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

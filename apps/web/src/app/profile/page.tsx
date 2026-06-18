"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Loader2,
  CheckCircle2,
  ShieldCheck,
  Car,
  CalendarCheck,
  ChevronRight,
  LogOut,
  Pencil,
  Camera,
} from "lucide-react";
import { toast } from "sonner";
import type { PublicUser } from "@elite-drive/types";
import { RequireAuth } from "@/features/auth/components/require-auth";
import { useAuth } from "@/features/auth/auth-context";
import { Field } from "@/features/auth/components/field";
import { Button } from "@/components/ui/button";
import { carsApi } from "@/features/cars/api";
import { bookingsApi } from "@/features/bookings/api";
import { api, ApiError } from "@/lib/api-client";
import { cn } from "@/lib/utils";

const quickLinks = [
  { href: "/dashboard/cars", label: "Миний гараж", icon: Car },
  { href: "/bookings", label: "Миний захиалга", icon: CalendarCheck },
  { href: "/dashboard/bookings", label: "Ирсэн хүсэлтүүд", icon: CalendarCheck },
];

function ProfileView() {
  const { user, setUser, logout } = useAuth();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const { data: myCars } = useQuery({
    queryKey: ["cars", "mine"],
    queryFn: () => carsApi.listMine(),
  });
  const { data: myBookings } = useQuery({
    queryKey: ["bookings", "renter"],
    queryFn: () => bookingsApi.listMine(),
  });

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  if (!user) return null;

  const initial = user.name.slice(0, 1).toUpperCase();
  const memberYear = new Date(user.createdAt).getFullYear();
  const memberMonth = new Date(user.createdAt).getMonth() + 1;

  const stats = [
    { value: myCars?.length ?? 0, label: "Машин" },
    { value: myBookings?.length ?? 0, label: "Захиалга" },
    { value: `${memberYear}.${String(memberMonth).padStart(2, "0")}`, label: "Гишүүн" },
  ];

  async function onAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const updated = await api.upload<PublicUser>("/users/me/avatar", form);
      setUser(updated);
      toast.success("Профайл зураг солигдлоо");
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Зураг оруулахад алдаа";
      setError(msg);
      toast.error(msg);
    } finally {
      setUploadingAvatar(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function save() {
    setError(null);
    setSaved(false);
    setSaving(true);
    try {
      const updated = await api.patch<PublicUser>("/users/me", {
        name,
        email,
        phone,
      });
      setUser(updated);
      setSaved(true);
      setEditing(false);
      toast.success("Хадгалагдлаа");
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Хадгалахад алдаа гарлаа";
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  return (
    <div className="pt-12">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        {/* Avatar + name (голлосон) */}
        <div className="flex flex-col items-center text-center">
          <div className="relative">
            {user.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="size-28 rounded-full object-cover shadow-xl ring-4 ring-background"
              />
            ) : (
              <div className="grid size-28 place-items-center rounded-full bg-gradient-to-br from-brand to-orange-600 text-4xl font-bold text-white shadow-xl ring-4 ring-background">
                {initial}
              </div>
            )}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploadingAvatar}
              aria-label="Зураг солих"
              className="absolute bottom-0.5 right-0.5 grid size-9 place-items-center rounded-full bg-foreground text-background shadow-md ring-2 ring-background transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {uploadingAvatar ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Camera className="size-4" />
              )}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              hidden
              onChange={onAvatarChange}
            />
          </div>

          <h1 className="mt-4 text-2xl font-bold tracking-tight">{user.name}</h1>

          <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
            {user.phone && (
              <span className="inline-flex items-center gap-1 rounded-full bg-brand/10 px-2.5 py-1 text-xs font-medium text-brand">
                <ShieldCheck className="size-3.5" />
                Баталгаажсан
              </span>
            )}
            <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
              {memberYear} оноос гишүүн
            </span>
            {user.isAdmin && (
              <span className="rounded-full bg-foreground px-2.5 py-1 text-xs font-medium text-background">
                Админ
              </span>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 flex items-stretch justify-center divide-x divide-border">
          {stats.map((s) => (
            <div key={s.label} className="flex-1 px-4 text-center">
              <p className="text-2xl font-bold tracking-tight">{s.value}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div className="mt-8 space-y-1.5">
          {quickLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-muted"
            >
              <span className="grid size-9 place-items-center rounded-lg bg-brand/10 text-brand">
                <l.icon className="size-4.5" />
              </span>
              <span className="flex-1 text-sm font-medium">{l.label}</span>
              <ChevronRight className="size-4 text-muted-foreground" />
            </Link>
          ))}
        </div>

        {/* Хувийн мэдээлэл — card-гүй */}
        <div className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Хувийн мэдээлэл</h2>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-foreground hover:underline"
              >
                <Pencil className="size-3.5" />
                Засах
              </button>
            )}
          </div>

          {editing ? (
            <div className="mt-4 space-y-4">
              <Field
                label="Нэр"
                name="name"
                className="h-11"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Field
                label="Утасны дугаар"
                name="phone"
                prefix="+976"
                inputMode="numeric"
                maxLength={8}
                className="h-11"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              />
              <Field
                label="Имэйл"
                name="email"
                type="email"
                placeholder="name@example.com"
                className="h-11"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
              <div className="flex gap-2">
                <Button onClick={save} disabled={saving} size="lg">
                  {saving && <Loader2 className="size-4 animate-spin" />}
                  Хадгалах
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => {
                    setEditing(false);
                    setName(user.name);
                    setPhone(user.phone ?? "");
                    setEmail(user.email ?? "");
                    setError(null);
                  }}
                >
                  Болих
                </Button>
              </div>
            </div>
          ) : (
            <dl className="mt-4 divide-y divide-border">
              <InfoRow label="Нэр" value={user.name} />
              <InfoRow label="Утас" value={user.phone ? `+976 ${user.phone}` : "—"} />
              <InfoRow label="Имэйл" value={user.email || "—"} />
            </dl>
          )}

          {saved && (
            <p className="mt-3 flex items-center gap-1.5 text-sm font-medium text-brand-foreground">
              <CheckCircle2 className="size-4 text-brand" />
              Хадгалагдлаа
            </p>
          )}
        </div>

        {/* Гарах — full width улаан */}
        <div className="mt-10">
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-destructive/10 py-3.5 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/15"
          >
            <LogOut className="size-4" />
            Гарах
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className={cn("text-sm font-medium", value === "—" && "text-muted-foreground")}>
        {value}
      </dd>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <RequireAuth>
      <ProfileView />
    </RequireAuth>
  );
}

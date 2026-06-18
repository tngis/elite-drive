"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CalendarCheck,
  Car,
  LogOut,
  Shield,
  User as UserIcon,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/features/auth/auth-context";

const links = [
  { href: "/bookings", label: "Миний захиалга", icon: CalendarCheck },
  { href: "/dashboard/cars", label: "Миний гараж", icon: Car },
  { href: "/dashboard/bookings", label: "Ирсэн хүсэлтүүд", icon: CalendarCheck },
  { href: "/profile", label: "Профайл", icon: UserIcon },
];

export function UserMenu() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  if (!user) return null;

  async function handleLogout() {
    setOpen(false);
    await logout();
    router.push("/");
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full border border-foreground/10 bg-foreground/[0.04] py-1 pl-1 pr-3 text-foreground backdrop-blur transition-colors hover:bg-foreground/10 dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
      >
        <Avatar className="size-7">
          <AvatarFallback className="bg-gradient-to-br from-brand to-orange-600 text-xs font-semibold text-white">
            {user.name.slice(0, 1).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <span className="max-w-[120px] truncate text-sm font-medium">
          {user.name}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-border bg-popover p-1 shadow-lg">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
            >
              <l.icon className="size-4 text-muted-foreground" />
              {l.label}
            </Link>
          ))}
          {user.isAdmin && (
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
            >
              <Shield className="size-4 text-muted-foreground" />
              Админ самбар
            </Link>
          )}
          <div className="my-1 h-px bg-border" />
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
          >
            <LogOut className="size-4" />
            Гарах
          </button>
        </div>
      )}
    </div>
  );
}

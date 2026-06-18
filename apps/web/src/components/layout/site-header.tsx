"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Plus } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { siteConfig } from "@/lib/site";
import { useAuth } from "@/features/auth/auth-context";
import { UserMenu } from "./user-menu";
import { LiquidGlass } from "@/components/shared/liquid-glass";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, loading } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function isActive(href: string) {
    const base = href.split("#")[0];
    return base !== "/" && pathname.startsWith(base);
  }

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="mx-auto max-w-[84rem] px-3 pt-3 sm:px-6 sm:pt-4 lg:px-8">
        <div className="relative">
          {/* Instagram iOS 26 маягийн pill liquid glass */}
          <LiquidGlass
            radius={28}
            bevel={14}
            scale={22}
            blur={9}
            solid={scrolled}
            className="h-14"
            contentClassName="flex items-center gap-3 px-3 pl-4 text-foreground dark:text-white"
          >
            <Logo />

            {/* Desktop nav */}
            <nav className="ml-2 hidden items-center gap-0.5 lg:flex">
              {siteConfig.nav.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-foreground/[0.08] text-foreground dark:bg-white/15 dark:text-white"
                        : "text-foreground/60 hover:bg-foreground/[0.06] hover:text-foreground dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop actions */}
            <div className="ml-auto hidden items-center gap-2 md:flex">
              {loading ? (
                <div className="size-8 animate-pulse rounded-full bg-foreground/10" />
              ) : user ? (
                <UserMenu />
              ) : (
                <>
                  <Link
                    href="/login"
                    className="rounded-full px-4 py-2 text-sm font-medium text-foreground/75 transition-colors hover:bg-foreground/[0.07] hover:text-foreground dark:text-white/80 dark:hover:bg-white/10 dark:hover:text-white"
                  >
                    Нэвтрэх
                  </Link>
                  <Link
                    href="/register"
                    className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-brand-foreground shadow-sm shadow-brand/20 transition-all hover:brightness-105 active:scale-[0.98]"
                  >
                    Бүртгүүлэх
                  </Link>
                </>
              )}
            </div>

            {/* Mobile trigger */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild className="ml-auto md:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Цэс"
                  className="text-foreground hover:bg-foreground/[0.06] dark:text-white dark:hover:bg-white/10"
                >
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <SheetHeader>
                  <SheetTitle className="text-left">
                    <span className="font-heading text-lg font-bold tracking-tight">
                      Elite<span className="text-brand">Drive</span>
                    </span>
                  </SheetTitle>
                </SheetHeader>
                <nav className="mt-4 flex flex-col gap-1 px-3">
                  {siteConfig.nav.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "rounded-lg px-3 py-2.5 text-base font-medium transition-colors",
                        isActive(item.href)
                          ? "bg-brand/10 text-foreground"
                          : "text-foreground/80 hover:bg-muted hover:text-foreground",
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                  {user && (
                    <>
                      <div className="my-2 h-px bg-border" />
                      {[
                        { href: "/bookings", label: "Миний захиалга" },
                        { href: "/dashboard/cars", label: "Миний машинууд" },
                        { href: "/dashboard/bookings", label: "Ирсэн хүсэлтүүд" },
                        { href: "/profile", label: "Профайл" },
                        ...(user.isAdmin
                          ? [{ href: "/admin", label: "Админ самбар" }]
                          : []),
                      ].map((l) => (
                        <Link
                          key={l.href}
                          href={l.href}
                          onClick={() => setOpen(false)}
                          className="rounded-lg px-3 py-2.5 text-base font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
                        >
                          {l.label}
                        </Link>
                      ))}
                    </>
                  )}
                </nav>
                <div className="mt-auto flex flex-col gap-2 p-4">
                  {user ? (
                    <>
                      <Button asChild className="rounded-full">
                        <Link
                          href="/dashboard/cars/new"
                          onClick={() => setOpen(false)}
                        >
                          <Plus className="size-4" />
                          Машинаа нэмэх
                        </Link>
                      </Button>
                      <LogoutButton onDone={() => setOpen(false)} />
                    </>
                  ) : (
                    <>
                      <Button variant="outline" asChild className="rounded-full">
                        <Link href="/login" onClick={() => setOpen(false)}>
                          Нэвтрэх
                        </Link>
                      </Button>
                      <Button asChild className="rounded-full">
                        <Link href="/register" onClick={() => setOpen(false)}>
                          Бүртгүүлэх
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </LiquidGlass>
        </div>
      </div>
    </header>
  );
}

function LogoutButton({ onDone }: { onDone: () => void }) {
  const { logout } = useAuth();
  return (
    <Button
      variant="ghost"
      className="rounded-full"
      onClick={async () => {
        await logout();
        onDone();
      }}
    >
      Гарах
    </Button>
  );
}

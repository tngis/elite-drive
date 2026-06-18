"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/shared/logo";
import { useAuth } from "@/features/auth/auth-context";
import { UserMenu } from "./user-menu";
import { mainNav } from "./nav-config";
import { LiquidGlass } from "@/components/shared/liquid-glass";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const { user, loading } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function isActive(href: string, exact = false) {
    const base = href.split("#")[0];
    if (exact || base === "/") return pathname === base;
    return pathname.startsWith(base);
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

            {/* Таблет+ дээрх голлосон icon навигаци — доод navbar-тай ижил.
                Доод navbar md дээр алга болж, энэ нь орлоно. */}
            <nav className="hidden flex-1 items-center justify-center gap-1 md:flex">
              {mainNav.map((item) => {
                const active = isActive(item.href, item.exact);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-label={item.label}
                    title={item.label}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-foreground/[0.08] text-foreground dark:bg-white/15 dark:text-white"
                        : "text-foreground/60 hover:bg-foreground/[0.06] hover:text-foreground dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white",
                    )}
                  >
                    <item.icon className="size-4.5" />
                    <span className="hidden lg:inline">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Actions — утсан дээр доод navbar навигацийг хариуцдаг тул
                sidebar/hamburger хэрэггүй. Нэвтэрсэн үед профайл зөвхөн
                таблет+ дээр гарч, дарахад шууд /profile руу шилжинэ. */}
            <div className="ml-auto flex items-center gap-2">
              {loading ? (
                <div className="hidden size-8 animate-pulse rounded-full bg-foreground/10 md:block" />
              ) : user ? (
                <div className="hidden md:block">
                  <UserMenu />
                </div>
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
          </LiquidGlass>
        </div>
      </div>
    </header>
  );
}

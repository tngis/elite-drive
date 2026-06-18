"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User } from "lucide-react";
import { LiquidGlass } from "@/components/shared/liquid-glass";
import { useAuth } from "@/features/auth/auth-context";
import { mainNav } from "./nav-config";
import { cn } from "@/lib/utils";

// Утсан дээрх хөвдөг шилэн bottom navbar (Instagram маягийн).
// Үндсэн зүйлс header-тэй ижил mainNav-аас гарна.
export function MobileBottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  const isActive = (href: string, exact = false) =>
    exact || href === "/" ? pathname === href : pathname.startsWith(href);

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden">
      <LiquidGlass
        radius={32}
        bevel={14}
        scale={20}
        blur={9}
        className="w-full max-w-sm"
        contentClassName="flex items-center gap-1 p-1"
      >
        {mainNav.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            active={isActive(item.href, item.exact)}
          />
        ))}
        <NavItem
          href={user ? "/profile" : "/login"}
          icon={User}
          label="Профайл"
          active={isActive("/profile")}
          avatar={user ? user.name.slice(0, 1).toUpperCase() : undefined}
          avatarUrl={user?.avatarUrl}
        />
      </LiquidGlass>
    </div>
  );
}

function NavItem({
  href,
  icon: Icon,
  label,
  active,
  avatar,
  avatarUrl,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  active: boolean;
  avatar?: string;
  avatarUrl?: string | null;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="flex flex-1 items-center justify-center"
    >
      <span
        className={cn(
          "flex h-11 w-full items-center justify-center rounded-full transition-colors",
          active
            ? "bg-foreground/10 text-foreground"
            : "text-foreground/45 hover:text-foreground",
        )}
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt={label}
            className={cn(
              "size-7 rounded-full object-cover",
              active && "ring-2 ring-foreground/30",
            )}
          />
        ) : avatar ? (
          <span className="grid size-7 place-items-center rounded-full bg-linear-to-br from-brand to-orange-600 text-xs font-semibold text-white">
            {avatar}
          </span>
        ) : (
          <Icon className="size-6" />
        )}
      </span>
    </Link>
  );
}
